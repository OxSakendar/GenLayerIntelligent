# { "Depends": "py-genlayer:test" }

from genlayer import *
import json

STATE_AWAITING_DEPOSIT = "AWAITING_DEPOSIT"
STATE_FUNDED           = "FUNDED"
STATE_WORK_COMPLETED   = "WORK_COMPLETED"
STATE_DISPUTED         = "DISPUTED"
STATE_RELEASED         = "RELEASED"
STATE_RESOLVED_BUYER   = "RESOLVED_BUYER"
STATE_RESOLVED_SELLER  = "RESOLVED_SELLER"
STATE_REFUNDED         = "REFUNDED"


class SmartEscrow(Contract):
    owner: Address
    buyer: Address
    seller: Address
    amount: u256
    state: str
    job_description: str
    work_submission: str
    buyer_evidence: str
    seller_evidence: str
    dispute_ruling: str

    def __init__(self, buyer: Address, seller: Address, job_description: str) -> None:
        if buyer == seller:
            raise Exception("Buyer and seller cannot be the same address")
        if not job_description.strip():
            raise Exception("Job description cannot be empty")

        self.owner = message.sender_address
        self.buyer = buyer
        self.seller = seller
        self.amount = u256(0)
        self.state = STATE_AWAITING_DEPOSIT
        self.job_description = job_description
        self.work_submission = ""
        self.buyer_evidence = ""
        self.seller_evidence = ""
        self.dispute_ruling = ""

    # ─────────────────────────────────────────────────────────────────────────
    # Write functions — lifecycle
    # ─────────────────────────────────────────────────────────────────────────

    @public.write.payable
    def deposit(self) -> None:
        if message.sender_address != self.buyer:
            raise Exception("Access denied: caller is not the buyer")
        if self.state != STATE_AWAITING_DEPOSIT:
            raise Exception("Invalid state for deposit")

        value = message.value
        if value == u256(0):
            raise Exception("Deposit amount must be greater than zero")

        self.amount = value
        self.state = STATE_FUNDED

    @public.write
    def mark_completed(self, submission_details: str) -> None:
        if message.sender_address != self.seller:
            raise Exception("Access denied: caller is not the seller")
        if self.state != STATE_FUNDED:
            raise Exception("Invalid state for mark_completed")
        if not submission_details.strip():
            raise Exception("Submission details cannot be empty")

        self.work_submission = submission_details
        self.state = STATE_WORK_COMPLETED

    @public.write
    def approve_payment(self) -> None:
        if message.sender_address != self.buyer:
            raise Exception("Access denied: caller is not the buyer")
        if self.state != STATE_WORK_COMPLETED:
            raise Exception("Invalid state for approve_payment")

        release_amount = self.amount
        self.state = STATE_RELEASED
        self.amount = u256(0)

        emit_transfer(self.seller, release_amount)

    @public.write
    def open_dispute(self, buyer_evidence: str) -> None:
        if message.sender_address != self.buyer:
            raise Exception("Access denied: caller is not the buyer")
        if self.state not in (STATE_FUNDED, STATE_WORK_COMPLETED):
            raise Exception("Invalid state for open_dispute")
        if not buyer_evidence.strip():
            raise Exception("Buyer evidence cannot be empty")

        self.buyer_evidence = buyer_evidence
        self.state = STATE_DISPUTED

    @public.write
    def submit_seller_evidence(self, seller_evidence: str) -> None:
        if message.sender_address != self.seller:
            raise Exception("Access denied: caller is not the seller")
        if self.state != STATE_DISPUTED:
            raise Exception("Invalid state for submit_seller_evidence")
        if not seller_evidence.strip():
            raise Exception("Seller evidence cannot be empty")

        self.seller_evidence = seller_evidence

    @public.write
    def resolve_dispute_with_ai(self) -> None:
        caller = message.sender_address
        if caller not in (self.buyer, self.seller, self.owner):
            raise Exception("Only buyer, seller, or owner can trigger AI resolution")
        if self.state != STATE_DISPUTED:
            raise Exception("Invalid state for resolve_dispute_with_ai")

        job_desc = self.job_description
        work_sub = self.work_submission
        b_evid = self.buyer_evidence
        s_evid = self.seller_evidence

        prompt = f"""You are an impartial dispute arbitrator for a smart escrow contract.
Evaluate the following escrow dispute and provide a ruling.

=== JOB DESCRIPTION ===
{job_desc}

=== SELLER WORK SUBMISSION ===
{work_sub if work_sub else "(No submission provided)"}

=== BUYER EVIDENCE ===
{b_evid}

=== SELLER REBUTTAL ===
{s_evid if s_evid else "(No rebuttal provided)"}

=== YOUR TASK ===
Determine whether:
  - Seller fulfilled the job description -> rule in favour of SELLER
  - Seller failed to deliver or delivered substandard work -> rule in favour of BUYER

Respond ONLY with valid JSON:
{{"ruling": "BUYER" or "SELLER", "reasoning": "one-paragraph explanation"}}
"""

        ruling_json: str = eq_principle.prompt_non_comparative(
            prompt,
            task="Analyse dispute evidence and return JSON with 'ruling' (BUYER or SELLER) and 'reasoning'.",
            criteria="""
                The response is a valid JSON object.
                The 'ruling' field is exactly 'BUYER' or 'SELLER'.
                The 'reasoning' field is a non-empty string explaining the decision.
                The decision is logically consistent with the provided evidence.
            """,
        )

        self.dispute_ruling = ruling_json

    @public.write
    def execute_ruling(self) -> None:
        if message.sender_address != self.owner:
            raise Exception("Access denied: caller is not the contract owner")
        if self.state != STATE_DISPUTED:
            raise Exception("Invalid state for execute_ruling")
        if not self.dispute_ruling or not self.dispute_ruling.strip():
            raise Exception("No valid stored consensus ruling found. Run resolve_dispute_with_ai first.")

        ruling = ""
        try:
            ruling_data = json.loads(self.dispute_ruling)
            if isinstance(ruling_data, dict):
                ruling = str(ruling_data.get("ruling", "")).strip().upper()
            else:
                ruling = str(ruling_data).strip().upper()
        except Exception:
            ruling = str(self.dispute_ruling).strip().upper()

        if ruling not in ("BUYER", "SELLER"):
            raise Exception("No valid stored consensus ruling found ('BUYER' or 'SELLER').")

        release_amount = self.amount
        self.amount = u256(0)

        if ruling == "BUYER":
            self.state = STATE_RESOLVED_BUYER
            recipient = self.buyer
        else:
            self.state = STATE_RESOLVED_SELLER
            recipient = self.seller

        emit_transfer(recipient, release_amount)

    @public.write
    def refund_buyer(self) -> None:
        if message.sender_address != self.owner:
            raise Exception("Access denied: caller is not the contract owner")
        if self.state not in (STATE_FUNDED, STATE_WORK_COMPLETED):
            raise Exception("Invalid state for refund_buyer")

        refund_amount = self.amount
        self.amount = u256(0)
        self.state = STATE_REFUNDED

        emit_transfer(self.buyer, refund_amount)

    # ─────────────────────────────────────────────────────────────────────────
    # View functions
    # ─────────────────────────────────────────────────────────────────────────

    @public.view
    def get_state(self) -> str:
        return self.state

    @public.view
    def get_amount(self) -> str:
        return str(self.amount)

    @public.view
    def get_parties(self) -> dict:
        return {
            "owner": str(self.owner),
            "buyer": str(self.buyer),
            "seller": str(self.seller),
        }

    @public.view
    def get_job_details(self) -> dict:
        return {
            "job_description": self.job_description,
            "work_submission": self.work_submission,
        }

    @public.view
    def get_dispute_info(self) -> dict:
        return {
            "state": self.state,
            "buyer_evidence": self.buyer_evidence,
            "seller_evidence": self.seller_evidence,
            "ai_ruling": self.dispute_ruling,
        }

    @public.view
    def get_full_status(self) -> dict:
        return {
            "state": self.state,
            "amount_wei": str(self.amount),
            "owner": str(self.owner),
            "buyer": str(self.buyer),
            "seller": str(self.seller),
            "job_description": self.job_description,
            "work_submission": self.work_submission,
            "buyer_evidence": self.buyer_evidence,
            "seller_evidence": self.seller_evidence,
            "dispute_ruling": self.dispute_ruling,
        }

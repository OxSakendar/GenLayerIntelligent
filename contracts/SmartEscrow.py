# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
SmartEscrow — A GenLayer Intelligent Contract
==============================================
Purpose: Hold funds in escrow between a buyer and seller, with
         AI-powered dispute resolution via GenLayer's LLM integration.

Roles:
  - owner  : deployer; executes final dispute outcomes
  - buyer  : deposits funds, approves payment, or opens disputes
  - seller : marks work as completed

Lifecycle (happy path):
  AWAITING_DEPOSIT → FUNDED → WORK_COMPLETED → RELEASED

Dispute path:
  FUNDED / WORK_COMPLETED → DISPUTED → RESOLVED_BUYER or RESOLVED_SELLER

Security:
  - All state-mutating functions enforce role-based access control.
  - Funds are locked until an explicit state transition authorizes release.
  - Re-entrancy risk is mitigated by updating state BEFORE emitting transfers.
  - LLM calls are wrapped inside gl.eq_principle to achieve validator consensus.
"""

from genlayer import *
import json
import typing


# ─────────────────────────────────────────────
# Escrow state constants (stored as plain str)
# ─────────────────────────────────────────────
STATE_AWAITING_DEPOSIT = "AWAITING_DEPOSIT"
STATE_FUNDED           = "FUNDED"
STATE_WORK_COMPLETED   = "WORK_COMPLETED"
STATE_DISPUTED         = "DISPUTED"
STATE_RELEASED         = "RELEASED"
STATE_RESOLVED_BUYER   = "RESOLVED_BUYER"   # dispute resolved in buyer's favour
STATE_RESOLVED_SELLER  = "RESOLVED_SELLER"  # dispute resolved in seller's favour
STATE_REFUNDED         = "REFUNDED"


class SmartEscrow(gl.Contract):
    """
    Intelligent Escrow Contract on GenLayer.

    State variables (all are persisted on-chain):
      owner           — deployer address (administrator / arbiter)
      buyer           — address that deposits funds and approves work
      seller          — address that marks work as completed
      amount          — total amount held in escrow (u256, in wei)
      state           — current lifecycle state (string constant above)
      job_description — description of the work to be done
      work_submission — seller's submission / proof of completion
      buyer_evidence  — buyer's evidence in a dispute
      seller_evidence — seller's evidence in a dispute
      dispute_ruling  — LLM-generated ruling text (informational)
      events_log      — chronological list of event strings
    """

    # ── Persistent state (type-annotated = stored on-chain) ──────────────────
    owner:           Address
    buyer:           Address
    seller:          Address
    amount:          u256
    state:           str
    job_description: str
    work_submission: str
    buyer_evidence:  str
    seller_evidence: str
    dispute_ruling:  str
    events_log:      DynArray[str]

    # ─────────────────────────────────────────────────────────────────────────
    # Constructor
    # ─────────────────────────────────────────────────────────────────────────

    def __init__(self, buyer: Address, seller: Address, job_description: str) -> None:
        """
        Deploy a new SmartEscrow instance.

        Args:
            buyer           : address of the party commissioning the work.
            seller          : address of the party performing the work.
            job_description : plain-text description of the deliverable(s).

        The deployer automatically becomes the contract owner / arbiter.
        """
        if buyer == seller:
            raise Exception("Buyer and seller cannot be the same address")
        if not job_description.strip():
            raise Exception("Job description cannot be empty")

        self.owner           = gl.message.sender_address
        self.buyer           = buyer
        self.seller          = seller
        self.amount          = u256(0)
        self.state           = STATE_AWAITING_DEPOSIT
        self.job_description = job_description
        self.work_submission = ""
        self.buyer_evidence  = ""
        self.seller_evidence = ""
        self.dispute_ruling  = ""

        self._emit_event(
            "EscrowCreated",
            {
                "owner":  str(self.owner),
                "buyer":  str(buyer),
                "seller": str(seller),
                "job":    str(job_description),
            },
        )

    # ─────────────────────────────────────────────────────────────────────────
    # Internal helpers
    # ─────────────────────────────────────────────────────────────────────────

    def _emit_event(self, name: str, data: dict) -> None:
        """Append a structured event string to the on-chain log."""
        entry = json.dumps({"event": name, "data": data})
        self.events_log.append(entry)

    def _only_buyer(self) -> None:
        if gl.message.sender_address != self.buyer:
            raise Exception("Access denied: caller is not the buyer")

    def _only_seller(self) -> None:
        if gl.message.sender_address != self.seller:
            raise Exception("Access denied: caller is not the seller")

    def _only_owner(self) -> None:
        if gl.message.sender_address != self.owner:
            raise Exception("Access denied: caller is not the contract owner")

    def _require_state(self, *allowed: str) -> None:
        if self.state not in allowed:
            raise Exception(
                f"Invalid state for this action. Current: {self.state}. "
                f"Allowed: {list(allowed)}"
            )

    # ─────────────────────────────────────────────────────────────────────────
    # Write functions — happy-path lifecycle
    # ─────────────────────────────────────────────────────────────────────────

    @gl.public.write.payable
    def deposit(self) -> None:
        """
        Buyer deposits funds into the escrow.

        - Caller must be the buyer.
        - Escrow must be in AWAITING_DEPOSIT state.
        - A non-zero value must be sent with the transaction.

        The contract's balance increases by gl.message.value (GEN wei).
        State transitions: AWAITING_DEPOSIT → FUNDED.
        """
        self._only_buyer()
        self._require_state(STATE_AWAITING_DEPOSIT)

        value = gl.message.value
        if value == u256(0):
            raise Exception("Deposit amount must be greater than zero")

        self.amount = value
        self.state  = STATE_FUNDED

        self._emit_event(
            "Deposited",
            {"buyer": str(self.buyer), "amount": str(value)},
        )

    @gl.public.write
    def mark_completed(self, submission_details: str) -> None:
        """
        Seller signals that the agreed work has been delivered.

        Args:
            submission_details: Description / proof of the completed work
                                (e.g., link to deliverable, summary, etc.).

        - Caller must be the seller.
        - Escrow must be in FUNDED state.
        State transitions: FUNDED → WORK_COMPLETED.
        """
        self._only_seller()
        self._require_state(STATE_FUNDED)

        if not submission_details.strip():
            raise Exception("Submission details cannot be empty")

        self.work_submission = submission_details
        self.state           = STATE_WORK_COMPLETED

        self._emit_event(
            "WorkCompleted",
            {
                "seller":     str(self.seller),
                "submission": submission_details,
            },
        )

    @gl.public.write
    def approve_payment(self) -> None:
        """
        Buyer approves the seller's work and releases the escrowed funds.

        - Caller must be the buyer.
        - Escrow must be in WORK_COMPLETED state.
        State transitions: WORK_COMPLETED → RELEASED.

        Funds are transferred to the seller via emit_transfer AFTER
        updating state (guards against re-entrancy).
        """
        self._only_buyer()
        self._require_state(STATE_WORK_COMPLETED)

        release_amount = self.amount

        # Update state BEFORE transferring to prevent re-entrancy issues.
        self.state  = STATE_RELEASED
        self.amount = u256(0)

        self._emit_event(
            "PaymentApproved",
            {
                "buyer":   str(self.buyer),
                "seller":  str(self.seller),
                "amount":  str(release_amount),
            },
        )

        # Transfer escrowed funds to the seller.
        emit_transfer(self.seller, release_amount)

        self._emit_event(
            "FundsDisbursed",
            {"recipient": str(self.seller), "amount": str(release_amount)},
        )

    @gl.public.write
    def open_dispute(self, buyer_evidence: str) -> None:
        """
        Buyer opens a dispute if dissatisfied with the seller's submission.

        Args:
            buyer_evidence: Buyer's explanation / evidence of non-delivery
                            (e.g., specification list, comparison, logs).

        - Caller must be the buyer.
        - Escrow must be in FUNDED or WORK_COMPLETED state.
        State transitions: FUNDED / WORK_COMPLETED → DISPUTED.
        """
        self._only_buyer()
        self._require_state(STATE_FUNDED, STATE_WORK_COMPLETED)

        if not buyer_evidence.strip():
            raise Exception("Buyer evidence cannot be empty when opening a dispute")

        self.buyer_evidence = buyer_evidence
        self.state          = STATE_DISPUTED

        self._emit_event(
            "DisputeOpened",
            {
                "buyer":    str(self.buyer),
                "evidence": buyer_evidence,
            },
        )

    @gl.public.write
    def submit_seller_evidence(self, seller_evidence: str) -> None:
        """
        Seller submits rebuttal / evidence during an active dispute.

        Args:
            seller_evidence: Seller's counter-evidence or rebuttal.

        - Caller must be the seller.
        - Escrow must be in DISPUTED state.
        """
        self._only_seller()
        self._require_state(STATE_DISPUTED)

        if not seller_evidence.strip():
            raise Exception("Seller evidence cannot be empty")

        self.seller_evidence = seller_evidence

        self._emit_event(
            "SellerEvidenceSubmitted",
            {
                "seller":   str(self.seller),
                "evidence": seller_evidence,
            },
        )

    # ─────────────────────────────────────────────────────────────────────────
    # AI-powered dispute resolution (non-deterministic — uses eq_principle)
    # ─────────────────────────────────────────────────────────────────────────

    @gl.public.write
    def resolve_dispute_with_ai(self) -> None:
        """
        AI-driven dispute resolution using GenLayer's LLM + Equivalence Principle.

        Any party (buyer, seller, or owner) may call this once both sides have
        had the opportunity to submit evidence. The LLM evaluates:
          1. The original job description.
          2. The seller's work submission.
          3. The buyer's evidence of non-delivery.
          4. The seller's rebuttal (if provided).

        The LLM returns a JSON verdict:
          { "ruling": "BUYER" | "SELLER", "reasoning": "<explanation>" }

        - Escrow must be in DISPUTED state.
        - Caller must be buyer, seller, or owner.
        - The dispute_ruling field is stored for transparency.
        - The owner must still execute the final payout with execute_ruling().

        ⚠️  The LLM call is isolated inside gl.eq_principle.prompt_non_comparative
            so that every validator independently verifies the ruling quality,
            achieving on-chain consensus without requiring identical LLM outputs.
        """
        caller = gl.message.sender_address
        if caller not in (self.buyer, self.seller, self.owner):
            raise Exception("Only buyer, seller, or owner can trigger AI resolution")

        self._require_state(STATE_DISPUTED)

        # ── Capture state into local variables (required by GenLayer SDK;
        #    contract storage is NOT accessible inside non-deterministic blocks).
        job_desc        = self.job_description
        work_submission = self.work_submission
        buyer_evidence  = self.buyer_evidence
        seller_evidence = self.seller_evidence

        def build_prompt() -> str:
            prompt = f"""You are an impartial dispute arbitrator for a smart escrow contract.
Evaluate the following escrow dispute and provide a ruling.

=== JOB DESCRIPTION ===
{job_desc}

=== SELLER'S WORK SUBMISSION ===
{work_submission if work_submission else "(No submission provided — work may not have been delivered)"}

=== BUYER'S EVIDENCE / COMPLAINT ===
{buyer_evidence}

=== SELLER'S REBUTTAL / EVIDENCE ===
{seller_evidence if seller_evidence else "(No rebuttal provided)"}

=== YOUR TASK ===
Based solely on the information above, determine whether:
  - The seller fulfilled the agreed-upon job description → rule in favour of SELLER
  - The seller failed to deliver or delivered substandard work → rule in favour of BUYER

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{{"ruling": "BUYER" or "SELLER", "reasoning": "concise one-paragraph explanation"}}
"""
            return prompt

        # ── AI call wrapped in eq_principle for on-chain consensus ────────────
        ruling_json: str = gl.eq_principle.prompt_non_comparative(
            build_prompt,
            task=(
                "Analyse the escrow dispute evidence and return a JSON ruling "
                "with fields 'ruling' (BUYER or SELLER) and 'reasoning' (explanation)."
            ),
            criteria="""
                The response is a valid JSON object.
                The 'ruling' field is exactly 'BUYER' or 'SELLER' (uppercase).
                The 'reasoning' field is a non-empty string explaining the decision.
                The decision is logically consistent with the provided evidence.
                The arbitrator remains neutral and does not invent facts not in evidence.
            """,
        )

        # ── Persist the AI ruling ─────────────────────────────────────────────
        self.dispute_ruling = ruling_json

        self._emit_event(
            "AIRulingGenerated",
            {
                "caller":  str(caller),
                "ruling":  ruling_json,
            },
        )

    # ─────────────────────────────────────────────────────────────────────────
    # Owner: execute final dispute outcome
    # ─────────────────────────────────────────────────────────────────────────

    @gl.public.write
    def execute_ruling(self) -> None:
        """
        Owner executes the final resolution of a dispute.

        The settlement winner is bound strictly to the stored consensus ruling
        (self.dispute_ruling) generated by GenLayer AI consensus.

        - Caller must be the owner.
        - Escrow must be in DISPUTED state.
        - Requires a valid stored dispute_ruling generated by resolve_dispute_with_ai.
        - Settlement cannot occur without a valid stored consensus ruling.

        Funds are transferred to the winning party AFTER state is updated.
        State transitions: DISPUTED → RESOLVED_BUYER or RESOLVED_SELLER.
        """
        self._only_owner()
        self._require_state(STATE_DISPUTED)

        if not self.dispute_ruling or not self.dispute_ruling.strip():
            raise Exception("No valid stored consensus ruling found ('BUYER' or 'SELLER'). Run resolve_dispute_with_ai first.")

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
            raise Exception("No valid stored consensus ruling found ('BUYER' or 'SELLER'). Run resolve_dispute_with_ai first.")

        release_amount = self.amount

        # Update state and amount BEFORE transferring (re-entrancy guard).
        self.amount = u256(0)

        if ruling == "BUYER":
            self.state    = STATE_RESOLVED_BUYER
            recipient     = self.buyer
        else:
            self.state    = STATE_RESOLVED_SELLER
            recipient     = self.seller

        self._emit_event(
            "DisputeResolved",
            {
                "owner":       str(self.owner),
                "ruling":      ruling,
                "recipient":   str(recipient),
                "amount":      str(release_amount),
                "ai_analysis": self.dispute_ruling,
            },
        )

        emit_transfer(recipient, release_amount)

        self._emit_event(
            "FundsDisbursed",
            {"recipient": str(recipient), "amount": str(release_amount)},
        )

    @gl.public.write
    def refund_buyer(self) -> None:
        """
        Owner can refund the buyer at any time when funds are locked
        (FUNDED or WORK_COMPLETED states), e.g. if the seller disappears.

        - Caller must be the owner.
        - Escrow must be in FUNDED or WORK_COMPLETED state.
        State transitions: FUNDED / WORK_COMPLETED → REFUNDED.
        """
        self._only_owner()
        self._require_state(STATE_FUNDED, STATE_WORK_COMPLETED)

        refund_amount = self.amount
        self.amount   = u256(0)
        self.state    = STATE_REFUNDED

        self._emit_event(
            "BuyerRefunded",
            {
                "owner":  str(self.owner),
                "buyer":  str(self.buyer),
                "amount": str(refund_amount),
            },
        )

        emit_transfer(self.buyer, refund_amount)

    # ─────────────────────────────────────────────────────────────────────────
    # View functions (read-only — no state changes)
    # ─────────────────────────────────────────────────────────────────────────

    @gl.public.view
    def get_state(self) -> str:
        """Return the current lifecycle state of the escrow."""
        return self.state

    @gl.public.view
    def get_amount(self) -> str:
        """Return the amount currently held in escrow (as a string to avoid overflow)."""
        return str(self.amount)

    @gl.public.view
    def get_parties(self) -> dict:
        """Return the key addresses involved in this escrow."""
        return {
            "owner":  str(self.owner),
            "buyer":  str(self.buyer),
            "seller": str(self.seller),
        }

    @gl.public.view
    def get_job_details(self) -> dict:
        """Return the job description and seller's work submission."""
        return {
            "job_description": self.job_description,
            "work_submission": self.work_submission,
        }

    @gl.public.view
    def get_dispute_info(self) -> dict:
        """Return all dispute-related data."""
        return {
            "state":           self.state,
            "buyer_evidence":  self.buyer_evidence,
            "seller_evidence": self.seller_evidence,
            "ai_ruling":       self.dispute_ruling,
        }

    @gl.public.view
    def get_events(self) -> list:
        """Return the full chronological event log as a list of JSON strings."""
        return list(self.events_log)

    @gl.public.view
    def get_full_status(self) -> dict:
        """Return a comprehensive snapshot of the contract's current status."""
        return {
            "state":           self.state,
            "amount_wei":      str(self.amount),
            "owner":           str(self.owner),
            "buyer":           str(self.buyer),
            "seller":          str(self.seller),
            "job_description": self.job_description,
            "work_submission": self.work_submission,
            "buyer_evidence":  self.buyer_evidence,
            "seller_evidence": self.seller_evidence,
            "dispute_ruling":  self.dispute_ruling,
            "event_count":     len(self.events_log),
        }

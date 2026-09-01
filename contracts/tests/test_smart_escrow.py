"""
Tests for SmartEscrow Intelligent Contract
==========================================
Uses GenLayer's direct-VM (gltest / genvm-test) runner to simulate
the full escrow lifecycle, including the AI-powered dispute resolution path.

Run with:
    pytest tests/test_smart_escrow.py -v

Requirements:
    pip install genlayer-test  (or the equivalent package for your SDK version)
"""

import pytest
import json


# ─────────────────────────────────────────────────────────────────────────────
# Try to import gltest; skip all tests gracefully if not installed.
# ─────────────────────────────────────────────────────────────────────────────
try:
    from gltest import get_contract_factory
    from gltest.assertions import tx_execution_succeeded, tx_execution_failed
    GLTEST_AVAILABLE = True
except ImportError:
    GLTEST_AVAILABLE = False

pytestmark = pytest.mark.skipif(
    not GLTEST_AVAILABLE,
    reason="gltest SDK not installed. Run: pip install genlayer-test"
)


# ─────────────────────────────────────────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────────────────────────────────────────

CONTRACT_PATH = "contracts/SmartEscrow.py"

# Simulated test addresses
OWNER_ADDRESS  = "0x1111111111111111111111111111111111111111"
BUYER_ADDRESS  = "0x2222222222222222222222222222222222222222"
SELLER_ADDRESS = "0x3333333333333333333333333333333333333333"
OTHER_ADDRESS  = "0x4444444444444444444444444444444444444444"

ONE_GEN_WEI = 10 ** 18  # 1 GEN = 10^18 wei


@pytest.fixture(scope="module")
def factory():
    """Load the SmartEscrow contract factory once per test module."""
    return get_contract_factory(CONTRACT_PATH)


@pytest.fixture
def escrow(factory):
    """
    Deploy a fresh SmartEscrow for each test.
    The owner is OWNER_ADDRESS, buyer is BUYER_ADDRESS, seller is SELLER_ADDRESS.
    """
    contract = factory.deploy(
        args=[BUYER_ADDRESS, SELLER_ADDRESS, "Build a REST API with authentication"],
        account=OWNER_ADDRESS,
    )
    return contract


# ─────────────────────────────────────────────────────────────────────────────
# 1. Deployment & initial state
# ─────────────────────────────────────────────────────────────────────────────

class TestDeployment:
    def test_initial_state_is_awaiting_deposit(self, escrow):
        state = escrow.get_state()
        assert state == "AWAITING_DEPOSIT"

    def test_initial_amount_is_zero(self, escrow):
        amount = escrow.get_amount()
        assert amount == "0"

    def test_parties_are_set_correctly(self, escrow):
        parties = escrow.get_parties()
        assert parties["owner"].lower()  == OWNER_ADDRESS.lower()
        assert parties["buyer"].lower()  == BUYER_ADDRESS.lower()
        assert parties["seller"].lower() == SELLER_ADDRESS.lower()

    def test_job_description_stored(self, escrow):
        details = escrow.get_job_details()
        assert "REST API" in details["job_description"]

    def test_deploy_fails_if_buyer_equals_seller(self, factory):
        with pytest.raises(Exception):
            factory.deploy(
                args=[BUYER_ADDRESS, BUYER_ADDRESS, "Some job"],
                account=OWNER_ADDRESS,
            )

    def test_deploy_fails_if_empty_description(self, factory):
        with pytest.raises(Exception):
            factory.deploy(
                args=[BUYER_ADDRESS, SELLER_ADDRESS, "   "],
                account=OWNER_ADDRESS,
            )

    def test_creation_event_logged(self, escrow):
        events = escrow.get_events()
        assert len(events) >= 1
        first_event = json.loads(events[0])
        assert first_event["event"] == "EscrowCreated"


# ─────────────────────────────────────────────────────────────────────────────
# 2. Deposit
# ─────────────────────────────────────────────────────────────────────────────

class TestDeposit:
    def test_buyer_can_deposit(self, escrow):
        receipt = escrow.deposit(
            account=BUYER_ADDRESS,
            value=ONE_GEN_WEI,
        )
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() == "FUNDED"
        assert escrow.get_amount() == str(ONE_GEN_WEI)

    def test_deposit_emits_event(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        events = [json.loads(e) for e in escrow.get_events()]
        names  = [ev["event"] for ev in events]
        assert "Deposited" in names

    def test_non_buyer_cannot_deposit(self, escrow):
        receipt = escrow.deposit(account=OTHER_ADDRESS, value=ONE_GEN_WEI)
        assert tx_execution_failed(receipt)

    def test_zero_value_deposit_rejected(self, escrow):
        receipt = escrow.deposit(account=BUYER_ADDRESS, value=0)
        assert tx_execution_failed(receipt)

    def test_double_deposit_rejected(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        receipt = escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        assert tx_execution_failed(receipt)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Work completion
# ─────────────────────────────────────────────────────────────────────────────

class TestMarkCompleted:
    @pytest.fixture(autouse=True)
    def fund_escrow(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)

    def test_seller_can_mark_completed(self, escrow):
        receipt = escrow.mark_completed(
            args=["API delivered at https://github.com/example/api"],
            account=SELLER_ADDRESS,
        )
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() == "WORK_COMPLETED"

    def test_work_submission_stored(self, escrow):
        submission = "API delivered at https://github.com/example/api"
        escrow.mark_completed(args=[submission], account=SELLER_ADDRESS)
        details = escrow.get_job_details()
        assert details["work_submission"] == submission

    def test_non_seller_cannot_mark_completed(self, escrow):
        receipt = escrow.mark_completed(
            args=["Fake submission"],
            account=BUYER_ADDRESS,
        )
        assert tx_execution_failed(receipt)

    def test_empty_submission_rejected(self, escrow):
        receipt = escrow.mark_completed(args=["   "], account=SELLER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_mark_completed_without_deposit_fails(self, factory):
        # Fresh escrow without funding
        fresh = factory.deploy(
            args=[BUYER_ADDRESS, SELLER_ADDRESS, "Some work"],
            account=OWNER_ADDRESS,
        )
        receipt = fresh.mark_completed(args=["Done"], account=SELLER_ADDRESS)
        assert tx_execution_failed(receipt)


# ─────────────────────────────────────────────────────────────────────────────
# 4. Approve payment (happy path)
# ─────────────────────────────────────────────────────────────────────────────

class TestApprovePayment:
    @pytest.fixture(autouse=True)
    def setup(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        escrow.mark_completed(
            args=["All deliverables submitted"],
            account=SELLER_ADDRESS,
        )

    def test_buyer_can_approve_payment(self, escrow):
        receipt = escrow.approve_payment(account=BUYER_ADDRESS)
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() == "RELEASED"

    def test_amount_cleared_after_release(self, escrow):
        escrow.approve_payment(account=BUYER_ADDRESS)
        assert escrow.get_amount() == "0"

    def test_funds_disbursed_event_emitted(self, escrow):
        escrow.approve_payment(account=BUYER_ADDRESS)
        events = [json.loads(e) for e in escrow.get_events()]
        names  = [ev["event"] for ev in events]
        assert "FundsDisbursed" in names

    def test_non_buyer_cannot_approve(self, escrow):
        receipt = escrow.approve_payment(account=SELLER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_cannot_approve_without_work_completed(self, factory):
        fresh = factory.deploy(
            args=[BUYER_ADDRESS, SELLER_ADDRESS, "Some work"],
            account=OWNER_ADDRESS,
        )
        fresh.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        # State is FUNDED, not WORK_COMPLETED — should fail
        receipt = fresh.approve_payment(account=BUYER_ADDRESS)
        assert tx_execution_failed(receipt)


# ─────────────────────────────────────────────────────────────────────────────
# 5. Dispute flow
# ─────────────────────────────────────────────────────────────────────────────

class TestDisputeFlow:
    @pytest.fixture(autouse=True)
    def fund_and_submit(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        escrow.mark_completed(
            args=["I built the API. See PR #42."],
            account=SELLER_ADDRESS,
        )

    def test_buyer_can_open_dispute(self, escrow):
        receipt = escrow.open_dispute(
            args=["The API crashes on every request and has no authentication."],
            account=BUYER_ADDRESS,
        )
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() == "DISPUTED"

    def test_dispute_evidence_stored(self, escrow):
        evidence = "The API crashes on every request."
        escrow.open_dispute(args=[evidence], account=BUYER_ADDRESS)
        info = escrow.get_dispute_info()
        assert info["buyer_evidence"] == evidence

    def test_non_buyer_cannot_open_dispute(self, escrow):
        receipt = escrow.open_dispute(
            args=["Fake complaint"],
            account=SELLER_ADDRESS,
        )
        assert tx_execution_failed(receipt)

    def test_empty_evidence_rejected(self, escrow):
        receipt = escrow.open_dispute(args=["  "], account=BUYER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_seller_can_submit_evidence(self, escrow):
        escrow.open_dispute(
            args=["The API never worked."],
            account=BUYER_ADDRESS,
        )
        receipt = escrow.submit_seller_evidence(
            args=["Here is a video demo showing all endpoints working: https://..."],
            account=SELLER_ADDRESS,
        )
        assert tx_execution_succeeded(receipt)
        info = escrow.get_dispute_info()
        assert "video demo" in info["seller_evidence"]

    def test_seller_evidence_without_dispute_fails(self, escrow):
        # State is WORK_COMPLETED, not DISPUTED
        receipt = escrow.submit_seller_evidence(
            args=["Preemptive evidence"],
            account=SELLER_ADDRESS,
        )
        assert tx_execution_failed(receipt)


# ─────────────────────────────────────────────────────────────────────────────
# 6. AI dispute resolution
# ─────────────────────────────────────────────────────────────────────────────

class TestAIDisputeResolution:
    @pytest.fixture(autouse=True)
    def setup_dispute(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        escrow.mark_completed(
            args=["REST API with JWT auth delivered."],
            account=SELLER_ADDRESS,
        )
        escrow.open_dispute(
            args=["The API has no authentication whatsoever. Requirements not met."],
            account=BUYER_ADDRESS,
        )
        escrow.submit_seller_evidence(
            args=["JWT is implemented in /auth/login. Buyer did not test it properly."],
            account=SELLER_ADDRESS,
        )

    def test_ai_resolution_can_be_triggered(self, escrow):
        receipt = escrow.resolve_dispute_with_ai(account=BUYER_ADDRESS)
        assert tx_execution_succeeded(receipt)

    def test_ai_ruling_is_stored(self, escrow):
        escrow.resolve_dispute_with_ai(account=OWNER_ADDRESS)
        info = escrow.get_dispute_info()
        ruling_text = info["ai_ruling"]
        assert ruling_text  # non-empty
        # Should be valid JSON
        ruling = json.loads(ruling_text)
        assert ruling["ruling"] in ("BUYER", "SELLER")
        assert ruling["reasoning"]

    def test_ai_ruling_event_emitted(self, escrow):
        escrow.resolve_dispute_with_ai(account=OWNER_ADDRESS)
        events = [json.loads(e) for e in escrow.get_events()]
        names  = [ev["event"] for ev in events]
        assert "AIRulingGenerated" in names

    def test_non_party_cannot_trigger_ai(self, escrow):
        receipt = escrow.resolve_dispute_with_ai(account=OTHER_ADDRESS)
        assert tx_execution_failed(receipt)


# ─────────────────────────────────────────────────────────────────────────────
# 7. Execute ruling
# ─────────────────────────────────────────────────────────────────────────────

class TestExecuteRuling:
    @pytest.fixture(autouse=True)
    def setup_dispute(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        escrow.open_dispute(
            args=["Work was never started."],
            account=BUYER_ADDRESS,
        )

    def test_settlement_fails_without_stored_consensus_ruling(self, escrow):
        """Proves settlement cannot occur when resolve_dispute_with_ai has not been executed."""
        receipt = escrow.execute_ruling(account=OWNER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_caller_selected_winner_param_ignored_or_rejected(self, escrow):
        """Proves caller cannot pass a winner parameter to bypass stored consensus ruling."""
        # Calling execute_ruling before AI resolution fails even if caller attempts to pass a winner arg
        receipt = escrow.execute_ruling(args=["BUYER"], account=OWNER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_owner_executes_stored_consensus_ruling(self, escrow):
        """Proves settlement succeeds bound to the stored consensus ruling once AI resolution runs."""
        escrow.resolve_dispute_with_ai(account=OWNER_ADDRESS)
        receipt = escrow.execute_ruling(account=OWNER_ADDRESS)
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() in ("RESOLVED_BUYER", "RESOLVED_SELLER")
        assert escrow.get_amount() == "0"

    def test_non_owner_cannot_execute_ruling(self, escrow):
        escrow.resolve_dispute_with_ai(account=OWNER_ADDRESS)
        receipt = escrow.execute_ruling(account=BUYER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_dispute_resolved_event_emitted(self, escrow):
        escrow.resolve_dispute_with_ai(account=OWNER_ADDRESS)
        escrow.execute_ruling(account=OWNER_ADDRESS)
        events = [json.loads(e) for e in escrow.get_events()]
        names  = [ev["event"] for ev in events]
        assert "DisputeResolved" in names
        assert "FundsDisbursed" in names


# ─────────────────────────────────────────────────────────────────────────────
# 8. Refund by owner
# ─────────────────────────────────────────────────────────────────────────────

class TestRefund:
    def test_owner_can_refund_buyer_when_funded(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        receipt = escrow.refund_buyer(account=OWNER_ADDRESS)
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() == "REFUNDED"
        assert escrow.get_amount() == "0"

    def test_owner_can_refund_buyer_when_work_completed(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        escrow.mark_completed(args=["Done"], account=SELLER_ADDRESS)
        receipt = escrow.refund_buyer(account=OWNER_ADDRESS)
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() == "REFUNDED"

    def test_non_owner_cannot_refund(self, escrow):
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        receipt = escrow.refund_buyer(account=BUYER_ADDRESS)
        assert tx_execution_failed(receipt)

    def test_refund_from_awaiting_deposit_fails(self, escrow):
        # No deposit made yet
        receipt = escrow.refund_buyer(account=OWNER_ADDRESS)
        assert tx_execution_failed(receipt)


# ─────────────────────────────────────────────────────────────────────────────
# 9. Full lifecycle integration test
# ─────────────────────────────────────────────────────────────────────────────

class TestFullLifecycle:
    def test_happy_path_end_to_end(self, escrow):
        """AWAITING_DEPOSIT → FUNDED → WORK_COMPLETED → RELEASED"""
        # 1. Deposit
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        assert escrow.get_state() == "FUNDED"

        # 2. Seller marks work done
        escrow.mark_completed(
            args=["REST API with JWT auth — see GitHub PR #99"],
            account=SELLER_ADDRESS,
        )
        assert escrow.get_state() == "WORK_COMPLETED"

        # 3. Buyer approves
        escrow.approve_payment(account=BUYER_ADDRESS)
        assert escrow.get_state() == "RELEASED"
        assert escrow.get_amount() == "0"

    def test_dispute_path_end_to_end(self, escrow):
        """FUNDED → DISPUTED → (AI ruling) → RESOLVED_BUYER"""
        # Fund
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)

        # Dispute
        escrow.open_dispute(
            args=["Work was never delivered."],
            account=BUYER_ADDRESS,
        )
        escrow.submit_seller_evidence(
            args=["I did deliver — check your email."],
            account=SELLER_ADDRESS,
        )
        assert escrow.get_state() == "DISPUTED"

        # Attempting settlement without stored AI consensus ruling fails
        failed_attempt = escrow.execute_ruling(account=OWNER_ADDRESS)
        assert tx_execution_failed(failed_attempt)

        # AI resolution generates stored consensus ruling
        escrow.resolve_dispute_with_ai(account=OWNER_ADDRESS)

        # Owner executes settlement bound strictly to stored consensus ruling
        receipt = escrow.execute_ruling(account=OWNER_ADDRESS)
        assert tx_execution_succeeded(receipt)
        assert escrow.get_state() in ("RESOLVED_BUYER", "RESOLVED_SELLER")

    def test_full_event_log_is_coherent(self, escrow):
        """Verify events are logged in the correct order throughout the lifecycle."""
        escrow.deposit(account=BUYER_ADDRESS, value=ONE_GEN_WEI)
        escrow.mark_completed(args=["Done"], account=SELLER_ADDRESS)
        escrow.approve_payment(account=BUYER_ADDRESS)

        events = [json.loads(e) for e in escrow.get_events()]
        event_names = [ev["event"] for ev in events]

        assert event_names[0] == "EscrowCreated"
        assert "Deposited" in event_names
        assert "WorkCompleted" in event_names
        assert "PaymentApproved" in event_names
        assert "FundsDisbursed" in event_names

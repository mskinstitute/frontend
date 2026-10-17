from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model

from affiliates.models import (
    Affiliate,
    CommissionSettings,
    CommissionOverride,
    Referral,
    ReferralEvent,
    Enrollment,
    EnrollmentPayment,
    CommissionEntry,
)
from affiliates.services import CommissionEngine, AttributionEngine

User = get_user_model()


class CommissionEngineTests(TestCase):
    def setUp(self):
        self.settings = CommissionSettings.get_settings()
        self.settings.global_default_rate = Decimal('15.00')
        self.settings.student_scholarship_percent = 10
        self.settings.clearance_days = 7
        self.settings.save()

        # Create user accounts
        self.affiliate_user = User.objects.create_user(
            username='partner1',
            email='partner1@example.com',
            phone='9876543210',
            password='password123',
            first_name='Rahul',
            last_name='Verma',
            role='affiliate'
        )
        self.affiliate = Affiliate.objects.create(
            user=self.affiliate_user,
            name='Rahul Verma Partner',
            affiliate_code='AFF-RAHUL10',
            email='partner1@example.com',
            phone='9876543210',
            commission_rate=Decimal('15.00'),
            payout_upi='rahul@okhdfcbank',
            status='active'
        )

        self.student_user = User.objects.create_user(
            username='student1',
            email='student1@example.com',
            phone='9123456789',
            password='password123',
            first_name='Pooja',
            last_name='Sharma',
            role='student'
        )

    def test_commission_rate_resolution_hierarchy(self):
        """
        Verify resolution order:
        1. Per-affiliate + per-course override
        2. Per-affiliate override
        3. Per-course override
        4. Global default rate
        """
        course_name = "Full Stack Web Development"

        # 4. Global default
        rate = CommissionEngine.resolve_commission_rate(self.affiliate, course_name)
        self.assertEqual(rate, Decimal('15.00'))

        # 3. Per-course override (global course)
        CommissionOverride.objects.create(
            affiliate=None,
            course_name=course_name,
            commission_rate=Decimal('18.00'),
            active=True
        )
        rate = CommissionEngine.resolve_commission_rate(self.affiliate, course_name)
        self.assertEqual(rate, Decimal('18.00'))

        # 2. Per-affiliate general override
        self.affiliate.commission_rate = Decimal('20.00')
        self.affiliate.custom_rate_active = True
        self.affiliate.save()
        rate = CommissionEngine.resolve_commission_rate(self.affiliate, course_name)
        self.assertEqual(rate, Decimal('20.00'))

        # 1. Per-affiliate + per-course override (highest priority)
        CommissionOverride.objects.create(
            affiliate=self.affiliate,
            course_name=course_name,
            commission_rate=Decimal('25.00'),
            active=True
        )
        rate = CommissionEngine.resolve_commission_rate(self.affiliate, course_name)
        self.assertEqual(rate, Decimal('25.00'))

    def test_rate_snapshot_immutability(self):
        """Applied rate on Enrollment must snapshot at creation time and never change."""
        course_name = "Python AI Mastery"
        gross_fee_paise = 1000000  # Rs 10,000

        # Attribute student
        referral = AttributionEngine.attribute_student_registration(
            student=self.student_user,
            ref_code=self.affiliate.affiliate_code,
            course_interest=course_name
        )

        enrollment = CommissionEngine.create_enrollment(
            student=self.student_user,
            course_name=course_name,
            gross_fee_paise=gross_fee_paise
        )

        self.assertEqual(enrollment.applied_commission_rate, Decimal('15.00'))

        # Now change the global rate and affiliate rate
        self.settings.global_default_rate = Decimal('30.00')
        self.settings.save()
        self.affiliate.commission_rate = Decimal('35.00')
        self.affiliate.custom_rate_active = True
        self.affiliate.save()

        # Existing enrollment must retain snapshotted rate (15%)
        enrollment.refresh_from_db()
        self.assertEqual(enrollment.applied_commission_rate, Decimal('15.00'))

        # Installment commission must use snapshotted 15%, not new 30% or 35%
        payment, comm = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=500000  # Rs 5,000
        )
        # 15% of 500000 = 75000 paise (Rs 750)
        self.assertEqual(comm.commission_amount_paise, 75000)

    def test_installments_and_half_up_paise_rounding(self):
        """Commission accrues proportionally across installments with integer paise rounding."""
        referral = AttributionEngine.attribute_student_registration(
            student=self.student_user,
            ref_code=self.affiliate.affiliate_code,
            course_interest="Web Dev"
        )
        enrollment = CommissionEngine.create_enrollment(
            student=self.student_user,
            course_name="Web Dev",
            gross_fee_paise=900000  # Rs 9,000
        )

        # Installment 1: Rs 3,333.33 -> 333333 paise at 15%
        # 333333 * 0.15 = 49999.95 -> rounds to 50000 paise (Rs 500.00)
        p1, c1 = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=333333
        )
        self.assertEqual(c1.commission_amount_paise, 50000)

        # Installment 2: Rs 3,000 -> 300000 paise at 15% = 45000 paise (Rs 450.00)
        p2, c2 = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=300000
        )
        self.assertEqual(c2.commission_amount_paise, 45000)

        # Total fee collected
        enrollment.refresh_from_db()
        self.assertEqual(enrollment.fee_collected_paise, 633333)

    def test_optional_commission_cap(self):
        """When commission cap is active, total accrued commission cannot exceed cap."""
        self.settings.max_commission_cap_paise = 100000  # Cap: Rs 1,000 (100,000 paise)
        self.settings.save()

        referral = AttributionEngine.attribute_student_registration(
            student=self.student_user,
            ref_code=self.affiliate.affiliate_code,
            course_interest="Data Science"
        )
        enrollment = CommissionEngine.create_enrollment(
            student=self.student_user,
            course_name="Data Science",
            gross_fee_paise=1200000  # Rs 12,000
        )

        # Payment 1: Rs 5,000 (500000 paise). 15% = 75,000 paise. (Under cap of 100,000)
        p1, c1 = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=500000
        )
        self.assertEqual(c1.commission_amount_paise, 75000)

        # Payment 2: Rs 5,000 (500000 paise). Raw 15% is 75,000 paise, but remaining cap is 25,000 paise!
        p2, c2 = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=500000
        )
        self.assertEqual(c2.commission_amount_paise, 25000)

        # Payment 3: Rs 2,000. Cap is exhausted (0 remaining), so no commission accrued
        p3, c3 = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=200000
        )
        self.assertIsNone(c3)

    def test_refund_reversal(self):
        """Refunding a payment must reverse the linked commission entry and update ledger."""
        referral = AttributionEngine.attribute_student_registration(
            student=self.student_user,
            ref_code=self.affiliate.affiliate_code,
            course_interest="Cyber Security"
        )
        enrollment = CommissionEngine.create_enrollment(
            student=self.student_user,
            course_name="Cyber Security",
            gross_fee_paise=600000
        )

        payment, comm = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=600000
        )
        self.assertEqual(comm.status, 'PENDING')
        self.assertEqual(comm.commission_amount_paise, 90000)

        # Process refund
        success = CommissionEngine.process_refund(
            payment=payment,
            reason="Student requested batch cancellation within 3 days"
        )
        self.assertTrue(success)

        payment.refresh_from_db()
        self.assertEqual(payment.status, 'REFUNDED')

        comm.refresh_from_db()
        self.assertEqual(comm.status, 'REVERSED')
        self.assertEqual(comm.reversal_reason, "Student requested batch cancellation within 3 days")

        # Enrollment fee collected should be deducted
        enrollment.refresh_from_db()
        self.assertEqual(enrollment.fee_collected_paise, 0)

        # Ledger events should reflect reversal
        event = ReferralEvent.objects.filter(event_type='COMMISSION_REVERSED').first()
        self.assertIsNotNone(event)

    def test_clearance_and_auto_approval(self):
        """Commissions in clearance should auto-approve once clearance period expires."""
        referral = AttributionEngine.attribute_student_registration(
            student=self.student_user,
            ref_code=self.affiliate.affiliate_code,
            course_interest="Python"
        )
        enrollment = CommissionEngine.create_enrollment(
            student=self.student_user,
            course_name="Python",
            gross_fee_paise=500000
        )

        payment, comm = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=500000
        )
        self.assertEqual(comm.status, 'PENDING')

        # Fast forward clearance date into the past
        comm.clearance_due_date = timezone.now() - timedelta(days=1)
        comm.save()

        # Run auto-approval
        approved_count = CommissionEngine.auto_approve_cleared_commissions()
        self.assertEqual(approved_count, 1)

        comm.refresh_from_db()
        self.assertEqual(comm.status, 'APPROVED')
        self.assertIsNotNone(comm.approved_at)


class AttributionAndAntiFraudTests(TestCase):
    def setUp(self):
        self.settings = CommissionSettings.get_settings()

        self.affiliate_user = User.objects.create_user(
            username='partner_fraud',
            email='partner.fraud@example.com',
            phone='9988776655',
            password='password123',
            first_name='Ankit',
            last_name='Singh'
        )
        self.affiliate = Affiliate.objects.create(
            user=self.affiliate_user,
            name='Ankit Singh',
            affiliate_code='AFF-ANKIT99',
            email='partner.fraud@example.com',
            phone='9988776655',
            payout_upi='ankit@oksbi',
            status='active'
        )

    def test_self_referral_check(self):
        """Self-referral matching affiliate's email, phone, or UPI must be detected."""
        # 1. Matching email
        self.assertTrue(
            AttributionEngine.check_self_referral(
                self.affiliate,
                email='partner.fraud@example.com',
                phone='9111122222'
            )
        )
        # 2. Matching phone
        self.assertTrue(
            AttributionEngine.check_self_referral(
                self.affiliate,
                email='someone@example.com',
                phone='9988776655'
            )
        )
        # 3. Matching UPI
        self.assertTrue(
            AttributionEngine.check_self_referral(
                self.affiliate,
                email='someone@example.com',
                phone='9111122222',
                upi='ankit@oksbi'
            )
        )
        # 4. Clean student (no match)
        self.assertFalse(
            AttributionEngine.check_self_referral(
                self.affiliate,
                email='clean.student@example.com',
                phone='9111122222',
                upi='clean@okaxis'
            )
        )

    def test_self_referral_blocked_on_registration(self):
        """Registration attribution must be rejected if student shares phone or email with affiliate."""
        # Set affiliate alternate phone in profile
        self.affiliate.phone = '9888877777'
        self.affiliate.save()

        # Student with affiliate's phone
        student = User.objects.create_user(
            username='self_student_phone',
            email='different.student@example.com',
            phone='9888877777',
            password='password123'
        )
        referral = AttributionEngine.attribute_student_registration(
            student=student,
            ref_code='AFF-ANKIT99'
        )
        self.assertIsNone(referral)
        self.assertFalse(Referral.objects.filter(student=student).exists())

    def test_first_touch_attribution_never_overwritten(self):
        """If a student was already attributed to Affiliate A, Affiliate B cannot overwrite it."""
        partner_b_user = User.objects.create_user(
            username='partner_b',
            email='partner.b@example.com',
            phone='9777788888',
            password='password123'
        )
        partner_b = Affiliate.objects.create(
            user=partner_b_user,
            name='Partner B',
            affiliate_code='AFF-PARTNERB',
            email='partner.b@example.com',
            phone='9777788888',
            status='active'
        )

        student = User.objects.create_user(
            username='student_first_touch',
            email='unique.student@example.com',
            phone='9555566666',
            password='password123',
            first_name='Vikas',
            last_name='Kushwaha'
        )

        # 1. First touch: attributed to Ankit (Affiliate A)
        ref_a = AttributionEngine.attribute_student_registration(
            student=student,
            ref_code='AFF-ANKIT99'
        )
        self.assertIsNotNone(ref_a)
        self.assertEqual(ref_a.affiliate, self.affiliate)

        # 2. Second touch attempt: attributed to Partner B
        ref_b = AttributionEngine.attribute_student_registration(
            student=student,
            ref_code='AFF-PARTNERB'
        )

        # Must retain original attribution to Ankit (Affiliate A)!
        self.assertEqual(ref_b.affiliate, self.affiliate)
        self.assertEqual(Referral.objects.filter(student=student).count(), 1)

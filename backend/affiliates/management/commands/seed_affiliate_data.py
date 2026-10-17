from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from datetime import timedelta
import random

from affiliates.models import (
    Affiliate,
    CommissionSettings,
    CommissionOverride,
    Referral,
    ReferralEvent,
    DemoBooking,
    Enrollment,
    EnrollmentPayment,
    CommissionEntry,
    PayoutRequest,
    ClickTracker,
    AuditLog,
)

User = get_user_model()


class Command(BaseCommand):
    help = "Seed realistic affiliate data for MSK Institute (Shikohabad)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding MSK Affiliate system test data..."))

        now = timezone.now()

        # 1. Commission Settings
        settings_obj = CommissionSettings.get_settings()
        settings_obj.global_default_rate = Decimal('15.00')
        settings_obj.student_scholarship_percent = 10
        settings_obj.clearance_period_days = 7
        settings_obj.min_payout_amount_paise = 50000  # ₹500
        settings_obj.cookie_duration_days = 60
        settings_obj.save()
        self.stdout.write(self.style.SUCCESS("[OK] Verified CommissionSettings (15% default, 7d clearance, min Rs. 500)"))

        # 2. Affiliates
        aff1_user, _ = User.objects.get_or_create(
            email='affiliate@mskinstitute.in',
            defaults={
                'username': 'affiliate_pooja',
                'first_name': 'Pooja',
                'last_name': 'Sharma',
                'phone': '+919876543210',
                'role': 'affiliate',
                'is_active': True,
            }
        )
        aff1_user.set_password('Msk@123456')
        aff1_user.role = 'affiliate'
        aff1_user.save()

        aff1, _ = Affiliate.objects.get_or_create(
            affiliate_code='AFF-COLLEGE-01',
            defaults={
                'user': aff1_user,
                'name': 'Pooja Sharma (Campus Ambassador)',
                'email': 'affiliate@mskinstitute.in',
                'phone': '+919876543210',
                'commission_rate': Decimal('15.00'),
                'payout_upi': 'poojasharma@oksbi',
                'pan_number': 'ABCPS1234F',
                'status': 'active',
                'upi_verified': True,
            }
        )
        aff1.user = aff1_user
        aff1.payout_upi = 'poojasharma@oksbi'
        aff1.save()

        aff2_user, _ = User.objects.get_or_create(
            email='aman.affiliate@mskinstitute.in',
            defaults={
                'username': 'affiliate_aman',
                'first_name': 'Aman',
                'last_name': 'Verma',
                'phone': '+919876543211',
                'role': 'affiliate',
                'is_active': True,
            }
        )
        aff2_user.set_password('Msk@123456')
        aff2_user.role = 'affiliate'
        aff2_user.save()

        aff2, _ = Affiliate.objects.get_or_create(
            affiliate_code='AFF-YOUTH-02',
            defaults={
                'user': aff2_user,
                'name': 'Aman Verma (Youth Tech Partner)',
                'email': 'aman.affiliate@mskinstitute.in',
                'phone': '+919876543211',
                'commission_rate': Decimal('18.00'),
                'payout_upi': 'amanverma@okaxis',
                'pan_number': 'XYZPV5678K',
                'status': 'active',
                'upi_verified': True,
            }
        )
        aff2.user = aff2_user
        aff2.save()

        self.stdout.write(self.style.SUCCESS("[OK] Seeded Affiliates: AFF-COLLEGE-01 and AFF-YOUTH-02"))

        # 3. Commission Overrides
        CommissionOverride.objects.get_or_create(
            course_name='Full-Stack Web Development (MERN Stack)',
            defaults={'commission_rate': Decimal('18.00'), 'active': True}
        )
        CommissionOverride.objects.get_or_create(
            course_name='Python with Data Science & AI',
            defaults={'commission_rate': Decimal('20.00'), 'active': True}
        )

        # 4. Clicks Tracking
        for i in range(45):
            ClickTracker.objects.get_or_create(
                affiliate=aff1,
                ip_address=f"103.21.{random.randint(10, 200)}.{random.randint(10, 200)}",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
                created_at=now - timedelta(days=random.randint(1, 20))
            )
        for i in range(25):
            ClickTracker.objects.get_or_create(
                affiliate=aff2,
                ip_address=f"103.22.{random.randint(10, 200)}.{random.randint(10, 200)}",
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5) Mobile",
                created_at=now - timedelta(days=random.randint(1, 15))
            )
        self.stdout.write(self.style.SUCCESS("[OK] Seeded ClickTracker analytics (70 total clicks)"))

        # 5. Students & Referrals Across Lifecycle Stages
        student_data = [
            # Registered stage (stuck > 3 days for counselor follow-up queue)
            ('rohit.shk@gmail.com', 'Rohit', 'Kumar', '+919812345601', 'REGISTERED', 'Full-Stack Web Development (MERN Stack)', 4, aff1),
            ('priya.yadav@gmail.com', 'Priya', 'Yadav', '+919812345602', 'REGISTERED', 'ADCA (Advanced Diploma in Computer Applications)', 5, aff1),
            ('vikas.up@gmail.com', 'Vikas', 'Gupta', '+919812345603', 'REGISTERED', 'Python with Data Science & AI', 1, aff2),

            # Demo Booked stage
            ('neha.verma@gmail.com', 'Neha', 'Verma', '+919812345604', 'DEMO_BOOKED', 'Full-Stack Web Development (MERN Stack)', 2, aff1),
            ('suresh.rajput@gmail.com', 'Suresh', 'Rajput', '+919812345605', 'DEMO_BOOKED', 'Tally Prime + GST & Financial Accounting', 3, aff1),
            ('deepak.sharma@gmail.com', 'Deepak', 'Sharma', '+919812345606', 'DEMO_BOOKED', 'O-Level Certification (NIELIT)', 1, aff2),

            # Demo Completed stage (>3 days without enrollment for follow-up)
            ('anjali.singh@gmail.com', 'Anjali', 'Singh', '+919812345607', 'DEMO_COMPLETED', 'Python with Data Science & AI', 4, aff1),
            ('manish.p@gmail.com', 'Manish', 'Pandey', '+919812345608', 'DEMO_COMPLETED', 'Full-Stack Web Development (MERN Stack)', 2, aff1),
            ('kavita.rani@gmail.com', 'Kavita', 'Rani', '+919812345609', 'DEMO_COMPLETED', 'ADCA (Advanced Diploma in Computer Applications)', 5, aff2),

            # Enrolled & Paid stage
            ('arjun.mehta@gmail.com', 'Arjun', 'Mehta', '+919812345610', 'ENROLLED', 'Full-Stack Web Development (MERN Stack)', 15, aff1),
            ('divya.p@gmail.com', 'Divya', 'Patel', '+919812345611', 'ENROLLED', 'Python with Data Science & AI', 12, aff1),
            ('rahul.lodhi@gmail.com', 'Rahul', 'Lodhi', '+919812345612', 'ENROLLED', 'ADCA (Advanced Diploma in Computer Applications)', 3, aff1),
            ('sonam.k@gmail.com', 'Sonam', 'Kumari', '+919812345613', 'ENROLLED', 'Tally Prime + GST & Financial Accounting', 2, aff2),
            ('tarun.j@gmail.com', 'Tarun', 'Jain', '+919812345614', 'ENROLLED', 'Full-Stack Web Development (MERN Stack)', 20, aff2),

            # No Show stage
            ('amit.kashyap@gmail.com', 'Amit', 'Kashyap', '+919812345615', 'DEMO_NO_SHOW', 'CCC (Course on Computer Concepts)', 6, aff1),
        ]

        for email, first, last, phone, stage, course, days_ago, aff in student_data:
            s_user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first,
                    'last_name': last,
                    'phone': phone,
                    'role': 'student',
                    'is_active': True,
                }
            )
            if created:
                s_user.set_password('Msk@123456')
                s_user.save()

            ref_created_at = now - timedelta(days=days_ago)

            ref, _ = Referral.objects.get_or_create(
                student=s_user,
                defaults={
                    'affiliate': aff,
                    'ref_code_used': aff.affiliate_code,
                    'current_stage': stage,
                    'course_interest': course,
                    'scholarship_percent': 10,
                    'created_at': ref_created_at,
                }
            )
            ref.current_stage = stage
            ref.affiliate = aff
            ref.created_at = ref_created_at
            ref.save()

            # Create Referral Event for Registration
            ReferralEvent.objects.get_or_create(
                referral=ref,
                event_type='REGISTERED',
                defaults={'to_stage': 'REGISTERED', 'metadata': {'channel': 'short_link'}}
            )

            # Stage-specific objects
            if stage in ['DEMO_BOOKED', 'DEMO_COMPLETED', 'ENROLLED', 'DEMO_NO_SHOW']:
                demo, _ = DemoBooking.objects.get_or_create(
                    student=s_user,
                    defaults={
                        'referral': ref,
                        'course_name': course,
                        'learning_mode': 'OFFLINE' if 'ADCA' in course or 'Tally' in course else 'ONLINE',
                        'preferred_slot': '09:00 AM - 11:00 AM (Morning Lab)',
                        'scheduled_date': (now - timedelta(days=days_ago - 1)).date(),
                        'day1_attended': stage in ['DEMO_COMPLETED', 'ENROLLED'],
                        'day2_attended': stage in ['DEMO_COMPLETED', 'ENROLLED'],
                        'status': 'COMPLETED' if stage in ['DEMO_COMPLETED', 'ENROLLED'] else 'NO_SHOW' if stage == 'DEMO_NO_SHOW' else 'SCHEDULED',
                        'created_at': now - timedelta(days=days_ago - 1),
                    }
                )
                if stage in ['DEMO_COMPLETED', 'ENROLLED']:
                    ReferralEvent.objects.get_or_create(
                        referral=ref,
                        event_type='DEMO_COMPLETED',
                        defaults={'to_stage': 'DEMO_COMPLETED', 'metadata': {'demo_id': demo.id}}
                    )

            if stage == 'ENROLLED':
                gross_paise = 2500000 if 'Full-Stack' in course else 1800000 if 'Python' in course else 1200000
                discount_paise = int(gross_paise * 0.10)
                net_paise = gross_paise - discount_paise

                enrollment, _ = Enrollment.objects.get_or_create(
                    student=s_user,
                    defaults={
                        'referral': ref,
                        'course_name': course,
                        'gross_fee_paise': gross_paise,
                        'discount_percent': 10,
                        'discount_paise': discount_paise,
                        'net_fee_paise': net_paise,
                        'fee_collected_paise': net_paise if days_ago > 10 else int(net_paise * 0.5),
                        'applied_commission_rate': Decimal('18.00') if 'Full-Stack' in course else Decimal('20.00') if 'Python' in course else Decimal('15.00'),
                        'status': 'PAID_IN_FULL' if days_ago > 10 else 'PARTIALLY_PAID',
                        'enrolled_at': now - timedelta(days=days_ago - 2),
                    }
                )

                # Commission Entry
                rate_decimal = enrollment.applied_commission_rate
                collected_paise = enrollment.fee_collected_paise
                commission_paise = int(round(float(collected_paise) * float(rate_decimal) / 100.0))

                is_matured = days_ago > 10
                due_date = (now - timedelta(days=days_ago - 9)) if is_matured else (now + timedelta(days=5))

                entry_status = 'APPROVED' if is_matured else 'PENDING'

                CommissionEntry.objects.get_or_create(
                    enrollment=enrollment,
                    defaults={
                        'affiliate': aff,
                        'collected_amount_paise': collected_paise,
                        'rate_applied': rate_decimal,
                        'commission_amount_paise': commission_paise,
                        'status': entry_status,
                        'clearance_due_date': due_date,
                    }
                )

                ReferralEvent.objects.get_or_create(
                    referral=ref,
                    event_type='ENROLLED',
                    defaults={'to_stage': 'ENROLLED', 'metadata': {'enrollment_id': enrollment.id}}
                )

        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(student_data)} student admissions across all funnel stages"))

        # 6. Payout Requests
        # Settle one previous payout for aff1
        payout1, _ = PayoutRequest.objects.get_or_create(
            affiliate=aff1,
            amount_paise=360000,  # Rs. 3,600
            defaults={
                'upi_destination': aff1.payout_upi,
                'status': 'PAID',
                'utr_reference': 'UTR-20261005-948124',
                'requested_at': now - timedelta(days=8),
                'processed_at': now - timedelta(days=7),
                'admin_notes': 'Settled to verified SBI UPI',
            }
        )

        # One pending payout in queue for aff1
        payout2, _ = PayoutRequest.objects.get_or_create(
            affiliate=aff1,
            amount_paise=150000,  # Rs. 1,500
            defaults={
                'upi_destination': aff1.payout_upi,
                'status': 'REQUESTED',
                'requested_at': now - timedelta(hours=6),
            }
        )

        self.stdout.write(self.style.SUCCESS("[OK] Seeded Payout Requests (1 Paid with UTR, 1 Pending in Queue)"))

        self.stdout.write(self.style.SUCCESS("\nAFFILIATE DATA SEEDING COMPLETE!"))
        self.stdout.write(f"Affiliate 1 (Pooja): {aff1.name} [Code: {aff1.affiliate_code}]")
        self.stdout.write(f"  * Total Referrals: {aff1.total_referrals_count}")
        self.stdout.write(f"  * Lifetime Earned: Rs. {aff1.total_earnings_inr}")
        self.stdout.write(f"  * Available to Payout: Rs. {aff1.available_balance_inr}")
        self.stdout.write(f"  * In Clearance: Rs. {aff1.pending_clearance_inr}")
        self.stdout.write(f"  * Paid Out: Rs. {aff1.paid_out_paise / 100.0}")

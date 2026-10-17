from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

from superadmin.models import Branch, Staff, Student, Affiliate as SuperadminAffiliate
from affiliates.models import (
    Affiliate,
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
    Notification,
    CommissionSettings,
)
from authentication.models import UserSession

User = get_user_model()


class Command(BaseCommand):
    help = "Removes all dummy data, preserves Shikohabad branch, and promotes sumit@gmail.com to Super Admin."

    def handle(self, *args, **options):
        self.stdout.write("Starting cleanup of backend dummy data...")

        with transaction.atomic():
            # 1. Clean Affiliate tracking & referral entities
            clicks_del, _ = ClickTracker.objects.all().delete()
            audit_del, _ = AuditLog.objects.all().delete()
            notif_del, _ = Notification.objects.all().delete()
            payout_del, _ = PayoutRequest.objects.all().delete()
            comm_del, _ = CommissionEntry.objects.all().delete()
            payments_del, _ = EnrollmentPayment.objects.all().delete()
            enroll_del, _ = Enrollment.objects.all().delete()
            booking_del, _ = DemoBooking.objects.all().delete()
            events_del, _ = ReferralEvent.objects.all().delete()
            referrals_del, _ = Referral.objects.all().delete()
            overrides_del, _ = CommissionOverride.objects.all().delete()
            affiliates_del, _ = Affiliate.objects.all().delete()

            # 2. Reset CommissionSettings to clean defaults
            settings_obj = CommissionSettings.get_settings()
            settings_obj.save()

            # 3. Clean SuperAdmin app records
            sa_aff_del, _ = SuperadminAffiliate.objects.all().delete()
            students_del, _ = Student.objects.all().delete()
            staff_del, _ = Staff.objects.all().delete()

            # Keep MSK-SHK-01 branch only
            branches_del, _ = Branch.objects.exclude(code="MSK-SHK-01").delete()

            # 4. Handle Users:
            # Promote sumit@gmail.com to Super Admin
            sumit_user = User.objects.filter(email="sumit@gmail.com").first()
            if sumit_user:
                sumit_user.role = "admin"
                sumit_user.is_staff = True
                sumit_user.is_superuser = True
                sumit_user.save()
                self.stdout.write(self.style.SUCCESS(f"Promoted {sumit_user.email} (username: {sumit_user.username}) to Super Admin."))
            else:
                self.stdout.write(self.style.WARNING("User with email sumit@gmail.com not found!"))

            # Delete all other dummy users
            users_query = User.objects.exclude(email="sumit@gmail.com")
            users_count = users_query.count()
            users_query.delete()

            # Clear sessions
            UserSession.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Cleanup completed successfully!"))
        self.stdout.write(f"- ClickTracker deleted: {clicks_del}")
        self.stdout.write(f"- PayoutRequest deleted: {payout_del}")
        self.stdout.write(f"- CommissionEntry deleted: {comm_del}")
        self.stdout.write(f"- Enrollment deleted: {enroll_del}")
        self.stdout.write(f"- DemoBooking deleted: {booking_del}")
        self.stdout.write(f"- Referral / Events deleted: {referrals_del} / {events_del}")
        self.stdout.write(f"- Affiliates deleted: {affiliates_del + sa_aff_del}")
        self.stdout.write(f"- Students deleted: {students_del}")
        self.stdout.write(f"- Staff deleted: {staff_del}")
        self.stdout.write(f"- Dummy Branches deleted: {branches_del}")
        self.stdout.write(f"- Dummy Users deleted: {users_count}")
        self.stdout.write(f"- Preserved Branch: {list(Branch.objects.values_list('code', 'name'))}")
        self.stdout.write(f"- Preserved Users: {list(User.objects.values('id', 'username', 'email', 'role', 'is_superuser'))}")

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from superadmin.models import Branch, Staff, Student, Affiliate
from decimal import Decimal
import datetime

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds initial sample records and demo role user accounts."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Super Admin sample data and role accounts...")

        # 0. Create Demo Role Accounts with password 'Msk@123456'
        demo_accounts = [
            {
                "email": "admin@mskinstitute.in",
                "username": "admin_user",
                "first_name": "Super",
                "last_name": "Admin",
                "phone": "+91 99999 00001",
                "role": "admin",
                "gender": "male",
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "email": "staff@mskinstitute.in",
                "username": "staff_user",
                "first_name": "Faculty",
                "last_name": "Trainer",
                "phone": "+91 99999 00002",
                "role": "staff",
                "gender": "male",
                "is_staff": True,
                "is_superuser": False,
            },
            {
                "email": "student@mskinstitute.in",
                "username": "student_user",
                "first_name": "Aman",
                "last_name": "Yadav",
                "phone": "+91 99999 00003",
                "role": "student",
                "gender": "male",
                "is_staff": False,
                "is_superuser": False,
            },
            {
                "email": "affiliate@mskinstitute.in",
                "username": "affiliate_user",
                "first_name": "Campus",
                "last_name": "Partner",
                "phone": "+91 99999 00004",
                "role": "affiliate",
                "gender": "other",
                "is_staff": False,
                "is_superuser": False,
            },
            {
                "email": "branch@mskinstitute.in",
                "username": "branch_user",
                "first_name": "Rajesh",
                "last_name": "Sharma",
                "phone": "+91 99999 00005",
                "role": "branch",
                "gender": "male",
                "is_staff": True,
                "is_superuser": False,
            },
        ]

        for acc in demo_accounts:
            user = User.objects.filter(email=acc["email"]).first()
            if not user:
                user = User.objects.create_user(
                    email=acc["email"],
                    username=acc["username"],
                    password="Msk@123456",
                    first_name=acc["first_name"],
                    last_name=acc["last_name"],
                    phone=acc["phone"],
                    gender=acc["gender"],
                    role=acc["role"],
                    is_staff=acc["is_staff"],
                    is_superuser=acc["is_superuser"],
                )
                self.stdout.write(f"Created demo account: {acc['email']} ({acc['role']})")
            else:
                user.role = acc["role"]
                user.is_staff = acc["is_staff"]
                user.is_superuser = acc["is_superuser"]
                user.set_password("Msk@123456")
                user.save()
                self.stdout.write(f"Updated demo account password & role: {acc['email']} ({acc['role']})")

        # 1. Branches
        b1, _ = Branch.objects.get_or_create(
            code="MSK-SHK-01",
            defaults={
                "name": "MSK Shikohabad Main Campus",
                "city": "Shikohabad",
                "address": "Gali No. 3, Near Gyan Jyoti Public School, Shikohabad (U.P.)",
                "manager_name": "Er. Sumit Kumar",
                "phone": "+91 83930 42166",
                "email": "shikohabad@mskinstitute.in",
                "revenue_share_percentage": Decimal("100.00"),
                "status": "active"
            }
        )

        b2, _ = Branch.objects.get_or_create(
            code="MSK-FZB-02",
            defaults={
                "name": "MSK Firozabad Tech Center",
                "city": "Firozabad",
                "address": "Opposite Railway Station Road, Firozabad (U.P.)",
                "manager_name": "Rajesh Sharma",
                "phone": "+91 94123 45678",
                "email": "firozabad@mskinstitute.in",
                "revenue_share_percentage": Decimal("25.00"),
                "status": "active"
            }
        )

        b3, _ = Branch.objects.get_or_create(
            code="MSK-SRS-03",
            defaults={
                "name": "MSK Sirsaganj Academy (Franchise)",
                "city": "Sirsaganj",
                "address": "Main Market Complex, Sirsaganj",
                "manager_name": "Vikram Singh",
                "phone": "+91 98370 11223",
                "email": "sirsaganj@mskinstitute.in",
                "revenue_share_percentage": Decimal("20.00"),
                "status": "pending"
            }
        )

        # 2. Staff
        Staff.objects.get_or_create(
            email="trainer.python@mskinstitute.in",
            defaults={
                "name": "Er. Sumit Kumar",
                "phone": "+91 83930 42166",
                "role": "instructor",
                "department": "Computer Science & AI",
                "branch": b1,
                "joining_date": datetime.date(2023, 1, 15),
                "salary": Decimal("65000.00"),
                "status": "active"
            }
        )

        Staff.objects.get_or_create(
            email="anita.verma@mskinstitute.in",
            defaults={
                "name": "Anita Verma",
                "phone": "+91 98765 12345",
                "role": "counselor",
                "department": "Admissions & Helpline",
                "branch": b1,
                "joining_date": datetime.date(2023, 6, 1),
                "salary": Decimal("28000.00"),
                "status": "active"
            }
        )

        Staff.objects.get_or_create(
            email="manish.gupta@mskinstitute.in",
            defaults={
                "name": "Manish Gupta",
                "phone": "+91 97531 24680",
                "role": "instructor",
                "department": "Full Stack Web & Databases",
                "branch": b2,
                "joining_date": datetime.date(2024, 2, 10),
                "salary": Decimal("45000.00"),
                "status": "active"
            }
        )

        # 3. Students
        Student.objects.get_or_create(
            registration_number="MSK-2026-001",
            defaults={
                "first_name": "Aman",
                "last_name": "Yadav",
                "email": "aman.yadav@example.com",
                "phone": "+91 98765 43201",
                "gender": "male",
                "branch": b1,
                "course_name": "Python Programming & Data Structures Mastery",
                "batch_timing": "09:00 AM - 11:00 AM",
                "fee_total": Decimal("7500.00"),
                "fee_paid": Decimal("7500.00"),
                "fee_status": "paid",
                "certification_status": "certified",
                "status": "active"
            }
        )

        Student.objects.get_or_create(
            registration_number="MSK-2026-002",
            defaults={
                "first_name": "Pooja",
                "last_name": "Sharma",
                "email": "pooja.sharma@example.com",
                "phone": "+91 98765 43202",
                "gender": "female",
                "branch": b1,
                "course_name": "Full-Stack Web Development Bootcamp",
                "batch_timing": "11:30 AM - 01:30 PM",
                "fee_total": Decimal("12000.00"),
                "fee_paid": Decimal("6000.00"),
                "fee_status": "partial",
                "certification_status": "in_progress",
                "status": "active"
            }
        )

        Student.objects.get_or_create(
            registration_number="MSK-2026-003",
            defaults={
                "first_name": "Rahul",
                "last_name": "Kumar",
                "email": "rahul.kumar@example.com",
                "phone": "+91 98765 43203",
                "gender": "male",
                "branch": b2,
                "course_name": "NIELIT CCC Certification Preparation",
                "batch_timing": "02:00 PM - 04:00 PM",
                "fee_total": Decimal("3500.00"),
                "fee_paid": Decimal("0.00"),
                "fee_status": "pending",
                "certification_status": "exam_pending",
                "status": "active"
            }
        )

        # 4. Affiliates
        Affiliate.objects.get_or_create(
            affiliate_code="AFF-COLLEGE-01",
            defaults={
                "name": "JS University Student Ambassadorship",
                "email": "campus.partner@example.com",
                "phone": "+91 91234 56789",
                "commission_rate": Decimal("15.00"),
                "total_referrals": 24,
                "total_earnings": Decimal("18000.00"),
                "pending_payout": Decimal("4500.00"),
                "payout_details": "UPI: campuspartner@okaxis",
                "status": "active"
            }
        )

        Affiliate.objects.get_or_create(
            affiliate_code="AFF-TECHBLOG",
            defaults={
                "name": "DevLearn Community",
                "email": "devlearn@example.com",
                "phone": "+91 99887 76655",
                "commission_rate": Decimal("10.00"),
                "total_referrals": 14,
                "total_earnings": Decimal("9200.00"),
                "pending_payout": Decimal("0.00"),
                "payout_details": "Account: 918273645012 / IFSC: SBIN0001234",
                "status": "active"
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Super Admin data and demo role accounts!"))

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
import datetime

from superadmin.models import Branch, Staff, Student, Affiliate


class SuperAdminAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.branch = Branch.objects.create(
            name="MSK Main Campus",
            code="BR-TEST-01",
            city="Shikohabad",
            address="Test Address",
            manager_name="Sumit Kumar",
            phone="+91 99999 88888",
            email="test@msk.in",
            revenue_share_percentage=Decimal("15.00"),
            status="active"
        )

        self.staff = Staff.objects.create(
            name="Jane Doe",
            email="jane@msk.in",
            phone="+91 98765 00000",
            role="instructor",
            department="IT",
            branch=self.branch,
            joining_date=datetime.date(2024, 1, 1),
            salary=Decimal("50000.00"),
            status="active"
        )

        self.student = Student.objects.create(
            registration_number="STD-TEST-01",
            first_name="Ravi",
            last_name="Verma",
            email="ravi@example.com",
            phone="+91 98765 11111",
            branch=self.branch,
            course_name="Python Mastery",
            fee_total=Decimal("10000.00"),
            fee_paid=Decimal("5000.00"),
            fee_status="partial",
            certification_status="in_progress",
            status="active"
        )

        self.affiliate = Affiliate.objects.create(
            name="Alpha Partner",
            affiliate_code="AFF-TEST-01",
            email="partner@example.com",
            phone="+91 98765 22222",
            commission_rate=Decimal("12.00"),
            total_referrals=5,
            total_earnings=Decimal("3000.00"),
            status="active"
        )

    def test_dashboard_summary(self):
        url = reverse('superadmin:dashboard_summary')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("metrics", res.data)
        self.assertEqual(res.data["metrics"]["branches"]["total"], 1)
        self.assertEqual(res.data["metrics"]["staff"]["total"], 1)
        self.assertEqual(res.data["metrics"]["students"]["total"], 1)
        self.assertEqual(res.data["metrics"]["affiliates"]["total"], 1)

    def test_branch_crud(self):
        url = reverse('superadmin:branch-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        # Create branch
        create_res = self.client.post(url, {
            "name": "Firozabad Center",
            "code": "BR-TEST-02",
            "city": "Firozabad",
            "address": "Station Road",
            "manager_name": "Ajay Sharma",
            "phone": "+91 91234 56789",
            "email": "ajay@msk.in",
            "revenue_share_percentage": "20.00",
            "status": "active"
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)

    def test_student_fee_auto_computation(self):
        url = reverse('superadmin:student-list')
        create_res = self.client.post(url, {
            "registration_number": "STD-TEST-02",
            "first_name": "Kavita",
            "last_name": "Singh",
            "email": "kavita@example.com",
            "phone": "+91 98765 33333",
            "gender": "female",
            "branch": self.branch.id,
            "course_name": "Web Development",
            "batch_timing": "02:00 PM - 04:00 PM",
            "fee_total": "8000.00",
            "fee_paid": "8000.00",
            "certification_status": "in_progress",
            "status": "active"
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_res.data["fee_status"], "paid")
        self.assertEqual(create_res.data["fee_remaining"], Decimal("0.00"))

    def test_affiliate_crud(self):
        url = reverse('superadmin:affiliate-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

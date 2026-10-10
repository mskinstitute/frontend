from django.db import models
from django.conf import settings
from decimal import Decimal


class Branch(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('pending', 'Pending Approval'),
        ('suspended', 'Suspended'),
    )

    name = models.CharField(max_length=200, help_text="e.g. MSK Shikohabad Main Campus")
    code = models.CharField(max_length=40, unique=True, db_index=True, help_text="e.g. MSK-SHK-01")
    city = models.CharField(max_length=100)
    address = models.TextField()
    manager_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    revenue_share_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('20.00'),
        help_text="Franchise revenue percentage (e.g. 20.00%)"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Branch / Franchise'
        verbose_name_plural = 'Branches & Franchises'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"


class Staff(models.Model):
    ROLE_CHOICES = (
        ('center_manager', 'Center / Branch Manager'),
        ('instructor', 'Senior Technical Instructor'),
        ('lab_assistant', 'Lab Assistant & Mentor'),
        ('counselor', 'Admissions Counselor'),
        ('accountant', 'Finance & Accountant'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('on_leave', 'On Leave'),
        ('inactive', 'Inactive'),
    )

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='instructor')
    department = models.CharField(max_length=100, default='Academics')
    branch = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_members'
    )
    joining_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Staff Member'
        verbose_name_plural = 'Staff & Faculty'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"


class Student(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )

    FEE_STATUS_CHOICES = (
        ('paid', 'Fully Paid'),
        ('partial', 'Partially Paid'),
        ('pending', 'Payment Due'),
    )

    CERT_STATUS_CHOICES = (
        ('certified', 'Certified & Issued'),
        ('in_progress', 'Course Ongoing'),
        ('exam_pending', 'Exam Pending'),
    )

    STATUS_CHOICES = (
        ('active', 'Active Student'),
        ('completed', 'Graduated'),
        ('dropped', 'Dropped Out'),
    )

    registration_number = models.CharField(
        max_length=50, unique=True, db_index=True, help_text="e.g. MSK-2026-001"
    )
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='male')
    branch = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='students'
    )
    course_name = models.CharField(max_length=200)
    batch_timing = models.CharField(max_length=100, default='09:00 AM - 11:00 AM')
    fee_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    fee_paid = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    fee_status = models.CharField(max_length=20, choices=FEE_STATUS_CHOICES, default='pending')
    certification_status = models.CharField(
        max_length=20, choices=CERT_STATUS_CHOICES, default='in_progress'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student'
        verbose_name_plural = 'Students & Enrollments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.registration_number})"

    def save(self, *args, **kwargs):
        # Auto-calculate fee status based on paid vs total
        if self.fee_total > 0:
            if self.fee_paid >= self.fee_total:
                self.fee_status = 'paid'
            elif self.fee_paid > 0:
                self.fee_status = 'partial'
            else:
                self.fee_status = 'pending'
        super().save(*args, **kwargs)


class Affiliate(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active Partner'),
        ('pending', 'Under Review'),
        ('suspended', 'Suspended'),
    )

    name = models.CharField(max_length=150)
    affiliate_code = models.CharField(
        max_length=40, unique=True, db_index=True, help_text="e.g. AFF-SUMIT10"
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    commission_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('10.00'),
        help_text="Percentage commission (e.g. 10.00%)"
    )
    total_referrals = models.PositiveIntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    pending_payout = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    payout_details = models.CharField(
        max_length=255, blank=True, help_text="e.g. UPI: name@okhdfcbank or Account: 123456789"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Affiliate Partner'
        verbose_name_plural = 'Affiliates & Partners'
        ordering = ['-total_referrals']

    def __str__(self):
        return f"{self.name} ({self.affiliate_code})"

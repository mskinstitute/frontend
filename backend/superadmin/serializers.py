from rest_framework import serializers
from .models import Branch, Staff, Student, Affiliate
from decimal import Decimal


class BranchSerializer(serializers.ModelSerializer):
    staff_count = serializers.IntegerField(source='staff_members.count', read_only=True)
    students_count = serializers.IntegerField(source='students.count', read_only=True)

    class Meta:
        model = Branch
        fields = [
            'id',
            'name',
            'code',
            'city',
            'address',
            'manager_name',
            'phone',
            'email',
            'revenue_share_percentage',
            'status',
            'staff_count',
            'students_count',
            'created_at',
            'updated_at',
        ]


class StaffSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = Staff
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'role_display',
            'department',
            'branch',
            'branch_name',
            'joining_date',
            'salary',
            'status',
            'created_at',
            'updated_at',
        ]


class StudentSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    fee_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id',
            'registration_number',
            'first_name',
            'last_name',
            'email',
            'phone',
            'gender',
            'branch',
            'branch_name',
            'course_name',
            'batch_timing',
            'fee_total',
            'fee_paid',
            'fee_remaining',
            'fee_status',
            'certification_status',
            'status',
            'created_at',
            'updated_at',
        ]

    def get_fee_remaining(self, obj):
        return max(Decimal('0.00'), obj.fee_total - obj.fee_paid)


class AffiliateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Affiliate
        fields = [
            'id',
            'name',
            'affiliate_code',
            'email',
            'phone',
            'commission_rate',
            'total_referrals',
            'total_earnings',
            'pending_payout',
            'payout_details',
            'status',
            'created_at',
            'updated_at',
        ]

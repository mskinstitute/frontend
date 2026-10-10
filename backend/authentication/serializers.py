from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
import re

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone',
            'gender',
            'role',
            'picture',
            'date_joined',
        ]
        read_only_fields = ['id', 'username', 'role', 'date_joined']

    def get_picture(self, obj):
        if obj.picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.picture.url)
            return obj.picture.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=6,
        error_messages={'min_length': 'Password must be at least 6 characters long.'}
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'password',
            'gender',
        ]
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False},
            'phone': {'required': True, 'allow_blank': False},
            'gender': {'required': True, 'allow_blank': False},
        }

    def validate_email(self, value):
        norm_email = value.lower().strip()
        if User.objects.filter(email__iexact=norm_email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return norm_email

    def validate_phone(self, value):
        cleaned_phone = re.sub(r'[\s\-\(\)]', '', value)
        if len(cleaned_phone) < 7:
            raise serializers.ValidationError("Please provide a valid phone number.")
        if User.objects.filter(phone=cleaned_phone).exists():
            raise serializers.ValidationError("An account with this phone number already exists.")
        return cleaned_phone

    def validate_gender(self, value):
        gender_lower = value.lower().strip()
        valid = [c[0] for c in User.GENDER_CHOICES]
        if gender_lower not in valid:
            raise serializers.ValidationError(f"Gender must be one of: {', '.join(valid)}.")
        return gender_lower

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data['email']
        base_username = email.split('@')[0]
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{suffix}"
            suffix += 1

        user = User.objects.create_user(
            username=username,
            password=password,
            **validated_data
        )
        return user


class ForgotPasswordRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)

    def validate_identifier(self, value):
        val = value.strip()
        user = User.objects.filter(
            Q(email__iexact=val) |
            Q(phone__iexact=val) |
            Q(username__iexact=val)
        ).first()
        if not user:
            raise serializers.ValidationError("No account found matching this email, phone, or username.")
        return val


class ResetPasswordConfirmSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    otp = serializers.CharField(required=True, min_length=4, max_length=6)
    new_password = serializers.CharField(
        required=True,
        min_length=6,
        write_only=True,
        style={'input_type': 'password'},
        error_messages={'min_length': 'Password must be at least 6 characters long.'}
    )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
import random

from .models import CustomUser, UserSession
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ForgotPasswordRequestSerializer,
    ResetPasswordConfirmSerializer
)

User = get_user_model()


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = serializer.save()
            new_refresh = RefreshToken.for_user(user)
            new_access = new_refresh.access_token

            UserSession.objects.create(
                user=user,
                refresh_token=str(new_refresh),
                refresh_jti=str(new_refresh["jti"]),
                access_jti=str(new_access["jti"]),
            )

            return Response({
                "detail": "User registered successfully.",
                "id": user.id,
                "refresh": str(new_refresh),
                "access": str(new_access),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": getattr(user, "role", "student"),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "gender": user.gender,
                    "picture": request.build_absolute_uri(user.picture.url) if user.picture else None,
                },
            }, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier") or request.data.get("username")
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {"detail": "Username/email/phone and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_obj = CustomUser.objects.filter(
            Q(username__iexact=identifier) |
            Q(email__iexact=identifier) |
            Q(phone__iexact=identifier)
        ).first()

        if not user_obj:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(request, username=user_obj.username, password=password)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        with transaction.atomic():
            old_session = UserSession.objects.filter(user=user).first()
            if old_session:
                try:
                    RefreshToken(old_session.refresh_token).blacklist()
                except Exception:
                    pass
                old_session.delete()

            new_refresh = RefreshToken.for_user(user)
            new_access = new_refresh.access_token

            UserSession.objects.update_or_create(
                user=user,
                defaults={
                    "refresh_token": str(new_refresh),
                    "refresh_jti": str(new_refresh["jti"]),
                    "access_jti": str(new_access["jti"]),
                },
            )

            return Response({
                "id": user.id,
                "refresh": str(new_refresh),
                "access": str(new_access),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": getattr(user, "role", None),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "picture": request.build_absolute_uri(user.picture.url) if user.picture else None,
                },
            }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            UserSession.objects.filter(user=request.user, refresh_jti=token["jti"]).delete()

            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": f"Logout failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    """Override TokenRefreshView to keep UserSession in sync when access token is refreshed."""
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # If refresh succeeded, update the UserSession.access_jti so subsequent requests remain valid
        if response.status_code == 200:
            access_token_str = response.data.get('access')
            refresh_token_str = request.data.get('refresh')
            if access_token_str:
                try:
                    token = AccessToken(access_token_str)
                    user_id = token.get('user_id') or token.get('user') or token.get('user_id')
                    jti = token.get('jti')
                    from .models import UserSession
                    if user_id and jti:
                        try:
                            session = UserSession.objects.get(user_id=user_id)
                            session.access_jti = str(jti)
                            # Optionally update stored refresh token/jti if provided
                            if refresh_token_str:
                                from rest_framework_simplejwt.tokens import RefreshToken as _Refresh
                                try:
                                    session.refresh_token = refresh_token_str
                                    session.refresh_jti = str(_Refresh(refresh_token_str)["jti"])
                                except Exception:
                                    # ignore if refresh parsing fails
                                    pass
                            session.save()
                        except UserSession.DoesNotExist:
                            # no session stored; skip
                            pass
                except Exception:
                    # If parsing fails, ignore and return response as-is
                    pass

        return response


class UserProfileView(APIView):
    """Get authenticated user's profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    """Initiates password reset by issuing a 6-digit OTP."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['identifier']
        user = User.objects.filter(
            Q(email__iexact=identifier) |
            Q(phone__iexact=identifier) |
            Q(username__iexact=identifier)
        ).first()

        otp = str(random.randint(100000, 999999))
        user.reset_otp = otp
        user.reset_otp_expires = timezone.now() + timedelta(minutes=15)
        user.save(update_fields=['reset_otp', 'reset_otp_expires'])

        # In production this would send via email/SMS. For demo & testing, we also return the otp_preview.
        return Response({
            "detail": f"Password reset OTP has been sent to your registered account.",
            "identifier": identifier,
            "otp_preview": otp,
        }, status=status.HTTP_200_OK)


class ResetPasswordConfirmView(APIView):
    """Confirms password reset using identifier, OTP, and new password."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['identifier']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        user = User.objects.filter(
            Q(email__iexact=identifier) |
            Q(phone__iexact=identifier) |
            Q(username__iexact=identifier)
        ).first()

        if not user or not user.reset_otp or user.reset_otp != otp:
            return Response({"detail": "Invalid reset code or identifier."}, status=status.HTTP_400_BAD_REQUEST)

        if user.reset_otp_expires and timezone.now() > user.reset_otp_expires:
            return Response({"detail": "Reset code has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user.set_password(new_password)
            user.reset_otp = None
            user.reset_otp_expires = None
            user.save()

            # Revoke any existing active session
            old_session = UserSession.objects.filter(user=user).first()
            if old_session:
                try:
                    RefreshToken(old_session.refresh_token).blacklist()
                except Exception:
                    pass
                old_session.delete()

        return Response({"detail": "Password reset successful. You can now login with your new password."}, status=status.HTTP_200_OK)

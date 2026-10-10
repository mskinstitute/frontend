from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from authentication.models import UserSession

User = get_user_model()


class AuthenticationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.logout_url = reverse('authentication:logout')
        self.refresh_url = reverse('authentication:token_refresh')
        self.profile_url = reverse('authentication:user_profile')
        self.forgot_password_url = reverse('authentication:forgot_password')
        self.reset_password_url = reverse('authentication:reset_password_confirm')

        self.user_data = {
            "first_name": "Sumit",
            "last_name": "Kumar",
            "email": "sumit@mskinstitute.com",
            "phone": "+919876543210",
            "password": "SecurePassword123!",
            "gender": "male"
        }

    def test_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], "sumit@mskinstitute.com")
        self.assertEqual(response.data['user']['first_name'], "Sumit")
        self.assertEqual(response.data['user']['last_name'], "Kumar")
        self.assertEqual(response.data['user']['phone'], "+919876543210")
        self.assertEqual(response.data['user']['gender'], "male")
        
        # Verify user in database
        user = User.objects.get(email="sumit@mskinstitute.com")
        self.assertTrue(user.check_password("SecurePassword123!"))
        
        # Verify UserSession created
        session = UserSession.objects.filter(user=user).first()
        self.assertIsNotNone(session)

    def test_duplicate_email_registration_fails(self):
        self.client.post(self.register_url, self.user_data, format='json')
        duplicate_data = self.user_data.copy()
        duplicate_data["phone"] = "+919876543211"
        response = self.client.post(self.register_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_duplicate_phone_registration_fails(self):
        self.client.post(self.register_url, self.user_data, format='json')
        duplicate_data = self.user_data.copy()
        duplicate_data["email"] = "other@mskinstitute.com"
        response = self.client.post(self.register_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)

    def test_login_with_email(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_data = {
            "identifier": "sumit@mskinstitute.com",
            "password": "SecurePassword123!"
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], "sumit@mskinstitute.com")

    def test_login_with_phone(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_data = {
            "identifier": "+919876543210",
            "password": "SecurePassword123!"
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_username(self):
        reg_res = self.client.post(self.register_url, self.user_data, format='json')
        username = reg_res.data['user']['username']
        login_data = {
            "identifier": username,
            "password": "SecurePassword123!"
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_logout(self):
        reg_res = self.client.post(self.register_url, self.user_data, format='json')
        access = reg_res.data['access']
        refresh = reg_res.data['refresh']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        logout_res = self.client.post(self.logout_url, {"refresh": refresh}, format='json')
        self.assertEqual(logout_res.status_code, status.HTTP_205_RESET_CONTENT)

    def test_custom_token_refresh(self):
        reg_res = self.client.post(self.register_url, self.user_data, format='json')
        refresh = reg_res.data['refresh']

        refresh_res = self.client.post(self.refresh_url, {"refresh": refresh}, format='json')
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_res.data)

    def test_forgot_and_reset_password_flow(self):
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Request reset OTP
        forgot_res = self.client.post(self.forgot_password_url, {"identifier": "sumit@mskinstitute.com"}, format='json')
        self.assertEqual(forgot_res.status_code, status.HTTP_200_OK)
        otp = forgot_res.data['otp_preview']

        # Reset password
        reset_res = self.client.post(self.reset_password_url, {
            "identifier": "sumit@mskinstitute.com",
            "otp": otp,
            "new_password": "NewSuperPassword999!"
        }, format='json')
        self.assertEqual(reset_res.status_code, status.HTTP_200_OK)

        # Login with new password
        login_res = self.client.post(self.login_url, {
            "identifier": "sumit@mskinstitute.com",
            "password": "NewSuperPassword999!"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

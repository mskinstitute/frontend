# Testing DRF Authentication and Permissions

Testing security boundaries is paramount for any enterprise REST API. You must verify that unauthenticated users are rejected with `401 Unauthorized`, unauthorized authenticated users are blocked with `403 Forbidden`, and role-based or object-level permissions strictly isolate tenant data.

---

## 1. `force_authenticate()` vs Direct Token Generation

DRF's `APIClient` provides the `force_authenticate()` utility. It bypasses the cryptographic validation of headers or tokens and directly attaches the requested `user` and `auth` credentials to `request.user`:

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationSecurityTests(APITestCase):
    def setUp(self):
        self.regular_user = User.objects.create_user(username='alice', password='password123')
        self.admin_user = User.objects.create_superuser(username='superadmin', password='adminpassword')
        self.protected_url = '/api/v1/admin-analytics/'

    def test_unauthenticated_request_rejected(self):
        # Default client is anonymous
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_forbidden(self):
        # Alice is logged in, but not an admin
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_allowed(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticate_resets_client(self):
        self.client.force_authenticate(user=self.admin_user)
        self.client.force_authenticate(user=None)  # Reset to anonymous
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

---

## 2. Testing Real Token & JWT Authentication Flows

While `force_authenticate` is ideal for view logic, you also need tests that verify token generation and parsing:

```python
from rest_framework_simplejwt.tokens import RefreshToken

class JWTHeaderTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='charlie', password='mypassword')
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_jwt_bearer_header_authorization(self):
        url = '/api/v1/user/profile/'
        # Test valid bearer token
        response = self.client.get(
            url,
            HTTP_AUTHORIZATION=f'Bearer {self.access_token}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_bearer_token_fails(self):
        url = '/api/v1/user/profile/'
        response = self.client.get(
            url,
            HTTP_AUTHORIZATION='Bearer invalid.corrupted.token'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

---

## 3. Testing Object-Level Permissions (`IsOwnerOrReadOnly`)

Ensure user A cannot edit or delete user B's records:

```python
from store.models import Review

class ObjectLevelPermissionTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username='userA', password='pwd')
        self.user_b = User.objects.create_user(username='userB', password='pwd')
        self.review_a = Review.objects.create(author=self.user_a, content="Great product!", rating=5)

    def test_user_b_cannot_modify_user_a_review(self):
        self.client.force_authenticate(user=self.user_b)
        url = f'/api/v1/reviews/{self.review_a.id}/'
        response = self.client.patch(url, {'content': 'Hacked review'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        self.review_a.refresh_from_db()
        self.assertEqual(self.review_a.content, "Great product!")

    def test_user_a_can_modify_own_review(self):
        self.client.force_authenticate(user=self.user_a)
        url = f'/api/v1/reviews/{self.review_a.id}/'
        response = self.client.patch(url, {'content': 'Updated review'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.review_a.refresh_from_db()
        self.assertEqual(self.review_a.content, 'Updated review')
```

---

## Practice Quiz

### Q1: What does `client.force_authenticate(user=None)` do in an APITestCase?
- A) Deletes the user from the SQLite database
- B) Resets the APIClient's credentials back to an unauthenticated anonymous user
- C) Revokes all issued OAuth refresh tokens
- D) Sets user credentials to superuser
**Answer:** B
**Explanation:** Calling `force_authenticate(user=None)` resets the client state, making subsequent requests behave as unauthenticated anonymous requests.

### Q2: Which HTTP header parameter is passed in `self.client.get()` to simulate an authorization token header in Django tests?
- A) `AUTH_KEY='...'`
- B) `headers={'Authorization': '...'}`
- C) `HTTP_AUTHORIZATION='Bearer <token>'`
- D) `TOKEN_BEARER='...'`
**Answer:** C
**Explanation:** Django's WSGI test client converts headers prefixed with `HTTP_` into CGI environment headers such as `HTTP_AUTHORIZATION`, which maps to `Authorization`.

### Q3: When testing an endpoint protected by `IsAdminUser`, what response status code should a standard authenticated non-staff user receive?
- A) `401 Unauthorized`
- B) `403 Forbidden`
- C) `404 Not Found`
- D) `400 Bad Request`
**Answer:** B
**Explanation:** When authentication succeeds (the user is recognized) but permission checks fail (user is not staff/admin), DRF returns `403 Forbidden`.

### Q4: Why is testing object-level permissions critical for multi-tenant SaaS or community APIs?
- A) To prevent horizontal privilege escalation where User A modifies User B's resources
- B) To ensure faster JSON response parsing
- C) To bypass database migration checks
- D) To increase Redis cache hit ratios
**Answer:** A
**Explanation:** Object-level permissions guard against Horizontal Privilege Escalation, ensuring users can only mutate resources they explicitly own.

### Q5: What is the main advantage of `force_authenticate` over issuing real tokens in unit tests?
- A) It guarantees full end-to-end network encryption
- B) It skips the hashing, encryption, and DB token lookup overhead, drastically speeding up test suites
- C) It allows bypassing Django model validation rules
- D) It generates mock responses automatically
**Answer:** B
**Explanation:** `force_authenticate` bypasses token decryption, hashing, and lookups by assigning `request.user` directly, allowing hundreds of tests to run in seconds.

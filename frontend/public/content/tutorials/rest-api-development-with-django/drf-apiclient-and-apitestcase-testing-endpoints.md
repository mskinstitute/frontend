# Unit Testing API Endpoints with APIClient and APITestCase

Testing REST APIs is critical for verifying endpoint contracts, status codes, payload structures, database mutations, and regression prevention. Django REST Framework provides testing utilities specifically designed for REST APIs that extend Django's core test framework.

---

## 1. APITestCase vs Standard TestCase

DRF provides `rest_framework.test.APITestCase`, which subclasses Django's `django.test.TestCase` but overrides the default client with DRF's `APIClient`.

| Feature | Django `TestCase` (`Client`) | DRF `APITestCase` (`APIClient`) |
| :--- | :--- | :--- |
| **Default Client** | `django.test.Client` | `rest_framework.test.APIClient` |
| **Payload Formatting** | Expects form-encoded data by default | Supports `format='json'` natively |
| **Authentication Helper** | `client.login()` (session/cookie only) | `client.force_authenticate(user=user)` (session, token, JWT) |
| **Response Headers** | Generic WSGI response | Full access to `response.data`, parsed Python dictionary/list |

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from store.models import Product

User = get_user_model()

class ProductAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='securepassword123')
        self.product = Product.objects.create(
            title='Ergonomic Mechanical Keyboard',
            price=129.99,
            inventory=45,
            sku='KB-MECH-01'
        )
        self.endpoint = '/api/v1/products/'

    def test_list_products_returns_200_ok(self):
        response = self.client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Ergonomic Mechanical Keyboard')

    def test_create_product_authenticated(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'title': 'Wireless Mouse',
            'price': 49.99,
            'inventory': 100,
            'sku': 'MS-WLS-02'
        }
        response = self.client.post(self.endpoint, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        self.assertEqual(response.data['sku'], 'MS-WLS-02')
```

---

## 2. Inspecting `response.data` vs `response.content`

In DRF tests:
- `response.data`: The parsed Python data structure (dict or list) before rendering to JSON string.
- `response.content`: The raw byte string response (e.g., `b'{"id":1,...}'`).
- `response.json()`: Standard JSON parser parsing `response.content`.

Using `response.data` is fastest, cleanest, and most Pythonic in DRF unit tests:

```python
def test_product_detail_payload(self):
    url = f'/api/v1/products/{self.product.id}/'
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIn('sku', response.data)
    self.assertEqual(float(response.data['price']), 129.99)
```

---

## 3. Testing HTTP Methods: PUT, PATCH, and DELETE

```python
def test_patch_partial_update(self):
    self.client.force_authenticate(user=self.user)
    url = f'/api/v1/products/{self.product.id}/'
    patch_payload = {'price': 99.99}
    
    response = self.client.patch(url, patch_payload, format='json')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.product.refresh_from_db()
    self.assertEqual(float(self.product.price), 99.99)

def test_delete_product(self):
    self.client.force_authenticate(user=self.user)
    url = f'/api/v1/products/{self.product.id}/'
    response = self.client.delete(url)
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    self.assertFalse(Product.objects.filter(id=self.product.id).exists())
```

---

## Practice Quiz

### Q1: What is the primary advantage of using DRF's `APITestCase` over standard Django `TestCase`?
- A) It runs tests asynchronously using asyncio threads
- B) It provides an APIClient that supports `format='json'`, `force_authenticate()`, and exposes `response.data` directly
- C) It skips database table migrations to make tests run instantly
- D) It automatically mocks all third-party external HTTP network requests
**Answer:** B
**Explanation:** APITestCase bundles DRF's APIClient, which natively supports JSON payloads, authentication bypass via force_authenticate(), and parses response data into native Python dictionaries.

### Q2: What does `response.data` contain in a DRF APIClient test response?
- A) A raw bytes representation of the JSON string
- B) An HTML formatted string representation of the browsable API
- C) The pre-rendered native Python dict or list data structure returned by the view/serializer
- D) An SQLite database cursor pointer
**Answer:** C
**Explanation:** In DRF APITestCase responses, `response.data` provides the deserialized Python dictionary or list structure before JSON rendering.

### Q3: Why is `self.product.refresh_from_db()` called after a PATCH or PUT test request?
- A) To clear browser cache headers
- B) To reload the in-memory Python model instance with the updated database values persisted by the API
- C) To commit an uncommitted database transaction
- D) To regenerate the primary key UUID
**Answer:** B
**Explanation:** Django model instances stored in memory during test setup retain their original attribute values until `refresh_from_db()` fetches the latest database rows mutated by API endpoints.

### Q4: Which format argument is passed into `self.client.post(url, data, format='json')`?
- A) `format='multipart'`
- B) `format='raw'`
- C) `format='json'`
- D) `format='urlencoded'`
**Answer:** C
**Explanation:** Passing `format='json'` instructs DRF's APIClient to serialize the Python dictionary into JSON and send the appropriate `Content-Type: application/json` header.

### Q5: What status code should a properly implemented DELETE endpoint return according to REST conventions?
- A) `200 OK` or `204 No Content`
- B) `201 Created`
- C) `301 Moved Permanently`
- D) `410 Gone`
**Answer:** A
**Explanation:** REST standard DELETE operations return `204 No Content` when no body is returned, or `200 OK` if a confirmation payload is included.

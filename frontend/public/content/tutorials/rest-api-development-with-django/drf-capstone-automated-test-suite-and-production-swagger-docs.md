# DRF Capstone: Automated Test Suite and Production Swagger Docs

To complete our capstone E-Commerce REST API, we implement comprehensive automated test coverage for the entire checkout flow and configure production-grade OpenAPI documentation.

---

## 1. Full E-Commerce Test Suite

Create `store/tests/test_ecommerce_flow.py`:

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from store.models import Category, Product, Cart, CartItem, Order

User = get_user_model()

class ECommerceAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='john_doe', password='secretpassword123')
        self.category = Category.objects.create(name='Hardware', slug='hardware')
        self.product = Product.objects.create(
            category=self.category,
            title='4K Ultra HD Monitor',
            slug='4k-ultra-hd-monitor',
            description='Crisp 3840x2160 IPS panel',
            price=399.99,
            inventory=10
        )

    def test_complete_e2e_shopping_flow(self):
        # 1. Anonymous user creates a cart
        cart_res = self.client.post('/api/v1/carts/', format='json')
        self.assertEqual(cart_res.status_code, status.HTTP_201_CREATED)
        cart_id = cart_res.data['id']

        # 2. Add product to cart
        add_item_url = f'/api/v1/carts/{cart_id}/items/'
        item_res = self.client.post(
            add_item_url,
            {'product_id': self.product.id, 'quantity': 2},
            format='json'
        )
        self.assertEqual(item_res.status_code, status.HTTP_201_CREATED)

        # 3. Verify unauthenticated checkout fails
        order_url = '/api/v1/orders/'
        unauth_order_res = self.client.post(
            order_url,
            {'cart_id': cart_id, 'shipping_address': '100 Main St, Austin, TX'},
            format='json'
        )
        self.assertEqual(unauth_order_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # 4. Authenticate user and checkout
        self.client.force_authenticate(user=self.user)
        order_res = self.client.post(
            order_url,
            {'cart_id': cart_id, 'shipping_address': '100 Main St, Austin, TX'},
            format='json'
        )
        self.assertEqual(order_res.status_code, status.HTTP_201_CREATED)

        # 5. Verify database state
        self.product.refresh_from_db()
        self.assertEqual(self.product.inventory, 8)  # 10 - 2
        self.assertFalse(Cart.objects.filter(id=cart_id).exists())  # Cart flushed
        self.assertEqual(Order.objects.filter(customer=self.user).count(), 1)
```

---

## 2. Verifying Stock Depletion Fails Gracefully

```python
    def test_checkout_fails_when_quantity_exceeds_stock(self):
        # Create cart and add more than available inventory (15 > 10)
        cart = Cart.objects.create()
        CartItem.objects.create(cart=cart, product=self.product, quantity=15)

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/v1/orders/',
            {'cart_id': str(cart.id), 'shipping_address': '200 Oak Ave'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.product.refresh_from_db()
        self.assertEqual(self.product.inventory, 10)  # Stock untouched
```

---

## 3. Production OpenAPI Documentation Verification

Run the spectacular schema check management command:

```bash
python manage.py spectacular --validate --file schema.yml
```

This verifies that:
1. Every serializer field has a valid OpenAPI primitive or component type.
2. All custom filters and paginators are documented.
3. There are zero schema generator warnings.

---

## 4. Summary of DRF Mastery

| Domain | Key Skills Mastered |
| :--- | :--- |
| **Foundations** | REST statelessness, HTTP status codes, serializers, serialization/deserialization |
| **Views & Routing** | APIView, Generic Views, ViewSets, DefaultRouter, ModelViewSet |
| **Authentication** | TokenAuth, SimpleJWT, Refresh Tokens, Custom Permissions, Object Permissions |
| **Data Optimization** | `django-filter`, SearchFilter, OrderingFilter, PageNumber/Cursor Pagination, `select_related` |
| **Testing** | `APITestCase`, `APIClient`, `force_authenticate`, `factory_boy`, E2E workflows |
| **Documentation** | `drf-spectacular`, OpenAPI 3.0, Swagger UI, Redoc, `@extend_schema` |

---

## Practice Quiz

### Q1: What does `python manage.py spectacular --validate` do?
- A) It runs git pre-commit hooks
- B) It generates the complete OpenAPI 3 schema and validates it against the official OpenAPI specification, identifying missing types or errors
- C) It compiles SCSS files into CSS
- D) It creates an admin user
**Answer:** B
**Explanation:** `spectacular --validate` ensures the generated schema strictly adheres to OpenAPI 3.0 standards and warns of any unmapped serializer fields or syntax issues.

### Q2: In an e-commerce API test, what does `self.product.refresh_from_db()` guarantee after an order checkout?
- A) That the database cache is cleared
- B) That the test reads the updated `inventory` value directly from the database to confirm accurate stock decrementing
- C) That the test runner switches from SQLite to PostgreSQL
- D) That Django template cache is invalidated
**Answer:** B
**Explanation:** `refresh_from_db()` updates in-memory attributes with the values stored in the database, allowing tests to confirm that stock was properly decremented.

### Q3: Why should unauthenticated users be blocked from placing orders (`401 Unauthorized`)?
- A) Because guest orders are physically impossible in relational databases
- B) To ensure orders are bound to authenticated customer accounts for tracking, billing, and security
- C) To reduce network bandwidth
- D) Because DRF does not support POST requests from unauthenticated clients
**Answer:** B
**Explanation:** Enforcing authentication binds orders to verified customer accounts, preventing fraud and enabling order tracking.

### Q4: What happens if a customer attempts to purchase more units than are in stock?
- A) The API crashes with an unhandled 500 error
- B) The view raises a `ValidationError`, returning `400 Bad Request`, and rolls back any database changes
- C) The inventory drops into negative numbers
- D) The item is backordered automatically without notifying the client
**Answer:** B
**Explanation:** Validating stock raises a `ValidationError` returning `400 Bad Request`, and `transaction.atomic` rolls back all mutations so inventory remains unchanged.

### Q5: What is the main benefit of providing both Swagger UI and Redoc documentation endpoints in production?
- A) It speeds up database queries by 2x
- B) Developers get interactive endpoint testing via Swagger UI and a polished, readable three-column reference via Redoc
- C) It allows frontend developers to bypass CORS restrictions
- D) It replaces the need for unit testing
**Answer:** B
**Explanation:** Offering both Swagger UI (for quick, interactive browser testing) and Redoc (for elegant reading and onboarding) provides the best developer experience for API consumers.

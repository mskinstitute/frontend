# Automated API Integration Tests and Model Factories

As test suites grow from tens to hundreds of test cases, manual `Model.objects.create(...)` calls result in fragile, verbose, and difficult-to-maintain test setups. Using `factory_boy` and `faker` provides clean, dynamic mock fixtures, while end-to-end integration tests verify complete business workflows.

---

## 1. Setting Up `factory_boy` for DRF Models

`factory_boy` generates realistic model instances with foreign keys, default attributes, and sequence counters.

```bash
pip install factory_boy faker
```

Create `store/factories.py`:

```python
import factory
from django.contrib.auth import get_user_model
from store.models import Category, Product, Order, OrderItem

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Faker('user_name')
    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')

class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Sequence(lambda n: f'Category {n}')
    slug = factory.Sequence(lambda n: f'category-{n}')

class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    category = factory.SubFactory(CategoryFactory)
    title = factory.Faker('catch_phrase')
    sku = factory.Sequence(lambda n: f'SKU-{n:05d}')
    price = factory.Faker('pydecimal', left_digits=3, right_digits=2, positive=True)
    inventory = 50
```

---

## 2. Using Factories in API Integration Tests

Notice how concise and expressive test setup becomes:

```python
from rest_framework.test import APITestCase
from rest_framework import status
from store.factories import UserFactory, ProductFactory, CategoryFactory

class ProductSearchIntegrationTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.cat_laptops = CategoryFactory(name='Laptops')
        self.cat_audio = CategoryFactory(name='Audio')
        
        # Batch create products
        self.macbook = ProductFactory(category=self.cat_laptops, title='Apple MacBook Pro 16')
        self.dell = ProductFactory(category=self.cat_laptops, title='Dell XPS 15')
        self.headphones = ProductFactory(category=self.cat_audio, title='Sony WH-1000XM5 Headphones')

    def test_filter_by_category_returns_matching_products(self):
        response = self.client.get('/api/v1/products/', {'category': self.cat_laptops.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        titles = [p['title'] for p in response.data['results']]
        self.assertIn('Apple MacBook Pro 16', titles)
        self.assertIn('Dell XPS 15', titles)
        self.assertNotIn('Sony WH-1000XM5 Headphones', titles)
```

---

## 3. End-to-End Workflow Testing: Order Checkout

Integration tests should test multi-step workflows representing real client interactions:

```python
class CheckoutWorkflowTests(APITestCase):
    def setUp(self):
        self.customer = UserFactory()
        self.product = ProductFactory(price=100.00, inventory=10)

    def test_complete_checkout_workflow(self):
        self.client.force_authenticate(user=self.customer)
        
        # Step 1: Create Cart
        cart_res = self.client.post('/api/v1/carts/', format='json')
        self.assertEqual(cart_res.status_code, status.HTTP_201_CREATED)
        cart_id = cart_res.data['id']

        # Step 2: Add item to cart
        item_res = self.client.post(
            f'/api/v1/carts/{cart_id}/items/',
            {'product': self.product.id, 'quantity': 2},
            format='json'
        )
        self.assertEqual(item_res.status_code, status.HTTP_201_CREATED)

        # Step 3: Checkout order
        checkout_res = self.client.post(
            '/api/v1/orders/',
            {'cart_id': cart_id, 'shipping_address': '123 Tech Lane, San Francisco, CA'},
            format='json'
        )
        self.assertEqual(checkout_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(checkout_res.data['total_price'], '200.00')

        # Step 4: Verify stock deduction
        self.product.refresh_from_db()
        self.assertEqual(self.product.inventory, 8)
```

---

## Practice Quiz

### Q1: What primary benefit does `factory_boy` provide in Django test suites?
- A) It replaces the PostgreSQL database with an in-memory Redis cache
- B) It provides declarative, reproducible fixtures with realistic fake data and auto-incrementing sequences
- C) It automates browser clicks through Selenium
- D) It formats JSON files according to Prettier standards
**Answer:** B
**Explanation:** `factory_boy` replaces brittle fixture JSON files with Pythonic factories that generate dynamic, realistic test objects and automatically resolve foreign key dependencies.

### Q2: What is `factory.SubFactory()` used for in `factory_boy`?
- A) Creating an HTML template subcomponent
- B) Automatically instantiating and linking a related ForeignKey model instance
- C) Subdividing a unit test into smaller parallel subprocesses
- D) Creating a child Git branch during testing
**Answer:** B
**Explanation:** `factory.SubFactory(OtherFactory)` automatically creates or resolves foreign key relationships when generating parent model instances.

### Q3: How does `factory.Sequence()` prevent database uniqueness constraint collisions?
- A) By hashing the current UTC timestamp
- B) By passing an auto-incrementing integer `n` to generate unique values like `sku-0001`, `sku-0002`
- C) By catching integrity errors and retrying queries
- D) By disabling database unique indexes during test runs
**Answer:** B
**Explanation:** `factory.Sequence(lambda n: ...)` provides a sequential counter `n`, guaranteeing that fields with `unique=True` (usernames, SKUs, slugs) never collide.

### Q4: What distinguishes an integration test from an isolated unit test in DRF?
- A) Integration tests execute only on the staging server
- B) Integration tests execute multi-step workflows across models, serializers, views, and database state transitions
- C) Integration tests do not use Python assert statements
- D) Unit tests cannot test HTTP status codes
**Answer:** B
**Explanation:** Integration tests exercise multiple interacting components (routing, authentication, serialization, business logic, DB mutations) across continuous operational flows.

### Q5: In an end-to-end order placement test, why must `product.refresh_from_db()` be called?
- A) To trigger the browser's service worker
- B) To verify that the database inventory field was properly decremented by the checkout view logic
- C) To flush the Redis cache completely
- D) To reset the test database migrations
**Answer:** B
**Explanation:** Calling `refresh_from_db()` synchronizes the in-memory Python object with the actual updated database row, verifying that inventory was correctly reduced.

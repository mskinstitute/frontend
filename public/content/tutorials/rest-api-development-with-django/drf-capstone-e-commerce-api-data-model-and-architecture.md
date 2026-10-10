# DRF Capstone: E-Commerce API Data Model and Architecture

In this capstone series, we design and build a production-grade, multi-model E-Commerce REST API. We begin by architecting the relational database schema, model relationships, managers, and data flow.

---

## 1. System Architecture & Entity Relationships

An enterprise E-Commerce API requires strict relational integrity across products, categories, shopping carts, orders, and user profiles:

```
[ User ] (Django Auth)
   │
   ├── (1:1) ── [ CustomerProfile ] (phone, address)
   │
   ├── (1:N) ── [ Order ] (status, created_at, total)
   │               │
   │               └── (1:N) ── [ OrderItem ] (product, unit_price, quantity)
   │                               │
   └── (1:1) ── [ Cart ]           │
                   │               ▼
                   └── (1:N) ── [ CartItem ] ── (N:1) ── [ Product ] ── (N:1) ── [ Category ]
```

---

## 2. Model Definitions: Products & Categories

In `store/models.py`:

```python
import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    inventory = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
```

---

## 3. Carts, Orders, and Items

```python
class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        unique_together = [['cart', 'product']]

class Order(models.Model):
    STATUS_PENDING = 'P'
    STATUS_COMPLETE = 'C'
    STATUS_FAILED = 'F'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_COMPLETE, 'Complete'),
        (STATUS_FAILED, 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    placed_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=STATUS_PENDING)
    shipping_address = models.CharField(max_length=255)

    class Meta:
        ordering = ['-placed_at']

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveSmallIntegerField()
```

---

## Practice Quiz

### Q1: Why is `on_delete=models.PROTECT` used for `category` on the `Product` model instead of `CASCADE`?
- A) To prevent accidental cascading deletion of all products when a category is deleted
- B) To encrypt the product table
- C) To speed up SQL index creation
- D) Because Django does not allow CASCADE on foreign keys
**Answer:** A
**Explanation:** `models.PROTECT` raises a `ProtectedError` if an admin attempts to delete a Category that still contains associated products, preventing catastrophic accidental data loss.

### Q2: Why is a UUID primary key preferable to an auto-incrementing integer ID for `Cart` and `Order` models?
- A) UUIDs require 90% less disk space
- B) UUIDs prevent enumeration attacks where malicious users guess competitor or other customer order IDs (e.g., `/orders/1001/`)
- C) UUIDs can only be read by Python
- D) PostgreSQL cannot index integer columns
**Answer:** B
**Explanation:** UUIDs are cryptographically random 128-bit numbers, preventing ID harvesting and enumeration attacks across customer carts and order details.

### Q3: Why does `OrderItem` store a separate `unit_price` field instead of referencing `product.price` dynamically?
- A) Because DRF cannot serialize foreign keys
- B) To freeze the exact price at the moment of purchase, protecting historical order records from subsequent product price changes
- C) To bypass database migration generation
- D) To satisfy Python type checkers
**Answer:** B
**Explanation:** Historical order line items must preserve the exact price paid at checkout regardless of whether product prices increase or decrease in the future.

### Q4: What constraint does `unique_together = [['cart', 'product']]` enforce on `CartItem`?
- A) It ensures that only one product can ever be sold across the entire site
- B) It prevents duplicate rows for the same product in a cart, requiring quantity increments instead of redundant records
- C) It guarantees that cart items never expire
- D) It enforces that each user can only ever have one cart
**Answer:** B
**Explanation:** `unique_together` guarantees a cart contains only one record per product, ensuring quantity increments rather than duplicate entries.

### Q5: What does `MinValueValidator(1)` enforce on `CartItem.quantity`?
- A) Prevents quantities of zero or negative numbers from being saved in the database
- B) Guarantees the customer purchases at least 10 items
- C) Converts floats into integers automatically
- D) Limits maximum items to 1
**Answer:** A
**Explanation:** `MinValueValidator(1)` ensures quantity is at least 1, rejecting invalid payloads with zero or negative item quantities.

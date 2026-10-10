# DRF Capstone: Orders, Cart Checkout, and JWT Workflows

Building on our data models, we now implement the business logic: cart serializers, dynamic calculations, checkout transactions with atomic inventory decrements, and secure JWT authentication.

---

## 1. Serializers for Products, Carts, and Items

In `store/serializers.py`:

```python
from rest_framework import serializers
from decimal import Decimal
from store.models import Category, Product, Cart, CartItem, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    price_with_tax = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description', 'price', 'price_with_tax', 'inventory', 'category']

    def get_price_with_tax(self, product):
        return round(product.price * Decimal(1.10), 2)

class CartItemSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

    def get_total_price(self, cart_item):
        return cart_item.quantity * cart_item.product.price

class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity']

    def validate_product_id(self, value):
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError("No product found with given ID.")
        return value

    def save(self, **kwargs):
        cart_id = self.context['cart_id']
        product_id = self.validated_data['product_id']
        quantity = self.validated_data['quantity']

        try:
            cart_item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
            cart_item.quantity += quantity
            cart_item.save()
            self.instance = cart_item
        except CartItem.DoesNotExist:
            self.instance = CartItem.objects.create(cart_id=cart_id, **self.validated_data)
        return self.instance
```

---

## 2. Atomic Checkout with `transaction.atomic`

When converting a cart to an order:
1. Verify cart is not empty.
2. Check inventory availability.
3. Decrement product stock.
4. Create order & order items.
5. Delete the cart.

```python
from django.db import transaction
from rest_framework.exceptions import ValidationError

class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()
    shipping_address = serializers.CharField(max_length=255)

    def validate_cart_id(self, cart_id):
        if not Cart.objects.filter(pk=cart_id).exists():
            raise ValidationError("Invalid cart ID.")
        if CartItem.objects.filter(cart_id=cart_id).count() == 0:
            raise ValidationError("The shopping cart is empty.")
        return cart_id

    def save(self, **kwargs):
        with transaction.atomic():
            cart_id = self.validated_data['cart_id']
            user = self.context['user']
            shipping_address = self.validated_data['shipping_address']

            # Create Order
            order = Order.objects.create(
                customer=user,
                shipping_address=shipping_address
            )

            cart_items = CartItem.objects.select_related('product').filter(cart_id=cart_id)
            order_items = []

            for item in cart_items:
                product = item.product
                if product.inventory < item.quantity:
                    raise ValidationError(f"Insufficient stock for {product.title}. Available: {product.inventory}")
                
                # Deduct inventory
                product.inventory -= item.quantity
                product.save()

                order_items.append(
                    OrderItem(
                        order=order,
                        product=product,
                        unit_price=product.price,
                        quantity=item.quantity
                    )
                )

            OrderItem.objects.bulk_create(order_items)
            # Flush cart
            Cart.objects.filter(pk=cart_id).delete()

            return order
```

---

## Practice Quiz

### Q1: Why is `transaction.atomic()` indispensable during the order creation workflow?
- A) It prevents SQLite database file locking
- B) If stock is insufficient or order item creation fails, all database changes (inventory deduction, order creation) are completely rolled back
- C) It compresses outgoing JSON responses
- D) It bypasses JWT token validation
**Answer:** B
**Explanation:** `transaction.atomic()` guarantees ACID compliance: if an exception occurs at any point during checkout, every mutation is rolled back, preventing corrupted stock or ghost orders.

### Q2: Why is `OrderItem.objects.bulk_create(order_items)` preferred over calling `.save()` in a loop?
- A) It bypasses Python garbage collection
- B) It executes a single batch `INSERT` SQL statement instead of sending N separate network queries to the database
- C) It validates serializers automatically
- D) It formats currency symbols
**Answer:** B
**Explanation:** `bulk_create` sends a single multi-row SQL `INSERT` statement, eliminating N separate round trips to the database.

### Q3: What happens in `AddCartItemSerializer.save()` if a customer adds a product that already exists in their cart?
- A) A 400 Bad Request error is returned
- B) The existing `CartItem` quantity is incremented rather than creating a duplicate row
- C) The cart is automatically wiped
- D) A new cart is created
**Answer:** B
**Explanation:** The try-except block checks for an existing `CartItem`; if found, it adds the incoming quantity to the existing quantity.

### Q4: Why is `select_related('product')` used when querying `CartItem.objects.filter(cart_id=cart_id)`?
- A) To sort products alphabetically
- B) To perform an SQL JOIN that fetches product titles, prices, and stock in a single query, eliminating the N+1 query problem
- C) To convert strings to uppercase
- D) To verify customer credit card details
**Answer:** B
**Explanation:** `select_related('product')` performs an INNER JOIN to retrieve foreign key product records in the same query, preventing N individual database lookups.

### Q5: Where should `user = self.context['user']` be supplied to the serializer?
- A) In the client's URL query string
- B) Passed via `serializer = CreateOrderSerializer(data=request.data, context={'user': request.user})` in the view
- C) Stored in local browser localStorage
- D) Read from a global Python variable
**Answer:** B
**Explanation:** The calling view passes contextual metadata like `request.user` to the serializer instance via the `context` dictionary.

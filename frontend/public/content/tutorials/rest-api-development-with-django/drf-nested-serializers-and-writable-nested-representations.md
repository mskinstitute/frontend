# DRF Nested Serializers and Writable Nested Representations

In relational domain models, parent and child records are tightly coupled. For example, an **Invoice** contains multiple **InvoiceItems**, or an **Order** contains multiple **OrderLineItems**. While reading nested data is straightforward in DRF, **writable nested serializers** (creating or updating parent and child objects in a single API request) require implementing custom `create()` and `update()` methods.

---

## 1. Read-Only Nested Serialization

Embedding related child representations in read responses is accomplished by nesting child serializers:

```python
# billing/serializers.py
from rest_framework import serializers
from .models import Invoice, InvoiceItem

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["id", "description", "quantity", "unit_price", "total_price"]

class InvoiceDetailSerializer(serializers.ModelSerializer):
    # Read-only nested array of items
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ["id", "invoice_number", "customer_name", "created_at", "items"]
```

---

## 2. The Writable Nested Challenge

By default, calling `serializer.save()` on a nested serializer with writable fields raises an error:

> *"The `.create()` method does not support writable nested fields by default. Write an explicit `.create()` on this serializer."*

Because Django models cannot guess how you wish to handle relational children (whether to update, delete, or create new rows), you must explicitly implement `create()` and `update()`.

---

## 3. Implementing Writable `create()`

```python
# billing/serializers.py
class InvoiceItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["description", "quantity", "unit_price"]

class InvoiceCreateSerializer(serializers.ModelSerializer):
    # Writable nested items array
    items = InvoiceItemWriteSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ["invoice_number", "customer_name", "items"]

    def create(self, validated_data):
        # 1. Pop nested child data out of validated_data
        items_data = validated_data.pop("items", [])

        # 2. Create the parent Invoice instance
        invoice = Invoice.objects.create(**validated_data)

        # 3. Create each child InvoiceItem bound to parent invoice
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        return invoice
```

---

## 4. Implementing Writable `update()`

Updating nested records requires handling three possibilities:
1. Existing items that were modified.
2. New items added to the array.
3. Items omitted from the array that should be deleted.

```python
    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)

        # Update parent fields
        instance.invoice_number = validated_data.get("invoice_number", instance.invoice_number)
        instance.customer_name = validated_data.get("customer_name", instance.customer_name)
        instance.save()

        if items_data is not None:
            # Simple strategy: Replace existing items with incoming set
            instance.items.all().delete()
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)

        return instance
```

---

## 5. Client JSON Request Body

The client can now create the complete parent and children in a single HTTP request:

```http
POST /api/v1/invoices/ HTTP/1.1
Content-Type: application/json

{
  "invoice_number": "INV-2026-0042",
  "customer_name": "Acme Global Corp",
  "items": [
    { "description": "Cloud Hosting Enterprise", "quantity": 1, "unit_price": 1200.00 },
    { "description": "DevOps Maintenance", "quantity": 10, "unit_price": 150.00 }
  ]
}
```

---

## Practice Quiz

### Q1: Why does DRF raise an error if you attempt to save a ModelSerializer with writable nested fields without defining .create()?
- A) Python does not support recursion
- B) DRF cannot predict business logic for nested relations: whether to create, associate existing rows, update in place, or handle unique constraints
- C) ModelSerializer is read-only
- D) It violates JSON standards
**Answer:** B
**Explanation:** Handling nested writes involves ambiguous domain decisions (creating vs updating vs deleting children); DRF requires developers to explicitly define create() and update() behaviors.

### Q2: What Python method removes the nested list from validated_data so the parent model can be instantiated cleanly?
- A) validated_data.pop("items", [])
- B) validated_data.delete("items")
- C) del validated_data
- D) validated_data.clear()
**Answer:** A
**Explanation:** Calling validated_data.pop('items', []) extracts the nested list, leaving only direct parent model fields that can be passed as **validated_data to Model.objects.create().

### Q3: What is a primary performance consideration when reading deeply nested serializers?
- A) Nested serializers disable CSS
- B) Nested serializers can trigger severe N+1 database queries unless parent queries use prefetch_related on child relationships
- C) JSON cannot contain arrays
- D) Nested serializers crash on mobile devices
**Answer:** B
**Explanation:** Without prefetch_related, iterating through parent records will issue separate SQL queries to fetch child items for each parent, creating N+1 bottlenecks.

### Q4: How do you mark a nested serializer as strictly read-only?
- A) Pass read_only=True when declaring the nested serializer attribute (e.g. items = ItemSerializer(many=True, read_only=True))
- B) Set class Meta: editable = False
- C) Make the model read-only
- D) In settings.py
**Answer:** A
**Explanation:** Passing read_only=True ensures the nested serializer is included in serialized outputs but ignored during deserialization and mutations.

### Q5: What is the benefit of writable nested serializers for API clients?
- A) They make requests run over UDP
- B) Clients can create or update complex hierarchical structures (like an order with line items) in a single atomic API transaction without making multiple sequential HTTP calls
- C) They eliminate the need for databases
- D) They bypass authentication
**Answer:** B
**Explanation:** Writable nested serializers enable clients to transmit entire entity graphs in one HTTP transaction, eliminating multi-step roundtrips and orphan records.

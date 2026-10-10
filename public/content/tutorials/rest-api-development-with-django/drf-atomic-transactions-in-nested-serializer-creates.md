# Atomic Transactions in Nested Serializer Creates

When executing multi-table mutations—such as creating an **Order** and its ten associated **OrderItems**, or deducting account balances and inserting ledger logs—partial failures create catastrophic database corruption. If the 9th item fails validation or triggers a database constraint, but the Order and first 8 items were already saved, your database is left with incomplete "orphan" records. **Database Atomic Transactions** guarantee all-or-nothing execution.

---

## 1. The ACID Principle: Atomicity

> *"All-or-nothing."*

In relational database systems, an **Atomic Transaction** guarantees that a series of database operations either **all succeed** (commit) or **all fail** (rollback). If an exception occurs at any point inside the transaction block, every preceding insert or update is completely erased.

```
Without Atomic Transaction:
1. Create Order #991 (Committed!)
2. Insert Item 1 (Committed!)
3. Insert Item 2 (Database Constraint Error!) ──► Crash!
RESULT: Order #991 exists with missing items! (CORRUPT STATE)

With transaction.atomic():
1. BEGIN TRANSACTION
2. Create Order #991
3. Insert Item 1
4. Insert Item 2 ──► Exception caught!
5. ROLLBACK TRANSACTION
RESULT: Database is restored to clean state as if nothing happened!
```

---

## 2. Implementing `transaction.atomic()` in DRF Serializers

Django provides the `django.db.transaction.atomic` context manager:

```python
# billing/serializers.py
from django.db import transaction
from rest_framework import serializers
from .models import Invoice, InvoiceItem

class InvoiceCreateSerializer(serializers.ModelSerializer):
    items = InvoiceItemWriteSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ["invoice_number", "customer_name", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])

        # Wrap all database operations in an atomic transaction block!
        with transaction.atomic():
            # 1. Create parent invoice
            invoice = Invoice.objects.create(**validated_data)

            # 2. Bulk instantiate child items
            items_to_create = [
                InvoiceItem(invoice=invoice, **item_data)
                for item_data in items_data
            ]
            
            # High-performance single SQL INSERT for all children
            InvoiceItem.objects.bulk_create(items_to_create)

        return invoice
```

---

## 3. High-Performance Bulk Creation with `bulk_create`

Notice the use of `bulk_create()` above:
- **Looping `InvoiceItem.objects.create()`:** Executes 10 separate SQL `INSERT` statements.
- **`InvoiceItem.objects.bulk_create(items_list)`:** Executes **exactly 1** SQL multi-row `INSERT` statement (`INSERT INTO items VALUES (...), (...), (...)`), cutting database I/O by 90%!

---

## 4. View-Level vs Serializer-Level Atomicity

You can also wrap entire view actions in transactions using the `@transaction.atomic` decorator:

```python
from django.db import transaction
from rest_framework.viewsets import ModelViewSet

class CheckoutViewSet(ModelViewSet):
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Entire request handler runs inside an atomic transaction
        return super().create(request, *args, **kwargs)
```

---

## 5. Handling Deadlocks & Retries

In high-concurrency systems, concurrent transactions touching the same rows may trigger database deadlocks (`OperationalError: deadlock detected`). Use retry decorators (e.g. `tenacity`) on transactional services to gracefully retry interrupted transactions.

---

## Practice Quiz

### Q1: What does the "Atomicity" property guarantee in database operations?
- A) All data is converted to atomic numbers
- B) A series of database modifications either all complete successfully together, or all roll back completely upon error, leaving no partial changes
- C) Database operations run in parallel
- D) Data is permanently cached in memory
**Answer:** B
**Explanation:** Atomicity enforces the all-or-nothing rule: if any operation within a transaction fails, the entire transaction is rolled back, preventing corrupted partial states.

### Q2: How do you wrap a block of Python code in an atomic database transaction in Django?
- A) with db.lock():
- B) with transaction.atomic():
- C) with transaction.start():
- D) with db.execute_safe():
**Answer:** B
**Explanation:** django.db.transaction.atomic creates a transactional context; any uncaught exception within the block triggers a database ROLLBACK.

### Q3: What is the performance benefit of using bulk_create() over calling .create() in a loop?
- A) bulk_create() deletes invalid records
- B) bulk_create() consolidates all rows into a single multi-value SQL INSERT statement, reducing network roundtrips and transaction overhead
- C) bulk_create() bypasses model validation
- D) bulk_create() runs on Redis
**Answer:** B
**Explanation:** bulk_create issues a single batch SQL query rather than individual INSERT queries per item, drastically accelerating multi-row inserts.

### Q4: What happens if an unhandled exception occurs inside a with transaction.atomic(): block?
- A) Django ignores the exception
- B) Django rolls back the database transaction to its initial pre-block state and re-raises the exception
- C) The database server reboots
- D) The transaction is committed anyway
**Answer:** B
**Explanation:** When an exception escapes an atomic block, Django catches it, issues an SQL ROLLBACK to discard changes made during the block, and bubbles the exception up.

### Q5: When should transaction.atomic() be used in REST API development?
- A) Strictly on GET requests
- B) Whenever a single API action mutates multiple tables, creates parent-child relationships, or transfers balances where partial completion causes data corruption
- C) Only in development mode
- D) On all database queries
**Answer:** B
**Explanation:** Atomic transactions are essential whenever multiple related database mutations must succeed or fail as a unified unit of work.

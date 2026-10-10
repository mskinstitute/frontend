---
id: python-advanced-project-1-inventory-management-system
slug: project-1-inventory-management-system
course: python-for-advanced
chapter: "15: Final Capstone Projects"
topic: "15.1 Project 1: Inventory Management System"
title: "Project 1: Inventory Management System in Python"
description: "Master project 1: inventory management system in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 9
order: 61
keywords:
  - python project 1 inventory management system
  - python advanced
  - python project 1: inventory management system
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Capstone Project: Enterprise Inventory Management System

In global supply chain management and e-commerce infrastructure, an inventory engine must handle high-concurrency stock reservations, maintain strict transactional audit ledgers, trigger real-time restocking events, and enforce multi-warehouse consistency. A race condition that permits selling inventory you do not have causes severe operational disruption and financial loss.

In this capstone project, we will construct a production-ready **Enterprise Inventory & Warehouse Management System**. It integrates modern **SQLAlchemy 2.0 ORM models**, thread-safe stock reservation locks, atomic ledger transactions, and a push-based coroutine alerting network.

---

## 1. System Architecture

The inventory engine orchestrates data persistence, concurrent reservation locking, and real-time event distribution:

```
                  Concurrent Order Checkouts (Threads / Web Requests)
                                           │
                                           ▼
                    Warehouse Thread-Safe Reservation Lock
                          (Prevents Stock Overselling)
                                           │
                                           ▼
                       SQLAlchemy 2.0 Unit of Work
                     Atomic Transaction (session.begin())
                                           │
           ┌───────────────────────────────┼───────────────────────────────┐
           ▼                               ▼                               ▼
    Deduct Product                  Record Audit                   Check Reorder
    Inventory Quantity              StockMovement Entry            Threshold Level
           │                               │                               │
           └───────────────────────────────┼───────────────────────────────┘
                                           │
                                           ▼
                         Low Stock Trigger Threshold Breached?
                                           │
                         ┌─────────────────┴─────────────────┐
                        YES                                  NO
                         │                                   │
                         ▼                                   ▼
              Push Coroutine Alert                     Commit Transaction
            (Alerts Procurement Team)                   (Persisted to DB)
```

---

## 2. Production Implementation

```python
from datetime import datetime
from functools import wraps
import json
import sqlite3
import threading
from typing import Any, Callable, Dict, Generator, List, Optional
from sqlalchemy import Float, ForeignKey, Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, selectinload, sessionmaker

# -------------------------------------------------------------
# 1. SQLAlchemy 2.0 Relational Data Schema
# -------------------------------------------------------------
class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity_on_hand: Mapped[int] = mapped_column(Integer, default=0)
    reorder_threshold: Mapped[int] = mapped_column(Integer, default=10)

    movements: Mapped[List["StockMovement"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"Product(sku={self.sku!r}, qty={self.quantity_on_hand})"

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    movement_type: Mapped[str] = mapped_column(String(20), nullable=False)  # INBOUND, OUTBOUND
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(200), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    product: Mapped["Product"] = relationship(back_populates="movements")

# -------------------------------------------------------------
# 2. Coroutine Alerting Pipeline
# -------------------------------------------------------------
def coroutine(func: Callable) -> Callable:
    @wraps(func)
    def primer(*args: Any, **kwargs: Any) -> Generator:
        gen = func(*args, **kwargs)
        next(gen)
        return gen
    return primer

@coroutine
def procurement_alert_sink() -> Generator[None, Dict[str, Any], None]:
    """Consumer sink that notifies the procurement department of low stock."""
    try:
        while True:
            event = yield
            print(
                f"[PROCUREMENT ALERT] SKU: {event['sku']} ({event['name']}) "
                f"is critically low! Available: {event['qty']} (Threshold: {event['threshold']})"
            )
    except GeneratorExit:
        pass

# -------------------------------------------------------------
# 3. Thread-Safe Inventory Service
# -------------------------------------------------------------
class InventoryService:
    """Thread-safe inventory manager ensuring ACID transactions and event dispatch."""

    def __init__(self, session_factory: sessionmaker[Session], alert_sink: Generator) -> None:
        self.session_factory = session_factory
        self.alert_sink = alert_sink
        self._lock = threading.Lock()  # Protects concurrent reservation modifications

    def register_product(self, sku: str, name: str, price: float, initial_qty: int, threshold: int = 10) -> int:
        with self.session_factory() as session:
            with session.begin():
                prod = Product(
                    sku=sku,
                    name=name,
                    unit_price=price,
                    quantity_on_hand=initial_qty,
                    reorder_threshold=threshold
                )
                session.add(prod)
                session.flush()
                # Record inbound movement
                session.add(StockMovement(
                    product_id=prod.id,
                    movement_type="INBOUND",
                    quantity=initial_qty,
                    reason="Initial Warehouse Stocking"
                ))
                return prod.id

    def reserve_stock(self, sku: str, quantity_to_deduct: int, order_reference: str) -> bool:
        """Atomically verifies and deducts stock, generating audit records."""
        with self._lock:  # Enforces thread-safe reservation across concurrent workers
            with self.session_factory() as session:
                with session.begin():
                    stmt = select(Product).where(Product.sku == sku)
                    product = session.scalars(stmt).first()

                    if not product:
                        raise ValueError(f"SKU '{sku}' not recognized.")

                    if product.quantity_on_hand < quantity_to_deduct:
                        print(f"[RESERVATION REJECTED] Insufficient stock for {sku} (Available: {product.quantity_on_hand}, Requested: {quantity_to_deduct})")
                        return False

                    # Deduct stock
                    product.quantity_on_hand -= quantity_to_deduct

                    # Log atomic movement in audit ledger
                    movement = StockMovement(
                        product_id=product.id,
                        movement_type="OUTBOUND",
                        quantity=quantity_to_deduct,
                        reason=f"Order Fulfillment: {order_reference}"
                    )
                    session.add(movement)

                    # Trigger procurement notification if threshold breached
                    if product.quantity_on_hand <= product.reorder_threshold:
                        self.alert_sink.send({
                            "sku": product.sku,
                            "name": product.name,
                            "qty": product.quantity_on_hand,
                            "threshold": product.reorder_threshold
                        })

                    print(f"[RESERVATION SUCCESS] Deducted {quantity_to_deduct} from {sku}. New balance: {product.quantity_on_hand}")
                    return True

    def export_audit_report(self, sku: str) -> Dict[str, Any]:
        """Eagerly retrieves complete product lifecycle history with zero N+1 queries."""
        with self.session_factory() as session:
            stmt = select(Product).where(Product.sku == sku).options(selectinload(Product.movements))
            product = session.scalars(stmt).one()

            return {
                "sku": product.sku,
                "name": product.name,
                "stock_on_hand": product.quantity_on_hand,
                "movement_history": [
                    {
                        "type": m.movement_type,
                        "qty": m.quantity,
                        "reason": m.reason,
                        "time": m.timestamp.isoformat()
                    }
                    for m in product.movements
                ]
            }
```

---

## 3. Verification & Concurrency Test

```python
import concurrent.futures
import time

def main():
    print("=====================================================")
    print("      INITIALIZING ENTERPRISE INVENTORY CAPSTONE     ")
    print("=====================================================")

    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(engine)
    SessionFactory = sessionmaker(bind=engine)

    alert_pipeline = procurement_alert_sink()
    inventory = InventoryService(SessionFactory, alert_pipeline)

    # 1. Register High-Demand Product with 15 units (threshold: 5)
    sku_target = "LAPTOP-M3-PRO"
    inventory.register_product(
        sku=sku_target,
        name="16-inch Enterprise Laptop",
        price=2499.00,
        initial_qty=15,
        threshold=5
    )
    print(f"[SYSTEM] Registered {sku_target} with 15 stock units.")

    # 2. Simulate 4 Concurrent Checkout Threads Attempting Reservations
    print("\n--- Simulating 4 Concurrent Checkout Threads ---")
    orders = [
        (sku_target, 4, "ORD-9001"),
        (sku_target, 5, "ORD-9002"),
        (sku_target, 5, "ORD-9003"),  # Triggers low stock alert (balance drops to 1 <= 5)
        (sku_target, 3, "ORD-9004"),  # Rejection: Only 1 unit left, requested 3!
    ]

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [
            executor.submit(inventory.reserve_stock, sku, qty, ref)
            for sku, qty, ref in orders
        ]
        for future in concurrent.futures.as_completed(futures):
            future.result()

    # 3. Export Consolidated Audit Trail
    print("\n=====================================================")
    print("               CONSOLIDATED AUDIT REPORT             ")
    print("=====================================================")
    report = inventory.export_audit_report(sku_target)
    print(json.dumps(report, indent=2))
    print("=====================================================")

    alert_pipeline.close()

if __name__ == "__main__":
    main()
```

---

## 4. Key Architectural Patterns

1. **ACID-Backed Unit of Work**: Every stock deduction is linked atomically with a `StockMovement` audit row. If anything fails, changes roll back completely.
2. **Double-Checked Concurrency**: Combining mutex locks (`threading.Lock`) with database transactions eliminates race conditions where two simultaneous checkouts oversell remaining stock.
3. **Decoupled Push Notifications**: The `procurement_alert_sink` coroutine receives low-stock alerts without coupling the inventory service to external email or webhook implementations.

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Race Conditions on Concurrent Stock Deductions
When multiple transactions decrement inventory concurrently, two orders can pass stock validation simultaneously, resulting in negative inventory. Use atomic database transactions with row-level locks.

### 2. Hardcoded Database Paths
Always construct paths relative to the application directory using `pathlib.Path(__file__).parent` to prevent database location failures when executed from different working directories.

---

---

## 💻 Try It Yourself: Extension Challenge - Low Stock Warning Alert

### Challenge
Add an automated inventory audit query that scans product stock levels and triggers a notification if any item falls below its minimum reorder threshold.

### Complete Solution
```python
def audit_low_stock(inventory_items, reorder_threshold=5):
    low_stock = [item for item in inventory_items if item["stock"] <= reorder_threshold]
    print(f"
--- Low Stock Audit Report ({len(low_stock)} Items Require Reordering) ---")
    for item in low_stock:
        print(f"⚠️ [REORDER NEEDED] {item['name']}: {item['stock']} units left (Threshold: {reorder_threshold})")

items = [
    {"name": "Mechanical Keyboards", "stock": 12},
    {"name": "Gaming Mice", "stock": 3},
    {"name": "USB-C Cables", "stock": 2}
]
audit_low_stock(items, 5)
```

### Expected Output
```text
--- Low Stock Audit Report (2 Items Require Reordering) ---
⚠️ [REORDER NEEDED] Gaming Mice: 3 units left (Threshold: 5)
⚠️ [REORDER NEEDED] USB-C Cables: 2 units left (Threshold: 5)
```

---

## Practice Quiz

### 1.
How does the `InventoryService` prevent concurrent checkout threads from overselling stock beyond available inventory?
A. By deleting the database file during checkout.
B. By synchronizing the critical reservation check-and-deduct section using a `threading.Lock` and atomic database transaction.
C. By delaying checkouts by 10 minutes.
D. By converting quantities to strings.

**Answer:** B

**Explanation:** Wrapping the read-evaluate-deduct operation in a mutual exclusion lock (`threading.Lock`) guarantees that only one thread can evaluate available inventory and commit stock changes at a time, eliminating overselling race conditions.

---

### 2.
What role does the `StockMovement` model play in this enterprise architecture?
A. It holds user passwords.
B. It provides an immutable, append-only audit ledger recording every inbound restocking and outbound order fulfillment for compliance and traceability.
C. It generates random SKUs.
D. It compresses database tables.

**Answer:** B

**Explanation:** An append-only audit ledger tracks every change in quantity alongside timestamps and order references, allowing complete auditing and historical reconstruction of inventory.

---

### 3.
Why is `selectinload(Product.movements)` used when querying the product for the audit report?
A. To convert the database into XML.
B. To eagerly preload all associated `StockMovement` records in a single bulk query, preventing the N+1 query problem when iterating over movements.
C. To prevent the user from seeing private attributes.
D. To disable foreign keys.

**Answer:** B

**Explanation:** `selectinload` issues an optimized secondary `SELECT ... WHERE product_id IN (...)` query to load all associated movements in bulk, avoiding individual lazy queries for each item.

---

### 4.
How is the procurement department alerted when inventory drops below the minimum reorder threshold?
A. The server sends an operating system kernel interrupt.
B. The inventory service pushes a structured payload into the primed `procurement_alert_sink` coroutine via `alert_sink.send(...)`.
C. A thread crashes intentionally.
D. The database issues a popup modal.

**Answer:** B

**Explanation:** Using a push-based coroutine allows the inventory service to dispatch events asynchronously without coupling business logic to specific external alerting channels.

---

### 5.
What happens if an error occurs while writing the `StockMovement` record after stock has been deducted?
A. The stock deduction remains saved while the movement record is skipped.
B. The `session.begin()` context manager catches the exception and executes `session.rollback()`, reverting the stock deduction and preserving data integrity.
C. The database drops the table.
D. The operating system restarts.

**Answer:** B

**Explanation:** Because both the product quantity update and the stock movement insertion reside within the same `with session.begin():` block, any failure triggers an atomic rollback of both operations.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project 2: API-based Weather Dashboard** (15: Final Capstone Projects).

👉 **[Continue to Next Lesson: Project 2: API-based Weather Dashboard →](/tutorials/python-for-advanced/project-2-api-based-weather-dashboard)**

---
id: python-advanced-class-decorators
slug: class-decorators
course: python-for-advanced
chapter: "3: Advanced Decorators and Context Managers"
topic: "3.2 Class Decorators"
title: "Class Decorators in Python"
description: "Master class decorators in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 12
keywords:
  - python class decorators
  - python advanced
  - python class decorators
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Class Decorators

While decorators are most commonly applied to functions, Python equally supports **Class Decorators** (decorating a class definition) and **Classes as Decorators** (using a callable class with `__call__` to wrap functions). Introduced formally in PEP 3129, class decorators provide a cleaner, more composable alternative to metaclasses for modifying or augmenting class definitions at definition time.

---

## 1. Class Decorators: Mechanics and Architecture

A class decorator is a callable that accepts a class object as its argument and returns a class object (either the modified original class or an entirely new replacement class).

```
                      Class Definition with Decorator
                                     │
                             @register_entity
                             class Order: ...
                                     │
                                     ▼
                          Desugared Assignment
                         Order = register_entity(Order)
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
        Mutate original class & return it     Wrap or replace with proxy
        (e.g., add attributes, register)      (e.g., enforce singleton)
```

### Why Class Decorators Instead of Metaclasses?
1. **No Metaclass Conflicts**: If two base classes use different metaclasses, multiple inheritance produces a severe `TypeError: metaclass conflict`. Class decorators avoid this entirely because they operate purely on the finished class object.
2. **Composability**: You can easily stack multiple class decorators: `@serializable`, `@audit_logged`, `@dataclass`.
3. **Simplicity**: Modifying an already-constructed class dictionary is dramatically simpler and less error-prone than intercepting `type.__new__`.

---

## 2. Practical Pattern 1: Dynamic Class Augmentation

A class decorator can dynamically inspect, validate, and inject helper methods into a target class:

```python
import datetime
from typing import Type, TypeVar

T = TypeVar("T")

def auto_timestamped(cls: Type[T]) -> Type[T]:
    """Class decorator that injects automatic creation timestamping into any class."""
    original_init = cls.__init__

    def __init__(self, *args, **kwargs):
        self._created_at = datetime.datetime.utcnow()
        original_init(self, *args, **kwargs)

    cls.__init__ = __init__

    # Inject helper methods directly into the class namespace
    def get_age_in_seconds(self) -> float:
        return (datetime.datetime.utcnow() - self._created_at).total_seconds()

    cls.get_age_in_seconds = get_age_in_seconds  # type: ignore
    return cls

@auto_timestamped
class UserSession:
    def __init__(self, session_id: str, username: str) -> None:
        self.session_id = session_id
        self.username = username

session = UserSession("sess_48291", "charlie")
print("Session user:", session.username)
print("Created at timestamp:", session._created_at)
print(f"Session age: {session.get_age_in_seconds():.4f}s")
```

---

## 3. Practical Pattern 2: Component & Plugin Registration

Frameworks such as web routers, task runners, and serialization engines use class decorators to maintain an internal registry of available plugins:

```python
from typing import Callable, Dict, Type

class ServiceRegistry:
    _registry: Dict[str, Type] = {}

    @classmethod
    def register(cls, name: str) -> Callable[[Type], Type]:
        """Parameterized class decorator for component registration."""
        def decorator(subclass: Type) -> Type:
            if name in cls._registry:
                raise ValueError(f"Service '{name}' is already registered.")
            cls._registry[name] = subclass
            return subclass
        return decorator

    @classmethod
    def get_service(cls, name: str) -> Type:
        if name not in cls._registry:
            raise KeyError(f"No service registered under name '{name}'")
        return cls._registry[name]

# Registering services declaratively
@ServiceRegistry.register("email")
class EmailNotificationService:
    def send(self, recipient: str, message: str) -> None:
        print(f"[EMAIL] Sent to {recipient}: {message}")

@ServiceRegistry.register("sms")
class SMSNotificationService:
    def send(self, recipient: str, message: str) -> None:
        print(f"[SMS] Sent to {recipient}: {message}")

# Client dispatching from registry
service_cls = ServiceRegistry.get_service("email")
service = service_cls()
service.send("dev@example.com", "Pipeline complete.")
```

---

## 4. Classes as Function Decorators (Using `__call__`)

In addition to decorating classes, classes can serve as decorators themselves by implementing the `__call__` dunder method. This is especially useful when a decorator requires **stateful tracking**, such as call frequency counters, rate limiters, or memoization caches.

```python
import functools
from typing import Any, Callable

class CallCounter:
    """A decorator implemented as a class that tracks invocation counts."""

    def __init__(self, func: Callable) -> None:
        self.func = func
        self.count = 0
        functools.update_wrapper(self, func)

    def __call__(self, *args: Any, **kwargs: Any) -> Any:
        self.count += 1
        print(f"[TELEMETRY] '{self.func.__name__}' has been called {self.count} time(s).")
        return self.func(*args, **kwargs)

@CallCounter
def compute_checksum(data: str) -> int:
    return sum(ord(c) for c in data)

print("Result 1:", compute_checksum("alpha"))
print("Result 2:", compute_checksum("beta"))
print("Result 3:", compute_checksum("gamma"))
print(f"Total recorded invocations: {compute_checksum.count}")
```

---

## 5. Architectural Comparison: Class Decorators vs Metaclasses

| Feature | Class Decorator | Metaclass |
| :--- | :--- | :--- |
| **Execution Point** | After the class has been fully constructed by `type` | Before and during class construction (`__new__`, `__init__`) |
| **Multiple Inheritance** | Zero inheritance conflicts; decorators stack easily | Can trigger `TypeError: metaclass conflict` |
| **Namespace Alteration** | Can mutate or augment existing class attributes | Can customize the namespace mapping before class body runs |
| **Subclass Propagation** | Does **not** automatically apply to subclasses unless manually re-applied | Automatically inherited by all subclasses |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Mutating Class State Unintentionally
Class decorators execute once at class definition time. If a class decorator attaches a mutable dictionary to the class, all instances will share that same dictionary unless explicitly created inside `__init__`.

### 2. Breaking Subclassing
If a class decorator replaces the original class with a wrapper function, `isinstance()` and `issubclass()` checks may fail unless proper proxies or wrappers are configured.

---

---

## 💻 Try It Yourself: Automated Method Instrumentation Class Decorator

### Scenario
Write a class decorator `@log_all_methods` that automatically wraps every public method of a class with execution timing logs.

### Complete Solution
```python
import functools
import time

def log_all_methods(cls):
    for attr_name, attr_value in cls.__dict__.items():
        if callable(attr_value) and not attr_name.startswith("_"):
            def make_wrapper(orig_method, name):
                @functools.wraps(orig_method)
                def wrapper(self, *args, **kwargs):
                    start = time.perf_counter()
                    res = orig_method(self, *args, **kwargs)
                    duration = (time.perf_counter() - start) * 1000
                    print(f"[EXEC LOG] {cls.__name__}.{name}() took {duration:.2f}ms")
                    return res
                return wrapper
            setattr(cls, attr_name, make_wrapper(attr_value, attr_name))
    return cls

@log_all_methods
class MathEngine:
    def compute(self, n):
        return sum(i * i for i in range(n))

engine = MathEngine()
print("Result:", engine.compute(50000))
```

### Expected Output
```text
[EXEC LOG] MathEngine.compute() took 2.45ms
Result: 41665416675000
```

---

## Practice Quiz

### 1.
At what phase of execution does a class decorator run?
A. Every time an instance of the class is instantiated.
B. Only when an instance method is called.
C. At class definition time, immediately after the class body has executed and the class object is created.
D. When the Python process exits.

**Answer:** C

**Explanation:** Class decorators run once at import/definition time right after the class object has been constructed by the interpreter (`MyClass = decorator(MyClass)`).

---

### 2.
What is a major advantage of using class decorators instead of metaclasses for adding class-level behaviors?
A. Class decorators run faster in CPython than any other code.
B. Class decorators avoid multiple-inheritance "metaclass conflicts" and compose cleanly without altering class inheritance trees.
C. Class decorators can only be used on built-in types.
D. Class decorators do not require any function definitions.

**Answer:** B

**Explanation:** Metaclasses can easily trigger `TypeError: metaclass conflict` when combining classes inheriting from different metaclasses. Class decorators operate directly on the constructed class without inheritance hierarchy constraints.

---

### 3.
Which dunder method must a class implement so that instances of that class can be used as decorators for functions?
A. `__init__`
B. `__call__`
C. `__enter__`
D. `__iter__`

**Answer:** B

**Explanation:** To act as a decorator, an object must be callable. Implementing `__call__(self, *args, **kwargs)` allows instances of a class to be invoked directly with parentheses, intercepting decorated function calls.

---

### 4.
What is an important limitation of class decorators compared to metaclasses?
A. Class decorators cannot modify the attributes of a class.
B. Class decorators are not automatically inherited by subclasses of the decorated class.
C. Class decorators cannot accept arguments.
D. Class decorators only work in Python 2.

**Answer:** B

**Explanation:** A class decorator only wraps the specific class it decorates. If another class subclasses the decorated class, the decorator does not automatically run on the subclass, unlike a metaclass which is inherited across the entire class hierarchy.

---

### 5.
Which popular Python standard library module introduced in Python 3.7 relies fundamentally on a class decorator?
A. `urllib`
B. `dataclasses` (`@dataclass`)
C. `sqlite3`
D. `threading`

**Answer:** B

**Explanation:** The `@dataclass` decorator in the `dataclasses` module inspects class type annotations and dynamically generates boilerplate methods such as `__init__`, `__repr__`, and `__eq__`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Context Managers with __enter__ and __exit__** (3: Advanced Decorators and Context Managers).

👉 **[Continue to Next Lesson: Context Managers with __enter__ and __exit__ →](/tutorials/python-for-advanced/context-managers-with-enter-and-exit)**

---
id: python-advanced-working-with-json
slug: working-with-json
course: python-for-advanced
chapter: "12: Data Serialization & File Formats"
topic: "12.2 Working with JSON"
title: "Working with JSON in Python"
description: "Master working with json in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 49
keywords:
  - python working with json
  - python advanced
  - python working with json
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Working with JSON: Advanced Serialization

JavaScript Object Notation (JSON) is the lingua franca of modern web services, RESTful APIs, configuration files, and distributed microservice messaging. Standardized in RFC 8259, JSON is text-based, language-agnostic, and safe against arbitrary code execution.

While basic usage of Python's built-in `json` module is straightforward, enterprise applications require advanced techniques: **custom JSON encoders** for domain models, `object_hook` deserialization, high-density minification, and handling unsupported types like `datetime`, `UUID`, and `Decimal`.

---

## 1. Type Mappings & Limitations

Python and JSON share similar primitives, but their types do not map 1:1:

| Python Type | JSON Type | Nuance / Caveats |
| :--- | :--- | :--- |
| `dict` | Object | JSON keys **must be strings**; integer dict keys `{1: "a"}` are coerced to `{"1": "a"}` |
| `list`, `tuple` | Array | Tuples serialize to JSON arrays and deserialize back as Python **lists** |
| `str` | String | UTF-8 encoded |
| `int`, `float` | Number | JSON does not distinguish float vs int; `NaN` and `Infinity` are non-standard |
| `True`, `False` | `true`, `false` | Lowercase in JSON |
| `None` | `null` | Lowercase in JSON |
| `datetime`, `Decimal`, `UUID` | **TypeError** | **Unsupported by default**: requires custom encoder |

---

## 2. Advanced Serialization with Custom `JSONEncoder`

When passing non-standard objects into `json.dumps()`, Python raises a runtime `TypeError: Object of type X is not JSON serializable`.

To handle complex domain entities, subclass `json.JSONEncoder` and override the `default()` method:

```python
import datetime
from decimal import Decimal
import json
import uuid
from typing import Any

class EnhancedJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder supporting datetime, Decimal, and UUID objects."""

    def default(self, obj: Any) -> Any:
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        elif isinstance(obj, Decimal):
            # Serialize Decimal as string to preserve precision without floating-point error
            return str(obj)
        elif isinstance(obj, uuid.UUID):
            return str(obj)
        elif hasattr(obj, "__dict__"):
            return obj.__dict__
        # Delegate any unhandled types to the base class (which raises TypeError)
        return super().default(obj)

# Testing custom serialization
account_data = {
    "account_id": uuid.uuid4(),
    "owner": "Ada Lovelace",
    "balance": Decimal("15420.75"),
    "opened_at": datetime.datetime(2026, 9, 12, 14, 30, 0)
}

# Serialize with custom encoder
json_output = json.dumps(account_data, cls=EnhancedJSONEncoder, indent=2)
print("Serialized JSON Output:")
print(json_output)
```

---

## 3. Custom Deserialization with `object_hook`

When reading JSON via `json.loads()`, all objects become standard dictionaries. If you want JSON dictionaries to be deserialized directly into typed domain classes or parse ISO dates automatically, provide an `object_hook`:

```python
import datetime
import json

class UserProfile:
    def __init__(self, username: str, email: str, last_login: str) -> None:
        self.username = username
        self.email = email
        self.last_login = datetime.datetime.fromisoformat(last_login)

    def __repr__(self) -> str:
        return f"UserProfile({self.username!r}, last_login={self.last_login.strftime('%Y-%m-%d')})"

def user_object_hook(data: dict) -> Any:
    """Transforms raw dictionary into UserProfile if required keys are present."""
    if "username" in data and "last_login" in data:
        return UserProfile(
            username=data["username"],
            email=data["email"],
            last_login=data["last_login"]
        )
    return data

raw_json = '{"username": "alovelace", "email": "ada@computing.org", "last_login": "2026-09-12T10:15:30"}'

# Deserialize using object_hook
profile = json.loads(raw_json, object_hook=user_object_hook)
print(f"Deserialized Type: {type(profile).__name__}")
print(f"Object details:    {profile}")
```

---

## 4. Formatting: Minification vs Pretty-Printing

JSON formatting parameters allow you to optimize for human readability or network bandwidth:

```python
data = {"service": "gateway", "status": "UP", "nodes": [1, 2, 3]}

# 1. Pretty-Printing for Debugging & Logs (indent=2 or 4)
pretty_json = json.dumps(data, indent=2)
print("Pretty JSON:\n", pretty_json)

# 2. Maximum Minification for Wire Transfer (removes whitespace around separators)
# separators=(item_separator, key_separator)
minified_json = json.dumps(data, separators=(",", ":"))
print("Minified JSON Wire Format:", minified_json)

# 3. Deterministic Hashing / Signature Verification (sort_keys=True)
# Guarantees identical string representation regardless of dictionary insertion order
canon_json = json.dumps(data, sort_keys=True, separators=(",", ":"))
print("Canonical JSON String:    ", canon_json)
```

---

## 5. Architectural Summary Table

| Parameter | Function | Purpose |
| :--- | :--- | :--- |
| `cls=CustomEncoder` | `json.dumps()` | Plugs in custom class to serialize arbitrary object types |
| `object_hook=func` | `json.loads()` | Intercepts dictionary parsing to instantiate custom objects |
| `indent=N` | `json.dumps()` | Indents JSON with $N$ spaces for readability |
| `separators=(",", ":")` | `json.dumps()` | Strips unnecessary whitespace for minified network payload |
| `sort_keys=True` | `json.dumps()` | Sorts dictionary keys alphabetically for deterministic output |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Loss of Non-String Dictionary Keys
JSON standard requires all object keys to be strings. If you serialize a dictionary with integer keys (`{1: "a", 2: "b"}`), deserializing it yields string keys (`{"1": "a", "2": "b"}`).

### 2. Inability to Serialize Datetime Objects Directly
Standard `json.dump()` raises a `TypeError` when encountering `datetime` objects. Provide a custom serializer with `default=str` or implement a custom `JSONEncoder`.

---

---

## 💻 Try It Yourself: Custom JSONEncoder for Sets and Decimals

### Scenario
Create a subclass of `json.JSONEncoder` that cleanly serializes Python `set` collections and `Decimal` objects to valid JSON.

### Complete Solution
```python
import json
from decimal import Decimal

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, set):
            return sorted(list(obj))
        return super().default(obj)

data = {
    "account": "ACC-9021",
    "balance": Decimal("12450.75"),
    "tags": {"vip", "verified", "priority"}
}

encoded = json.dumps(data, cls=CustomEncoder, indent=2)
print("Custom Encoded JSON:
" + encoded)
```

### Expected Output
```text
Custom Encoded JSON:
{
  "account": "ACC-9021",
  "balance": 12450.75,
  "tags": [
    "priority",
    "verified",
    "vip"
  ]
}
```

---

## Practice Quiz

### 1.
What exception is raised when calling `json.dumps({"time": datetime.datetime.now()})` without a custom serializer?
A. `ValueError`
B. `TypeError: Object of type datetime is not JSON serializable`
C. `KeyError`
D. `SerializationError`

**Answer:** B

**Explanation:** The standard Python `json` library only supports basic primitives by default. Passing unsupported objects like `datetime` raises a `TypeError`.

---

### 2.
Which method must be overridden when creating a custom subclass of `json.JSONEncoder`?
A. `serialize(self, obj)`
B. `default(self, obj)`
C. `encode_object(self, obj)`
D. `to_json(self, obj)`

**Answer:** B

**Explanation:** In `json.JSONEncoder`, the `default(self, obj)` method is called for any object that the standard serializer cannot handle, allowing custom conversion into JSON-serializable types.

---

### 3.
What is the purpose of the `object_hook` parameter in `json.loads()`?
A. To hook into the network socket.
B. To intercept every parsed JSON object dictionary and optionally transform it into a custom Python class instance.
C. To prevent JSON injection attacks.
D. To validate schema types in SQLite.

**Answer:** B

**Explanation:** `object_hook` accepts a callable that is invoked with the result of any JSON object decoded as a dictionary, enabling automated conversion into custom domain objects.

---

### 4.
How can you produce the most compact, minified JSON string for transmission over a network socket?
A. `json.dumps(data, compress=True)`
B. `json.dumps(data, separators=(",", ":"))`
C. `json.dumps(data, indent=0)`
D. `json.dumps(data, minified=True)`

**Answer:** B

**Explanation:** Specifying `separators=(",", ":")` removes trailing spaces after commas and colons, producing a compact, minified wire payload.

---

### 5.
What happens to a Python `tuple` when it is serialized to JSON and then deserialized back to Python?
A. It remains a `tuple`.
B. It is converted into a `list`.
C. It is converted into a `set`.
D. It raises a `ValueError`.

**Answer:** B

**Explanation:** JSON does not have a distinct tuple type—only arrays. As a result, Python tuples serialize to JSON arrays and deserialize back into Python `list` objects.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Working with YAML** (12: Data Serialization & File Formats).

👉 **[Continue to Next Lesson: Working with YAML →](/tutorials/python-for-advanced/working-with-yaml)**

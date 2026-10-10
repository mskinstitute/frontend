---
id: python-intermediate-working-with-json-files
slug: working-with-json-files
course: python-for-intermediate
chapter: "4: File Handling Advanced"
topic: "4.3 Working with JSON Files"
title: "Working with JSON Files in Python"
description: "Master working with json files in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 18
keywords:
  - python working with json files
  - python intermediate
  - python working with json files
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Working with JSON Files in Python

JSON (JavaScript Object Notation) is the standard data interchange format for modern web APIs, configuration files, cloud services, and NoSQL databases. Python provides native support for encoding and decoding JSON via its built-in `json` module.

---

## 1. JSON vs. Python Data Types

JSON data maps cleanly to Python's primitive data structures. The standard conversion table is:

| Python Type | JSON Equivalent | Notes |
| :--- | :--- | :--- |
| `dict` | `object` | JSON keys must always be strings enclosed in double quotes |
| `list`, `tuple` | `array` | Tuples are serialized to JSON arrays |
| `str` | `string` | Must use double quotes `""` in JSON |
| `int`, `float` | `number` | Same numeric representation |
| `True` / `False` | `true` / `false` | Lowercase in JSON |
| `None` | `null` | Lowercase `null` in JSON |

---

## 2. Serialization: `dump()` vs. `dumps()`

**Serialization** (or "encoding / marshalling") converts an in-memory Python object into a JSON-formatted representation.

- **`json.dumps(obj)`**: Serializes Python object into a **JSON string** (`s` stands for *string*).
- **`json.dump(obj, file)`**: Serializes Python object directly into a **file-like stream**.

### String Serialization with `json.dumps()`

```python
import json

user_profile = {
    "user_id": 1042,
    "username": "coder_dev",
    "is_active": True,
    "roles": ["admin", "developer"],
    "preferences": {
        "theme": "dark",
        "notifications": False
    },
    "metadata": None
}

# Serialize with pretty formatting (indent=4) and sorted keys
json_string = json.dumps(user_profile, indent=4, sort_keys=True)
print(json_string)
```

### File Serialization with `json.dump()`

```python
import json

app_config = {
    "app_name": "CloudSync Pro",
    "version": "2.4.1",
    "timeout_seconds": 30,
    "debug_mode": False
}

# Write directly into a file
with open("config.json", mode="w", encoding="utf-8") as f:
    json.dump(app_config, f, indent=4)

print("Configuration written to config.json.")
```

---

## 3. Deserialization: `load()` vs. `loads()`

**Deserialization** (or "decoding / unmarshalling") parses JSON data into native Python data structures (`dict`, `list`, etc.).

- **`json.loads(str)`**: Decodes a **JSON string** into a Python object.
- **`json.load(file)`**: Reads and decodes JSON directly from a **file stream**.

### Reading from a File with `json.load()`

```python
import json

with open("config.json", mode="r", encoding="utf-8") as f:
    config = json.load(f)

# The result is a standard Python dictionary
print(f"App: {config['app_name']}")
print(f"Debug enabled: {config['debug_mode']}")
print(f"Timeout: {config.get('timeout_seconds')}s")
```

### Parsing Strings with `json.loads()`

```python
import json

raw_api_response = '{"status": 200, "message": "Success", "items_count": 3}'

data = json.loads(raw_api_response)
print(data["message"])  # Output: Success
print(type(data))       # Output: <class 'dict'>
```

---

## 4. Useful Parameters for `json.dump` / `json.dumps`

1. **`indent`**: An integer (typically `2` or `4`) specifying whitespace indentation for readable "pretty printing". If `None`, output is compact single-line JSON.
2. **`sort_keys=True`**: Sorts dictionary keys alphabetically, useful for consistent caching or version control diffs.
3. **`separators=(item_separator, key_separator)`**: Defaults to `(', ', ': ')`. Setting `separators=(',', ':')` eliminates whitespace for minified network payloads.
4. **`ensure_ascii=False`**: Preserves non-ASCII characters (such as accented characters or emojis) instead of escaping them as `\uXXXX`.

```python
import json

data = {"name": "Sita", "city": "Bengaluru", "emoji": "🚀"}

# Minified JSON output with preserved Unicode
minified = json.dumps(data, separators=(',', ':'), ensure_ascii=False)
print(minified)
# Output: {"name":"Sita","city":"Bengaluru","emoji":"🚀"}
```

---

## 5. Handling Non-Serializable Types

By default, Python raises a `TypeError: Object of type ... is not JSON serializable` when trying to serialize types like `datetime`, `Decimal`, sets, or custom class instances.

To solve this, provide a custom converter via the `default` parameter:

```python
import json
from datetime import datetime, date

data = {
    "event": "System Maintenance",
    "timestamp": datetime.now(),
    "unique_tags": {"network", "cloud", "security"}  # Sets are not natively JSON serializable
}

def custom_serializer(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, set):
        return list(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

json_output = json.dumps(data, default=custom_serializer, indent=2)
print(json_output)
```

---

## 6. Error Handling with `JSONDecodeError`

Malformatted JSON raises `json.decoder.JSONDecodeError` upon parsing. Always safeguard file and network operations with targeted error handling:

```python
import json

bad_json_string = "{'invalid': 'single quotes not allowed in JSON'}"

try:
    result = json.loads(bad_json_string)
except json.JSONDecodeError as err:
    print(f"Failed to decode JSON: {err.msg} at line {err.lineno}, column {err.colno}")
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Confusing `json.dump()` with `json.dumps()`
- `json.dump(obj, file)`: Serializes object directly to an open **file stream**.
- `json.dumps(obj)`: Serializes object to a **Python string** (in memory).
Using `dumps()` with a file parameter causes a `TypeError`.

### 2. Trying to Serialize Non-JSON-Compatible Types
Standard JSON does not support Python `datetime`, `set`, or custom class instances directly. Convert them to ISO strings, lists, or dictionaries first, or provide a custom `default` serializer.

---

---

## 💻 Try It Yourself: JSON Configuration Manager

### Scenario
Build a robust configuration manager that stores server settings in a `config.json` file. If the file exists, load the settings; if it is missing, generate default settings and write them formatted with clean indentation.

### Starter Code
```python
import json
import os

CONFIG_FILE = "app_config.json"
DEFAULT_CONFIG = {
    "app_name": "MSK Analytics Portal",
    "version": "1.2.0",
    "debug_mode": True,
    "port": 8080,
    "database": {
        "host": "localhost",
        "name": "analytics_db"
    }
}

# TODO: Implement load_or_create_config(filepath, defaults)
```

### Complete Solution
```python
import json
import os

CONFIG_FILE = "app_config.json"
DEFAULT_CONFIG = {
    "app_name": "MSK Analytics Portal",
    "version": "1.2.0",
    "debug_mode": True,
    "port": 8080,
    "database": {
        "host": "localhost",
        "name": "analytics_db"
    }
}

def load_or_create_config(filepath, defaults):
    if not os.path.exists(filepath):
        print(f"Config not found. Creating default configuration at '{filepath}'...")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(defaults, f, indent=4)
        return defaults
    
    print(f"Loading existing configuration from '{filepath}'...")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

# Test config manager
config = load_or_create_config(CONFIG_FILE, DEFAULT_CONFIG)
print(f"Connected to: {config['app_name']} on port {config['port']}")
```

### Expected Output
```text
Config not found. Creating default configuration at 'app_config.json'...
Connected to: MSK Analytics Portal on port 8080
```

---

## Practice Quiz

### 1. What is the difference between `json.dump()` and `json.dumps()` in Python?
A. `json.dump()` writes directly to a file-like stream, whereas `json.dumps()` returns a formatted JSON string
B. `json.dump()` reads from a database, while `json.dumps()` parses local text
C. `json.dumps()` is deprecated in Python 3 and replaced by `json.dump()`
D. `json.dump()` works only with dictionaries, while `json.dumps()` works only with lists
**Answer:** A
**Explanation:** The trailing `s` in `dumps()` stands for "string". `json.dump()` requires a writable file stream as its second argument, while `json.dumps()` outputs a string in memory.
---

### 2. When converting a Python `tuple` to JSON, what does it become?
A. A JSON object
B. A JSON array
C. A JSON tuple
D. A comma-separated string
**Answer:** B
**Explanation:** Both Python lists and tuples serialize to JSON arrays `[...]` because JSON lacks a distinct tuple primitive.
---

### 3. Which argument can be passed to `json.dumps()` to format the output with clean 4-space indentation?
A. `spacing=4`
B. `tab_size=4`
C. `indent=4`
D. `pretty_print=True`
**Answer:** C
**Explanation:** The `indent` keyword argument specifies indentation whitespace, transforming compact JSON into human-readable multi-line formatted JSON.
---

### 4. What exception is raised when calling `json.loads()` on an invalid JSON string?
A. `json.JSONDecodeError`
B. `SyntaxError`
C. `ValueError`
D. `KeyError`
**Answer:** A
**Explanation:** When parsing invalid JSON syntax (e.g. single quotes or unclosed braces), the `json` module raises `json.decoder.JSONDecodeError` (which inherits from `ValueError`).
---

### 5. Why does Python's `json` module raise a `TypeError` when attempting to serialize a `set` directly?
A. Sets are immutable in Python
B. JSON has no native unordered distinct collection (set) representation
C. Sets require special binary encodings
D. Set elements cannot be cast to strings
**Answer:** B
**Explanation:** Standard JSON specification only supports objects, arrays, strings, numbers, booleans, and null. Sets have no direct representation, so Python requires explicit conversion (e.g. via `list(my_set)`).
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **File Exceptions and Error Handling** (4: File Handling Advanced).

👉 **[Continue to Next Lesson: File Exceptions and Error Handling →](/tutorials/python-for-intermediate/file-exceptions-and-error-handling)**

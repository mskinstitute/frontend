---
id: python-intermediate-parsing-json-data
slug: parsing-json-data
course: python-for-intermediate
chapter: "8: Working with APIs"
topic: "8.3 Parsing JSON Data"
title: "Parsing JSON Data in Python"
description: "Master parsing json data in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 38
keywords:
  - python parsing json data
  - python intermediate
  - python parsing json data
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Parsing JSON Data from Web APIs in Python

The overwhelming majority of modern REST APIs respond with data formatted in **JSON (JavaScript Object Notation)**. Effectively navigating, extracting, and reshaping complex, deeply nested JSON responses is an essential skill for every Python developer.

---

## 1. Extracting JSON with `response.json()`

The `requests` library provides a built-in `.json()` method on `Response` objects. This method decodes the JSON string into native Python dictionaries and lists in a single step:

```python
import requests

response = requests.get("https://jsonplaceholder.typicode.com/users/1", timeout=5)

# Built-in decoder (equivalent to json.loads(response.text))
user_data = response.json()

print(type(user_data))  # <class 'dict'>
print(f"Name: {user_data['name']}")
print(f"Email: {user_data['email']}")
```

If the server responds with non-JSON content (e.g., raw HTML on error pages or empty text), `response.json()` raises `requests.exceptions.JSONDecodeError`.

---

## 2. Navigating Deeply Nested JSON Structures

Real-world API payloads frequently feature deeply nested objects and arrays. Consider this sample structure from JSONPlaceholder:

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "address": {
    "street": "Kulas Light",
    "city": "Gwenborough",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "company": {
    "name": "Romaguera-Crona"
  }
}
```

### Safe Navigation: Direct Indexing vs. `.get()`

Direct indexing (`data["address"]["geo"]["lat"]`) is concise, but if *any* key is missing, Python raises an immediate `KeyError`:

```python
# Risky if any intermediary key might be absent:
# lat = user_data["location"]["coordinates"]["lat"]  # KeyError!

# Defensive extraction using .get() with fallback defaults:
address = user_data.get("address", {})
geo = address.get("geo", {})
latitude = geo.get("lat", "0.0")
print(f"Latitude: {latitude}")
```

---

## 3. Processing Lists of Records

When querying collection endpoints (e.g., `/posts` or `/products`), the root JSON object is typically a **list of dictionaries**:

```python
import requests

res = requests.get("https://jsonplaceholder.typicode.com/posts", params={"userId": 1}, timeout=5)
posts = res.json()

print(f"Total posts retrieved: {len(posts)}")

# Iterate through array of post dictionaries
for p in posts[:3]:
    print(f"[ID #{p['id']}] {p['title'].capitalize()}")
```

---

## 4. Transforming and Filtering with Comprehensions

You can leverage Python list and dictionary comprehensions to filter and project raw API data into concise models:

```python
import requests

res = requests.get("https://jsonplaceholder.typicode.com/todos", timeout=5)
todos = res.json()

# Extract only titles of completed tasks for user 1
completed_titles = [
    item["title"] 
    for item in todos 
    if item["userId"] == 1 and item["completed"] is True
]

print(f"Completed Tasks ({len(completed_titles)}):")
for title in completed_titles[:5]:
    print(f"  ✓ {title}")
```

---

## 5. Defensive Exception Handling Pattern

Always protect JSON parsing operations against both HTTP protocol failures and JSON decoding errors:

```python
import requests

def parse_api_endpoint(url: str):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # Catch 4xx / 5xx
        return response.json()       # Parse payload
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error: {http_err}")
    except requests.exceptions.JSONDecodeError:
        print(f"Failed to parse response as JSON. Raw body: {response.text[:100]}...")
    except requests.exceptions.RequestException as req_err:
        print(f"Network failure: {req_err}")
    return None
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Accessing Missing Keys with Square Brackets
Using `data["key"]` throws a `KeyError` if the key is missing from the API response. Use `data.get("key", default_value)` for resilient parsing.

### 2. Parsing Non-JSON Responses with `.json()`
If the API returns an HTML error page or empty string, calling `response.json()` raises a `requests.exceptions.JSONDecodeError`. Verify `response.status_code` first.

---

---

## 💻 Try It Yourself: Nested JSON Navigator

### Scenario
Parse a deeply nested JSON response representing e-commerce orders, safely extracting customer names and the total order price without raising `KeyError`.

### Complete Solution
```python
orders_json = '''
{
  "order_id": "ORD-9921",
  "customer": {
    "id": 401,
    "profile": {"name": "Priya Patel", "email": "priya@example.com"}
  },
  "items": [
    {"name": "Mechanical Keyboard", "price": 4500, "qty": 1},
    {"name": "Wireless Mouse", "price": 1200, "qty": 2}
  ]
}
'''
import json

data = json.loads(orders_json)
customer_name = data.get("customer", {}).get("profile", {}).get("name", "Unknown")
items = data.get("items", [])
order_total = sum(item.get("price", 0) * item.get("qty", 1) for item in items)

print(f"Customer: {customer_name}")
print(f"Order Total: ₹{order_total:,.2f}")
```

### Expected Output
```text
Customer: Priya Patel
Order Total: ₹6,900.00
```

---

## Practice Quiz

### 1. Which method on a `requests.Response` object parses the JSON response body directly into Python data structures?
A. `response.to_dict()`
B. `response.json()`
C. `response.parse()`
D. `response.decode_json()`
**Answer:** B
**Explanation:** `response.json()` parses the JSON-formatted response text into native Python dicts or lists.
---

### 2. What happens if `response.json()` is invoked on a response containing raw HTML instead of valid JSON?
A. It returns an empty dictionary `{}`
B. It returns `None`
C. It raises a `requests.exceptions.JSONDecodeError`
D. It parses the HTML tags into dictionary keys
**Answer:** C
**Explanation:** If the response text is not valid JSON syntax, `response.json()` raises `requests.exceptions.JSONDecodeError`.
---

### 3. Why is `dict.get("key", default)` preferred over direct bracket notation `dict["key"]` when parsing external API responses?
A. `.get()` executes twice as fast
B. `.get()` returns a default value without raising a `KeyError` if the key is missing
C. `.get()` is required by Python's static type checker
D. Bracket notation is deprecated for dictionary lookups
**Answer:** B
**Explanation:** External API schemas may omit optional fields; `.get()` allows graceful fallback values without triggering `KeyError` exceptions.
---

### 4. If an API returns `[{"id": 1}, {"id": 2}]`, what Python data type does `response.json()` return?
A. A single dictionary
B. A list of dictionaries
C. A set of tuples
D. A string
**Answer:** B
**Explanation:** JSON arrays `[...]` containing objects `{...}` parse directly into Python lists containing dictionaries.
---

### 5. Which Python comprehension allows extracting specific attributes from an API response list into a formatted list?
A. List Comprehension: `[item['field'] for item in data]`
B. Tuple Comprehension
C. Set Casting
D. Lambda Loop
**Answer:** A
**Explanation:** List comprehensions provide a concise and Pythonic mechanism for extracting and filtering attributes across API lists.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Practical API Example** (8: Working with APIs).

👉 **[Continue to Next Lesson: Practical API Example →](/tutorials/python-for-intermediate/practical-api-example)**

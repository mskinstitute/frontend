---
id: python-advanced-substitution-and-splitting
slug: substitution-and-splitting
course: python-for-advanced
chapter: "11: Regular Expressions Advanced"
topic: "11.3 Substitution and Splitting"
title: "Substitution and Splitting in Python"
description: "Master substitution and splitting in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 46
keywords:
  - python substitution and splitting
  - python advanced
  - python substitution and splitting
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Regex Substitution and Splitting

Beyond searching and matching, text processing pipelines frequently require transforming, sanitizing, redacting, and tokenizing text data. In Python, the `re` module provides robust primitives for these workflows through `re.sub()`, `re.subn()`, and `re.split()`.

By utilizing backreferences, dynamic replacement callables, and delimiter-capturing splits, developers can build production-grade text transformation engines.

---

## 1. String Replacement with `re.sub` and Backreferences

The `re.sub(pattern, replacement, string, count=0)` function replaces occurrences of a pattern with a replacement string:

```
 Input String: "2026-09-12"
 Pattern: r"(\d{4})-(\d{2})-(\d{2})"
 Replacement: r"\2/\3/\1"
 Result: "09/12/2026"
```

### Backreferences in Replacement Strings
- **Numbered Backreferences**: `\1`, `\2`, `\3` refer to positional captured groups.
- **Named Group Backreferences**: `\g<name>` refers to named captured groups `(?P<name>...)`. Using `\g<1>` is also safer than `\1` when the replacement string is immediately followed by a literal digit (e.g. `\g<1>0` avoids being parsed as group 10).

```python
import re

# Converting ISO dates (YYYY-MM-DD) to US format (MM/DD/YYYY)
iso_dates = "Release dates: 2024-05-15 and 2025-11-20"
us_dates = re.sub(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})", r"\g<month>/\g<day>/\g<year>", iso_dates)
print("Formatted Dates:", us_dates)
# Output: Release dates: 05/15/2024 and 11/20/2025
```

---

## 2. Dynamic Replacement Functions (Callable `repl`)

When the replacement value depends on computation, database lookup, or conditional logic, `re.sub()` accepts a **callable** that receives a `Match` object and returns a replacement string:

```python
import json
import re

# Redacting and masking Personally Identifiable Information (PII)
def mask_credit_card(match: re.Match) -> str:
    full_card = match.group(0).replace("-", "")
    masked_card = "****-****-****-" + full_card[-4:]
    return masked_card

text = "User transaction: 4111-2222-3333-4444 approved. Backup: 5500-0000-1111-2222."
card_regex = re.compile(r"\b(?:\d{4}-){3}\d{4}\b")

sanitized_text = card_regex.sub(mask_credit_card, text)
print("Sanitized Text:")
print(sanitized_text)
```

### Tracking Transformation Counts with `re.subn`
`re.subn()` performs the exact same substitution as `re.sub()`, but returns a tuple containing the modified string and the total number of substitutions performed:

```python
cleaned_text, sub_count = card_regex.subn(mask_credit_card, text)
print(f"Total credit card instances redacted: {sub_count}")
```

---

## 3. Dynamic Template Variable Interpolation

Template engines like Jinja2 or microservice config injectors use callable replacements to populate variables dynamically:

```python
config_template = "Server {HOST} listening on port {PORT} with env {ENV}."
context = {"HOST": "0.0.0.0", "PORT": "8080", "ENV": "production"}

def interpolate_env_vars(match: re.Match) -> str:
    var_name = match.group(1)
    return str(context.get(var_name, f"[MISSING: {var_name}]"))

resolved_config = re.sub(r"\{([A-Z_]+)\}", interpolate_env_vars, config_template)
print("Resolved Configuration:", resolved_config)
```

---

## 4. Advanced Splitting with `re.split`

Standard `str.split()` only splits on fixed substrings. `re.split()` splits on complex regex patterns:

```python
import re

# Splitting on varied punctuation and whitespace
raw_data = "alpha, beta; gamma   delta\tepsilon"
tokens = re.split(r"[,;\s]+", raw_data)
print("Clean Tokens:", tokens)
# Output: ['alpha', 'beta', 'gamma', 'delta', 'epsilon']
```

### The Delimiter-Capturing Trap
> **Critical Behavior:** If you place capturing parentheses inside the split pattern `re.split(r"([,;])", text)`, Python **retains and includes the delimiters themselves** in the output list! Use non-capturing groups `(?:...)` to avoid including delimiters.

```python
formula = "10+25-4*2"

# 1. With capturing group: retains delimiters
tokens_with_delimiters = re.split(r"([+\-*])", formula)
print("With delimiters:   ", tokens_with_delimiters)
# Output: ['10', '+', '25', '-', '4', '*', '2']

# 2. With non-capturing group: discards delimiters
tokens_clean = re.split(r"(?:[+\-*])", formula)
print("Without delimiters:", tokens_clean)
# Output: ['10', '25', '4', '2']
```

---

## 5. Architectural Summary Table

| Method | Role | Return Value | Special Parameter |
| :--- | :--- | :--- | :--- |
| `re.sub(pat, repl, s)` | Pattern-based substitution | `str` (transformed string) | `repl` can be string or callable |
| `re.subn(pat, repl, s)`| Substitution with count | `(str, int)` | Returns total substitutions made |
| `re.split(pat, s)` | Tokenization on pattern | `list[str]` | Capturing groups include delimiters |
| `\g<name>` | Named backreference | Evaluates to group in replacement | Replaces captured group by identifier |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Backslash Escaping in `re.sub` Replacement Strings
Backslashes in replacement strings are treated as escape sequences or group references (`\1`). To write literal backslashes, escape them or use raw strings.

### 2. Empty Matches in `re.split`
Splitting strings by regex patterns that match at string boundaries can produce leading or trailing empty strings (`""`) in the result list.

---

---

## 💻 Try It Yourself: Masking Sensitive PII with re.sub Callbacks

### Scenario
Use `re.sub()` with a callback replacement function to mask credit card numbers in text, keeping only the last 4 digits visible.

### Complete Solution
```python
import re

text = "User card 4532-8891-2311-9021 charged ₹4,500. Backup card: 5412-3211-9874-1234."

def mask_card(match):
    full_card = match.group(0)
    last4 = full_card[-4:]
    return f"XXXX-XXXX-XXXX-{last4}"

masked_text = re.sub(r"d{4}-d{4}-d{4}-(d{4})", mask_card, text)
print(masked_text)
```

### Expected Output
```text
User card XXXX-XXXX-XXXX-9021 charged ₹4,500. Backup card: XXXX-XXXX-XXXX-1234.
```

---

## Practice Quiz

### 1.
What syntax is used in `re.sub()` replacement strings to reference a named capturing group `(?P<user>\w+)`?
A. `\user`
B. `\g<user>`
C. `$user`
D. `{user}`

**Answer:** B

**Explanation:** In Python regular expressions, named groups are referenced in replacement strings using the `\g<group_name>` syntax.

---

### 2.
What is the return type of `re.subn(pattern, repl, text)`?
A. A single modified string.
B. A tuple containing `(modified_string, substitution_count)`.
C. A dictionary mapping old strings to new strings.
D. An integer count of matches.

**Answer:** B

**Explanation:** `re.subn()` returns a 2-tuple: the transformed string and an integer indicating how many substitutions were made.

---

### 3.
What occurs when `re.split()` is executed with capturing parentheses in the pattern, such as `re.split(r"([;:])", text)`?
A. Python raises a `ValueError`.
B. The delimiters that matched the pattern are retained and included as elements in the resulting list.
C. Delimiters are converted into empty strings.
D. Only the first split is performed.

**Answer:** B

**Explanation:** If capturing parentheses are used in `re.split()`, the matched delimiter substrings are preserved and inserted into the resulting list of tokens.

---

### 4.
What argument does Python pass to a callable function provided as the `repl` argument in `re.sub(pattern, my_func, text)`?
A. The entire original text string.
B. A `re.Match` object representing the current match.
C. An integer index of the match.
D. A list of characters.

**Answer:** B

**Explanation:** When `repl` is a callable, `re.sub()` invokes it for each non-overlapping match, passing the active `re.Match` object as its sole argument.

---

### 5.
Why is `\g<1>0` preferred over `\10` when replacing a group with captured group 1 followed by a literal zero?
A. `\10` is a syntax error in Python.
B. `\10` is interpreted by the regex engine as a reference to capturing group 10 rather than group 1 followed by character `'0'`.
C. `\g<1>0` compiles to binary C code.
D. `\10` inserts an octal newline.

**Answer:** B

**Explanation:** When a group reference is immediately followed by numeric digits, `\g<1>0` disambiguates that you are referencing group 1 followed by a literal `'0'`, rather than group 10.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project: Log File Analyzer** (11: Regular Expressions Advanced).

👉 **[Continue to Next Lesson: Project: Log File Analyzer →](/tutorials/python-for-advanced/project-log-file-analyzer)**

---
id: python-advanced-greedy-vs-non-greedy-matching
slug: greedy-vs-non-greedy-matching
course: python-for-advanced
chapter: "11: Regular Expressions Advanced"
topic: "11.2 Greedy vs Non-Greedy Matching"
title: "Greedy vs Non-Greedy Matching in Python"
description: "Master greedy vs non-greedy matching in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 45
keywords:
  - python greedy vs non greedy matching
  - python advanced
  - python greedy vs non-greedy matching
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Greedy vs Non-Greedy Matching and ReDoS

A deep understanding of regex quantification is the dividing line between brittle, inefficient scripts and high-performance, secure parsing engines. Python's `re` module uses a Non-deterministic Finite Automaton (NFA) with backtracking.

Improper quantifier choices not only introduce logic bugs (such as capturing across multiple HTML tags or quoted strings), but can also expose production services to **Regular Expression Denial of Service (ReDoS)** through catastrophic backtracking.

---

## 1. Greedy vs Lazy (Non-Greedy) Quantifiers

By default, Python quantifiers are **Greedy**: they match as many characters as possible before checking whether the remainder of the pattern succeeds.

Appending a `?` to any quantifier converts it into a **Lazy (Non-Greedy)** quantifier: it matches as few characters as possible, expanding one character at a time only when necessary to satisfy the rest of the pattern.

```
 Target String: <div>First</div><div>Second</div>

 Greedy Pattern: <.*>
 ──► Matches from the very first '<' to the very last '>' across the entire string!
 Result: "<div>First</div><div>Second</div>" (1 match)

 Lazy Pattern: <.*?>
 ──► Stops at the earliest possible '>' character.
 Result: "<div>", "</div>", "<div>", "</div>" (4 matches)
```

### Quantifier Comparison Table

| Greedy Quantifier | Lazy Equivalent | Minimum Matches | Maximum Matches |
| :---: | :---: | :---: | :---: |
| `*` | `*?` | 0 | As many as possible vs As few as possible |
| `+` | `+?` | 1 | As many as possible vs As few as possible |
| `?` | `??` | 0 | 1 vs 0 |
| `{m,n}` | `{m,n}?` | $m$ | $n$ vs $m$ |

```python
import re

html_snippet = '<a href="/login">Sign In</a> and <a href="/signup">Register</a>'

# 1. Greedy extraction bug
greedy_links = re.findall(r'<a href=".*">', html_snippet)
print("Greedy Result:", greedy_links)
# Output: ['<a href="/login">Sign In</a> and <a href="/signup">']  (Overshoots!)

# 2. Lazy extraction fix
lazy_links = re.findall(r'<a href=".*?">', html_snippet)
print("Lazy Result:  ", lazy_links)
# Output: ['<a href="/login">', '<a href="/signup">']
```

---

## 2. Better Than Lazy: The Negated Character Class Pattern

While `.*?` fixes overshooting, lazy matching still incurs repeated backtracking checks at every single character step. 

A cleaner, more performant alternative is the **Negated Character Class** (`[^...]*`):

```python
# Rather than lazy matching across quotes:
# pattern = r'"(.*?)"'

# Prefer negated character classes:
FAST_QUOTE_REGEX = re.compile(r'"([^"\\]*)"')

text = 'Config: name="production_cluster", region="us-east-1"'
matches = FAST_QUOTE_REGEX.findall(text)
print("Extracted attributes:", matches)
# Output: ['production_cluster', 'us-east-1']
```

Why is `[^"]*` superior? It consumes characters in a single forward scan without backtracking, running significantly faster in CPython.

---

## 3. Catastrophic Backtracking and ReDoS Vulnerabilities

Because Python's regex engine uses a backtracking NFA, nested quantifiers with overlapping alternatives can cause the number of execution paths to explode exponentially ($O(2^N)$). This vulnerability is known as **Regular Expression Denial of Service (ReDoS)**.

```
 Pathological Regex: (a+)+$
 Matching against: "aaaaaaaaaaaaaaaaaaaaaaaaaaaa!"
 
 Since the trailing '!' does not match '$', the engine tries every
 possible partitioning of 'a's between the inner and outer '+':
 
 For N = 30 'a's: Over 1,000,000,000 backtracking combinations!
 CPU utilization reaches 100%, freezing the application thread indefinitely.
```

```python
import re
import time

# A vulnerable nested quantifier pattern:
vulnerable_pattern = re.compile(r"^(a+)+$")

# Safe match (short string)
print("Testing short string:", bool(vulnerable_pattern.match("aaaa")))  # True

# Demonstrating exponential latency growth
for length in [18, 20, 22, 24]:
    evil_string = "a" * length + "!"
    start = time.perf_counter()
    vulnerable_pattern.match(evil_string)
    elapsed = time.perf_counter() - start
    print(f"Length {length:02d} 'a's: {elapsed:.4f} seconds")
```

---

## 4. ReDoS Mitigation Techniques

1. **Avoid Nested Ambiguous Quantifiers**: Never nest quantifiers on overlapping character sets (e.g. `(x+)+`, `(\d+|\s+)*`, `(a|b|ab)*`).
2. **Use Strict Anchor Demarcations**: Bound patterns with specific delimiters.
3. **Unroll the Loop**: When matching delimiters, rewrite `(A|B)*` into `A*(BA*)*` where $A$ and $B$ are mutually exclusive sets.
4. **Enforce Input Timeouts**: When parsing untrusted user inputs in web applications, enforce maximum string length limits (e.g. `input_str[:1000]`).

---

## 5. Architectural Summary Table

| Pattern | Engine Behavior | Performance Profile |
| :--- | :--- | :--- |
| `.*` (Greedy) | Matches to end of line, then backtracks backward | High risk of overshooting boundaries |
| `.*?` (Lazy) | Matches minimum characters, testing ahead at each step | Safe from overshooting; moderate backtracking cost |
| `[^x]*` (Negated) | Matches forward deterministically until character `x` | Maximum speed; zero backtracking overhead |
| `(a+)+` (Nested) | Tests all permutations of nested groupings upon failure | Catastrophic $O(2^N)$ exponential CPU freeze (ReDoS) |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Over-Consuming with Greedy `.*`
When matching text inside HTML tags like `<div>first</div><div>second</div>`, greedy `<div>.*</div>` captures the entire string from the first `<div>` to the last `</div>`. Use lazy `<div>.*?</div>`.

### 2. Forgetting Newline Matching Flag
By default, the dot (`.`) matches any character EXCEPT newlines. To match across multiline blocks, include the `re.DOTALL` (or `re.S`) flag.

---

---

## 💻 Try It Yourself: HTML Tag Extraction (Greedy vs Lazy)

### Scenario
Demonstrate how greedy `<.*>` vs non-greedy `<.*?>` behaves when parsing multiple HTML tags within a single string.

### Complete Solution
```python
import re

html_snippet = "<b>Bold Title</b> and <i>Italic Subtitle</i>"

greedy_match = re.findall(r"<.*>", html_snippet)
lazy_match = re.findall(r"<.*?>", html_snippet)

print("Greedy (1 broad match):", greedy_match)
print("Lazy (4 distinct tags):", lazy_match)
```

### Expected Output
```text
Greedy (1 broad match): ['<b>Bold Title</b> and <i>Italic Subtitle</i>']
Lazy (4 distinct tags): ['<b>', '</b>', '<i>', '</i>']
```

---

## Practice Quiz

### 1.
What turns a standard greedy quantifier (such as `*` or `+`) into a lazy (non-greedy) quantifier in Python regular expressions?
A. Prefixing with `!`
B. Appending a question mark `?` (e.g., `*?` or `+?`)
C. Wrapping in square brackets `[+]`
D. Adding the flag `re.LAZY`

**Answer:** B

**Explanation:** Appending a `?` to any standard quantifier transforms it into a lazy quantifier that matches the fewest possible characters needed to satisfy the overall pattern.

---

### 2.
Given the target string `"<b>bold</b> and <i>italic</i>"`, what is the result of applying `re.findall(r"<.*>", string)`?
A. `['<b>', '</b>', '<i>', '</i>']`
B. `['<b>bold</b> and <i>italic</i>']`
C. `['<b>bold</b>', '<i>italic</i>']`
D. `[]`

**Answer:** B

**Explanation:** Because `.*` is greedy, it extends from the first `<` all the way to the final `>` at the very end of the string, capturing the entire line as a single match.

---

### 3.
Why is the negated character class `r'"([^"]*)"'` preferred over the lazy quantifier `r'"(.*?)"'` for extracting quoted strings?
A. Negated character classes are deterministic and scan forward in C without character-by-character backtracking, running substantially faster.
B. Lazy quantifiers cannot handle uppercase letters.
C. Negated character classes automatically strip whitespace.
D. Lazy quantifiers only work in Python 2.

**Answer:** A

**Explanation:** `[^"]*` explicitly instructs the engine to consume everything that is not a quote without needing to repeatedly backtrack and test the remainder of the pattern at each character.

---

### 4.
What is "Catastrophic Backtracking" in regular expressions?
A. When an unclosed parenthesis causes a syntax error.
B. When nested or overlapping quantifiers force a backtracking regex engine to evaluate an exponential number of permutations upon a non-matching input, freezing the CPU (ReDoS).
C. When disk space runs out during pattern compilation.
D. When memory is freed prematurely.

**Answer:** B

**Explanation:** Catastrophic backtracking occurs when an NFA engine attempts an exponential number of branch combinations to satisfy a failing nested quantifier pattern, causing high CPU spikes and application hangs.

---

### 5.
Which of the following regex patterns contains a high risk of catastrophic backtracking (ReDoS)?
A. `^[a-zA-Z0-9_-]+$`
B. `^([a-z]+)+$`
C. `^\d{4}-\d{2}-\d{2}$`
D. `^https?://[^/]+`

**Answer:** B

**Explanation:** The pattern `^([a-z]+)+$` has nested plus quantifiers over the identical character set `[a-z]`. An input of multiple `a`'s followed by an invalid character forces exponential backtracking.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Substitution and Splitting** (11: Regular Expressions Advanced).

👉 **[Continue to Next Lesson: Substitution and Splitting →](/tutorials/python-for-advanced/substitution-and-splitting)**

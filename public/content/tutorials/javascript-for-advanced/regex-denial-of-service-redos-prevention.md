# Regex Denial of Service (ReDoS) Prevention in Modern JavaScript

A critical security vulnerability affecting Node.js microservices and web applications is **Regular Expression Denial of Service (ReDoS)**. An inefficient regex containing nested quantifiers can trigger **Catastrophic Backtracking** when fed crafted user input—locking up the single-threaded Event Loop and consuming 100% CPU indefinitely.

---

## 1. What is Catastrophic Backtracking?

Regular expression engines use backtracking to try alternative match paths when evaluation fails. If a regex contains ambiguous, overlapping nested quantifiers, the number of potential matching paths grows **exponentially ($O(2^n)$)**:

```javascript
// THE VULNERABLE REGEX:
const evilRegex = /(a+)+$/;
```

```
Input: "aaaaaaaaaaaaaaaaaaaaaaaaaaaa!" (28 'a's followed by exclamation)
  • Path 1: (a)(a)(a)... fails at '!'
  • Path 2: (aa)(a)... fails at '!'
  • Path 3: (a)(aa)... fails at '!'
  ... The engine evaluates 2^28 (268,435,456) permutations before failing!
  Result: Node.js main thread freezes for over 4 minutes!
```

---

## 2. Common Vulnerable Patterns (Evil Regexes)

1. **Nested Quantifiers:** `(x+)+`, `(a*)*`, `([a-zA-Z]+)*`
2. **Overlapping Alternation inside Quantifiers:** `(a|a)+$`, `(a|ab)+$`
3. **Repeated Wildcard Captures:** `.*.*=`

```javascript
// DANGEROUS: Email regex frequently found in older tutorials:
const badEmail = /^([a-zA-Z0-9_\.-]+)+@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
// Input: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!" locks the server completely!
```

---

## 3. Strategies to Prevent ReDoS

### 1. Eliminate Nested Quantifiers
Flatten nested quantifiers into simple, mutually exclusive character classes:

```javascript
// SAFE: Linear O(N) evaluation
const safePattern = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$/;
```

### 2. Restrict Input Length
Never run complex regular expressions against arbitrarily long strings:

```javascript
function validateInput(str) {
  // Guard clause: limit string length to prevent polynomial exhaustion
  if (typeof str !== 'string' || str.length > 256) {
    return false;
  }
  return myRegex.test(str);
}
```

### 3. Offload Regex to Web Workers (Browser) or Worker Threads (Node.js)
If evaluating user-supplied regular expressions, isolate them in a worker thread with an execution timeout to prevent freezing the main thread:

```javascript
// In Node.js: Worker Thread with 500ms timeout
const worker = new Worker('./regexWorker.js', { workerData: { regex, input } });

const timeout = setTimeout(() => {
  worker.terminate(); // Kill thread if catastrophic backtracking occurs!
  console.error('ReDoS Attack detected and mitigated!');
}, 500);
```

---

## Practice Quiz

### Q1: What causes a Regular Expression Denial of Service (ReDoS) attack?
- A) A SQL injection payload
- B) Catastrophic backtracking in regexes with overlapping nested quantifiers, causing exponential CPU processing on non-matching inputs
- C) Downloading large CSS files
- D) Exceeding localStorage limits
**Answer:** B
**Explanation:** ReDoS exploits regex patterns with ambiguous nested quantifiers; when fed crafted non-matching input, the engine evaluates exponential permutation paths, locking the CPU.

### Q2: Which of the following regular expressions represents an "Evil Regex" vulnerable to ReDoS?
- A) /^[0-9]{5}$/
- B) /(a+)+$/
- C) /^https?:\/\//
- D) /^[a-z]+$/
**Answer:** B
**Explanation:** `(a+)+$` contains nested plus quantifiers, causing $O(2^n)$ exponential backtracking paths when evaluating sequences of 'a's followed by a non-matching character.

### Q3: Why is ReDoS particularly devastating in Node.js backend applications?
- A) Node.js does not support regular expressions
- B) Node.js runs on a single-threaded Event Loop, meaning a frozen regex blocks ALL incoming user requests across the entire server
- C) It deletes the database
- D) It bypasses firewalls
**Answer:** B
**Explanation:** Because Node.js is single-threaded, a CPU-blocking ReDoS in one request halts the entire Event Loop, denying service to all connected users.

### Q4: What simple defensive check should always precede regex evaluation on user inputs?
- A) Convert to uppercase
- B) Enforce a maximum input length (e.g. str.length <= 100)
- C) Encode as base64
- D) Run JSON.stringify
**Answer:** B
**Explanation:** Restricting input string length limits the maximum potential backtracking permutations, neutralizing exponential blowups.

### Q5: How can a platform safely evaluate untrusted, user-defined regular expressions?
- A) Run them in the main thread with 'use strict'
- B) Execute them inside an isolated Web Worker or Worker Thread with a strict execution timeout (e.g. 200ms) that terminates on failure
- C) Use the /g flag
- D) Encrypt the regex
**Answer:** B
**Explanation:** Running untrusted regexes in isolated worker threads with a watchdog timeout ensures that if catastrophic backtracking occurs, the worker can be safely killed without freezing the app.

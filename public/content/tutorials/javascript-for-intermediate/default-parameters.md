# Default Parameters in ES6+

Before ES6, handling missing function parameters required defensive checks inside the function body. Modern JavaScript allows developers to define **Default Parameters** directly in the function declaration header.

---

## 1. The Legacy Way vs. The Modern ES6 Way

### Legacy Approach (ES5):
```javascript
function sendEmail(to, subject, priority) {
  // Defensive manual fallbacks:
  subject = typeof subject !== "undefined" ? subject : "No Subject";
  priority = typeof priority !== "undefined" ? priority : "normal";

  console.log(`Sending to: ${to} | Subject: ${subject} | Priority: ${priority}`);
}
```

### Modern ES6 Default Parameters:
```javascript
function sendEmail(to, subject = "No Subject", priority = "normal") {
  console.log(`Sending to: ${to} | Subject: ${subject} | Priority: ${priority}`);
}

sendEmail("sumit@mskinstitute.com");
// "Sending to: sumit@mskinstitute.com | Subject: No Subject | Priority: normal"
```

---

## 2. Default Parameters Only Trigger on `undefined`

> [!IMPORTANT]
> A default parameter is applied **ONLY** if the argument passed is **`undefined`** (or completely omitted).
> Values like `null`, `0`, `false`, or `""` are treated as valid, explicit inputs and will **NOT** trigger the default!

```javascript
function setVolume(level = 50) {
  console.log(`Volume: ${level}`);
}

setVolume();          // Volume: 50 (Omitted -> default)
setVolume(undefined); // Volume: 50 (undefined -> default)
setVolume(null);      // Volume: null (null is explicit! Default NOT triggered!)
setVolume(0);         // Volume: 0 (0 is a valid number! Default NOT triggered!)
setVolume(80);        // Volume: 80
```

---

## 3. Dynamic and Evaluated Defaults

In JavaScript, default parameter values are **evaluated at run-time at the moment of function invocation**:
- You can call other functions inside defaults.
- Later parameters can reference earlier parameters in the same signature!

```javascript
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function createUser(name, id = generateId(), timestamp = Date.now()) {
  return { name, id, timestamp };
}

console.log(createUser("Sumit"));
// { name: "Sumit", id: "k7d8f9a", timestamp: 1773534800000 }
```

### Referencing Earlier Parameters:
```javascript
function createDimensions(width, height = width * 1.5) {
  return { width, height };
}

console.log(createDimensions(100)); // { width: 100, height: 150 }
```

---

## 4. Combining Default Parameters with Destructuring

```javascript
// Destructuring with default object fallback to prevent "Cannot read properties of undefined"
function connectToDatabase({ host = "localhost", port = 5432, dbName = "msk_db" } = {}) {
  console.log(`Connected to ${host}:${port}/${dbName}`);
}

// Can be called with partial config:
connectToDatabase({ host: "db.aws.com" }); // Connected to db.aws.com:5432/msk_db

// Can be called with ZERO arguments without throwing!
connectToDatabase(); // Connected to localhost:5432/msk_db
```

---

## Practice Quiz

### Q1: When is a default parameter value applied in JavaScript?
- A) Whenever the argument is falsy (including 0 and empty strings)
- B) Only when the passed argument is `undefined` or omitted
- C) Only when the argument is `null`
- D) Every time the function executes
**Answer:** B
**Explanation:** Default parameters trigger strictly on `undefined` (or omitted arguments); other falsy values like `null`, `0`, or `false` are considered valid explicit arguments.

### Q2: What is the output of `function multiply(a, b = 2) { return a * b; } multiply(5, null);`?
- A) 10
- B) 0 (because $5 \times \text{null}$ coerces `null` to 0)
- C) `undefined`
- D) `TypeError`
**Answer:** B
**Explanation:** Passing `null` does not trigger the default `2`. In multiplication, `null` is coerced to number `0`, giving $5 \times 0 = 0$.

### Q3: When are default parameter expressions evaluated in JavaScript?
- A) At compile time before the program starts
- B) Dynamically at call time, only when the corresponding argument is missing
- C) In an external background worker
- D) Never
**Answer:** B
**Explanation:** Default values are lazily evaluated at runtime when the function is called without that parameter.

### Q4: Can a later default parameter use the value of an earlier parameter in the same function declaration?
- A) No, parameters cannot see each other
- B) Yes, earlier parameters are in scope for subsequent default parameter evaluations (e.g. `(w, h = w * 2)`)
- C) Only in arrow functions
- D) Only in TypeScript
**Answer:** B
**Explanation:** JavaScript parameters are evaluated from left to right; later defaults can access values of earlier parameters.

### Q5: Why is `= {}` added at the end of `function config({ port = 3000 } = {})`?
- A) To create an empty object in the global scope
- B) To allow the function to be called with no arguments (`config()`) without throwing `Cannot read properties of undefined`
- C) To enforce JSON formatting
- D) It is a syntax error
**Answer:** B
**Explanation:** Supplying a default empty object `{}` ensures parameter destructuring does not attempt to unpack `undefined` when no object is passed.

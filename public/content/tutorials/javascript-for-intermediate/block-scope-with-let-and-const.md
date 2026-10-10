# Block Scope with `let` and `const`

In early JavaScript (ES5 and earlier), variable scoping was exclusively determined by functions. With the arrival of ECMAScript 2015 (ES6), **block scoping** was introduced via `let` and `const`. Understanding how block scopes, lexical environments, and the Temporal Dead Zone (TDZ) function under the hood is fundamental to intermediate JavaScript mastery.

---

## 1. Scoping Evolution: Function Scope vs. Block Scope

A **block** in JavaScript is defined as any pair of matching curly braces `{ ... }`:
- Inside `if` / `else` statements
- Inside `for`, `while`, and `do...while` loops
- Inside standalone blocks `{ ... }`

```javascript
// Function Scope (Legacy var):
function testVar() {
  if (true) {
    var greeting = "Hello from var";
  }
  console.log(greeting); // "Hello from var" - Leaked outside the if block!
}

// Block Scope (Modern let & const):
function testLetConst() {
  if (true) {
    let message = "Hello from let";
    const pi = 3.14159;
  }
  console.log(message); // ReferenceError: message is not defined!
  console.log(pi);      // ReferenceError: pi is not defined!
}
```

---

## 2. The Classic Closure in Loops Problem

Consider this classic frontend interview challenge:

```javascript
// ❌ BROKEN WITH VAR:
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Outputs: 3, 3, 3! (Because var i is shared across the entire function scope!)
```

### Why `let` Solves This Elegantly:
In JavaScript engines, `let` inside a `for` loop header creates a **brand new lexical binding for every single iteration**:

```javascript
// ✅ FIXED WITH LET:
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Outputs: 0, 1, 2! (Each timeout closure captures its own private block-scoped `i`!)
```

---

## 3. The Temporal Dead Zone (TDZ) Deep Dive

Many developers mistakenly believe that `let` and `const` are not hoisted. **They ARE hoisted**, but unlike `var` (which is initialized with `undefined`), `let` and `const` remain uninitialized in the **Temporal Dead Zone (TDZ)**:

```javascript
// Proof of TDZ hoisting:
let value = "outer";

function demonstrateTDZ() {
  // If 'let value' was not hoisted, this would log "outer".
  // Because it IS hoisted to this block scope, accessing it before initialization throws!
  console.log(value); // ReferenceError: Cannot access 'value' before initialization!
  let value = "inner";
}

demonstrateTDZ();
```

---

## 4. Shadowing Variables

Variable **shadowing** occurs when a variable declared within an inner block scope has the same identifier as a variable in an outer scope:

```javascript
const userRole = "viewer"; // Outer scope

function checkAccess() {
  if (true) {
    const userRole = "admin"; // Shadows outer userRole inside this block!
    console.log(`Inner role: ${userRole}`); // "admin"
  }
  console.log(`Outer role: ${userRole}`); // "viewer"
}

checkAccess();
```

---

## Practice Quiz

### Q1: What creates a new block scope in modern JavaScript?
- A) A pair of parentheses `(...)`
- B) Any code enclosed within curly braces `{ ... }` using `let` or `const`
- C) Only an external JavaScript file
- D) A string literal
**Answer:** B
**Explanation:** Any block delimited by curly braces `{}` creates a distinct lexical scope for variables declared with `let` or `const`.

### Q2: Why does `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 10); }` print `3, 3, 3`?
- A) `setTimeout` is broken
- B) `var` has function scope, meaning all three callback closures share a reference to the same single `i` variable that ends at 3
- C) The browser caches loop results
- D) JavaScript loops cannot handle numbers
**Answer:** B
**Explanation:** `var` is function-scoped; all asynchronous callbacks reference the same mutable variable `i` after the synchronous loop finishes at 3.

### Q3: What happens when accessing a `let` variable during its Temporal Dead Zone (TDZ)?
- A) It returns `undefined`
- B) It returns `null`
- C) A `ReferenceError` is thrown
- D) It returns `0`
**Answer:** C
**Explanation:** Accessing a `let` or `const` identifier before its explicit declaration statement throws a `ReferenceError` due to the TDZ.

### Q4: Can a `let` variable be re-declared within the exact same block scope?
- A) Yes, as many times as you like
- B) No, attempting to re-declare a `let` variable in the same scope throws a `SyntaxError: Identifier has already been declared`
- C) Only in Node.js
- D) Only inside loops
**Answer:** B
**Explanation:** Unlike `var`, `let` and `const` disallow re-declaration within the same lexical scope block.

### Q5: What is "variable shadowing"?
- A) Hiding secret passwords in comments
- B) Declaring a variable in an inner scope with the same name as an outer scope variable, overriding access to the outer variable within that block
- C) Compiling code to WebAssembly
- D) Deleting variables automatically
**Answer:** B
**Explanation:** Shadowing occurs when an inner scope identifier masks an outer identifier of the same name.

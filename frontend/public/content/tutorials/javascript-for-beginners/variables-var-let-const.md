# Variables: `var`, `let`, `const`

A variable is a named storage container in memory used to hold data values that your program can read, manipulate, and update. In modern JavaScript (ES6+), choosing the correct variable declaration keyword (`const`, `let`, or `var`) is fundamental to writing predictable, bug-free code.

---

## 1. Evolution of Variable Declarations

```
1995 - 2015: Only `var` existed.
             Features: Function-scoped, hoisted with undefined, allows re-declaration.
             Flaw: Accidental variable leaks, scoping bugs in loops.
                                 |
                                 v
2015 (ES6): Introduced `let` and `const`.
             Features: Block-scoped `{ ... }`, temporal dead zone, no re-declaration.
             Standard: `const` by default; `let` when reassignment is needed. Never use `var`!
```

---

## 2. The Big Three: `var` vs `let` vs `const`

| Feature | `var` (Legacy) | `let` (Modern Mutable) | `const` (Modern Constant) |
|---|:---:|:---:|:---:|
| **Scope** | Function Scope | Block Scope `{ }` | Block Scope `{ }` |
| **Reassignable?** | Yes | **Yes** | **No** (TypeError) |
| **Re-declarable in same scope?** | Yes (Accidental overwrites!) | **No** (SyntaxError) | **No** (SyntaxError) |
| **Must initialize on declaration?** | No | No | **Yes** (Must give value!) |
| **Hoisting Behavior** | Hoisted with `undefined` | Hoisted into Temporal Dead Zone (TDZ) | Hoisted into Temporal Dead Zone (TDZ) |

---

## 3. Scope Mechanics: Function Scope vs. Block Scope

A **block** in JavaScript is any code enclosed within curly braces `{ ... }` (such as `if` conditions, `for` loops, or standalone blocks).

### The Danger of `var` Leaking:
```javascript
if (true) {
  var role = "Admin";
}
console.log(role); // "Admin" - Leaked outside the block! var ignores block boundaries!
```

### The Safety of `let` and `const`:
```javascript
if (true) {
  let user = "Sumit";
  const age = 25;
}
console.log(user); // ReferenceError: user is not defined!
console.log(age);  // ReferenceError: age is not defined!
```

---

## 4. Reassignment: `let` vs. `const`

### Use `let` when values must change:
```javascript
let score = 0;
score = 10; // Valid reassignment!
score += 5; // score is now 15
```

### Use `const` for values that should NOT be reassigned:
```javascript
const API_URL = "https://api.mskinstitute.com/v1";
API_URL = "https://other.com"; // TypeError: Assignment to constant variable!
```

### Critical Nuance: `const` with Objects and Arrays
`const` prevents reassigning the **variable identifier binding**, but does **not** make the internal contents of an object or array immutable!

```javascript
const student = { name: "Sumit", marks: 95 };

// Mutating object properties is 100% VALID:
student.marks = 98;
student.city = "Delhi";
console.log(student); // { name: "Sumit", marks: 98, city: "Delhi" }

// Reassigning the variable itself throws an ERROR:
student = { name: "Other" }; // TypeError: Assignment to constant variable!
```

---

## 5. Hoisting and the Temporal Dead Zone (TDZ)

**Hoisting** is JavaScript's default behavior of moving variable and function declarations to the top of their scope before code execution.

- With `var`: Variables are hoisted and initialized with `undefined`:
  ```javascript
  console.log(x); // undefined (No error, but confusing!)
  var x = 10;
  ```
- With `let` and `const`: Variables are hoisted, but remain in the **Temporal Dead Zone (TDZ)** until the line of declaration is reached:
  ```javascript
  console.log(y); // ReferenceError: Cannot access 'y' before initialization!
  let y = 20;
  ```

---

## 6. Industry Golden Rule: 90/10 Rule

Top engineering teams follow the **90/10 Rule**:
1. Use **`const` for 90% of your variables** by default (objects, arrays, functions, constants).
2. Use **`let` only when you know the variable will be reassigned** (loop counters, toggles, accumulating scores).
3. **Never use `var`** in modern codebases.

---

## Practice Quiz

### Q1: What type of scope do `let` and `const` have?
- A) Global scope only
- B) Block scope (confined to the enclosing curly braces `{}`)
- C) Function scope only
- D) File scope only
**Answer:** B
**Explanation:** `let` and `const` are block-scoped, meaning they only exist within the pair of curly braces `{}` in which they are declared.

### Q2: What happens if you attempt to reassign a variable declared with `const`?
- A) JavaScript converts it to a string
- B) A `TypeError: Assignment to constant variable` is thrown
- C) The variable automatically becomes `let`
- D) The computer restarts
**Answer:** B
**Explanation:** `const` creates a read-only reference. Attempting to reassign it throws a runtime `TypeError`.

### Q3: Can you modify the properties of an object declared with `const` (e.g. `const user = { name: "Alex" }; user.name = "Sam";`)?
- A) No, `const` freezes all properties completely
- B) Yes, `const` prevents reassigning the variable pointer, but the contents of the object can still be mutated
- C) Only if the object has fewer than 2 properties
- D) Only in strict mode
**Answer:** B
**Explanation:** `const` protects the variable reference from being reassigned to a new memory address, but the internal properties of referenced objects and arrays remain mutable.

### Q4: What is the "Temporal Dead Zone" (TDZ) in JavaScript?
- A) The time between midnight and 1 AM when servers update
- B) The phase between the start of a block and the variable's declaration where accessing a `let` or `const` variable throws a ReferenceError
- C) When a browser tab is closed
- D) When a promise is rejected
**Answer:** B
**Explanation:** The TDZ is the period from the entry of scope until the execution reaches the declaration line; accessing `let`/`const` within the TDZ causes a `ReferenceError`.

### Q5: Why is `var` avoided in modern JavaScript development?
- A) It is not supported in Chrome
- B) It lacks block scoping, is hoisted with `undefined`, and permits accidental re-declarations that lead to insidious bugs
- C) It requires paying a license fee
- D) It only supports numbers
**Answer:** B
**Explanation:** `var`'s lack of block scoping and loose re-declaration rules historically caused widespread variable leaking bugs, which `let` and `const` completely eliminate.

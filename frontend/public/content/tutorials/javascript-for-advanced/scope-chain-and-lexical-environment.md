# Scope Chain & Lexical Environment in Modern JavaScript

Scope determines the visibility and accessibility of variables in JavaScript. Understanding how the JavaScript engine resolves variable references across nested functions requires mastering the **Lexical Environment** and the **Scope Chain**.

---

## 1. Lexical Scoping Explained

JavaScript uses **Lexical Scoping** (also called Static Scoping). This means:
> The scope of an identifier is determined by its **physical location in the source code** at author time, **not** where the function is called!

```javascript
const user = 'Global Alice';

function displayUser() {
  console.log(user);
}

function outer() {
  const user = 'Local Bob';
  displayUser(); // What will this print?
}

outer(); // Prints: "Global Alice" (NOT "Local Bob"!)
```

*Why?* Because `displayUser` was lexically declared in the global scope. It resolves identifiers based on where it was born, not where it was invoked.

---

## 2. Structure of a Lexical Environment

Under the hood, every execution context has an associated **Lexical Environment** consisting of two components:
1. **Environment Record:** The dictionary storing local variables, function declarations, and arguments.
2. **Reference to the Outer Lexical Environment:** A pointer to the parent environment in which the function was physically created.

```
┌───────────────────────────────────────────────────────────┐
│ Global Lexical Environment                                │
│   • Environment Record: { user: 'Global Alice' }          │
│   • Outer Reference: null                                 │
└─────────────────────────────▲─────────────────────────────┘
                              │
┌─────────────────────────────┴─────────────────────────────┐
│ displayUser() Lexical Environment                         │
│   • Environment Record: { }                               │
│   • Outer Reference: ──────────► Points to Global!        │
└───────────────────────────────────────────────────────────┘
```

---

## 3. The Scope Chain Lookup Mechanism

When a variable is accessed inside a function:
1. The engine checks the current function's local Environment Record.
2. If not found, it follows the `outer` reference to the parent Lexical Environment.
3. It repeats this traversal up the chain until finding the variable.
4. If it reaches the Global Environment (`outer === null`) and still cannot find the variable, it throws a `ReferenceError`.

```javascript
const globalA = 'A';

function levelOne() {
  const levelOneB = 'B';

  function levelTwo() {
    const levelTwoC = 'C';
    // Can access C (local), B (parent), and A (grandparent)!
    console.log(levelTwoC, levelOneB, globalA);
  }

  levelTwo();
}

levelOne(); // Output: "C B A"
```

---

## 4. Block Scope vs Function Scope

- **`var` is Function Scoped:** Ignores curly brace blocks (`if`, `for`, `while`). It leaks outside blocks!
- **`let` and `const` are Block Scoped:** Create a new lexical block environment for every `{ ... }` pair.

```javascript
if (true) {
  var leakedVar = 'I escaped!';
  let trappedLet = 'I am trapped inside!';
}

console.log(leakedVar); // 'I escaped!'
// console.log(trappedLet); // ReferenceError: trappedLet is not defined
```

---

## Practice Quiz

### Q1: What does "Lexical Scoping" mean in JavaScript?
- A) Scope depends on which function invoked the current function
- B) Scope is determined statically by the physical location of functions and blocks in the source code
- C) Scope is reset every 5 seconds
- D) Variables are only accessible inside HTML scripts
**Answer:** B
**Explanation:** Lexical scope means variable resolution is determined by the lexical (author-time) nesting of functions and blocks in source code.

### Q2: What are the two internal components of a Lexical Environment in the ECMAScript specification?
- A) An Environment Record and a reference to the outer Lexical Environment
- B) A heap pointer and a garbage collector flag
- C) A CSS parser and an AST
- D) A Call Stack and a Microtask Queue
**Answer:** A
**Explanation:** Every Lexical Environment comprises an Environment Record (storing local identifiers) and an outer reference pointing to its parent environment.

### Q3: What happens when JavaScript looks for a variable that does not exist in any lexical environment up to the global scope?
- A) It returns null
- B) It throws a ReferenceError
- C) It creates the variable automatically in strict mode
- D) It returns 0
**Answer:** B
**Explanation:** Traversal up the scope chain terminates at the global environment; failing to find the identifier throws an unhandled `ReferenceError`.

### Q4: Which declaration keyword is NOT confined by if or for blocks?
- A) const
- B) let
- C) var
- D) class
**Answer:** C
**Explanation:** `var` is function-scoped and ignores block boundaries like `if`, `for`, or `while` statements, leaking to the enclosing function or global scope.

### Q5: In nested functions, can an outer function access variables declared inside an inner child function?
- A) Yes, all nested scopes are bidirectional
- B) No, scope lookup is strictly unidirectional—children can access parent variables, but parents cannot reach inside child scopes
- C) Only if the child function is an arrow function
- D) Yes, using the parent keyword
**Answer:** B
**Explanation:** Scope chain resolution is strictly bottom-up / inward-out. Child scopes inherit access to ancestors, but ancestor scopes cannot access child variables.

# Defining and Calling Functions in JavaScript

Functions are the primary building blocks of software. A function is a reusable, modular block of code designed to perform a specific task. By packaging code into functions, you avoid repeating logic (DRY: Don't Repeat Yourself) and create clean, testable programs.

---

## 1. Function Declarations vs. Function Expressions

In JavaScript, there are two traditional ways to define functions:

### A. Function Declaration
Uses the `function` keyword followed by the function name:
```javascript
// 1. Defining the function
function greetStudent(name) {
  console.log(`Hello, ${name}! Welcome to MSK Institute.`);
}

// 2. Calling (invoking) the function
greetStudent("Sumit");
```

### B. Function Expression
Assigns an anonymous (or named) function to a variable:
```javascript
const calculateArea = function(width, height) {
  return width * height;
};

console.log(calculateArea(5, 10)); // 50
```

---

## 2. Hoisting Differences (Crucial Interview Concept!)

Why does the choice between Declaration and Expression matter? **Hoisting!**

### Function Declarations are Hoisted Completely:
You can call a function declaration **before** the line where it is written:
```javascript
sayHello(); // "Hello!" (Works perfectly!)

function sayHello() {
  console.log("Hello!");
}
```

### Function Expressions are NOT Hoisted:
Because the function is assigned to a `const` or `let` variable, it resides in the Temporal Dead Zone until initialized:
```javascript
sayGoodbye(); // ReferenceError: Cannot access 'sayGoodbye' before initialization!

const sayGoodbye = function() {
  console.log("Goodbye!");
};
```

---

## 3. Function Execution & The Call Stack

When a function is called in JavaScript:
1. A new **Execution Context** is created.
2. The function is pushed onto the top of the **Call Stack**.
3. Its code executes.
4. When it hits `return` or ends, it is popped off the Call Stack, and control returns to the caller.

```javascript
function first() {
  console.log("1");
  second();
  console.log("3");
}

function second() {
  console.log("2");
}

first();
// Output order:
// 1
// 2
// 3
```

---

## 4. Functions as First-Class Citizens

In JavaScript, functions are **First-Class Citizens**, which means functions are treated like any other value:
- They can be assigned to variables.
- They can be stored in arrays and objects.
- They can be passed as arguments to other functions (Callbacks).
- They can be returned from other functions (Higher-Order Functions).

```javascript
function executeTwice(action) {
  action();
  action();
}

function ringBell() {
  console.log("Ding dong! 🔔");
}

executeTwice(ringBell); // Rings twice!
```

---

## Practice Quiz

### Q1: What is the main benefit of organizing code into functions?
- A) It slows down program execution
- B) Code reusability, modularity, and avoiding repetition (DRY principle)
- C) It converts JavaScript into HTML
- D) It deletes global variables
**Answer:** B
**Explanation:** Functions encapsulate reusable logic so you don't repeat the same code across multiple places.

### Q2: What happens if you call a Function Declaration before the line where it is defined in code?
- A) A ReferenceError is thrown
- B) It executes normally because Function Declarations are hoisted completely to the top of scope
- C) The browser crashes
- D) It returns null
**Answer:** B
**Explanation:** Function declarations are hoisted with their complete function bodies, allowing them to be invoked anywhere within their enclosing scope.

### Q3: What happens if you call a Function Expression assigned to a `const` before its declaration?
- A) It runs normally
- B) It throws a `ReferenceError` because the variable is in the Temporal Dead Zone
- C) It prints undefined
- D) It restarts the computer
**Answer:** B
**Explanation:** Variables declared with `const` or `let` cannot be accessed before their declaration statement, throwing a ReferenceError.

### Q4: What does it mean that functions are "First-Class Citizens" in JavaScript?
- A) Only VIP developers can use them
- B) Functions can be stored in variables, passed as arguments, and returned from other functions just like numbers or strings
- C) Functions require a paid license
- D) Functions run with highest CPU priority
**Answer:** B
**Explanation:** First-class functions can be treated like any other data value (assigned to variables, passed into callbacks, returned from functions).

### Q5: What is the syntax used to invoke (call) a function named `init`?
- A) `call init;`
- B) `init();`
- C) `run(init);`
- D) `init{}`
**Answer:** B
**Explanation:** Parentheses `()` following a function identifier invoke and execute that function.

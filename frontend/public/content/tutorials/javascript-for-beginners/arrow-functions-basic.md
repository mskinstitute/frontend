# Arrow Functions (Basic) in JavaScript

Introduced in ECMAScript 2015 (ES6), **Arrow Functions** provide a concise, modern syntax for writing functions. Beyond their compact appearance, arrow functions have important lexical scoping properties that make them indispensable in modern frontend libraries like React.

---

## 1. Syntax Evolution: From Regular to Arrow

Let's see how traditional function syntax transforms into an arrow function:

```javascript
// 1. Traditional Function Expression:
const add = function(a, b) {
  return a + b;
};

// 2. Arrow Function (Standard):
const add = (a, b) => {
  return a + b;
};

// 3. Arrow Function with Implicit Return (Concise Body):
const add = (a, b) => a + b;
```

---

## 2. The Power of Implicit Return

If an arrow function contains only a **single expression**, you can:
1. Omit the curly braces `{ ... }`.
2. Omit the `return` keyword!
The expression is automatically evaluated and returned:

```javascript
// Double a number:
const double = x => x * 2;
console.log(double(15)); // 30

// Capitalize text:
const shout = msg => msg.toUpperCase();
console.log(shout("javascript")); // "JAVASCRIPT"
```

> [!WARNING]
> If you open curly braces `{ ... }`, the implicit return is disabled! You **must** write `return` explicitly:
> ```javascript
> // ❌ WRONG: Returns undefined because curly braces require 'return'!
> const multiply = (a, b) => { a * b; };
>
> // ✅ CORRECT:
> const multiply = (a, b) => a * b;
> // OR:
> const multiply = (a, b) => { return a * b; };
> ```

---

## 3. Returning Object Literals with Implicit Return

If you want an arrow function to implicitly return an object literal, wrap the object in parentheses `({ ... })` so JavaScript doesn't confuse the object braces with function body braces:

```javascript
// ❌ FAILS: Engine thinks {} is a function code block!
const makeUser = (name, age) => { name: name, age: age };

// ✅ CORRECT: Wrap in parentheses:
const makeUser = (name, age) => ({ name, age });

console.log(makeUser("Sumit", 25)); // { name: "Sumit", age: 25 }
```

---

## 4. Arrow Functions as Callbacks

Arrow functions shine brightest as inline callbacks for array methods and event listeners:

```javascript
const prices = [100, 200, 300, 400];

// Clean 1-line transformation:
const discounted = prices.map(p => p * 0.9);
console.log(discounted); // [90, 180, 270, 360]

// Filtering:
const highPrices = prices.filter(p => p >= 250);
console.log(highPrices); // [300, 400]
```

---

## 5. When NOT to Use Arrow Functions

Arrow functions do **not** have their own `this`, `arguments`, or `prototype`:
- Do not use arrow functions for object methods that rely on `this`.
- Do not use arrow functions as class constructors (cannot use with `new`).

---

## Practice Quiz

### Q1: What character sequence defines an arrow function in JavaScript?
- A) `->`
- B) `=>`
- C) `==>`
- D) `~>`
**Answer:** B
**Explanation:** `=>` (the "fat arrow") is the syntax used to declare arrow functions in JavaScript.

### Q2: What is an "implicit return" in an arrow function?
- A) When a function returns null automatically
- B) When a single-expression arrow function without curly braces automatically returns the evaluated value without typing the `return` keyword
- C) When a function returns a promise
- D) An unhandled error
**Answer:** B
**Explanation:** Arrow functions without curly braces automatically evaluate and return the single expression on the right-hand side.

### Q3: How do you implicitly return an object literal from a concise arrow function?
- A) Wrap the object literal in parentheses: `() => ({ key: value })`
- B) Put the object inside brackets: `() => [{ key: value }]`
- C) Use single quotes
- D) It is impossible in JavaScript
**Answer:** A
**Explanation:** Parentheses around the object literal (`({ key: value })`) disambiguate the object's curly braces from a function body block.

### Q4: What is the output of `const calc = (x, y) => { x + y }; console.log(calc(2, 3));`?
- A) `5`
- B) `undefined` (because curly braces were opened without typing `return`)
- C) `NaN`
- D) `TypeError`
**Answer:** B
**Explanation:** When curly braces `{}` are used, an explicit `return` keyword is required. Without it, the function returns `undefined`.

### Q5: Can arrow functions be used as constructors with the `new` keyword?
- A) Yes, always
- B) No, arrow functions lack a `[[Construct]]` method and `prototype` and will throw a TypeError
- C) Only in React
- D) Only if capitalized
**Answer:** B
**Explanation:** Arrow functions cannot be called with `new`; doing so throws a `TypeError: calc is not a constructor`.

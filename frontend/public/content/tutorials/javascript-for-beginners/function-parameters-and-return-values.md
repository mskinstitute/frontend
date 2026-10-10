# Function Parameters and Return Values

Functions receive inputs via **parameters** and send outputs back to the caller via **return values**. Mastering parameter defaults, rest parameters, and return semantics is essential for writing robust JavaScript functions.

---

## 1. Parameters vs. Arguments

While often used interchangeably in casual conversation, there is a clear distinction:
- **Parameters**: The variable names listed in the function definition.
- **Arguments**: The real values passed into the function when you invoke it.

```javascript
// 'base' and 'exponent' are PARAMETERS:
function power(base, exponent) {
  return base ** exponent;
}

// 2 and 3 are ARGUMENTS:
const result = power(2, 3);
```

---

## 2. The `return` Statement

The `return` statement does two things:
1. It immediately stops the execution of the function.
2. It sends the evaluated value back to the caller.

```javascript
function calculateTax(subtotal, taxRate) {
  if (subtotal <= 0) {
    return 0; // Exits early!
  }

  return subtotal * taxRate;
}

const tax = calculateTax(1000, 0.18); // 180
```

> [!IMPORTANT]
> If a function does **not** have an explicit `return` statement (or has an empty `return;`), it automatically returns **`undefined`**!

```javascript
function doNothing() {}
console.log(doNothing()); // undefined
```

---

## 3. Default Parameters (ES6)

What happens if a caller forgets to pass an argument?
Without defaults, missing arguments become `undefined`. In ES6, you can specify default values directly in the parameter list:

```javascript
function createAccount(username, role = "Student", isActive = true) {
  return {
    username,
    role,
    isActive
  };
}

console.log(createAccount("sumit_dev"));
// { username: "sumit_dev", role: "Student", isActive: true }
```

---

## 4. Variable Number of Arguments: Rest Parameters (`...args`)

What if you want to write a function that can accept any number of inputs (e.g. summing 3, 5, or 100 numbers)?
Use the **Rest Parameter** (`...`):

```javascript
function sumAll(...numbers) {
  // 'numbers' is a real JavaScript array!
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

console.log(sumAll(10, 20));          // 30
console.log(sumAll(5, 15, 25, 35, 45)); // 125
```

> [!NOTE]
> The rest parameter must always be the **very last parameter** in the function definition!

---

## 5. Returning Multiple Values via Objects or Arrays

A function in JavaScript can technically only return a single value. To return multiple values, return an **object** or an **array**:

```javascript
function getMinMax(numbers) {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return { min, max };
}

// Destructure the returned object:
const { min, max } = getMinMax([14, 5, 82, 1, 99]);
console.log(`Lowest: ${min}, Highest: ${max}`); // Lowest: 1, Highest: 99
```

---

## Practice Quiz

### Q1: What does a JavaScript function return by default if it lacks an explicit `return` statement?
- A) `0`
- B) `null`
- C) `undefined`
- D) `false`
**Answer:** C
**Explanation:** In JavaScript, functions without an explicit `return` statement implicitly return `undefined`.

### Q2: What is the difference between a parameter and an argument?
- A) Parameters are defined in the function signature; arguments are the actual values passed during invocation
- B) Parameters are numbers; arguments are strings
- C) Arguments are defined in CSS; parameters in HTML
- D) There is no difference
**Answer:** A
**Explanation:** Parameters represent placeholders in the function definition, while arguments are concrete values supplied when calling the function.

### Q3: What is the value of `tax` if invoked as `calculateTotal(500)` where the function is defined as `function calculateTotal(price, tax = 0.1) { return price * tax; }`?
- A) `NaN`
- B) `50` (uses default parameter `tax = 0.1`)
- C) `undefined`
- D) `TypeError`
**Answer:** B
**Explanation:** Because the second argument was omitted, the default parameter value `0.1` is used: $500 \times 0.1 = 50$.

### Q4: Which operator allows a function to collect an indefinite number of arguments into a single array?
- A) Spread operator
- B) Rest parameter syntax (`...args`)
- C) Slicing operator
- D) Ternary operator
**Answer:** B
**Explanation:** Rest parameters (`...rest`) collect remaining arguments into a true JavaScript array.

### Q5: Can code written after a `return` statement in the same execution branch ever execute?
- A) Yes, always
- B) No, the `return` statement terminates function execution immediately
- C) Only in Node.js
- D) Only inside loops
**Answer:** B
**Explanation:** Once a `return` executes, control exits the function immediately; subsequent lines in that branch are unreachable.

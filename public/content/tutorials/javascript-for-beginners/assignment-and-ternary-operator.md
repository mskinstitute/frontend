# Assignment & Ternary Conditional Operator

Assignment operators update the value stored inside variables, while the ternary operator provides a concise, elegant way to write inline conditional expressions.

---

## 1. Assignment Operators

The basic assignment operator is the equals sign (`=`). JavaScript also provides compound assignment operators that combine an arithmetic operation with assignment:

| Operator | Name | Equivalent To | Example |
|:---:|---|---|---|
| **`=`** | Simple Assignment | `x = y` | `let score = 100;` |
| **`+=`** | Addition Assignment | `x = x + y` | `score += 10;` (Now 110) |
| **`-=`** | Subtraction Assignment | `x = x - y` | `score -= 20;` (Now 90) |
| **`*=`** | Multiplication Assignment | `x = x * y` | `score *= 2;` (Now 180) |
| **`/=`** | Division Assignment | `x = x / y` | `score /= 3;` (Now 60) |
| **`%=`** | Modulus Assignment | `x = x % y` | `score %= 7;` (Now 4) |
| **`**=`**| Exponentiation Assignment | `x = x ** y`| `score **= 2;` (Now 16) |

### String Concatenation Assignment (`+=`):
```javascript
let message = "Hello";
message += " World";
message += "!";
console.log(message); // "Hello World!"
```

---

## 2. The Ternary Operator (`condition ? expr1 : expr2`)

The **ternary operator** is the only operator in JavaScript that takes **three operands**. It serves as a compact, inline shortcut for an `if...else` statement:

```
condition ? value_if_true : value_if_false
```

### Comparison: `if...else` vs. Ternary
```javascript
const age = 20;
let statusMessage;

// Using traditional if...else:
if (age >= 18) {
  statusMessage = "Adult";
} else {
  statusMessage = "Minor";
}

// Using concise ternary operator:
const statusMessage = age >= 18 ? "Adult" : "Minor";
```

### Why Developers Love the Ternary Operator:
Because the ternary operator is an **expression** (it returns a value), you can assign it directly to a `const` variable, pass it as a function argument, or embed it directly inside template literals:

```javascript
const userRole = "admin";
console.log(`Welcome, ${userRole === "admin" ? "Administrator" : "Guest"}!`);
```

---

## 3. Nested Ternary Operators (Use With Caution!)

You can chain ternary operators for multiple conditions, but be careful not to hurt code readability:

```javascript
const score = 85;

const grade = score >= 90 ? "A" 
            : score >= 80 ? "B" 
            : score >= 70 ? "C" 
            : "F";

console.log(grade); // "B"
```

> [!TIP]
> If a nested ternary exceeds 2 levels of depth, switch to a standard `if...else` or `switch` statement for better team readability.

---

## Practice Quiz

### Q1: What is the equivalent of `x += 5`?
- A) `x = 5`
- B) `x = x + 5`
- C) `x + 5 = x`
- D) `5 = x + 5`
**Answer:** B
**Explanation:** `+=` is the addition assignment operator, which adds the right operand to the variable and assigns the result back to the variable.

### Q2: How many operands does the ternary operator take?
- A) 1
- B) 2
- C) 3 (condition, truthy expression, falsy expression)
- D) 4
**Answer:** C
**Explanation:** The ternary operator (`? :`) takes exactly three operands: a condition to evaluate, an expression if truthy, and an expression if falsy.

### Q3: What is the result of `const result = (10 > 5) ? "Yes" : "No";`?
- A) `"No"`
- B) `"Yes"`
- C) `true`
- D) `undefined`
**Answer:** B
**Explanation:** Since `10 > 5` evaluates to `true`, the ternary returns the first expression after the `?`, which is `"Yes"`.

### Q4: Why is the ternary operator preferred over `if...else` when initializing `const` variables?
- A) `if` statements cannot contain strings
- B) The ternary operator is an expression that evaluates directly to a return value, allowing immediate assignment to `const`
- C) `if...else` is deprecated in JavaScript
- D) Ternary compiles directly to assembly
**Answer:** B
**Explanation:** An `if` statement is a control block and does not return a value, requiring a mutable `let` variable outside the block; a ternary returns a value directly.

### Q5: What is the value of `x` after running `let x = 12; x %= 5;`?
- A) 2
- B) 2.4
- C) 0
- D) 5
**Answer:** A
**Explanation:** `x %= 5` computes `12 % 5`, which is 2, and assigns 2 back to `x`.

# Arithmetic Operators in JavaScript

Arithmetic operators allow programs to perform mathematical calculations on numerical operands. JavaScript provides all standard mathematical operations along with exponentiation, modulo division, and unary increment/decrement operators.

---

## 1. Core Arithmetic Operators

| Operator | Name | Example | Result | Description |
|:---:|---|---|:---:|---|
| **`+`** | Addition | `10 + 5` | `15` | Adds two numbers (also concatenates strings!) |
| **`-`** | Subtraction | `20 - 8` | `12` | Subtracts right operand from left |
| **`*`** | Multiplication | `6 * 7` | `42` | Multiplies two numbers |
| **`/`** | Division | `20 / 4` | `5` | Divides left operand by right operand |
| **`%`** | Modulus (Remainder)| `14 % 4` | `2` | Returns integer remainder of division |
| **`**`** | Exponentiation (ES6)| `2 ** 3` | `8` | Raises base to power of exponent ($2^3$) |

---

## 2. Modulus `%` vs. Math Power `**`

### The Power of Modulus `%`:
The remainder operator is frequently used to determine even/odd status or cycle through array indices:
```javascript
// Check if a number is even
const isEven = (num) => num % 2 === 0;

console.log(isEven(8)); // true
console.log(isEven(7)); // false

// Cycling through 7 days of the week:
let dayIndex = 10 % 7; // 3 (Wednesday)
```

### Exponentiation `**`:
```javascript
console.log(3 ** 2); // 9 (3 squared)
console.log(4 ** 0.5); // 2 (Square root of 4!)
```

---

## 3. Increment (`++`) and Decrement (`--`)

JavaScript supports both prefix and postfix increment and decrement:

```javascript
let count = 5;

// Postfix (increments AFTER current expression evaluates):
let a = count++; // a is 5, count is now 6

// Prefix (increments BEFORE current expression evaluates):
let b = ++count; // count becomes 7, b is 7
```

> [!TIP]
> In modern clean code, avoid burying `++` inside complex expressions. Write it on its own line:
> ```javascript
> count++;
> ```

---

## 4. The Addition Trap: String Concatenation (`+`)

The plus operator (`+`) is overloaded in JavaScript:
- If **both** operands are numbers, it performs **mathematical addition**.
- If **either** operand is a string, it performs **string concatenation**!

```javascript
console.log(10 + 20);     // 30 (Number addition)
console.log("10" + 20);   // "1020" (String concatenation!)
console.log(10 + 20 + "5");// "305" (Left-to-right: 10+20=30, then 30 + "5" = "305")
console.log("5" + 10 + 20);// "51020" ("5"+10="510", then "510"+20="51020")
```

### Type Conversion Tip: Unary Plus (`+`)
Prefixing any string containing numbers with `+` converts it directly into a number:
```javascript
let strAge = "25";
let numAge = +strAge; // Exactly 25 (number)
console.log(typeof numAge); // "number"
```

---

## Practice Quiz

### Q1: What is the result of the expression `17 % 5` in JavaScript?
- A) 3.4
- B) 2
- C) 3
- D) 0
**Answer:** B
**Explanation:** 17 divided by 5 equals 3 with a remainder of 2 (`5 * 3 = 15; 17 - 15 = 2`).

### Q2: What does the expression `2 ** 4` evaluate to?
- A) 8
- B) 16
- C) 6
- D) 24
**Answer:** B
**Explanation:** `**` is the exponentiation operator ($2^4 = 2 \times 2 \times 2 \times 2 = 16$).

### Q3: What is the result of `"10" + 5` in JavaScript?
- A) `15`
- B) `"105"`
- C) `NaN`
- D) `TypeError`
**Answer:** B
**Explanation:** When either operand of the `+` operator is a string, JavaScript coerces the other operand to a string and concatenates them, yielding `"105"`.

### Q4: If `let x = 3; let y = x++;`, what are the values of `x` and `y` respectively?
- A) `x = 4, y = 3`
- B) `x = 4, y = 4`
- C) `x = 3, y = 4`
- D) `x = 3, y = 3`
**Answer:** A
**Explanation:** With postfix increment (`x++`), the current value of `x` (3) is returned and assigned to `y`, and then `x` is incremented to 4.

### Q5: How can you quickly convert the numeric string `"42"` into the primitive number `42` using an arithmetic operator?
- A) `+"42"`
- B) `~"42"`
- C) `&"42"`
- D) `*"42"`
**Answer:** A
**Explanation:** The unary plus operator (`+`) attempts to convert its operand into a number, making `+"42"` yield the number `42`.

# Data Types in JavaScript

Every value in JavaScript belongs to a specific **data type**. Understanding how JavaScript categorizes, stores, and evaluates data types is essential for debugging type coercion and memory references.

---

## 1. The Two Major Categories of Data Types

JavaScript divides its data types into two distinct categories:

```
+-----------------------------------------------------------------------------+
|                          JAVASCRIPT DATA TYPES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  1. PRIMITIVE TYPES (7 Types)              2. REFERENCE TYPES (Objects)     |
|  - Stored directly in the Call Stack       - Stored in the Memory Heap      |
|  - Immutable (cannot be altered in place)  - Mutable                        |
|  - Compared by VALUE                       - Compared by REFERENCE          |
|                                                                             |
|  * string      * number       * boolean    * Object                         |
|  * null        * undefined    * symbol     * Array (Specialized object)     |
|  * bigint                                  * Function (Callable object)     |
+-----------------------------------------------------------------------------+
```

---

## 2. Deep Dive: The 7 Primitive Types

### 1. `string`
Textual data enclosed in single quotes `'...'`, double quotes `"..."`, or backticks ``` `...` ```:
```javascript
let name = "Sumit";
let greeting = `Hello, ${name}!`; // Template literal
```

### 2. `number`
Represents both integers and floating-point numbers (64-bit IEEE 754 floats):
```javascript
let age = 25;
let price = 99.99;
let negative = -15;
// Special numeric values:
let infinity = 1 / 0; // Infinity
let notANumber = "apple" / 2; // NaN (Not-a-Number)
```

### 3. `bigint`
For arbitrarily large integers beyond JavaScript's safe integer limit ($2^{53} - 1$ or `9,007,199,254,740,991`):
```javascript
let bigNumber = 9007199254740991123456789n; // Suffix with 'n'
```

### 4. `boolean`
Logical values: strictly `true` or `false`:
```javascript
let isEnrolled = true;
let hasPaid = false;
```

### 5. `undefined`
A variable that has been declared, but has **not yet been assigned a value**:
```javascript
let score;
console.log(score); // undefined
```

### 6. `null`
Represents the **intentional absence of any object value**:
```javascript
let selectedCourse = null; // Deliberately empty for now
```

### 7. `symbol` (ES6)
A unique, immutable identifier used as unique object keys:
```javascript
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false (Every symbol is globally unique!)
```

---

## 3. The `typeof` Operator and the Famous Bug

Use the `typeof` operator to inspect the data type of any variable:

```javascript
typeof "Hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof 100n        // "bigint"
typeof Symbol()    // "symbol"
typeof { a: 1 }    // "object"
typeof [1, 2, 3]   // "object" (Arrays are objects in JS!)
typeof function(){}// "function"
```

> [!WARNING]
> **The Famous JavaScript Bug**:
> ```javascript
> typeof null; // "object"
> ```
> In the original 1995 JavaScript implementation, values were stored with a type tag. The tag for objects was `0`. `null` was represented as a NULL pointer (`0x00`), causing `typeof null` to incorrectly return `"object"`. This bug cannot be fixed now because doing so would break millions of legacy websites!

---

## 4. Primitives (By Value) vs. Reference Types (By Reference)

Understanding this difference prevents 90% of beginner logic bugs:

### Primitives are Copied by Value:
```javascript
let a = 10;
let b = a; // b receives an independent copy of value 10
b = 20;

console.log(a); // 10 (Untouched!)
console.log(b); // 20
```

### Objects are Copied by Memory Reference:
```javascript
let user1 = { name: "Sumit" };
let user2 = user1; // user2 points to the SAME memory address in the heap!

user2.name = "Rahul";

console.log(user1.name); // "Rahul" (user1 was modified because both point to same object!)
```

---

## Practice Quiz

### Q1: How many primitive data types exist in modern JavaScript?
- A) 3
- B) 5
- C) 7 (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`)
- D) 12
**Answer:** C
**Explanation:** Modern JavaScript specifies 7 primitive data types: string, number, boolean, null, undefined, symbol, and bigint.

### Q2: What is the result of running `typeof null` in JavaScript?
- A) `"null"`
- B) `"undefined"`
- C) `"object"` (due to a historical 1995 engine implementation quirk)
- D) `"boolean"`
**Answer:** C
**Explanation:** `typeof null` returns `"object"` due to a legacy bug dating back to the first release of JavaScript in 1995.

### Q3: What is the difference between `undefined` and `null`?
- A) `undefined` means a variable was declared but not assigned a value; `null` is an intentional assignment representing empty/no value
- B) They are 100% identical in every way
- C) `null` is a number; `undefined` is text
- D) `undefined` only exists in Node.js
**Answer:** A
**Explanation:** `undefined` is JavaScript's default state for uninitialized variables, whereas `null` is an explicit, intentional value assigned by the developer to denote "no object".

### Q4: What happens when you assign an object variable to a new variable (`let obj2 = obj1;`)?
- A) A deep, isolated duplicate of the object is created
- B) Both variables share a reference pointer to the same object in the memory heap
- C) The original object is deleted
- D) JavaScript converts the object to a string
**Answer:** B
**Explanation:** Objects in JavaScript are reference types. Variable assignment copies the memory pointer, not the underlying object data.

### Q5: Which primitive data type allows representing integers larger than $2^{53} - 1$?
- A) `number`
- B) `bigint`
- C) `float64`
- D) `int128`
**Answer:** B
**Explanation:** `bigint` was introduced to safely work with arbitrarily large integers beyond the IEEE 754 float limit of standard `number`.

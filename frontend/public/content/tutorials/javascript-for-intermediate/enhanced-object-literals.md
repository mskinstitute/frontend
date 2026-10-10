# Enhanced Object Literals in ES6

ECMAScript 2015 introduced several syntactic enhancements to object literal notation, making object creation concise, expressive, and less repetitive.

---

## 1. Property Value Shorthand

Before ES6, assigning a variable to an object property with the same name required duplicating the identifier:

```javascript
const name = "Full-Stack Web Development";
const duration = "12 Months";
const price = 49999;

// The Old Way (ES5):
const courseOld = {
  name: name,
  duration: duration,
  price: price
};

// The Enhanced ES6 Shorthand:
const courseNew = {
  name,
  duration,
  price
};
```
If the property name matches the variable name, write it **once**!

---

## 2. Method Definition Shorthand

You can define methods without typing the `function` keyword or colon `: `:

```javascript
// The Old Way:
const calculatorOld = {
  add: function(a, b) {
    return a + b;
  }
};

// The Modern Shorthand:
const calculatorNew = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  }
};
```

---

## 3. Computed Property Names (`[expression]`)

Before ES6, to create an object whose property key was dynamic or computed from an expression, you had to instantiate the object first and then use bracket notation on a separate line:

```javascript
// The Old Way:
const prefix = "user_";
const dynamicKey = prefix + "role";

const userOld = {};
userOld[dynamicKey] = "admin";
```

### With ES6 Computed Property Names:
You can calculate the property key directly inside the object literal using square brackets `[...]`:

```javascript
const prefix = "user_";
const roleType = "admin";

const userNew = {
  id: 101,
  [`${prefix}status`]: "active",
  [`${prefix}role`]: roleType,
  [1 + 2]: "three"
};

console.log(userNew.user_status); // "active"
console.log(userNew.user_role);   // "admin"
console.log(userNew[3]);          // "three"
```

---

## 4. Real-World Use Case: Dynamic Form Handlers

Computed properties are universally used in form handlers (like React `onChange` events):

```javascript
function handleInputChange(fieldName, value) {
  // Update state immutably using computed property:
  formData = {
    ...formData,
    [fieldName]: value
  };
}

handleInputChange("email", "sumit@mskinstitute.com");
```

---

## Practice Quiz

### Q1: What does property value shorthand allow you to write instead of `{ title: title }`?
- A) `{ :title }`
- B) `{ title }`
- C) `{ title = title }`
- D) `[ title ]`
**Answer:** B
**Explanation:** If property name and variable name match, ES6 shorthand lets you simply write `{ title }`.

### Q2: What is the concise ES6 method shorthand syntax for defining a method `greet` inside an object?
- A) `greet: function() {}`
- B) `greet() {}`
- C) `function greet() {}`
- D) `method greet() {}`
**Answer:** B
**Explanation:** ES6 allows defining methods directly as `greet() { ... }`, omitting both `: ` and the `function` keyword.

### Q3: How do you create an object property key dynamically from an expression directly within the object literal?
- A) Wrap the key expression in square brackets: `{ [expression]: value }`
- B) Wrap the key in double quotes
- C) Use an arrow function
- D) Use a ternary operator
**Answer:** A
**Explanation:** Computed property names use square brackets `[expression]` inside object literals to evaluate dynamic keys.

### Q4: If `const key = "marks"; const obj = { [key]: 95 };`, what is the output of `obj.marks`?
- A) `undefined`
- B) `95`
- C) `"key"`
- D) `null`
**Answer:** B
**Explanation:** The computed property evaluates `key` to `"marks"`, creating the property `{ marks: 95 }`.

### Q5: Can computed property names contain complex string concatenations or function calls?
- A) No, only single variables are allowed
- B) Yes, any valid JavaScript expression can be placed inside the computed property brackets `[...]`
- C) Only in Node.js
- D) Only with numbers
**Answer:** B
**Explanation:** Square brackets evaluate any valid JS expression (functions, calculations, template literals) into a string or symbol key.

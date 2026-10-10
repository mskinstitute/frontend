# Object Basics and Properties in JavaScript

If arrays are ordered lists, **Objects** are structured dictionaries. Objects in JavaScript allow you to group related state and behavior into a single data structure composed of **key-value pairs** (also called properties and methods).

---

## 1. Creating Objects: Object Literal Syntax

The simplest and most common way to create an object is using curly braces `{ ... }`:

```javascript
const student = {
  // Properties (key: value)
  firstName: "Sumit",
  lastName: "Sharma",
  age: 24,
  isEnrolled: true,
  skills: ["HTML", "CSS", "JavaScript"],
  address: {
    city: "New Delhi",
    country: "India"
  },

  // Method (function inside an object)
  getFullName: function() {
    return `${this.firstName} ${this.lastName}`;
  }
};
```

---

## 2. Accessing and Modifying Properties

JavaScript offers two ways to access object properties:

### A. Dot Notation (`object.property`)
Clean, standard, and easy to read:
```javascript
console.log(student.firstName); // "Sumit"
console.log(student.address.city); // "New Delhi"

// Calling a method:
console.log(student.getFullName()); // "Sumit Sharma"
```

### B. Bracket Notation (`object["property"]`)
Mandatory in two critical scenarios:
1. When property names contain **spaces or hyphens**:
   ```javascript
   const config = { "api-version": "v2", "max retries": 3 };
   console.log(config["api-version"]); // Valid! config.api-version would fail!
   ```
2. When the property key is stored in a **dynamic variable**:
   ```javascript
   const keyToLookUp = "age";
   console.log(student[keyToLookUp]); // 24!
   // student.keyToLookUp would look literally for a property named 'keyToLookUp'!
   ```

---

## 3. Adding, Updating, and Deleting Properties

Objects in JavaScript are dynamic:

```javascript
const course = {
  title: "Full-Stack Development",
  duration: "6 months"
};

// 1. Updating an existing property:
course.duration = "12 months";

// 2. Adding a brand new property:
course.instructor = "Sumit Sir";
course.rating = 4.9;

// 3. Deleting a property using the 'delete' keyword:
delete course.rating;

console.log(course);
// { title: "Full-Stack Development", duration: "12 months", instructor: "Sumit Sir" }
```

---

## 4. Checking if a Property Exists

```javascript
const user = { name: "Aarav", email: "aarav@gmail.com" };

// 1. The 'in' operator:
console.log("email" in user); // true
console.log("phoneNumber" in user); // false

// 2. Object.hasOwn() (Modern ES2022 standard):
console.log(Object.hasOwn(user, "name")); // true
```

---

## 5. The `this` Keyword Inside Object Methods

When a function is called as a method of an object, **`this`** refers to the object itself:

```javascript
const car = {
  brand: "Tesla",
  speed: 60,
  accelerate() {
    this.speed += 20;
    console.log(`${this.brand} is now moving at ${this.speed} km/h.`);
  }
};

car.accelerate(); // "Tesla is now moving at 80 km/h."
```

---

## Practice Quiz

### Q1: What data structure does a JavaScript object use to store data?
- A) A continuous sequence of binary bits
- B) Key-value pairs (properties and methods)
- C) LIFO stack frames
- D) CSV columns
**Answer:** B
**Explanation:** Objects in JavaScript represent collections of key-value pairs where keys are strings (or symbols) and values can be any data type.

### Q2: When MUST you use bracket notation (`obj[key]`) instead of dot notation (`obj.key`)?
- A) Whenever the object contains numbers
- B) When property names have spaces/hyphens or when the property name is held inside a dynamic variable
- C) Only inside loops
- D) Only on Tuesdays
**Answer:** B
**Explanation:** Bracket notation evaluates the expression inside the brackets, allowing dynamic variable evaluation or access to keys with special characters.

### Q3: What keyword is used to remove a property from an object in JavaScript?
- A) `remove`
- B) `delete`
- C) `discard`
- D) `pop`
**Answer:** B
**Explanation:** The `delete` operator removes a property from an object (e.g. `delete user.password`).

### Q4: Inside an object method, what does the `this` keyword refer to when invoked normally?
- A) The global window object
- B) The object on which the method was called
- C) The browser DOM
- D) Undefined
**Answer:** B
**Explanation:** In standard method calls, `this` points to the object preceding the dot that owns the method.

### Q5: What is the modern ES2022 method to safely check if an object owns a specific property key?
- A) `Object.hasOwn(obj, "key")`
- B) `obj.contains("key")`
- C) `obj.hasKey("key")`
- D) `Object.exists(obj, "key")`
**Answer:** A
**Explanation:** `Object.hasOwn(object, propertyName)` is the modern, safe replacement for the legacy `hasOwnProperty()`.

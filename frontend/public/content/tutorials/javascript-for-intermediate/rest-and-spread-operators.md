# Rest and Spread Operators (`...`)

The three dots (`...`) in modern JavaScript are used for two distinct, powerful features depending on context: the **Rest Parameter** (collecting items into an array) and the **Spread Operator** (unpacking items from an iterable).

---

## 1. Rest vs. Spread: The Core Difference

```
+-----------------------------------------------------------------------------+
| REST PARAMETER (Collects multiple items into ONE single array)              |
| Context: In function parameter lists or destructuring patterns              |
| Example: function sum(...numbers) { ... }                                  |
+-----------------------------------------------------------------------------+
                                     vs.
+-----------------------------------------------------------------------------+
| SPREAD OPERATOR (Expands ONE array/object into individual elements)         |
| Context: In function calls, array literals, or object literals             |
| Example: Math.max(...numbers)  |  [...arr1, ...arr2]                       |
+-----------------------------------------------------------------------------+
```

---

## 2. The Spread Operator in Action

### A. Combining and Cloning Arrays (Shallow Copy)
```javascript
const frontend = ["HTML", "CSS", "JS"];
const backend = ["Node.js", "Express", "MongoDB"];

// Combining arrays cleanly:
const fullStack = [...frontend, ...backend, "Git"];
console.log(fullStack);
// ["HTML", "CSS", "JS", "Node.js", "Express", "MongoDB", "Git"]

// Cloning an array (avoids mutating original):
const clonedFrontend = [...frontend];
clonedFrontend.push("React");
console.log(frontend); // ["HTML", "CSS", "JS"] (Untouched!)
```

### B. Spreading into Function Arguments:
```javascript
const scores = [88, 94, 72, 99, 81];

// Math.max expects numbers, not an array:
console.log(Math.max(...scores)); // 99 (Unpacked into 88, 94, 72, 99, 81)
```

### C. Spreading and Merging Objects:
```javascript
const defaultSettings = { theme: "dark", notifications: true, fontSize: 14 };
const userPreferences = { fontSize: 16, notifications: false };

// Merge: userPreferences override defaultSettings!
const finalConfig = { ...defaultSettings, ...userPreferences };
console.log(finalConfig);
// { theme: "dark", notifications: false, fontSize: 16 }
```

---

## 3. The Rest Parameter in Action

### A. Gathering Remaining Function Arguments:
```javascript
function awardMedals(gold, silver, ...bronzeRunners) {
  console.log(`🥇 Gold: ${gold}`);
  console.log(`🥈 Silver: ${silver}`);
  console.log(`🥉 Bronze Runners:`, bronzeRunners);
}

awardMedals("Sumit", "Neha", "Aarav", "Rahul", "Pooja");
// Bronze Runners: ["Aarav", "Rahul", "Pooja"]
```

### B. Rest in Array and Object Destructuring:
```javascript
// Array Rest:
const [first, second, ...remaining] = [10, 20, 30, 40, 50];
console.log(remaining); // [30, 40, 50]

// Object Rest:
const student = { id: 1, name: "Sumit", marks: 95, city: "Delhi" };
const { id, ...details } = student;
console.log(details); // { name: "Sumit", marks: 95, city: "Delhi" }
```

---

## Practice Quiz

### Q1: What is the primary difference between the Rest operator and the Spread operator?
- A) Rest packs elements into an array; Spread unpacks an array/iterable into individual elements
- B) Rest only works with strings; Spread with numbers
- C) Rest is deprecated
- D) Spread only works in Node.js
**Answer:** A
**Explanation:** Rest collects multiple items into a single array structure, while Spread expands an array or object into its constituent elements.

### Q2: How do you create a shallow copy of an array `original` using Spread?
- A) `const copy = [...original];`
- B) `const copy = (...original);`
- C) `const copy = { ...original };`
- D) `const copy = original.spread();`
**Answer:** A
**Explanation:** `[...original]` expands the items of `original` into a brand new array literal.

### Q3: Where must the Rest parameter (`...rest`) be placed in a function's parameter list?
- A) As the first parameter
- B) Anywhere in the parameter list
- C) As the very last parameter
- D) It must be the only parameter
**Answer:** C
**Explanation:** Rest parameters collect all remaining arguments, so placing them anywhere other than the end causes a SyntaxError.

### Q4: If `const obj1 = { a: 1, b: 2 }; const obj2 = { b: 99, c: 3 }; const merged = { ...obj1, ...obj2 };`, what is the value of `merged.b`?
- A) 2
- B) 99 (properties spread later override earlier matching keys)
- C) `[2, 99]`
- D) `undefined`
**Answer:** B
**Explanation:** In object spread, later properties overwrite earlier properties with the same key name.

### Q5: What does `[..."MSK"]` evaluate to?
- A) `["MSK"]`
- B) `["M", "S", "K"]`
- C) `"MSK"`
- D) `TypeError`
**Answer:** B
**Explanation:** Strings are iterable; spreading a string unpacks each individual character into an element of the new array.

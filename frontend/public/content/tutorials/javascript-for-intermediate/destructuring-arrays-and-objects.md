# Destructuring Arrays and Objects in Depth

Destructuring is an expressive ES6 syntax that unpacks values from arrays or properties from objects into distinct variables. It significantly reduces boilerplate code and is ubiquitous in modern JavaScript and React development.

---

## 1. Object Destructuring

Object destructuring extracts properties by their **matching key names**:

```javascript
const student = {
  id: 101,
  fullName: "Sumit Sharma",
  city: "New Delhi",
  role: "Instructor"
};

// Basic destructuring:
const { fullName, role } = student;
console.log(fullName); // "Sumit Sharma"
console.log(role);     // "Instructor"
```

### A. Renaming Variables During Destructuring:
Use the colon syntax (`originalKey: newVariableName`):
```javascript
const { fullName: studentName, city: location } = student;
console.log(studentName); // "Sumit Sharma"
console.log(location);    // "New Delhi"
```

### B. Default Values:
Provide fallback values if the property is `undefined`:
```javascript
const { score = 100, isGraduated = false } = student;
console.log(score); // 100 (Default applied!)
```

### C. Nested Object Destructuring:
```javascript
const user = {
  id: 5,
  profile: {
    avatar: "sumit.png",
    social: {
      github: "sumit-msk"
    }
  }
};

const { profile: { social: { github } } } = user;
console.log(github); // "sumit-msk"
```

---

## 2. Array Destructuring

Array destructuring extracts elements based on their **numerical position (index)**:

```javascript
const coordinates = [28.6139, 77.2090];

// Destructure by position:
const [latitude, longitude] = coordinates;
console.log(`Lat: ${latitude}, Lng: ${longitude}`);
```

### A. Skipping Elements:
Use commas without variable names to skip unwanted positions:
```javascript
const rgb = [255, 128, 0];
const [red, , blue] = rgb; // Skips green at index 1!
console.log(`Red: ${red}, Blue: ${blue}`);
```

### B. Swapping Variables Without a Temporary Variable:
One of the most elegant tricks in JavaScript:
```javascript
let a = 1;
let b = 2;

// In-place swap using array destructuring:
[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

---

## 3. Destructuring in Function Parameters (React Pattern)

In React and modern JavaScript libraries, functions destructure props directly in the parameter signature:

```javascript
// Clean parameter destructuring with default fallback:
function renderUserBadge({ name, tier = "Standard", badgeColor = "#38bdf8" }) {
  console.log(`[${tier.toUpperCase()}] ${name} (Color: ${badgeColor})`);
}

renderUserBadge({ name: "Neha", tier: "Gold" });
// [GOLD] Neha (Color: #38bdf8)
```

---

## Practice Quiz

### Q1: In object destructuring, how do you assign property `name` to a new variable called `studentName`?
- A) `const { name -> studentName } = obj;`
- B) `const { name: studentName } = obj;`
- C) `const { studentName = name } = obj;`
- D) `const [ name as studentName ] = obj;`
**Answer:** B
**Explanation:** The colon syntax `key: newAlias` assigns the value of property `key` to a newly declared variable `newAlias`.

### Q2: What is the value of `b` after: `const [a, , b] = [10, 20, 30, 40];`?
- A) 20
- B) 30 (skips index 1)
- C) 40
- D) `undefined`
**Answer:** B
**Explanation:** The empty slot `, ,` skips index 1 (20), binding the next variable `b` to index 2 (30).

### Q3: How can two variables `x` and `y` be swapped in one clean line without using a third temporary variable?
- A) `x = y; y = x;`
- B) `[x, y] = [y, x];`
- C) `swap(x, y);`
- D) `x.swap(y);`
**Answer:** B
**Explanation:** `[x, y] = [y, x]` creates a temporary array with the values `[y, x]` and destructured-assigns them back into `x` and `y`.

### Q4: What happens if you destructure a property that does not exist on an object and has no default value?
- A) It throws a `ReferenceError`
- B) The variable is initialized with `undefined`
- C) The variable is set to `null`
- D) It deletes the object
**Answer:** B
**Explanation:** Missing object properties evaluate to `undefined` during destructuring.

### Q5: What is the benefit of destructuring an options object directly in function parameters?
- A) It eliminates the need for `props.name` repetition and documents expected object keys right in the function signature
- B) It prevents the function from returning promises
- C) It doubles execution speed
- D) It converts data to JSON automatically
**Answer:** A
**Explanation:** Parameter destructuring unpacks expected fields upfront, improves readability, and makes optional arguments with defaults clean and explicit.

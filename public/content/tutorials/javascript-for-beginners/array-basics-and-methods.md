# Array Basics and Methods in JavaScript

An **Array** is an ordered, zero-indexed list of values. Arrays in JavaScript are dynamic: they can grow or shrink in size and hold any mixture of data types (strings, numbers, objects, even other arrays).

---

## 1. Creating and Accessing Arrays

```javascript
// Array literal syntax (Standard):
const fruits = ["Apple", "Banana", "Mango", "Orange"];

// Accessing elements (Zero-indexed):
console.log(fruits[0]); // "Apple"
console.log(fruits[2]); // "Mango"

// Array length:
console.log(fruits.length); // 4

// Modern .at() method for negative indexing:
console.log(fruits.at(-1)); // "Orange" (Last element!)
```

---

## 2. Mutating Arrays: Add & Remove Elements

Git, games, and web forms frequently add and remove list items. JavaScript provides four primary stack/queue methods:

```
        unshift() [Add to Front]          push() [Add to End]
                   \                          /
                   [ Item 1 , Item 2 , Item 3 ]
                   /                          \
        shift() [Remove Front]             pop() [Remove End]
```

### Methods Summary:
```javascript
const tasks = ["Study HTML", "Learn CSS"];

// 1. push() - Adds one or more elements to the END (Returns new length)
tasks.push("Master JS");
console.log(tasks); // ["Study HTML", "Learn CSS", "Master JS"]

// 2. pop() - Removes and returns the LAST element
const removedLast = tasks.pop();
console.log(removedLast); // "Master JS"

// 3. unshift() - Adds one or more elements to the BEGINNING
tasks.unshift("Morning Yoga");
console.log(tasks); // ["Morning Yoga", "Study HTML", "Learn CSS"]

// 4. shift() - Removes and returns the FIRST element
const removedFirst = tasks.shift();
console.log(removedFirst); // "Morning Yoga"
```

---

## 3. Searching in Arrays

### A. `.includes()`
Checks if an item exists; returns `true` or `false`:
```javascript
const colors = ["red", "green", "blue"];
console.log(colors.includes("green")); // true
console.log(colors.includes("yellow"));// false
```

### B. `.indexOf()`
Returns index of item, or `-1` if not found:
```javascript
console.log(colors.indexOf("blue")); // 2
console.log(colors.indexOf("purple")); // -1
```

---

## 4. Subarrays: `.slice()` vs. `.splice()` (Crucial Difference!)

| Method | Mutates Original Array? | Purpose |
|---|:---:|---|
| **`.slice(start, end)`** | **NO** (Pure) | Extracts a shallow copy of a portion of the array |
| **`.splice(start, deleteCount, ...items)`** | **YES** (Mutates) | Deletes, replaces, or inserts items in place! |

```javascript
const letters = ["A", "B", "C", "D", "E"];

// .slice does NOT change original:
const sub = letters.slice(1, 4);
console.log(sub);     // ["B", "C", "D"]
console.log(letters); // ["A", "B", "C", "D", "E"] (Intact!)

// .splice DELETES items from original:
// Remove 2 items starting from index 1, and insert "X":
letters.splice(1, 2, "X");
console.log(letters); // ["A", "X", "D", "E"] (Mutated!)
```

---

## 5. Joining Arrays into Strings: `.join()`

```javascript
const breadcrumbs = ["Home", "Courses", "JavaScript"];
console.log(breadcrumbs.join(" > ")); // "Home > Courses > JavaScript"
```

---

## Practice Quiz

### Q1: What does `arr.push("item")` do?
- A) Adds an item to the beginning of the array
- B) Appends an item to the end of the array
- C) Deletes the last item
- D) Reverses the array
**Answer:** B
**Explanation:** `push()` adds one or more elements to the end of an array and returns the new array length.

### Q2: What does `arr.shift()` do?
- A) Removes and returns the first element of an array
- B) Removes the last element
- C) Moves elements to another array
- D) Sorts the array alphabetically
**Answer:** A
**Explanation:** `shift()` removes the zero-th index element from the front of the array and shifts all consecutive elements down by one.

### Q3: What is the fundamental difference between `arr.slice()` and `arr.splice()`?
- A) `slice()` only works with numbers; `splice()` works with strings
- B) `slice()` returns a new copy without modifying the original array; `splice()` mutates the original array in place
- C) `splice()` is deprecated
- D) There is no difference
**Answer:** B
**Explanation:** `slice()` is an immutable method that extracts elements into a new array, while `splice()` directly alters the contents of the target array.

### Q4: If `const arr = ["A", "B", "C"]`, what does `arr.indexOf("D")` return?
- A) `null`
- B) `0`
- C) `-1`
- D) `false`
**Answer:** C
**Explanation:** When the requested element is absent from the array, `indexOf()` returns `-1`.

### Q5: How do you concatenate all elements of `["2026", "09", "15"]` with hyphens into a string `"2026-09-15"`?
- A) `arr.concat("-")`
- B) `arr.join("-")`
- C) `arr.toString("-")`
- D) `arr.split("-")`
**Answer:** B
**Explanation:** `.join(separator)` glues all elements of an array together into a string using the specified separator string.

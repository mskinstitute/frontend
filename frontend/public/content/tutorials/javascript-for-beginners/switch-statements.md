# Switch Statements in JavaScript

When an algorithm must test a single variable against many potential constant values, chaining ten `else if` statements can become repetitive and visually cluttered. The `switch` statement provides a structured, readable alternative.

---

## 1. Syntax of a `switch` Statement

```javascript
switch (expression) {
  case value1:
    // Code executed when expression === value1
    break;
  case value2:
    // Code executed when expression === value2
    break;
  default:
    // Code executed if NO cases matched
}
```

### Real-World Example: User Role Router
```javascript
function getDashboardRedirectUrl(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "instructor":
      return "/teacher/classes";
    case "student":
      return "/student/my-courses";
    default:
      return "/login";
  }
}

console.log(getDashboardRedirectUrl("student")); // "/student/my-courses"
```

---

## 2. The Critical Role of the `break` Statement

> [!WARNING]
> If you omit the `break` statement (or a `return`), JavaScript will continue executing subsequent cases automatically, regardless of whether their conditions match! This behavior is called **Fall-Through**.

### The Fall-Through Trap:
```javascript
let fruit = "apple";

switch (fruit) {
  case "apple":
    console.log("Apples are $2");
    // Missing break!
  case "banana":
    console.log("Bananas are $1");
    break;
}

// Output:
// Apples are $2
// Bananas are $1  <-- Accidentally executed!
```

---

## 3. Intentional Fall-Through (Multi-Case Grouping)

Sometimes fall-through is exactly what you want! You can group multiple cases together to execute the same logic:

```javascript
function getDayCategory(dayNumber) {
  switch (dayNumber) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return "Weekday (Work / Study)";
    case 6:
    case 7:
      return "Weekend (Relax & Code!)";
    default:
      return "Invalid Day Number";
  }
}

console.log(getDayCategory(3)); // "Weekday (Work / Study)"
console.log(getDayCategory(6)); // "Weekend (Relax & Code!)"
```

---

## 4. `switch` Uses Strict Equality (`===`)

A `switch` statement compares cases using **strict equality (`===`)**:
```javascript
let input = "5"; // String

switch (input) {
  case 5:
    console.log("Number 5 matched");
    break;
  default:
    console.log("No match found!"); // This executes because "5" !== 5!
}
```

---

## Practice Quiz

### Q1: What comparison mechanism does the `switch` statement use to match cases?
- A) Loose equality (`==`)
- B) Strict equality (`===`)
- C) Greater than (`>`)
- D) Regular expressions
**Answer:** B
**Explanation:** `switch` evaluates matches using strict equality (`===`), comparing both type and value without coercion.

### Q2: What happens if a developer forgets to include a `break` statement at the end of a matching `case`?
- A) A syntax error is thrown
- B) Execution falls through into the next case and runs its code, even if that case does not match
- C) The browser closes
- D) The program reboots
**Answer:** B
**Explanation:** Without a `break` or `return`, JavaScript executes subsequent cases sequentially (known as fall-through).

### Q3: What is the purpose of the `default` clause in a `switch` statement?
- A) It runs before any other case
- B) It executes when none of the specified case values match the switch expression
- C) It is mandatory on every line
- D) It encrypts the switch block
**Answer:** B
**Explanation:** The `default` block acts like the final `else` in an `if...else` chain, catching any unhandled values.

### Q4: How can you handle multiple cases that require the exact same code block?
- A) Separate them with semicolons
- B) Stack cases consecutively without breaks (e.g. `case 1: case 2: code; break;`)
- C) Write the function twice
- D) Put cases in quotes
**Answer:** B
**Explanation:** Stacking cases consecutively leverages intentional fall-through, executing the shared code block for any of the stacked values.

### Q5: If a case block contains a `return` statement, is a `break` statement still necessary?
- A) Yes, always
- B) No, `return` exits the entire enclosing function immediately, making `break` redundant
- C) Only on Windows
- D) Only in strict mode
**Answer:** B
**Explanation:** Because `return` immediately terminates function execution, control leaves the switch statement entirely without needing a `break`.

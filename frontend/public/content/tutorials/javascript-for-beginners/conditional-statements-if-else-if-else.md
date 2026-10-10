# Conditional Statements: `if`, `else if`, `else`

Programs must make decisions based on real-world inputs: whether a user is logged in, whether an item is in stock, or whether a payment succeeded. Conditional statements (`if`, `else if`, `else`) control the execution flow of your code based on boolean conditions.

---

## 1. Syntax of Conditional Blocks

```javascript
if (condition1) {
  // Executes if condition1 is truthy
} else if (condition2) {
  // Executes if condition1 was falsy AND condition2 is truthy
} else {
  // Executes if ALL preceding conditions were falsy
}
```

### Real-World Example: Grading System
```javascript
function evaluateStudentMarks(marks) {
  if (marks >= 90) {
    return "Grade A+ (Distinction)";
  } else if (marks >= 75) {
    return "Grade A (First Class)";
  } else if (marks >= 50) {
    return "Grade B (Second Class)";
  } else if (marks >= 35) {
    return "Grade C (Pass)";
  } else {
    return "Fail (Needs Improvement)";
  }
}

console.log(evaluateStudentMarks(82)); // "Grade A (First Class)"
```

---

## 2. Execution Mechanics: Order Matters!

JavaScript evaluates `else if` conditions **sequentially from top to bottom**:
- As soon as **one condition evaluates to `true`**, JavaScript executes that block and **skips all remaining `else if` and `else` blocks completely**!

### ❌ Common Trap: Incorrect Condition Order
```javascript
// BUGGY: 95 will match >= 50 first and return Grade B!
if (marks >= 50) {
  return "Grade B";
} else if (marks >= 90) {
  return "Grade A"; // Unreachable for 90+!
}
```

---

## 3. Nested `if` Statements vs. Logical Operators

You can nest `if` statements inside one another, but combining conditions with `&&` or `||` creates cleaner code:

### Nested (Cluttered):
```javascript
if (user.isLoggedIn) {
  if (user.role === "admin") {
    showAdminDashboard();
  }
}
```

### Flattened with `&&` (Clean):
```javascript
if (user.isLoggedIn && user.role === "admin") {
  showAdminDashboard();
}
```

---

## 4. The Guard Clause Pattern (Early Return)

In professional codebases, avoid deeply indented "pyramid of doom" conditionals. Use **Guard Clauses** to check for invalid conditions and return early:

```javascript
// Professional Guard Clause Pattern:
function processPayment(cart, user) {
  if (!user.isLoggedIn) {
    return { success: false, error: "Please log in to continue" };
  }

  if (cart.items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  if (user.balance < cart.total) {
    return { success: false, error: "Insufficient funds" };
  }

  // Happy path code stays un-nested at the bottom!
  return completeTransaction(cart, user);
}
```

---

## Practice Quiz

### Q1: What happens when an `if` condition evaluates to `false` and there is an `else` block?
- A) The program crashes
- B) The code inside the `else` block is executed
- C) The browser refreshes
- D) The `if` block is repeated
**Answer:** B
**Explanation:** If the `if` condition evaluates to a falsy value, execution bypasses the `if` block and runs the code within the `else` block.

### Q2: What happens if two different `else if` conditions are both mathematically true in the same chain?
- A) Both blocks execute simultaneously
- B) Only the first one encountered in top-to-bottom order executes; the second is skipped
- C) Neither executes
- D) A runtime error is thrown
**Answer:** B
**Explanation:** JavaScript executes only the first truthy condition in an `if...else if` chain and immediately exits the entire conditional structure.

### Q3: What is the "Guard Clause" pattern in clean coding?
- A) Protecting files with passwords
- B) Checking for failure conditions at the start of a function and returning early to avoid deep nesting
- C) Writing infinite loops
- D) Using global variables
**Answer:** B
**Explanation:** Guard clauses check edge cases and error states upfront with early returns, keeping the happy path code flat and readable.

### Q4: Which logical operator should be used if you want a block to execute only when BOTH `user.isActive` AND `user.hasSubscription` are true?
- A) `||`
- B) `&&`
- C) `!`
- D) `??`
**Answer:** B
**Explanation:** The logical AND operator (`&&`) requires both conditions to be true for the compound expression to pass.

### Q5: Can an `if` statement exist without an `else` block?
- A) No, `else` is mandatory
- B) Yes, an `if` statement can exist on its own without any `else if` or `else` blocks
- C) Only in Node.js
- D) Only when enclosed in a loop
**Answer:** B
**Explanation:** An `if` statement is completely standalone; `else if` and `else` clauses are optional.

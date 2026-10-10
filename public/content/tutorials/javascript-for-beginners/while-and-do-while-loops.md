# While and Do-While Loops in JavaScript

While a `for` loop is ideal when you know in advance how many times you need to iterate, **`while`** and **`do...while`** loops are designed for situations where iteration depends on dynamic conditions (e.g. waiting for user input, reading chunks from a stream, or rolling dice until a 6 appears).

---

## 1. The `while` Loop: Pre-Test Loop

The `while` loop evaluates its condition **before** executing the code block. If the condition is initially `false`, the code block **never runs at all**!

```
         [ Evaluate Condition ]
                |
       +--------+--------+
       | true            | false
       v                 v
[ Execute Body ]   [ Exit Loop ]
       |
       +---> [ Re-evaluate Condition ]
```

### Syntax:
```javascript
while (condition) {
  // Code executed while condition remains true
}
```

### Practical Example: Game Loop Simulation
```javascript
let health = 100;
let round = 1;

while (health > 0) {
  const damage = Math.floor(Math.random() * 30) + 10;
  health -= damage;
  console.log(`Round ${round}: Player took ${damage} damage. Health left: ${Math.max(0, health)}`);
  round++;
}

console.log("Game Over! Player has been defeated.");
```

---

## 2. The `do...while` Loop: Post-Test Loop

The `do...while` loop evaluates its condition **after** executing the code block.
> [!IMPORTANT]
> A `do...while` loop is **guaranteed to execute at least ONCE**, even if the condition is `false` from the very beginning!

```
[ Execute Body First ]
          |
          v
[ Evaluate Condition ]
          |
 +--------+--------+
 | true            | false
 v                 v
[ Loop repeats ]  [ Exit Loop ]
```

### Syntax:
```javascript
do {
  // Executes at least once!
} while (condition);
```

### Practical Example: User Prompt Validation
```javascript
let password;

do {
  password = prompt("Enter a password with at least 6 characters:");
} while (!password || password.length < 6);

console.log("Password accepted!");
```

---

## 3. Comparison: `while` vs `do...while`

```javascript
let count = 10;

// The while loop NEVER runs:
while (count < 5) {
  console.log("This will never print!");
}

// The do...while loop runs ONCE:
do {
  console.log("This prints exactly once!"); // Prints!
} while (count < 5);
```

| Loop Type | When Condition is Tested | Minimum Execution Count |
|---|---|:---:|
| **`while`** | Before the loop body (Pre-test) | **0** |
| **`do...while`** | After the loop body (Post-test) | **1** |

---

## Practice Quiz

### Q1: What is the primary operational difference between a `while` loop and a `do...while` loop?
- A) A `while` loop checks the condition before executing; a `do...while` loop executes the body first and checks the condition afterward
- B) `while` loops only work with strings
- C) `do...while` loops cannot be stopped
- D) `while` loops are deprecated in ES6
**Answer:** A
**Explanation:** `while` is a pre-test loop that may execute 0 times; `do...while` is a post-test loop guaranteed to execute at least once.

### Q2: How many times will `let x = 5; while (x < 3) { x++; }` execute?
- A) 0 times
- B) 1 time
- C) 5 times
- D) 3 times
**Answer:** A
**Explanation:** Since $5 < 3$ evaluates to `false` immediately, the loop body is never entered.

### Q3: How many times will `let y = 5; do { y++; } while (y < 3);` execute?
- A) 0 times
- B) Exactly 1 time
- C) 2 times
- D) Infinite times
**Answer:** B
**Explanation:** Because `do...while` executes before evaluating the condition, the body executes once, incrementing $y$ to 6, then exits when $6 < 3$ is false.

### Q4: What must you ensure occurs inside the body of a `while` loop to prevent an infinite loop?
- A) You must call `console.log()`
- B) You must update the variables involved in the loop condition so that the condition eventually becomes false
- C) You must use a `break` statement on line 1
- D) You must define an array
**Answer:** B
**Explanation:** If variables involved in the condition are never updated within the loop body, the condition remains true indefinitely, creating an infinite freeze.

### Q5: For which scenario is a `do...while` loop ideal?
- A) Requesting user input that must be prompted at least once before checking if it is valid
- B) Sorting an array of numbers
- C) Writing a CSS animation
- D) Connecting to a database
**Answer:** A
**Explanation:** Form inputs and menus that must prompt the user at least once before verifying whether their submission meets validation criteria naturally fit `do...while`.

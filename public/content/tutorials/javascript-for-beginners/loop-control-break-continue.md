# Loop Control: `break` and `continue`

When executing loops, standard sequential execution isn't always enough. You may want to exit a loop early when a searched item is found, or skip the current iteration when encountering invalid data. JavaScript provides **`break`** and **`continue`** for granular loop control.

---

## 1. The `break` Statement: Emergency Exit

The `break` statement **immediately terminates the entire loop** and jumps execution to the first statement following the loop:

```
Iteration 1 ---> Iteration 2 ---> [ break encountered! ]
                                            |
                                            v
                                 [ Jump OUT of loop completely ]
```

### Real-World Example: Linear Search
```javascript
const studentIds = [101, 204, 305, 409, 512, 630];
const target = 305;
let foundIndex = -1;

for (let i = 0; i < studentIds.length; i++) {
  if (studentIds[i] === target) {
    foundIndex = i;
    console.log(`Target ${target} found at index ${i}!`);
    break; // Stop looping! No need to check the remaining elements!
  }
}
```

Without `break`, the loop would uselessly continue checking the remaining elements, wasting CPU cycles!

---

## 2. The `continue` Statement: Skip to Next Iteration

The `continue` statement does **not** terminate the loop. Instead, it **skips the rest of the current iteration** and jumps immediately to the next iteration (evaluating the increment and condition):

```
Iteration 1 ---> Iteration 2 [ continue! ] ---> Iteration 3
                    |
                    +--> (Skips rest of body, proceeds to next cycle!)
```

### Real-World Example: Filtering Bad Data
```javascript
const transactions = [100, -20, 500, 0, -50, 300];
let totalDeposits = 0;

for (let i = 0; i < transactions.length; i++) {
  // Skip withdrawals or zero amounts:
  if (transactions[i] <= 0) {
    continue; // Skip directly to next transaction!
  }

  totalDeposits += transactions[i];
}

console.log(`Total valid deposits: ₹${totalDeposits}`); // ₹900
```

---

## 3. Summary: `break` vs `continue`

| Statement | What it does | Loop Status |
|---|---|---|
| **`break`** | Terminates loop immediately | **Exits** the loop entirely |
| **`continue`** | Skips remainder of current step | **Continues** with next step |

---

## 4. Labeled Statements (Advanced)

When working with nested loops, a standard `break` only exits the **innermost** loop. To break out of an **outer** loop from within an inner loop, use a **label**:

```javascript
outerLoop: for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    if (row === 1 && col === 1) {
      console.log("Treasure found! Breaking outer loop.");
      break outerLoop; // Exits BOTH loops!
    }
    console.log(`Scanning cell (${row}, ${col})`);
  }
}
```

---

## Practice Quiz

### Q1: What is the effect of encountering a `break` statement inside a loop?
- A) It skips only the current iteration
- B) It terminates the loop immediately, transferring execution to the code after the loop
- C) It restarts the loop from index 0
- D) It pauses execution for 5 seconds
**Answer:** B
**Explanation:** `break` forces an immediate, complete exit from the enclosing loop.

### Q2: What is the effect of encountering a `continue` statement inside a loop?
- A) It stops the loop permanently
- B) It skips the remaining statements in the current iteration and advances directly to the next iteration
- C) It throws a runtime error
- D) It deletes the loop counter
**Answer:** B
**Explanation:** `continue` abandons the remainder of the current cycle and proceeds with the next increment and condition check.

### Q3: In a loop from 1 to 10, what numbers are printed by:
```javascript
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  console.log(i);
}
```
- A) 1, 2, 3, 4, 5
- B) 1, 2 (stops at 3)
- C) 1, 2, 4, 5 (skips 3)
- D) 3 only
**Answer:** C
**Explanation:** When $i = 3$, `continue` triggers, skipping the `console.log(i)` call for 3 and proceeding to 4 and 5.

### Q4: When a `break` is executed inside an inner loop of a nested loop structure without labels, what happens?
- A) All loops are terminated
- B) Only the innermost loop is terminated; the outer loop continues running
- C) The outer loop restarts
- D) The program terminates
**Answer:** B
**Explanation:** By default, `break` only applies to the closest enclosing loop in which it is written.

### Q5: Can `break` be used inside a `switch` statement?
- A) No, `break` is only for loops
- B) Yes, `break` is used in `switch` statements to prevent fall-through into subsequent cases
- C) Only in Node.js
- D) Only if the switch has fewer than 3 cases
**Answer:** B
**Explanation:** In a `switch` statement, `break` terminates the switch block, preventing execution from falling through to subsequent cases.

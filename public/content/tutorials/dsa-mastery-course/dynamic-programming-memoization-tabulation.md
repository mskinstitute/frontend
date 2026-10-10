# Dynamic Programming: Overlapping Subproblems, Memoization vs Tabulation

**Dynamic Programming (DP)** is a powerful algorithmic paradigm used to solve complex optimization problems by breaking them down into simpler, overlapping subproblems. Rather than recomputing solutions to identical subproblems repeatedly, DP computes each subproblem solution exactly once and stores the result in memory (caching).

![Dynamic Programming Overlapping Subproblems and Memoization](/images/tutorials/dsa-mastery-course/dsa-dynamic-programming-memoization.svg)

---

## 1. The Two Core Prerequisites of DP

A problem can be solved with Dynamic Programming if and only if it exhibits both of the following mathematical properties:

1. **Optimal Substructure:**
   - An optimal solution to the overall problem contains within it optimal solutions to its subproblems.
   - *Example:* The shortest path from $A$ to $C$ via $B$ consists of the shortest path from $A$ to $B$ plus the shortest path from $B$ to $C$.
2. **Overlapping Subproblems:**
   - The recursive decomposition visits the same identical subproblem states repeatedly.
   - *Example:* In naive Fibonacci calculation:
     $$\text{Fib}(5) = \text{Fib}(4) + \text{Fib}(3)$$
     $$\text{Fib}(4) = \text{Fib}(3) + \text{Fib}(2)$$
     Notice that $\text{Fib}(3)$ is computed twice, $\text{Fib}(2)$ three times, leading to explosive $O(2^n)$ exponential duplication!

---

## 2. Top-Down Memoization vs. Bottom-Up Tabulation

```
                     Problem Decomposition Approaches
                                    |
            +-----------------------+-----------------------+
            |                                               |
     Top-Down (Memoization)                       Bottom-Up (Tabulation)
  - Recursive with caching                   - Iterative table building
  - Starts at target state (N)               - Starts at base cases (0, 1)
  - Solves only required subproblems         - Solves all subproblems in order
  - Incurs call stack overhead               - Eliminates recursion stack (O(1) space optimization possible)
```

### Direct Comparison

| Feature | Top-Down (Memoization) | Bottom-Up (Tabulation) |
| :--- | :--- | :--- |
| **Flow of Execution** | Root to Leaves (Target down to Base Cases) | Leaves to Root (Base Cases up to Target) |
| **Implementation** | Recursion + Cache (Hash Map or Array) | Iterative `for` loops + Array table |
| **Subproblem Coverage** | Computes only *reachable* subproblems | Computes *all* table states in sequence |
| **Space Optimization** | Difficult to reduce space complexity | Often reducible from $O(n)$ to $O(1)$ space |
| **Stack Overflow Risk** | Yes, if recursion depth exceeds system limit | Zero risk; pure iterative execution |

---

## 3. The 5-Step Framework to Master Any DP Problem

When faced with any DP question in an interview, follow this structured blueprint:

1. **Define the State:** What does `dp[i]` (or `dp[i][j]`) represent in plain English?
2. **Formulate the Recurrence Relation (Transition):** How does `dp[i]` depend on previous states (e.g., `dp[i-1]`, `dp[i-2]`)?
3. **Identify the Base Cases:** What are the trivial stopping conditions that cannot be broken down further (e.g., `dp[0] = 0`, `dp[1] = 1`)?
4. **Determine the Order of Computation:** In what order must the table be filled so that dependencies are already resolved when calculating the current state?
5. **Space Optimization (Optional):** Can we replace the full $O(n)$ array with just 2 or 3 scalar variables?

---

## 4. Case Study: Climbing Stairs (LeetCode 70)

**Problem:** You are climbing a staircase with $n$ steps. Each time you can climb either 1 or 2 steps. In how many distinct ways can you climb to the top?

### Step 1: State Definition
Let `dp[i]` be the number of distinct ways to reach step `i`.

### Step 2: Recurrence Relation
To reach step `i`, you could have jumped from step `i-1` (by taking 1 step) or from step `i-2` (by taking 2 steps):
$$\text{dp}[i] = \text{dp}[i-1] + \text{dp}[i-2]$$

### Step 3: Base Cases
- `dp[1] = 1` (Only 1 way: `[1]`)
- `dp[2] = 2` (2 ways: `[1, 1]` or `[2]`)

### Step-by-Step Trace Table for $n = 5$

| Step ($i$) | Ways from $i-1$ | Ways from $i-2$ | Total Ways `dp[i]` | Possible Paths |
| :--- | :--- | :--- | :--- | :--- |
| **1** | - | - | **1** | `(1)` |
| **2** | - | - | **2** | `(1+1), (2)` |
| **3** | `dp[2] = 2` | `dp[1] = 1` | **3** | `(1+1+1), (2+1), (1+2)` |
| **4** | `dp[3] = 3` | `dp[2] = 2` | **5** | All 3 from step 3 + all 2 from step 2 |
| **5** | `dp[4] = 5` | `dp[3] = 3` | **8** | $5 + 3 = 8$ distinct paths |

---

## 5. Dual-Language Implementation

### Python 3: All Approaches

```python
from typing import Dict

# 1. Top-Down Memoization (Recursive)
def climb_stairs_memo(n: int) -> int:
    memo: Dict[int, int] = {1: 1, 2: 2}

    def dp(step: int) -> int:
        if step in memo:
            return memo[step]
        memo[step] = dp(step - 1) + dp(step - 2)
        return memo[step]

    return dp(n)

# 2. Bottom-Up Tabulation (Iterative O(N) Space)
def climb_stairs_tabulation(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# 3. Space-Optimized Bottom-Up (O(1) Auxiliary Space)
def climb_stairs_optimized(n: int) -> int:
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    return prev1

# Example Test
if __name__ == "__main__":
    print("Ways for 5 stairs (Memo):", climb_stairs_memo(5))          # 8
    print("Ways for 5 stairs (Tab):", climb_stairs_tabulation(5))     # 8
    print("Ways for 5 stairs (Opt):", climb_stairs_optimized(5))      # 8
```

### Modern JavaScript (Node.js) Implementation

```javascript
// 1. Top-Down Memoization
function climbStairsMemo(n, memo = new Map([[1, 1], [2, 2]])) {
  if (memo.has(n)) return memo.get(n);
  const result = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// 2. Space-Optimized Bottom-Up Tabulation (O(1) Space)
function climbStairsOptimized(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example Test
console.log("Climb Stairs (5) Memo:", climbStairsMemo(5)); // 8
console.log("Climb Stairs (5) Opt:", climbStairsOptimized(5)); // 8
```

---

## 6. Complexity Comparison

| Implementation | Time Complexity | Auxiliary Space Complexity | Call Stack Overhead |
| :--- | :--- | :--- | :--- |
| **Naive Recursion** | $O(2^n)$ (Exponential!) | $O(n)$ | Yes |
| **Top-Down Memoization** | $O(n)$ (Linear) | $O(n)$ (Memo table + Call stack) | Yes |
| **Bottom-Up Tabulation** | $O(n)$ (Linear) | $O(n)$ (DP array) | **No** |
| **Space-Optimized DP** | $O(n)$ (Linear) | $O(1)$ (Only two variables) | **No** |

---

# Multiple Choice Questions

### 1. Which two conditions must a problem satisfy to be solvable with Dynamic Programming?
A. Greedy choice property and polynomial complexity
B. Optimal substructure and overlapping subproblems
C. Directed acyclic edges and binary tree representation
D. Divide and conquer hierarchy with disjoint partitions
**Answer:** B
**Explanation:** Dynamic Programming requires optimal substructure (the global optimal solution is composed of optimal subproblem solutions) and overlapping subproblems (the same subproblems are solved repeatedly).

---

### 2. What is the fundamental difference between Memoization and Tabulation?
A. Memoization is bottom-up iterative, while Tabulation is top-down recursive
B. Memoization is top-down recursive using a cache; Tabulation is bottom-up iterative using a table
C. Tabulation requires exponential memory, while Memoization always operates in $O(1)$ space
D. Memoization only works on graphs, while Tabulation only works on trees
**Answer:** B
**Explanation:** Memoization starts at the original problem and works down recursively to the base cases, caching intermediate results. Tabulation starts at the base cases and builds solutions iteratively upward in a table.

---

### 3. How does Dynamic Programming reduce the time complexity of the Fibonacci calculation from naive recursion $O(2^n)$ to $O(n)$?
A. By sorting the numbers before adding them
B. By computing each distinct Fibonacci state exactly once and storing it for $O(1)$ future lookups
C. By using binary search on the answer space
D. By converting the numbers to binary floating-point representation
**Answer:** B
**Explanation:** Naive Fibonacci recalculates the same subproblems repeatedly, creating an exponential call tree. Memoization/tabulation ensures that each subproblem $\text{Fib}(i)$ is solved exactly once, reducing the operations to $n$ linear steps.

---

### 4. When is space optimization from $O(n)$ down to $O(1)$ achievable in a 1D Dynamic Programming problem?
A. Only when the target value $n$ is smaller than 10
B. When the current state `dp[i]` depends strictly on a fixed, constant number of previous states (e.g., only `dp[i-1]` and `dp[i-2]`)
C. Whenever the problem has no base cases
D. When using top-down recursion instead of bottom-up loops
**Answer:** B
**Explanation:** If the recurrence relation only references `dp[i-1]` and `dp[i-2]`, we only need to store the two most recent values in scalar variables rather than preserving the entire historical array.

---

### 5. What risk is inherent to Top-Down Memoization that is completely eliminated by Bottom-Up Tabulation?
A. Overlapping subproblems
B. System Call Stack Overflow due to deep recursion
C. Inability to use hash tables
D. Infinite loop cycles caused by negative numbers
**Answer:** B
**Explanation:** Top-down memoization relies on function recursion. For large problem inputs (e.g., $N = 10^5$), the recursion depth can exceed the call stack limit and crash the program. Tabulation uses standard loops and avoids call stack overhead entirely.

---

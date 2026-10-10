# Classic DP Master Patterns: 0/1 Knapsack, Coin Change & LCS

To excel in technical coding interviews (FAANG, Tier-1 tech firms), you do not need to memorize hundreds of individual dynamic programming problems. Instead, 90% of interview DP problems derive directly from **three foundational archetype patterns**:

1. **0/1 Knapsack Pattern** (Pick or Don't Pick decisions under capacity constraints)
2. **Unbounded Knapsack / Coin Change Pattern** (Repetitive item choices, minimization / counting)
3. **Longest Common Subsequence (LCS) Pattern** (2D string matching, edits, and alignments)

---

## 1. Pattern 1: 0/1 Knapsack Problem

**The Problem:** Given $N$ items with weights `weights[i]` and values `values[i]`, and a knapsack of maximum capacity $W$. Find the maximum total value we can pack into the knapsack such that each item can be chosen **at most once (0 or 1)**.

### State & Recurrence
Let `dp[i][w]` be the maximum value achievable using a subset of the first `i` items with a remaining weight capacity `w`.

For each item $i$:
1. **Exclude item $i$:** `dp[i-1][w]`
2. **Include item $i$ (if $weights[i-1] \le w$):** `values[i-1] + dp[i-1][w - weights[i-1]]`

$$\text{dp}[i][w] = \max(\text{dp}[i-1][w], \text{values}[i-1] + \text{dp}[i-1][w - \text{weights}[i-1]])$$

```
2D Knapsack Grid Concept:
             Weight Capacity (w) ->
Items (i)     0   1   2   3   4   5
  Item 0 (0) [0,  0,  0,  0,  0,  0]
  Item 1 (w=2, v=3) [0,  0,  3,  3,  3,  3]
  Item 2 (w=3, v=4) [0,  0,  3,  4,  4,  7]
```

### 1D Space Optimization (The Reverse Loop Trick)
Notice that state `dp[w]` depends solely on values from the **previous row** at or to the left of `w`. By traversing the capacity backwards from $W$ down to $\text{weight}$, we can compress the 2D grid into a single 1D array without overwriting needed prior states:
```python
for weight, value in zip(weights, values):
    for w in range(W, weight - 1, -1):  # Traverse BACKWARDS!
        dp[w] = max(dp[w], value + dp[w - weight])
```

---

## 2. Pattern 2: Coin Change (Unbounded Knapsack)

**The Problem (LeetCode 322):** Given coins of different denominations and a total amount of money, return the **minimum number of coins** needed to make up that amount. If that amount cannot be made up, return `-1`. Each coin is available in unlimited supply.

### State & Recurrence
Let `dp[a]` be the minimum coins needed to produce amount `a`.

$$\text{dp}[a] = \min_{c \in \text{coins}, c \le a} (\text{dp}[a - c] + 1)$$

Base case: `dp[0] = 0`; all other amounts initialized to $\infty$.

### Step-by-Step Trace: Coins `[1, 2, 5]`, Target `11`
| Amount ($a$) | Calculation | `dp[a]` | Optimal Combination |
| :--- | :--- | :--- | :--- |
| **0** | Base Case | **0** | `[]` |
| **1** | $\text{dp}[1-1]+1 = 0+1$ | **1** | `[1]` |
| **2** | $\min(\text{dp}[1]+1, \text{dp}[0]+1) = \min(2, 1)$ | **1** | `[2]` |
| **5** | $\min(\text{dp}[4]+1, \text{dp}[3]+1, \text{dp}[0]+1)$ | **1** | `[5]` |
| **11** | $\min(\text{dp}[10]+1, \text{dp}[9]+1, \text{dp}[6]+1) = 2+1$ | **3** | `[5, 5, 1]` |

---

## 3. Pattern 3: Longest Common Subsequence (LCS)

**The Problem (LeetCode 1143):** Given two strings `text1` and `text2`, return the length of their longest common subsequence. (A subsequence retains relative order without requiring consecutive adjacency).

### State & 2D Recurrence
Let `dp[i][j]` be the LCS of `text1[0...i-1]` and `text2[0...j-1]`.

$$\text{dp}[i][j] = \begin{cases} 1 + \text{dp}[i-1][j-1] & \text{if } text1[i-1] == text2[j-1] \\ \max(\text{dp}[i-1][j], \text{dp}[i][j-1]) & \text{if } text1[i-1] \neq text2[j-1] \end{cases}$$

---

## 4. Dual-Language Implementation

### Python 3 Implementation: All 3 Master Patterns

```python
from typing import List

# 1. 0/1 Knapsack with 1D Space Optimization
def knapsack_01(weights: List[int], values: List[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for w_item, v_item in zip(weights, values):
        # Reverse iteration ensures each item is used at most once
        for w in range(capacity, w_item - 1, -1):
            dp[w] = max(dp[w], v_item + dp[w - w_item])
    return dp[capacity]

# 2. Coin Change (Fewest Coins)
def coin_change(coins: List[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for c in coins:
            if a >= c:
                dp[a] = min(dp[a], dp[a - c] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# 3. Longest Common Subsequence (LCS)
def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]

# Verification
if __name__ == "__main__":
    print("0/1 Knapsack Max Value:", knapsack_01([1, 3, 4, 5], [1, 4, 5, 7], 7)) # 9 (items w=3,4)
    print("Coin Change Minimum Coins:", coin_change([1, 2, 5], 11))             # 3 (5+5+1)
    print("LCS Length ('abcde', 'ace'):", longest_common_subsequence("abcde", "ace")) # 3
```

### Modern JavaScript (Node.js) Implementation

```javascript
// 1. 0/1 Knapsack (1D Space Optimized)
function knapsack01(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    const v = values[i];
    for (let cap = capacity; cap >= w; cap--) {
      dp[cap] = Math.max(dp[cap], v + dp[cap - w]);
    }
  }
  return dp[capacity];
}

// 2. Coin Change
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a >= c) {
        dp[a] = Math.min(dp[a], dp[a - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 3. Longest Common Subsequence
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Verification
console.log("0/1 Knapsack:", knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9
console.log("Coin Change:", coinChange([1, 2, 5], 11)); // 3
console.log("LCS:", longestCommonSubsequence("abcde", "ace")); // 3
```

---

## 5. Pattern Recognition Cheat Sheet

| LeetCode Problem | Archetype Pattern | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Partition Equal Subset Sum (416)** | 0/1 Knapsack | $O(N \times \text{Target})$ | $O(\text{Target})$ |
| **Target Sum (494)** | 0/1 Knapsack | $O(N \times \text{Sum})$ | $O(\text{Sum})$ |
| **Coin Change II (518)** | Unbounded Knapsack (Forward Loop) | $O(N \times \text{Amount})$ | $O(\text{Amount})$ |
| **Edit Distance (72)** | 2D LCS Variant | $O(M \times N)$ | $O(M \times N)$ |
| **Longest Palindromic Subsequence (516)** | LCS of String with its Reverse | $O(N^2)$ | $O(N^2)$ |

---

# Multiple Choice Questions

### 1. In the 1D space-optimized version of the 0/1 Knapsack algorithm, why must the capacity loop iterate in reverse (from $W$ down to $\text{weight}$)?
A. Because reverse iteration speeds up CPU memory cache lines
B. To ensure each item is considered at most once and prevent the current item from contributing multiple times within the same round
C. Because dynamic programming arrays can only be accessed from the right
D. To sort the items by density
**Answer:** B
**Explanation:** If we iterated forward ($w$ from $\text{weight}$ to $W$), the value computed for `dp[w]` could use the newly updated `dp[w - weight]`, which already includes the current item. Iterating backwards ensures `dp[w - weight]` represents the state from the previous item only.

---

### 2. What is the time complexity of the classic 0/1 Knapsack problem with $N$ items and capacity $W$?
A. $O(N \log W)$
B. $O(N \times W)$ (Pseudo-polynomial time)
C. $O(2^N)$
D. $O(N + W)$
**Answer:** B
**Explanation:** The nested loops run $N$ times (for each item) and $W$ times (for each capacity unit), resulting in a running time of $O(N \times W)$. This is termed "pseudo-polynomial" because it is polynomial in the magnitude of $W$, but exponential in the number of bits needed to represent $W$.

---

### 3. In the Longest Common Subsequence (LCS) problem, what is the state transition when `text1[i-1] == text2[j-1]`?
A. `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
B. `dp[i][j] = 1 + dp[i-1][j-1]`
C. `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
D. `dp[i][j] = 0`
**Answer:** B
**Explanation:** When characters match, both characters contribute to extending the common subsequence by length 1. The result is $1$ plus the LCS of the prefixes without these matching characters: `1 + dp[i-1][j-1]`.

---

### 4. How does the Unbounded Knapsack (Coin Change) iteration differ from the 0/1 Knapsack iteration in 1D DP?
A. Unbounded Knapsack runs in $O(1)$ space, while 0/1 Knapsack requires 3D arrays
B. In Unbounded Knapsack, the inner capacity loop runs forward (from coin value up to target) because the same item can be reused unlimited times
C. Unbounded Knapsack does not use addition
D. Unbounded Knapsack requires negative indices
**Answer:** B
**Explanation:** In Unbounded Knapsack, an item can be picked repeatedly. Iterating forward deliberately allows the calculation of `dp[a]` to build upon `dp[a - coin]`, which may have already utilized the same coin denomination.

---

### 5. How can the problem "Longest Palindromic Subsequence" of a string $S$ be solved using the LCS algorithm?
A. Compute the LCS between string $S$ and its reversed string $\text{reverse}(S)$
B. Run binary search on string $S$
C. Push string $S$ into a monotonic stack
D. Traverse the string using two pointers in opposite directions
**Answer:** A
**Explanation:** A palindrome reads identically forward and backward. The longest sequence of characters that retains its order in both $S$ and $\text{reverse}(S)$ is precisely the Longest Common Subsequence of $S$ and $\text{reverse}(S)$.

---

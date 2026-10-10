# Prefix Sums & Difference Arrays for Constant-Time Range Queries

When dealing with frequent range sum queries or bulk range updates on an array, naive solutions require $O(n)$ per query, resulting in an unscalable $O(n \times q)$ for $q$ queries. **Prefix Sum Arrays** solve range sum queries in **$O(1)$ constant time**, while **Difference Arrays** apply range updates across intervals in **$O(1)$ constant time**.

---

## 1. Real-World Analogy: The Odometer & Ledger

Imagine tracking your car's fuel expenses:
- Instead of writing down how much you spent on every 5 km interval and adding them up every time someone asks your expenses between day 10 and day 20, you record your **running cumulative total** at the end of every day.
- To find spending between Day $L$ and Day $R$, you simply compute:
  $$\text{Total}(L \to R) = \text{Odometer}(R) - \text{Odometer}(L - 1)$$
A single subtraction gives you the exact total instantly!

---

## 2. Prefix Sum Array Construction & Formula

Given an array `arr`:
$$\text{prefix}[0] = \text{arr}[0]$$
$$\text{prefix}[i] = \text{prefix}[i - 1] + \text{arr}[i]$$

### Range Sum Query Formula (Inclusive indices $L$ to $R$):
$$\text{Sum}(L, R) = \begin{cases} \text{prefix}[R] & \text{if } L = 0 \\ \text{prefix}[R] - \text{prefix}[L - 1] & \text{if } L > 0 \end{cases}$$

```text
Original: [3, 1, 4, 1, 5]
Prefix:   [3, 4, 8, 9, 14]

Sum from index 1 to 3 (values: 1 + 4 + 1 = 6):
Formula: prefix[3] - prefix[0] = 9 - 3 = 6! (Calculated in O(1))
```

---

## 3. Difference Arrays: $O(1)$ Range Updates

Suppose you need to add $+V$ to all elements in range $[L, R]$ for 100,000 queries:
- Naive loop: $O(R - L) \approx O(n)$ per update.
- **Difference Array Technique:**
  1. $\text{diff}[L] \mathrel{+}= V$ (marks the start of the increment)
  2. $\text{diff}[R + 1] \mathrel{-}= V$ (cancels out the increment after the boundary!)
  3. After all $q$ queries, compute the prefix sum of the difference array in a single $O(n)$ pass!

---

## 4. Multi-Language Implementations: Prefix Sum Class

### Python 3:
```python
class PrefixSum:
    def __init__(self, nums: list[int]):
        # 1-indexed prefix array simplifies boundary checks (prefix[0] = 0)
        self.pref = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.pref[i + 1] = self.pref[i] + nums[i]

    def query_range(self, left: int, right: int) -> int:
        # Sum of nums[left...right] in O(1) time
        return self.pref[right + 1] - self.pref[left]
```

### Modern JavaScript / TypeScript:
```typescript
export class PrefixSum {
  private pref: number[];

  constructor(nums: number[]) {
    this.pref = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.pref[i + 1] = this.pref[i] + nums[i];
    }
  }

  public queryRange(left: number, right: number): number {
    return this.pref[right + 1] - this.pref[left];
  }
}
```

---

## 5. Trace Table: Range Updates via Difference Array

Initial Array of size 5: `[0, 0, 0, 0, 0]`
- Query 1: Add $+10$ to range $[1, 3]$
- Query 2: Add $+5$ to range $[2, 4]$

| Step | Index 0 | Index 1 | Index 2 | Index 3 | Index 4 | Index 5 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Initial diff** | 0 | 0 | 0 | 0 | 0 | 0 |
| **After Q1: `diff[1]+=10, diff[4]-=10`** | 0 | **+10** | 0 | 0 | **-10** | 0 |
| **After Q2: `diff[2]+=5, diff[5]-=5`** | 0 | +10 | **+5** | 0 | -10 | **-5** |
| **Prefix Sum Pass (Final Values)** | **0** | **10** | **15** | **15** | **5** | 0 |

Resulting array `[0, 10, 15, 15, 5]` generated with zero looping per query!

---

# Multiple Choice Questions

### 1. What is the time complexity to answer a single range sum query `sumRange(L, R)` using a precomputed prefix sum array?
A. $O(n)$
B. $O(\log n)$
C. $O(1)$
D. $O(R - L)$
**Answer:** C
**Explanation:** Once the prefix sum array is precomputed in $O(n)$ time, any subsequent range sum query requires a single subtraction: `prefix[R] - prefix[L - 1]`, executing in $O(1)$ time.
---

### 2. How much auxiliary space does a standard 1D prefix sum array require for an input of size $n$?
A. $O(1)$
B. $O(n)$
C. $O(n^2)$
D. $O(\log n)$
**Answer:** B
**Explanation:** Storing cumulative sums for each index requires allocating an auxiliary array of size $n + 1$, consuming linear $O(n)$ space.
---

### 3. In a Difference Array, how do you mark adding a value $V$ to all indices in the inclusive interval $[L, R]$?
A. Loop from $L$ to $R$ and add $V$ to each element.
B. Increment index $L$ by $+V$ and decrement index $R + 1$ by $-V$.
C. Multiply index $L$ by $V$.
D. Add $V$ to all elements in the database.
**Answer:** B
**Explanation:** Marking $\text{diff}[L] \mathrel{+}= V$ and $\text{diff}[R + 1] \mathrel{-}= V$ applies the increment to the prefix sum starting at $L$ and cancels it out beyond $R$.
---

### 4. What is the primary advantage of initializing a prefix sum array with size $n + 1$ and setting `prefix[0] = 0`?
A. It prevents out-of-memory errors on 32-bit systems.
B. It eliminates boundary condition checks (`if L == 0`) by making the formula `prefix[R + 1] - prefix[L]` universally valid for all ranges.
C. It allows storing strings in the prefix sum.
D. It sorts the array automatically.
**Answer:** B
**Explanation:** 1-based prefix arrays elegantly avoid negative index checking when querying ranges that start at index 0 (`L = 0`).
---

### 5. In 2D Matrix Prefix Sums, what is the formula to compute the submatrix sum from $(r_1, c_1)$ to $(r_2, c_2)$?
A. $\text{pref}[r_2][c_2] - \text{pref}[r_1 - 1][c_2] - \text{pref}[r_2][c_1 - 1] + \text{pref}[r_1 - 1][c_1 - 1]$
B. $\text{pref}[r_2][c_2] + \text{pref}[r_1][c_1]$
C. $\text{pref}[r_2][c_2] \times \text{pref}[r_1][c_1]$
D. $\text{pref}[r_2 - r_1][c_2 - c_1]$
**Answer:** A
**Explanation:** By the Principle of Inclusion-Exclusion, subtracting the top and left overlapping rectangles subtracts the top-left intersection twice, requiring it to be added back once.
---

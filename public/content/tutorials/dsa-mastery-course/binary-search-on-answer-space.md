# Binary Search on Answer Space: Allocation & Feasibility Checks

While traditional binary search finds a value within an explicit sorted array, advanced technical interview problems apply binary search to an **abstract range of numerical answers** (the **"Answer Space"**). This paradigm solves optimization problems like **"Capacity to Ship Packages Within D Days"**, **"Koko Eating Bananas"**, and **"Book Allocation"** in $O(n \log(\text{range}))$ time.

---

## 1. Real-World Analogy: Tuning the Perfect Water Faucet Temperature

Imagine adjusting the knob on a shower to find the exact temperature you can tolerate:
- You don't test every single degree between 0°C and 100°C one by one.
- You turn the knob to the middle (50°C). It is scalding hot (**Infeasible**).
- You know that every temperature above 50°C will also be scalding hot! You instantly eliminate the entire upper half.
- You turn the knob down to 25°C. It's too cold. You narrow your range to 25°C–50°C.
- You are binary searching a **monotonic feasibility function**!

---

## 2. When Can You Binary Search the Answer?

You can apply Binary Search on the Answer Space if the problem satisfies the **Monotonicity Condition**:
$$\text{If an answer } X \text{ is feasible, then every value } > X \text{ (or } < X\text{) is guaranteed to be feasible!}$$

```text
Speed / Capacity:   1   2   3   4   5   6   7   8   9   10
Feasible in D Days? F   F   F   F   T   T   T   T   T   T
                                    ^
                             MINIMUM FEASIBLE CAPACITY!
```

---

## 3. Classic Problem: Capacity To Ship Packages Within D Days

A conveyor belt has packages with weights `weights[i]`. We must ship all packages within `days` days. Packages must be loaded in order, and each day's total weight cannot exceed the ship's weight capacity. Return the **minimum weight capacity** of the ship.

### The Algorithm:
1. **Search Space:**
   - Minimum possible capacity: `max(weights)` (the ship must carry at least the heaviest single item!).
   - Maximum possible capacity: `sum(weights)` (shipping everything in 1 day).
2. **Feasibility Function (`can_ship_in_days(capacity)`):**
   - Greedily pack items into the current day until exceeding capacity. Count total days required.
   - If `days_needed <= days`, return `True`; else `False`.

---

## 4. Multi-Language Implementations: Shipping Capacity

### Python 3:
```python
def ship_within_days(weights: list[int], days: int) -> int:
    # 1. Define the monotonic answer search space
    low = max(weights)
    high = sum(weights)
    ans = high
    
    # 2. Feasibility helper function
    def can_ship(capacity: int) -> bool:
        days_needed = 1
        current_load = 0
        for w in weights:
            if current_load + w > capacity:
                days_needed += 1
                current_load = 0
            current_load += w
        return days_needed <= days

    # 3. Binary search for minimum feasible capacity
    while low <= high:
        mid = low + (high - low) // 2
        if can_ship(mid):
            ans = mid      # Mid is feasible! Try searching for a smaller capacity
            high = mid - 1
        else:
            low = mid + 1  # Not feasible, ship must be bigger
            
    return ans
```

### Modern JavaScript / TypeScript:
```typescript
export function shipWithinDays(weights: number[], days: number): number {
  let low = Math.max(...weights);
  let high = weights.reduce((a, b) => a + b, 0);
  let ans = high;

  function canShip(capacity: number): boolean {
    let daysNeeded = 1;
    let currentLoad = 0;
    for (const w of weights) {
      if (currentLoad + w > capacity) {
        daysNeeded++;
        currentLoad = 0;
      }
      currentLoad += w;
    }
    return daysNeeded <= days;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (canShip(mid)) {
      ans = mid;
      high = mid - 1; // Try smaller capacity
    } else {
      low = mid + 1; // Increase capacity
    }
  }

  return ans;
}
```

---

## 5. Trace Table: `weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, `days = 5`

- `low = max(weights) = 10`
- `high = sum(weights) = 55`

| Iteration | `low` | `high` | `mid` | Days Needed with Capacity `mid` | Feasible? (`<= 5`) | Action |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 10 | 55 | 32 | 2 days | Yes | `ans = 32, high = 31` |
| **2** | 10 | 31 | 20 | 4 days | Yes | `ans = 20, high = 19` |
| **3** | 10 | 19 | 14 | 5 days | Yes | `ans = 14, high = 13` |
| **4** | 10 | 13 | 11 | 8 days | No | `low = 12` |
| **5** | 12 | 13 | 12 | 7 days | No | `low = 13` |
| **6** | 13 | 13 | 13 | 6 days | No | `low = 14 (terminates)` |

**Final Result:** Minimum feasible capacity is **15** (or verified at 15)!

---

# Multiple Choice Questions

### 1. What core mathematical property must a feasibility function exhibit to allow Binary Search on Answer Space?
A. Commutativity
B. Monotonicity: if a value $X$ is feasible, then all values in one direction are guaranteed to be feasible or infeasible.
C. Associativity
D. Randomness
**Answer:** B
**Explanation:** Monotonicity ensures that the answer space transitions deterministically from False to True (or vice-versa), enabling half-space elimination.
---

### 2. In "Capacity to Ship Packages Within D Days", why is the lower bound of the search space initialized to `max(weights)`?
A. Because weights cannot be negative.
B. If the ship's capacity were less than the weight of the heaviest single package, that package could never be loaded onto the ship.
C. To reduce the size of the JavaScript bundle.
D. To prevent stack overflow.
**Answer:** B
**Explanation:** Since packages cannot be split across multiple days, the ship capacity must be at least large enough to carry the single heaviest item.
---

### 3. What is the time complexity of the Binary Search on Answer Space for shipping packages, where $N$ is the number of packages and $W = \text{sum(weights)} - \text{max(weights)}$?
A. $O(N \times W)$
B. $O(N \log W)$
C. $O(N^2)$
D. $O(W \log N)$
**Answer:** B
**Explanation:** The binary search takes $\log(W)$ iterations, and in each iteration the feasibility function scans the $N$ weights linearly ($O(N)$), yielding $O(N \log W)$.
---

### 4. When the feasibility function returns `True` while searching for the *minimum* possible valid capacity, how should the binary search bounds be updated?
A. `low = mid + 1`
B. `ans = mid; high = mid - 1` (Save current mid as valid and search for a smaller valid value)
C. Break the loop immediately.
D. `high = sum(weights)`
**Answer:** B
**Explanation:** Because we seek the minimal value, finding a feasible `mid` means an even smaller answer might exist in the left half, so we narrow `high = mid - 1`.
---

### 5. Which of the following problems can be framed as Binary Search on Answer Space?
A. Reversing a Linked List
B. Koko Eating Bananas (LeetCode 875)
C. Valid Parentheses
D. Invert Binary Tree
**Answer:** B
**Explanation:** Koko Eating Bananas searches for the minimum eating speed $K$ (bananas/hour) capable of finishing all piles within $H$ hours.
---

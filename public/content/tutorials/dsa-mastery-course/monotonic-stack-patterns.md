# Monotonic Stacks: Next Greater Element & Histogram Area Patterns

A **Monotonic Stack** is a specialized stack whose elements are strictly maintained in a sorted monotonic order—either **strictly increasing** or **strictly decreasing**. This pattern is the secret weapon for solving range-lookup problems (like **Next Greater Element**, **Daily Temperatures**, and **Largest Rectangle in Histogram**) in single-pass **$O(n)$ linear time** instead of brute-force $O(n^2)$.

---

## 1. Real-World Analogy: Waiting for a Taller Person

Imagine people standing in a line waiting at a bus stop:
- A person looks forward into the distance.
- Shorter people in front of them are completely blocked from view by the first person who is **taller than them**.
- Once a giant steps into the line, all shorter people standing behind them are overshadowed. A monotonic decreasing stack maintains this exact line of sight!

---

## 2. The Two Types of Monotonic Stacks

1. **Monotonically Increasing Stack:** Elements from bottom to top are in increasing order ($1 \to 3 \to 5 \to 8$).
   - Used to find the **Previous/Next Smaller Element**.
2. **Monotonically Decreasing Stack:** Elements from bottom to top are in decreasing order ($8 \to 5 \to 3 \to 1$).
   - Used to find the **Previous/Next Greater Element**.

```text
Algorithm Rule for Monotonic Decreasing Stack (Next Greater Element):
Before pushing element X:
While stack is not empty AND stack.top() < X:
    pop() element (because X is the "Next Greater Element" for the popped item!)
push(X)
```

---

## 3. Classic Problem: Daily Temperatures

Given an array of daily temperatures `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the $i$-th day to get a warmer temperature. If there is no future day with a warmer temperature, keep `answer[i] == 0`.

### Python 3 Implementation:
```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    result = [0] * n
    stack = [] # Stores INDICES: [index, ...]
    
    for current_day, current_temp in enumerate(temperatures):
        # Pop days whose temperatures are cooler than today's temperature!
        while stack and temperatures[stack[-1]] < current_temp:
            prev_day = stack.pop()
            result[prev_day] = current_day - prev_day
            
        stack.append(current_day)
        
    return result
```

### Modern JavaScript / TypeScript Implementation:
```typescript
export function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const result: number[] = new Array(n).fill(0);
  const stack: number[] = []; // Stores indices

  for (let currentDay = 0; currentDay < n; currentDay++) {
    const currentTemp = temperatures[currentDay];

    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < currentTemp) {
      const prevDay = stack.pop()!;
      result[prevDay] = currentDay - prevDay;
    }

    stack.push(currentDay);
  }

  return result;
}
```

---

## 4. Trace Table: `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`

| Day ($i$) | Temp | Stack Before (Indices) | While Loop Condition (`top_temp < curr`) | Pops & Result Updates | Stack After |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **0** | 73 | `[]` | False | None | `[0]` |
| **1** | 74 | `[0]` (73) | 73 < 74 (True) | Pop 0 $\to$ `res[0] = 1 - 0 = 1` | `[1]` |
| **2** | 75 | `[1]` (74) | 74 < 75 (True) | Pop 1 $\to$ `res[1] = 2 - 1 = 1` | `[2]` |
| **3** | 71 | `[2]` (75) | 75 < 71 (False) | None | `[2, 3]` |
| **4** | 69 | `[2, 3]` (75, 71) | 71 < 69 (False) | None | `[2, 3, 4]` |
| **5** | 72 | `[2, 3, 4]` (75, 71, 69) | 69 < 72, then 71 < 72 | Pop 4 $\to$ `res[4]=1`, Pop 3 $\to$ `res[3]=2` | `[2, 5]` |
| **6** | 76 | `[2, 5]` (75, 72) | 72 < 76, then 75 < 76 | Pop 5 $\to$ `res[5]=1`, Pop 2 $\to$ `res[2]=4` | `[6]` |
| **7** | 73 | `[6]` (76) | 76 < 73 (False) | None | `[6, 7]` |

**Final Result:** `[1, 1, 4, 2, 1, 1, 0, 0]`. Every index is pushed and popped at most once: **$O(n)$ time!**

---

# Multiple Choice Questions

### 1. What is the time complexity of the Monotonic Stack solution for finding the Next Greater Element for all $n$ items in an array?
A. $O(n^2)$
B. $O(n \log n)$
C. $O(n)$
D. $O(1)$
**Answer:** C
**Explanation:** Even though there is a `while` loop inside the `for` loop, each element is pushed onto the stack exactly once and popped at most once, yielding amortized $O(n)$ time.
---

### 2. Why do we store the *indices* of elements on the stack rather than their raw values in problems like Daily Temperatures?
A. Values cannot be stored in stacks.
B. Storing indices allows instant calculation of both the distance between days (`currentDay - prevDay`) and lookup of the original values (`temperatures[stack.top]`).
C. Indices consume less RAM.
D. To prevent infinite loops.
**Answer:** B
**Explanation:** Indices provide full flexibility: you can measure distances between occurrences while retrieving the underlying values with an $O(1)$ array lookup.
---

### 3. What property is maintained by a Monotonically Decreasing Stack?
A. All elements are negative numbers.
B. Elements from bottom to top are arranged in strictly decreasing (or non-increasing) order.
C. The stack can only hold 2 elements.
D. The stack pops automatically every 10 seconds.
**Answer:** B
**Explanation:** In a monotonically decreasing stack, each element pushed onto the stack is strictly smaller than or equal to the element beneath it.
---

### 4. Which advanced algorithmic problem is famously solved in $O(n)$ linear time using a monotonic increasing stack?
A. Quick Sort
B. Largest Rectangle in Histogram
C. Dijkstra's Algorithm
D. Matrix Chain Multiplication
**Answer:** B
**Explanation:** Largest Rectangle in Histogram uses a monotonic increasing stack to determine the left and right boundaries where each bar is the minimum height in $O(n)$ time.
---

### 5. What is the auxiliary space complexity of a Monotonic Stack for an array of size $n$?
A. $O(1)$
B. $O(n)$
C. $O(n^2)$
D. $O(\log n)$
**Answer:** B
**Explanation:** In the worst-case scenario (such as a strictly decreasing input array where no elements are popped until the end), the stack stores all $n$ indices, consuming $O(n)$ space.
---

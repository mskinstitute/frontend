# Binary Search: Search Space Elimination, Lower Bound & Upper Bound

**Binary Search** is the cornerstone divide-and-conquer searching algorithm. By repeatedly halving the search space of a **sorted sequence**, binary search locates elements in **$O(\log n)$ logarithmic time**, searching through 4 billion items in just **32 comparisons**!

---

## 1. Real-World Analogy: The Guessing Game (1 to 100)

Suppose someone asks you to guess a hidden secret number between 1 and 100:
- If you guess 1, 2, 3, 4, 5... you might need 100 guesses (**Linear Search**).
- Instead, you guess **50**! The host says: *"Too low!"*
- Instantly, numbers 1 through 50 are **eliminated**. The search space shrinks from 100 to 50 items in a single guess.
- Next, you guess **75**. The host says: *"Too high!"*
- Numbers 75 through 100 are eliminated. In just 7 guesses, you can find any number from 1 to 100 ($2^7 = 128$).

---

## 2. The Core Binary Search Algorithm

```text
Given sorted array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target = 23
low = 0, high = 9
mid = low + (high - low) // 2 = 4 (value: 16)
16 < 23 -> Target is in the RIGHT half -> set low = mid + 1 (index 5)
mid = 5 + (9 - 5) // 2 = 7 (value: 56)
56 > 23 -> Target is in the LEFT half -> set high = mid - 1 (index 6)
mid = 5 + (6 - 5) // 2 = 5 (value: 23)
23 == 23 -> TARGET FOUND at index 5!
```

---

## 3. Preventing the Integer Overflow Bug

In languages like C++, Java, and Go, writing `mid = (low + high) / 2` can cause a catastrophic **32-bit integer overflow** if `low + high > 2,147,483,647`, wrapping around into a negative number.

Always calculate `mid` using the mathematically equivalent overflow-safe formula:
$$\text{mid} = \text{low} + \left\lfloor\frac{\text{high} - \text{low}}{2}\right\rfloor$$

---

## 4. Multi-Language Implementations: Classic & Lower Bound

### Python 3:
```python
def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1 # Target not present

# Lower Bound: First index where nums[index] >= target
def lower_bound(nums: list[int], target: int) -> int:
    low, high = 0, len(nums)
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] >= target:
            high = mid
        else:
            low = mid + 1
    return low
```

### Modern JavaScript / TypeScript:
```typescript
export function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
```

---

## 5. Trace Table: Searching for 70 in `[10, 20, 30, 40, 50, 60, 70, 80]`

| Step | `low` | `high` | `mid` | `nums[mid]` | Comparison | Action |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 0 | 7 | 3 | 40 | $40 < 70$ | `low = mid + 1 = 4` |
| **2** | 4 | 7 | 5 | 60 | $60 < 70$ | `low = mid + 1 = 6` |
| **3** | 6 | 7 | 6 | 70 | $70 == 70$ | **Target Found at Index 6!** |

---

# Multiple Choice Questions

### 1. What mandatory prerequisite must be satisfied before Binary Search can be applied to an array?
A. All elements must be prime numbers.
B. The array elements must be ordered / sorted according to a monotonic comparison rule.
C. The array must contain no negative numbers.
D. The array size must be a power of 2.
**Answer:** B
**Explanation:** Binary search relies on monotonicity to eliminate half of the remaining elements at each step; unsorted data cannot guarantee which half contains the target.
---

### 2. Why is `mid = low + (high - low) // 2` preferred over `mid = (low + high) // 2`?
A. It executes 10x faster on modern CPUs.
B. It prevents 32-bit signed integer overflow when `low + high` exceeds $2^{31} - 1$.
C. It allows searching floating point numbers.
D. `(low + high)` is invalid syntax in Python.
**Answer:** B
**Explanation:** If both `low` and `high` are large positive integers near $2^{31}-1$, their sum overflows into a negative value, causing index out-of-bounds crashes.
---

### 3. What is the maximum number of comparisons Binary Search requires to search an array of $1,000,000$ sorted elements?
A. 1,000,000
B. 500,000
C. Approximately 20 comparisons
D. 100 comparisons
**Answer:** C
**Explanation:** Since $2^{20} = 1,048,576 > 1,000,000$, halving the array takes at most $\lceil\log_2(1,000,000)\rceil \approx 20$ iterations.
---

### 4. What does the "Lower Bound" of a target in a sorted array with duplicates represent?
A. The smallest number in the array.
B. The first (lowest) index where the element is greater than or equal to the target.
C. The last occurrence of the target.
D. The average value of the array.
**Answer:** B
**Explanation:** Lower bound identifies the first position where an inserted target would maintain sorted order (the first element $\ge \text{target}$).
---

### 5. What is the time complexity of Binary Search on a singly linked list?
A. $O(\log n)$
B. $O(n)$
C. $O(1)$
D. $O(n \log n)$
**Answer:** B
**Explanation:** Even though the mathematical logic of binary search takes $O(\log n)$ steps, finding the `mid` element in a linked list requires traversing $O(n)$ pointers, nullifying the speed advantage.
---

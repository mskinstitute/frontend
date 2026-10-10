# Sliding Window Algorithm: Fixed & Dynamic Window Strategies

The **Sliding Window Algorithm** is a sub-array and sub-string optimization technique. Instead of recalculating contiguous segments from scratch using nested loops ($O(n^2)$), the algorithm maintains a moving "window" that slides across the sequence, updating the internal state incrementally in **$O(n)$ linear time**.

---

## 1. Real-World Analogy: The Train Window

Imagine you are riding a train through the countryside, looking out through a small rectangular window:
- As the train moves forward 1 meter, you do not need to rediscover the entire landscape.
- **One tree enters your field of view from the right**, and **one tree leaves your field of view from the left**.
- The remaining scenery inside the window stays identical! This is the essence of sliding window: **Add incoming element on the right, subtract outgoing element on the left**.

---

## 2. The Two Window Paradigms

### Type 1: Fixed-Size Window ($K$)
The size of the window is strictly constant (e.g. "Find maximum sum of any contiguous subarray of length $K$").
- Advance `right` pointer until window size equals $K$.
- At each subsequent step: add `arr[right]`, subtract `arr[left]`, and increment both pointers (`left++`, `right++`).

### Type 2: Dynamic (Variable-Size) Window
The window size expands and shrinks dynamically to satisfy a constraint (e.g. "Find the longest substring without repeating characters", "Smallest subarray with sum $\ge S$").
- Expand `right` pointer to include elements and update state.
- While the window constraint is **violated**, shrink the window from the left (`left++`) until valid again.
- Record the maximum/minimum window length at valid states.

---

## 3. Fixed Window Implementation: Max Subarray Sum of Size $K$

### Python 3:
```python
def max_sub_array_sum(nums: list[int], k: int) -> int:
    if len(nums) < k:
        return 0
        
    # 1. Compute initial sum of first k elements
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # 2. Slide the window from index k to end
    for right in range(k, len(nums)):
        # Add new right element, subtract old left element (right - k)
        window_sum += nums[right] - nums[right - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum
```

### Modern JavaScript / TypeScript:
```typescript
export function maxSubArraySum(nums: number[], k: number): number {
  if (nums.length < k) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }

  let maxSum = windowSum;
  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
```

---

## 4. Dynamic Window: Longest Substring Without Repeating Characters

Given a string `s`, find the length of the longest substring without duplicate characters:

### Python 3:
```python
def length_of_longest_substring(s: str) -> int:
    char_index_map = {} # Tracks last seen index of each character
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # If character is already in window, jump left pointer past it!
        if char in char_index_map and char_index_map[char] >= left:
            left = char_index_map[char] + 1
            
        char_index_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len
```

---

## 5. Trace Table: `s = "abcabcbb"`

| `right` | `char` | `left` | Window Substring | Action | `max_len` |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 'a' | 0 | "a" | Map: `{a:0}` | 1 |
| 1 | 'b' | 0 | "ab" | Map: `{a:0, b:1}` | 2 |
| 2 | 'c' | 0 | "abc" | Map: `{a:0, b:1, c:2}` | 3 |
| 3 | 'a' | 1 | "bca" | Duplicate 'a' seen at 0 $\to$ `left = 0 + 1 = 1` | 3 |
| 4 | 'b' | 2 | "cab" | Duplicate 'b' seen at 1 $\to$ `left = 1 + 1 = 2` | 3 |
| 5 | 'c' | 3 | "abc" | Duplicate 'c' seen at 2 $\to$ `left = 2 + 1 = 3` | 3 |
| 6 | 'b' | 5 | "b" | Duplicate 'b' seen at 4 $\to$ `left = 4 + 1 = 5` | 3 |
| 7 | 'b' | 7 | "b" | Duplicate 'b' seen at 6 $\to$ `left = 6 + 1 = 7` | 3 |

**Result:** Maximum length is **3** ("abc"), achieved in single-pass $O(n)$ time!

---

# Multiple Choice Questions

### 1. How does a Sliding Window reduce the time complexity of finding the maximum sum subarray of size $K$ from $O(n \times K)$ to $O(n)$?
A. By sorting the array first.
B. By adding the single incoming element on the right and subtracting the single outgoing element on the left, maintaining running totals in $O(1)$ per step.
C. By using multi-threading.
D. By dividing the array by 2.
**Answer:** B
**Explanation:** Rather than summing $K$ elements at every starting index, the sliding window performs constant additions and subtractions per step.
---

### 2. When solving "Longest Substring with At Most K Distinct Characters", when should the `left` pointer advance?
A. Only after reaching the end of the string.
B. Whenever the number of distinct characters in the current window exceeds $K$.
C. At every single iteration.
D. When an uppercase letter is encountered.
**Answer:** B
**Explanation:** In dynamic sliding windows, the left pointer shrinks the window whenever the current window violates the problem's distinct character constraint.
---

### 3. What is the space complexity of the Sliding Window technique when applied to an array of numbers with a fixed size $K$?
A. $O(n)$
B. $O(1)$
C. $O(K)$
D. $O(\log n)$
**Answer:** B
**Explanation:** A fixed window only requires a few scalar variables (`windowSum`, `maxSum`, loop pointers), using $O(1)$ constant auxiliary memory.
---

### 4. Which of the following problems is NOT suitable for the Sliding Window pattern?
A. Longest contiguous subarray with sum $\le S$
B. Subarray of size $K$ with minimum average
C. Longest Subsequence of non-contiguous characters
D. Minimum window substring containing all characters of pattern $P$
**Answer:** C
**Explanation:** Sliding Window requires **contiguous** subarrays or substrings; non-contiguous subsequences cannot be represented by a contiguous window.
---

### 5. In a dynamic sliding window where both `left` and `right` pointers only move forward from 0 to $n$, why is the total time complexity $O(n)$ even if there is a `while` loop nested inside a `for` loop?
A. Because while loops are ignored by Big-O.
B. Because each element is added by `right` at most once and removed by `left` at most once, bounding total pointer movements to $2n$.
C. Because $n$ is always small.
D. Due to CPU multithreading.
**Answer:** B
**Explanation:** Amortized analysis proves that since both pointers move in a single direction without resetting, the inner loop iterations across the entire algorithm sum to at most $n$.
---

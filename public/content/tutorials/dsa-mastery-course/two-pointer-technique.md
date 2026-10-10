# Two-Pointer Technique: Opposite-Direction & Fast-Slow Patterns

The **Two-Pointer Technique** is an algorithmic pattern that uses two pointer indices to coordinate searches or mutations across an array or sequence. By moving pointers intelligently based on problem constraints, two-pointer algorithms reduce brute-force $O(n^2)$ quadratic nested loops into blazing **$O(n)$ linear time** with **$O(1)$ auxiliary space**.

---

## 1. Real-World Analogy: Folding a Ruler or Reading a Word

Imagine inspecting whether a word like *"RADAR"* is a palindrome:
- You don't make a second copy of the word and check every combination.
- Instead, you place your left index finger on the first letter `'R'` and your right index finger on the last letter `'R'`.
- You verify they match, then slide your fingers inward simultaneously. If your fingers meet in the middle without any mismatches, it is a palindrome!

---

## 2. The Two Core Categories of Two Pointers

### Category 1: Opposite-Direction Pointers (Converging)
- Pointer `left` starts at index `0`.
- Pointer `right` starts at index `n - 1`.
- Pointers advance towards each other (`left++`, `right--`) until they meet.
- **Top Applications:** Reversing arrays, Palindrome checking, Two Sum in Sorted Array, Container with Most Water.

### Category 2: Same-Direction Pointers (Fast & Slow)
- Pointer `slow` tracks the boundary of clean/valid data.
- Pointer `fast` scans forward through the array.
- **Top Applications:** In-place element removal, deduplicating sorted arrays, moving zeros.

---

## 3. Classic Problem 1: Two Sum in a Sorted Array ($O(n)$)

Given a 1-indexed array of integers `numbers` sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number:

```text
Array: [2, 7, 11, 15], Target = 18
Left = 0 (val 2), Right = 3 (val 15) -> Sum = 17 (< 18, so increment Left!)
Left = 1 (val 7), Right = 3 (val 15) -> Sum = 22 (> 18, so decrement Right!)
Left = 1 (val 7), Right = 2 (val 11) -> Sum = 18 (Target MATCH!)
```

### Python 3 Implementation:
```python
def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1] # 1-based index
        elif current_sum < target:
            left += 1  # Need a larger sum -> move left pointer right
        else:
            right -= 1 # Need a smaller sum -> move right pointer left
            
    return []
```

### Modern JavaScript / TypeScript Implementation:
```typescript
export function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}
```

---

## 4. Classic Problem 2: Remove Duplicates from Sorted Array In-Place

Remove duplicates in-place such that each unique element appears only once, returning the count of unique items.

### Python 3:
```python
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    
    write_idx = 1 # Slow pointer: position to write next unique element
    
    for read_idx in range(1, len(nums)): # Fast pointer scans forward
        if nums[read_idx] != nums[read_idx - 1]:
            nums[write_idx] = nums[read_idx]
            write_idx += 1
            
    return write_idx
```

---

## 5. Trace Table: `nums = [1, 1, 2, 2, 3]`

| `read_idx` (Fast) | Current Value | Previous Value | Is Unique? | Action | Modified Array |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 1 | 1 | No | Skip | `[1, 1, 2, 2, 3]` |
| 2 | 2 | 1 | Yes | `nums[1] = 2`, `write++` | `[1, 2, 2, 2, 3]` |
| 3 | 2 | 2 | No | Skip | `[1, 2, 2, 2, 3]` |
| 4 | 3 | 2 | Yes | `nums[2] = 3`, `write++` | `[1, 2, 3, 2, 3]` |

**Result:** First 3 elements are `[1, 2, 3]`. Return length 3 in $O(n)$ time with $O(1)$ space!

---

# Multiple Choice Questions

### 1. What prerequisite condition is typically required to apply the opposite-direction Two-Pointer technique for the Two Sum problem?
A. The array must contain negative numbers only.
B. The array must be sorted in ascending (or descending) order.
C. The array size must be an odd number.
D. The array must be stored in a linked list.
**Answer:** B
**Explanation:** Sorting guarantees that incrementing the left pointer increases the sum and decrementing the right pointer decreases the sum, enabling deterministic decisions.
---

### 2. What is the time and space complexity of the Two-Pointer Two Sum solution on an already sorted array of size $n$?
A. Time: $O(n^2)$, Space: $O(n)$
B. Time: $O(n)$, Space: $O(1)$
C. Time: $O(\log n)$, Space: $O(n)$
D. Time: $O(n \log n)$, Space: $O(1)$
**Answer:** B
**Explanation:** Each step moves either the left or right pointer inward, inspecting each element at most once ($O(n)$) without auxiliary memory ($O(1)$).
---

### 3. In the Fast & Slow pointer pattern for removing duplicates in-place, what does the "slow" pointer track?
A. The number of seconds elapsed.
B. The boundary or write-index of the valid deduplicated elements processed so far.
C. The largest element in the array.
D. The last element of the array.
**Answer:** B
**Explanation:** The slow pointer serves as the write head that records unique elements discovered by the forward-scanning fast pointer.
---

### 4. Which of the following classic LeetCode/interview problems is optimally solved using converging Two Pointers?
A. Invert a Binary Tree
B. Container with Most Water
C. Shortest Path in a Weighted Graph
D. Fibonacci Sequence
**Answer:** B
**Explanation:** Container With Most Water initializes pointers at the two ends and greedily moves the pointer with the shorter wall inward in $O(n)$ time.
---

### 5. Why is the Two-Pointer approach preferred over a nested loop for checking if a string is a palindrome?
A. Nested loops cannot compare characters.
B. Nested loops take $O(n^2)$ time, whereas two pointers complete the check in a single pass of $O(n)$ time.
C. Two pointers require importing external libraries.
D. Two pointers encrypt the string.
**Answer:** B
**Explanation:** Two pointers compare characters from outer edges to the center in a single pass of $\frac{n}{2}$ comparisons, executing in linear $O(n)$ time.
---

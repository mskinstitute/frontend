# Hash Map Patterns: Two Sum, Frequency Counters & Subarray Sums

Hash maps are the single most effective tool for transforming sluggish brute-force $O(n^2)$ solutions into **$O(n)$ linear time**. By caching values in memory for instant $O(1)$ lookup, hash map patterns conquer interview classics: **Frequency Counters**, **Unsorted Two Sum**, and **Subarray Sum Equals K**.

---

## 1. Real-World Analogy: The Detective's Suspect Board

Imagine a detective looking for two puzzle pieces that combine to equal a target clue:
- Brute Force: Pick Piece 1, compare it against all other 10,000 pieces. Repeat for Piece 2, Piece 3 ($10,000^2$ comparisons).
- **Hash Map Look-Back Pattern:**
  - When inspecting Piece $X$, calculate what piece you need: $\text{Complement} = \text{Target} - X$.
  - Check your detective notebook (**Hash Map**): *"Have I already seen the Complement?"*
  - If yes, you found the pair instantly! If no, write $X$ in your notebook and move to the next piece.

---

## 2. Pattern 1: Unsorted Two Sum ($O(n)$ Time, $O(n)$ Space)

Given an **unsorted** array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

### Python 3 Implementation:
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {} # Maps value -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
        
    return []
```

### Modern JavaScript / TypeScript:
```typescript
export function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }

  return [];
}
```

---

## 3. Pattern 2: Frequency Counters & Valid Anagrams

Determine if string `t` is an anagram of string `s` (contains the exact same characters with identical counts):

```python
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
        
    counts = {}
    for char in s:
        counts[char] = counts.get(char, 0) + 1
        
    for char in t:
        if char not in counts or counts[char] == 0:
            return False
        counts[char] -= 1
        
    return True
```

---

## 4. Pattern 3: Subarray Sum Equals K (Prefix Sum + Hash Map)

Find the total number of continuous subarrays whose sum equals `k`:
- As we maintain a running prefix sum `curr_sum`, we need to know how many previous prefix sums equaled `curr_sum - k`.
- Storing prefix sum frequencies in a Hash Map unlocks an $O(n)$ solution for negative and positive numbers alike!

```python
def subarray_sum_equals_k(nums: list[int], k: int) -> int:
    prefix_counts = {0: 1} # Base case: a prefix sum of 0 has occurred once
    curr_sum = 0
    total_subarrays = 0
    
    for num in nums:
        curr_sum += num
        # If (curr_sum - k) exists in map, we found valid subarrays!
        if (curr_sum - k) in prefix_counts:
            total_subarrays += prefix_counts[curr_sum - k]
            
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1
        
    return total_subarrays
```

---

## 5. Trace Table: Two Sum on `nums = [2, 11, 7, 15]`, `target = 9`

| Index ($i$) | `nums[i]` | `complement = 9 - nums[i]` | In `seen` Map? | Action | `seen` Map State |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **0** | 2 | 7 | No | Store `{2: 0}` | `{2: 0}` |
| **1** | 11 | -2 | No | Store `{11: 1}` | `{2: 0, 11: 1}` |
| **2** | 7 | 2 | **Yes! (index 0)** | **Return `[0, 2]`** | Pair Found! |

**Result:** Returned `[0, 2]` in a single pass of 3 steps!

---

# Multiple Choice Questions

### 1. How does using a Hash Map reduce the Two Sum problem from $O(n^2)$ to $O(n)$?
A. It sorts the array automatically.
B. It allows checking whether the required complement (`target - num`) has been seen previously in $O(1)$ time during a single linear traversal.
C. It divides the array in half using binary search.
D. It deletes duplicate numbers.
**Answer:** B
**Explanation:** Storing visited numbers in a hash map turns complement verification into an instantaneous $O(1)$ lookup, achieving an $O(n)$ single-pass solution.
---

### 2. In the "Subarray Sum Equals K" problem, why must the prefix sum map be initialized with `{0: 1}`?
A. To prevent division by zero errors.
B. To account for subarrays that start at index 0 whose sum directly equals $k$ without needing a prior subtraction.
C. Because all hash maps require at least one key.
D. To sort the prefix sums.
**Answer:** B
**Explanation:** If a running prefix sum equals $k$, `curr_sum - k = 0`; having `{0: 1}` records that a sum of $k$ from the very beginning of the array is valid.
---

### 3. What is the time complexity of verifying if two strings of length $n$ are anagrams using a Frequency Counter hash table?
A. $O(n^2)$
B. $O(n)$
C. $O(\log n)$
D. $O(2^n)$
**Answer:** B
**Explanation:** Counting characters in the first string takes $O(n)$, and decrementing counts for the second string takes $O(n)$, giving an overall linear $O(n)$ runtime.
---

### 4. What is the space-time tradeoff of the Hash Map Two Sum approach compared to the Two-Pointer approach on an unsorted array?
A. Hash Map uses $O(1)$ space; Two Pointers uses $O(n)$ space.
B. Hash Map achieves $O(n)$ time with $O(n)$ auxiliary space, whereas sorting the array for Two Pointers takes $O(n \log n)$ time but can use $O(1)$ space.
C. Two Pointers runs in $O(n^3)$ time.
D. Hash Map only works on positive numbers.
**Answer:** B
**Explanation:** The hash map trades $O(n)$ memory to avoid the $O(n \log n)$ sorting step required by the two-pointer technique.
---

### 5. Why should you avoid using plain JavaScript objects (`{}`) as hash maps when keys are arbitrary objects or when prototype pollution is a security risk?
A. Plain objects cannot store strings.
B. Plain JavaScript objects inherit built-in prototype keys (like `toString`, `valueOf`) and only support string/symbol keys; `Map` supports any key type and avoids prototype pollution.
C. `Map` runs on the GPU.
D. Plain objects do not support JSON serialization.
**Answer:** B
**Explanation:** The native JavaScript `Map` class avoids prototype contamination, supports non-string keys, and provides clean `.get()`, `.set()`, and `.has()` APIs.
---

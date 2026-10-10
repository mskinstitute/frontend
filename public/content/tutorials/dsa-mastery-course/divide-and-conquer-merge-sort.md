# Merge Sort: Divide-and-Conquer Paradigm & Stability Analysis

**Merge Sort** is an optimal, comparison-based sorting algorithm based on the **Divide-and-Conquer** design paradigm. It provides a guaranteed worst-case, average-case, and best-case time complexity of **$O(n \log n)$** while maintaining **strict stability**.

---

## 1. Real-World Analogy: Sorting Two Piles of Graded Exam Papers

Imagine two teaching assistants have each sorted a stack of 50 student exam papers alphabetically:
- Stack A: 50 sorted papers (`Aarav, Ananya, David ...`)
- Stack B: 50 sorted papers (`Ben, Chris, Emily ...`)
- To merge them into a single 100-paper sorted stack, you don't start from scratch!
- You look at the top sheet of Stack A and top sheet of Stack B: compare `Aarav` with `Ben`. `Aarav` comes first $\to$ place in final pile.
- Repeat. In a single pass of 100 quick comparisons, the entire stack is perfectly merged!

---

## 2. The Divide-and-Conquer Triad

1. **Divide:** Split the array at midpoint $\text{mid} = \frac{\text{low} + \text{high}}{2}$ into two equal halves until subarrays contain $\le 1$ element (the base case).
2. **Conquer:** Recursively sort both the left half and right half.
3. **Combine (Merge):** Merge the two sorted subarrays back together into a single sorted array.

```text
Recursion Tree for Merge Sort on [38, 27, 43, 3, 9, 82, 10]:
Level 0:                 [38, 27, 43, 3, 9, 82, 10]
Level 1:           [38, 27, 43]              [3, 9, 82, 10]
Level 2:        [38]     [27, 43]          [3, 9]      [82, 10]
Level 3:      [38]     [27]   [43]       [3]   [9]    [82]   [10]
------------------------ MERGING PHASE ------------------------
Level 2:        [38]       [27, 43]         [3, 9]       [10, 82]
Level 1:           [27, 38, 43]              [3, 9, 10, 82]
Level 0:                 [3, 9, 10, 27, 38, 43, 82]  (SORTED!)
```

---

## 3. The Recurrence Relation & Master Theorem Proof

$$\text{Time Complexity: } T(n) = 2 T\left(\frac{n}{2}\right) + O(n)$$
- The tree has $\log_2(n)$ levels.
- At each level, merging all elements takes total $O(n)$ work.
- Total Time: $\log_2(n) \times O(n) = \mathbf{O(n \log n)}$.

---

## 4. Multi-Language Implementations: Merge Sort

### Python 3 Implementation:
```python
def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    # 1. Divide & Conquer
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # 2. Combine (Merge)
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    merged = []
    i = j = 0
    
    # Two-pointer zip merge
    while i < len(left) and j < len(right):
        if left[i] <= right[j]: # <= preserves STABILITY!
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
```

### Modern JavaScript / TypeScript (In-Place Indices):
```typescript
export function mergeSort(arr: number[], low: number = 0, high: number = arr.length - 1): void {
  if (low >= high) return;

  const mid = low + Math.floor((high - low) / 2);
  mergeSort(arr, low, mid);
  mergeSort(arr, mid + 1, high);
  merge(arr, low, mid, high);
}

function merge(arr: number[], low: number, mid: number, high: number): void {
  const temp: number[] = [];
  let i = low;
  let j = mid + 1;

  while (i <= mid && j <= high) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }

  while (i <= mid) temp.push(arr[i++]);
  while (j <= high) temp.push(arr[j++]);

  for (let k = 0; k < temp.length; k++) {
    arr[low + k] = temp[k];
  }
}
```

---

## 5. Trace Table: Merging Left `[27, 38]` and Right `[9, 43]`

| Step | `left[i]` | `right[j]` | Comparison (`left[i] <= right[j]`) | Appended to `merged` | Remaining |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 27 | 9 | $27 \le 9$ (False) | `[9]` | `j` advances to 1 |
| **2** | 27 | 43 | $27 \le 43$ (True) | `[9, 27]` | `i` advances to 1 |
| **3** | 38 | 43 | $38 \le 43$ (True) | `[9, 27, 38]` | `i` exhausted |
| **4** | - | 43 | Remaining right elements | `[9, 27, 38, 43]` | Complete! |

---

# Multiple Choice Questions

### 1. What is the guaranteed worst-case time complexity of Merge Sort?
A. $O(n^2)$
B. $O(n \log n)$
C. $O(n)$
D. $O(\log n)$
**Answer:** B
**Explanation:** Merge Sort always divides arrays strictly in half, maintaining $O(n \log n)$ performance regardless of whether the input is random, sorted, or reversed.
---

### 2. How much auxiliary memory does standard Merge Sort on an array of size $n$ consume during the merge phase?
A. $O(1)$
B. $O(n)$
C. $O(n^2)$
D. $O(\log n)$
**Answer:** B
**Explanation:** Merging two sorted array halves requires an auxiliary temporary buffer of size $n$ to hold merged elements before copying them back.
---

### 3. Why is Merge Sort the preferred sorting algorithm for Singly Linked Lists over Quick Sort?
A. Linked lists cannot be partitioned.
B. Merging two linked lists can be done in $O(1)$ auxiliary memory by manipulating node pointers directly without allocating extra arrays.
C. Quick sort crashes on linked lists.
D. Merge sort only works with strings.
**Answer:** B
**Explanation:** On linked lists, merge sort achieves $O(n \log n)$ time with $O(1)$ auxiliary space because pointer re-linking avoids array copying.
---

### 4. Which comparison operator in the merge function guarantees that Merge Sort remains "Stable"?
A. `left[i] < right[j]`
B. `left[i] <= right[j]` (Less than or equal)
C. `left[i] > right[j]`
D. `left[i] != right[j]`
**Answer:** B
**Explanation:** Using `<=` prioritizes elements from the left subarray over identical elements from the right subarray, preserving original order.
---

### 5. How many total recursive levels are present in the Merge Sort recursion tree for an input of size $n$?
A. $n$
B. $\lceil\log_2 n\rceil$
C. $n^2$
D. $2^n$
**Answer:** B
**Explanation:** Dividing the array by 2 at each level yields a recursion tree of height $\log_2(n)$.
---

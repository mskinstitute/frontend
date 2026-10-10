# Quick Sort: Lomuto vs Hoare Partitioning & Pivot Strategies

**Quick Sort** is an in-place divide-and-conquer sorting algorithm. In practical benchmarks, Quick Sort is typically **2x to 3x faster than Merge Sort and Heap Sort** due to excellent CPU hardware cache locality and minimal memory movement.

---

## 1. Real-World Analogy: Sorting Students by Height Around a Reference

Imagine a gym teacher organizing 30 students by height:
- The teacher picks one student (say, *Alex*) to stand in the center as the **Pivot**.
- The teacher instructs: *"Anyone shorter than Alex, move to his left. Anyone taller than Alex, move to his right."*
- Notice: Alex is now standing at his **exact final sorted position** forever!
- The teacher repeats the exact same instruction recursively for the group on the left and the group on the right.

---

## 2. The Two Famous Partitioning Schemes

### 1. Lomuto Partition Scheme (Simpler to Understand)
- The Pivot is chosen as the last element `arr[high]`.
- A slow pointer `i` maintains the boundary of elements smaller than the pivot.
- A fast pointer `j` scans from `low` to `high - 1`.
- When `arr[j] <= pivot`, increment `i` and swap `arr[i]` with `arr[j]`.

### 2. Hoare Partition Scheme (Original & More Efficient)
- Two pointers start at the outer ends (`low - 1` and `high + 1`) and advance inward toward each other.
- Makes approximately **three times fewer swaps on average** than Lomuto!

---

## 3. The Pivot Selection Trap ($O(n^2)$ Worst-Case)

If you always choose the first or last element as the pivot:
- If the input array is **already sorted** or **reverse sorted**, the pivot produces a degenerate partition of size $0$ and $n - 1$.
- The recursion tree degenerates from a balanced tree ($\log n$) into a linked list ($n$), resulting in worst-case **$O(n^2)$ quadratic time**!

### The Remedy: Randomized Pivot or Median-of-Three
Pick three candidates (first, middle, last), find their mathematical median, and swap it to the pivot position. This guarantees balanced $O(n \log n)$ partitions in production!

---

## 4. Multi-Language Implementations: Quick Sort (Lomuto Partition)

### Python 3:
```python
import random

def quick_sort(arr: list[int], low: int = 0, high: int = None) -> None:
    if high is None:
        high = len(arr) - 1
        
    if low < high:
        # Partition the array and get pivot index
        pivot_index = randomized_partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)

def randomized_partition(arr: list[int], low: int, high: int) -> int:
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx] # Swap random to end
    return lomuto_partition(arr, low, high)

def lomuto_partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1 # Boundary of elements <= pivot
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            
    # Place pivot in its correct final position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

### Modern JavaScript / TypeScript:
```typescript
export function quickSort(arr: number[], low: number = 0, high: number = arr.length - 1): void {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

---

## 5. Trace Table: Partitioning `[10, 80, 30, 90, 40, 50, 70]` (Pivot = 70)

| `j` | `arr[j]` | `arr[j] <= 70`? | `i` | Swap Action | Array State |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **Init** | - | - | -1 | None | `[10, 80, 30, 90, 40, 50, 70]` |
| **0** | 10 | Yes | 0 | Swap `arr[0]` with `arr[0]` | `[10, 80, 30, 90, 40, 50, 70]` |
| **1** | 80 | No | 0 | None | `[10, 80, 30, 90, 40, 50, 70]` |
| **2** | 30 | Yes | 1 | Swap `arr[1]` (80) with `arr[2]` (30) | `[10, 30, 80, 90, 40, 50, 70]` |
| **3** | 90 | No | 1 | None | `[10, 30, 80, 90, 40, 50, 70]` |
| **4** | 40 | Yes | 2 | Swap `arr[2]` (80) with `arr[4]` (40) | `[10, 30, 40, 90, 80, 50, 70]` |
| **5** | 50 | Yes | 3 | Swap `arr[3]` (90) with `arr[5]` (50) | `[10, 30, 40, 50, 80, 90, 70]` |
| **Final** | - | - | - | Swap `arr[4]` (80) with pivot `70` | `[10, 30, 40, 50, 70, 90, 80]` |

Pivot `70` is placed at index 4! All items to its left are $< 70$, all to its right are $> 70$.

---

# Multiple Choice Questions

### 1. What is the average-case time complexity of Quick Sort?
A. $O(n)$
B. $O(n \log n)$
C. $O(n^2)$
D. $O(\log n)$
**Answer:** B
**Explanation:** On average, choosing balanced pivots divides the array roughly in half at each recursion level, yielding $O(n \log n)$ runtime.
---

### 2. Under what input condition does naive Quick Sort (picking the first or last element as pivot) degrade to worst-case $O(n^2)$ time?
A. When all elements are random.
B. When the input array is already sorted or reverse-sorted.
C. When the array contains negative numbers.
D. When the array size is a prime number.
**Answer:** B
**Explanation:** For already sorted arrays, choosing the extreme end as pivot yields empty partitions on one side, resulting in an $n$-level degenerate recursion chain ($O(n^2)$).
---

### 3. How does "Randomized Quick Sort" mitigate the worst-case $O(n^2)$ scenario?
A. By sorting the array randomly.
B. By randomly selecting the pivot element, making it statistically impossible for any fixed input ordering to consistently trigger unbalanced partitions.
C. By deleting the pivot.
D. By converting numbers to strings.
**Answer:** B
**Explanation:** Picking a random pivot eliminates vulnerability to adversarial inputs or sorted sequences, guaranteeing expected $O(n \log n)$ runtime.
---

### 4. Is standard in-place Quick Sort a "Stable" sorting algorithm?
A. Yes, always.
B. No; partitioning performs non-adjacent long-distance swaps that can alter the relative order of duplicate elements.
C. Only in Python.
D. Only when using Hoare partition.
**Answer:** B
**Explanation:** Swapping elements across the pivot boundary can swap an identical key past another, making standard in-place Quick Sort unstable.
---

### 5. Why is Quick Sort faster in practical machine benchmarks than Merge Sort, even though both share $O(n \log n)$ average complexity?
A. Merge sort is written in Python.
B. Quick Sort operates strictly in-place with outstanding CPU cache locality and zero auxiliary array allocation overhead.
C. Quick sort skips elements.
D. Quick sort uses floating-point hardware.
**Answer:** B
**Explanation:** In-place partitioning avoids allocating auxiliary arrays, minimizing cache misses and memory bus traffic.
---

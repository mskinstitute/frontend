# Elementary Sorting Algorithms: Bubble, Selection & Insertion Sort (O(n²))

Sorting rearranges elements in a sequence into monotonic ascending or descending order. While advanced algorithms (Merge Sort, Quick Sort) dominate big data, understanding the elementary trio—**Bubble Sort**, **Selection Sort**, and **Insertion Sort**—is critical for mastering algorithmic trade-offs, stability, and small-data optimizations.

---

## 1. Real-World Analogies

- **Bubble Sort (Fizzy Soda):** Heavy elements sink to the bottom while lighter elements bubble up to the surface one-by-one through adjacent pairwise swaps.
- **Selection Sort (Picking the MVP):** You scan the entire crowd, select the absolute shortest person, and place them at index 0. Then scan the remainder, find the next shortest, and place them at index 1.
- **Insertion Sort (Arranging Playing Cards):** You hold cards in your hand. As you pick up each new card from the deck, you slide it into its correct sorted position among the cards already in your hand.

---

## 2. The Big-O Comparison Table

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? | Adaptive? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | $O(n)$ (with flag) | $O(n^2)$ | $O(n^2)$ | **$O(1)$** | **Yes** | Yes |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | **$O(1)$** | **No** | No |
| **Insertion Sort** | **$O(n)$** | $O(n^2)$ | $O(n^2)$ | **$O(1)$** | **Yes** | **Yes** |

*Note: An algorithm is **Stable** if equal elements preserve their original relative order after sorting.*

---

## 3. Algorithm 1: Optimized Bubble Sort ($O(n)$ Best Case)

```python
def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        swapped = False
        # Last i elements are already in sorted place!
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # If no swaps occurred, array is already sorted!
        if not swapped:
            break
    return arr
```

---

## 4. Algorithm 2: Selection Sort (Minimizing Memory Writes)

Selection Sort performs at most $n$ total swaps, making it useful when writing to flash memory where write operations are costly:

```python
def selection_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap found minimum with first unsorted element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
```

---

## 5. Algorithm 3: Insertion Sort (King of Nearly-Sorted Data)

Insertion Sort is blazing fast for small arrays ($n \le 30$) or nearly-sorted data. Production algorithms like **Timsort** (used in Python `sorted()` and Java `Arrays.sort()`) use Insertion Sort as their base-case engine!

### Modern JavaScript / TypeScript Implementation:
```typescript
export function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    // Shift elements of arr[0...i-1] that are greater than key to the right
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
```

---

## 6. Trace Table: Insertion Sort on `[5, 2, 4, 6, 1]`

| Pass ($i$) | Key | Subarray before insertion | Comparisons & Shifts | Subarray after pass |
|:---:|:---:|:---:|:---:|:---:|
| **1** | 2 | `[5]` | 5 > 2 $\to$ shift 5 right | `[2, 5, 4, 6, 1]` |
| **2** | 4 | `[2, 5]` | 5 > 4 $\to$ shift 5 right | `[2, 4, 5, 6, 1]` |
| **3** | 6 | `[2, 4, 5]` | 5 < 6 $\to$ 0 shifts | `[2, 4, 5, 6, 1]` |
| **4** | 1 | `[2, 4, 5, 6]` | Shift 6, 5, 4, 2 right | `[1, 2, 4, 5, 6]` |

---

# Multiple Choice Questions

### 1. Why does Insertion Sort run in $O(n)$ linear time on an already-sorted array?
A. It divides the array in half.
B. The inner `while` loop condition (`arr[j] > key`) evaluates to false on the very first comparison for every element, performing only $n - 1$ total checks.
C. It utilizes CPU GPU parallel threads.
D. It skips all loops.
**Answer:** B
**Explanation:** For sorted inputs, each element is compared once with its predecessor and immediately kept in place, achieving linear $O(n)$ time.
---

### 2. What does it mean for a sorting algorithm to be "Stable"?
A. It never crashes the computer.
B. Two items with equal keys appear in the sorted output in the exact same relative order as they appeared in the original input array.
C. It uses zero bytes of RAM.
D. The algorithm only sorts positive integers.
**Answer:** B
**Explanation:** Stability preserves the initial relative ordering of identical keys, which is critical when sorting records by multiple successive criteria (e.g. sort by Name, then by Age).
---

### 3. Which sorting algorithm performs the minimum number of write operations (at most $n$ swaps in total)?
A. Bubble Sort
B. Selection Sort
C. Insertion Sort
D. Quick Sort
**Answer:** B
**Explanation:** Selection Sort makes at most 1 swap per outer loop iteration ($n$ total swaps), ideal for memory hardware with expensive write cycles (EEPROM/Flash).
---

### 4. Why is Selection Sort considered an "Unstable" sorting algorithm?
A. It uses random numbers.
B. Long-distance swaps can propel an element past an identical element earlier in the array, altering their relative order.
C. It crashes on negative numbers.
D. It runs in exponential time.
**Answer:** B
**Explanation:** Swapping the minimum element with the current position can jump over duplicate keys, disrupting their original relative order.
---

### 5. Why do modern production hybrid sorting engines like Timsort switch to Insertion Sort for small subarrays ($n \le 32$)?
A. Merge sort is banned by the IEEE.
B. Insertion sort has minimal overhead, zero recursion stack cost, excellent CPU cache locality, and runs in linear time on partially sorted data.
C. Bubble sort is too fast.
D. Insertion sort converts data to binary.
**Answer:** B
**Explanation:** For small arrays, the low overhead, cache-friendly sequential access, and adaptive behavior of Insertion Sort outperform the logarithmic division overhead of divide-and-conquer algorithms.
---

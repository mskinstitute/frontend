# Heaps & Priority Queues: Min-Heap, Max-Heap, Heapify & Top-K Elements

A **Binary Heap** is a specialized complete binary tree that satisfies the **Heap Property**. In a **Min-Heap**, the key at the root is the absolute minimum among all keys in the tree; in a **Max-Heap**, the root is the absolute maximum. Heaps power **Priority Queues**, **Heap Sort ($O(n \log n)$)**, and **Dijkstra’s Shortest Path Algorithm**.

---

## 1. Real-World Analogy: The Hospital Emergency Room (Triage)

Imagine an Emergency Room triage system:
- Patients do not enter on a First-In-First-Out basis like a grocery store line.
- A patient arriving with severe cardiac arrest (**Highest Priority**) is treated immediately, ahead of someone who arrived 2 hours earlier with a minor finger sprain.
- A **Priority Queue** ensures that the item with the highest (or lowest) priority is always served in **$O(1)$ constant time**!

---

## 2. Array Representation of a Binary Heap

Because a binary heap is a **Complete Binary Tree** (every level is completely filled except possibly the last, which is filled from left to right), it can be stored directly inside a **contiguous flat array with ZERO pointer overhead**:

```text
Given index i (0-indexed):
- Parent Node:      Math.floor((i - 1) / 2)
- Left Child Node:  2 * i + 1
- Right Child Node: 2 * i + 2
```

---

## 3. Core Heap Operations

| Operation | Action | Time Complexity |
| :--- | :--- | :---: |
| **`peek()`** | Inspects the min/max element at the root (`arr[0]`) | **$O(1)$** |
| **`insert(val)`** | Adds to the end of array and bubbles up (**Sift-Up**) | **$O(\log n)$** |
| **`extractMin()` / `pop()`** | Swaps root with last item, pops end, and sinks down (**Sift-Down**) | **$O(\log n)$** |
| **`heapify(arr)`** | Converts an unordered array into a valid heap in-place | **$O(n)$ Linear Time!** |

---

## 4. Multi-Language Implementations: Top-K Frequent Elements

Find the $K$ most frequent elements in an array using a Min-Heap of size $K$ in $O(n \log k)$ time:

### Python 3:
```python
import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    # 1. Count frequencies in O(n) time
    count = Counter(nums)
    
    # 2. Maintain a Min-Heap of size k (stores (frequency, num))
    # Python's heapq is a Min-Heap by default!
    min_heap = []
    for num, freq in count.items():
        heapq.heappush(min_heap, (freq, num))
        if len(min_heap) > k:
            heapq.heappop(min_heap) # Eject lowest frequency element!
            
    return [num for freq, num in min_heap]
```

### Modern JavaScript / TypeScript (Custom Min-Heap):
```typescript
export class MinHeap {
  private heap: number[] = [];

  public push(val: number): void {
    this.heap.push(val);
    this.siftUp(this.heap.length - 1);
  }

  public pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return min;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] < this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }

  private siftDown(i: number): void {
    const n = this.heap.length;
    while (2 * i + 1 < n) {
      let smallest = 2 * i + 1; // Left child
      const right = smallest + 1;
      if (right < n && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (this.heap[i] > this.heap[smallest]) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      } else break;
    }
  }
}
```

---

## 5. Trace Table: Sifting Up `[10, 20, 15, 30]` after inserting `5`

- Initial Heap: `[10, 20, 15, 30]`
- Insert 5 at index 4: `[10, 20, 15, 30, 5]`

| Step | Index `i` | Value | Parent Index `p = (i-1)//2` | Parent Value | Comparison | Action |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 4 | 5 | 1 | 20 | $5 < 20$ | Swap `5` and `20` $\to$ `[10, 5, 15, 30, 20]` |
| **2** | 1 | 5 | 0 | 10 | $5 < 10$ | Swap `5` and `10` $\to$ `[5, 10, 15, 30, 20]` |
| **3** | 0 (Root) | 5 | - | - | At Root | Done! |

**Result:** `5` bubbled up to root in $\log_2 n$ steps!

---

# Multiple Choice Questions

### 1. What is the time complexity to retrieve the minimum element from a Min-Heap without removing it (`peek()`)?
A. $O(n)$
B. $O(\log n)$
C. $O(1)$
D. $O(n \log n)$
**Answer:** C
**Explanation:** In a Min-Heap, the smallest element is permanently positioned at array index 0 (the root), accessible in $O(1)$ constant time.
---

### 2. For an element at index $i$ in a 0-indexed binary heap array, what formula locates its left child?
A. $2i$
B. $2i + 1$
C. $2i + 2$
D. $\frac{i - 1}{2}$
**Answer:** B
**Explanation:** In zero-indexed binary heap storage, the left child is located at $2i + 1$ and the right child at $2i + 2$.
---

### 3. What is the time complexity of the mathematical `heapify` operation that transforms an arbitrary array of $n$ elements into a valid heap?
A. $O(n^2)$
B. $O(n \log n)$
C. $O(n)$
D. $O(\log n)$
**Answer:** C
**Explanation:** Bottom-up heap construction sums the series $\sum \frac{h}{2^h}$, which converges to a linear $O(n)$ runtime rather than $O(n \log n)$.
---

### 4. When finding the "K-th Largest Element" in an array of $n$ items, what type of heap should you maintain with capacity $K$?
A. A Max-Heap of size $n$
B. A Min-Heap of size $K$
C. A Binary Search Tree
D. A Circular Queue
**Answer:** B
**Explanation:** A Min-Heap of size $K$ evicts the smallest element whenever its size exceeds $K$, leaving the $K$ largest elements with the $K$-th largest at the top (`O(n log k)`).
---

### 5. What tree structure property guarantees that a Binary Heap can be mapped to a flat array without memory gaps?
A. Complete Binary Tree property: all levels are fully packed from left to right.
B. Binary Search Tree property.
C. Perfect Binary Tree property.
D. Degenerate Linked List property.
**Answer:** A
**Explanation:** Because complete binary trees have no missing intermediate nodes, array indices $0, 1, 2 \dots n - 1$ correspond directly to tree positions with zero gaps.
---

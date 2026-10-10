# Queues: FIFO Mechanics, Circular Buffers & Double-Ended Queues (Deque)

A **Queue** is a linear data structure governed by the **FIFO (First In, First Out)** principle: the first element added to the queue is the first one removed. Queues are indispensable for asynchronous task dispatching, printer spoolers, network packet routing, and **Breadth-First Search (BFS)** graph traversals.

---

## 1. Real-World Analogy: The Coffee Shop Counter

Think of ordering coffee at a drive-through or counter:
- The first customer to arrive in line is the first one served and leaves with their drink (**FIFO**).
- New customers join at the back (**Rear / Enqueue**).
- Customers leave from the front (**Front / Dequeue**).
- Cutting in line is forbidden!

---

## 2. Queue Operations & Mechanics

| Operation | Action | Time Complexity |
| :--- | :--- | :---: |
| **`enqueue(val)`** | Appends an element to the rear of the queue | **$O(1)$** |
| **`dequeue()`** | Removes and returns the front element | **$O(1)$** |
| **`peek()` / `front()`** | Inspects the front element without removing it | **$O(1)$** |
| **`isEmpty()`** | Checks if the queue is empty | **$O(1)$** |

---

## 3. Why Array `.shift()` is an Anti-Pattern in JavaScript/Python

In languages like JavaScript, calling `arr.shift()` to dequeue an element removes the first element and **shifts every remaining element in memory 1 index to the left**:
```javascript
// BAD ANTI-PATTERN: Takes O(n) per dequeue!
const queue = [];
queue.push(10);     // Enqueue: O(1)
queue.shift();      // Dequeue: O(n) due to memory shifting!
```
For 100,000 operations, using `shift()` takes seconds and triggers Time Limit Exceeded (TLE) in interviews.

### The Solutions:
1. **Circular Array (Ring Buffer):** Uses modulo arithmetic `(tail + 1) % capacity` to wrap around without shifting.
2. **Double-Ended Queue (Deque):** Implemented via doubly linked nodes (Python `collections.deque`).

---

## 4. Multi-Language Implementations: Circular Queue

### Python 3 Implementation:
```python
class MyCircularQueue:
    def __init__(self, k: int):
        self.capacity = k
        self.queue = [0] * k
        self.head = 0
        self.tail = 0
        self.size = 0

    def en_queue(self, value: int) -> bool:
        if self.is_full():
            return False
        self.queue[self.tail] = value
        # Modulo arithmetic wraps tail back to 0 when reaching capacity!
        self.tail = (self.tail + 1) % self.capacity
        self.size += 1
        return True

    def de_queue(self) -> bool:
        if self.is_empty():
            return False
        # Advance head pointer with modulo
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.is_empty() else self.queue[self.head]

    def Rear(self) -> int:
        if self.is_empty():
            return -1
        # Tail points to NEXT write position, so last item is at (tail - 1)
        return self.queue[(self.tail - 1 + self.capacity) % self.capacity]

    def is_empty(self) -> bool:
        return self.size == 0

    def is_full(self) -> bool:
        return self.size == self.capacity
```

### Modern JavaScript / TypeScript (High-Performance Deque via Doubly Linked Nodes):
```typescript
class DequeNode<T> {
  val: T;
  prev: DequeNode<T> | null = null;
  next: DequeNode<T> | null = null;
  constructor(val: T) {
    this.val = val;
  }
}

export class Deque<T> {
  private head: DequeNode<T> | null = null;
  private tail: DequeNode<T> | null = null;
  public size: number = 0;

  public pushBack(val: T): void {
    const node = new DequeNode(val);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }

  public popFront(): T | null {
    if (!this.head) return null;
    const val = this.head.val;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.size--;
    return val;
  }
}
```

---

## 5. Trace Table: Circular Queue of Capacity 3

| Operation | Action | Array State | `head` | `tail` | `size` | Return |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `enQueue(10)` | Writes at 0 | `[10, _, _]` | 0 | 1 | 1 | `True` |
| `enQueue(20)` | Writes at 1 | `[10, 20, _]` | 0 | 2 | 2 | `True` |
| `enQueue(30)` | Writes at 2 | `[10, 20, 30]` | 0 | 0 (wrapped!) | 3 (Full) | `True` |
| `enQueue(40)` | Attempt write | `[10, 20, 30]` | 0 | 0 | 3 | `False` (Full) |
| `deQueue()` | Removes 10 | `[_, 20, 30]` | 1 | 0 | 2 | `True` |
| `enQueue(40)` | Writes at 0 | `[40, 20, 30]` | 1 | 1 | 3 | `True` (Reused 0!) |

Notice how index 0 was recycled seamlessly with zero element copies!

---

# Multiple Choice Questions

### 1. Which data processing order governs the behavior of a standard Queue?
A. LIFO (Last In, First Out)
B. FIFO (First In, First Out)
C. LILO (Last In, Last Out)
D. Random Priority
**Answer:** B
**Explanation:** Queues enforce FIFO (First In, First Out): the first item enqueued is the first item dequeued.
---

### 2. Why is using standard JavaScript `array.shift()` to implement a queue in performance-critical code an anti-pattern?
A. `shift()` only works on strings.
B. `shift()` runs in $O(n)$ time because it must shift all remaining elements in memory to the left by one position.
C. `shift()` deletes the entire array.
D. `shift()` causes stack overflow.
**Answer:** B
**Explanation:** Removing from the front of a flat array requires re-indexing all $n$ subsequent elements, degrading dequeue from $O(1)$ to $O(n)$.
---

### 3. What mathematical operator allows a Circular Queue to wrap its pointer from the end of the array back to index 0?
A. Exponentiation (`**`)
B. Modulo Operator (`%`)
C. Bitwise XOR (`^`)
D. Floor Division (`//`)
**Answer:** B
**Explanation:** `(index + 1) % capacity` wraps the pointer back to index 0 as soon as `index + 1` reaches `capacity`.
---

### 4. What is a "Double-Ended Queue" (Deque)?
A. A queue that only works on 64-bit CPUs.
B. A flexible queue that permits constant $O(1)$ insertion and deletion from BOTH the front and the rear.
C. A queue that holds double-precision floats.
D. Two queues placed in parallel.
**Answer:** B
**Explanation:** A Deque (pronounced "deck") supports push and pop operations at both the front and back ends with $O(1)$ efficiency.
---

### 5. In which major graph algorithm is a FIFO Queue strictly required to explore nodes level-by-level?
A. Depth-First Search (DFS)
B. Breadth-First Search (BFS)
C. Binary Search
D. Quick Sort
**Answer:** B
**Explanation:** Breadth-First Search (BFS) relies on a FIFO queue to explore nodes in order of their distance from the source root.
---

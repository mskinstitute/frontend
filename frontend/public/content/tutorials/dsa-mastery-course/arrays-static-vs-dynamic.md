# Static vs Dynamic Arrays, Amortized O(1) Operations & Memory Locality

The **Array** is the most ubiquitous data structure in computer science. Arrays store elements in **contiguous (sequential) memory locations**, providing lightning-fast $O(1)$ constant-time random access via direct memory offset arithmetic.

---

## 1. Real-World Analogy: Hotel Rooms on a Floor

Imagine a luxury hotel with numbered rooms `100, 101, 102, 103...` arranged sequentially along a straight corridor:
- If you know Room `100` starts at memory address `0x1000` and each room is 4 meters wide, you can calculate the exact location of Room `105` instantly:
  $$\text{Address} = \text{Base Address} + (\text{Index} \times \text{Size}) = 0x1000 + (5 \times 4) = 0x1014$$
- You do not need to walk past rooms 101, 102, 103, and 104 to know where 105 is. This hardware math gives arrays **$O(1)$ instant random access**!

---

## 2. Static Arrays vs Dynamic (Resizing) Arrays

- **Static Arrays (e.g. C++, Java primitive arrays):** Fixed capacity defined at declaration. Cannot grow or shrink once allocated in memory.
- **Dynamic Arrays (e.g. Python `list`, JavaScript `Array`, C++ `std::vector`, Java `ArrayList`):** Automatically resize when capacity is reached.

### How Dynamic Arrays Resize (The Doubling Strategy):
When you append to an array whose internal capacity is full:
1. Allocate a brand new array in memory with **double the capacity** ($2 \times \text{old size}$).
2. Copy all $n$ existing elements into the new memory space.
3. Deallocate the old array.
4. Append the new element.

```text
Capacity: 4 [10, 20, 30, 40] (FULL)
Append 50 triggers RESIZE:
1. Allocate new memory of capacity 8
2. Copy [10, 20, 30, 40]
3. Append [50] -> Capacity: 8 [10, 20, 30, 40, 50, _, _, _]
```

---

## 3. What is Amortized $O(1)$ Complexity?

While resizing copies $n$ elements and takes $O(n)$ time, resizing happens very infrequently (at powers of 2: $1, 2, 4, 8, 16, 32 \dots$). 

If you append $n$ elements:
$$\text{Total Copies} = 1 + 2 + 4 + 8 + \dots + n < 2n$$
Averaging $2n$ copying steps across $n$ operations yields:
$$\frac{2n}{n} = 2 \text{ operations per append on average} \implies \mathbf{O(1)\text{ Amortized Time!}}$$

---

## 4. Hardware Cache Locality (Why Arrays Beat Linked Lists)

Modern CPUs fetch data from RAM in **64-byte Cache Lines** rather than single bytes. Because array elements sit contiguously side-by-side in RAM, loading `arr[0]` into CPU L1 cache automatically loads `arr[1]`, `arr[2]`, and `arr[3]` simultaneously. This phenomenon is called **Spatial Locality**, making arrays up to **10x faster** in practice than pointer-based data structures like Linked Lists.

---

## 5. Dual Code Implementation: Custom Resizing Dynamic Array

### Python 3:
```python
import ctypes

class DynamicArray:
    def __init__(self):
        self._size = 0
        self._capacity = 1
        self._array = self._make_array(self._capacity)

    def __len__(self) -> int:
        return self._size

    def __getitem__(self, index: int):
        if not 0 <= index < self._size:
            raise IndexError("Index out of bounds")
        return self._array[index]

    def append(self, element) -> None:
        if self._size == self._capacity:
            self._resize(2 * self._capacity)
        self._array[self._size] = element
        self._size += 1

    def _resize(self, new_capacity: int) -> None:
        new_array = self._make_array(new_capacity)
        for i in range(self._size):
            new_array[i] = self._array[i]
        self._array = new_array
        self._capacity = new_capacity

    def _make_array(self, capacity: int):
        return (capacity * ctypes.py_object)()
```

### Modern JavaScript / TypeScript:
```typescript
export class CustomDynamicArray<T> {
  private data: (T | undefined)[];
  private size: number = 0;
  private capacity: number;

  constructor(initialCapacity: number = 2) {
    this.capacity = initialCapacity;
    this.data = new Array(this.capacity);
  }

  public length(): number {
    return this.size;
  }

  public get(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new RangeError('Index out of bounds');
    }
    return this.data[index] as T;
  }

  public push(element: T): void {
    if (this.size === this.capacity) {
      this.resize(this.capacity * 2);
    }
    this.data[this.size] = element;
    this.size++;
  }

  private resize(newCapacity: number): void {
    const nextData = new Array(newCapacity);
    for (let i = 0; i < this.size; i++) {
      nextData[i] = this.data[i];
    }
    this.data = nextData;
    this.capacity = newCapacity;
  }
}
```

---

## 6. Big-O Complexity Comparison

| Operation | Array Complexity | Reason |
| :--- | :---: | :--- |
| **Lookup by Index (`arr[i]`)** | **$O(1)$** | Direct memory offset calculation |
| **Append to End** | **$O(1)$ Amortized** | Occasional resize amortized over $n$ appends |
| **Insert at Beginning (`unshift`)** | **$O(n)$** | Every existing element must shift 1 index to the right |
| **Delete from Beginning (`shift`)** | **$O(n)$** | Every existing element must shift 1 index to the left |
| **Search by Value (unsorted)** | **$O(n)$** | Linear scan across all elements |

---

# Multiple Choice Questions

### 1. Why does accessing an element in an array by its index take constant $O(1)$ time?
A. Because the CPU searches for the value using binary search.
B. Because array elements occupy contiguous memory, allowing the memory address to be computed instantly using $\text{Base} + (\text{Index} \times \text{Size})$.
C. Arrays store values on the GPU.
D. Arrays are sorted automatically.
**Answer:** B
**Explanation:** Contiguous memory layout allows direct memory addressing arithmetic in a single CPU cycle regardless of array size.
---

### 2. What is the time complexity of inserting or deleting an element at index 0 of an array containing $n$ elements?
A. $O(1)$
B. $O(\log n)$
C. $O(n)$
D. $O(n \log n)$
**Answer:** C
**Explanation:** Inserting or removing at the beginning requires shifting all $n$ subsequent elements in memory by one position.
---

### 3. What does "Amortized $O(1)$" mean in the context of appending to a dynamic array?
A. The operation takes $O(1)$ on Mondays only.
B. While occasional resize operations require $O(n)$ time to copy elements, resizing happens infrequently enough that the average time per append remains $O(1)$.
C. The array never uses more than 1 MB of memory.
D. Appending is impossible once full.
**Answer:** B
**Explanation:** Doubling the array capacity spreads the cost of rare $O(n)$ allocations across many cheap $O(1)$ insertions, yielding an amortized constant cost.
---

### 4. What computer hardware advantage makes sequential iteration over an array significantly faster than traversing a linked list?
A. Spatial Cache Locality: contiguous memory blocks are prefetched into the CPU's high-speed L1/L2 cache lines simultaneously.
B. Arrays use 64-bit encryption.
C. Arrays disable operating system interrupts.
D. Linked lists run in software, while arrays run on the motherboard battery.
**Answer:** A
**Explanation:** CPUs prefetch adjacent memory into hardware caches; array elements benefit from cache hits, whereas linked list nodes are scattered across RAM.
---

### 5. What happens if a program attempts to read `arr[10]` on an array allocated with size 5 in languages like C or C++?
A. The computer prints "Hello World".
B. Buffer Overflow / Undefined Behavior, potentially reading corrupt memory or triggering a Segmentation Fault.
C. The array expands automatically to size 11.
D. The compiler converts it to a string.
**Answer:** B
**Explanation:** In unmanaged languages like C/C++, accessing beyond array boundaries accesses unallocated memory addresses, causing security exploits or segmentation faults.
---

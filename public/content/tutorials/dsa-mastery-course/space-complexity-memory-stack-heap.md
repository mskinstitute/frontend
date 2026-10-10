# Space Complexity, Auxiliary Memory & Stack vs Heap Allocation

Writing lightning-fast algorithms is futile if your program exhausts physical RAM and triggers an Out-Of-Memory (OOM) crash. **Space Complexity** measures the total memory space an algorithm consumes as the input size $n$ grows.

---

## 1. Real-World Analogy: The Workshop Workbench

Think of computer memory as a woodworker's workshop:
- **Stack Memory (Small, Fast Toolbelt):** Holds small, immediate tools (primitives, integers, loop counters, active function return addresses). It is fast, automatically managed, but strictly limited in size. If you overload your toolbelt, it spills over (**Stack Overflow**).
- **Heap Memory (Large Warehouse Storage):** Holds large pieces of lumber and custom furniture (dynamic arrays, hash tables, trees, objects). It has massive capacity, but allocating and cleaning up storage takes conscious management.

---

## 2. Total Space Complexity vs Auxiliary Space

In technical interviews, interviewers frequently distinguish between two metrics:
1. **Auxiliary Space:** The **extra or temporary space** allocated by the algorithm to solve the problem, excluding the memory of the original input itself.
2. **Total Space Complexity:** $\text{Input Space} + \text{Auxiliary Space}$.

```python
# Function to reverse an array in-place
def reverse_in_place(arr: list[int]) -> None:
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
```
- Input Array size: $O(n)$
- Auxiliary Space allocated: $O(1)$ (Only two integer pointer variables: `left`, `right`).

---

## 3. The Hidden Cost of Recursion: Call Stack Frames

Every time a function invokes another function (or invokes itself recursively), the operating system allocates a **Stack Frame** in the Call Stack memory storing local variables and the return instruction address.

```text
Visualizing Call Stack Growth for recursive_countdown(3):
|  countdown(0)  |  <- Base case reached (Stack depth = 4)
|  countdown(1)  |
|  countdown(2)  |
|  countdown(3)  |
+----------------+
```
A recursive function with a maximum call depth of $n$ consumes **$O(n)$ Auxiliary Space**, even if it does not allocate any arrays!

---

## 4. Dual Implementations: Factorial ($O(n)$ Stack Space vs $O(1)$ Iterative Space)

### Python 3:
```python
# Recursive: O(n) Auxiliary Space due to Call Stack frames
def factorial_recursive(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)

# Iterative: O(1) Auxiliary Space (Optimal!)
def factorial_iterative(n: int) -> int:
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

### Modern JavaScript / TypeScript:
```typescript
// Recursive: O(n) Call Stack Memory
export function factorialRecursive(n: number): number {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// Iterative: O(1) Constant Space
export function factorialIterative(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

---

## 5. Memory Allocation Comparison Table

| Data Structure / Operation | Auxiliary Space | Explanation |
| :--- | :---: | :--- |
| Single scalar variable (`let count = 0`) | **$O(1)$** | Fixed primitive storage in stack frame |
| Two Pointers (`left`, `right`) | **$O(1)$** | Two memory addresses allocated |
| Array of size $n$ | **$O(n)$** | Contiguous heap allocation of $n$ memory words |
| 2D Matrix of size $n \times m$ | **$O(n \times m)$** | Table allocation |
| Recursive DFS on Tree of height $h$ | **$O(h)$** | Max stack frames active simultaneously |
| Hash Map with $n$ unique keys | **$O(n)$** | Buckets and entry nodes in heap memory |

---

# Multiple Choice Questions

### 1. What is the difference between "Auxiliary Space" and "Total Space Complexity"?
A. Auxiliary space is measured in bits; total space is measured in bytes.
B. Auxiliary space refers strictly to the temporary extra space allocated by the algorithm, excluding the space taken by the original input.
C. Auxiliary space only applies to SQL databases.
D. Total space complexity ignores arrays.
**Answer:** B
**Explanation:** Auxiliary space isolates the extra memory required by the algorithm logic, while total space includes both input storage and extra allocations.
---

### 2. What causes a "Stack Overflow" error during recursive execution?
A. The computer's hard drive runs out of free space.
B. The recursion lacks a valid base case or recurses too deeply, consuming all available Call Stack memory frames.
C. CSS files become too large.
D. A variable name is misspelled.
**Answer:** B
**Explanation:** Each recursive call pushes a new stack frame onto the Call Stack; missing base cases cause infinite frames, exhausting stack memory.
---

### 3. What is the Auxiliary Space complexity of an in-place array reversal algorithm using two pointers?
A. $O(n)$
B. $O(1)$
C. $O(\log n)$
D. $O(n^2)$
**Answer:** B
**Explanation:** An in-place reversal swaps elements directly inside the input array without allocating extra arrays, using only a constant number of pointer variables ($O(1)$).
---

### 4. Where are dynamically sized data structures (like resizing arrays, objects, and linked list nodes) typically allocated in computer architecture?
A. In the CPU L1 Cache only.
B. In Heap Memory.
C. In ROM.
D. On the network router.
**Answer:** B
**Explanation:** Dynamic, variably sized objects and collections are allocated on the Heap, while local function variables and execution frames live on the Stack.
---

### 5. An algorithm creates a 2D boolean grid `matrix[n][n]` to solve a dynamic programming problem. What is its auxiliary space complexity?
A. $O(n)$
B. $O(n^2)$
C. $O(2^n)$
D. $O(1)$
**Answer:** B
**Explanation:** An $n \times n$ table requires $n^2$ storage cells in memory, resulting in quadratic space complexity $O(n^2)$.
---

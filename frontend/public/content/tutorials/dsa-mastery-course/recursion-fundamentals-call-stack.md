# Recursion Fundamentals: Base Cases, Recursive Leaps & Call Stack Visuals

**Recursion** is a computational problem-solving technique where a function solves a problem by calling smaller instances of itself. It is the architectural engine behind **Divide and Conquer**, **Tree Traversals**, **Backtracking**, and **Graph Search**.

---

## 1. Real-World Analogy: Russian Matryoshka Nesting Dolls

Imagine opening a wooden Russian nesting doll:
- You open Doll 1, and inside sits a smaller Doll 2.
- You open Doll 2, and inside sits an even smaller Doll 3.
- You keep opening dolls until you reach the **tiniest solid wooden doll** that cannot be opened.
- This solid miniature doll is the **Base Case**! Once reached, you stop opening and begin closing the dolls back up one-by-one (**Stack Unwinding**).

---

## 2. The Two Essential Rules of Any Recursive Function

Every valid recursive algorithm must satisfy two mathematical laws:
1. **The Base Case (Termination):** A non-recursive condition that halts the recursion and returns an answer directly. *Without a base case, the function calls itself infinitely until the Call Stack memory is exhausted (Stack Overflow).*
2. **The Recursive Step (Progress toward Base Case):** The function calls itself with a strictly smaller or simplified subproblem ($n - 1$, $\frac{n}{2}$, or `node.left`), guaranteeing convergence toward the base case.

---

## 3. Visualizing the Call Stack: Reversing String `"cat"`

```text
1. Call: reverse("cat")
     -> calls reverse("at") + 'c'
2.   Call: reverse("at")
       -> calls reverse("t") + 'a'
3.     Call: reverse("t")
         -> Base Case reached! Returns "t"
------------------- STACK UNWINDING -------------------
2.   reverse("at") receives "t" -> returns "t" + "a" = "ta"
1. reverse("cat") receives "ta" -> returns "ta" + "c" = "tac"!
```

---

## 4. Multi-Language Implementations: String Reversal & Fibonacci

### Python 3:
```python
# String reversal via recursion
def reverse_string(s: str) -> str:
    # 1. Base Case: empty string or single character
    if len(s) <= 1:
        return s
    # 2. Recursive step: reverse substring from index 1 + first character at end
    return reverse_string(s[1:]) + s[0]

# Power function: x^n in O(log n) time using Divide and Conquer
def fast_power(x: float, n: int) -> float:
    if n == 0:
        return 1.0
    if n < 0:
        return 1.0 / fast_power(x, -n)
        
    half = fast_power(x, n // 2)
    if n % 2 == 0:
        return half * half
    else:
        return half * half * x
```

### Modern JavaScript / TypeScript:
```typescript
export function reverseString(s: string): string {
  if (s.length <= 1) {
    return s;
  }
  return reverseString(s.slice(1)) + s[0];
}

export function fastPower(x: number, n: number): number {
  if (n === 0) return 1;
  if (n < 0) return 1 / fastPower(x, -n);

  const half = fastPower(x, Math.floor(n / 2));
  if (n % 2 === 0) {
    return half * half;
  } else {
    return half * half * x;
  }
}
```

---

## 5. Trace Table: Fast Power `fastPower(2, 5)`

| Call Level | Input `(x, n)` | Condition | Subproblem | Returned Value |
|:---:|:---:|:---:|:---:|:---:|
| **1** | `(2, 5)` | Odd ($n \% 2 = 1$) | `half = fastPower(2, 2)` | $4 \times 4 \times 2 = \mathbf{32}$ |
| **2** | `(2, 2)` | Even ($n \% 2 = 0$) | `half = fastPower(2, 1)` | $2 \times 2 = \mathbf{4}$ |
| **3** | `(2, 1)` | Odd ($n \% 2 = 1$) | `half = fastPower(2, 0)` | $1 \times 1 \times 2 = \mathbf{2}$ |
| **4** | `(2, 0)` | Base Case ($n = 0$) | Return 1.0 | $\mathbf{1.0}$ |

**Result:** Calculated $2^5 = 32$ in only 4 function calls ($\log_2 n$) instead of 5 sequential multiplications!

---

# Multiple Choice Questions

### 1. What happens if a recursive function is missing a valid Base Case?
A. The code runs in $O(1)$ time.
B. The function repeatedly pushes execution frames onto the Call Stack until memory limits are breached, throwing a "Maximum Call Stack Size Exceeded" (Stack Overflow) error.
C. The function automatically switches to a loop.
D. The compiler ignores the function.
**Answer:** B
**Explanation:** Without a terminating base case, recursive calls continue indefinitely until the operating system's Call Stack memory is exhausted.
---

### 2. How much auxiliary space does a recursive function consume if its maximum recursive call depth is $D$?
A. $O(1)$
B. $O(D)$
C. $O(D^2)$
D. Zero space
**Answer:** B
**Explanation:** Each level of recursion allocates an active stack frame in memory, meaning depth $D$ directly consumes $O(D)$ stack space.
---

### 3. What is "Tail Call Optimization" (TCO)?
A. Compiling Python to C++.
B. A compiler feature where a recursive call in the final (tail) position of a function reuses the existing stack frame instead of allocating a new one, achieving $O(1)$ space.
C. Reversing a string with a tail pointer.
D. Storing data in a queue.
**Answer:** B
**Explanation:** When the recursive call is the final statement in a function, tail call optimization avoids allocating a new stack frame.
---

### 4. Why is the naive recursive calculation of Fibonacci numbers (`fib(n) = fib(n-1) + fib(n-2)`) notoriously inefficient?
A. It cannot compute negative numbers.
B. It generates a binary recursion tree that recomputes identical subproblems repeatedly, resulting in catastrophic $O(2^n)$ exponential time.
C. It produces incorrect math.
D. It only works for $n < 5$.
**Answer:** B
**Explanation:** The naive recursion tree branches twice at every step with massive overlapping subproblems (e.g. `fib(3)` computed dozens of times), leading to $O(2^n)$ explosion.
---

### 5. How does the "Fast Power" algorithm calculate $x^n$ in $O(\log n)$ logarithmic time instead of linear $O(n)$?
A. By rounding $x$ to an integer.
B. By dividing the exponent $n$ by 2 on each recursive step ($x^n = (x^{n/2})^2$), halving the remaining work on every call.
C. By multiplying $x$ by 10.
D. By utilizing GPU shaders.
**Answer:** B
**Explanation:** Halving the exponent on each recursive call reduces the total number of multiplications to $\log_2(n)$.
---

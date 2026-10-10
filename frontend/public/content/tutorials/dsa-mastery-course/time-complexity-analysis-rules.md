# Time Complexity Calculation Rules & Common Runtime Patterns

To master technical interviews and algorithm design, you must be able to calculate the exact Big-O time complexity of arbitrary code by sight. This tutorial establishes the **4 fundamental arithmetic rules of Big-O** and breaks down common loops, recursion, and nested patterns.

---

## 1. Real-World Analogy: Traveling Across Town

Suppose you travel from your house to an international airport:
1. You walk 3 minutes to your driveway.
2. You drive 45 minutes on the highway.
3. You wait 4 hours for an international flight.

When someone asks how long your journey took, you say: *"Around 4 to 5 hours."* You do not say *"4 hours, 45 minutes, and 180 seconds."* In Big-O analysis, we **drop non-dominant constants and lower-order terms** because as journeys scale to days, walking down the driveway contributes virtually zero percentage to the total duration.

---

## 2. The 4 Golden Rules of Big-O Calculation

### Rule 1: Drop Constants
$O(2n)$, $O(50n)$, and $O(\frac{n}{2})$ all simplify to **$O(n)$**.
```python
# Even though there are two separate loops (2n operations), it is O(n)
for x in items: # n operations
    print(x)
for y in items: # n operations
    print(y)
# Total: 2n -> O(n)
```

### Rule 2: Different Steps Add Together
If your code does one task followed by a completely different task with different inputs, **add their complexities**:
```python
def process_data(list_a, list_b):
    for a in list_a: # Takes O(a)
        print(a)
    for b in list_b: # Takes O(b)
        print(b)
# Total Time: O(a + b)  [NOT O(n)!]
```

### Rule 3: Nested Steps Multiply
When an inner loop executes once for every single iteration of an outer loop, **multiply their complexities**:
```python
for a in list_a:     # Runs 'a' times
    for b in list_b: # Runs 'b' times for each 'a'
        print(a, b)
# Total Time: O(a * b)
```

### Rule 4: Drop Non-Dominant Terms
Keep only the term with the steepest asymptotic growth rate:
- $O(n^2 + n) \implies O(n^2)$
- $O(n + \log n) \implies O(n)$
- $O(2^n + n^{100}) \implies O(2^n)$

---

## 3. Loop Analysis Patterns

### Pattern A: Halving Loop Variables $\implies O(\log n)$
Whenever a loop counter multiplies or divides by a factor on each iteration, the complexity is logarithmic:
```python
def log_loop(n: int):
    i = 1
    while i < n:
        print(i)
        i *= 2 # Doubling i means loop runs log2(n) times!
```

### Pattern B: Dependent Inner Loops
```python
def triangle_pattern(n: int):
    # Outer runs n times
    for i in range(n):
        # Inner runs i times: 0 + 1 + 2 + ... + (n-1) = n*(n-1)/2
        for j in range(i):
            print(i, j)
    # Total: (n^2 - n) / 2 -> Dropping constants & lower term -> O(n^2)
```

---

## 4. Multi-Language Implementations: Sieve of Eratosthenes ($O(n \log \log n)$)

The classical Sieve algorithm calculates all prime numbers up to $n$:

### Python 3:
```python
def count_primes(n: int) -> int:
    if n <= 2:
        return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    p = 2
    while p * p < n:
        if is_prime[p]:
            for multiple in range(p * p, n, p):
                is_prime[multiple] = False
        p += 1
        
    return sum(is_prime)
```

### Modern JavaScript / TypeScript:
```typescript
export function countPrimes(n: number): number {
  if (n <= 2) return 0;
  const isPrime = new Uint8Array(n).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;

  for (let p = 2; p * p < n; p++) {
    if (isPrime[p]) {
      for (let multiple = p * p; multiple < n; multiple += p) {
        isPrime[multiple] = 0;
      }
    }
  }

  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) count++;
  }
  return count;
}
```

---

## 5. Dry-Run Step Table: Halving Loop (`n = 64`)

| Iteration | Counter value (`i`) | Condition (`i < 64`) | Steps Completed |
|:---:|:---:|:---:|:---:|
| **1** | 1 | True | 1 |
| **2** | 2 | True | 2 |
| **3** | 4 | True | 3 |
| **4** | 8 | True | 4 |
| **5** | 16 | True | 5 |
| **6** | 32 | True | 6 |
| **7** | 64 | False (Loop Terminates) | $\mathbf{\log_2(64) = 6\text{ steps!}}$ |

---

# Multiple Choice Questions

### 1. What is the simplified Big-O time complexity of an algorithm whose step count formula is $T(n) = 5n^3 + 200n^2 + 10,000$?
A. $O(10,000)$
B. $O(n^2)$
C. $O(n^3)$
D. $O(n^5)$
**Answer:** C
**Explanation:** By applying the rule of dropping non-dominant terms and leading constants, the highest power term $n^3$ dominates as $n \to \infty$.
---

### 2. What is the time complexity of the following code snippet?
```python
i = n
while i > 1:
    i = i // 2
```
A. $O(1)$
B. $O(\log n)$
C. $O(n)$
D. $O(n^2)$
**Answer:** B
**Explanation:** Dividing the variable by 2 on each iteration reduces the problem size by half repeatedly, executing in $\log_2(n)$ iterations.
---

### 3. If a function iterates over an array of size $A$ in an outer loop, and inside it iterates over an entirely separate array of size $B$, what is the time complexity?
A. $O(n^2)$
B. $O(A \times B)$
C. $O(A + B)$
D. $O(\log A)$
**Answer:** B
**Explanation:** When two different input dimensions are nested, their complexities multiply, resulting in $O(A \times B)$.
---

### 4. What is the sum of the series $1 + 2 + 3 + \dots + n$, and what is its Big-O complexity?
A. $\frac{n(n+1)}{2}$, which simplifies to $O(n^2)$
B. $2^n$, which simplifies to $O(2^n)$
C. $n \log n$, which simplifies to $O(n \log n)$
D. $n$, which simplifies to $O(n)$
**Answer:** A
**Explanation:** Gauss's formula gives $\frac{n^2 + n}{2}$, which after dropping constants and lower-order terms yields $O(n^2)$.
---

### 5. What common mistake do engineers make when calculating the complexity of built-in functions like string slicing (`str[1:]`) or array cloning (`arr.slice()`)?
A. Assuming built-in library methods execute in $O(1)$ when they actually copy memory and take $O(n)$ time.
B. Assuming built-in methods run on the GPU.
C. Thinking slicing deletes the original variable.
D. Slicing has no time complexity.
**Answer:** A
**Explanation:** Creating copies or slices of arrays/strings requires allocating new memory and copying each element, running in linear $O(n)$ time rather than $O(1)$.
---

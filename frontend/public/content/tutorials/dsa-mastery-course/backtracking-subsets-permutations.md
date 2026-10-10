# Backtracking Mastery: State Space Trees, Subsets, Combinations & Permutations

**Backtracking** is a systematic algorithmic technique for solving constraint satisfaction and combinatorial search problems. It constructs candidate solutions incrementally and **abandons (backtracks)** a candidate as soon as it determines that the candidate cannot lead to a valid final solution.

---

## 1. Real-World Analogy: Navigating a Corn Maze

Imagine walking through a giant hedge or corn maze:
1. You walk down a path until you reach a fork with 3 options: Left, Center, Right.
2. You choose **Left** and walk forward.
3. You hit a dead end (**Failed Constraint**).
4. You do not stay at the dead end or teleport to the beginning; you **backtrack** back to the fork, undo your previous step, and try the **Center** path!

---

## 2. The Universal Backtracking Template

Almost every backtracking interview problem (N-Queens, Sudoku Solver, Subsets, Permutations) follows this 3-step pattern:

```text
def backtrack(candidate_path, choices):
    if is_solution(candidate_path):
        record_solution(candidate_path)
        return

    for choice in choices:
        if is_valid(choice):
            # 1. MAKE CHOICE
            candidate_path.append(choice)
            
            # 2. EXPLORE (Recurse)
            backtrack(candidate_path, updated_choices)
            
            # 3. UNDO CHOICE (Backtrack!)
            candidate_path.pop()
```

---

## 3. Classic Problem 1: Generating All Subsets (The Power Set)

Given an integer array `nums` of unique elements, return all possible subsets (the power set):

### Python 3 Implementation:
```python
def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start_index: int, current_subset: list[int]):
        # Every state along the decision tree is a valid subset!
        result.append(list(current_subset))
        
        for i in range(start_index, len(nums)):
            # 1. Make choice
            current_subset.append(nums[i])
            # 2. Recurse forward
            backtrack(i + 1, current_subset)
            # 3. Backtrack (undo choice)
            current_subset.pop()
            
    backtrack(0, [])
    return result
```

---

## 4. Classic Problem 2: Permutations

Given an array `nums` of distinct integers, return all possible permutations in any order:

### Modern JavaScript / TypeScript Implementation:
```typescript
export function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const visited = new Set<number>();

  function backtrack(currentPath: number[]): void {
    if (currentPath.length === nums.length) {
      result.push([...currentPath]); // Found full permutation
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (visited.has(nums[i])) continue; // Skip already chosen elements

      // 1. Choose
      currentPath.push(nums[i]);
      visited.add(nums[i]);

      // 2. Recurse
      backtrack(currentPath);

      // 3. Backtrack
      currentPath.pop();
      visited.delete(nums[i]);
    }
  }

  backtrack([]);
  return result;
}
```

---

## 5. Trace Tree: Subsets of `[1, 2]`

```text
                  [] (start)
                 /          \
            Add 1            Add 2
            /    \             \
         [1]     [1, 2]        [2]
       (backtrack) (backtrack)
```
Output Subsets: `[[], [1], [1, 2], [2]]` (Total: $2^n = 2^2 = 4$ subsets).

---

# Multiple Choice Questions

### 1. What does the "undo choice" (backtrack) step accomplish in a backtracking algorithm?
A. It deletes the program from RAM.
B. It restores the state of the candidate solution (e.g. popping the last added element) so sibling decision branches can be explored cleanly.
C. It resets the computer clock.
D. It terminates the recursion immediately.
**Answer:** B
**Explanation:** Undoing the choice reverts the shared path data structure to its prior state, allowing the loop to explore alternative branches without interference.
---

### 2. How many total subsets exist for a set of $n$ distinct elements (the Power Set)?
A. $n!$
B. $2^n$
C. $n^2$
D. $\log n$
**Answer:** B
**Explanation:** Each of the $n$ elements can either be included or excluded (2 choices per element), resulting in $2 \times 2 \times \dots \times 2 = 2^n$ subsets.
---

### 3. How many total permutations exist for an array of $n$ distinct elements?
A. $2^n$
B. $n!$ (Factorial)
C. $n^2$
D. $n \log n$
**Answer:** B
**Explanation:** For the first position there are $n$ choices, for the second $n-1$, and so on, giving $n \times (n-1) \times \dots \times 1 = n!$ permutations.
---

### 4. Why must we push a *copy* of the path (`result.append(list(current_path))` or `[...currentPath]`) into the results array?
A. Primitive numbers cannot be stored in arrays.
B. Arrays are passed by reference; storing the original reference would cause all entries in `result` to reflect the empty state after backtracking pops all items!
C. JavaScript requires copies for security.
D. Copies execute 2x faster.
**Answer:** B
**Explanation:** Because candidate arrays are mutated in-place during backtracking, saving a reference without shallow-copying would leave an array of empty brackets at the end.
---

### 5. What technique is used in backtracking to prune branches early before exploring invalid subtrees (e.g. placing two queens in the same row in N-Queens)?
A. Constraint Checking / Pruning
B. Binary Search
C. Memoization
D. Tail Recursion
**Answer:** A
**Explanation:** Pruning checks problem constraints before recursing, skipping entire invalid subtrees to save exponential computation.
---

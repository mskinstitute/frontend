# Stacks: LIFO Operations, Array/List Implementations & Bracket Matching

A **Stack** is a linear data structure governed strictly by the **LIFO (Last In, First Out)** principle. The last element added to the stack is the first element to be removed. Stacks power fundamental computing mechanisms: the browser back-button history, text editor undo/redo, expression evaluation, and compiler function call stacks.

---

## 1. Real-World Analogy: The Spring-Loaded Plate Dispenser

Think of the plate stack dispenser in a university cafeteria:
- When a dishwasher adds clean plates, they are placed on the **top** of the stack (**Push**).
- When a hungry student takes a plate, they take the plate from the **top** (**Pop**).
- You cannot access the plate at the bottom without first removing every plate above it!

---

## 2. The Core Stack Operations

![Stack and Queue Mechanics](/images/tutorials/dsa-mastery-course/dsa-stack-queue-fifo-lifo.svg)

| Operation | Action | Time Complexity |
| :--- | :--- | :---: |
| **`push(val)`** | Adds an element to the top of the stack | **$O(1)$** |
| **`pop()`** | Removes and returns the top element | **$O(1)$** |
| **`peek()` / `top()`** | Views the top element without removing it | **$O(1)$** |
| **`isEmpty()`** | Checks if the stack contains zero elements | **$O(1)$** |

---

## 3. Classic Problem: Valid Parentheses & Bracket Matching

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

### The Stack Solution:
- When encountering an opening bracket (`(`, `{`, `[`), push its corresponding closing bracket onto the stack.
- When encountering a closing bracket, pop from the stack. If the popped bracket does not match or the stack is empty, the string is invalid!
- If the stack is empty at the end, all brackets were matched successfully.

---

## 4. Multi-Language Implementations: Valid Parentheses

### Python 3:
```python
def is_valid_parentheses(s: str) -> bool:
    stack = []
    bracket_map = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in bracket_map.values():
            # Opening bracket: push to stack
            stack.append(char)
        elif char in bracket_map:
            # Closing bracket: check stack
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        else:
            continue # Non-bracket character
            
    return len(stack) == 0
```

### Modern JavaScript / TypeScript:
```typescript
export function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char in map) {
      if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}
```

---

## 5. Step-by-Step Trace: `s = "{ [ ] ( ) }"`

| Char | Type | Stack Before | Action | Stack After | Status |
|:---:|:---:|:---:|:---:|:---:|:---:|
| `{` | Open | `[]` | Push `{` | `['{']` | Valid |
| `[` | Open | `['{']` | Push `[` | `['{', '[']` | Valid |
| `]` | Close | `['{', '[']` | Pop matches `[` | `['{']` | Valid |
| `(` | Open | `['{']` | Push `(` | `['{', '(']` | Valid |
| `)` | Close | `['{', '(']` | Pop matches `(` | `['{']` | Valid |
| `}` | Close | `['{']` | Pop matches `{` | `[]` | Valid |

**End State:** Stack is empty `[]` $\to$ **Valid Parentheses (`True`)!**

---

# Multiple Choice Questions

### 1. Which fundamental access principle dictates how elements enter and leave a Stack?
A. FIFO (First In, First Out)
B. LIFO (Last In, First Out)
C. Random Access
D. Priority Queuing
**Answer:** B
**Explanation:** Stacks operate on LIFO (Last In, First Out), meaning the most recently added element is the first one retrieved.
---

### 2. What is the time complexity of the `push()` and `pop()` operations on a properly implemented Stack?
A. $O(n)$
B. $O(1)$
C. $O(\log n)$
D. $O(n^2)$
**Answer:** B
**Explanation:** Pushing or popping strictly targets the top of the stack, requiring constant $O(1)$ time with no element shifts.
---

### 3. What does it mean when calling `pop()` on an empty stack results in a "Stack Underflow"?
A. The computer runs out of physical memory.
B. The program attempted to extract an element from a stack that has no elements stored.
C. A network timeout occurred.
D. The stack reversed its order.
**Answer:** B
**Explanation:** Stack Underflow occurs when an algorithm attempts to pop or peek from a collection that contains zero items.
---

### 4. Why is a Stack the natural data structure for evaluating nested parentheses like `({[]})`?
A. Because Stacks sort strings alphabetically.
B. Because the most recently opened bracket must be the first one closed, matching the LIFO property of stacks.
C. Because Stacks take zero memory.
D. Stacks convert characters to ASCII numbers.
**Answer:** B
**Explanation:** Nested syntax demands that the inner-most (most recent) open tag be matched first, making the LIFO stack structure ideal.
---

### 5. In software architecture, which component relies directly on a stack data structure to manage function calls and local execution scope?
A. Database SQL query parser
B. The Call Stack / Execution Context stack in JavaScript, Python, and C runtime environments
C. The Wi-Fi adapter
D. CSS Flexbox engine
**Answer:** B
**Explanation:** Programming language runtimes use the Call Stack to keep track of active subroutines, parameter frames, and return points.
---

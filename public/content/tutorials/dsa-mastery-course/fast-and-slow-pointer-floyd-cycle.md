# Fast & Slow Pointers: Floyd's Cycle Detection & Middle Node Finding

The **Fast and Slow Pointer Technique** (also celebrated as **Floyd's Tortoise and Hare Algorithm**) is a two-pointer pattern where two pointers traverse a sequence at different speeds. It is the gold standard for **detecting loops in linked lists**, **locating the middle node**, and finding the entrance of a cycle in **$O(n)$ time and $O(1)$ space**.

---

## 1. Real-World Analogy: Runners on a Track

Imagine two runners, a Tortoise and a Hare, running on an Olympic running track:
- **Straight Road (No Cycle):** The fast runner (Hare) reaches the finish line and stops. They never cross paths again.
- **Circular Track (Cycle Exists):** Because the track loops, the faster runner running at 2 meters/sec will inevitably lap and **collide with the slower runner** running at 1 meter/sec!

```text
Visualizing Floyd's Tortoise and Hare on a Circular Track:
Slow: moves 1 step per tick  (Tortoise 🐢)
Fast: moves 2 steps per tick (Hare 🐇)
If Fast meets Slow (Slow == Fast), a cycle is mathematically guaranteed to exist!
```

---

## 2. Problem 1: Find the Middle Node of a Linked List in a Single Pass

In an array, finding the middle is trivial: `arr[n // 2]`. In a linked list where the total length $n$ is unknown:
- Initialize `slow = head` and `fast = head`.
- Move `slow` by 1 step (`slow = slow.next`).
- Move `fast` by 2 steps (`fast = fast.next.next`).
- When `fast` reaches the end (`fast is None` or `fast.next is None`), **`slow` is precisely at the middle node**!

### Python 3:
```python
def find_middle_node(head: ListNode) -> ListNode:
    slow = head
    fast = head
    
    while fast is not None and fast.next is not None:
        slow = slow.next       # Moves 1 step
        fast = fast.next.next  # Moves 2 steps
        
    return slow  # When fast hits the end, slow is at the middle!
```

---

## 3. Problem 2: Floyd's Cycle Detection Algorithm

Detect if a linked list contains a cycle:

### Modern JavaScript / TypeScript:
```typescript
export function hasCycle(head: ListNode | null): boolean {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;

    // Collision detected! A cycle exists.
    if (slow === fast) {
      return true;
    }
  }

  return false; // Fast reached NULL, no cycle exists
}
```

---

## 4. Problem 3: Finding the Exact Cycle Entry Node (Floyd's Phase 2)

Once `slow` and `fast` collide at point $C$, how do you find the exact node where the cycle began?
1. Keep `slow` at the collision meeting point.
2. Reset `fast` back to the `head` of the linked list.
3. Advance both `slow` and `fast` at the **same speed of 1 step per tick**.
4. The exact node where they collide again is the **Entry Node of the Cycle**!

```python
def detect_cycle_entry(head: ListNode) -> ListNode:
    slow = fast = head
    has_cycle = False
    
    # Phase 1: Detect Collision
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
            
    if not has_cycle:
        return None
        
    # Phase 2: Locate Entry
    fast = head
    while slow != fast:
        slow = slow.next
        fast = fast.next  # Both move at 1 step per tick!
        
    return slow # Both meet at the cycle entry node
```

---

## 5. Trace Table: Fast & Slow Middle Finding on `1 -> 2 -> 3 -> 4 -> 5 -> NULL`

| Step | `slow` Node | `fast` Node | `fast.next` | Loop Condition (`fast && fast.next`) |
|:---:|:---:|:---:|:---:|:---:|
| **Start** | 1 | 1 | 2 | True |
| **1** | 2 | 3 | 4 | True |
| **2** | **3 (Middle!)** | 5 | NULL | False (Loop terminates) |

**Result:** `slow` stops at Node `3` in exactly $\frac{n}{2}$ steps without needing a counter or second pass!

---

# Multiple Choice Questions

### 1. In Floyd's Cycle Detection Algorithm, at what speeds do the two pointers traverse the linked list?
A. Both pointers move 1 step per iteration.
B. Slow moves 1 step per iteration; Fast moves 2 steps per iteration.
C. Slow moves 1 step; Fast moves 10 steps.
D. Slow moves backwards; Fast moves forward.
**Answer:** B
**Explanation:** Moving the slow pointer 1 step and the fast pointer 2 steps ensures that if a cycle exists, the relative distance between them decreases by 1 step per iteration until they collide.
---

### 2. What is the space complexity of Floyd's Cycle Finding Algorithm compared to using a Hash Set of visited nodes?
A. Floyd's uses $O(n)$ space; Hash Set uses $O(1)$ space.
B. Floyd's uses $O(1)$ constant space, whereas a Hash Set consumes $O(n)$ auxiliary memory to store visited node references.
C. Both algorithms use $O(n^2)$ space.
D. Floyd's algorithm cannot run in memory.
**Answer:** B
**Explanation:** Using two pointer variables requires only $O(1)$ auxiliary space, avoiding the $O(n)$ memory allocation needed for tracking visited addresses in a hash table.
---

### 3. How does the Fast & Slow pointer pattern locate the middle node of a linked list of length $n$ in a single traversal?
A. By dividing the computer's clock speed by 2.
B. Because the fast pointer moves at twice the speed of the slow pointer, when the fast pointer reaches the end ($n$), the slow pointer is at position $\frac{n}{2}$.
C. It counts the nodes using a global variable.
D. It reverses the list first.
**Answer:** B
**Explanation:** Since `fast` travels at $2\times$ velocity, when `fast` traverses distance $n$, `slow` has traversed exactly $\frac{n}{2}$ distance.
---

### 4. In Floyd's Algorithm Phase 2, how do you locate the start node of the cycle once a collision has occurred?
A. Reset `fast` to `head` and advance both `slow` and `fast` by 1 step each until they meet.
B. Delete the collision node.
C. Reverse the entire cycle.
D. Multiply the pointers.
**Answer:** A
**Explanation:** Mathematical proof shows that the distance from the head to the cycle start equals the distance from the collision meeting point to the cycle start; moving both at 1 step/iteration intersects at the cycle start.
---

### 5. What condition must be checked in the while loop of the Fast & Slow pointer algorithm to prevent null pointer exceptions?
A. `while (fast != null && fast.next != null)`
B. `while (slow != null)`
C. `while (fast > 0)`
D. `while (true)`
**Answer:** A
**Explanation:** Attempting to access `fast.next.next` when `fast` or `fast.next` is null throws a null pointer exception; checking both protects execution.
---

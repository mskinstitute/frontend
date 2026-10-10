# Singly Linked Lists: Node Architecture, Traversal & In-Place Reversal

A **Singly Linked List** is a fundamental linear data structure where elements (called **Nodes**) are not stored in contiguous memory cells. Instead, each node contains a data payload and a **reference pointer (`next`)** to the subsequent node in memory.

---

## 1. Real-World Analogy: The Scavenger Hunt

Think of a treasure hunt where each clue contains:
1. A small prize or message (**Data**).
2. A handwritten note with GPS coordinates to the next clue (**Next Pointer**).
- You cannot teleport directly to Clue #5; you must find Clue #1, follow its pointer to Clue #2, then #3, and so on.
- The final clue has no coordinates (**NULL Pointer**), indicating the hunt is over.

---

## 2. Linked List Memory Architecture

![Linked List Memory Structure](/images/tutorials/dsa-mastery-course/dsa-linked-list-memory-pointers.svg)

### Comparison: Array vs Linked List

| Feature | Array | Singly Linked List |
| :--- | :--- | :--- |
| **Memory Allocation** | Contiguous chunk of RAM | Scattered nodes anywhere in Heap memory |
| **Index Access (`get(i)`)** | **$O(1)$** (Direct pointer math) | **$O(n)$** (Must traverse from Head) |
| **Insert/Delete at Beginning** | **$O(n)$** (Shifting elements) | **$O(1)$** (Update Head pointer) |
| **Memory Overhead** | Low (Only data stored) | High (Each node stores data + 8-byte pointer) |
| **Resizing Cost** | $O(n)$ reallocation & copy | $O(1)$ dynamic heap allocation per node |

---

## 3. The Core Algorithm: In-Place Linked List Reversal ($O(n)$ Time, $O(1)$ Space)

Reversing a linked list is the quintessential technical interview question. You must redirect every node's `next` pointer to face backwards without allocating new nodes:

```text
Initial:      [1] -> [2] -> [3] -> NULL
Pointers:     prev = NULL, curr = [1]
Step 1:       Save next_node = [2]
              Redirect curr.next = prev (points to NULL)
              Advance prev = curr ([1])
              Advance curr = next_node ([2])
Final Result: NULL <- [1] <- [2] <- [3] (prev is new Head!)
```

---

## 4. Multi-Language Implementations: Node & Reversal

### Python 3:
```python
class ListNode:
    def __init__(self, val: int = 0, next: 'ListNode' = None):
        self.val = val
        self.next = next

def reverse_linked_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    
    while curr is not None:
        next_temp = curr.next  # 1. Save reference to next node
        curr.next = prev       # 2. Reverse current node's pointer
        prev = curr            # 3. Advance prev pointer
        curr = next_temp       # 4. Advance curr pointer
        
    return prev  # prev is the new head of the reversed list!
```

### Modern JavaScript / TypeScript:
```typescript
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function reverseLinkedList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr !== null) {
    const nextTemp: ListNode | null = curr.next; // 1. Save next
    curr.next = prev;                            // 2. Reverse pointer
    prev = curr;                                 // 3. Move prev
    curr = nextTemp;                             // 4. Move curr
  }

  return prev;
}
```

---

## 5. Trace Table: Reversing List `1 -> 2 -> 3 -> NULL`

| Iteration | `curr.val` | `nextTemp.val` | New `curr.next` | `prev` becomes | `curr` becomes |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **Init** | 1 | - | - | NULL | 1 |
| **1** | 1 | 2 | NULL | 1 | 2 |
| **2** | 2 | 3 | 1 | 2 | 3 |
| **3** | 3 | NULL | 2 | 3 | NULL (Loop ends) |

**Result:** `prev` points to Node `3 -> 2 -> 1 -> NULL`. Reversed in $O(n)$ time with $O(1)$ space!

---

# Multiple Choice Questions

### 1. What does each node in a standard Singly Linked List contain?
A. An integer index and a CPU clock timestamp.
B. A data value and a pointer/reference to the next node in the sequence.
C. Two pointers pointing to the parent and child.
D. An entire copy of the database.
**Answer:** B
**Explanation:** A singly linked list node contains two components: the data payload and a pointer to the next node in the list.
---

### 2. Why is random index access in a linked list (`get(i)`) $O(n)$ while in an array it is $O(1)$?
A. Arrays use quantum memory.
B. Linked list nodes are scattered in non-contiguous memory locations, requiring sequential pointer traversal from the `head` node to reach index $i$.
C. Linked lists are encrypted.
D. Arrays have fewer bugs.
**Answer:** B
**Explanation:** Because linked list nodes are allocated dynamically at arbitrary memory addresses, direct mathematical indexing is impossible; you must follow $i$ pointers from the head.
---

### 3. What is the time complexity of inserting a new node at the very beginning (Head) of a Singly Linked List?
A. $O(n)$
B. $O(\log n)$
C. $O(1)$
D. $O(n^2)$
**Answer:** C
**Explanation:** Inserting at the head simply requires setting `newNode.next = head` and updating `head = newNode`, taking constant $O(1)$ time.
---

### 4. What happens if you update `curr.next = prev` during an in-place list reversal before saving `curr.next` in a temporary variable?
A. The code runs 2x faster.
B. You lose the reference pointer to the remainder of the linked list, severing the chain and causing memory/pointer loss.
C. The list reverses automatically.
D. The compiler fixes it.
**Answer:** B
**Explanation:** Mutating `curr.next` overwrites the forward pointer; without storing it in `nextTemp` first, the remaining nodes become unreachable.
---

### 5. What value does the `next` pointer of the tail node store in a standard non-circular linked list?
A. The address of the Head node.
B. `null` (or `None` in Python).
C. An empty string `""`.
D. The number 0.
**Answer:** B
**Explanation:** By convention, the terminal node (Tail) of a singly linked list points to `null` to indicate the end of the sequence.
---

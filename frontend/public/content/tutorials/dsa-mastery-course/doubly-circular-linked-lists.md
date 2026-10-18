# Doubly & Circular Linked Lists with Sentinel/Dummy Nodes

While Singly Linked Lists only allow unidirectional forward traversal, advanced system architectures (like LRU Caches and OS process schedulers) require bidirectional navigation and circular loops. **Doubly Linked Lists** provide both `prev` and `next` pointers, while **Sentinel (Dummy) Nodes** eliminate treacherous null-pointer edge cases.

---

## 1. Real-World Analogy: Train Carriages & Playlists

- **Doubly Linked List (Train Carriages):** Each train car is physically hooked to both the car in front (**Prev**) and the car behind (**Next**). A conductor can walk forward or backward between cars freely.
- **Circular Linked List (Music Playlist on "Repeat"):** When the last song (**Tail**) finishes, its `next` pointer loops straight back to the first song (**Head**), creating an endless seamless cycle.

---

## 2. Why Sentinel (Dummy) Nodes Are an Industry Standard

When modifying linked lists (inserting/deleting), handling deletions at the absolute `head` or `tail` usually requires verbose, bug-prone `if (head == null)` checks.

A **Sentinel / Dummy Node** is an empty placeholder node that permanently anchors the beginning and end of the list:
```text
[Dummy Head] <---> [Node 10] <---> [Node 20] <---> [Dummy Tail]
```
With dummy nodes:
- The list is **never empty** (always contains at least Head and Tail sentinels).
- Every real data node **always has both a valid previous and next neighbor**.
- Edge cases for empty lists, single-node lists, and boundary deletions disappear completely!

---

## 3. Designing a Doubly Linked List Node

### Python:
```python
class DoublyNode:
    def __init__(self, val: int = 0):
        self.val = val
        self.prev: 'DoublyNode' = None
        self.next: 'DoublyNode' = None
```

### C:
```c
#include <stdio.h>
#include <stdlib.h>

typedef struct DoublyNode {
    int val;
    struct DoublyNode* prev;
    struct DoublyNode* next;
} DoublyNode;

DoublyNode* create_node(int val) {
    DoublyNode* node = (DoublyNode*)malloc(sizeof(DoublyNode));
    node->val = val;
    node->prev = NULL;
    node->next = NULL;
    return node;
}
```

### C++:
```cpp
struct DoublyNode {
    int val;
    DoublyNode* prev;
    DoublyNode* next;
    DoublyNode(int v = 0) : val(v), prev(nullptr), next(nullptr) {}
};
```

### Java:
```java
public class DoublyNode {
    public int val;
    public DoublyNode prev;
    public DoublyNode next;

    public DoublyNode(int val) {
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}
```

### JavaScript:
```javascript
class DoublyNode {
    constructor(val = 0) {
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}
```

### Removing a Node in $O(1)$ Time Given its Reference:
In a singly linked list, deleting a node requires $O(n)$ traversal to find its predecessor. In a doubly linked list, because the node knows its own `prev`, deletion is an instant $O(1)$ pointer splice:

### Python:
```python
def remove_node(node: DoublyNode) -> None:
    # Splice out 'node' by connecting its neighbors to each other
    node.prev.next = node.next
    node.next.prev = node.prev
```

### C:
```c
void remove_node(DoublyNode* node) {
    if (!node || !node->prev || !node->next) return;
    node->prev->next = node->next;
    node->next->prev = node->prev;
    free(node);
}
```

### C++:
```cpp
void remove_node(DoublyNode* node) {
    if (!node) return;
    node->prev->next = node->next;
    node->next->prev = node->prev;
    delete node;
}
```

### Java:
```java
public static void removeNode(DoublyNode node) {
    if (node == null) return;
    node.prev.next = node.next;
    node.next.prev = node.prev;
}
```

### JavaScript:
```javascript
function removeNode(node) {
    if (!node) return;
    node.prev.next = node.next;
    node.next.prev = node.prev;
}
```

---

## 4. Multi-Language Implementations: Doubly Linked List with Sentinels

### Python:
```python
class DoublyLinkedList:
    def __init__(self):
        self.head = DoublyNode(0) # Dummy Head
        self.tail = DoublyNode(0) # Dummy Tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0

    def add_to_front(self, val: int) -> None:
        new_node = DoublyNode(val)
        # Connect new_node between dummy head and head.next
        new_node.next = self.head.next
        new_node.prev = self.head
        self.head.next.prev = new_node
        self.head.next = new_node
        self.size += 1

    def remove_last(self) -> int:
        if self.size == 0:
            return -1
        last_real_node = self.tail.prev
        last_real_node.prev.next = self.tail
        self.tail.prev = last_real_node.prev
        self.size -= 1
        return last_real_node.val
```

### C:
```c
#include <stdio.h>
#include <stdlib.h>

typedef struct DoublyLinkedList {
    DoublyNode* head;
    DoublyNode* tail;
    int size;
} DoublyLinkedList;

DoublyLinkedList* create_list() {
    DoublyLinkedList* list = (DoublyLinkedList*)malloc(sizeof(DoublyLinkedList));
    list->head = create_node(0);
    list->tail = create_node(0);
    list->head->next = list->tail;
    list->tail->prev = list->head;
    list->size = 0;
    return list;
}

void add_to_front(DoublyLinkedList* list, int val) {
    DoublyNode* node = create_node(val);
    node->next = list->head->next;
    node->prev = list->head;
    list->head->next->prev = node;
    list->head->next = node;
    list->size++;
}

int remove_last(DoublyLinkedList* list) {
    if (list->size == 0) return -1;
    DoublyNode* last = list->tail->prev;
    int val = last->val;
    last->prev->next = list->tail;
    list->tail->prev = last->prev;
    free(last);
    list->size--;
    return val;
}
```

### C++:
```cpp
class DoublyLinkedList {
private:
    DoublyNode* head;
    DoublyNode* tail;
    int size;

public:
    DoublyLinkedList() : size(0) {
        head = new DoublyNode(0);
        tail = new DoublyNode(0);
        head->next = tail;
        tail->prev = head;
    }

    void addToFront(int val) {
        DoublyNode* node = new DoublyNode(val);
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
        size++;
    }

    int removeLast() {
        if (size == 0) return -1;
        DoublyNode* last = tail->prev;
        int val = last->val;
        last->prev->next = tail;
        tail->prev = last->prev;
        delete last;
        size--;
        return val;
    }
};
```

### Java:
```java
public class DoublyLinkedList {
    private DoublyNode head;
    private DoublyNode tail;
    private int size;

    public DoublyLinkedList() {
        this.head = new DoublyNode(0);
        this.tail = new DoublyNode(0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.size = 0;
    }

    public void addToFront(int val) {
        DoublyNode node = new DoublyNode(val);
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
        this.size++;
    }

    public int removeLast() {
        if (this.size == 0) return -1;
        DoublyNode last = this.tail.prev;
        int val = last.val;
        last.prev.next = this.tail;
        this.tail.prev = last.prev;
        this.size--;
        return val;
    }
}
```

### JavaScript:
```javascript
export class DoublyLinkedList {
  constructor() {
    this.head = new DoublyNode(0);
    this.tail = new DoublyNode(0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  addToFront(val) {
    const node = new DoublyNode(val);
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
    this.size++;
  }

  removeLast() {
    if (this.size === 0) return -1;
    const toRemove = this.tail.prev;
    toRemove.prev.next = this.tail;
    this.tail.prev = toRemove.prev;
    this.size--;
    return toRemove.val;
  }
}
```

---

## 5. Circular Linked Lists

In a **Circular Singly Linked List**, the tail node points back to `head` instead of `null`:
```text
[Node 1] -> [Node 2] -> [Node 3] -+
   ^                              |
   +------------------------------+
```
- **Traversal Guard:** Loops cannot use `while curr != null`. You must check `while curr.next != head` to prevent infinite loops!
- **Top Applications:** Round-robin CPU time-slice scheduling, multiplayer turn-based board games.

---

# Multiple Choice Questions

### 1. What additional field does a Doubly Linked List node contain compared to a Singly Linked List node?
A. A pointer to the CPU registers.
B. A `prev` pointer referencing the preceding node in the list.
C. A cryptographic signature.
D. An integer array.
**Answer:** B
**Explanation:** Doubly linked list nodes store both a `next` pointer to the subsequent node and a `prev` pointer to the preceding node.
---

### 2. How does a Sentinel (Dummy) node improve linked list code quality?
A. It speeds up the CPU clock speed.
B. It acts as permanent boundary anchors at the head/tail, eliminating special edge-case checks for empty lists or boundary insertions/deletions.
C. It compresses the list data into base64.
D. It prevents the need for memory allocation.
**Answer:** B
**Explanation:** Dummy nodes ensure that real data nodes always have valid adjacent neighbors, removing verbose conditional checks for null heads/tails.
---

### 3. What is the time complexity of deleting a node from a Doubly Linked List when you already have a direct pointer reference to that node?
A. $O(n)$
B. $O(1)$
C. $O(\log n)$
D. $O(n^2)$
**Answer:** B
**Explanation:** Because the node directly references its predecessor (`node.prev`) and successor (`node.next`), splicing it out takes constant $O(1)$ pointer assignments.
---

### 4. What is the defining characteristic of a Circular Linked List?
A. Nodes are shaped like circles in memory.
B. The tail node's `next` pointer references the head node instead of `null`.
C. The list can only hold even numbers.
D. The list has no data payload.
**Answer:** B
**Explanation:** In a circular linked list, the final node loops back to point to the starting head node, forming a continuous ring.
---

### 5. In an LRU (Least Recently Used) Cache design, why is a Doubly Linked List paired with a Hash Map?
A. Hash maps do not work without linked lists.
B. The hash map provides $O(1)$ node lookup, while the doubly linked list allows $O(1)$ removal and re-insertion of accessed nodes to the front of the cache.
C. Doubly linked lists encrypt web traffic.
D. To prevent stack overflow.
**Answer:** B
**Explanation:** An LRU cache requires both $O(1)$ key lookup (Hash Map) and $O(1)$ eviction/re-ordering of items (Doubly Linked List).
---

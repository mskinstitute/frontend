# Binary Search Trees (BST): Insertion, Deletion, Validation & Inorder Sorting

A **Binary Search Tree (BST)** is an ordered binary tree that maintains the **BST Invariant**:
$$\text{For every node } X: \quad \text{All nodes in Left Subtree} < X < \text{All nodes in Right Subtree}$$
This ordering property transforms linear searches into fast **$O(h)$ tree searches** (where $h$ is the height of the tree).

---

## 1. Real-World Analogy: The Phonebook or Card Catalog

Think of looking up a contact in an alphabetized address book:
- You open to the middle letter: `'M'`.
- If you are looking for `'Smith'`, you know `'S' > 'M'`. You immediately discard the entire first half of the book!
- If you were looking for `'Brown'`, you would discard the second half.
- A BST arranges computer memory so every comparison cuts the candidate search tree in half.

---

## 2. The Core BST Operations & Time Complexity

| Operation | Balanced BST Height ($h = \log n$) | Degenerate BST (Skewed $h = n$) |
| :--- | :---: | :---: |
| **Search** | **$O(\log n)$** | $O(n)$ |
| **Insert** | **$O(\log n)$** | $O(n)$ |
| **Delete** | **$O(\log n)$** | $O(n)$ |

*Note: If elements are inserted in already sorted order (`1, 2, 3, 4, 5`), an un-balanced BST degenerates into a singly linked list! Self-balancing trees (AVL, Red-Black Trees) prevent this skewing.*

---

## 3. Node Deletion Cases in a BST

Deleting a node from a BST has three distinct structural cases:
1. **Case 1: Node is a Leaf (No Children):** Simply delete the node (`return None`).
2. **Case 2: Node has One Child:** Splice out the node and replace it with its single child.
3. **Case 3: Node has Two Children (The Classic):** 
   - Find the **Inorder Successor** (the smallest value in the right subtree: `min_node(root.right)`).
   - Copy the successor's value into the current node.
   - Delete the successor node from the right subtree!

---

## 4. Multi-Language Implementations: BST Operations

### Python 3:
```python
class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# 1. Search in BST
def search_bst(root: TreeNode, val: int) -> TreeNode:
    if not root or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)

# 2. Insert into BST
def insert_into_bst(root: TreeNode, val: int) -> TreeNode:
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    return root

# 3. Validate BST
def is_valid_bst(root: TreeNode) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        # Left child must be < node.val, Right child must be > node.val
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root)
```

### Modern JavaScript / TypeScript:
```typescript
export function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number, max: number): boolean {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;

    return (
      validate(node.left, min, node.val) &&
      validate(node.right, node.val, max)
    );
  }

  return validate(root, -Infinity, Infinity);
}
```

---

## 5. Trace Table: Inserting 25 into BST with Root 50

```text
Tree:
      50
     /  \
   30    70
   / \
  20  40
```

| Step | Current Node | Comparison | Action |
|:---:|:---:|:---:|:---:|
| **1** | 50 | $25 < 50$ | Traverse Left to Node 30 |
| **2** | 30 | $25 < 30$ | Traverse Left to Node 20 |
| **3** | 20 | $25 > 20$ | Traverse Right (Right is `null`) |
| **4** | `null` | Insert position found | Attach new Node 25 as right child of 20! |

---

# Multiple Choice Questions

### 1. What is the fundamental property that defines a valid Binary Search Tree (BST)?
A. Every node must have exactly two children.
B. For every node, all keys in its left subtree are strictly less than its key, and all keys in its right subtree are strictly greater than its key.
C. All leaf nodes must be at the same depth.
D. The tree cannot store odd numbers.
**Answer:** B
**Explanation:** The BST invariant dictates that left subtree values are strictly smaller than the node, and right subtree values are strictly larger.
---

### 2. What is the worst-case time complexity of searching a value in an unbalanced BST of $n$ elements?
A. $O(\log n)$
B. $O(n)$
C. $O(1)$
D. $O(n \log n)$
**Answer:** B
**Explanation:** If nodes are inserted in sorted order, the tree degenerates into a linear linked list of height $n$, causing searches to take $O(n)$ time.
---

### 3. When deleting a node with TWO children in a BST, which node can replace it to preserve the BST invariant?
A. The absolute largest node in the entire tree.
B. Its Inorder Successor (smallest node in the right subtree) OR its Inorder Predecessor (largest node in the left subtree).
C. Any random leaf node.
D. The root node.
**Answer:** B
**Explanation:** The inorder successor is the smallest value greater than the deleted node, perfectly fitting between the left and right subtrees.
---

### 4. Why is checking `node.left.val < node.val && node.right.val > node.val` insufficient to validate if a binary tree is a valid BST?
A. It throws a syntax error.
B. It only checks immediate children; a node deep in the left subtree could violate the root's constraint (e.g. a right child of a left subtree larger than root).
C. It only works for trees with 3 nodes.
D. It deletes the left child.
**Answer:** B
**Explanation:** Local parent-child checks miss ancestral violations; validation must carry valid range bounds `(min, max)` down through all recursive calls.
---

### 5. What self-balancing BST data structures maintain strict $O(\log n)$ height by performing tree rotations upon insertions and deletions?
A. Binary Heaps and Stacks
B. AVL Trees and Red-Black Trees
C. Hash Maps
D. Singly Linked Lists
**Answer:** B
**Explanation:** AVL and Red-Black trees automatically execute left and right rotations to keep height bounded by $O(\log n)$, preventing degenerate linked lists.
---

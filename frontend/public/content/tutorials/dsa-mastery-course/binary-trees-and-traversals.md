# Binary Tree Traversals: DFS (Pre, In, Post) & BFS Level-Order

A **Binary Tree** is a non-linear hierarchical data structure in which each node has at most **two children**, referred to as the `left` child and the `right` child. Binary trees are the building blocks of **Binary Search Trees (BST)**, **Heaps**, **Expression Parsers**, and **Huffman Coding**.

---

## 1. Real-World Analogy: Family Genealogy & File Directories

Think of a computer file system directory tree:
- Root folder (`/`) contains subfolders (`/home`, `/etc`).
- Each subfolder contains child files and directories.
- To scan every file on your computer, you can either:
  1. Explore deeply down one folder branch until the bottom before backtracking (**Depth-First Search - DFS**).
  2. Inspect all immediate files in the current folder, then all files 1 level down, then 2 levels down (**Breadth-First Search - BFS**).

---

## 2. Binary Tree Architectural Diagram

![Binary Tree and Heap Structure](/images/tutorials/dsa-mastery-course/dsa-binary-tree-heap-traversal.svg)

---

## 3. The 4 Essential Tree Traversals

### Depth-First Search (DFS) Variants:
1. **Preorder (Root $\to$ Left $\to$ Right):** Useful for cloning/serializing trees.
2. **Inorder (Left $\to$ Root $\to$ Right):** In a BST, produces sorted numerical order!
3. **Postorder (Left $\to$ Right $\to$ Root):** Bottom-up evaluation (deleting trees, calculating folder sizes).

### Breadth-First Search (BFS):
4. **Level-Order:** Traverses tree level-by-level from top to bottom using a **FIFO Queue**.

```text
       1
      / \
     2   3
    / \
   4   5

Preorder:   1 -> 2 -> 4 -> 5 -> 3
Inorder:    4 -> 2 -> 5 -> 1 -> 3
Postorder:  4 -> 5 -> 2 -> 3 -> 1
Level-Order:1 -> 2 -> 3 -> 4 -> 5
```

---

## 4. Multi-Language Implementations

### Python 3:
```python
from collections import deque

class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# 1. Inorder Traversal (DFS)
def inorder_traversal(root: TreeNode) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)        # 1. Traverse Left
        result.append(node.val) # 2. Visit Root
        dfs(node.right)       # 3. Traverse Right
    dfs(root)
    return result

# 2. Level-Order Traversal (BFS)
def level_order(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    levels = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(current_level)
        
    return levels
```

### Modern JavaScript / TypeScript:
```typescript
export class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

// Inorder Traversal
export function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// Level-Order Traversal (BFS)
export function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const levels: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    levels.push(currentLevel);
  }

  return levels;
}
```

---

## 5. Trace Table: Level-Order BFS on Example Tree

| Iteration | Active Queue at Start | `levelSize` | Dequeued Nodes & Added to Level | Queue After Adding Children |
|:---:|:---:|:---:|:---:|:---:|
| **Level 0** | `[1]` | 1 | Dequeue 1 $\to$ Level: `[1]` | `[2, 3]` |
| **Level 1** | `[2, 3]` | 2 | Dequeue 2 (add 4,5), Dequeue 3 | `[4, 5]` |
| **Level 2** | `[4, 5]` | 2 | Dequeue 4, Dequeue 5 | `[]` (Empty $\to$ Done!) |

---

# Multiple Choice Questions

### 1. In which order does an "Inorder Traversal" visit the components of a subtree?
A. Root $\to$ Left $\to$ Right
B. Left $\to$ Root $\to$ Right
C. Left $\to$ Right $\to$ Root
D. Right $\to$ Root $\to$ Left
**Answer:** B
**Explanation:** Inorder traversal processes the left child subtree first, then the root node, and finally the right child subtree.
---

### 2. What data structure is fundamentally required to implement Level-Order (BFS) tree traversal?
A. LIFO Stack
B. FIFO Queue
C. Priority Queue
D. Hash Map
**Answer:** B
**Explanation:** A FIFO queue guarantees that nodes are visited in concentric rings based on their depth distance from the root.
---

### 3. What is the maximum number of nodes at level $L$ of a binary tree (where root is level 0)?
A. $L^2$
B. $2^L$
C. $2L$
D. $L!$
**Answer:** B
**Explanation:** Level 0 has $2^0 = 1$ node; Level 1 has $2^1 = 2$; Level $L$ has a theoretical maximum of $2^L$ nodes.
---

### 4. In a Binary Search Tree (BST), which traversal produces the node values in strictly ascending sorted order?
A. Preorder
B. Inorder
C. Postorder
D. Level-Order
**Answer:** B
**Explanation:** By definition of BST, all keys in the left subtree are smaller than root and right keys are larger; Inorder (Left $\to$ Root $\to$ Right) naturally yields sorted order.
---

### 5. What is the time complexity of traversing all $n$ nodes of a binary tree using DFS or BFS?
A. $O(\log n)$
B. $O(n)$
C. $O(n \log n)$
D. $O(n^2)$
**Answer:** B
**Explanation:** Every node in the tree is visited exactly once, requiring $O(n)$ linear time.
---

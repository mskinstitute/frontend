# Graph Theory: Adjacency Matrix vs List & BFS vs DFS Traversals

A **Graph** is a non-linear data structure consisting of a finite set of vertices (or nodes) $V$ and a collection of edges $E$ that connect pairs of vertices: $G = (V, E)$. Graphs generalize trees by eliminating the constraints of root nodes, parent-child hierarchies, and cycle-free requirements. Graphs model networks everywhere: social networks (friendships), city road systems, internet web pages (hyperlinks), and dependency packaging systems.

![Graph Representations and Traversals](/images/tutorials/dsa-mastery-course/dsa-graph-bfs-dfs-matrix.svg)

---

## 1. Graph Classifications & Terminology

Before writing code, we categorize graphs according to direction, weighting, and cyclic nature:

1. **Directed (Digraph) vs. Undirected:**
   - *Undirected:* If an edge exists between node $A$ and node $B$, you can travel bidirectionally: $(A, B) = (B, A)$.
   - *Directed:* Edges have orientation (arrows). $(A \to B)$ allows movement only from $A$ to $B$.
2. **Weighted vs. Unweighted:**
   - *Unweighted:* Every edge has uniform cost (effectively $1$).
   - *Weighted:* Edges carry numerical values representing distance, latency, toll fee, or capacity.
3. **Cyclic vs. Acyclic:**
   - *Cyclic:* Contains at least one closed walk starting and ending at the same vertex.
   - *Acyclic (DAG):* Directed Acyclic Graph contains zero directed cycles (essential for scheduling, Git commits, and compilers).
4. **Degree:**
   - In undirected graphs, degree is the number of incident edges.
   - In directed graphs, **In-Degree** is the count of incoming edges; **Out-Degree** is the count of outgoing edges.

---

## 2. Graph Representations: Matrix vs. List

```
Graph:
    (0) ----- (1)
     |       / |
     |     /   |
     |   /     |
    (2) ----- (3)

1. Adjacency Matrix (4x4 Grid):
       0  1  2  3
    0 [0, 1, 1, 0]
    1 [1, 0, 1, 1]
    2 [1, 1, 0, 1]
    3 [0, 1, 1, 0]
    Space: O(V^2)

2. Adjacency List (Hash Map or Array of Lists):
    0: [1, 2]
    1: [0, 2, 3]
    2: [0, 1, 3]
    3: [1, 2]
    Space: O(V + E)
```

### Representation Trade-Off Matrix

| Operation / Metric | Adjacency Matrix | Adjacency List (Standard) | Winner |
| :--- | :--- | :--- | :--- |
| **Space Complexity** | $O(V^2)$ regardless of edge count | $O(V + E)$ (or $O(V + 2E)$ for undirected) | **List** for sparse graphs |
| **Add Vertex** | $O(V^2)$ (reallocate matrix) | $O(1)$ | **List** |
| **Add Edge** | $O(1)$ | $O(1)$ | Tie |
| **Query Edge (u, v)** | $O(1)$ (`matrix[u][v] == 1`) | $O(\text{deg}(u))$ (search list) | **Matrix** |
| **Iterate Neighbors of u** | $O(V)$ (scan entire row) | $O(\text{deg}(u))$ (scan only actual neighbors) | **List** |

In technical interviews and real-world software, graphs are overwhelmingly **sparse** ($E \ll V^2$), making the **Adjacency List** the universal industry choice.

---

## 3. Graph Traversal: BFS vs. DFS

Traversing a graph requires exploring all reachable vertices while maintaining a `visited` set to prevent infinite loops caused by cycles.

### Breadth-First Search (BFS)
- **Data Structure:** FIFO Queue (`collections.deque`).
- **Strategy:** Layer-by-layer exploration (level order).
- **Core Property:** Computes the **shortest path in unweighted graphs** (minimum edge count).

### Depth-First Search (DFS)
- **Data Structure:** LIFO Stack (or recursion call stack).
- **Strategy:** Explore as deep as possible along each branch before backtracking.
- **Core Property:** Natural for connectivity, maze solving, cycle detection, and topological sorting.

---

## 4. Step-by-Step Traversal Trace

Given an undirected graph with nodes `0, 1, 2, 3, 4` and edges: `(0,1), (0,2), (1,3), (2,4)`. Starting at node `0`:

### BFS Step-by-Step Execution
| Step | Current Node | Visited Set | Queue State (Front -> Back) | Action / Neighbors Added |
| :--- | :--- | :--- | :--- | :--- |
| Initial | - | `{0}` | `[0]` | Start at root `0` |
| 1 | `0` | `{0, 1, 2}` | `[1, 2]` | Dequeue `0`, add neighbors `1, 2` |
| 2 | `1` | `{0, 1, 2, 3}` | `[2, 3]` | Dequeue `1`, add neighbor `3` |
| 3 | `2` | `{0, 1, 2, 3, 4}` | `[3, 4]` | Dequeue `2`, add neighbor `4` |
| 4 | `3` | `{0, 1, 2, 3, 4}` | `[4]` | Dequeue `3`, no unvisited neighbors |
| 5 | `4` | `{0, 1, 2, 3, 4}` | `[]` | Dequeue `4`, no unvisited neighbors. Queue empty! |

**BFS Traversal Order:** `[0, 1, 2, 3, 4]`

---

## 5. Dual-Language Implementation

### Python 3 Implementation

```python
from collections import deque, defaultdict
from typing import List, Dict, Set

class Graph:
    def __init__(self, is_directed: bool = False):
        self.adj_list: Dict[int, List[int]] = defaultdict(list)
        self.is_directed = is_directed

    def add_edge(self, u: int, v: int) -> None:
        self.adj_list[u].append(v)
        if not self.is_directed:
            self.adj_list[v].append(u)

    def bfs(self, start: int) -> List[int]:
        # Layer-by-layer exploration using an explicit FIFO Queue
        visited: Set[int] = {start}
        queue: deque[int] = deque([start])
        traversal: List[int] = []

        while queue:
            node = queue.popleft()
            traversal.append(node)

            for neighbor in self.adj_list[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        return traversal

    def dfs(self, start: int) -> List[int]:
        # Deep exploration using recursion (implicit call stack)
        visited: Set[int] = set()
        traversal: List[int] = []

        def _dfs_helper(node: int) -> None:
            visited.add(node)
            traversal.append(node)
            for neighbor in self.adj_list[node]:
                if neighbor not in visited:
                    _dfs_helper(neighbor)

        _dfs_helper(start)
        return traversal

# Example Usage
if __name__ == "__main__":
    g = Graph(is_directed=False)
    edges = [(0, 1), (0, 2), (1, 3), (2, 4)]
    for u, v in edges:
        g.add_edge(u, v)

    print("BFS Order:", g.bfs(0))  # [0, 1, 2, 3, 4]
    print("DFS Order:", g.dfs(0))  # [0, 1, 3, 2, 4]
```

### Modern JavaScript (Node.js / ES6) Implementation

```javascript
class Graph {
  constructor(isDirected = false) {
    this.adjList = new Map();
    this.isDirected = isDirected;
  }

  addVertex(v) {
    if (!this.adjList.has(v)) {
      this.adjList.set(v, []);
    }
  }

  addEdge(u, v) {
    this.addVertex(u);
    this.addVertex(v);
    this.adjList.get(u).push(v);
    if (!this.isDirected) {
      this.adjList.get(v).push(u);
    }
  }

  bfs(start) {
    const visited = new Set([start]);
    const queue = [start];
    const order = [];

    while (queue.length > 0) {
      const node = queue.shift();
      order.push(node);

      const neighbors = this.adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return order;
  }

  dfs(start) {
    const visited = new Set();
    const order = [];

    const dfsRecursive = (node) => {
      visited.add(node);
      order.push(node);

      const neighbors = this.adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(start);
    return order;
  }
}

// Example Execution
const g = new Graph(false);
[[0, 1], [0, 2], [1, 3], [2, 4]].forEach(([u, v]) => g.addEdge(u, v));

console.log("BFS Order:", g.bfs(0)); // [0, 1, 2, 3, 4]
console.log("DFS Order:", g.dfs(0)); // [0, 1, 3, 2, 4]
```

---

## 6. Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Primary Best-Use Case |
| :--- | :--- | :--- | :--- |
| **BFS (Adj List)** | $O(V + E)$ | $O(V)$ | Finding unweighted shortest path; finding nodes within $k$ hops |
| **DFS (Adj List)** | $O(V + E)$ | $O(V)$ (recursion depth) | Topological sort; backtracking; finding cycles; flood fill |
| **BFS (Adj Matrix)**| $O(V^2)$ | $O(V)$ | Dense graphs where $E \approx V^2$ |

*Why $O(V + E)$?*
Every vertex is placed into the queue/stack at most once ($O(V)$). For each vertex, we iterate over all its incident edges ($O(E)$ total edges processed across all adjacency lists).

---

## 7. Common Pitfalls & Interview Traps

1. **Disconnected Graphs / Forest:** Calling BFS or DFS from a single starting node only visits that connected component. In problems like *Number of Connected Components* or *Number of Islands*, you must wrap BFS/DFS in an outer loop over all vertices: `for node in range(V): if node not in visited: bfs(node)`.
2. **Missing `visited` Check before Queueing:** Adding nodes to the BFS queue without marking them visited immediately allows duplicates into the queue, causing catastrophic $O(2^V)$ exponential memory spikes!
3. **Call Stack Overflow in DFS:** Deep graph traversals (e.g., $10^5$ linear nodes) will crash Python with `RecursionError`. In production or deep graphs, convert DFS to an explicit stack loop.

---

# Multiple Choice Questions

### 1. What is the primary advantage of representing a sparse graph using an Adjacency List instead of an Adjacency Matrix?
A. Adjacency lists allow $O(1)$ edge existence checks between any two arbitrary vertices
B. Adjacency lists require only $O(V + E)$ space, avoiding the quadratic $O(V^2)$ memory overhead of matrices
C. Adjacency lists automatically sort all edges in descending order of weights
D. Adjacency lists eliminate the need for a visited set during graph traversals
**Answer:** B
**Explanation:** For a sparse graph where $E \ll V^2$, an adjacency matrix wastes massive amounts of memory storing mostly zero entries ($O(V^2)$). An adjacency list stores only actual existing edges, reducing space to $O(V + E)$.

---

### 2. Why is Breadth-First Search (BFS) guaranteed to find the shortest path between two nodes in an unweighted graph?
A. It employs a greedy heuristic that estimates the Euclidean distance to the target
B. It explores vertices in strictly increasing order of their edge distance (hop count) from the start node
C. It sorts all nodes according to their degree before traversing
D. It recursively backtracks whenever a dead end is encountered
**Answer:** B
**Explanation:** BFS explores nodes radially layer by layer (distance 0, distance 1, distance 2, ...). Therefore, the first time target vertex $T$ is dequeued, the path traversed must have the minimal number of edges.

---

### 3. If a graph has 10,000 vertices and 12,000 edges, what is the space complexity of an Adjacency Matrix vs. an Adjacency List?
A. Matrix: ~100 million entries ($O(V^2)$); List: ~22,000 entries ($O(V + E)$)
B. Matrix: ~12,000 entries; List: ~100 million entries
C. Both require exactly 10,000 entries
D. Both require $O(E \log V)$ memory
**Answer:** A
**Explanation:** An adjacency matrix must allocate a full $10,000 \times 10,000 = 100,000,000$ cells ($O(V^2)$), regardless of how few edges exist. An adjacency list stores $10,000$ vertex heads plus $12,000$ edge elements ($O(V + E)$), making it thousands of times more memory-efficient.

---

### 4. When implementing BFS on a graph, at which precise moment MUST a node be marked as `visited`?
A. Only after all its neighbors have been completely processed
B. Right when the node is popped/dequeued from the front of the queue
C. Immediately when the node is discovered and pushed/enqueued into the queue
D. When the BFS traversal completely terminates
**Answer:** C
**Explanation:** Marking a node as visited immediately when pushing it into the queue prevents other adjacent nodes from enqueuing duplicate copies of that same node during the same or subsequent steps.

---

### 5. What is the time complexity of running Depth-First Search on a graph with $V$ vertices and $E$ edges represented by an adjacency list?
A. $O(V \times E)$
B. $O(V \log E)$
C. $O(V + E)$
D. $O(V^2)$
**Answer:** C
**Explanation:** In an adjacency list, DFS visits every vertex once ($O(V)$) and scans each outgoing edge in the adjacency list once in directed graphs (or twice in undirected graphs), giving an optimal linear runtime of $O(V + E)$.

---

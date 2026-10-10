# Cycle Detection & Topological Sorting (Kahn's BFS & DFS)

In graph theory, detecting cycles and ordering dependencies are two fundamental problems encountered across build systems (Make/Gradle/Webpack), package managers (npm, pip), university course prerequisites, and relational database foreign key constraints.

---

## 1. What is Topological Sorting?

A **Topological Sort** of a Directed Acyclic Graph (**DAG**) is a linear ordering of its vertices such that for every directed edge $(u \to v)$, vertex $u$ comes before vertex $v$ in the sequence.

```
Course Prerequisite Graph:
  [Intro to CS (0)] -----> [Data Structures (1)] -----> [Algorithms (3)]
         |                                                   ^
         v                                                   |
  [Discrete Math (2)] ---------------------------------------+

Valid Topological Orders:
- [0, 1, 2, 3]
- [0, 2, 1, 3]
```

> **Fundamental Theorem:** A directed graph has a valid topological sort **if and only if** it is a **DAG** (Directed Acyclic Graph). If the graph contains a cycle (e.g., $A \to B \to C \to A$), no topological order can exist because no task in the cycle can be executed first!

---

## 2. Cycle Detection Strategies

### In Undirected Graphs
1. **DFS with Parent Tracking:** During traversal, if a neighbor has already been visited and is NOT the immediate parent of the current node, an alternative path exists, proving a cycle!
2. **Disjoint Set Union (Union-Find):** For each edge $(u, v)$, if $\text{Find}(u) == \text{Find}(v)$, both nodes already belong to the same connected component; adding edge $(u, v)$ creates a cycle.

### In Directed Graphs
Cycles in directed graphs require directional tracking:
1. **3-Color DFS:**
   - **White (0):** Unvisited node.
   - **Gray (1):** Currently in the active recursion call stack (being explored).
   - **Black (2):** Fully processed and all descendants explored.
   - *Cycle Condition:* If DFS encounters an edge pointing to a **Gray** node, a **Back Edge** is found, confirming a directed cycle!
2. **Kahn's Algorithm (BFS In-Degree):** If the final topological sort output contains fewer than $V$ vertices, an unresolved cycle prevented some nodes from ever reaching an in-degree of 0.

---

## 3. Kahn's Algorithm Step-by-Step

Kahn's algorithm uses vertex **In-Degrees** (number of incoming arrows) with a FIFO queue:

```
Algorithm Kahn:
1. Compute in-degree for all V vertices.
2. Push all vertices with in-degree == 0 into queue (they have 0 dependencies).
3. While queue is not empty:
     u = queue.pop()
     append u to topological_order
     for each neighbor v of u:
         in_degree[v] -= 1
         if in_degree[v] == 0:
             queue.append(v)
4. If len(topological_order) == V: return topological_order
   Else: Graph contains a cycle (Deadlock)!
```

### Trace Table for Kahn's Algorithm
Given $V = 4$, Edges: $0 \to 1, 0 \to 2, 1 \to 3, 2 \to 3$:

| Step | Queue (In-Degree 0) | Processed Node | Edge Removed | Updated In-Degrees `[0, 1, 2, 3]` | Result Array |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Init | `[0]` | - | - | `[0, 1, 1, 2]` | `[]` |
| 1 | `[]` | `0` | $0 \to 1, 0 \to 2$ | `[0, 0, 0, 2]` (1 and 2 hit 0!) | `[0]` |
| 2 | `[1, 2]` | `1` | $1 \to 3$ | `[0, 0, 0, 1]` | `[0, 1]` |
| 3 | `[2]` | `2` | $2 \to 3$ | `[0, 0, 0, 0]` (3 hits 0!) | `[0, 1, 2]` |
| 4 | `[3]` | `3` | None | `[0, 0, 0, 0]` | `[0, 1, 2, 3]` |

All 4 nodes processed $\implies$ Valid DAG order: `[0, 1, 2, 3]`.

---

## 4. Dual-Language Implementation

### Python 3: Kahn's Algorithm & DFS 3-Coloring

```python
from collections import deque, defaultdict
from typing import List, Optional, Dict

class DirectedGraph:
    def __init__(self, num_nodes: int):
        self.num_nodes = num_nodes
        self.adj: Dict[int, List[int]] = defaultdict(list)
        self.in_degree: List[int] = [0] * num_nodes

    def add_edge(self, u: int, v: int) -> None:
        # Add directed edge u -> v (u precedes v)
        self.adj[u].append(v)
        self.in_degree[v] += 1

    def kahns_topological_sort(self) -> Optional[List[int]]:
        # Kahn's BFS Algorithm: Returns topological ordering, or None if a cycle is detected
        queue = deque([i for i in range(self.num_nodes) if self.in_degree[i] == 0])
        topo_order: List[int] = []

        while queue:
            node = queue.popleft()
            topo_order.append(node)

            for neighbor in self.adj[node]:
                self.in_degree[neighbor] -= 1
                if self.in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # If topo_order contains all vertices, no cycle exists
        if len(topo_order) == self.num_nodes:
            return topo_order
        return None  # Cycle detected!

    def has_cycle_dfs(self) -> bool:
        # 3-Color DFS Cycle Detection:
        # 0: White (Unvisited), 1: Gray (Visiting/Active Stack), 2: Black (Done)
        color = [0] * self.num_nodes

        def dfs(u: int) -> bool:
            color[u] = 1  # Mark Gray (entering call stack)
            for v in self.adj[u]:
                if color[v] == 1:
                    return True  # Found back-edge to active ancestor!
                if color[v] == 0:
                    if dfs(v):
                        return True
            color[u] = 2  # Mark Black (exiting call stack)
            return False

        for node in range(self.num_nodes):
            if color[node] == 0:
                if dfs(node):
                    return True
        return False

# Example Execution
if __name__ == "__main__":
    dag = DirectedGraph(4)
    dag.add_edge(0, 1)
    dag.add_edge(0, 2)
    dag.add_edge(1, 3)
    dag.add_edge(2, 3)

    print("Kahn's Topo Sort:", dag.kahns_topological_sort())  # [0, 1, 2, 3]
    print("Has Cycle?:", dag.has_cycle_dfs())                 # False
```

### Modern JavaScript (Node.js) Implementation

```javascript
class DirectedGraph {
  constructor(numNodes) {
    this.numNodes = numNodes;
    this.adj = new Map();
    this.inDegree = new Array(numNodes).fill(0);
    for (let i = 0; i < numNodes; i++) {
      this.adj.set(i, []);
    }
  }

  addEdge(u, v) {
    this.adj.get(u).push(v);
    this.inDegree[v]++;
  }

  kahnsTopologicalSort() {
    const queue = [];
    for (let i = 0; i < this.numNodes; i++) {
      if (this.inDegree[i] === 0) queue.push(i);
    }

    const topoOrder = [];
    let head = 0; // O(1) dequeue pointer

    while (head < queue.length) {
      const u = queue[head++];
      topoOrder.push(u);

      const neighbors = this.adj.get(u) || [];
      for (const v of neighbors) {
        this.inDegree[v]--;
        if (this.inDegree[v] === 0) {
          queue.push(v);
        }
      }
    }

    return topoOrder.length === this.numNodes ? topoOrder : null;
  }
}

// Example Execution
const g = new DirectedGraph(4);
g.addEdge(0, 1);
g.addEdge(0, 2);
g.addEdge(1, 3);
g.addEdge(2, 3);

console.log("Kahn's Ordering:", g.kahnsTopologicalSort()); // [0, 1, 2, 3]
```

---

## 5. Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Best Feature |
| :--- | :--- | :--- | :--- |
| **Kahn's Algorithm (BFS)** | $O(V + E)$ | $O(V)$ | Simultaneously outputs valid ordering AND detects cycles |
| **DFS 3-Coloring** | $O(V + E)$ | $O(V)$ | Intuitive recursive cycle verification via back-edges |
| **Undirected Union-Find** | $O(E \cdot \alpha(V))$ | $O(V)$ | Ultra-fast dynamic cycle detection in undirected graphs |

---

## 6. Real-World Applications & Edge Cases

1. **Course Schedule (LeetCode 207 / 210):** Direct mapping to Kahn's algorithm or 3-color DFS.
2. **Build Systems (Webpack, Make, Vite):** Compilers parse import statements into a DAG. Circular imports (e.g., Module A imports Module B which imports Module A) trigger build cycle errors.
3. **Spreadsheet Formula Calculation:** Cells with dependent formulas (e.g., `A1 = B1 + C1`) require topological evaluation. Circular references (`A1 = B1 + 1` and `B1 = A1 + 1`) are flagged as illegal cycles.

---

# Multiple Choice Questions

### 1. Which type of graph can produce at least one valid topological sort?
A. Any connected undirected graph
B. A Directed Acyclic Graph (DAG)
C. Any graph with an Eulerian circuit
D. A directed graph containing at least one self-loop
**Answer:** B
**Explanation:** A topological sort requires that for every directed edge $u \to v$, node $u$ appears before $v$. If a cycle exists, dependencies are circular, making a linear ordering impossible. Hence, only Directed Acyclic Graphs (DAGs) admit a topological sort.

---

### 2. In Kahn's Algorithm, which vertices are initially inserted into the queue?
A. Vertices with the maximum out-degree
B. Vertices with an in-degree of 0 (no incoming dependencies)
C. The root vertex with ID 0 regardless of edges
D. Vertices with an out-degree of 0
**Answer:** B
**Explanation:** Kahn's algorithm starts with vertices that have zero incoming dependencies (in-degree == 0). These tasks can be performed immediately without waiting for any prerequisite tasks.

---

### 3. In the 3-color DFS cycle detection algorithm for directed graphs, what does encountering a node marked "Gray" (visiting) signify?
A. The node has already been completely explored and has no cycles
B. The node is an ancestor currently residing in the active recursion call stack, indicating a back-edge and therefore a cycle
C. The node is unreachable from the current starting vertex
D. The graph is bipartite
**Answer:** B
**Explanation:** Gray represents nodes whose DFS traversal has started but not finished (they are in the current recursion call stack). Encountering a Gray node means an edge points backward to an active ancestor, which forms a directed cycle.

---

### 4. What is the time complexity of Kahn's topological sort on a graph with $V$ vertices and $E$ edges?
A. $O(V \times E)$
B. $O(V \log V)$
C. $O(V + E)$
D. $O(V^2 \log E)$
**Answer:** C
**Explanation:** Initializing in-degrees takes $O(V + E)$. Each vertex is enqueued and dequeued once ($O(V)$), and each edge is decremented exactly once ($O(E)$), resulting in an optimal linear time complexity of $O(V + E)$.

---

### 5. If Kahn's algorithm terminates and the length of the topological order array is less than the total number of vertices $V$, what does this prove?
A. The graph has disconnected components with no edges
B. The graph contains at least one directed cycle preventing some nodes from ever reaching an in-degree of 0
C. The graph has multiple valid topological sorts
D. The algorithm ran out of heap memory
**Answer:** B
**Explanation:** Nodes participating in a directed cycle (or dependent on one) will never have their in-degrees decremented to 0. Consequently, they are never added to the queue, causing the final ordering list to contain fewer than $V$ nodes.

---

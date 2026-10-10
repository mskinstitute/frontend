# Shortest Paths: Dijkstra's Algorithm with Min-Heap & BFS for Unweighted

Finding the shortest path between nodes in a network is one of the foundational problems of computer science. It powers GPS navigation systems (Google Maps, Apple Maps), internet packet routing (OSPF, IS-IS protocols), and robotic motion planning.

---

## 1. Shortest Path Algorithms Overview

The choice of algorithm depends on edge weights:

| Graph Characteristic | Optimal Algorithm | Time Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Unweighted Graph** (all weights = 1) | **BFS** | $O(V + E)$ | Fastest; queue guarantees minimal hops |
| **Non-Negative Weights** ($w \ge 0$) | **Dijkstra's Algorithm** | $O((V + E) \log V)$ | Greedy; uses Min-Priority Queue |
| **Negative Weights Allowed** | **Bellman-Ford Algorithm** | $O(V \times E)$ | Slower; can detect negative weight cycles |
| **All-Pairs Shortest Path** | **Floyd-Warshall** | $O(V^3)$ | Dynamic programming matrix approach |

> **Critical Constraint:** Dijkstra's algorithm **CANNOT** handle graphs with negative edge weights! A negative weight violates the greedy assumption that once a node is finalized from the priority queue, its shortest distance cannot be improved.

---

## 2. Dijkstra's Algorithm Mechanics

Dijkstra uses a **Greedy Strategy** with a **Min-Heap (Priority Queue)**:

```
Dijkstra Core Mechanism:
1. Set dist[start] = 0; dist[v] = infinity for all other vertices v.
2. Push (0, start) into Min-Heap (storing (distance, node)).
3. While Min-Heap is not empty:
     (current_dist, u) = heap.pop()
     if current_dist > dist[u]:
         continue  # Outdated duplicate entry in heap; skip!
     for each neighbor (v, weight) of u:
         new_dist = dist[u] + weight
         if new_dist < dist[v]:
             dist[v] = new_dist
             heap.push((new_dist, v))
             parent[v] = u  # To reconstruct the path
```

```
Dijkstra Triangle Relaxation:
         (u)
        /   \
       /     \
dist[u]       \ weight(u, v)
     /         \
   (Start)----->(v)
        dist[v]

Relaxation:
If dist[u] + weight(u, v) < dist[v]:
   dist[v] = dist[u] + weight(u, v)
```

---

## 3. Step-by-Step Trace Table

Consider a weighted directed graph with 4 nodes:
- $(0 \to 1, w=4)$
- $(0 \to 2, w=1)$
- $(2 \to 1, w=2)$
- $(1 \to 3, w=1)$
- $(2 \to 3, w=5)$

Find shortest path from Node `0` to all nodes:

| Step | Pop `(dist, node)` | Action / Edge Relaxations | Min-Heap Contents | Distances `[0, 1, 2, 3]` |
| :--- | :--- | :--- | :--- | :--- |
| Init | - | Start node `0` | `[(0, 0)]` | `[0, inf, inf, inf]` |
| 1 | `(0, 0)` | Relax $0 \to 1$ ($0+4=4$), $0 \to 2$ ($0+1=1$) | `[(1, 2), (4, 1)]` | `[0, 4, 1, inf]` |
| 2 | `(1, 2)` | Relax $2 \to 1$ ($1+2=3 < 4$! Better!), $2 \to 3$ ($1+5=6$) | `[(3, 1), (4, 1), (6, 3)]` | `[0, 3, 1, 6]` |
| 3 | `(3, 1)` | Relax $1 \to 3$ ($3+1=4 < 6$! Better!) | `[(4, 1), (4, 3), (6, 3)]` | `[0, 3, 1, 4]` |
| 4 | `(4, 1)` | Skipped! $4 > \text{dist}[1] (3)$ (Stale entry) | `[(4, 3), (6, 3)]` | `[0, 3, 1, 4]` |
| 5 | `(4, 3)` | Finalized node `3`. No outgoing edges. | `[(6, 3)]` | `[0, 3, 1, 4]` |
| 6 | `(6, 3)` | Skipped! $6 > \text{dist}[3] (4)$ | `[]` | `[0, 3, 1, 4]` |

**Final Shortest Distances:** `dist[0]=0, dist[1]=3, dist[2]=1, dist[3]=4`.
Shortest path to `3`: $0 \to 2 \to 1 \to 3$ with total cost $1 + 2 + 1 = 4$.

---

## 4. Dual-Language Implementation

### Python 3 Implementation

```python
import heapq
from typing import List, Tuple, Dict

def dijkstra(num_nodes: int, edges: List[Tuple[int, int, int]], start: int) -> Tuple[List[float], List[int]]:
    # edges: list of tuples (u, v, weight)
    # Returns (distances, parent_array)
    adj: Dict[int, List[Tuple[int, int]]] = {i: [] for i in range(num_nodes)}
    for u, v, w in edges:
        adj[u].append((v, w))

    distances = [float('inf')] * num_nodes
    parent = [-1] * num_nodes
    distances[start] = 0

    # Min-Heap stores (distance_from_start, current_node)
    min_heap: List[Tuple[float, int]] = [(0, start)]

    while min_heap:
        curr_dist, u = heapq.heappop(min_heap)

        # Skip stale entries
        if curr_dist > distances[u]:
            continue

        for v, weight in adj[u]:
            new_dist = curr_dist + weight
            if new_dist < distances[v]:
                distances[v] = new_dist
                parent[v] = u
                heapq.heappush(min_heap, (new_dist, v))

    return distances, parent

def reconstruct_path(parent: List[int], target: int) -> List[int]:
    path = []
    curr = target
    while curr != -1:
        path.append(curr)
        curr = parent[curr]
    return path[::-1]

# Example Test
if __name__ == "__main__":
    edges = [
        (0, 1, 4), (0, 2, 1),
        (2, 1, 2), (1, 3, 1),
        (2, 3, 5)
    ]
    dists, parents = dijkstra(4, edges, 0)
    print("Shortest Distances:", dists)              # [0, 3, 1, 4]
    print("Path to Node 3:", reconstruct_path(parents, 3)) # [0, 2, 1, 3]
```

### Modern JavaScript (Node.js) Implementation

```javascript
class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(element) {
    this.heap.push(element);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(idx) {
    const el = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (el.cost >= parent.cost) break;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
    this.heap[idx] = el;
  }

  _sinkDown(idx) {
    const length = this.heap.length;
    const el = this.heap[idx];
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let swap = null;

      if (left < length && this.heap[left].cost < el.cost) {
        swap = left;
      }
      if (
        right < length &&
        (swap === null ? this.heap[right].cost < el.cost : this.heap[right].cost < this.heap[left].cost)
      ) {
        swap = right;
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      idx = swap;
    }
    this.heap[idx] = el;
  }
}

function dijkstra(numNodes, edges, start) {
  const adj = Array.from({ length: numNodes }, () => []);
  edges.forEach(([u, v, w]) => adj[u].push({ to: v, weight: w }));

  const distances = new Array(numNodes).fill(Infinity);
  distances[start] = 0;

  const pq = new MinPriorityQueue();
  pq.push({ node: start, cost: 0 });

  while (!pq.isEmpty()) {
    const { node: u, cost: currDist } = pq.pop();

    if (currDist > distances[u]) continue;

    for (const { to: v, weight } of adj[u]) {
      const newDist = currDist + weight;
      if (newDist < distances[v]) {
        distances[v] = newDist;
        pq.push({ node: v, cost: newDist });
      }
    }
  }

  return distances;
}

// Example Test
const edges = [
  [0, 1, 4], [0, 2, 1],
  [2, 1, 2], [1, 3, 1],
  [2, 3, 5]
];
console.log("Dijkstra Distances:", dijkstra(4, edges, 0)); // [0, 3, 1, 4]
```

---

## 5. Complexity & Optimality Analysis

- **Time Complexity:** $O((V + E) \log V)$
  - Each vertex is pushed to the heap at least once, and edge relaxations trigger heap pushes ($E$ pushes total).
  - Heap insertion/extraction takes $O(\log V)$.
  - Total time: $O(E \log V + V \log V) = O((V + E) \log V)$.
- **Space Complexity:** $O(V + E)$
  - Distance array: $O(V)$.
  - Adjacency list: $O(V + E)$.
  - Heap entries: $O(E)$ worst case.

---

# Multiple Choice Questions

### 1. Why does Dijkstra's algorithm fail when applied to graphs containing negative edge weights?
A. Because a Min-Heap cannot store negative numbers
B. Because the greedy assumption that a finalized vertex already has its optimal minimal distance is invalidated by a subsequent negative edge
C. Because negative weights create unavoidable memory overflows in adjacency lists
D. Because directed graphs do not support negative weights
**Answer:** B
**Explanation:** Dijkstra operates greedily by finalizing the node with the current minimum tentative distance. If a negative edge appears later, it could provide a shorter path to an already finalized node, invalidating Dijkstra's greedy invariant.

---

### 2. What is the time complexity of Dijkstra's algorithm implemented with a binary min-heap for a graph with $V$ vertices and $E$ edges?
A. $O(V \times E)$
B. $O(V^2)$
C. $O((V + E) \log V)$
D. $O(V + E)$
**Answer:** C
**Explanation:** Extracting the minimum element takes $O(\log V)$ done at most $V$ times, and each edge relaxation pushes a new distance into the binary heap taking $O(\log V)$ up to $E$ times, yielding $O((V + E) \log V)$.

---

### 3. If all edge weights in a directed weighted graph are equal to 1, which algorithm should be preferred over Dijkstra for finding shortest paths?
A. Bellman-Ford
B. Floyd-Warshall
C. Standard Breadth-First Search (BFS)
D. Depth-First Search (DFS)
**Answer:** C
**Explanation:** In an unweighted graph (or uniform weights = 1), standard BFS finds the shortest path in linear $O(V + E)$ time using a simple FIFO queue, avoiding the logarithmic $O(\log V)$ priority queue overhead of Dijkstra's algorithm.

---

### 4. What is the purpose of the condition `if curr_dist > distances[u]: continue` in Dijkstra's heap loop?
A. To detect directed cycles in the graph
B. To skip stale/outdated priority queue entries that were superseded by shorter paths discovered earlier
C. To prevent array out-of-bounds errors
D. To sort the vertices in descending order
**Answer:** B
**Explanation:** When a shorter path to a node $u$ is discovered, a new `(new_dist, u)` tuple is pushed into the heap without deleting the previous higher-cost tuple. The condition checks if the popped tuple is already obsolete, saving unnecessary redundant neighbor scans.

---

### 5. Which data structure allows the theoretical optimal time complexity of $O(E + V \log V)$ for Dijkstra's algorithm?
A. Doubly Linked List
B. Red-Black Tree
C. Fibonacci Heap
D. Monotonic Stack
**Answer:** C
**Explanation:** A Fibonacci Heap supports the `decrease-key` operation in amortized $O(1)$ time, reducing the total edge relaxation cost to $O(E)$ and yielding an overall theoretical running time of $O(E + V \log V)$.

---

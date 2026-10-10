# Hash Tables: Hash Functions, Separate Chaining & Open Addressing

The **Hash Table (Hash Map)** is arguably the single most important data structure in real-world software engineering. By translating arbitrary keys (like strings, objects, or URLs) into array indices using a **Hash Function**, hash tables achieve average **$O(1)$ constant-time insertion, deletion, and lookup**.

---

## 1. Real-World Analogy: The Coat Check / Valet Parking

Imagine parking your car with a luxury hotel valet:
- You don't search all 5,000 cars in the garage when you return.
- You hand the valet your unique numbered ticket (`Ticket #342`).
- The ticket number points directly to Locker `342` where your car keys are hanging!
- The **Hash Function** is the valet who maps your license plate to ticket number `342`.

---

## 2. Anatomy of a Hash Table

1. **Key:** The identifier you want to store (e.g. `'username'`).
2. **Hash Function:** A deterministic algorithm that converts the key into a large integer (hash code), which is then mapped to an array bucket via `hash(key) % table_size`.
3. **Bucket Array:** The internal array where key-value pairs are stored.

---

## 3. The Collision Problem & Resolution Strategies

By the **Pigeonhole Principle**, because there are infinitely more possible string keys than available array buckets, two different keys will eventually hash to the **exact same bucket index**. This is called a **Collision**.

```text
hash("John Smith") % 10 = Bucket 2
hash("Sandra Dee")  % 10 = Bucket 2  <-- COLLISION!
```

### Strategy 1: Separate Chaining (Linked Lists / Trees)
Each bucket in the array holds a linked list (or balanced red-black tree in Java 8+). When a collision occurs, the new key-value pair is appended to that bucket's linked list:
```text
Bucket 2: [John Smith: 555-1234] -> [Sandra Dee: 555-8765] -> NULL
```

### Strategy 2: Open Addressing (Linear Probing)
All entries are stored directly in the bucket array itself. If `bucket[index]` is already occupied:
- **Linear Probing:** Step forward sequentially: check `index + 1`, `index + 2`, `index + 3` until an empty cell is found.
- **Quadratic Probing:** Jump by squares: $i + 1^2, i + 2^2, i + 3^2 \dots$
- **Double Hashing:** Use a secondary hash function to calculate jump intervals.

---

## 4. Multi-Language Implementations: Custom Hash Map with Separate Chaining

### Python 3 Implementation:
```python
class HashNode:
    def __init__(self, key: str, value):
        self.key = key
        self.value = value
        self.next: 'HashNode' = None

class CustomHashMap:
    def __init__(self, capacity: int = 16):
        self.capacity = capacity
        self.buckets: list[HashNode] = [None] * capacity
        self.size = 0

    def _hash(self, key: str) -> int:
        # Polynomial rolling hash function
        hash_code = 0
        for char in key:
            hash_code = (hash_code * 31 + ord(char)) % self.capacity
        return hash_code

    def put(self, key: str, value) -> None:
        index = self._hash(key)
        head = self.buckets[index]

        # Check if key already exists in bucket -> update value
        curr = head
        while curr:
            if curr.key == key:
                curr.value = value
                return
            curr = curr.next

        # Insert new node at head of chain
        new_node = HashNode(key, value)
        new_node.next = self.buckets[index]
        self.buckets[index] = new_node
        self.size += 1

    def get(self, key: str):
        index = self._hash(key)
        curr = self.buckets[index]
        while curr:
            if curr.key == key:
                return curr.value
            curr = curr.next
        return None
```

### Modern JavaScript / TypeScript:
```typescript
class EntryNode<K, V> {
  key: K;
  value: V;
  next: EntryNode<K, V> | null = null;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class SimpleHashMap<K extends string, V> {
  private capacity: number;
  private buckets: (EntryNode<K, V> | null)[];

  constructor(capacity: number = 32) {
    this.capacity = capacity;
    this.buckets = new Array(capacity).fill(null);
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.capacity;
    }
    return hash;
  }

  public set(key: K, value: V): void {
    const idx = this.hash(key);
    let curr = this.buckets[idx];

    while (curr) {
      if (curr.key === key) {
        curr.value = value;
        return;
      }
      curr = curr.next;
    }

    const newNode = new EntryNode(key, value);
    newNode.next = this.buckets[idx];
    this.buckets[idx] = newNode;
  }

  public get(key: K): V | undefined {
    const idx = this.hash(key);
    let curr = this.buckets[idx];
    while (curr) {
      if (curr.key === key) return curr.value;
      curr = curr.next;
    }
    return undefined;
  }
}
```

---

## 5. Load Factor & Dynamic Resizing

The **Load Factor ($\alpha$)** measures how full the hash table is:
$$\alpha = \frac{\text{Number of Stored Entries } (n)}{\text{Total Number of Buckets } (k)}$$
- When $\alpha > 0.75$, the probability of collisions skyrockets.
- Hash tables automatically **rehash and double their bucket capacity**, redistributing all elements into the new larger array to maintain average **$O(1)$ constant time**.

---

# Multiple Choice Questions

### 1. What is the average time complexity for searching, inserting, and deleting elements in a well-distributed Hash Table?
A. $O(n^2)$
B. $O(\log n)$
C. $O(1)$
D. $O(n \log n)$
**Answer:** C
**Explanation:** Given a uniform hash function and appropriate load factor, hash table lookups, insertions, and deletions execute in $O(1)$ average time.
---

### 2. What is a "Hash Collision"?
A. Two computers sending data over a Wi-Fi router simultaneously.
B. When a hash function maps two distinct, different keys to the exact same array bucket index.
C. A database corruption error.
D. When an array runs out of memory.
**Answer:** B
**Explanation:** A hash collision occurs when different input keys generate the same hash code or bucket index.
---

### 3. How does the "Separate Chaining" technique handle hash collisions?
A. It throws an error and deletes the conflicting keys.
B. It stores all colliding key-value pairs in a linked list (or balanced tree) at that specific bucket index.
C. It moves the data to the hard disk.
D. It overwrites the older value unconditionally.
**Answer:** B
**Explanation:** Separate chaining maintains a secondary data structure (such as a linked list) at each bucket to hold all collided entries.
---

### 4. What happens to the worst-case time complexity of a Hash Table if an atrocious hash function maps every single key into the exact same bucket index 0?
A. It remains $O(1)$.
B. It degrades to $O(n)$ linear time because lookup requires traversing a single linked list containing all $n$ items.
C. It becomes $O(\log n)$.
D. It crashes the computer processor.
**Answer:** B
**Explanation:** If all elements collide into one bucket, the hash table degenerates into a linear linked list, requiring $O(n)$ time to search.
---

### 5. What is the standard "Load Factor" threshold at which hash tables (like Java HashMap) trigger a resize and rehash?
A. 0.1
B. 0.75
C. 5.0
D. 100.0
**Answer:** B
**Explanation:** A load factor of 0.75 offers an optimal trade-off between memory overhead and collision avoidance before triggering a capacity doubling.
---

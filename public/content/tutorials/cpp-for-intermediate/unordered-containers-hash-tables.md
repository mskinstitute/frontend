---
id: unordered-containers-hash-tables
slug: unordered-containers-hash-tables
course: cpp-for-intermediate
chapter: 4: Standard Template Library (STL) - Containers
topic: "Unordered Containers: std::unordered_map and std::unordered_set (Hash Tables)"
difficulty: Intermediate
readingTime: 13
order: 20
keywords: ["std::unordered_map","std::unordered_set","hash table","o1 complexity","hash function"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Unordered Containers: std::unordered_map and Hash Tables

## Introduction
When ordered sorting is not required, **`std::unordered_map`** and **`std::unordered_set`** offer blazing-fast **average O(1) constant-time lookup** through hash table indexing.

---

## 🆚 Ordered (`std::map`) vs Unordered (`std::unordered_map`)

| Metric | `std::map` | `std::unordered_map` |
|---|---|---|
| Underlying Data Structure | Red-Black Tree (Self-balancing BST) | **Hash Table** with buckets |
| Lookup / Insertion Time | **O(log N)** strictly guaranteed | **O(1) Average** (O(N) worst case) |
| Order of Traversal | **Strictly Sorted** by Key | **Unordered / Arbitrary** |
| Key Requirements | Must support `<` (operator less) | Must support `std::hash<Key>` and `==` |

---

## 💻 `std::unordered_map` in Action

```cpp
#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, std::string> studentLocations;

    studentLocations["Aarav"] = "Shikohabad";
    studentLocations["Neha"] = "Firozabad";
    studentLocations["Vikram"] = "Agra";
    studentLocations["Pooja"] = "Mainpuri";

    // O(1) Instant Hash Lookup:
    std::string query = "Vikram";
    if (studentLocations.contains(query)) { // C++20 .contains() method
        std::cout << query << " lives in " << studentLocations[query] << "\n";
    }

    // Inspecting Hash Table Bucket Metrics:
    std::cout << "Bucket count: " << studentLocations.bucket_count() << "\n";
    std::cout << "Load factor:  " << studentLocations.load_factor() << "\n";

    return 0;
}
```

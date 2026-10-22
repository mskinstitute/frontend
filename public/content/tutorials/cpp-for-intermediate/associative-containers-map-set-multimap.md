---
id: associative-containers-map-set-multimap
slug: associative-containers-map-set-multimap
course: cpp-for-intermediate
chapter: 4: Standard Template Library (STL) - Containers
topic: "Associative Containers: std::set, std::multiset, std::map, and std::multimap"
difficulty: Intermediate
readingTime: 14
order: 19
keywords: ["std::map","std::set","associative containers","red black tree","key value pairs","log n search"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🌲 Associative Containers: std::map, std::set, and Multimaps

## Introduction
Associative containers store elements ordered by **keys**. Under the hood, they are implemented as self-balancing binary search trees (specifically **Red-Black Trees**), guaranteeing strict **O(log N)** search, insertion, and deletion complexity.

---

## 🗺️ `std::map<Key, Value>` (Key-Value Dictionary)

Keys in an `std::map` are unique and maintained in ascending sorted order:

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    // Map Course Code -> Course Fee
    std::map<std::string, double> courseFees;

    // Insertion via subscript operator []
    courseFees["C-PROG"] = 2999.0;
    courseFees["CPP-MODERN"] = 3499.0;
    courseFees["JAVA-DEV"] = 3499.0;

    // Traversal (Iterates automatically in sorted alphabetical order of Keys!)
    std::cout << "=== MSK Institute Course Fees (Sorted) ===\n";
    for (const auto& [code, fee] : courseFees) { // C++17 Structured Binding
        std::cout << code << " : ₹" << fee << "\n";
    }

    // Checking existence with .find()
    auto it = courseFees.find("CPP-MODERN");
    if (it != courseFees.end()) {
        std::cout << "Found CPP-MODERN: Fee is ₹" << it->second << "\n";
    }

    return 0;
}
```

---

## 🎯 `std::set<Key>` (Unique Ordered Elements)

`std::set` stores unique keys with duplicate rejection:

```cpp
#include <iostream>
#include <set>

int main() {
    std::set<int> uniqueRollNumbers = {105, 101, 109, 101, 103, 105};

    std::cout << "Unique Sorted Roll Numbers: ";
    for (int roll : uniqueRollNumbers) {
        std::cout << roll << " "; // Output: 101 103 105 109 (Duplicates eliminated!)
    }
    std::cout << "\n";
    return 0;
}
```

---

## 🔄 Multimaps & Multisets
- **`std::multimap`**: Permits multiple values mapped to the same key.
- **`std::multiset`**: Permits duplicate keys while preserving sorted order.

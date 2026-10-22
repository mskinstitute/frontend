---
id: std-deque-and-std-list
slug: std-deque-and-std-list
course: cpp-for-intermediate
chapter: 4: Standard Template Library (STL) - Containers
topic: "std::deque and std::list (Doubly-Linked Sequence)"
difficulty: Intermediate
readingTime: 13
order: 18
keywords: ["std::deque","std::list","doubly linked list","double ended queue","stl sequence"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⛓️ std::deque and std::list (Sequence Containers)

## Introduction
While `std::vector` is optimal for end-insertions and random access, inserting or deleting elements at the beginning or middle of a vector requires shifting contiguous memory. For these workloads, C++ provides **`std::deque`** and **`std::list`**.

---

## 🚄 `std::deque` (Double-Ended Queue)

`std::deque` allocates data across a collection of fixed-size chunks indexed by a central map. It guarantees **O(1) amortized insertion and removal at BOTH the beginning and the end**.

```cpp
#include <iostream>
#include <deque>

int main() {
    std::deque<int> dq;
    dq.push_back(20);
    dq.push_back(30);
    dq.push_front(10); // O(1) instant push to front!
    dq.push_front(5);

    std::cout << "Deque contents: ";
    for (int num : dq) {
        std::cout << num << " "; // 5 10 20 30
    }
    std::cout << "\n";
    return 0;
}
```

---

## 🔗 `std::list` (Doubly-Linked List)

`std::list` stores nodes scattered throughout heap memory, where each node contains pointers to the previous and next elements.

```cpp
#include <iostream>
#include <list>

int main() {
    std::list<std::string> taskQueue = {"Review Code", "Deploy Build", "Run Tests"};

    // Insert into middle in O(1) time once iterator is positioned:
    auto it = taskQueue.begin();
    ++it; // Points to "Deploy Build"
    taskQueue.insert(it, "Run Database Migrations");

    for (const auto& task : taskQueue) {
        std::cout << "-> " << task << "\n";
    }
    return 0;
}
```

---

## 📊 Selection Guide

| Requirement | Preferred Container | Reason |
|---|---|---|
| Default general use | **`std::vector`** | Best CPU cache locality; fastest traversal |
| Frequent pushes to front & back | **`std::deque`** | O(1) on both ends without shifting |
| Splicing & middle insertions | **`std::list`** | Node pointers rewired in O(1); never invalidates iterators |

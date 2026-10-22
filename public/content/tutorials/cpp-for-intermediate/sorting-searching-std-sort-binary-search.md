---
id: sorting-searching-std-sort-binary-search
slug: sorting-searching-std-sort-binary-search
course: cpp-for-intermediate
chapter: 5: STL Iterators & Modern Algorithms
topic: "Sorting and Searching: std::sort, std::stable_sort, std::binary_search"
difficulty: Intermediate
readingTime: 13
order: 22
keywords: ["std::sort","std::stable_sort","std::binary_search","lower_bound","upper_bound","stl algorithms"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Sorting and Searching: std::sort and std::binary_search

## Introduction
C++ provides high-performance algorithms in **`<algorithm>`**. Under the hood, **`std::sort`** implements **Introsort** (a hybrid of Quicksort, Heapsort, and Insertion Sort) running in optimal **O(N log N)** time.

---

## 📊 Sorting Vectors

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> scores = {78, 92, 45, 88, 63, 99, 52};

    // 1. Ascending Sort:
    std::sort(scores.begin(), scores.end());

    std::cout << "Sorted Ascending: ";
    for (int s : scores) std::cout << s << " ";
    std::cout << "\n";

    // 2. Descending Sort using std::greater<int>():
    std::sort(scores.begin(), scores.end(), std::greater<int>());

    std::cout << "Sorted Descending: ";
    for (int s : scores) std::cout << s << " ";
    std::cout << "\n";

    return 0;
}
```

---

## 🔎 Binary Search in O(log N) Time

**Prerequisite**: Data must be sorted *before* calling binary search algorithms!

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> rollNumbers = {101, 105, 108, 114, 120, 135};

    int target = 114;

    // std::binary_search returns bool
    if (std::binary_search(rollNumbers.begin(), rollNumbers.end(), target)) {
        std::cout << "Roll #" << target << " is enrolled in this batch!\n";
    }

    // std::lower_bound returns an iterator to the first element >= target
    auto it = std::lower_bound(rollNumbers.begin(), rollNumbers.end(), target);
    if (it != rollNumbers.end()) {
        std::cout << "Found at index: " << std::distance(rollNumbers.begin(), it) << "\n";
    }

    return 0;
}
```

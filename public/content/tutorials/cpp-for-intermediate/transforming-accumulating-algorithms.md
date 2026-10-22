---
id: transforming-accumulating-algorithms
slug: transforming-accumulating-algorithms
course: cpp-for-intermediate
chapter: 5: STL Iterators & Modern Algorithms
topic: "Transforming and Accumulating: std::transform, std::accumulate, std::count_if"
difficulty: Intermediate
readingTime: 13
order: 23
keywords: ["std::transform","std::accumulate","std::count_if","numeric algorithms","functional programming"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧪 Transforming and Accumulating: std::transform and std::accumulate

## Introduction
Modern C++ encourages declarative programming. Rather than writing manual `for` loops with accumulator variables, STL algorithms from **`<algorithm>`** and **`<numeric>`** perform batch transformations clearly and safely.

---

## ➕ Computing Aggregates with `std::accumulate` (`<numeric>`)

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<double> feesCollected = {2999.0, 3499.0, 4999.0, 3499.0};

    // Syntax: std::accumulate(start, end, initial_sum)
    double totalRevenue = std::accumulate(feesCollected.begin(), feesCollected.end(), 0.0);

    std::cout << "Total Revenue Collected: ₹" << totalRevenue << "\n";
    std::cout << "Average Revenue: ₹" << (totalRevenue / feesCollected.size()) << "\n";

    return 0;
}
```

---

## 🔀 Mapping Data with `std::transform`

`std::transform` applies an operation to every element, writing the output to a destination:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> rawMarks = {45, 52, 60, 75};
    std::vector<int> curvedMarks(rawMarks.size());

    // Add 5 grace marks to each student:
    std::transform(rawMarks.begin(), rawMarks.end(), curvedMarks.begin(), [](int score) {
        return score + 5;
    });

    std::cout << "Curved Scores: ";
    for (int score : curvedMarks) std::cout << score << " ";
    std::cout << "\n";

    // Count how many passed (score >= 50):
    int passCount = std::count_if(curvedMarks.begin(), curvedMarks.end(), [](int s) {
        return s >= 50;
    });
    std::cout << "Total Passed: " << passCount << "/" << curvedMarks.size() << "\n";

    return 0;
}
```

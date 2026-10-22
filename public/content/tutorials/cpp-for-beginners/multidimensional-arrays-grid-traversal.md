---
id: multidimensional-arrays-grid-traversal
slug: multidimensional-arrays-grid-traversal
course: cpp-for-beginners
chapter: 7: Modern std::string & std::array
topic: "Multi-Dimensional Arrays and Grid Traversal"
difficulty: Beginner
readingTime: 12
order: 32
keywords: ["2d arrays","matrix traversal","grid iteration","nested std::array"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔲 Multi-Dimensional Arrays and Grid Traversal

## Introduction
Two-dimensional arrays represent tabular data: game boards (chess, tic-tac-toe), spreadsheet grids, and matrices in computer graphics.

---

## 📊 Matrix Representation in Modern C++

```cpp
#include <iostream>
#include <array>
#include <iomanip>

int main() {
    // 3 rows, 3 columns matrix
    constexpr std::size_t ROWS = 3;
    constexpr std::size_t COLS = 3;

    std::array<std::array<int, COLS>, ROWS> matrix = {{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    }};

    std::cout << "=== 2D Matrix Traversal ===\n";
    for (std::size_t r = 0; r < ROWS; ++r) {
        for (std::size_t c = 0; c < COLS; ++c) {
            std::cout << std::setw(3) << matrix[r][c] << " ";
        }
        std::cout << "\n";
    }

    // Calculating Main Diagonal Sum (Trace)
    int diagonalSum = 0;
    for (std::size_t i = 0; i < ROWS; ++i) {
        diagonalSum += matrix[i][i];
    }
    std::cout << "Diagonal Sum (1 + 5 + 9): " << diagonalSum << "\n";

    return 0;
}
```

---

## ⚡ Cache Locality & Row-Major Order
C++ stores multi-dimensional arrays in **row-major order** in memory:
```text
[Row 0, Col 0] [Row 0, Col 1] [Row 0, Col 2] [Row 1, Col 0] ...
```
Always iterate through rows in the outer loop and columns in the inner loop to exploit CPU cache line prefetching.

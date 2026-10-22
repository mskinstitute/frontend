---
id: structured-bindings-tuples-maps
slug: structured-bindings-tuples-maps
course: cpp-for-advanced
chapter: 5: Modern C++ Features & Vocabulary Types
topic: "Structured Bindings (auto [a, b] = pair)"
difficulty: Advanced
readingTime: 12
order: 24
keywords: ["structured bindings","c++17 structured bindings","unpacking tuples","map decomposition","auto unpacking"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📦 Structured Bindings: Modern Unpacking in C++17

## Introduction
Before C++17, extracting values from pairs, tuples, or structs required clunky accessors like `pair.first` and `pair.second` or `std::tie`. **Structured bindings** allow you to unpack complex objects into named identifiers in a single line.

---

## 💻 Unpacking Structures, Pairs, and Tuples

```cpp
#include <iostream>
#include <tuple>
#include <string>
#include <map>

struct InstituteBranch {
    std::string city;
    int studentCount;
    bool isOperational;
};

std::tuple<std::string, double, int> getBatchMetrics() {
    return {"Modern C++ Advanced", 98.4, 35};
}

int main() {
    // 1. Unpacking Structs
    InstituteBranch shikohabad{"Shikohabad", 350, true};
    auto [city, count, active] = shikohabad;
    std::cout << "Branch: " << city << " | Students: " << count << "\n";

    // 2. Unpacking Tuples
    auto [courseName, avgScore, enrolled] = getBatchMetrics();
    std::cout << "Course: " << courseName << " - Avg: " << avgScore << "%\n";

    // 3. Unpacking Map Entries in Loops
    std::map<std::string, int> courseCodes = {
        {"C_PROG", 101}, {"CPP_CORE", 102}, {"JAVA_DEV", 103}
    };

    std::cout << "=== Course Codes ===\n";
    for (const auto& [name, code] : courseCodes) {
        std::cout << name << " -> Code " << code << "\n";
    }

    return 0;
}
```

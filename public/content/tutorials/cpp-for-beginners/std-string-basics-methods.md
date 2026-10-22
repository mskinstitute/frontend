---
id: std-string-basics-methods
slug: std-string-basics-methods
course: cpp-for-beginners
chapter: 7: Modern std::string & std::array
topic: "std::string Basics: Concatenation, length(), size(), and empty()"
difficulty: Beginner
readingTime: 12
order: 29
keywords: ["std::string","string length","string size","string concatenation","string empty"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧵 std::string Basics: Construction, Inspection & Concatenation

## Introduction
Unlike C, which relies on risky null-terminated `char[]` arrays prone to buffer overflows, Modern C++ provides **`std::string`** from `<string>`. It manages dynamic heap memory automatically, supports safe resizing, and implements rich string algorithms.

---

## 🛠️ String Operations

```cpp
#include <iostream>
#include <string>

int main() {
    // Construction & Initialization
    std::string greeting = "Welcome to MSK Institute";
    std::string branch("Shikohabad");

    // Concatenation with + and +=
    std::string fullHeader = greeting + " (" + branch + ")";
    std::cout << fullHeader << "\n";

    // Length and Size inspection
    std::cout << "Length: " << fullHeader.length() << " characters\n";
    std::cout << "Size:   " << fullHeader.size() << " characters\n"; // length() and size() are synonyms

    // Emptiness check
    std::string emptyBuffer;
    if (emptyBuffer.empty()) {
        std::cout << "Buffer is currently empty\n";
    }

    // Accessing characters by index
    char firstLetter = fullHeader[0];
    char safeLetter = fullHeader.at(0); // at() provides bounds checking (throws std::out_of_range)

    std::cout << "First Letter: " << safeLetter << "\n";
    return 0;
}
```

---

## ⚡ Performance Tip: SSO (Small String Optimization)
Modern standard libraries implement **SSO**. Strings shorter than ~15-22 characters are stored directly inside the stack object without performing dynamic heap allocation.

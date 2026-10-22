---
id: std-string-view-zero-copy
slug: std-string-view-zero-copy
course: cpp-for-advanced
chapter: 5: Modern C++ Features & Vocabulary Types
topic: "std::string_view: Zero-Copy String Passing"
difficulty: Advanced
readingTime: 13
order: 21
keywords: ["std::string_view","zero copy strings","string passing","c++17 string view","performance optimization"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🪟 std::string_view: Zero-Copy String Passing

## Introduction
Passing `const std::string&` cannot accept a string literal (`"hello"`) or substring without performing an implicit heap allocation. C++17 introduced **`std::string_view`**, a non-owning read-only window into a sequence of characters comprising just two words: a pointer and a length.

---

## ⚡ The Zero-Copy Advantage

```text
[ std::string_view (16 bytes) ]
┌────────────────────┬───────────┐
│ Pointer to Data    │ Length: 13│
└─────────┬──────────┴───────────┘
          │
          ▼
"MSK Institute" (Static Read-Only Memory or Heap)
```

```cpp
#include <iostream>
#include <string_view>
#include <string>

// Fast zero-copy parameter: Works seamlessly with std::string, char[], and "literals"!
void printHeader(std::string_view text) {
    std::cout << ">>> " << text << " <<< (Length: " << text.length() << ")\n";
}

int main() {
    // 1. String Literal: ZERO heap allocation
    printHeader("Welcome to Shikohabad");

    // 2. std::string: ZERO heap copying
    std::string dynamicStr = "Modern C++ Advanced";
    printHeader(dynamicStr);

    // 3. Substring with ZERO copying:
    std::string_view view = dynamicStr;
    std::string_view sub = view.substr(0, 6); // Just adjusts pointer and length!
    printHeader(sub);

    return 0;
}
```

---

## ⚠️ The Lifetime Danger
Because `std::string_view` does not own the memory it references, **never return a string_view pointing to a local temporary string** (dangling pointer hazard)!

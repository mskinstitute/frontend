---
id: template-specialization-full-partial
slug: template-specialization-full-partial
course: cpp-for-advanced
chapter: 3: Templates & Generic Metaprogramming
topic: "Template Specialization (Full and Partial Specialization)"
difficulty: Advanced
readingTime: 13
order: 12
keywords: ["template specialization","full specialization","partial specialization","traits","generic customization"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎯 Template Specialization (Full and Partial)

## Introduction
While generic templates provide universal behavior, certain data types require custom optimizations or unique formatting. **Template Specialization** allows you to override generic implementations for specific types.

---

## 🌟 Full Template Specialization

```cpp
#include <iostream>
#include <string>

// Primary Generic Template
template <typename T>
struct Formatter {
    static void print(const T& val) {
        std::cout << "[Generic]: " << val << "\n";
    }
};

// Full Specialization for bool:
template <>
struct Formatter<bool> {
    static void print(const bool& val) {
        std::cout << "[Boolean]: " << (val ? "TRUE (Verified)" : "FALSE (Unverified)") << "\n";
    }
};

int main() {
    Formatter<int>::print(42);
    Formatter<double>::print(3.14159);
    Formatter<bool>::print(true); // Routes to full specialization!
    return 0;
}
```

---

## 🧩 Partial Template Specialization (Classes Only)

Partial specialization refines templates when only some parameters match (e.g., specializing for pointers `T*`):

```cpp
#include <iostream>

// Primary template
template <typename T>
struct TypeInspector {
    static void report() { std::cout << "Value Type\n"; }
};

// Partial Specialization for any pointer type T*
template <typename T>
struct TypeInspector<T*> {
    static void report() { std::cout << "Pointer Type (Deref target size: " << sizeof(T) << " bytes)\n"; }
};

int main() {
    TypeInspector<int>::report();    // Output: Value Type
    TypeInspector<int*>::report();   // Output: Pointer Type
    TypeInspector<double*>::report();// Output: Pointer Type
    return 0;
}
```

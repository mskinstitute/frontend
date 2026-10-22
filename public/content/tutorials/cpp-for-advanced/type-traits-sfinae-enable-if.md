---
id: type-traits-sfinae-enable-if
slug: type-traits-sfinae-enable-if
course: cpp-for-advanced
chapter: 3: Templates & Generic Metaprogramming
topic: "Type Traits (<type_traits>), std::enable_if, and SFINAE"
difficulty: Advanced
readingTime: 14
order: 14
keywords: ["type traits","sfinae","std::enable_if","compile time introspection","metaprogramming"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔬 Type Traits, std::enable_if, and SFINAE

## Introduction
**SFINAE** stands for **"Substitution Failure Is Not An Error"**. In C++, if substituting a template parameter causes an invalid type expression, the compiler does not fail compilation; it simply discards that candidate function from the overload set. In C++11/C++14, SFINAE combined with **`<type_traits>`** and **`std::enable_if`** formed the foundation of compile-time introspection.

---

## 🧪 Type Traits Queries at Compile-Time

```cpp
#include <iostream>
#include <type_traits>

int main() {
    std::cout << std::boolalpha;
    std::cout << "Is int integral?     " << std::is_integral<int>::value << "\n";
    std::cout << "Is double floating?  " << std::is_floating_point<double>::value << "\n";
    std::cout << "Is pointer?          " << std::is_pointer<int*>::value << "\n";
    return 0;
}
```

---

## 🛡️ SFINAE with `std::enable_if_t`

```cpp
#include <iostream>
#include <type_traits>

// Overload active ONLY for integral types (int, long, short):
template <typename T>
std::enable_if_t<std::is_integral_v<T>, void> processData(T value) {
    std::cout << "[INTEGER LOGIC]: " << (value * 2) << "\n";
}

// Overload active ONLY for floating point types (float, double):
template <typename T>
std::enable_if_t<std::is_floating_point_v<T>, void> processData(T value) {
    std::cout << "[FLOAT LOGIC]:   " << (value / 2.0) << "\n";
}

int main() {
    processData(10);   // Routes to integral overload
    processData(4.5);  // Routes to floating overload
    // processData("MSK"); // 💥 SFINAE fails on both: Compiler halts with clean error!
    return 0;
}
```

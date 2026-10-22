---
id: function-and-class-templates
slug: function-and-class-templates
course: cpp-for-advanced
chapter: 3: Templates & Generic Metaprogramming
topic: "Function Templates and Class Templates"
difficulty: Advanced
readingTime: 13
order: 11
keywords: ["templates","function templates","class templates","generic programming","template instantiation"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧬 Function Templates and Class Templates

## Introduction
Templates enable **generic programming**: writing code once that works across any data type (integers, strings, custom classes) with zero runtime performance cost. During compilation, the compiler generates type-specific concrete instances through **template instantiation**.

---

## 🧮 Function Templates

```cpp
#include <iostream>
#include <string>

// Generic Maximum Function
template <typename T>
T findMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << "Max int:    " << findMax(10, 25) << "\n";         // Instantiates findMax<int>
    std::cout << "Max double: " << findMax(3.14, 2.71) << "\n";     // Instantiates findMax<double>
    std::cout << "Max string: " << findMax(std::string("Alpha"), std::string("Zeta")) << "\n";
    return 0;
}
```

---

## 📦 Class Templates

```cpp
#include <iostream>
#include <stdexcept>
#include <array>

template <typename T, std::size_t Capacity>
class StaticStack {
private:
    std::array<T, Capacity> m_elements;
    std::size_t m_topIndex = 0;

public:
    void push(const T& item) {
        if (m_topIndex >= Capacity) throw std::overflow_error("Stack full!");
        m_elements[m_topIndex++] = item;
    }

    T pop() {
        if (m_topIndex == 0) throw std::underflow_error("Stack empty!");
        return m_elements[--m_topIndex];
    }

    std::size_t size() const { return m_topIndex; }
};

int main() {
    StaticStack<int, 5> intStack;
    intStack.push(10);
    intStack.push(20);
    std::cout << "Popped: " << intStack.pop() << "\n";

    StaticStack<std::string, 3> strStack;
    strStack.push("MSK Institute");
    std::cout << "String stack size: " << strStack.size() << "\n";

    return 0;
}
```

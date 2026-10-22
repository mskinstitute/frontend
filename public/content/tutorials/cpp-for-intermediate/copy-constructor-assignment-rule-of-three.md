---
id: copy-constructor-assignment-rule-of-three
slug: copy-constructor-assignment-rule-of-three
course: cpp-for-intermediate
chapter: 2: Copy Semantics & Operator Overloading
topic: "Copy Constructor and Copy Assignment Operator (Rule of Three)"
difficulty: Intermediate
readingTime: 14
order: 7
keywords: ["copy constructor","copy assignment operator","rule of three","self-assignment","copy and swap"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📜 Copy Constructor, Copy Assignment Operator & The Rule of Three

## Introduction
The **Rule of Three** is a foundational guideline in C++: If a class needs to explicitly define a custom **Destructor**, it almost certainly needs to implement a custom **Copy Constructor** and a custom **Copy Assignment Operator**.

---

## 🏛️ The Three Pillars

1. **Destructor**: Deallocates owned dynamic resources.
2. **Copy Constructor**: Initializes a *new* object as an identical deep clone of an existing object (`MyClass b = a;`).
3. **Copy Assignment Operator (`operator=`)**: Overwrites an *already existing* object's state with another object's state (`b = a;`).

---

## 💻 Canonical Rule of Three Implementation

```cpp
#include <iostream>
#include <algorithm>

class IntBuffer {
private:
    int* m_data = nullptr;
    std::size_t m_size = 0;

public:
    // 1. Parameterized Constructor
    explicit IntBuffer(std::size_t size)
        : m_data(new int[size]{}), m_size(size) {}

    // 2. Destructor
    ~IntBuffer() {
        delete[] m_data;
    }

    // 3. Copy Constructor (Deep Copy)
    IntBuffer(const IntBuffer& other)
        : m_data(new int[other.m_size]), m_size(other.m_size) {
        std::copy(other.m_data, other.m_data + m_size, m_data);
    }

    // 4. Copy Assignment Operator (Handles Self-Assignment Guard)
    IntBuffer& operator=(const IntBuffer& other) {
        // Self-assignment check (e.g. buf = buf;)
        if (this == &other) {
            return *this;
        }

        // Release existing buffer
        delete[] m_data;

        // Allocate and copy new buffer
        m_size = other.m_size;
        m_data = new int[m_size];
        std::copy(other.m_data, other.m_data + m_size, m_data);

        return *this;
    }

    void set(std::size_t index, int value) {
        if (index < m_size) m_data[index] = value;
    }

    int get(std::size_t index) const {
        return (index < m_size) ? m_data[index] : 0;
    }
};

int main() {
    IntBuffer a(3);
    a.set(0, 100);
    a.set(1, 200);

    IntBuffer b = a; // Copy constructor
    IntBuffer c(1);
    c = a;           // Copy assignment operator

    std::cout << "b[1]: " << b.get(1) << ", c[0]: " << c.get(0) << "\n";
    return 0;
}
```

---

## 💡 Modern C++ Note (The Rule of Zero)
Whenever possible, **prefer the Rule of Zero**: Use standard library containers like `std::vector` and `std::string` as member variables. Because they already implement copy and move semantics, your class does not need to write any manual destructors or copy operators!

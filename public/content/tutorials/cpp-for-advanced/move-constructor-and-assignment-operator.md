---
id: move-constructor-and-assignment-operator
slug: move-constructor-and-assignment-operator
course: cpp-for-advanced
chapter: 1: Move Semantics & Modern Memory Management
topic: "Move Constructor and Move Assignment Operator"
difficulty: Advanced
readingTime: 14
order: 3
keywords: ["move constructor","move assignment operator","stealing pointers","noexcept","performance optimization"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏗️ Move Constructor and Move Assignment Operator

## Introduction
While copy constructors duplicate dynamic memory buffers, move operations **steal the existing pointer** from the source object and set the source's pointer to `nullptr`. This turns an expensive O(N) memory allocation into a microsecond O(1) pointer swap.

---

## 💻 Full Custom Buffer Implementation

```cpp
#include <iostream>
#include <utility>

class LargeDataBuffer {
private:
    int* m_data = nullptr;
    std::size_t m_size = 0;

public:
    // Parameterized Constructor
    explicit LargeDataBuffer(std::size_t size)
        : m_data(new int[size]{}), m_size(size) {
        std::cout << "[ALLOC]: Allocated " << m_size << " integers on heap.\n";
    }

    // Destructor
    ~LargeDataBuffer() noexcept {
        delete[] m_data;
    }

    // 1. Move Constructor (Must be marked noexcept!)
    LargeDataBuffer(LargeDataBuffer&& other) noexcept
        : m_data(other.m_data), m_size(other.m_size) {
        // Pilfer resources and nullify source:
        other.m_data = nullptr;
        other.m_size = 0;
        std::cout << "[MOVE CONSTRUCTOR]: Transferred buffer ownership in O(1).\n";
    }

    // 2. Move Assignment Operator
    LargeDataBuffer& operator=(LargeDataBuffer&& other) noexcept {
        if (this == &other) {
            return *this; // Self-assignment guard
        }

        // Clean up our current buffer
        delete[] m_data;

        // Steal resources
        m_data = other.m_data;
        m_size = other.m_size;

        // Leave source in valid empty state
        other.m_data = nullptr;
        other.m_size = 0;

        std::cout << "[MOVE ASSIGNMENT]: Transferred buffer via operator= in O(1).\n";
        return *this;
    }

    std::size_t getSize() const noexcept { return m_size; }
};

int main() {
    LargeDataBuffer buf1(1000000); // 1 million integers on heap

    // Move constructor invoked:
    LargeDataBuffer buf2 = std::move(buf1);

    LargeDataBuffer buf3(500);
    // Move assignment operator invoked:
    buf3 = std::move(buf2);

    std::cout << "Final buf3 size: " << buf3.getSize() << "\n";
    return 0;
}
```

---

## ⚡ Why `noexcept` is Mandatory for Move Operations
Standard containers like `std::vector` will **refuse to move elements during reallocation** and fall back to slow deep copying unless your move constructor is explicitly declared **`noexcept`**. This ensures the strong exception safety guarantee.

---
id: shallow-copy-vs-deep-copy-double-free
slug: shallow-copy-vs-deep-copy-double-free
course: cpp-for-intermediate
chapter: 2: Copy Semantics & Operator Overloading
topic: "Shallow Copy vs Deep Copy and Memory Double Free Bug"
difficulty: Intermediate
readingTime: 14
order: 6
keywords: ["shallow copy","deep copy","double free","heap allocation","pointer members","memory corruption"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💥 Shallow Copy vs Deep Copy & The Dreaded Double-Free Bug

## Introduction
When a class manages dynamic heap memory via raw pointers, relying on the compiler's default copying mechanism leads to catastrophe. Understanding the difference between a **shallow copy** and a **deep copy** is a defining milestone in mastering C++.

---

## ☠️ The Disaster of Shallow Copying

By default, the C++ compiler synthesizes a bitwise copy (shallow copy). It simply copies the pointer address rather than the underlying memory buffer!

```text
[ Object A ] ──► m_data pointer ──┐
                                  ▼
[ Object B (Shallow Copy) ] ──► [ Heap Buffer: 100 bytes ]
```

### The Double-Free Crash:
1. Object `A` is created; allocates 100 bytes on the heap.
2. Object `B` is created via default copy: `Object B = A;`. Now both `A.m_data` and `B.m_data` point to the **same heap memory address**.
3. Scope ends: `B`'s destructor executes and calls `delete[] m_data;`. Memory is returned to the OS.
4. Next: `A`'s destructor executes and calls `delete[] m_data;` on the **exact same memory address that was already deleted**!
5. **💥 CRASH: `free(): double free detected in tcache 2`**.

---

## 🛡️ Implementing a Deep Copy

A deep copy allocates a brand-new independent heap buffer for the clone, and copies the actual data bytes across:

```cpp
#include <iostream>
#include <cstring>

class DynamicString {
private:
    char* m_buffer = nullptr;
    std::size_t m_length = 0;

public:
    // Constructor
    DynamicString(const char* str) {
        if (str) {
            m_length = std::strlen(str);
            m_buffer = new char[m_length + 1];
            std::strcpy(m_buffer, str);
        }
    }

    // ✅ Deep Copy Constructor
    DynamicString(const DynamicString& other) {
        m_length = other.m_length;
        if (other.m_buffer) {
            m_buffer = new char[m_length + 1]; // Separate allocation!
            std::strcpy(m_buffer, other.m_buffer);
        } else {
            m_buffer = nullptr;
        }
        std::cout << "[LOG]: Deep Copy performed.\n";
    }

    // Destructor
    ~DynamicString() {
        delete[] m_buffer;
    }

    void print() const {
        if (m_buffer) std::cout << m_buffer << "\n";
    }
};

int main() {
    DynamicString s1("MSK Institute Shikohabad");
    DynamicString s2 = s1; // Deep copy constructor cleanly executed!

    s1.print();
    s2.print();
    // Exits cleanly without any double-free crashes!
    return 0;
}
```

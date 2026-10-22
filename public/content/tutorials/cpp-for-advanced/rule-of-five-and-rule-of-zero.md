---
id: rule-of-five-and-rule-of-zero
slug: rule-of-five-and-rule-of-zero
course: cpp-for-advanced
chapter: 1: Move Semantics & Modern Memory Management
topic: "The Rule of Five and Rule of Zero in Modern C++"
difficulty: Advanced
readingTime: 13
order: 4
keywords: ["rule of five","rule of zero","special member functions","raii design","modern cpp guidelines"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📜 The Rule of Five and Rule of Zero in Modern C++

## Introduction
The evolution from C++98 to Modern C++ expanded the classic "Rule of Three" into the **Rule of Five**, while simultaneously championing the architectural ideal known as the **Rule of Zero**.

---

## 🖐️ The Rule of Five

If your class manages raw resources directly and implements any one of the following special member functions, it must explicitly declare or delete all five:

1. **Destructor**: `~MyClass()`
2. **Copy Constructor**: `MyClass(const MyClass&)`
3. **Copy Assignment Operator**: `MyClass& operator=(const MyClass&)`
4. **Move Constructor**: `MyClass(MyClass&&) noexcept`
5. **Move Assignment Operator**: `MyClass& operator=(MyClass&&) noexcept`

```cpp
class ResourceHandle {
public:
    ResourceHandle();
    ~ResourceHandle();                                    // 1. Destructor
    ResourceHandle(const ResourceHandle&);                // 2. Copy Constructor
    ResourceHandle& operator=(const ResourceHandle&);     // 3. Copy Assignment
    ResourceHandle(ResourceHandle&&) noexcept;            // 4. Move Constructor
    ResourceHandle& operator=(ResourceHandle&&) noexcept; // 5. Move Assignment
};
```

---

## 🎯 The Modern Preferred Standard: The Rule of Zero

> **Rule of Zero**: Write classes that do not declare any of the five special member functions. Let the compiler synthesize them automatically by composing your class exclusively from types that manage their own resources (`std::string`, `std::vector`, `std::unique_ptr`).

```cpp
#include <string>
#include <vector>

// ✅ Rule of Zero: No manual destructor, copy, or move operations needed!
// The compiler automatically synthesizes optimal copy and move semantics.
class StudentRecord {
private:
    std::string m_name;
    int m_rollNumber;
    std::vector<double> m_examMarks;

public:
    StudentRecord(std::string name, int roll)
        : m_name(std::move(name)), m_rollNumber(roll) {}
};
```

---

## 💡 Summary Comparison

| Paradigm | When to Use | Maintenance Overhead |
|---|---|---|
| **Rule of Zero** | **95% of application classes** (Recommended) | **Zero**; compiler generates perfect, leak-free code |
| **Rule of Five** | Low-level hardware drivers, custom memory allocators | High; requires manual testing for self-assignment & leaks |

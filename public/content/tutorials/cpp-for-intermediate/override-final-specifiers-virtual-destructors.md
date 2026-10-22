---
id: override-final-specifiers-virtual-destructors
slug: override-final-specifiers-virtual-destructors
course: cpp-for-intermediate
chapter: 3: Inheritance & Polymorphism
topic: "The override and final Specifiers, and Virtual Destructors"
difficulty: Intermediate
readingTime: 13
order: 15
keywords: ["override specifier","final specifier","virtual destructor","memory leak","polymorphic cleanup"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛡️ The override and final Specifiers & Virtual Destructors

## Introduction
Modern C++ (C++11 onward) introduced explicit specifiers (**`override`** and **`final`**) to catch subtle bugs where virtual function signatures did not match. Furthermore, **virtual destructors** are mandatory in polymorphic base classes to prevent catastrophic resource leaks.

---

## 🎯 The `override` Specifier: Catching Silent Bugs

Without `override`, a typo in parameter types creates a brand-new overloaded function instead of overriding the base method!

```cpp
class Base {
public:
    virtual void render(int quality) const;
};

class Derived : public Base {
public:
    // ❌ Without override: Typo 'double' compiles silently! It fails to override Base!
    // void render(double quality) const;

    // ✅ With override: Compiler verifies signature against Base class!
    void render(int quality) const override;
};
```

---

## 🚫 The `final` Specifier

Use `final` to prevent further overriding of a method or further subclassing of a class:

```cpp
class SecurityCore final {
    // No class can inherit from SecurityCore!
};

// class MaliciousSub : public SecurityCore {}; // 💥 Compiler halts: cannot derive from 'final' class
```

---

## ⚠️ The Deadly Non-Virtual Destructor Bug

When deleting a derived class instance through a base class pointer:
```cpp
#include <iostream>

class Base {
public:
    // ❌ Non-virtual destructor causes partial destruction:
    // ~Base() { std::cout << "Base destroyed\n"; }

    // ✅ Virtual destructor guarantees full derived cleanup:
    virtual ~Base() { std::cout << "Base destroyed\n"; }
};

class Derived : public Base {
private:
    int* m_resource;
public:
    Derived() : m_resource(new int[1000]) {}
    ~Derived() override {
        delete[] m_resource;
        std::cout << "Derived resource freed\n";
    }
};

int main() {
    Base* ptr = new Derived();
    delete ptr; // If ~Base() was not virtual, ~Derived() would NEVER RUN (leaking 1000 ints)!
    return 0;
}
```

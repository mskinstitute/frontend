---
id: virtual-functions-dynamic-dispatch-vtable
slug: virtual-functions-dynamic-dispatch-vtable
course: cpp-for-intermediate
chapter: 3: Inheritance & Polymorphism
topic: "Virtual Functions, Dynamic Dispatch, and the vtable Mechanism"
difficulty: Intermediate
readingTime: 14
order: 13
keywords: ["virtual functions","dynamic dispatch","vtable","vptr","runtime polymorphism","late binding"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎪 Virtual Functions, Dynamic Dispatch, and the vtable Mechanism

## Introduction
Polymorphism ("many forms") allows a single pointer or reference to a base class to invoke overridden methods in derived classes at **runtime**. In C++, this dynamic dispatch is unlocked via the **`virtual`** keyword and implemented through compiler-generated **vtables (virtual method tables)**.

---

## ⚠️ Early Binding (Without `virtual`) vs Late Binding

```cpp
#include <iostream>
#include <vector>
#include <memory>

class Shape {
public:
    // Virtual enables Dynamic Dispatch (Late Binding)
    virtual void draw() const {
        std::cout << "Drawing generic shape.\n";
    }
    virtual ~Shape() = default; // Crucial! Always use virtual destructors
};

class Circle : public Shape {
public:
    void draw() const override {
        std::cout << "Drawing Circle with radius and smooth curves.\n";
    }
};

class Rectangle : public Shape {
public:
    void draw() const override {
        std::cout << "Drawing Rectangle with width and height.\n";
    }
};

int main() {
    Circle c;
    Rectangle r;

    // Base class pointers pointing to derived objects:
    std::vector<const Shape*> shapes = {&c, &r};

    for (const auto* s : shapes) {
        s->draw(); // Dynamically routes to Circle::draw() and Rectangle::draw() at runtime!
    }

    return 0;
}
```

---

## 🔍 Under the Hood: The vtable and vptr Mechanism

```text
[ Shape Object Memory ]             [ vtable for Circle ]
┌─────────────────────┐             ┌─────────────────────┐
│  vptr (Hidden Ptr)  │ ──────────► │ &Circle::draw()     │
├─────────────────────┤             ├─────────────────────┤
│  Member Data        │             │ &Circle::~Circle()  │
└─────────────────────┘             └─────────────────────┘
```

1. **`vtable`**: A static lookup table created per class containing pointers to virtual member functions.
2. **`vptr`**: A hidden pointer automatically inserted into every class instance that possesses at least one virtual function. It points directly to that class's vtable.
3. When calling `s->draw()`, the CPU performs an indirect jump: `s->vptr[0]()`. The microsecond overhead is negligible for 99% of business logic.

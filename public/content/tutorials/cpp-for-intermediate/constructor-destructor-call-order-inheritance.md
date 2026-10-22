---
id: constructor-destructor-call-order-inheritance
slug: constructor-destructor-call-order-inheritance
course: cpp-for-intermediate
chapter: 3: Inheritance & Polymorphism
topic: "Constructor and Destructor Call Order in Inheritance"
difficulty: Intermediate
readingTime: 11
order: 12
keywords: ["constructor order","destructor order","inheritance chain","stack order","base derived execution"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⏳ Constructor and Destructor Call Order in Inheritance

## Introduction
When working with inheritance hierarchies, the compiler follows a strict, deterministic sequence for invoking constructors and destructors.

---

## 🔄 The Golden Rule of Execution Order

```text
CONSTRUCTION (Top-Down):
1. Base Class Constructor
2. Derived Class Constructor

DESTRUCTION (Bottom-Up / Reverse Order):
1. Derived Class Destructor
2. Base Class Destructor
```

---

## 💻 Code Proof

```cpp
#include <iostream>

class LayerA {
public:
    LayerA()  { std::cout << "[1] LayerA Constructor\n"; }
    ~LayerA() { std::cout << "[4] LayerA Destructor\n"; }
};

class LayerB : public LayerA {
public:
    LayerB()  { std::cout << "[2] LayerB Constructor\n"; }
    ~LayerB() { std::cout << "[3] LayerB Destructor\n"; }
};

int main() {
    std::cout << "--- Creating Object --- \n";
    {
        LayerB objectB;
    } // objectB destroyed here
    std::cout << "--- Object Destroyed --- \n";
    return 0;
}
```

### Console Output:
```text
--- Creating Object --- 
[1] LayerA Constructor
[2] LayerB Constructor
[3] LayerB Destructor
[4] LayerA Destructor
--- Object Destroyed --- 
```

---

## 💡 Rationale
A derived class depends on its base class foundations. Therefore, the base class must be fully constructed before derived member initializers run. When tearing down, the derived class is destroyed first so that it does not attempt to access already-destroyed base members.

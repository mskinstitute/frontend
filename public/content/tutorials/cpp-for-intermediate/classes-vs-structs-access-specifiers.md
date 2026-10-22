---
id: classes-vs-structs-access-specifiers
slug: classes-vs-structs-access-specifiers
course: cpp-for-intermediate
chapter: 1: Classes & Object-Oriented Fundamentals
topic: "Classes vs Structs in C++ and Access Specifiers (public, private, protected)"
difficulty: Intermediate
readingTime: 12
order: 1
keywords: ["cpp class vs struct","access specifiers","public","private","protected","encapsulation","oop basics"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏛️ Classes vs Structs in C++ and Access Specifiers

## Introduction
Object-Oriented Programming (OOP) in C++ organizes software into self-contained entities known as **classes**. While C provided only passive data aggregates via `struct`, C++ elevates both `class` and `struct` into first-class object blueprints capable of bundling state (member variables) and behavior (member methods).

---

## 🆚 The Single Difference: Default Access Control

In C++, **`class` and `struct` are technically almost identical**, with only one distinction:

| Blueprint | Default Member Access | Default Inheritance Access | Convention / Idiomatic Use |
|---|---|---|---|
| **`struct`** | **`public`** | **`public`** | Passive Data Transfer Objects (DTOs), plain old data (POD) with no private invariants |
| **`class`** | **`private`** | **`private`** | Rich domain entities enforcing **data encapsulation**, invariants, and state protection |

```cpp
#include <iostream>
#include <string>

// Idiomatic Struct: Public data bundle
struct Point2D {
    double x = 0.0;
    double y = 0.0;
};

// Idiomatic Class: Private state with public interface
class StudentProfile {
private:
    std::string m_name;
    int m_rollNumber = 0;
    double m_gpa = 0.0;

public:
    void setData(const std::string& name, int roll, double gpa) {
        m_name = name;
        m_rollNumber = roll;
        m_gpa = (gpa >= 0.0 && gpa <= 10.0) ? gpa : 0.0;
    }

    void display() const {
        std::cout << "Student: " << m_name << " (Roll #" << m_rollNumber << ") - GPA: " << m_gpa << "\n";
    }
};

int main() {
    Point2D pt{10.5, 20.2}; // Direct member access allowed
    std::cout << "Point: (" << pt.x << ", " << pt.y << ")\n";

    StudentProfile s1;
    // s1.m_gpa = 9.8; // 💥 Compiler Error: 'm_gpa' is private within this context
    s1.setData("Aarav Sharma", 101, 9.4);
    s1.display();

    return 0;
}
```

---

## 🛡️ The Three Access Specifiers Explained

```text
┌────────────────────────────────────────────────────────┐
│                        public                          │
│   Accessible anywhere: inside class, derived classes,   │
│   and by external callers via object instances.        │
├────────────────────────────────────────────────────────┤
│                       protected                        │
│   Accessible inside this class AND derived subclasses;  │
│   hidden from external callers and clients.            │
├────────────────────────────────────────────────────────┤
│                        private                         │
│   Accessible ONLY within member functions of this class│
│   (and designated 'friend' classes/functions).         │
└────────────────────────────────────────────────────────┘
```

---

## 💡 Encapsulation Principle
Always default member variables to **`private`**. Expose state only through validated getter and setter methods or meaningful domain operations. This guarantees that your object's internal state remains valid and immune to corruption by external code.

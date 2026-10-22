---
id: base-and-derived-classes-inheritance
slug: base-and-derived-classes-inheritance
course: cpp-for-intermediate
chapter: 3: Inheritance & Polymorphism
topic: "Base Classes and Derived Classes (Single and Multi-Level Inheritance)"
difficulty: Intermediate
readingTime: 13
order: 11
keywords: ["inheritance","base class","derived class","single inheritance","multilevel inheritance","code reuse"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧬 Base Classes and Derived Classes (Inheritance)

## Introduction
Inheritance allows you to create new classes (derived/subclasses) that inherit attributes and behaviors from existing classes (base/superclasses). This embodies the **"is-a" relationship** (e.g., a `Developer` *is a* `StaffMember`).

---

## 🏛️ Public Inheritance Syntax

In C++, access specifiers during inheritance govern how base members appear in the derived class:

```cpp
#include <iostream>
#include <string>

// Base Class
class StaffMember {
protected:
    std::string m_name;
    int m_employeeId;
    double m_baseSalary;

public:
    StaffMember(const std::string& name, int id, double salary)
        : m_name(name), m_employeeId(id), m_baseSalary(salary) {}

    void displayBaseInfo() const {
        std::cout << "Staff: " << m_name << " (ID: " << m_employeeId << ") - Base Pay: ₹" << m_baseSalary << "\n";
    }
};

// Derived Class (Single Inheritance)
class Instructor : public StaffMember {
private:
    std::string m_specializationSubject;

public:
    // Constructor delegates initialization to Base Class constructor:
    Instructor(const std::string& name, int id, double salary, const std::string& subject)
        : StaffMember(name, id, salary), m_specializationSubject(subject) {}

    void conductLecture() const {
        std::cout << "Instructor " << m_name << " is teaching " << m_specializationSubject << "\n";
    }
};

// Derived Class (Multi-Level Inheritance: StaffMember -> Instructor -> HeadInstructor)
class HeadInstructor : public Instructor {
private:
    int m_batchSupervisionCount;

public:
    HeadInstructor(const std::string& name, int id, double salary, const std::string& subject, int batches)
        : Instructor(name, id, salary, subject), m_batchSupervisionCount(batches) {}

    void reviewCurriculum() const {
        std::cout << "Head Instructor " << m_name << " is reviewing " << m_batchSupervisionCount << " active batches.\n";
    }
};

int main() {
    HeadInstructor hod("Er. Sumit Sharma", 1001, 85000.0, "C++ & Systems Architecture", 8);
    hod.displayBaseInfo(); // Inherited from StaffMember
    hod.conductLecture();  // Inherited from Instructor
    hod.reviewCurriculum(); // Defined in HeadInstructor
    return 0;
}
```

---

## 🔒 Types of Inheritance

- **`class Derived : public Base`**: Public stays public; protected stays protected (Standard OOP "is-a").
- **`class Derived : protected Base`**: Public becomes protected; protected stays protected.
- **`class Derived : private Base`**: All inherited members become private ("implemented in terms of").

---
id: overloading-stream-insertion-extraction-friend
slug: overloading-stream-insertion-extraction-friend
course: cpp-for-intermediate
chapter: 2: Copy Semantics & Operator Overloading
topic: "Overloading Stream Insertion (<<) and Extraction (>>) Operators with friend Functions"
difficulty: Intermediate
readingTime: 12
order: 10
keywords: ["stream insertion","stream extraction","friend functions","cout overloading","cin overloading"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📺 Overloading Stream Operators (<< and >>) with friend Functions

## Introduction
To print an object directly using `std::cout << obj` or read from user input with `std::cin >> obj`, you must overload the **stream insertion (`<<`)** and **stream extraction (`>>`)** operators. Because the left-hand operand is an `std::ostream` (or `std::istream`), these cannot be member functions of your class; they must be declared as **friend functions**.

---

## 🤝 What is a `friend` Function?

A `friend` declaration grants a non-member function or outside class access to the private and protected members of the enclosing class.

---

## 💻 Full Implementation

```cpp
#include <iostream>
#include <string>

class StudentCredential {
private:
    std::string m_studentId;
    std::string m_branch;
    int m_graduationYear;

public:
    StudentCredential(std::string id = "", std::string branch = "", int year = 2026)
        : m_studentId(id), m_branch(branch), m_graduationYear(year) {}

    // Overload Stream Insertion << (Output)
    friend std::ostream& operator<<(std::ostream& os, const StudentCredential& cred) {
        os << "[ID: " << cred.m_studentId << ", Branch: " << cred.m_branch 
           << ", Grad: " << cred.m_graduationYear << "]";
        return os; // Return stream reference for chaining: cout << a << b;
    }

    // Overload Stream Extraction >> (Input)
    friend std::istream& operator>>(std::istream& is, StudentCredential& cred) {
        std::cout << "Enter Student ID: ";
        is >> cred.m_studentId;
        std::cout << "Enter Branch: ";
        is >> cred.m_branch;
        std::cout << "Enter Graduation Year: ";
        is >> cred.m_graduationYear;
        return is;
    }
};

int main() {
    StudentCredential s1("MSK-CS-042", "Computer Science", 2027);

    // Chained stream insertion:
    std::cout << "Enrolled Student Details: " << s1 << "\n";

    return 0;
}
```

---

## 💡 Why Returning the Stream Reference is Critical
Always return `os` (or `is`) by reference (`std::ostream&`). This enables standard stream chaining:
```cpp
std::cout << "Result: " << student1 << " and " << student2 << "\n";
```

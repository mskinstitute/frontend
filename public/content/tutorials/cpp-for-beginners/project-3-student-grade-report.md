---
id: project-3-student-grade-report
slug: project-3-student-grade-report
course: cpp-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 3: Student Grade Report & GPA Calculator"
difficulty: Beginner
readingTime: 15
order: 35
keywords: ["student grade report","gpa calculator","array processing","grade classification"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📊 Capstone Project 3: Student Grade Report & GPA Calculator

## Introduction
Educational institutions and enterprises require batch reporting tools that process tabular datasets, compute statistical aggregations (averages, minimums, maximums), and assign letter grades.

---

## 🎯 Project Features
1. Collect student details and grades across 5 subjects.
2. Store subject grades using Modern `std::array`.
3. Compute total marks, percentage, and 10-point GPA scale.
4. Output formatted ASCII report cards.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <string>
#include <array>
#include <iomanip>
#include <numeric>

struct StudentRecord {
    std::string name;
    std::string rollNumber;
    std::array<double, 5> marks;
};

char calculateGrade(double percentage) {
    if (percentage >= 90.0) return 'A';
    if (percentage >= 80.0) return 'B';
    if (percentage >= 70.0) return 'C';
    if (percentage >= 50.0) return 'D';
    return 'F';
}

int main() {
    constexpr std::array<const char*, 5> subjectNames = {
        "C++ Core", "Data Structures", "Computer Org", "DBMS", "Discrete Math"
    };

    StudentRecord student;
    std::cout << "=== MSK Institute Student Grade Entry ===\n";
    std::cout << "Enter Student Full Name: ";
    std::getline(std::cin, student.name);

    std::cout << "Enter Roll Number: ";
    std::getline(std::cin, student.rollNumber);

    for (std::size_t i = 0; i < student.marks.size(); ++i) {
        std::cout << "Enter marks for " << subjectNames[i] << " (0-100): ";
        std::cin >> student.marks[i];
    }

    // Aggregations
    double totalMarks = std::accumulate(student.marks.begin(), student.marks.end(), 0.0);
    double percentage = totalMarks / student.marks.size();
    double gpa = percentage / 10.0;
    char grade = calculateGrade(percentage);

    // Formatted Grade Card
    std::cout << "\n==================================================\n";
    std::cout << "            MSK INSTITUTE OF TECHNOLOGY           \n";
    std::cout << "                 OFFICIAL GRADE CARD              \n";
    std::cout << "==================================================\n";
    std::cout << "Student Name : " << student.name << "\n";
    std::cout << "Roll Number  : " << student.rollNumber << "\n";
    std::cout << "--------------------------------------------------\n";
    std::cout << std::left << std::setw(25) << "Subject" 
              << std::right << std::setw(15) << "Marks Obtained\n";
    std::cout << "--------------------------------------------------\n";

    for (std::size_t i = 0; i < student.marks.size(); ++i) {
        std::cout << std::left << std::setw(25) << subjectNames[i]
                  << std::right << std::setw(15) << std::fixed << std::setprecision(1) << student.marks[i] << "\n";
    }

    std::cout << "==================================================\n";
    std::cout << "Total Marks  : " << totalMarks << " / 500.0\n";
    std::cout << "Percentage   : " << percentage << "%\n";
    std::cout << "GPA (10-pt)  : " << gpa << " / 10.0\n";
    std::cout << "Final Grade  : " << grade << " (" << (grade != 'F' ? "PASSED" : "FAILED") << ")\n";
    std::cout << "==================================================\n";

    return 0;
}
```

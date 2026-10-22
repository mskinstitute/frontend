---
id: project-1-student-management-system-files
slug: project-1-student-management-system-files
course: cpp-for-intermediate
chapter: 7: Intermediate Portfolio Projects
topic: "Project 1: Object-Oriented Student Management System with File Persistence"
difficulty: Intermediate
readingTime: 16
order: 30
keywords: ["student management system","file persistence","oop project","vector of objects","crud operations"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎓 Portfolio Project 1: Object-Oriented Student Management System

## Introduction
In this project, you will build a complete **Object-Oriented Student Management System** that persists records to disk using file streams and utilizes `std::vector` for in-memory management.

---

## 🎯 Project Features
1. Encapsulated `Student` domain class with validation.
2. `StudentRegistry` manager maintaining an `std::vector<Student>`.
3. Persistent saving and loading to `students_db.csv`.
4. Add, View, and Search operations.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <iomanip>

class Student {
private:
    int m_rollNumber;
    std::string m_name;
    std::string m_course;
    double m_gpa;

public:
    Student(int roll, const std::string& name, const std::string& course, double gpa)
        : m_rollNumber(roll), m_name(name), m_course(course), m_gpa(gpa) {}

    int getRoll() const { return m_rollNumber; }
    std::string getName() const { return m_name; }
    std::string getCourse() const { return m_course; }
    double getGpa() const { return m_gpa; }

    std::string toCsv() const {
        std::stringstream ss;
        ss << m_rollNumber << "," << m_name << "," << m_course << "," << m_gpa;
        return ss.str();
    }
};

class StudentRegistry {
private:
    std::vector<Student> m_records;
    const std::string m_filepath = "students_db.csv";

public:
    StudentRegistry() {
        loadFromFile();
    }

    void addStudent(int roll, const std::string& name, const std::string& course, double gpa) {
        m_records.emplace_back(roll, name, course, gpa);
        saveToFile();
        std::cout << "✅ Student added successfully!\n";
    }

    void displayAll() const {
        if (m_records.empty()) {
            std::cout << "No records found.\n";
            return;
        }

        std::cout << "\n" << std::left << std::setw(10) << "Roll"
                  << std::setw(25) << "Name"
                  << std::setw(20) << "Course"
                  << std::setw(10) << "GPA" << "\n";
        std::cout << std::string(65, '-') << "\n";

        for (const auto& s : m_records) {
            std::cout << std::left << std::setw(10) << s.getRoll()
                      << std::setw(25) << s.getName()
                      << std::setw(20) << s.getCourse()
                      << std::setw(10) << std::fixed << std::setprecision(2) << s.getGpa() << "\n";
        }
    }

    void saveToFile() const {
        std::ofstream file(m_filepath);
        if (file) {
            for (const auto& s : m_records) {
                file << s.toCsv() << "\n";
            }
        }
    }

    void loadFromFile() {
        std::ifstream file(m_filepath);
        if (!file) return;

        m_records.clear();
        std::string line;
        while (std::getline(file, line)) {
            if (line.empty()) continue;
            std::stringstream ss(line);
            std::string rollStr, name, course, gpaStr;

            if (std::getline(ss, rollStr, ',') &&
                std::getline(ss, name, ',') &&
                std::getline(ss, course, ',') &&
                std::getline(ss, gpaStr, ',')) {
                m_records.emplace_back(std::stoi(rollStr), name, course, std::stod(gpaStr));
            }
        }
    }
};

int main() {
    StudentRegistry registry;
    registry.addStudent(101, "Deepak Yadav", "Modern C++", 9.2);
    registry.addStudent(102, "Ananya Jain", "Java Mastery", 8.9);
    registry.displayAll();
    return 0;
}
```

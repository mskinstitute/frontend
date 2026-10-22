---
id: destructors-resource-cleanup-basics
slug: destructors-resource-cleanup-basics
course: cpp-for-intermediate
chapter: 1: Classes & Object-Oriented Fundamentals
topic: "Destructors and Resource Cleanup Basics"
difficulty: Intermediate
readingTime: 12
order: 4
keywords: ["destructors","raii","resource cleanup","stack unwinding","memory leak prevention"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧹 Destructors and Resource Cleanup Basics

## Introduction
While constructors acquire resources (file handles, network sockets, dynamic heap memory) when an object is born, **destructors** guarantee their deterministic, automatic release when the object goes out of scope. This design pattern is the foundation of **RAII (Resource Acquisition Is Initialization)**.

---

## 🏛️ Destructor Characteristics

1. Named with a tilde (`~`) followed by the class name (e.g., `~FileManager()`).
2. Takes **no parameters** and has **no return type**.
3. Cannot be overloaded (there is only one destructor per class).
4. Invoked automatically in **reverse order of construction** when stack frames unwind.

---

## 💻 RAII in Action: Safe File Wrapper

```cpp
#include <iostream>
#include <fstream>
#include <string>

class LogWriter {
private:
    std::ofstream m_fileStream;
    std::string m_filename;

public:
    // Constructor acquires file resource
    explicit LogWriter(const std::string& filename)
        : m_filename(filename) {
        m_fileStream.open(m_filename, std::ios::app);
        if (m_fileStream.is_open()) {
            std::cout << "[OPEN]: Opened " << m_filename << " for writing.\n";
            m_fileStream << "--- Session Started ---\n";
        }
    }

    void writeLog(const std::string& entry) {
        if (m_fileStream.is_open()) {
            m_fileStream << "[ENTRY]: " << entry << "\n";
        }
    }

    // Destructor releases file resource automatically!
    ~LogWriter() {
        if (m_fileStream.is_open()) {
            m_fileStream << "--- Session Terminated Safely ---\n";
            m_fileStream.close();
            std::cout << "[CLOSE]: Closed " << m_filename << " in destructor.\n";
        }
    }
};

int main() {
    {
        LogWriter logger("system.log");
        logger.writeLog("User logged in from Shikohabad portal.");
        logger.writeLog("Database query verified.");
    } // 💥 Logger exits scope here: Destructor is guaranteed to close the file!

    std::cout << "Program completed.\n";
    return 0;
}
```

---

## 💡 Key Takeaways
- Destructors make memory and resource leaks virtually impossible when wrapping resources in stack-allocated objects.
- Even if an exception is thrown inside a scope, C++ **stack unwinding** guarantees that destructors of all local objects are faithfully executed.

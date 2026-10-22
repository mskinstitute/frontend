---
id: file-io-ifstream-ofstream
slug: file-io-ifstream-ofstream
course: cpp-for-intermediate
chapter: 6: Exception Handling & File Streams
topic: "File I/O with std::ifstream and std::ofstream"
difficulty: Intermediate
readingTime: 13
order: 27
keywords: ["std::ifstream","std::ofstream","file io","text file reading","file writing","fstream"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📁 File I/O with std::ifstream and std::ofstream

## Introduction
Persistent data storage requires reading and writing files on disk. The **`<fstream>`** header provides stream classes for files:
- **`std::ofstream`**: Output file stream (for writing to disk).
- **`std::ifstream`**: Input file stream (for reading from disk).
- **`std::fstream`**: Bidirectional stream (read and write).

---

## 💾 Writing to a Text File

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    // std::ios::app appends to existing file; default without it truncates/overwrites
    std::ofstream outFile("students.txt", std::ios::out);

    if (!outFile.is_open()) {
        std::cerr << "[ERROR]: Failed to create/open students.txt\n";
        return 1;
    }

    outFile << "101,Aarav Sharma,Modern C++\n";
    outFile << "102,Sneha Gupta,Java Development\n";
    outFile << "103,Vikram Singh,Python Advanced\n";

    outFile.close(); // Explicit close (also closed automatically in destructor)
    std::cout << "Data saved to students.txt successfully!\n";
    return 0;
}
```

---

## 📖 Reading from a Text File Line-by-Line

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream inFile("students.txt");

    if (!inFile.is_open()) {
        std::cerr << "[ERROR]: File not found or inaccessible!\n";
        return 1;
    }

    std::string line;
    int lineCounter = 1;

    std::cout << "=== Reading students.txt ===\n";
    while (std::getline(inFile, line)) {
        std::cout << "Line " << lineCounter++ << ": " << line << "\n";
    }

    return 0;
}
```

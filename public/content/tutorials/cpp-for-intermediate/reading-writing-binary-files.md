---
id: reading-writing-binary-files
slug: reading-writing-binary-files
course: cpp-for-intermediate
chapter: 6: Exception Handling & File Streams
topic: "Reading/Writing Binary Files with read() and write()"
difficulty: Intermediate
readingTime: 13
order: 28
keywords: ["binary files","read and write","reinterpret_cast","binary serialization","fast file io"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💾 Reading and Writing Binary Files with read() and write()

## Introduction
Text files store human-readable ASCII/UTF-8 strings. While easy to read in a text editor, converting numeric types to text strings incurs formatting overhead and consumes extra space. **Binary files** dump exact in-memory bytes directly to disk, providing maximum I/O throughput.

---

## ⚙️ Binary Serialization Syntax

To read or write binary memory, open files with the flag **`std::ios::binary`** and use:
- `stream.write(reinterpret_cast<const char*>(&obj), sizeof(obj));`
- `stream.read(reinterpret_cast<char*>(&obj), sizeof(obj));`

---

## 💻 Full Working Example

```cpp
#include <iostream>
#include <fstream>

struct CourseRecord {
    int courseId;
    double fee;
    int durationWeeks;
};

int main() {
    CourseRecord recordOut{105, 3499.0, 8};

    // 1. Write binary data to disk
    {
        std::ofstream binaryOut("courses.dat", std::ios::binary | std::ios::out);
        if (binaryOut) {
            binaryOut.write(reinterpret_cast<const char*>(&recordOut), sizeof(CourseRecord));
            std::cout << "Wrote " << sizeof(CourseRecord) << " raw bytes to courses.dat\n";
        }
    }

    // 2. Read binary data back into memory
    CourseRecord recordIn{};
    {
        std::ifstream binaryIn("courses.dat", std::ios::binary | std::ios::in);
        if (binaryIn) {
            binaryIn.read(reinterpret_cast<char*>(&recordIn), sizeof(CourseRecord));
            std::cout << "Read back -> ID: " << recordIn.courseId 
                      << " | Fee: ₹" << recordIn.fee 
                      << " | Duration: " << recordIn.durationWeeks << " weeks\n";
        }
    }

    return 0;
}
```

---

## ⚠️ Important Constraint
Only Plain Old Data (POD) structs or Trivially Copyable types can be serialized using raw byte dumps. Classes containing pointers, `std::string`, or virtual tables (`vptr`) cannot be dumped with `reinterpret_cast` because pointer addresses become invalid once the process restarts.

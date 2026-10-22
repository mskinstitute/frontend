---
id: string-streams-stringstream-parsing
slug: string-streams-stringstream-parsing
course: cpp-for-intermediate
chapter: 6: Exception Handling & File Streams
topic: "String Streams with std::stringstream for Parsing"
difficulty: Intermediate
readingTime: 12
order: 29
keywords: ["std::stringstream","string streams","csv parsing","type conversion","sstream"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧵 String Streams with std::stringstream for Parsing

## Introduction
The **`<sstream>`** header provides stream capabilities over in-memory `std::string` objects. **`std::stringstream`** is the standard tool for parsing formatted text, tokenizing CSV records, and converting between numbers and strings.

---

## 🧩 CSV Tokenization with `std::getline`

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

struct StudentEntry {
    int id;
    std::string name;
    double percentage;
};

int main() {
    // Simulated CSV row from database export:
    std::string csvRow = "104,Pradeep Singh,84.5";

    std::stringstream ss(csvRow);
    std::string idStr, name, percentageStr;

    // Tokenize using comma delimiter:
    if (std::getline(ss, idStr, ',') &&
        std::getline(ss, name, ',') &&
        std::getline(ss, percentageStr, ',')) {

        StudentEntry student;
        student.id = std::stoi(idStr);            // String to Integer
        student.name = name;
        student.percentage = std::stod(percentageStr); // String to Double

        std::cout << "Parsed Student Entry:\n";
        std::cout << "  Roll No   : " << student.id << "\n";
        std::cout << "  Name      : " << student.name << "\n";
        std::cout << "  Percentage: " << student.percentage << "%\n";
    }

    return 0;
}
```

---

## 🔄 Building Complex Strings with `stringstream`

```cpp
#include <iostream>
#include <sstream>
#include <iomanip>

int main() {
    std::stringstream buffer;
    buffer << "RECEIPT-#" << 48201 
           << " | Amount: ₹" << std::fixed << std::setprecision(2) << 3499.00
           << " | Status: CLEARED";

    std::string formattedReport = buffer.str();
    std::cout << formattedReport << "\n";
    return 0;
}
```

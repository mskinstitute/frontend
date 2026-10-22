---
id: string-substrings-search-modification
slug: string-substrings-search-modification
course: cpp-for-beginners
chapter: 7: Modern std::string & std::array
topic: "String Substrings, Searching (find()), and Modification (replace, erase)"
difficulty: Beginner
readingTime: 13
order: 30
keywords: ["std::string substr","string find","std::string::npos","erase","replace"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔍 String Substrings, Searching, and Modification

## Introduction
Manipulating text requires searching for patterns, extracting tokens, and replacing substrings. `std::string` offers built-in methods that operate safely without manual memory management.

---

## 🔎 Searching with `.find()` and `std::string::npos`

When `.find()` fails to locate a substring, it returns the sentinel value **`std::string::npos`**:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string email = "admissions@mskinstitute.in";

    std::size_t atIndex = email.find('@');

    if (atIndex != std::string::npos) {
        std::cout << "'@' found at index: " << atIndex << "\n";

        // Extracting substring: substr(startIndex, length)
        std::string username = email.substr(0, atIndex);
        std::string domain = email.substr(atIndex + 1);

        std::cout << "Username: " << username << "\n";
        std::cout << "Domain:   " << domain << "\n";
    } else {
        std::cout << "Invalid email: No '@' found.\n";
    }

    return 0;
}
```

---

## ✏️ Modifying Strings: `replace` and `erase`

```cpp
#include <iostream>
#include <string>

int main() {
    std::string notice = "Class will take place at Hall 1.";

    // Erase 4 characters starting at index 25 ("Hall")
    std::size_t hallPos = notice.find("Hall 1");
    if (hallPos != std::string::npos) {
        notice.replace(hallPos, 6, "Lab 4 (Computer Science Wing)");
    }

    std::cout << "Updated Notice: " << notice << "\n";
    return 0;
}
```

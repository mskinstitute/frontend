---
id: primitive-types-fixed-width-integers
slug: primitive-types-fixed-width-integers
course: cpp-for-beginners
chapter: 2: Variables, Types & Const-Correctness
topic: "Primitive Types (int, double, char, bool) & Fixed-Width Integers (cstdint)"
difficulty: Beginner
readingTime: 13
order: 6
keywords: ["primitive types","cstdint","int32_t","uint64_t","double","bool","type sizes"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔢 Primitive Types & Fixed-Width Integers (cstdint)

## Introduction
Data in C++ is stored in memory cells governed by **data types**. Because traditional C++ fundamental types (`int`, `long`) can change their byte size depending on compiler architecture (32-bit vs 64-bit Windows vs Linux), modern systems programming demands fixed-width types from `<cstdint>`.

---

## 📊 Traditional Fundamental Types

| Type | Typical Size | Typical Range |
|---|---|---|
| `bool` | 1 byte | `true` (1) or `false` (0) |
| `char` | 1 byte | -128 to 127 or 0 to 255 |
| `int` | 4 bytes | -2,147,483,648 to 2,147,483,647 |
| `float` | 4 bytes | ~7 decimal digits of precision |
| `double` | 8 bytes | ~15-17 decimal digits of precision |

```cpp
#include <iostream>

int main() {
    std::cout << "bool: " << sizeof(bool) << " byte(s)\n";
    std::cout << "char: " << sizeof(char) << " byte(s)\n";
    std::cout << "int: " << sizeof(int) << " byte(s)\n";
    std::cout << "double: " << sizeof(double) << " byte(s)\n";
    return 0;
}
```

---

## 🛡️ Modern Fixed-Width Types (`<cstdint>`)

When building cross-platform networking, binary serialization, or graphics engines, always use explicit width integers:

```cpp
#include <iostream>
#include <cstdint>

int main() {
    int8_t  smallInt = -120;     // Exactly 8 bits signed (-128 to 127)
    uint8_t byteData = 255;      // Exactly 8 bits unsigned (0 to 255)
    
    int16_t audioSample = -32000;// Exactly 16 bits (-32768 to 32767)
    uint16_t portNumber = 8080;  // Exactly 16 bits unsigned (0 to 65535)
    
    int32_t userBalance = -5000; // Exactly 32 bits signed
    uint32_t ipAddress = 0xC0A80001; // Exactly 32 bits unsigned
    
    int64_t nanoSeconds = 1000000000000LL; // Exactly 64 bits signed
    uint64_t fileSize = 15482930219ULL;    // Exactly 64 bits unsigned
    
    std::cout << "Port: " << portNumber << ", Size: " << sizeof(fileSize) << " bytes\n";
    return 0;
}
```

---

## 💡 Best Practices:
1. Use `double` for general floating-point math (`float` has severe precision truncation in financial calculations).
2. Use `std::size_t` from `<cstddef>` when indexing containers or counting bytes.
3. Avoid raw `unsigned int` for loops unless counting bitfields, to prevent underflow rollover bugs.

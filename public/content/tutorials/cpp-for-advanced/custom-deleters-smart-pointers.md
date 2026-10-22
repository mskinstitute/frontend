---
id: custom-deleters-smart-pointers
slug: custom-deleters-smart-pointers
course: cpp-for-advanced
chapter: 2: Smart Pointers & RAII Architecture
topic: "Custom Deleters for Smart Pointers (C APIs, File Handles)"
difficulty: Advanced
readingTime: 12
order: 10
keywords: ["custom deleters","smart pointers","c api wrappers","fopen cleanup","raii c-style"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛠️ Custom Deleters for Smart Pointers

## Introduction
By default, smart pointers call `delete` (or `delete[]`) upon destruction. However, when interfacing with legacy C libraries (POSIX sockets, C file pointers `FILE*`, OpenSSL context handles, Win32 handles), cleanup requires custom routines like `fclose()` or `free()`. Modern C++ allows binding **custom deleters** to smart pointers.

---

## 📁 Wrapping `FILE*` in `std::unique_ptr`

```cpp
#include <iostream>
#include <memory>
#include <cstdio>

// Custom Deleter functor for C file handles
struct FileCloser {
    void operator()(std::FILE* fp) const {
        if (fp) {
            std::fclose(fp);
            std::cout << "[RAII]: C File handle closed successfully via fclose().\n";
        }
    }
};

int main() {
    // Syntax: std::unique_ptr<Type, Deleter>
    std::unique_ptr<std::FILE, FileCloser> filePtr(std::fopen("demo.txt", "w"));

    if (filePtr) {
        std::fputs("Testing Modern C++ Custom Deleter.\n", filePtr.get());
        std::cout << "Wrote line to file.\n";
    }

    // When filePtr leaves scope, FileCloser::operator() runs fclose() automatically!
    return 0;
}
```

---

## ⚡ Lambda as Custom Deleter in `std::shared_ptr`
Unlike `unique_ptr` (where the deleter type is part of the template signature), `std::shared_ptr` performs **type erasure** on deleters, allowing clean inline lambda deleters:

```cpp
std::shared_ptr<std::FILE> safeFile(std::fopen("log.txt", "w"), [](std::FILE* f) {
    if (f) std::fclose(f);
});
```

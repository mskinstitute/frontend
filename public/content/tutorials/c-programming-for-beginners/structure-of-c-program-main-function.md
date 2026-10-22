---
id: structure-of-c-program-main-function
slug: structure-of-c-program-main-function
course: c-programming-for-beginners
chapter: Introduction to C & Development Environment
topic: "Structure of a C Program & The main() Function"
difficulty: Beginner
readingTime: 9
order: 4
keywords: ["c program structure","main function in c","return 0","header files","c boilerplate"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏗️ Structure of a C Program & The main() Function

## Introduction
Every C program follows a well-defined architectural anatomy. Understanding each segment ensures you write clean, error-free, and standard-compliant code.

---

## 📐 Anatomy of a C Program

```c
// 1. Documentation Section: Program description and author info
// Program: Welcome Message Generator
// Author: MSK Institute

// 2. Preprocessor Directives: Header files
#include <stdio.h>

// 3. Global Declarations / Constants (Optional)
#define INSTITUTE_NAME "MSK Institute"

// 4. The main() Function: Entry point of execution
int main(void) {
    // 5. Local variable declarations & statements
    printf("Welcome to %s!\n", INSTITUTE_NAME);
    
    // 6. Return statement to the Operating System
    return 0;
}
```

---

## 🔍 Breaking Down the Elements

### 1. `#include <stdio.h>`
- Tells the preprocessor to load the **Standard Input Output Header** file.
- Contains function prototypes for `printf()`, `scanf()`, and file operations.

### 2. `int main(void)`
- The mandatory entry point for every C program. The CPU begins execution here.
- `int`: Specifies that `main()` returns an integer status code to the OS.
- `void`: Explicitly declares that this function accepts no command-line arguments.

### 3. Semicolons (`;`)
- Every statement in C must terminate with a semicolon. It tells the compiler where one instruction ends.

### 4. `return 0;`
- An exit status of `0` indicates to the operating system that the program terminated successfully without runtime errors.
- Any non-zero return value (e.g. `1`, `-1`) signals an error condition.

---

## 📝 Practice Quiz
1. **What is the entry point function of every C program?**
   - A) `start()`
   - B) `init()`
   - C) `main()` (Correct)
   - D) `run()`
2. **What does a `return 0;` statement in main() indicate to the operating system?**
   - A) Program failure
   - B) Successful completion (Correct)
   - C) Infinite loop
   - D) Memory allocation failed


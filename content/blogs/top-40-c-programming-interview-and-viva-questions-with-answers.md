---
id: "blog-c-programming-viva-2026"
slug: "top-40-c-programming-interview-and-viva-questions-with-answers"
title: "Top 40 C Programming Interview & College Viva Questions with Answers (2026 Edition)"
excerpt: "Ace your BCA, B.Tech 1st/2nd semester practical lab viva and IT placement interviews with the top 40 C programming questions, pointer concepts, memory allocation, and code snippets."
coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop"
category: "Programming & Viva"
featured: true
author: "Er. Sumit Kumar"
authorRole: "Founder & Lead Technical Mentor"
authorAvatar: "/assets/img/instructors/sumit-kumar.webp"
publishedAt: "2026-09-25"
readTime: "9 min read"
tags:
  - "C Language"
  - "BCA Viva"
  - "B.Tech CSE"
  - "Viva Questions"
  - "Pointers"
  - "Memory Allocation"
relatedCourses:
  - "dsa-mastery-course"
  - "full-stack-development"
---

Whether you are preparing for your 1st/2nd semester BCA, B.Sc Computer Science, or B.Tech practical lab viva, C programming is the most foundational subject examiners test. External examiners evaluate whether you truly grasp **memory addresses, pointers, and compilation cycles** or simply memorized syntax.

Here is a curated compilation of the top questions most frequently asked by college viva examiners and fresher campus placement interviewers, compiled by **Er. Sumit Kumar** at MSK Institute.

---

## 1. What is the difference between `malloc()`, `calloc()`, `realloc()`, and `free()`?

This is universally the **#1 favorite question** in dynamic memory management:

| Function | Signature | Initialization | Use Case |
| :--- | :--- | :--- | :--- |
| `malloc(size)` | `void* malloc(size_t size)` | **Garbage values** | Allocates single contiguous block of specified bytes. |
| `calloc(n, size)` | `void* calloc(size_t n, size_t size)` | **Zero (`0`)** | Allocates memory for array of elements initialized to 0. |
| `realloc(ptr, size)` | `void* realloc(void* ptr, size_t size)` | Preserves existing data | Dynamically resizes previously allocated memory. |
| `free(ptr)` | `void free(void* ptr)` | Releases memory | Deallocates heap memory back to the OS to avoid memory leaks. |

```c
// Example: Dynamic memory allocation
int *arr = (int*) malloc(5 * sizeof(int));
if (arr == NULL) {
    printf("Memory Allocation Failed!\n");
    return 1;
}
free(arr);
arr = NULL; // Best Practice: avoid dangling pointer!
```

> **Viva Examiner Secret:** Always state that returning `NULL` check is mandatory before accessing dynamically allocated pointers!

---

## 2. What is a Dangling Pointer, Wild Pointer, and Null Pointer?

Examiners love asking you to contrast these three pointer states:

1. **Wild Pointer:** A pointer variable that has been declared but **not initialized**. It points to an arbitrary, unpredictable memory location.
   ```c
   int *ptr; // Wild Pointer! Accessing *ptr may cause Segmentation Fault.
   ```
2. **Dangling Pointer:** A pointer that points to a memory location that has already been deallocated or deleted.
   ```c
   int *p = (int*)malloc(sizeof(int));
   free(p);  // p is now a Dangling Pointer!
   p = NULL; // Safe fix!
   ```
3. **NULL Pointer:** A pointer explicitly assigned to `NULL` (value `0`), signifying that it points to no valid memory address.
   ```c
   int *ptr = NULL; // Safe pointer initialization
   ```

---

## 3. What is the fundamental difference between Structure and Union?

Both define user-defined heterogeneous data types, but their memory footprints are drastically different:

- **Structure (`struct`):** Every member gets its own independent memory space. The total size is at least the sum of all members' sizes (plus struct padding).
- **Union (`union`):** All members **share the same single memory location**. The total size is equal to the size of its largest data member. Only one member can hold a value at any given moment.

```c
struct Student {
    int roll;      // 4 bytes
    char grade;    // 1 byte
    double marks;  // 8 bytes
}; // Total size = approx 16 bytes (due to memory alignment)

union Data {
    int roll;      // 4 bytes
    char grade;    // 1 byte
    double marks;  // 8 bytes
}; // Total size = exactly 8 bytes (size of largest member)
```

---

## 4. What is the difference between Call by Value and Call by Reference?

- **Call by Value:** A copy of the actual argument value is passed to the function parameter. Changes made inside the function **do not affect** the original caller variable.
- **Call by Reference (Using Pointers in C):** The memory address of the actual argument is passed using `&`. The function dereferences the pointer (`*`) to modify the original variable directly in memory.

```c
// Swapping using Call by Reference (Pointers)
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x = %d, y = %d\n", x, y); // x = 20, y = 10
    return 0;
}
```

---

## 5. What are the four Storage Classes in C?

Storage classes define the **scope**, **lifetime**, **default initial value**, and **memory location** of variables:

1. **`auto` (Automatic):** Default for local variables. Stored on Stack. Scope: Local to block. Lifetime: Until block exits. Initial value: Garbage.
2. **`static`:** Retains its value between multiple function invocations. Stored in Data Segment. Scope: Local to function/file. Lifetime: Throughout program execution. Default: `0`.
3. **`extern` (External):** Global variable defined in another file or outer scope.
4. **`register`:** Requests the compiler to store the variable inside a CPU register instead of RAM for ultra-fast access (frequently used in loop counters).

---

## 6. What is a Segmentation Fault (Core Dumped) and what triggers it?

A **Segmentation Fault (SegFault)** occurs when a program attempts to access a memory segment that it is not authorized to read or write by the operating system.

Common triggers:
- Dereferencing a `NULL` or wild pointer (`*ptr = 10;` when `ptr = NULL`).
- Writing past array boundaries (Buffer Overflow).
- Stack Overflow caused by infinite recursion.
- Writing to read-only string literals (`char *str = "Hello"; str[0] = 'M';`).

---

## 7. How does a Preprocessor Macro (`#define`) differ from `typedef`?

- **`#define`:** Processed by the **C Preprocessor** before compilation via simple textual substitution. It does not perform type checking.
- **`typedef`:** Processed by the **C Compiler** itself. It creates a formal type alias and obeys scope rules with full compiler type checking.

```c
#define PINT int*
typedef int* IntPtr;

PINT a, b;    // Becomes: int *a, b; -> 'a' is pointer, 'b' is regular int!
IntPtr x, y;  // Both 'x' and 'y' are pointers to int!
```

> **Pro Tip:** This trap is frequently tested in written placement tests at TCS, Infosys, and Wipro!

---

## 8. How to reverse a string in-place without `strrev()`?

Examiners often ban standard library string functions to test your fundamental pointer manipulation:

```c
#include <stdio.h>
#include <string.h>

void reverseString(char *str) {
    int start = 0;
    int end = strlen(str) - 1;
    while (start < end) {
        char temp = str[start];
        str[start] = str[end];
        str[end] = temp;
        start++;
        end--;
    }
}

int main() {
    char greeting[] = "MSK Institute";
    reverseString(greeting);
    printf("Reversed: %s\n", greeting); // etutitsnI KSM
    return 0;
}
```

---

## 9. How to swap two numbers without a third variable using bitwise XOR?

```c
int a = 15, b = 25;
a = a ^ b;
b = a ^ b;
a = a ^ b;
printf("a = %d, b = %d\n", a, b); // a = 25, b = 15
```

---

## 10. Summary & Top 5 Golden Rules for College Lab Viva

1. **Be Confident with Pointer Symbols:** Always explain that `&` means *"Address of"* and `*` when used with a pointer variable means *"Value at address (dereference)"*.
2. **Never Write Code on Paper Without Semicolons:** Examiners instantly deduct marks for missing semicolons and unclosed braces.
3. **Explain Memory Allocation Verbally:** Don't just recite code; explain that local variables reside on the **Stack**, dynamic allocations on the **Heap**, and global constants in the **Data Segment**.
4. **Practice Running Code Live:** Use our free browser compiler at [MSK Code Playground](/playground) to test pointer math and string manipulations right now.
5. **Join Our Hands-On Coding Lab:** At MSK Institute in Shikohabad and our interactive online live batches, students write and debug over 150+ algorithms with personal mentor feedback.

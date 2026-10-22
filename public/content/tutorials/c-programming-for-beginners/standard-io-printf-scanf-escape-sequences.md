---
id: standard-io-printf-scanf-escape-sequences
slug: standard-io-printf-scanf-escape-sequences
course: c-programming-for-beginners
chapter: Introduction to C & Development Environment
topic: "Standard I/O: printf(), scanf(), and Escape Sequences"
difficulty: Beginner
readingTime: 10
order: 5
keywords: ["printf","scanf","escape sequences in c","newline tab","standard io"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🖨️ Standard I/O: printf(), scanf(), and Escape Sequences

## Introduction
Input and output operations are how your program communicates with the user. In C, standard input and output are provided by the `<stdio.h>` library via two central functions: `printf()` and `scanf()`.

---

## 📤 Output with `printf()`
`printf()` sends formatted text to the standard output terminal (stdout).

```c
#include <stdio.h>

int main(void) {
    int age = 20;
    double score = 95.5;
    
    printf("Age: %d, Score: %.1f%%\n", age, score);
    return 0;
}
```

---

## 📥 Input with `scanf()`
`scanf()` reads formatted data from the keyboard (stdin).
> ⚠️ **Critical Rule**: You must pass the **address-of** (`&`) operator before non-pointer variables so `scanf` knows where to write in memory!

```c
#include <stdio.h>

int main(void) {
    int rollNumber;
    printf("Enter your roll number: ");
    scanf("%d", &rollNumber);
    
    printf("Registered Roll Number: %d\n", rollNumber);
    return 0;
}
```

---

## ⚡ Essential Escape Sequences
Escape sequences are special character combinations prefixed with a backslash (`\`):

| Sequence | Name | Description |
| :---: | :--- | :--- |
| `\n` | Newline | Moves the cursor to the beginning of the next line. |
| `\t` | Horizontal Tab | Skips forward to the next tab stop (typically 4 or 8 spaces). |
| `\\` | Backslash | Prints an actual backslash character. |
| `\"` | Double Quote | Prints a double quotation mark inside a string literal. |
| `\b` | Backspace | Moves the cursor back one character space. |
| `\r` | Carriage Return | Moves the cursor to the start of the current line. |

---

## 📝 Practice Quiz
1. **Why must the '&' operator be used before variable names in `scanf("%d", &x)`?**
   - A) To tell C it is a constant
   - B) To pass the variable's memory address (Correct)
   - C) To format the text
   - D) To prevent memory leaks
2. **Which escape sequence moves the terminal cursor to a new line?**
   - A) `\t`
   - B) `\r`
   - C) `\n` (Correct)
   - D) `\a`


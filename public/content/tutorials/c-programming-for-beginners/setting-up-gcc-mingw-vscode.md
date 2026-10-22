---
id: setting-up-gcc-mingw-vscode
slug: setting-up-gcc-mingw-vscode
course: c-programming-for-beginners
chapter: Introduction to C & Development Environment
topic: "Setting up GCC, MinGW, and VS Code for C Development"
difficulty: Beginner
readingTime: 10
order: 3
keywords: ["gcc setup","mingw w64","vs code c","c environment windows","clang"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💻 Setting up GCC, MinGW, and VS Code for C Development

## Introduction
To write, compile, and debug C programs on your computer, you need two fundamental tools:
1. A **C Compiler** (such as GCC via MinGW-w64 on Windows, or Clang/GCC on Linux/macOS).
2. A **Code Editor** (such as Visual Studio Code).

---

## 🛠️ Step 1: Installing the GCC Compiler on Windows
1. Download **MinGW-w64** (via MSYS2 or standalone WinLibs).
2. Extract the package to `C:\mingw64`.
3. Add `C:\mingw64\bin` to your Windows **System Environment PATH**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter.
   - Go to **Advanced** tab ➔ Click **Environment Variables**.
   - Under System Variables, select **Path** ➔ Click **Edit** ➔ Click **New** ➔ Paste `C:\mingw64\bin`.
   - Click OK to save all dialogs.
4. Open a new Command Prompt or PowerShell window and verify:
```bash
gcc --version
```
If installed correctly, you will see output like:
```text
gcc (Rev2, Built by MSYS2 project) 13.2.0
```

---

## 🎨 Step 2: Configuring Visual Studio Code
1. Download and install **VS Code** from [code.visualstudio.com](https://code.visualstudio.com/).
2. Open the **Extensions View** (`Ctrl + Shift + X`) and install:
   - **C/C++** (by Microsoft)
   - **Code Runner** (by Jun Han)
   - **C/C++ Extension Pack**

---

## 🚀 Step 3: Writing & Compiling Your First Test Script
Create a new file named `hello.c`:
```c
#include <stdio.h>

int main(void) {
    printf("Hello from MSK Institute! C is working.\n");
    return 0;
}
```

Compile and run via terminal:
```bash
gcc hello.c -o hello.exe
.\hello.exe
```

Output:
```text
Hello from MSK Institute! C is working.
```

---

## 📝 Practice Quiz
1. **Which command checks the installed version of GCC?**
   - A) `gcc -test`
   - B) `gcc --version` (Correct)
   - C) `gcc -v -run`
   - D) `c --version`
2. **What environment variable must be updated on Windows so terminal commands find gcc?**
   - A) CLASSPATH
   - B) TEMP
   - C) PATH (Correct)
   - D) ROOT


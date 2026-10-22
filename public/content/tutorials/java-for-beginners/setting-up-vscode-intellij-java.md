---
id: setting-up-vscode-intellij-java
slug: setting-up-vscode-intellij-java
course: java-for-beginners
chapter: 1: Java Ecosystem & Development Setup
topic: "Setting up VS Code / IntelliJ IDEA for Java Development"
difficulty: Beginner
readingTime: 12
order: 4
keywords: ["vscode java","intellij idea","java ide","extension pack for java","run java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💻 Setting up VS Code & IntelliJ IDEA for Java

## Introduction
While code can be written in any text editor, professional Java development thrives in dedicated Integrated Development Environments (IDEs) with smart autocomplete, refactoring, and debugging.

---

## 🛠️ Setting up Visual Studio Code for Java

1. Install the official Microsoft **Extension Pack for Java** (`vscjava.vscode-java-pack`).
   - Includes: Language Support for Java (Eclipse JDT), Debugger for Java, Test Runner, Maven/Gradle project manager.
2. Open any folder in VS Code, create a file named `Main.java`, and type `main` followed by `Tab` to trigger code snippets.
3. Click the **Run** or **Debug** button above `main()` to execute.

---

## 🏢 Setting up IntelliJ IDEA (The Industry Standard)

**IntelliJ IDEA Community Edition** by JetBrains is the most popular Java IDE worldwide:
1. Download IntelliJ IDEA Community Edition from [jetbrains.com](https://www.jetbrains.com/idea/).
2. Launch and select **New Project** `->` **Java** `->` Select detected OpenJDK 21.
3. Features:
   - Deep structural code inspections and automated quick-fixes (`Alt + Enter`).
   - Built-in Git version control integration and terminal.
   - Comprehensive test runner and live profiler.

---

## 💡 Pro Tip: Single-File Source-Code Execution (Java 11+)
Since Java 11, you can run a single `.java` file directly without calling `javac` first:
```bash
java Main.java
```
The JVM compiles it in memory and runs it immediately!

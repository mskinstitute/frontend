---
id: modern-java-nio-path-files
slug: modern-java-nio-path-files
course: java-for-intermediate
chapter: 6: Collections Framework - Maps & File I/O
topic: "Modern Java NIO: java.nio.file.Path and java.nio.file.Files"
difficulty: Intermediate
readingTime: 13
order: 28
keywords: ["java nio","java.nio.file.Path","Files.readString","Files.writeString","modern file io"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 Modern Java NIO: Path and Files Utility (Java 11+)

## Introduction
Modern Java development prefers **Java NIO.2 (`java.nio.file`)** over legacy `java.io.File`. Classes like **`Path`** and **`Files`** allow complete file operations in a single line of code!

---

## ⚡ Reading and Writing Files in One Line

```java
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;
import java.util.List;

public class NioDemo {
    public static void main(String[] args) throws IOException {
        Path filePath = Paths.get("notes.txt");

        // 1. One-line file write (Java 11+):
        Files.writeString(filePath, "MSK Institute - Modern Java Track 2026\nSecond Line");

        // 2. One-line file read into String:
        String content = Files.readString(filePath);
        System.out.println("Content:\n" + content);

        // 3. One-line read all lines into List:
        List<String> lines = Files.readAllLines(filePath);
        System.out.println("Total lines: " + lines.size());
    }
}
```

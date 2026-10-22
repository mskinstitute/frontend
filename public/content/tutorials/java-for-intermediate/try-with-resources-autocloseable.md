---
id: try-with-resources-autocloseable
slug: try-with-resources-autocloseable
course: java-for-intermediate
chapter: 4: Exception Handling & Robustness
topic: "Automatic Resource Management: try-with-resources and AutoCloseable"
difficulty: Intermediate
readingTime: 13
order: 18
keywords: ["try with resources","AutoCloseable","automatic resource management","java 7 arm","file closing"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 Automatic Resource Management: try-with-resources

## Introduction
Before Java 7, closing file streams or database connections required messy nested `finally` blocks. **try-with-resources** guarantees that any resource implementing **`java.lang.AutoCloseable`** is closed automatically when exiting the block!

---

## 💻 Clean Stream Handling

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class TryWithResourcesDemo {
    public static void main(String[] args) {
        // Resource declared in parenthesis inside try header:
        try (BufferedReader reader = new BufferedReader(new FileReader("students.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Read: " + line);
            }
        } catch (IOException e) {
            System.err.println("File read failed: " + e.getMessage());
        }
        // 'reader' is GUARANTEED to be closed here automatically!
    }
}
```

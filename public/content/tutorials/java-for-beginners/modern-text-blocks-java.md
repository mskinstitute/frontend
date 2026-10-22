---
id: modern-text-blocks-java
slug: modern-text-blocks-java
course: java-for-beginners
chapter: 6: String Handling & Text Manipulation
topic: "Modern Text Blocks (\"\"\") in Java 15+"
difficulty: Beginner
readingTime: 12
order: 29
keywords: ["text blocks java","triple quotes","multiline strings","json sql in java","java 15"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📄 Modern Text Blocks (""") in Java 15+

## Introduction
Before Java 15, writing multi-line strings (HTML, JSON, SQL queries) required ugly concatenation and escaped quotes (`"SELECT * FROM "students" \n" + ...`). **Text Blocks** introduce native multi-line strings using triple quotes (`"""`).

---

## 💻 Multi-Line Formatting

```java
public class TextBlockDemo {
    public static void main(String[] args) {
        // Multi-line JSON string:
        String jsonPayload = """
            {
                "institute": "MSK Institute",
                "branch": "Shikohabad",
                "activeCourses": ["C", "C++", "Java"],
                "batchYear": 2026
            }
            """;

        // Multi-line SQL Query:
        String sql = """
            SELECT roll_number, full_name, gpa
            FROM students
            WHERE gpa >= 8.5
            ORDER BY gpa DESC;
            """;

        System.out.println(jsonPayload);
        System.out.println(sql);
    }
}
```

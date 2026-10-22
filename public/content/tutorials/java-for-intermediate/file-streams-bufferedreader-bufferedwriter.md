---
id: file-streams-bufferedreader-bufferedwriter
slug: file-streams-bufferedreader-bufferedwriter
course: java-for-intermediate
chapter: 6: Collections Framework - Maps & File I/O
topic: "File Streams: FileReader, FileWriter, BufferedReader, and BufferedWriter"
difficulty: Intermediate
readingTime: 13
order: 27
keywords: ["filereader","filewriter","bufferedreader","bufferedwriter","file io java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📁 File Streams: BufferedReader and BufferedWriter

## Introduction
Reading and writing text files on disk is standard for logs and persistence. While `FileReader` reads character-by-character from disk (slow), wrapping it in **`BufferedReader`** batches reads through an internal memory buffer for 50x faster I/O.

---

## 💻 Writing and Reading Files

```java
import java.io.BufferedWriter;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

public class FileIODemo {
    public static void main(String[] args) {
        String filename = "students_db.csv";

        // 1. Fast writing with BufferedWriter
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename))) {
            writer.write("101,Aarav Sharma,Java Intermediate\n");
            writer.write("102,Sneha Gupta,Modern C++\n");
            System.out.println("Records written to " + filename);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 2. Fast reading line-by-line with BufferedReader
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Line: " + line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

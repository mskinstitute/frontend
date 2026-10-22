---
id: "java-adv-t7.1"
title: "Capstone 1: Multithreaded Web Downloader & File Processor with ExecutorService"
slug: "project-1-multithreaded-downloader-file-processor"
course: "Java for Advanced"
chapter: "7: Enterprise Capstone Projects"
topic: "Capstone 1: Multithreaded Web Downloader & File Processor with ExecutorService"
difficulty: "Advanced"
readingTime: 20
order: 29
keywords: ["capstone project","multithreaded downloader","executorservice","concurrenthashmap","future task processing"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🚀 Capstone 1: Multithreaded Web Downloader & File Processor with ExecutorService

## Project Overview
In this capstone project, we architect and implement a **high-throughput, multithreaded file batch processor and word frequency analytics engine**. 

The system distributes document analysis across worker threads using `ExecutorService`, aggregates data safely using `ConcurrentHashMap`, and utilizes `Future<T>` to monitor asynchronous job completion.

---

## 📐 System Architecture

```text
                  [ Input Batch of Documents ]
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
     Worker Thread 1     Worker Thread 2     Worker Thread 3
   [ Document 1 Analysis ] [ Document 2 Analysis ] [ Document 3 Analysis ]
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
            Thread-Safe Merge into ConcurrentHashMap
                              │
                              ▼
        Stream API: Top 10 Most Frequent Words Ranking
```

---

## 💻 Complete Production Implementation

```java
package com.mskinstitute.capstone1;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

public class BatchDocumentAnalyticsEngine {

    // Record for document task specification
    public record DocumentTask(String documentId, String textContent) {}

    // Record for document analytics result
    public record TaskResult(String documentId, int wordCount, Map<String, Integer> wordFrequency) {}

    public static void main(String[] args) throws Exception {
        // Sample document batch
        List<DocumentTask> batch = List.of(
            new DocumentTask("DOC-101", "Java concurrency enables high performance enterprise server development"),
            new DocumentTask("DOC-102", "Streams API and lambda expressions simplify functional data pipelines in Java"),
            new DocumentTask("DOC-103", "Multithreaded Java applications utilize thread pools and ExecutorService for scaling"),
            new DocumentTask("DOC-104", "Enterprise Java applications rely on high performance JDBC and concurrent data structures")
        );

        int poolSize = Runtime.getRuntime().availableProcessors();
        ExecutorService executor = Executors.newFixedThreadPool(poolSize);

        System.out.println("⚡ Starting batch processor with thread pool size: " + poolSize);
        long startTime = System.currentTimeMillis();

        // Submit tasks as Callable jobs returning TaskResult
        List<Future<TaskResult>> futures = new ArrayList<>();
        for (DocumentTask doc : batch) {
            Callable<TaskResult> task = () -> {
                String threadName = Thread.currentThread().getName();
                System.out.printf("[%s] Processing %s...%n", threadName, doc.documentId());

                String[] words = doc.textContent().toLowerCase().split("\\W+");
                Map<String, Integer> freq = new HashMap<>();
                for (String w : words) {
                    if (!w.isBlank()) {
                        freq.put(w, freq.getOrDefault(w, 0) + 1);
                    }
                }
                return new TaskResult(doc.documentId(), words.length, freq);
            };
            futures.add(executor.submit(task));
        }

        // Global thread-safe accumulator
        ConcurrentMap<String, Integer> globalFrequencies = new ConcurrentHashMap<>();
        int totalWordsProcessed = 0;

        // Collect and aggregate asynchronous results
        for (Future<TaskResult> future : futures) {
            TaskResult result = future.get(10, TimeUnit.SECONDS); // Block with timeout
            totalWordsProcessed += result.wordCount();
            
            result.wordFrequency().forEach((word, count) -> {
                globalFrequencies.merge(word, count, Integer::sum);
            });
        }

        // Graceful shutdown
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        long duration = System.currentTimeMillis() - startTime;
        System.out.printf("✅ Processed %d words across %d documents in %d ms.%n%n", 
            totalWordsProcessed, batch.size(), duration);

        // Top 5 Most Frequent Words via Stream API
        System.out.println("🏆 TOP 5 MOST FREQUENT WORDS:");
        globalFrequencies.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(5)
            .forEach(e -> System.out.printf("  • %-15s : %d occurrences%n", e.getKey(), e.getValue()));
    }
}
```

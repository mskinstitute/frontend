---
id: "java-adv-t3.2"
title: "Intermediate Operations: filter(), map(), flatMap(), sorted(), distinct()"
slug: "stream-intermediate-operations-filter-map-flatmap"
course: "Java for Advanced"
chapter: "3: Java Streams API & Data Pipelines"
topic: "Intermediate Operations: filter(), map(), flatMap(), sorted(), distinct()"
difficulty: "Advanced"
readingTime: 16
order: 12
keywords: ["filter","map","flatmap","distinct","sorted","intermediate operations"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# ⚙️ Intermediate Operations: filter(), map(), flatMap(), sorted(), distinct()

## Introduction
**Intermediate operations** return a new `Stream<T>`. Because they return a stream, they can be chained into an expressive transformation pipeline. They are stateless or stateful, and always lazy.

---

## 🛠️ Detailed Breakdown of Core Operations

### 1. `filter(Predicate<T>)`
Discards elements that do not satisfy the condition:
```java
List<Integer> scores = List.of(45, 82, 91, 38, 77);
scores.stream()
      .filter(s -> s >= 75) // Keeps only scores >= 75
      .forEach(System.out::println); // Output: 82, 91, 77
```

### 2. `map(Function<T, R>)`
Transforms each element 1-to-1 into another representation:
```java
List<String> cities = List.of("Delhi", "Agra", "Shikohabad");
List<Integer> lengths = cities.stream()
                              .map(String::length)
                              .toList(); // [5, 4, 10]
```

### 3. `flatMap(Function<T, Stream<R>>)`
Flattens multiple nested collections or streams (1-to-N) into a single unified stream:
```java
List<List<String>> courseModules = List.of(
    List.of("Variables", "Operators"),
    List.of("Classes", "Objects"),
    List.of("Threads", "Generics")
);

// Flatten into 1 flat stream:
List<String> allTopics = courseModules.stream()
                                      .flatMap(List::stream)
                                      .toList();
System.out.println(allTopics); 
// [Variables, Operators, Classes, Objects, Threads, Generics]
```

### 4. `distinct()` & `sorted()`
```java
List<Integer> duplicates = List.of(5, 2, 9, 2, 5, 1);
duplicates.stream()
          .distinct()                   // Removes duplicates
          .sorted()                     // Natural sorting (1, 2, 5, 9)
          .forEach(System.out::println);
```

### 5. `limit(n)` & `skip(n)`
Used for stream pagination:
```java
List<String> page2 = allTopics.stream()
                              .skip(2)  // Skip first 2 items
                              .limit(2) // Take next 2 items
                              .toList();
```

---
id: "java-adv-t3.4"
title: "Collectors Utility: groupingBy(), partitioningBy(), joining(), toList()"
slug: "collectors-groupingby-partitioningby-joining"
course: "Java for Advanced"
chapter: "3: Java Streams API & Data Pipelines"
topic: "Collectors Utility: groupingBy(), partitioningBy(), joining(), toList()"
difficulty: "Advanced"
readingTime: 16
order: 14
keywords: ["collectors","groupingby","partitioningby","joining","downstream collectors","java 8"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 📊 Collectors Utility: groupingBy(), partitioningBy(), joining(), toList()

## Introduction
The **`java.util.stream.Collectors`** utility class is the powerhouse of the Stream API. It implements complex aggregation, partitioning, string joining, and multi-level data restructuring with minimal declarative code.

---

## 1. `Collectors.joining()`
Concatenates String representations with optional delimiters, prefixes, and suffixes:

```java
List<String> tags = List.of("Java", "Spring Boot", "Docker", "Microservices");

String formatted = tags.stream()
                       .collect(Collectors.joining(", ", "[", "]"));
System.out.println(formatted); 
// Output: [Java, Spring Boot, Docker, Microservices]
```

---

## 2. `Collectors.partitioningBy()`
Partitions elements into two groups (`true` and `false`) using a `Predicate`:

```java
record Employee(String name, String department, double salary) {}

List<Employee> staff = List.of(
    new Employee("Aarav", "IT", 85000),
    new Employee("Neha", "HR", 45000),
    new Employee("Rohit", "IT", 92000),
    new Employee("Pooja", "Finance", 60000)
);

// Partition into High Earners (salary >= 70000) and Standard
Map<Boolean, List<Employee>> partitioned = staff.stream()
    .collect(Collectors.partitioningBy(e -> e.salary() >= 70000));

System.out.println("High Earners: " + partitioned.get(true));
System.out.println("Others: " + partitioned.get(false));
```

---

## 3. `Collectors.groupingBy()` (SQL-like GROUP BY)

Groups stream elements by a classification function into a `Map<Key, List<T>>`:

```java
// Group employees by department
Map<String, List<Employee>> byDept = staff.stream()
    .collect(Collectors.groupingBy(Employee::department));

// IT => [Aarav, Rohit], HR => [Neha], Finance => [Pooja]
```

### Downstream Collectors (Calculating Averages or Counts):
```java
// Average salary per department
Map<String, Double> avgSalaryByDept = staff.stream()
    .collect(Collectors.groupingBy(
        Employee::department,
        Collectors.averagingDouble(Employee::salary)
    ));
```

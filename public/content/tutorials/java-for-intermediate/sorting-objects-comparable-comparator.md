---
id: sorting-objects-comparable-comparator
slug: sorting-objects-comparable-comparator
course: java-for-intermediate
chapter: 5: Java Collections Framework - Lists & Sets
topic: "Sorting Objects: Comparable<T> and Comparator<T>"
difficulty: Intermediate
readingTime: 14
order: 24
keywords: ["comparable vs comparator","sorting objects java","collections.sort","compareto method","lambda comparator"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔀 Sorting Objects: Comparable vs Comparator

## Introduction
Sorting primitives is straightforward, but sorting domain objects (like `Student` by GPA, roll number, or name) requires defining comparison logic through **`Comparable`** (natural order) or **`Comparator`** (custom multiple sort strategies).

---

## 🆚 Comparable vs Comparator

- **`Comparable<T>`**: Implemented inside the domain class itself via `compareTo(T other)`.
- **`Comparator<T>`**: Separate standalone comparison logic (often written as modern lambda expressions: `Comparator.comparing(Student::getGpa)`).

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

class Student implements Comparable<Student> {
    int roll;
    String name;
    double gpa;

    public Student(int r, String n, double g) {
        this.roll = r; this.name = n; this.gpa = g;
    }

    // Natural ordering: by Roll Number ascending
    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.roll, other.roll);
    }

    public double getGpa() { return gpa; }
    public String getName() { return name; }
    @Override public String toString() { return name + " (" + gpa + ")"; }
}

public class SortingDemo {
    public static void main(String[] args) {
        List<Student> students = new ArrayList<>();
        students.add(new Student(105, "Deepak", 7.8));
        students.add(new Student(101, "Ananya", 9.6));
        students.add(new Student(103, "Vikram", 8.4));

        // 1. Natural Sort (Roll Number via Comparable):
        Collections.sort(students);

        // 2. Custom Sort: Highest GPA first using Modern Comparator lambda:
        students.sort(Comparator.comparingDouble(Student::getGpa).reversed());

        System.out.println("Sorted by Highest GPA: " + students);
    }
}
```

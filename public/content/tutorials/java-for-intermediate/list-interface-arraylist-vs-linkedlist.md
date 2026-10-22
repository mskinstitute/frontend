---
id: list-interface-arraylist-vs-linkedlist
slug: list-interface-arraylist-vs-linkedlist
course: java-for-intermediate
chapter: 5: Java Collections Framework - Lists & Sets
topic: "List Interface: ArrayList vs LinkedList (Performance & Internal Arrays)"
difficulty: Intermediate
readingTime: 14
order: 21
keywords: ["arraylist vs linkedlist","list interface","dynamic array java","doubly linked list","collections performance"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📋 List Interface: ArrayList vs LinkedList

## Introduction
The **`List`** interface represents an ordered sequence of elements that allows duplicates and positional access by index. The two primary implementations are **`ArrayList`** and **`LinkedList`**.

---

## 🆚 Architecture Comparison

| Feature | `ArrayList` | `LinkedList` |
|---|---|---|
| Underlying Data Structure | **Dynamic Resizing Array** on heap | **Doubly-Linked List** of node objects |
| Random Access (`get(i)`) | **O(1) Instant** (Pointer math) | **O(N) Slow** (Must traverse from head/tail) |
| Insertion at End | **O(1) Amortized** | **O(1)** |
| Insertion at Beginning / Middle | O(N) (Shifts array elements) | **O(1)** (Once iterator is positioned) |
| Memory Overhead | Very Low (Contiguous array) | Higher (Extra prev/next node references) |
| Recommendation | **Default choice for 95% of use cases** | Only for high-frequency queues/deques |

```java
import java.util.List;
import java.util.ArrayList;

public class ListDemo {
    public static void main(String[] args) {
        List<String> studentList = new ArrayList<>();
        studentList.add("Aarav");
        studentList.add("Pooja");
        studentList.add("Vikram");

        System.out.println("Second Student: " + studentList.get(1)); // O(1) Access!
    }
}
```

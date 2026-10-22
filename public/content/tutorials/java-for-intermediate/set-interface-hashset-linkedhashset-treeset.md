---
id: set-interface-hashset-linkedhashset-treeset
slug: set-interface-hashset-linkedhashset-treeset
course: java-for-intermediate
chapter: 5: Java Collections Framework - Lists & Sets
topic: "Set Interface: HashSet (Hashing), LinkedHashSet, and TreeSet (Red-Black Tree)"
difficulty: Intermediate
readingTime: 14
order: 22
keywords: ["set interface","hashset","linkedhashset","treeset","duplicate elimination","sorted set"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎯 Set Interface: HashSet, LinkedHashSet, and TreeSet

## Introduction
A **`Set`** is a collection that contains **no duplicate elements**. The 3 standard implementations offer different ordering guarantees:

---

## 📊 The Three Set Implementations

| Set Class | Order Guarantee | Performance | Underlying Data Structure |
|---|---|---|---|
| **`HashSet`** | **No Order** (Unordered / Arbitrary) | **O(1) Fastest** | Hash Table (backed by HashMap) |
| **`LinkedHashSet`**| **Insertion Order** preserved | O(1) Fast | Hash Table + Doubly-Linked List |
| **`TreeSet`** | **Natural Sorted Order** (Ascending) | **O(log N)** | Red-Black Tree (TreeMap) |

```java
import java.util.Set;
import java.util.HashSet;
import java.util.TreeSet;

public class SetDemo {
    public static void main(String[] args) {
        Set<String> uniqueCities = new HashSet<>();
        uniqueCities.add("Shikohabad");
        uniqueCities.add("Firozabad");
        uniqueCities.add("Shikohabad"); // Duplicate silently rejected!

        System.out.println("HashSet (Duplicates rejected): " + uniqueCities.size()); // 2

        Set<Integer> sortedNumbers = new TreeSet<>(Set.of(45, 12, 89, 23, 7));
        System.out.println("TreeSet (Automatically Sorted): " + sortedNumbers); // [7, 12, 23, 45, 89]
    }
}
```

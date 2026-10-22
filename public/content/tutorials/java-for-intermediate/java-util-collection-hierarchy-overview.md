---
id: java-util-collection-hierarchy-overview
slug: java-util-collection-hierarchy-overview
course: java-for-intermediate
chapter: 5: Java Collections Framework - Lists & Sets
topic: "Overview of java.util.Collection Hierarchy"
difficulty: Intermediate
readingTime: 13
order: 20
keywords: ["collections framework java","collection hierarchy","list set map","java.util","generic collections"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📚 Overview of the Java Collections Framework (JCF)

## Introduction
The **Java Collections Framework (JCF)** provides a unified architecture for storing and manipulating groups of objects. Located in **`java.util`**, it provides standardized data structures and algorithms with high performance and type safety.

---

## 🏛️ Core Interfaces Hierarchy

```text
                          Iterable<E>
                              │
                        Collection<E>
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
         List<E>           Set<E>            Queue<E>
      (Ordered, dupes) (Unique items)     (FIFO Processing)
      ├── ArrayList     ├── HashSet       ├── ArrayDeque
      └── LinkedList    └── TreeSet       └── PriorityQueue

   [ Note: Map<K,V> is part of JCF but does NOT extend Collection! ]
   ├── HashMap
   └── TreeMap
```

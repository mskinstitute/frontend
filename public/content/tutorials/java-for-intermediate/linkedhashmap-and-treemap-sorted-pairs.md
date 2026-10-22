---
id: linkedhashmap-and-treemap-sorted-pairs
slug: linkedhashmap-and-treemap-sorted-pairs
course: java-for-intermediate
chapter: 6: Collections Framework - Maps & File I/O
topic: "LinkedHashMap and TreeMap for Sorted Key-Value Pairs"
difficulty: Intermediate
readingTime: 13
order: 26
keywords: ["linkedhashmap","treemap","sorted map","navigablemap","lru cache java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🌲 LinkedHashMap and TreeMap for Ordered Key-Value Pairs

## Introduction
While `HashMap` provides maximum speed with no ordering, enterprise scenarios often require preserving insertion order or maintaining keys in strict sorted order.

---

## 📊 Comparison

| Map Type | Key Ordering | Complexity | Best Use Case |
|---|---|---|---|
| **`HashMap`** | Arbitrary | O(1) Average | General dictionaries, caches |
| **`LinkedHashMap`** | **Insertion Order** | O(1) | LRU Caches, predictable iteration |
| **`TreeMap`** | **Sorted Key Order** | **O(log N)** | Range queries, alphabetical indexes |

```java
import java.util.Map;
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> studentRolls = new TreeMap<>();
        studentRolls.put("Vikram", 105);
        studentRolls.put("Aarav", 101);
        studentRolls.put("Pooja", 103);

        // Traverses in strictly sorted alphabetical order of keys:
        studentRolls.forEach((name, roll) -> {
            System.out.printf("%s -> Roll #%d%n", name, roll);
        });
    }
}
```

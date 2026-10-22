---
id: mutable-strings-stringbuilder-stringbuffer
slug: mutable-strings-stringbuilder-stringbuffer
course: java-for-beginners
chapter: 6: String Handling & Text Manipulation
topic: "Mutable Strings: StringBuilder vs StringBuffer for Performance"
difficulty: Beginner
readingTime: 13
order: 28
keywords: ["stringbuilder","stringbuffer","mutable strings","string concatenation loop","performance"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Mutable Strings: StringBuilder vs StringBuffer

## Introduction
Because Java `String` is immutable, concatenating strings in a loop (`str += i`) creates a brand-new object on every iteration, destroying performance and triggering heavy garbage collection. For repetitive modifications, use **`StringBuilder`**.

---

## ⚠️ The String Concatenation Loop Trap

```java
// ❌ HORRIBLE: Allocates 10,000 temporary String objects on the heap!
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i; // Incurs O(N^2) memory copying!
}

// ✅ OPTIMAL: Mutates a single internal char array buffer in O(N) time!
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

---

## 🆚 StringBuilder vs StringBuffer

| Feature | `StringBuilder` | `StringBuffer` |
|---|---|---|
| Introduced | Java 5 | Java 1.0 |
| Thread Safety | **Not Thread-Safe** (No synchronization) | **Thread-Safe** (Synchronized methods) |
| Performance | **Fastest** (Recommended for 99% of code) | Slower due to locking overhead |

---
id: iterators-listiterators-concurrentmodification
slug: iterators-listiterators-concurrentmodification
course: java-for-intermediate
chapter: 5: Java Collections Framework - Lists & Sets
topic: "Iterators, ListIterators, and ConcurrentModificationException"
difficulty: Intermediate
readingTime: 13
order: 23
keywords: ["iterator java","listiterator","concurrentmodificationexception","fail-fast","collection removal"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧭 Iterators, ListIterators, and the ConcurrentModificationException

## Introduction
Modifying a collection (calling `.remove()` or `.add()`) while iterating over it using a standard for-each loop triggers a fatal **`ConcurrentModificationException`**. Java's **Fail-Fast** iterators solve this problem.

---

## ☠️ The Concurrent Modification Trap

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));

// ❌ CRASH: Throws ConcurrentModificationException!
// for (String s : list) {
//     if (s.equals("B")) list.remove(s);
// }

// ✅ SAFE: Use Iterator's own .remove() method:
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String item = it.next();
    if (item.equals("B")) {
        it.remove(); // Safe in-flight removal!
    }
}
System.out.println("Cleaned list: " + list); // [A, C]
```

---
id: exception-hierarchy-throwable-runtime
slug: exception-hierarchy-throwable-runtime
course: java-for-intermediate
chapter: 4: Exception Handling & Robustness
topic: "Exception Hierarchy: Throwable, Exception, RuntimeException, and Error"
difficulty: Intermediate
readingTime: 13
order: 15
keywords: ["exception hierarchy java","throwable","runtimeexception","error vs exception","java robustness"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🌲 Java's Exception Hierarchy

## Introduction
Exceptions in Java represent abnormal runtime conditions that disrupt normal application flow. All exceptions and errors in Java descend from the **`java.lang.Throwable`** class.

---

## 🏛️ The Hierarchy Tree

```text
                          Throwable
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
          Error                             Exception
    (JVM-level failures)           (Recoverable conditions)
    ├── OutOfMemoryError                        │
    ├── StackOverflowError           ┌──────────┴──────────┐
    └── VirtualMachineError          ▼                     ▼
                             RuntimeException      Checked Exceptions
                             (Unchecked)           ├── IOException
                             ├── NullPointer       ├── SQLException
                             ├── Arithmetic        └── ClassNotFoundException
                             └── IndexOutOfBounds
```

- **`Error`**: Serious JVM-level catastrophes (e.g. `OutOfMemoryError`). Applications should never try to catch these.
- **`Exception`**: Conditions that a reasonable application should catch and handle.
- **`RuntimeException`**: Programming logic bugs (null references, dividing by zero, illegal array indexes).

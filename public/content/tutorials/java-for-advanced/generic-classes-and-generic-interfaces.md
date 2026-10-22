---
id: "java-adv-t1.2"
title: "Generic Classes and Generic Interfaces"
slug: "generic-classes-and-generic-interfaces"
course: "Java for Advanced"
chapter: "1: Generics & Type Architecture"
topic: "Generic Classes and Generic Interfaces"
difficulty: "Advanced"
readingTime: 14
order: 2
keywords: ["generic classes","generic interfaces","type parameter T","key value pair","repository pattern"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 📦 Generic Classes and Generic Interfaces

## Introduction
Beyond using built-in generic collections like `List<T>` and `Map<K, V>`, Java enables developers to design **custom generic classes and interfaces**. A generic type is a class or interface that is parameterized over types, allowing you to write reusable algorithms and data structures that work across multiple data models with 100% type safety.

---

## 🏷️ Standard Type Parameter Naming Conventions
By Java language convention, single uppercase letters represent type parameters:
- **`T`**: General Type
- **`E`**: Element (extensively used in Collections)
- **`K`**: Key (used in Maps)
- **`V`**: Value (used in Maps)
- **`N`**: Number
- **`R`**: Return type / Result

---

## 💻 1. Defining a Generic Class

Let's build a type-safe generic container `Container<T>` and a multi-type `Pair<K, V>`:

```java
package com.mskinstitute.generics;

// Single-parameter generic class
public class Container<T> {
    private T item;

    public Container(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }

    public void setItem(T item) {
        this.item = item;
    }
}
```

### Multi-Type Parameter Class (`Pair<K, V>`):
```java
public class Pair<K, V> {
    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }

    @Override
    public String toString() {
        return "Pair[" + key + " => " + value + "]";
    }
}
```

---

## 🔌 2. Defining Generic Interfaces

In enterprise Java architectures, generic interfaces are the foundation of the **Repository Pattern**:

```java
package com.mskinstitute.generics;

import java.util.List;
import java.util.Optional;

// Generic Interface
public interface Repository<T, ID> {
    void save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    boolean deleteById(ID id);
}
```

### Implementing a Generic Interface with a Concrete Entity:
```java
public class StudentRepository implements Repository<Student, Long> {
    private final java.util.Map<Long, Student> database = new java.util.HashMap<>();

    @Override
    public void save(Student student) {
        database.put(student.id(), student);
    }

    @Override
    public Optional<Student> findById(Long id) {
        return Optional.ofNullable(database.get(id));
    }

    @Override
    public List<Student> findAll() {
        return new java.util.ArrayList<>(database.values());
    }

    @Override
    public boolean deleteById(Long id) {
        return database.remove(id) != null;
    }
}
```

---

## 📊 Summary Comparison

| Aspect | Concrete Class | Generic Class (`Class<T>`) |
| :--- | :--- | :--- |
| **Data Scope** | Fixed to one type (e.g. `StringBox`) | Flexible for any type (`Box<Student>`, `Box<Integer>`) |
| **Code Duplication** | High (must write `IntBox`, `DoubleBox`) | Zero (one unified implementation) |
| **Type Safety** | Safe for its dedicated type | Fully type-safe for all parameterizations |

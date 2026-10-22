---
id: "java-adv-t1.4"
title: "Wildcards in Generics: Upper Bounded (? extends) and Lower Bounded (? super)"
slug: "wildcards-in-generics-upper-lower-bounded"
course: "Java for Advanced"
chapter: "1: Generics & Type Architecture"
topic: "Wildcards in Generics: Upper Bounded (? extends) and Lower Bounded (? super)"
difficulty: "Advanced"
readingTime: 16
order: 4
keywords: ["wildcards","upper bounded","lower bounded","pecs principle","producer extends consumer super"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# ❓ Wildcards in Generics: Upper Bounded (? extends) and Lower Bounded (? super)

## Introduction
In Java, arrays are **covariant** (i.e. `Integer[]` is an `Object[]`), but generic collections are **invariant**. For example, even though `Integer` is a subclass of `Number`, a `List<Integer>` is **NOT** a `List<Number>`.

To provide flexibility in API design while preserving complete type safety, Java provides **Wildcards (`?`)**.

---

## 🚫 The Invariance Problem

Consider this method:
```java
void printNumbers(List<Number> list) { ... }

List<Integer> intList = Arrays.asList(1, 2, 3);
// printNumbers(intList); 
// ❌ COMPILE ERROR: List<Integer> cannot be passed to List<Number>!
```
If Java allowed this, you could write `list.add(45.50);` inside the method, which would illegally corrupt an `Integer` list with a `Double`!

---

## 🌐 1. Unbounded Wildcard (`<?>`)

Represents any arbitrary type:
```java
public static void printList(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}
```

---

## 🔼 2. Upper Bounded Wildcard (`<? extends T>`)

Restricts the unknown type to be either type `T` or a subtype of `T`. Used when you want to **read/produce** values from a structure:

```java
public static double sumOfNumbers(List<? extends Number> numbers) {
    double sum = 0.0;
    for (Number n : numbers) {
        sum += n.doubleValue(); // ✅ Safe to read as Number
    }
    // numbers.add(10); // ❌ COMPILE ERROR: Cannot write into ? extends!
    return sum;
}
```

---

## 🔽 3. Lower Bounded Wildcard (`<? super T>`)

Restricts the unknown type to be either type `T` or a supertype of `T`. Used when you want to **write/consume** values into a structure:

```java
public static void addIntegers(List<? super Integer> list) {
    list.add(10); // ✅ Safe to add Integer or its subtypes
    list.add(20);
    list.add(30);
    // Object obj = list.get(0); // Only safe to read as Object
}
```

---

## 💡 The PECS Principle (Producer Extends, Consumer Super)

The golden rule of Java Generics coined by Joshua Bloch in *Effective Java*:

```text
┌──────────────────────────────────────────────────────────────┐
│                    PECS PRINCIPLE                            │
├──────────────────────────────────────────────────────────────┤
│  PRODUCER  ─►  Use <? extends T>  (When reading data out)    │
│  CONSUMER  ─►  Use <? super T>    (When writing data in)     │
└──────────────────────────────────────────────────────────────┘
```

### Example of PECS in `Collections.copy`:
```java
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (int i = 0; i < src.size(); i++) {
        dest.set(i, src.get(i));
    }
}
```
- `src` produces items for the algorithm (`? extends T`).
- `dest` consumes items from the algorithm (`? super T`).

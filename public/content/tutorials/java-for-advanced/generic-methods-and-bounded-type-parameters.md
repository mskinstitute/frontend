---
id: "java-adv-t1.3"
title: "Generic Methods and Bounded Type Parameters (<T extends Number>)"
slug: "generic-methods-and-bounded-type-parameters"
course: "Java for Advanced"
chapter: "1: Generics & Type Architecture"
topic: "Generic Methods and Bounded Type Parameters (<T extends Number>)"
difficulty: "Advanced"
readingTime: 15
order: 3
keywords: ["generic methods","bounded type parameters","extends Number","multiple bounds","comparable"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# ⚡ Generic Methods and Bounded Type Parameters (<T extends Number>)

## Introduction
While generic classes parameterize an entire class, **generic methods** introduce their own type parameters scoped solely to that specific method. Furthermore, when you need to restrict the allowable types to subclasses of a specific class or implementors of an interface, Java provides **Bounded Type Parameters** using the `extends` keyword.

---

## 🛠️ 1. Generic Methods Syntax

A generic method declares its type parameter(s) **before** the method's return type:

```java
public class ArrayUtilities {

    // <T> before the return type marks this as a generic method
    public static <T> void swap(T[] array, int i, int j) {
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }
}
```

---

## 🎯 2. Bounded Type Parameters (`<T extends SuperClass>`)

Sometimes an algorithm requires knowledge about the capabilities of `T`. For example, calculating numeric statistics requires mathematical operations, which are available on subclasses of `java.lang.Number`.

```java
package com.mskinstitute.generics;

public class StatsCalculator<T extends Number> {
    private final T[] numbers;

    public StatsCalculator(T[] numbers) {
        this.numbers = numbers;
    }

    public double calculateAverage() {
        double sum = 0.0;
        for (T num : numbers) {
            // Because T extends Number, we can safely call doubleValue()!
            sum += num.doubleValue();
        }
        return sum / numbers.length;
    }
}
```

### Valid vs Invalid Usage:
```java
// ✅ Valid: Integer and Double extend java.lang.Number
StatsCalculator<Integer> intStats = new StatsCalculator<>(new Integer[]{10, 20, 30});
StatsCalculator<Double> doubleStats = new StatsCalculator<>(new Double[]{98.5, 87.2, 91.0});

// ❌ COMPILE ERROR: String does NOT extend Number!
// StatsCalculator<String> strStats = new StatsCalculator<>(new String[]{"A", "B"});
```

---

## 🔗 3. Multiple Bounds (`<T extends Class & Interface>`)

In Java, a type parameter can have multiple bounds. If one of the bounds is a class, it **must be listed first**, followed by interface bounds separated by `&`:

```java
// T must be a Number AND must implement Comparable<T>
public static <T extends Number & Comparable<T>> T findMax(T a, T b) {
    if (a.compareTo(b) >= 0) {
        return a;
    }
    return b;
}
```

---

## ⚠️ Common Pitfalls

1. **Primitive Types as Type Arguments**: You cannot use primitives like `int` or `double` directly in generics (`StatsCalculator<int>` ❌). You must use wrapper classes (`StatsCalculator<Integer>` ✅).
2. **Order of Bounds**: Class bounds must always precede interface bounds: `<T extends Serializable & Number>` ❌ compile error; `<T extends Number & Serializable>` ✅ correct.

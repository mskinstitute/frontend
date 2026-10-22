---
id: array-declaration-allocation-default-values
slug: array-declaration-allocation-default-values
course: java-for-beginners
chapter: 5: Arrays & Array Utilities
topic: "Array Declaration, Allocation, and Default Values"
difficulty: Beginner
readingTime: 13
order: 21
keywords: ["java arrays","array declaration","array allocation","default values","heap arrays"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📦 Array Declaration, Allocation, and Default Values in Java

## Introduction
An **array** in Java is a container object that holds a fixed number of values of a single type. Unlike C/C++ where arrays can be on the stack, **all Java arrays are objects allocated dynamically on the heap**, managed by the garbage collector.

---

## 🛠️ Array Syntax & Allocation

```java
public class ArrayBasics {
    public static void main(String[] args) {
        // 1. Declaration and Allocation with 'new'
        int[] scores = new int[5]; // Allocated on heap with default values

        // 2. Initializing via Array Literal
        String[] branchCities = {"Shikohabad", "Firozabad", "Agra", "Mainpuri"};

        // 3. Array Length Property (Notice: .length is a property, NOT a method!)
        System.out.println("Cities count: " + branchCities.length);
        System.out.println("First city:   " + branchCities[0]);
        System.out.println("Last city:    " + branchCities[branchCities.length - 1]);
    }
}
```

---

## 📋 Default Initialization Values in Java
When an array is allocated using `new Type[N]`, all elements are automatically initialized to zero-equivalents:
- Numeric types (`byte`, `short`, `int`, `long`): `0`
- Floating point (`float`, `double`): `0.0`
- Booleans: `false`
- Objects / Strings / References: `null`

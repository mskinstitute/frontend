---
id: "java-adv-t6.3"
title: "Custom Annotations: @Retention, @Target, and Runtime Processing"
slug: "custom-annotations-retention-target-runtime-processing"
course: "Java for Advanced"
chapter: "6: Reflection & Annotations"
topic: "Custom Annotations: @Retention, @Target, and Runtime Processing"
difficulty: "Advanced"
readingTime: 16
order: 28
keywords: ["custom annotations","retention policy","target element","runtime annotation processing","mini test runner"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🏷️ Custom Annotations: @Retention, @Target, and Runtime Processing

## Introduction
**Annotations** are metadata tags affixed to classes, methods, fields, and parameters. While annotations do not directly change compiled bytecode execution semantics, they can be discovered and processed at runtime using Reflection.

This is the exact mechanism behind `@Autowired`, `@Test`, `@Entity`, and `@Transactional`.

---

## 🏛️ The Meta-Annotations

When defining a custom annotation using `@interface`, Java requires **meta-annotations**:

1. **`@Retention`**: Defines how long the annotation is retained:
   - `RetentionPolicy.SOURCE`: Discarded by the compiler (e.g. `@Override`).
   - `RetentionPolicy.CLASS`: Stored in `.class` file but ignored by JVM at runtime.
   - `RetentionPolicy.RUNTIME`: **Retained in JVM memory and readable via Reflection!**
2. **`@Target`**: Restricts where the annotation can be attached:
   - `ElementType.TYPE`: Classes, interfaces, enums, records.
   - `ElementType.METHOD`: Methods.
   - `ElementType.FIELD`: Fields.
   - `ElementType.PARAMETER`: Method parameters.

---

## 🛠️ Step 1: Declaring Custom Annotations

```java
package com.mskinstitute.annotations;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TestCase {
    String description() default "No description provided";
    int timeoutMs() default 1000;
}
```

---

## 🛠️ Step 2: Annotating Business Code

```java
public class CalculatorTestSuite {

    @TestCase(description = "Verify addition logic", timeoutMs = 500)
    public void testAddition() {
        if (2 + 2 != 4) throw new AssertionError("Math broke!");
        System.out.println("  [PASS] testAddition");
    }

    @TestCase(description = "Verify division by zero handling")
    public void testDivisionByZero() {
        System.out.println("  [PASS] testDivisionByZero");
    }

    public void unannotatedHelperMethod() {
        // Will not be executed by test runner
    }
}
```

---

## 🛠️ Step 3: Building a Runtime Annotation Processor (Mini JUnit Runner)

```java
public class MiniJUnitRunner {
    public static void main(String[] args) throws Exception {
        Class<?> suiteClass = CalculatorTestSuite.class;
        Object suiteInstance = suiteClass.getDeclaredConstructor().newInstance();

        int passed = 0;
        int failed = 0;

        for (Method method : suiteClass.getDeclaredMethods()) {
            // Check if method is tagged with @TestCase
            if (method.isAnnotationPresent(TestCase.class)) {
                TestCase testCase = method.getAnnotation(TestCase.class);
                System.out.printf("Executing: %s (Desc: '%s')%n", 
                    method.getName(), testCase.description());

                try {
                    method.invoke(suiteInstance);
                    passed++;
                } catch (Exception ex) {
                    System.err.println("  [FAIL]: " + ex.getCause().getMessage());
                    failed++;
                }
            }
        }

        System.out.printf("Test Results: %d Passed, %d Failed.%n", passed, failed);
    }
}
```

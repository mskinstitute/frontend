---
id: "java-adv-t6.1"
title: "Java Reflection API: Class<T>, Methods, Fields, and Constructors"
slug: "reflection-api-class-methods-fields-constructors"
course: "Java for Advanced"
chapter: "6: Reflection & Annotations"
topic: "Java Reflection API: Class<T>, Methods, Fields, and Constructors"
difficulty: "Advanced"
readingTime: 15
order: 26
keywords: ["reflection api","metaprogramming","class object","inspecting fields","inspecting methods"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🪞 Java Reflection API: Class<T>, Methods, Fields, and Constructors

## Introduction
**Reflection** is Java's meta-programming mechanism that allows an executing program to inspect, examine, and modify the internal structure and behavior of classes, interfaces, fields, methods, and constructors at runtime—even when their names are unknown at compile time.

Frameworks like **Spring, Hibernate, and JUnit** rely fundamentally on Reflection for dependency injection, object-relational mapping, and test discovery.

---

## 🔍 1. Obtaining a `Class<?>` Object

Every loaded type has a unique `Class` instance maintained by the JVM ClassLoader. There are 3 ways to obtain it:

```java
// 1. Via class literal (Compile-time known)
Class<Student> clazz1 = Student.class;

// 2. Via instance method getClass()
Student s = new Student();
Class<? extends Student> clazz2 = s.getClass();

// 3. Dynamic loading via Class.forName() (Dynamic string at runtime)
Class<?> clazz3 = Class.forName("com.mskinstitute.models.Student");
```

---

## 🔬 2. Inspecting Class Modifiers and Metadata

```java
Class<?> clazz = Class.forName("com.mskinstitute.models.Student");

System.out.println("Full Name:    " + clazz.getName());
System.out.println("Simple Name:  " + clazz.getSimpleName());
System.out.println("Superclass:   " + clazz.getSuperclass().getName());
System.out.println("Is Interface: " + clazz.isInterface());
System.out.println("Modifiers:    " + Modifier.toString(clazz.getModifiers()));
```

---

## 📋 3. Inspecting Fields, Methods, and Constructors

Java provides two sets of reflection queries:
- **`getFields()` / `getMethods()`**: Returns **public** members, including those inherited from superclasses.
- **`getDeclaredFields()` / `getDeclaredMethods()`**: Returns **all** members (private, protected, default, public) declared directly within this class.

```java
// Inspecting all declared fields
Field[] fields = clazz.getDeclaredFields();
for (Field f : fields) {
    System.out.printf("Field: %s %s (Type: %s)%n", 
        Modifier.toString(f.getModifiers()), f.getName(), f.getType().getSimpleName());
}

// Inspecting all declared methods
Method[] methods = clazz.getDeclaredMethods();
for (Method m : methods) {
    System.out.printf("Method: %s %s (Return: %s, Params: %d)%n",
        Modifier.toString(m.getModifiers()), m.getName(), 
        m.getReturnType().getSimpleName(), m.getParameterCount());
}
```

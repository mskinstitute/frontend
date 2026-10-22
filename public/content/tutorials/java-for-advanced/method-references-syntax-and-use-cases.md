---
id: "java-adv-t2.5"
title: "Method References (Class::method, instance::method, Class::new)"
slug: "method-references-syntax-and-use-cases"
course: "Java for Advanced"
chapter: "2: Functional Programming & Lambdas"
topic: "Method References (Class::method, instance::method, Class::new)"
difficulty: "Advanced"
readingTime: 14
order: 10
keywords: ["method references","double colon operator","constructor reference","class method","clean code"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🎯 Method References (Class::method, instance::method, Class::new)

## Introduction
When a lambda expression simply calls an existing method without adding extra logic, Java provides a cleaner, more readable shorthand: the **Method Reference** using the double-colon (`::`) operator.

---

## 🏷️ The 4 Types of Method References

```text
┌──────────────────────────────┬──────────────────────────┬────────────────────────┐
│ Type                         │ Syntax                   │ Equivalent Lambda      │
├──────────────────────────────┼──────────────────────────┼────────────────────────┤
│ 1. Static Method             │ ContainingClass::staticM │ (args) -> Class.m(args)│
│ 2. Instance of Arbitrary Obj │ ContainingType::method   │ (obj, args) -> obj.m() │
│ 3. Instance of Specific Obj  │ instanceRef::method      │ (args) -> instance.m() │
│ 4. Constructor               │ ClassName::new           │ (args) -> new Class()  │
└──────────────────────────────┴──────────────────────────┴────────────────────────┘
```

---

## 💻 1. Static Method References (`Class::staticMethod`)

```java
// Lambda:
Function<String, Integer> parser1 = s -> Integer.parseInt(s);

// Method Reference:
Function<String, Integer> parser2 = Integer::parseInt;
```

---

## 💻 2. Instance Method of an Arbitrary Object (`Class::instanceMethod`)

Here the first parameter of the functional interface becomes the target object on which the method is called:

```java
List<String> names = List.of("aarav", "priya", "rohit");

// Lambda:
names.stream().map(s -> s.toUpperCase()).forEach(System.out::println);

// Method Reference:
names.stream().map(String::toUpperCase).forEach(System.out::println);
```

---

## 💻 3. Instance Method of a Specific Existing Object (`instance::method`)

```java
PrintStream out = System.out;

// Lambda:
Consumer<String> logger1 = s -> out.println(s);

// Method Reference:
Consumer<String> logger2 = out::println;
```

---

## 💻 4. Constructor References (`Class::new`)

```java
// Lambda:
Supplier<List<String>> listSupplier1 = () -> new ArrayList<>();

// Constructor Reference:
Supplier<List<String>> listSupplier2 = ArrayList::new;

// With arguments:
Function<String, Student> studentFactory = Student::new;
Student s = studentFactory.apply("Vikram Rathore");
```

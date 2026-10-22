---
id: jvm-jre-jdk-bytecode-architecture
slug: jvm-jre-jdk-bytecode-architecture
course: java-for-beginners
chapter: 1: Java Ecosystem & Development Setup
topic: "JVM, JRE, and JDK Architecture & Bytecode Execution"
difficulty: Beginner
readingTime: 13
order: 2
keywords: ["jvm","jre","jdk","java bytecode","jit compiler","garbage collector","architecture"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏗️ JVM, JRE, and JDK Architecture & Bytecode Execution

## Introduction
To write, build, and run Java software, you must understand the three concentric layers of the Java runtime environment: **JDK**, **JRE**, and the **JVM**.

---

## 📦 The Three Nested Layers

```text
┌─────────────────────────────────────────────────────────────────┐
│                      JDK (Java Development Kit)                  │
│   Development Tools: javac, jdb, javadoc, jar, jlink            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               JRE (Java Runtime Environment)              │  │
│  │   Standard Class Libraries (rt.jar, java.base, util)       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │          JVM (Java Virtual Machine)                 │  │  │
│  │  │  Class Loader ──► Execution Engine (Interpreter +   │  │  │
│  │  │  JIT Compiler) ──► Garbage Collector (GC)           │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Inside the Java Virtual Machine (JVM)

1. **Class Loader Subsystem**:
   - **Loading**: Reads `.class` files from disk into memory.
   - **Linking**: Verifies bytecode safety, prepares static variables, and resolves symbolic references.
   - **Initialization**: Executes static initializer blocks.

2. **JVM Memory Layout**:
   - **Heap**: Shared storage where all object instances live.
   - **Stack**: Thread-private storage holding stack frames (local variables, function calls).
   - **Metaspace**: Stores class metadata, bytecode, and static variables.

3. **Execution Engine**:
   - **Interpreter**: Reads bytecode instructions line-by-line for instant startup.
   - **JIT (Just-In-Time) Compiler**: Identifies frequently executed "hot spots" in bytecode and compiles them directly into native CPU machine code for near C++ execution speeds.
   - **Garbage Collector (GC)**: Continuously scans heap memory to free unreferenced objects.

---

## 💻 Compilation & Execution Lifecycle

```bash
# 1. Compile source code into bytecode
javac HelloWorld.java

# Produces: HelloWorld.class

# 2. Launch the JVM to execute bytecode
java HelloWorld
```

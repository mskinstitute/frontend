---
id: setting-up-openjdk-environment-variables
slug: setting-up-openjdk-environment-variables
course: java-for-beginners
chapter: 1: Java Ecosystem & Development Setup
topic: "Setting up OpenJDK 21, Environment Variables (JAVA_HOME, PATH)"
difficulty: Beginner
readingTime: 12
order: 3
keywords: ["openjdk 21","java_home","path variable","java installation","eclipse temurin"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚙️ Setting up OpenJDK 21 & Environment Variables

## Introduction
Modern Java development relies on open-source, certified TCK builds of OpenJDK, such as **Eclipse Temurin** (Adoptium) or Amazon Corretto. Here is the step-by-step installation guide for Windows and Linux.

---

## 📥 Installing OpenJDK 21 LTS

1. Visit [adoptium.net](https://adoptium.net/) and download **Eclipse Temurin OpenJDK 21 (LTS)** for Windows x64.
2. Run the MSI installer and ensure the option **"Set JAVA_HOME variable"** is enabled.

---

## 🪟 Configuring Windows Environment Variables Manually

If not configured automatically:
1. Open **System Properties** `->` **Environment Variables**.
2. Under **System Variables**, click **New**:
   - **Variable name**: `JAVA_HOME`
   - **Variable value**: `C:\Program Files\Eclipse Adoptium\jdk-21.0.x`
3. Locate the **Path** system variable, click **Edit**, and add:
   - `%JAVA_HOME%\bin`

---

## ✅ Verifying the Installation

Open PowerShell or Command Prompt and test:

```powershell
java -version
javac -version
```

### Expected Output:
```text
openjdk version "21.0.x" 2024-xx-xx LTS
OpenJDK Runtime Environment Temurin-21.x (build 21.0.x)
OpenJDK 64-Bit Server VM Temurin-21.x (build 21.0.x, mixed mode, sharing)
```

---

## 💡 Why `JAVA_HOME` Matters
Enterprise build tools (Maven, Gradle, Android Studio, Spring Boot, Apache Tomcat) rely on the `JAVA_HOME` environment variable to locate compiler headers and JVM runtimes.

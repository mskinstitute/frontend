---
id: method-overriding-runtime-polymorphism
slug: method-overriding-runtime-polymorphism
course: java-for-intermediate
chapter: 2: Inheritance, Polymorphism & Abstraction
topic: "Method Overriding and Dynamic Method Dispatch (Runtime Polymorphism)"
difficulty: Intermediate
readingTime: 14
order: 7
keywords: ["method overriding","dynamic method dispatch","runtime polymorphism","@Override","upcasting"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎪 Method Overriding and Dynamic Method Dispatch

## Introduction
**Runtime Polymorphism** allows a superclass reference variable to refer to a subclass object. When an overridden method is called through that reference, Java resolves the call to the subclass implementation at **runtime** via **Dynamic Method Dispatch**.

---

## 💻 Upcasting & Dynamic Dispatch in Action

```java
import java.util.List;
import java.util.ArrayList;

class NotificationService {
    public void send(String recipient, String message) {
        System.out.printf("[DEFAULT NOTIFICATION] to %s: %s%n", recipient, message);
    }
}

class EmailNotification extends NotificationService {
    @Override
    public void send(String recipient, String message) {
        System.out.printf("[EMAIL DISPATCHED] to %s: %s%n", recipient, message);
    }
}

class SmsNotification extends NotificationService {
    @Override
    public void send(String recipient, String message) {
        System.out.printf("[SMS DISPATCHED via TELECOM GATEWAY] to %s: %s%n", recipient, message);
    }
}

public class PolymorphismDemo {
    public static void main(String[] args) {
        // Upcasting: Superclass reference pointing to subclass objects!
        List<NotificationService> services = new ArrayList<>();
        services.add(new EmailNotification());
        services.add(new SmsNotification());

        // Polymorphic invocation: Resolved dynamically at runtime!
        for (NotificationService service : services) {
            service.send("student@mskinstitute.in", "Batch starts Monday 9:00 AM");
        }
    }
}
```

---

## ⚠️ Overriding Rules:
1. Method signature (name, parameters, return type or covariant type) must match.
2. Visibility cannot be reduced (e.g., cannot override a `public` method as `private`).
3. Private and static methods cannot be overridden.

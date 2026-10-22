---
id: object-serialization-serializable-transient
slug: object-serialization-serializable-transient
course: java-for-intermediate
chapter: 6: Collections Framework - Maps & File I/O
topic: "Object Serialization with Serializable, ObjectOutputStream, and transient Keyword"
difficulty: Intermediate
readingTime: 13
order: 29
keywords: ["serialization java","deserialization","serializable","transient keyword","objectoutputstream"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💾 Object Serialization and the transient Keyword

## Introduction
**Serialization** converts an in-memory Java object into a binary byte stream to save to disk or transmit across a network. **Deserialization** reconstructs the byte stream back into a live object.

---

## 🛡️ The `Serializable` Marker Interface & `transient`

- A class must implement **`java.io.Serializable`** to be saved.
- Fields marked **`transient`** are **skipped during serialization** (used for passwords, sensitive data, or cached caches).

```java
import java.io.*;

class UserAccount implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L; // Versioning ID

    private String username;
    private transient String passwordHash; // Omitted from binary dump for security!

    public UserAccount(String user, String pass) {
        this.username = user;
        this.passwordHash = pass;
    }

    @Override
    public String toString() {
        return "UserAccount[username=" + username + ", pass=" + passwordHash + "]";
    }
}

public class SerializationDemo {
    public static void main(String[] args) throws Exception {
        String filename = "account.ser";

        // Save object
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(new UserAccount("sumit_admin", "SuperSecretSalt123"));
        }

        // Restore object
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filename))) {
            UserAccount restored = (UserAccount) ois.readObject();
            System.out.println("Restored: " + restored); // Notice passwordHash restored as null!
        }
    }
}
```

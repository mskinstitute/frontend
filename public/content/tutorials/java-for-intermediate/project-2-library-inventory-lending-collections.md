---
id: project-2-library-inventory-lending-collections
slug: project-2-library-inventory-lending-collections
course: java-for-intermediate
chapter: 7: Intermediate Portfolio Projects
topic: "Project 2: Library Book Inventory & Lending System with Collections"
difficulty: Intermediate
readingTime: 17
order: 31
keywords: ["library management java","collections project","hashmap library","book lending"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📚 Portfolio Project 2: Library Inventory & Lending System

## Introduction
Using `Map` and `List` collections, this project implements a complete Library Management System that tracks catalogued books, patron loans, and availability statuses.

---

## 💻 Full Source Code

```java
import java.util.*;

record Book(String isbn, String title, String author) {}

class LibraryCatalog {
    private final Map<String, Book> booksByIsbn = new HashMap<>();
    private final Set<String> borrowedIsbns = new HashSet<>();

    public void registerBook(String isbn, String title, String author) {
        booksByIsbn.put(isbn, new Book(isbn, title, author));
    }

    public boolean borrowBook(String isbn) {
        if (booksByIsbn.containsKey(isbn) && !borrowedIsbns.contains(isbn)) {
            borrowedIsbns.add(isbn);
            System.out.println("✅ Checked out: " + booksByIsbn.get(isbn).title());
            return true;
        }
        System.out.println("❌ Book unavailable or already borrowed.");
        return false;
    }

    public void returnBook(String isbn) {
        if (borrowedIsbns.remove(isbn)) {
            System.out.println("✅ Returned: " + booksByIsbn.get(isbn).title());
        }
    }

    public void displayCatalog() {
        System.out.println("\n=== MSK INSTITUTE LIBRARY CATALOG ===");
        booksByIsbn.forEach((isbn, book) -> {
            String status = borrowedIsbns.contains(isbn) ? "[BORROWED]" : "[AVAILABLE]";
            System.out.printf("%-10s %-15s %-30s by %s%n", status, isbn, book.title(), book.author());
        });
    }
}

public class LibraryDemo {
    public static void main(String[] args) {
        LibraryCatalog library = new LibraryCatalog();
        library.registerBook("978-01", "Effective Java", "Joshua Bloch");
        library.registerBook("978-02", "Clean Code", "Robert C. Martin");
        library.registerBook("978-03", "Java: The Complete Reference", "Herbert Schildt");

        library.borrowBook("978-01");
        library.displayCatalog();

        library.returnBook("978-01");
        library.displayCatalog();
    }
}
```

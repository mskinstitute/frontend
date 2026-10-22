---
id: lvalues-vs-rvalues-value-categories
slug: lvalues-vs-rvalues-value-categories
course: cpp-for-advanced
chapter: 1: Move Semantics & Modern Memory Management
topic: "Lvalues vs Rvalues, Value Categories (glvalue, prvalue, xvalue)"
difficulty: Advanced
readingTime: 13
order: 1
keywords: ["lvalue vs rvalue","value categories","prvalue","xvalue","glvalue","c++ memory model"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧭 Lvalues vs Rvalues and C++ Value Categories

## Introduction
Before C++11, expressions were simply classified as either **lvalues** (entities with identifiable memory addresses) or **rvalues** (temporary values). Modern C++ introduced a formal taxonomy of **value categories** that underpins move semantics and perfect forwarding.

---

## 🏛️ The ISO C++ Value Categories Taxonomy

```text
                 Expressions
               ┌──────┴──────┐
            glvalue       rvalue
          ┌────┴────┬────────┴────┐
        lvalue    xvalue       prvalue
```

1. **`glvalue` (Generalized lvalue)**: An expression whose evaluation determines the identity of an object, bit-field, or function.
2. **`lvalue`**: An expression with an identifiable identity that is **not movable by default** (e.g., named variables, references).
3. **`prvalue` (Pure rvalue)**: An expression whose evaluation computes a value that is not an object, or initializes an object (e.g., literals `42`, `3.14`, temporary returned values `x + y`).
4. **`xvalue` ("eXpiring" value)**: An object that has an identity, but whose resources **can be reused / moved** because its lifetime is nearing expiration (e.g., the result of `std::move(var)`).
5. **`rvalue`**: The union of `prvalue` and `xvalue`.

---

## 💻 Identifying Lvalues and Rvalues in Code

```cpp
#include <iostream>
#include <string>

int getConstant() { return 100; }

int main() {
    int a = 10;          // 'a' is an lvalue (has memory address: &a is valid)
    int b = 20;          // 'b' is an lvalue
    int c = a + b;       // 'a + b' is a prvalue (temporary calculation)

    // &a;               // Valid: lvalue has persistent address
    // &(a + b);         // 💥 Compiler Error: cannot take address of rvalue temporary
    // &getConstant();   // 💥 Compiler Error: returned by value prvalue has no persistent identity

    std::string str = "MSK";
    // std::move(str) yields an xvalue:
    std::string destination = std::move(str); // str's buffer is pilfered!

    return 0;
}
```

---

## 💡 The Practical Mental Model
- If you can take its address with `&`, it is an **lvalue**.
- If it is a temporary value, literal, or explicitly wrapped in `std::move()`, it is an **rvalue** whose memory buffers can be transferred with zero copying overhead.

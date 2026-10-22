---
id: std-vector-capacity-push-back-emplace-back
slug: std-vector-capacity-push-back-emplace-back
course: cpp-for-intermediate
chapter: 4: Standard Template Library (STL) - Containers
topic: "std::vector: Dynamic Resizing, capacity() vs size(), and push_back vs emplace_back"
difficulty: Intermediate
readingTime: 14
order: 17
keywords: ["std::vector","capacity vs size","push_back vs emplace_back","dynamic array","reserve"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 std::vector: Dynamic Arrays, Capacity, and emplace_back

## Introduction
**`std::vector`** is the default, go-to container in C++. It encapsulates a dynamically resizing contiguous array on the heap while offering O(1) random-access indexing.

---

## 📏 `.size()` vs `.capacity()`

- **`size()`**: The actual number of elements currently stored in the vector.
- **`capacity()`**: The total number of elements the vector can hold *before* it must allocate a larger heap buffer.

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers;

    // Observe geometric capacity growth
    for (int i = 1; i <= 10; ++i) {
        numbers.push_back(i);
        std::cout << "Added " << i 
                  << " | Size: " << numbers.size() 
                  << " | Capacity: " << numbers.capacity() << "\n";
    }

    return 0;
}
```

### Pre-allocating with `.reserve()`:
Reallocating a vector requires allocating new memory, copying/moving existing elements, and deleting old memory. Avoid this overhead by calling `.reserve()`:
```cpp
std::vector<int> scores;
scores.reserve(1000); // Allocates capacity for 1000 elements upfront without resizing size!
```

---

## ⚔️ `push_back` vs `emplace_back`

- **`push_back(obj)`**: Copies or moves an *already constructed* object into the vector.
- **`emplace_back(args...)`**: Constructs the object **in-place directly inside the vector's memory**, forwarding constructor arguments and bypassing temporary copies!

```cpp
#include <iostream>
#include <vector>
#include <string>

struct Student {
    std::string name;
    int roll;
    Student(std::string n, int r) : name(n), roll(r) {
        std::cout << "Constructed Student: " << name << "\n";
    }
};

int main() {
    std::vector<Student> batch;
    batch.reserve(5);

    // Emplace constructs in-place:
    batch.emplace_back("Rohit Kumar", 101);
    batch.emplace_back("Sneha Gupta", 102);

    return 0;
}
```

---
id: capstone-2-lru-cache-engine
slug: capstone-2-lru-cache-engine
course: cpp-for-advanced
chapter: 6: Advanced Capstone Projects
topic: "Capstone 2: High-Performance LRU (Least Recently Used) Cache Engine"
difficulty: Advanced
readingTime: 17
order: 27
keywords: ["lru cache","least recently used","hash map and list","o1 cache","advanced data structures"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Capstone Project 2: High-Performance LRU Cache Engine

## Introduction
An **LRU (Least Recently Used) Cache** is a foundational data structure in operating systems, web browsers, and distributed databases (Redis). It guarantees **O(1) average lookup** and **O(1) eviction** of the oldest unread items when maximum capacity is exceeded.

---

## 🎯 Architecture: Hash Table + Doubly-Linked List
```text
[ Hash Map: Key -> Iterator in List ]
                 │
                 ▼
[ Most Recent ] <---> [ Node ] <---> [ Least Recent (Evict Candidate) ]
```

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <unordered_map>
#include <list>
#include <optional>
#include <string>

template <typename Key, typename Value>
class LRUCache {
private:
    std::size_t m_capacity;
    // List stores pairs of (Key, Value); Most recent at front, oldest at back
    std::list<std::pair<Key, Value>> m_itemsList;
    // Map maps Key -> Iterator in m_itemsList
    std::unordered_map<Key, typename std::list<std::pair<Key, Value>>::iterator> m_cacheMap;

public:
    explicit LRUCache(std::size_t capacity) : m_capacity(capacity) {}

    std::optional<Value> get(const Key& key) {
        auto it = m_cacheMap.find(key);
        if (it == m_cacheMap.end()) {
            return std::nullopt; // Cache Miss
        }

        // Cache Hit: Move item to the front of list (Most Recently Used)
        m_itemsList.splice(m_itemsList.begin(), m_itemsList, it->second);
        return it->second->second;
    }

    void put(const Key& key, const Value& value) {
        auto it = m_cacheMap.find(key);

        if (it != m_cacheMap.end()) {
            // Key exists: update value and move to front
            it->second->second = value;
            m_itemsList.splice(m_itemsList.begin(), m_itemsList, it->second);
            return;
        }

        // Evict oldest if capacity full
        if (m_itemsList.size() >= m_capacity) {
            auto oldest = m_itemsList.back();
            m_cacheMap.erase(oldest.first);
            m_itemsList.pop_back();
            std::cout << "[EVICT]: Removed oldest key: " << oldest.first << "\n";
        }

        // Insert new element at front
        m_itemsList.emplace_front(key, value);
        m_cacheMap[key] = m_itemsList.begin();
    }
};

int main() {
    LRUCache<int, std::string> cache(3); // Capacity = 3

    cache.put(1, "Course: C++ Beginner");
    cache.put(2, "Course: C++ Intermediate");
    cache.put(3, "Course: C++ Advanced");

    // Access key 1 to make it most recent:
    cache.get(1);

    // Insert key 4 -> Key 2 (least recently used) should be evicted:
    cache.put(4, "Course: C++ Mastery Combo");

    auto check2 = cache.get(2);
    std::cout << "Key 2 in cache: " << (check2.has_value() ? "YES" : "NO (Evicted)") << "\n";

    auto check1 = cache.get(1);
    std::cout << "Key 1 in cache: " << (check1.has_value() ? check1.value() : "NO") << "\n";

    return 0;
}
```

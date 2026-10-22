---
id: "java-adv-t7.3"
title: "Capstone 3: Custom In-Memory Object Cache with Generics and Concurrency"
slug: "project-3-in-memory-object-cache-generics-concurrency"
course: "Java for Advanced"
chapter: "7: Enterprise Capstone Projects"
topic: "Capstone 3: Custom In-Memory Object Cache with Generics and Concurrency"
difficulty: "Advanced"
readingTime: 22
order: 31
keywords: ["capstone project","generic cache","readwritelock","ttl expiration","concurrency","daemon cleanup"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# ⚡ Capstone 3: Custom In-Memory Object Cache with Generics and Concurrency

## Project Overview
In this final enterprise capstone, we design and build a high-performance **Generic In-Memory Object Cache** (`Cache<K, V>`) similar to enterprise caching solutions like Ehcache and Caffeine.

### Key Architectural Requirements:
1. **Full Type Parameterization**: Works with any key and value type (`<K, V>`).
2. **Concurrency Optimization**: Uses `ReentrantReadWriteLock` allowing unlimited concurrent readers while synchronizing writes.
3. **Time-To-Live (TTL) Expiration**: Items automatically expire after their configured lifespan.
4. **Active Eviction Daemon**: A background thread continuously sweeps and purges expired entries.

---

## 📐 Architecture Diagram

```text
  Concurrent Reads (get)            Concurrent Writes (put)
         │                                   │
         ▼                                   ▼
 [ Read Lock (Shared) ]             [ Write Lock (Exclusive) ]
         │                                   │
         └─────────────► [ Cache Map ] ◄─────┘
                              ▲
                              │ Sweeps Expired Entries
              [ Eviction Daemon Thread (Background) ]
```

---

## 💻 Complete Production Cache Implementation

```java
package com.mskinstitute.capstone3;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ConcurrentTtlCache<K, V> implements AutoCloseable {

    // Internal wrapper for cached entries
    private static class CacheEntry<V> {
        final V value;
        final long expiryTimestamp;

        CacheEntry(V value, long ttlMillis) {
            this.value = value;
            this.expiryTimestamp = System.currentTimeMillis() + ttlMillis;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiryTimestamp;
        }
    }

    private final Map<K, CacheEntry<V>> cacheMap = new HashMap<>();
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final ScheduledExecutorService cleanerService = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "Cache-Eviction-Daemon");
        t.setDaemon(true); // Daemon thread exits with JVM
        return t;
    });

    public ConcurrentTtlCache(long cleanupIntervalSeconds) {
        cleanerService.scheduleAtFixedRate(this::evictExpiredEntries, 
            cleanupIntervalSeconds, cleanupIntervalSeconds, TimeUnit.SECONDS);
    }

    /**
     * Puts a key-value pair into the cache with a specific TTL.
     */
    public void put(K key, V value, long ttlMillis) {
        rwLock.writeLock().lock();
        try {
            cacheMap.put(key, new CacheEntry<>(value, ttlMillis));
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    /**
     * Retrieves an item from the cache if present and unexpired.
     */
    public Optional<V> get(K key) {
        rwLock.readLock().lock();
        try {
            CacheEntry<V> entry = cacheMap.get(key);
            if (entry == null || entry.isExpired()) {
                return Optional.empty();
            }
            return Optional.of(entry.value);
        } finally {
            rwLock.readLock().unlock();
        }
    }

    /**
     * Purges expired keys from memory.
     */
    private void evictExpiredEntries() {
        rwLock.writeLock().lock();
        try {
            cacheMap.entrySet().removeIf(e -> e.getValue().isExpired());
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    @Override
    public void close() {
        cleanerService.shutdownNow();
    }

    public static void main(String[] args) throws Exception {
        try (ConcurrentTtlCache<String, String> sessionCache = new ConcurrentTtlCache<>(2)) {
            System.out.println("🚀 Initializing Concurrent TTL Cache...");

            // Store user session with 2 second TTL
            sessionCache.put("SESSION_USR_101", "Aarav Sharma [ADMIN]", 2000);
            System.out.println("Saved: SESSION_USR_101 (TTL: 2s)");

            // Immediate read
            Optional<String> session = sessionCache.get("SESSION_USR_101");
            System.out.println("Immediate Read: " + session.orElse("EXPIRED"));

            // Wait 2.5 seconds for TTL expiry
            System.out.println("Sleeping 2500ms...");
            Thread.sleep(2500);

            // Read after expiration
            Optional<String> expiredSession = sessionCache.get("SESSION_USR_101");
            System.out.println("Post-Expiry Read: " + expiredSession.orElse("EXPIRED"));
        }
    }
}
```

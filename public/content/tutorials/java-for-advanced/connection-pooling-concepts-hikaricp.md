---
id: "java-adv-t5.5"
title: "Connection Pooling Concepts with HikariCP"
slug: "connection-pooling-concepts-hikaricp"
course: "Java for Advanced"
chapter: "5: Database Persistence with JDBC"
topic: "Connection Pooling Concepts with HikariCP"
difficulty: "Advanced"
readingTime: 16
order: 25
keywords: ["connection pooling","hikaricp","datasource","socket reuse","performance optimization"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🏊 Connection Pooling Concepts with HikariCP

## Introduction
Creating a physical database connection requires a complete TCP socket handshake, SSL key exchange, authentication, and backend thread allocation—taking between **50ms to 300ms** per connection. In a high-traffic web application handling thousands of concurrent requests, opening and closing connections on each query cripples response times.

A **Connection Pool** maintains a pool of pre-warmed, active database connections ready for instantaneous reuse.

---

## ⚙️ Pool Lifecycle Mechanics

```text
┌────────────────────────────────────────────────────────┐
│                   HIKARICP POOL                        │
│   Active Conn 1 (In Use)        Active Conn 2 (In Use) │
│   Idle Conn 3 (Ready) ◄───┐     Idle Conn 4 (Ready)    │
└───────────────────────────┼────────────────────────────┘
                            │ Borrow Connection (0.1ms!)
                            │
┌───────────────────────────┴────────────────────────────┐
│                    Worker Thread                       │
│ 1. Executes Query                                      │
│ 2. conn.close()  ──► Returns connection back to pool!  │
└────────────────────────────────────────────────────────┘
```

When your application calls `connection.close()`, HikariCP intercepts the call and **does NOT terminate the TCP socket**; it simply returns the connection to the idle pool!

---

## 🚀 Configuring HikariCP (Industry Standard)

HikariCP is the default, ultra-fast connection pool used by Spring Boot and enterprise Java frameworks.

```java
package com.mskinstitute.pool;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;

public class HikariCPProvider {
    private static final HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/msk_academy_db?useSSL=false");
        config.setUsername("root");
        config.setPassword("secretpassword");

        // Optimal Pool Sizing Formula: (CPU Cores * 2) + effective spindle count
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setIdleTimeout(300000); // 5 minutes
        config.setConnectionTimeout(20000); // 20 seconds wait timeout

        dataSource = new HikariDataSource(config);
    }

    public static DataSource getDataSource() {
        return dataSource;
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection(); // Lightning fast borrow!
    }
}
```

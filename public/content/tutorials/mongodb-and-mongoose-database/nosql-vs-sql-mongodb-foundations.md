# Document Databases vs Relational SQL: CAP Theorem & When to Use NoSQL

Modern web applications demand databases capable of handling massive write loads, dynamic schema evolution, and horizontal distributed scaling. **MongoDB** is the leading general-purpose, document-oriented NoSQL database designed for high performance, high availability, and effortless scaling.

---

## 1. Relational SQL vs Document NoSQL

Traditional relational databases (PostgreSQL, MySQL, Oracle) organize information into rigid two-dimensional tables consisting of rows and columns, enforcing strict schemas and foreign key relationships.

MongoDB, by contrast, stores data in flexible, semi-structured **documents** grouped into **collections**:

| Feature | Relational SQL (e.g., PostgreSQL) | Document NoSQL (MongoDB) |
| :--- | :--- | :--- |
| **Data Unit** | Row / Record | Document |
| **Data Container** | Table | Collection |
| **Schema** | Rigid, predefined column DDL | Dynamic, flexible schema per document |
| **Relationships** | Foreign keys & multi-table JOINs | Embedded subdocuments or references |
| **Scaling** | Vertical (scale up with bigger CPU/RAM) | Horizontal (scale out across clusters via Sharding) |
| **Transactions** | ACID transactions by default | Multi-document ACID transactions supported |

---

## 2. Visual Architecture

![MongoDB Architecture Pipeline](/images/tutorials/mongodb-and-mongoose-database/mongodb-document-model-pipeline.svg)

---

## 3. The CAP Theorem & MongoDB

The **CAP Theorem** states that a distributed data system can simultaneously guarantee only two out of the following three properties:
1. **Consistency (C):** Every read receives the most recent write or an error.
2. **Availability (A):** Every non-failing node returns a non-error response for every request.
3. **Partition Tolerance (P):** The system continues to operate despite arbitrary network dropouts or node splits.

MongoDB is primarily a **CP (Consistent and Partition-Tolerant)** system:
- In a standard MongoDB Replica Set with one Primary node and multiple Secondaries, write operations are directed to the Primary.
- If a network partition occurs, MongoDB prioritizes data consistency. If the Primary loses communication with a majority of nodes, it steps down to prevent "split-brain" data corruption.

---

## 4. When Should You Choose MongoDB?

1. **Rapidly Evolving Schemas:** Startups, agile MVPs, and content management systems where product requirements and data attributes change weekly.
2. **Hierarchical / Nested Data:** E-commerce catalogs where a product has variable attributes (e.g. clothing with sizes/colors, laptops with RAM/GPU specs).
3. **High Write Throughput & Big Data:** Real-time analytics, IoT sensor telemetry, event logging, and chat logs.
4. **Natural Polymorphism:** Collections where different documents share common fields but have distinct specialized payloads.

---

# Multiple Choice Questions

### 1. In MongoDB terminology, what concept corresponds to a "table" in relational SQL?
A. Schema
B. Collection
C. Cluster
D. Replica
**Answer:** B
**Explanation:** In MongoDB, a collection is a grouping of BSON documents, equivalent to a table in relational SQL databases.
---

### 2. Under the CAP theorem for distributed databases, which two properties does MongoDB prioritize by default in its replica set architecture?
A. Consistency and Availability (CA)
B. Consistency and Partition Tolerance (CP)
C. Availability and Partition Tolerance (AP)
D. Partition Tolerance only
**Answer:** B
**Explanation:** MongoDB is designed as a CP system; in the event of network partitioning, it guarantees consistency by electing a new primary only with a strict quorum.
---

### 3. What is the primary architectural advantage of storing nested subdocuments directly inside a parent document?
A. It deletes the parent document automatically.
B. It eliminates the need for expensive multi-table relational JOIN operations during reads.
C. It bypasses RAM and writes directly to tape drives.
D. It prevents the database from using indexes.
**Answer:** B
**Explanation:** Embedding related data inside a single document allows all necessary information to be fetched in a single, fast disk read without costly multi-table JOINs.
---

### 4. How does MongoDB achieve horizontal scalability when data size exceeds a single physical server?
A. By upgrading to a supercomputer with 128 cores.
B. Through Sharding, which distributes collection data chunks across multiple independent server shards.
C. By compressing all text into 8-bit characters.
D. By deleting records older than 30 days.
**Answer:** B
**Explanation:** MongoDB sharding automatically partitions and routes data subsets across multiple cluster nodes, providing linear horizontal scaling.
---

### 5. Which scenario is best suited for MongoDB over a traditional relational database?
A. A bank core accounting ledger requiring strict double-entry ledger constraints without any flexible attributes.
B. An e-commerce product catalog with rapidly changing product specifications, dynamic nested variants, and polymorphic product types.
C. A system that only runs on Windows 98.
D. An application that does not use a backend server.
**Answer:** B
**Explanation:** E-commerce catalogs with polymorphic, deeply nested, and dynamically evolving product attributes represent the canonical use case for MongoDB's flexible document model.
---

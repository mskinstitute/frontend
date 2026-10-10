# Azure Synapse Analytics & Microsoft Fabric Lakehouse Integration

Enterprise business intelligence frequently interfaces with modern data lakes and cloud data warehouses. **Azure Synapse Analytics** and **Microsoft Fabric OneLake** combine big data processing, Apache Spark, and dedicated SQL pools into a unified analytical plane.

---

## 1. The Lakehouse Pattern & Delta Parquet Tables

In the modern data lakehouse architecture:
- Raw transactional data lands in **ADLS Gen2 (Azure Data Lake Storage)**.
- Data engineers process data using Spark into open-source **Delta Lake (Parquet)** format.
- Power BI connects to the Lakehouse using two modern protocols:
  1. **Serverless SQL Endpoint:** Query Delta tables using standard T-SQL on demand.
  2. **Direct Lake Mode (Microsoft Fabric):** The revolutionary storage mode where VertiPaq reads columnar Delta Parquet files **directly from cloud storage with ZERO data duplication and ZERO import latency!**

```
                            Modern Lakehouse BI Flow
                                       |
    [Raw Data Lake (Parquet)]  ===>  [Fabric OneLake / Synapse]
                                                   |
                        +--------------------------+--------------------------+
                        |                                                     |
             [Serverless SQL Pool]                                    [Direct Lake Mode]
             Translates T-SQL live on data lake                       VertiPaq reads Parquet directly!
             (Standard DirectQuery protocol)                          (Import speed with live freshness)
```

---

## 2. Dedicated SQL Pools vs. Serverless SQL

- **Dedicated SQL Pools:** Massively Parallel Processing (MPP) enterprise data warehouse with provisioned compute (DWUs). Ideal for heavy corporate reporting with strict SLAs.
- **Serverless SQL:** Pay-per-query model ($5 per TB scanned). Ideal for ad-hoc exploration, data discovery, and lightweight reporting.

---

# Multiple Choice Questions

### 1. What open columnar file format is standard for storing structured tables inside Azure Synapse and Microsoft Fabric OneLake?
A. Delta Parquet
B. MP3
C. JPEG
D. HTML
**Answer:** A
**Explanation:** Delta Parquet is the industry standard for modern data lakes, providing ACID transactions, columnar compression, and high-performance querying.

### 2. What revolutionary storage mode in Microsoft Fabric allows Power BI to achieve Import-level speeds by loading Delta Parquet files directly from OneLake without performing a scheduled refresh?
A. DirectQuery
B. Direct Lake
C. Dual Mode
D. File Import
**Answer:** B
**Explanation:** Direct Lake mode reads Parquet delta files directly from cloud storage into the VertiPaq engine without importing or duplicating data, providing instant data freshness at in-memory speeds.

### 3. What type of compute engine in Azure Synapse charges purely based on the volume of data scanned per query rather than maintaining an expensive 24/7 dedicated cluster?
A. Dedicated SQL Pool
B. Serverless SQL Pool
C. Windows Server
D. Azure VM
**Answer:** B
**Explanation:** Serverless SQL pools charge on-demand per terabyte of data processed, making them extremely cost-effective for ad-hoc analytical workloads.

### 4. What architecture combines the low-cost storage of a data lake with the governance, ACID transactions, and indexing of a traditional data warehouse?
A. Flat File System
B. Lakehouse Architecture
C. Magnetic Tape Storage
D. FTP Server
**Answer:** B
**Explanation:** A Lakehouse combines the massive scalability of object storage (Data Lake) with relational data management features (Data Warehouse).

### 5. Why is Serverless SQL frequently used in conjunction with Power BI for data exploration?
A. It allows analysts to write T-SQL queries over raw CSV and Parquet files in Azure Data Lake without provisioning dedicated database servers
B. It eliminates the need for DAX
C. It bypasses Microsoft Azure
D. It only works on mobile devices
**Answer:** A
**Explanation:** Serverless SQL enables analysts to query unstructured and semi-structured files directly using familiar SQL syntax without spinning up permanent database servers.

---

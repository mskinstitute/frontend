# Connecting to Excel, CSV, and Databases

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Connecting to Diverse Data Sources
Power BI supports over 150 built-in data connectors:
- **File Sources:** Excel (`.xlsx`), CSV/Text, JSON, XML, Folder (combine all files in a folder).
- **Relational Databases:** SQL Server, Oracle, MySQL, PostgreSQL, IBM DB2.
- **Cloud & Big Data:** Azure SQL, Snowflake, Google BigQuery, Amazon Redshift, Databricks.
- **Online Services:** SharePoint Lists, Salesforce, Google Analytics.

---

## 2. Import Mode vs DirectQuery vs Live Connection
When connecting to a database, Power BI asks for the connection mode:
1. **Import Mode (Default & Fastest):** Ingests and compresses data into the in-memory VertiPaq engine. Full DAX support, sub-second query speeds.
2. **DirectQuery:** Leaves data in the source database. Power BI sends real-time SQL queries on every visual click. Required for massive data (> 100 GB) or strict real-time needs.
3. **Live Connection:** Direct connection to an existing Analysis Services tabular model or Power BI dataset.

---

# Multiple Choice Questions

### 1. What is the fastest and most feature-complete connection mode in Power BI?
A. Import Mode
B. DirectQuery
C. Live Connection
D. Web Scraping
**Answer:** A
**Explanation:** Import Mode loads and compresses data into the VertiPaq in-memory columnar store, providing maximum DAX calculation speed.
---

### 2. When should an analyst choose 'DirectQuery' over 'Import Mode'?
A. When the source database is dozens of gigabytes/terabytes and cannot fit in memory, or when strict real-time reporting is mandatory
B. When working with small Excel sheets
C. When no internet connection is available
D. When they want to learn SQL
**Answer:** A
**Explanation:** DirectQuery avoids importing massive tables, translating canvas clicks into live SQL queries against the source database.
---

### 3. Which Power BI connector allows you to read and append all monthly CSV files stored inside a designated directory automatically?
A. Folder connector
B. Zip connector
C. Batch connector
D. Mass importer
**Answer:** A
**Explanation:** The Folder connector combines all files sharing the same schema in a folder into a single unified table.
---

### 4. What happens when you click 'Load' instead of 'Transform Data' in the Navigator window?
A. Power BI skips Power Query cleaning and loads the raw data directly into the data model
B. The file is deleted
C. The report is published
D. DAX is executed
**Answer:** A
**Explanation:** 'Load' bypasses the Power Query Editor; 'Transform Data' opens Power Query to clean and shape the data first.
---

### 5. Can Power BI connect to password-protected SQL databases securely?
A. Yes, using Windows Authentication, Database credentials, or Azure Active Directory
B. No, only open databases without passwords
C. Only if exported to CSV first
D. Only via email
**Answer:** A
**Explanation:** Power BI supports enterprise authentication protocols including OAuth, Azure AD, SQL credentials, and Windows credentials.
---

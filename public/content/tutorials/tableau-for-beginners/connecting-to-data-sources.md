---
id: connecting-to-data-sources
slug: connecting-to-data-sources
course: tableau-for-beginners
chapter: "1: Introduction to Tableau & Visual Analytics"
topic: "1.3 Connecting to Data: Excel, CSV, Google Sheets & SQL Databases"
title: "Connecting to Data: Excel, CSV, Google Sheets & SQL Databases"
description: "Learn Connecting to Data: Excel, CSV, Google Sheets & SQL Databases in Tableau with practical examples, analyst workflows, and interactive practice quizzes."
difficulty: Beginner
readingTime: 6
order: 3
keywords:
  - connecting to data excel csv google sheets sql databases
  - tableau tutorial
  - connecting to data sources
  - data analysis course
  - MSK Institute
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

---

## 1. Data Connection Types
Tableau connects to virtually any corporate data source:
- **To a File:** Microsoft Excel, Text/CSV, JSON, PDF, Spatial Files, Statistical Files (SPSS, SAS, R).
- **To a Server:** Microsoft SQL Server, PostgreSQL, MySQL, Oracle, Snowflake, Google BigQuery, Amazon Redshift, Salesforce.

---

## 2. The Data Source Page
Upon connection, the **Data Source Page** allows you to:
- Drag tables onto the canvas to form the data model.
- Set field data types (Number, Date, String, Geographic Role).
- Apply Data Source Filters (restricting the data loaded across all sheets).

---

## Practice Quiz
### 1. Can Tableau directly connect to live Google Sheets spreadsheets?
A. Yes, using the native Google Sheets connector with cloud authentication
B. No, must be exported to Excel first
C. Only on Linux
D. Only with Python plugins
**Answer:** A
**Explanation:** Tableau has a built-in cloud connector for Google Drive and Google Sheets.
---

### 2. What does a 'Data Source Filter' in Tableau accomplish?
A. Restricts the rows ingested into the entire workbook at the connection level, reducing file size and boosting performance
B. Filters only one sheet
C. Deletes table columns permanently
D. Changes colors
**Answer:** A
**Explanation:** Data Source Filters apply globally before any worksheet queries are executed.
---

### 3. What feature allows Tableau to extract structured tabular data from a PDF report?
A. PDF File Connector
B. OCR tool
C. Image import
D. Print screen
**Answer:** A
**Explanation:** Tableau includes a native PDF table reader that parses tables directly from PDF documents.
---

### 4. What is 'Custom SQL' in Tableau?
A. Writing a custom SQL SELECT statement to pull a specific subset of data instead of loading entire tables
B. Creating a new database
C. Deleting database tables
D. Changing SQL passwords
**Answer:** A
**Explanation:** Custom SQL allows analysts to write optimized queries to extract precise datasets from relational databases.
---

### 5. Can Tableau join tables from two completely different data sources (e.g. an Excel sheet and a SQL Server database)?
A. Yes, using Cross-Database Joins or Data Blending
B. No, all tables must be in the same database
C. Only if written in C++
D. Only on weekends
**Answer:** A
**Explanation:** Tableau supports multi-connection data sources, allowing relational joins across distinct database platforms.
---

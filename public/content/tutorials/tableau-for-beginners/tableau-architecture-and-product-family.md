---
id: tableau-architecture-and-product-family
slug: tableau-architecture-and-product-family
course: tableau-for-beginners
chapter: "1: Tableau Ecosystem & Data Connections"
topic: "1.1 Tableau Architecture & Product Family (Desktop vs Server vs Public)"
title: "Tableau Architecture & Product Suite: Desktop, Server, Cloud & Public"
description: "Understand Tableau's VizQL engine, compare Tableau Desktop, Prep, Server, Cloud, and Public, and learn when to save workbooks as .twb vs .twbx."
difficulty: Beginner
readingTime: 9
order: 1
keywords:
  - tableau architecture tutorial
  - tableau desktop vs server vs public
  - tableau vizql explained
  - twb vs twbx file format
  - tableau prep builder
  - tableau for data analysts
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

**Tableau (part of Salesforce) is an interactive visual analytics platform powered by VizQL (Visual Query Language)—a patented engine that translates drag-and-drop user actions directly into optimized database queries and visual marks in real time.**

Rather than writing manual SQL queries and styling charts separately, analysts drag fields onto rows, columns, colors, and filters while VizQL queries your database or in-memory `.hyper` extract automatically.

![Tableau Pills Architecture](/images/tutorials/tableau-for-beginners/tableau-dimensions-measures-pills.svg)

---

## 1. The Tableau Product Suite Compared

| Product | Deployment Model | Primary Role | Best Used By |
| :--- | :--- | :--- | :--- |
| **Tableau Desktop** | Local app (Windows / macOS) | Author worksheets, calculated fields, LODs, dashboards, and stories | Data Analysts & BI Developers |
| **Tableau Prep Builder** | Local / Flow tool | Visual ETL—cleaning, pivoting, joining, and unioning messy datasets | Analysts preparing raw CSV/SQL data |
| **Tableau Server** | Self-hosted (On-Prem / Private Cloud) | Enterprise governance, scheduled refreshes, role-based access | Companies with strict internal IT control |
| **Tableau Cloud** | Fully managed SaaS (by Salesforce) | Same sharing & scheduling power without managing servers | Fast-moving teams avoiding server ops |
| **Tableau Public** | Free cloud & desktop edition | Publishing public interactive visualizations and analyst portfolios | Students & job-seeking data analysts |

---

## 2. Core Tableau File Formats (`.twb` vs `.twbx`)

Knowing Tableau's workbook extensions is an essential interview and daily-workflow skill:

- **`.twb` (Tableau Workbook):** Lightweight XML file storing only your sheet layouts, calculated fields, and connection instructions—*not* the underlying data. Sending a `.twb` alone breaks if the recipient cannot access your local CSV or database.
- **`.twbx` (Tableau Packaged Workbook):** A self-contained ZIP archive bundling the `.twb` XML definition **plus** local data extracts (`.hyper`), Excel/CSV files, and custom images. Always share `.twbx` when sending workbooks to teammates or submitting assignments.
- **`.hyper` (Tableau Data Extract):** High-speed compressed columnar snapshot stored locally for fast offline analytics.
- **`.tds` / `.tdsx` (Tableau Data Source):** Reusable saved connection metadata (calculated fields, hierarchies, aliases) shared across multiple workbooks.

---

## 3. Practical Analyst Workflow in Tableau

1. **Connect** to Excel, CSV, MySQL/PostgreSQL, or cloud warehouses (BigQuery, Snowflake).
2. **Prepare** dirty columns in Tableau Prep Builder or the Data Source tab.
3. **Explore & Visualize** inside Tableau Desktop worksheets using Dimensions and Measures.
4. **Assemble & Publish** interactive Dashboards and Stories to Tableau Cloud/Server (enterprise) or Tableau Public (free portfolio link for your resume).

---

## Practice Quiz

### 1. What underlying patented technology powers Tableau by translating drag-and-drop actions into visual database queries?
A. VizQL (Visual Query Language)
B. VertiPaq
C. DirectDraw
D. Python VM
**Answer:** A
**Explanation:** VizQL is Tableau's core proprietary engine that translates user interface actions directly into database queries and graphical marks.
---

### 2. Which free version of Tableau allows analysts to publish dashboards to an online public portfolio?
A. Tableau Public
B. Tableau Reader
C. Tableau Free
D. Tableau Lite
**Answer:** A
**Explanation:** Tableau Public is the free community platform used worldwide by analysts to showcase portfolios.
---

### 3. What role does 'Tableau Prep Builder' fulfill in the Tableau ecosystem?
A. Visual data cleaning, transformation, and ETL preparation
B. Video editing
C. Network router setup
D. Presentation slide design
**Answer:** A
**Explanation:** Tableau Prep provides a visual workflow environment for cleaning, pivoting, and merging data.
---

### 4. What is the difference between Tableau Server and Tableau Cloud (formerly Tableau Online)?
A. Tableau Server is hosted on an organization's own on-prem infrastructure, while Tableau Cloud is fully hosted and managed by Salesforce/Tableau
B. Tableau Server is free
C. Tableau Cloud does not have security
D. They are different operating systems
**Answer:** A
**Explanation:** Server is on-prem/customer-managed; Cloud is a fully-managed SaaS cloud deployment.
---

### 5. What file format saves a complete Tableau workbook including its local data extract (`.hyper`)?
A. `.twbx` (Tableau Packaged Workbook)
B. `.twb` (XML only)
C. `.tds`
D. `.xlsx`
**Answer:** A
**Explanation:** `.twbx` bundles the XML workbook definition (`.twb`) together with local extracts and media assets.

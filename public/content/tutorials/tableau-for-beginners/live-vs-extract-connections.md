---
id: live-vs-extract-connections
slug: live-vs-extract-connections
course: tableau-for-beginners
chapter: "1: Tableau Ecosystem & Data Connections"
topic: "1.4 Live Connection vs Data Extract (.hyper)"
title: "Tableau Live Connection vs Data Extract (.hyper) Explained"
description: "Compare Tableau Live Connections and Hyper Data Extracts (.hyper). Learn when to choose real-time queries vs in-memory extracts and incremental refresh."
difficulty: Beginner
readingTime: 9
order: 4
keywords:
  - tableau live vs extract
  - tableau hyper engine
  - tableau incremental refresh
  - tableau data extract file extension
  - optimize tableau dashboard speed
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

**In Tableau, a Live Connection sends every filter click directly to your source database for real-time freshness, whereas a Data Extract (`.hyper`) pulls a compressed, columnar snapshot into Tableau's ultra-fast in-memory Hyper engine for sub-second dashboards and offline work.**

Choosing between Live and Extract is one of the highest-impact performance decisions a BI developer makes—and a staple interview question for Data Analyst roles.

---

## 1. Live Connection vs. Hyper Extract Compared

| Criteria | Live Connection | Data Extract (`.hyper`) |
| :--- | :--- | :--- |
| **Data Freshness** | Real-time (reflects database changes immediately) | Point-in-time (updated on scheduled refresh) |
| **Dashboard Speed** | Depends on database load and network latency | Extremely fast via in-memory columnar **Hyper** engine |
| **Offline Capability** | Requires active database & network connection | Works 100% offline with local `.hyper` copy |
| **Database Load** | High — every executive click hits production DB | Low — isolates operational DB from BI traffic |
| **Best Use Cases** | Live hospital bed tracking, trading desks, fraud alerts | Daily/weekly sales KPIs, finance dashboards, portfolio work |

---

## 2. Full Refresh vs. Incremental Refresh

When you publish an Extract to Tableau Server or Tableau Cloud, you schedule refreshes (hourly, daily, weekly):

- **Full Refresh (Default):** Replaces the entire `.hyper` extract from scratch. Ideal when historical rows change (e.g., cancelled or refunded invoices).
- **Incremental Refresh:** Appends **only newly added rows** using a monotonically increasing key such as `order_id` or `created_at` timestamp. Ideal for multi-million-row append-only event or transaction logs where rebuilding the full table takes too long.

### Pro Tips for Smaller, Faster `.hyper` Extracts
1. **Hide Unused Fields** before generating the extract so unused columns never consume RAM.
2. **Apply Extract Filters** (e.g., keep only the last 3 years of active transactions).
3. **Aggregate Data for Visible Dimensions** (e.g., roll up second-level logs to daily totals) when granular rows are not required.

---

## Practice Quiz

### 1. What is the underlying high-performance columnar in-memory database engine used by Tableau for data extracts?
A. Hyper
B. VertiPaq
C. SQLite
D. RocksDB
**Answer:** A
**Explanation:** Hyper is Tableau's proprietary, lightning-fast in-memory columnar data engine.
---

### 2. When is a 'Live Connection' strictly required instead of an Extract?
A. When real-time operational monitoring is mandatory (e.g. emergency hospital bed availability or stock trading desks)
B. When working offline on an airplane
C. When using Excel files
D. When creating simple bar charts
**Answer:** A
**Explanation:** Live connections query the live database on every click, reflecting changes instantaneously.
---

### 3. What file extension denotes a Tableau Data Extract?
A. `.hyper`
B. `.extract`
C. `.csv`
D. `.tab`
**Answer:** A
**Explanation:** Tableau data extracts are stored as high-performance `.hyper` files.
---

### 4. Can you configure an Extract to refresh incrementally (loading only new rows) rather than rebuilding the full extract?
A. Yes, under Extract settings, choose 'Incremental refresh' based on an ID or Date column
B. No, extracts must always be 100% rewritten
C. Only on Fridays
D. Only with custom Python scripts
**Answer:** A
**Explanation:** Incremental refresh appends newly added records based on a designated timestamp or sequential key.
---

### 5. What happens to a Tableau workbook with an Extract connection if the user disconnects from the company network?
A. The workbook continues to function at full speed because the data extract is stored locally in memory
B. The workbook closes immediately
C. All charts disappear
D. An error message locks the screen
**Answer:** A
**Explanation:** Extracts are self-contained local copies, allowing full offline analysis without database connectivity.

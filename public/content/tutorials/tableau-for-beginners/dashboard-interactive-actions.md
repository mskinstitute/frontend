---
id: dashboard-interactive-actions
slug: dashboard-interactive-actions
course: tableau-for-beginners
chapter: "5: Interactive Dashboards & Storytelling"
topic: "5.2 Dashboard Actions: Filter Actions, Highlight Actions & URL Links"
title: "Tableau Dashboard Actions: Filter, Highlight & URL Actions"
description: "Make Tableau dashboards truly interactive with Filter Actions, Highlight Actions, URL Actions, Go to Sheet navigation, and Hover/Select/Menu triggers."
difficulty: Beginner
readingTime: 9
order: 2
keywords:
  - tableau dashboard actions
  - tableau filter action use as filter
  - tableau highlight action
  - tableau url action parameters
  - interactive tableau dashboard
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

**Tableau Dashboard Actions connect separate worksheets so clicking, hovering over, or selecting a menu item on one chart dynamically filters, highlights, or launches external URLs across the rest of your dashboard.**

Without Dashboard Actions, a dashboard is just four static charts sitting next to each other. With well-designed actions, a manager can click **Uttar Pradesh** on a map and instantly watch revenue trend lines, product rankings, and customer tables update in sync.

---

## 1. The 4 Essential Dashboard Action Types

Open **Dashboard → Actions → Add Action** to configure interactive rules:

| Action Type | What It Does | Real-World Example |
| :--- | :--- | :--- |
| **Filter Action** | Clicking a mark on a source sheet filters target sheets | Click a region bar → filters monthly trend & order details table |
| **Highlight Action** | Brightens matching marks across charts while dimming others | Hover over "Electronics" → highlights Electronics in scatter & line charts |
| **URL Action** | Opens a dynamic web link using field values as parameters | Click a customer → opens `https://crm.company.com/customers/<Customer ID>` |
| **Go to Sheet Action** | Navigates cleanly to a deep-dive detail worksheet or dashboard | Click "View Order Breakdown" → jumps to granular transaction view |

### Fast Shortcut: The "Use as Filter" Funnel Icon
Want quick cross-filtering without opening dialog boxes? Click any chart container on your dashboard and select the small **Funnel icon (`Use as Filter`)** in its top-right toolbar. Tableau immediately creates an automatic Filter Action targeting all other sheets on the canvas.

---

## 2. Trigger Modes & Clearing Behavior

When configuring an action manually, two settings determine how polished your UX feels:

1. **Run Action On (3 Trigger Options):**
   - **Select (Click):** Best for Filter Actions and drill-downs—intentional and never flickers accidentally.
   - **Hover:** Best for lightweight Highlight Actions so users scan relationships smoothly.
   - **Menu:** Adds a clickable hyperlink inside the chart's tooltip (ideal for URL Actions and optional deep dives).
2. **Clearing the Selection Will:**
   - **Show all values:** Reverts destination sheets back to the full unfiltered dataset (most common default).
   - **Leave the filter:** Keeps the last filtered view active even after deselecting.
   - **Exclude all values:** Collapses a heavy detail table to blank until the user explicitly clicks a mark—a great performance trick for dashboards with 100,000+ granular rows!

---

## Practice Quiz

### 1. What is a 'Filter Action' on a Tableau dashboard?
A. An interactive rule where selecting a mark on a source sheet dynamically filters destination sheets on the canvas
B. A coffee filter
C. A database lock
D. A security password
**Answer:** A
**Explanation:** Filter actions connect sheets interactively, allowing drill-down exploration.
---

### 2. What shortcut icon on a worksheet's dashboard container toggles quick filtering on and off?
A. The Funnel / Filter icon ('Use as Filter')
B. The Trash can
C. The Pencil
D. The Eye
**Answer:** A
**Explanation:** Clicking the funnel icon instantly converts any sheet into an interactive filter for the rest of the dashboard.
---

### 3. What action type allows launching a web browser to view a customer's LinkedIn profile or Salesforce record based on their ID?
A. URL Action
B. Web scrape
C. HTML export
D. Text action
**Answer:** A
**Explanation:** URL Actions construct dynamic hyperlinks using data values as query parameters.
---

### 4. What are the three trigger options for executing a Dashboard Action?
A. Hover, Select (Click), and Menu
B. Double-click, Triple-click, and Right-click
C. Open, Close, and Save
D. Morning, Afternoon, and Night
**Answer:** A
**Explanation:** Actions can trigger upon mouse hover, click selection, or via a tooltip context menu link.
---

### 5. What setting controls what happens when a user clears their selection after clicking a filter mark?
A. 'Clearing the selection will:' (Show all values, Leave the filter, or Exclude all values)
B. Restart computer
C. Delete dashboard
D. Save to cloud
**Answer:** A
**Explanation:** The clear action setting dictates whether destination sheets revert to showing all records or remain blank until clicked.

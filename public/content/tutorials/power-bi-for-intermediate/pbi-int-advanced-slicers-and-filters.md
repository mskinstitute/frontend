# Advanced Slicers, Hierarchy Filtering & Sync Slicers

Slicers are the primary mechanism through which business users interact with Power BI dashboards. In advanced reporting environments, slicers must be synchronized across multi-page report suites, organized into drillable hierarchies, and styled for optimal touch and mouse responsiveness.

---

## 1. Synchronizing Slicers Across Multiple Pages

In an enterprise report with 5 different tabs (e.g., *Executive Summary*, *Sales Analysis*, *Profitability*, *Customer Insights*, *Inventory*), asking a user to select "Fiscal Year: 2025" on every single page is a frustrating user experience.

### The Sync Slicers Solution:
1. Go to the **View** ribbon tab and check **Sync Slicers**.
2. Select any slicer on your canvas.
3. The **Sync Slicers** pane displays a matrix of all report pages:

```
Sync Slicers Matrix:
Page Name               Sync (Link)       Visible (Show)
--------------------------------------------------------
Executive Summary           [X]                [X]
Sales Analysis              [X]                [ ] (Hidden but active!)
Profitability               [X]                [ ] (Hidden but active!)
Customer Insights           [X]                [ ]
```

- **Sync Column ([X]):** When the user changes this slicer on Page 1, it silently filters all synchronized pages automatically!
- **Visible Column ([X]):** Controls whether the physical slicer visual is rendered on that page. (You can keep a slicer invisible on child pages while maintaining global filter sync!)

---

## 2. Hierarchy Slicers

Instead of placing separate slicers for `Category` and `Sub-Category`, combine them into a single **Hierarchy Slicer**:

```
[-] Technology
    [ ] Accessories
    [X] Laptops
    [ ] Phones
[+] Furniture
[+] Office Supplies
```

### Configuration:
1. Create a Slicer visual.
2. Drag `Category` into the Field well.
3. Drag `SubCategory` directly below `Category` in the same Field well.
4. Power BI automatically enables an expandable accordion tree with expand/collapse arrows!

---

## 3. The 4 Levels of Filter Scope in Power BI

Power BI enforces a hierarchical filter precedence model:

```
Filter Precedence Architecture:
Level 1: Visual-Level Filters    (Affects only the single selected chart)
           ^
Level 2: Page-Level Filters      (Affects all visuals on the active report page)
           ^
Level 3: Report-Level Filters    (Affects every visual across all report tabs)
           ^
Level 4: DAX CALCULATE Filters   (Programmatically overrides all UI filters above!)
```

---

# Multiple Choice Questions

### 1. Where do you configure a single slicer to filter multiple report pages simultaneously?
A. In the Data Model View
B. In the "Sync Slicers" pane under the View ribbon tab
C. In Power Query Advanced Editor
D. In the Windows Taskbar
**Answer:** B
**Explanation:** The Sync Slicers pane allows developers to link slicer behavior across multiple pages, specifying which pages synchronize data and which pages display the visual.

### 2. What is the benefit of checking the "Sync" box while leaving the "Visible" box unchecked for a page in the Sync Slicers pane?
A. The page is deleted
B. The page is filtered by the slicer's selection, but the slicer UI itself is hidden to conserve canvas space
C. The slicer is disabled
D. The report loads slower
**Answer:** B
**Explanation:** This allows a master slicer on an introductory page to filter downstream pages without cluttering those sub-pages with redundant slicer controls.

### 3. Which filter scope has the broadest reach in Power BI Desktop?
A. Visual-level filter
B. Page-level filter
C. Filter on all pages (Report-level filter)
D. Tooltip filter
**Answer:** C
**Explanation:** "Filter on all pages" (Report-level) applies a universal filter across every single tab and visual in the entire `.pbix` report file.

### 4. How do you create a Hierarchy Slicer in Power BI Desktop?
A. Merge the columns in Power Query
B. Drag multiple related dimension columns in hierarchical order into the same Field well of a single Slicer visual
C. Write a recursive DAX measure
D. Group the visuals using Ctrl + G
**Answer:** B
**Explanation:** Adding multiple fields (e.g., Year, Quarter, Month) to a single slicer automatically creates an interactive hierarchy tree with expand/collapse nodes.

### 5. What happens when a DAX measure containing `CALCULATE([Total Sales], Dim_Product[Category] = "Tech")` is placed in a visual where the user selected "Furniture" in a slicer?
A. The visual crashes
B. `CALCULATE` overrides the visual slicer, displaying Technology sales
C. The measure returns BLANK
D. The slicer resets to Technology automatically
**Answer:** B
**Explanation:** Filter arguments inside `CALCULATE` overwrite conflicting external filter context originating from visual slicers, enforcing the specified DAX condition.

---

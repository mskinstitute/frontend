# Drillthrough Reports & Cross-Report Navigation

Business executives often view high-level summaries on executive dashboards, but when an anomaly occurs (e.g., a sudden revenue drop in Electronics), they need to **drill through** to a detailed page to see individual orders, customer names, and shipping dates.

---

## 1. What is a Drillthrough Page?

A **Drillthrough Page** is a dedicated destination page in your report designed to display granular details about a specific entity (such as a single Customer, a single Product, or a single Territory).

```
Executive Overview Page                    Drillthrough Destination Page
+---------------------------+              +-------------------------------------+
| Category Sales Summary    |              | Product Detail Deep-Dive: "Laptops" |
| - Technology: $500,000    |  Right-Click | - Total Units Sold: 450             |
| - Furniture:  $300,000    | ------------>| - Average Margin: 28%               |
| - Supplies:   $200,000    | Drillthrough | - Return Rate: 1.2%                 |
| (Right click "Technology")|              | - Transaction Table: Order #101...  |
+---------------------------+              +-------------------------------------+
```

---

## 2. Step-by-Step Implementation of a Drillthrough Page

### Step 1: Create the Destination Page
1. Add a new report page and rename it `Product Details`.
2. Populate the page with detailed visuals: customer lists, order transaction tables, regional profit margins.

### Step 2: Configure the Drillthrough Field
1. In the **Visualizations** pane on the destination page, scroll down to the **Drillthrough** section (or the **Page Information** pane).
2. Drag the dimension field you want to filter by (e.g., `Dim_Product[Category]` or `Dim_Product[ProductName]`) into the **Drill through fields** bucket.
3. Notice that Power BI Desktop automatically creates a **Back Button** ($\leftarrow$) in the top-left corner of the canvas!

### Step 3: Test the Drillthrough
1. Return to the main summary page.
2. Right-click on any data point (e.g., the "Furniture" bar in a chart).
3. Select **Drillthrough** $\to$ **Product Details**.
4. The page will immediately navigate to the `Product Details` page, automatically filtered strictly to "Furniture"!

---

## 3. "Keep All Filters" vs. Focused Filtering

Inside the Drillthrough configuration pane, you will see a toggle switch: **Keep all filters**:
- **ON (Default):** The destination page inherits **ALL** active slicers and filters from the source page (e.g., if the user selected Year 2025 and Region North, the drillthrough page retains Year 2025 and Region North).
- **OFF:** The destination page inherits **ONLY** the specific field that was right-clicked, resetting all other dimensions.

---

# Multiple Choice Questions

### 1. What automatically appears on a report page when you add a field to the "Drill through fields" well?
A. A pie chart
B. A Back Button ($\leftarrow$) that enables users to navigate back to the originating page with a single click
C. A popup warning dialog
D. A new data table in Power Query
**Answer:** B
**Explanation:** Power BI automatically generates a Back navigation button when a drillthrough field is configured, ensuring a seamless user experience when returning to the parent dashboard.

### 2. How does an end-user trigger a drillthrough action on a standard Power BI report?
A. By pressing Ctrl + Alt + Delete
B. By right-clicking a data point in a visual and selecting "Drillthrough" followed by the destination page name
C. By refreshing the browser page
D. By double-clicking the canvas background
**Answer:** B
**Explanation:** Right-clicking any visual data point reveals the context menu containing the Drillthrough sub-menu pointing to all eligible target pages.

### 3. What is the impact of enabling the "Keep all filters" toggle in a drillthrough configuration?
A. It locks the page so users cannot filter further
B. The destination page inherits all existing slicers and visual filters from the source page in addition to the clicked data point
C. It deletes previous bookmarks
D. It forces DirectQuery mode
**Answer:** B
**Explanation:** With "Keep all filters" enabled, all ambient filters (like Year slicers, Region selections, or Customer segments) are carried over to the destination page.

### 4. What type of report navigation allows drillthrough between two entirely separate Power BI reports?
A. Cross-report Drillthrough
B. Hyperlink Web Scraping
C. Power Query Append
D. Direct Connection Protocol
**Answer:** A
**Explanation:** Cross-report drillthrough allows users to jump from a visual in one report directly into a different report in the same workspace, provided both share the same schema.

### 5. Why should drillthrough target pages often be hidden from the page navigation tabs in production reports?
A. To prevent users from editing the visuals
B. Because destination pages rely on an incoming filter context to show meaningful data; viewing them un-filtered can confuse users
C. Power BI will error if drillthrough pages are visible
D. Hidden pages do not consume memory
**Answer:** B
**Explanation:** Unfiltered drillthrough pages often look blank or show meaningless aggregated totals. Hiding the page tab forces users to arrive via the intended right-click drillthrough workflow.

---

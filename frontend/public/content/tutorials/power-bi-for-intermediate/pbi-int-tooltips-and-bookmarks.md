# Custom Report Page Tooltips & Bookmarks Mastery

Intermediate dashboard design focuses on **user experience (UX)**. Instead of cluttering a single canvas with dozens of confusing charts, elite Power BI developers use **Custom Tooltips** (micro-visuals on hover) and **Bookmarks** (storytelling, toggle views, and navigation menus).

---

## 1. Custom Report Page Tooltips

By default, hovering over a chart displays a standard black text box with numerical values. With Custom Tooltips, hovering over a bar can display a miniature chart, trend line, or image card!

```
Hovering over "North" Region Bar:
+-------------------------------------------------------+
| [North Region Bar]                                    |
|          |                                            |
|          v (Custom Micro-Report Popup)                |
|  +-------------------------------------------------+  |
|  | North Region Performance Deep-Dive              |  |
|  | Total Profit: $45,200 | Margin: 24.5%           |  |
|  | Top Category: Laptops ($120k)                   |  |
|  | [ Sparkline Trend Chart: Jan - Dec ]            |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

### Steps to Build a Custom Tooltip:
1. Create a new page and name it `Tooltip_Category`.
2. In the **Page Information** pane:
   - Toggle **Allow use as tooltip** to **ON**.
3. In **Canvas Settings**:
   - Set **Type** to **Tooltip** (dimensions: $320 \times 240$ pixels).
4. Add compact visuals (cards, sparklines, or bullet charts).
5. On your main visual (e.g., Regional Sales Bar Chart):
   - Go to **Format Visual** $\to$ **General** $\to$ **Tooltips**.
   - Set **Type** = `Report page`, **Page** = `Tooltip_Category`.

---

## 2. Interactive Bookmarks & The Selection Pane

A **Bookmark** captures the exact state of a report page, including:
- Filter and slicer states
- Visual visibility (shown vs. hidden via the Selection pane)
- Drill location and sorting order

```
Toggle Views with Bookmarks:
[ Show Chart View ]  <--->  [ Show Table View ]
        |                           |
Bookmark 1: Chart Visible,   Bookmark 2: Table Visible,
Table Hidden in Selection    Chart Hidden in Selection
```

### Building a Chart/Table Toggle:
1. Open the **View** tab and check both **Bookmarks** and **Selection**.
2. Place a **Clustered Column Chart** and a **Matrix Table** in the exact same position on the canvas.
3. In the Selection pane:
   - Hide the Matrix (click the eye icon).
   - Show the Chart.
   - Click **Add Bookmark** $\to$ name it `View_Chart`.
4. In the Selection pane:
   - Show the Matrix.
   - Hide the Chart.
   - Click **Add Bookmark** $\to$ name it `View_Table`.
5. Insert two buttons on canvas: assign their **Action** $\to$ **Bookmark** to switch between views seamlessly!

---

# Multiple Choice Questions

### 1. What canvas size is standard for a custom Report Page Tooltip?
A. 16:9 ($1280 \times 720$ px)
B. Tooltip size ($320 \times 240$ px)
C. Letter ($816 \times 1056$ px)
D. 4:3 ($960 \times 720$ px)
**Answer:** B
**Explanation:** Selecting "Tooltip" in Canvas Settings sets the dimensions to a compact $320 \times 240$ pixels, ideal for hover micro-visuals without obscuring the underlying report.

### 2. Which companion pane in Power BI Desktop is used in conjunction with Bookmarks to show and hide visuals?
A. Analytics pane
B. Selection pane
C. Performance Analyzer pane
D. Data pane
**Answer:** B
**Explanation:** The Selection pane lists every visual on the page with an eye icon, allowing developers to hide or show specific visuals before capturing a bookmark state.

### 3. What options can be unchecked on a bookmark to prevent it from resetting user slicers when clicked?
A. Display
B. Data
C. Current Page
D. Visuals
**Answer:** B
**Explanation:** Unchecking the **Data** property on a bookmark ensures that clicking the button will toggle visual visibility or navigation without resetting the user's active filter and slicer selections.

### 4. How can you link a Bookmark to an interactive shape or button so that clicking it triggers the bookmark?
A. Set the button's "Action" property to "Bookmark" and select the desired bookmark name
B. Write a custom JavaScript function
C. Use the Excel macro recorder
D. Double-click the visual
**Answer:** A
**Explanation:** Any button, image, or shape in Power BI has an **Action** card in its formatting options where the type can be set to **Bookmark** with a target bookmark selected.

### 5. Why are custom tooltips advantageous over packing 20 small charts onto an executive dashboard canvas?
A. They bypass Power BI license costs
B. They maintain clean, minimalist visual real estate while providing rich context on-demand when users hover over specific data points
C. They prevent report export
D. They automatically convert data into Python dataframes
**Answer:** B
**Explanation:** Custom tooltips practice progressive disclosure—presenting a clean high-level interface while keeping deep analytical context available on hover.

---

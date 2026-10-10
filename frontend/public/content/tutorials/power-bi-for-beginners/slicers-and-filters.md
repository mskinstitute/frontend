# Slicers and Filters in Power BI

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Slicers: On-Canvas Visual Controls
A **Slicer** is an interactive visual filter placed directly on the report canvas that allows end-users to filter data by Date, Region, Product, or Category without opening side menus.

### Slicer Display Modes:
- **List / Vertical:** Radio buttons or checkboxes.
- **Dropdown:** Compact, saves canvas space.
- **Between / Slider:** Dual-ended range slider (ideal for Dates and Numbers).
- **Tile:** Modern horizontal button layout (Button bar).

---

## 2. Syncing Slicers Across Multiple Pages
If your report has 5 pages, users shouldn't have to re-select "FY 2026" on every single tab:
- Go to `View` $	o$ `Sync Slicers`.
- Check **Sync** and **Visible** for the desired report pages.

---

# Multiple Choice Questions

### 1. What is the difference between an on-canvas Slicer and a filter in the Filters Pane?
A. Slicers sit directly on the visible report canvas for intuitive end-user interactivity, while the Filters pane is a collapsible side panel
B. Slicers only work on numbers
C. Filters pane costs money
D. There is no difference
**Answer:** A
**Explanation:** Slicers provide accessible on-screen controls for report consumers.
---

### 2. Which slicer style is best for filtering by a continuous date range with start and end sliders?
A. 'Between' slider
B. Vertical list
C. Dropdown
D. Tile buttons
**Answer:** A
**Explanation:** The 'Between' date slicer features dual draggable sliders and calendar pickers.
---

### 3. How can you make a slicer selection on Page 1 automatically apply to Pages 2 and 3?
A. Use the 'Sync Slicers' pane to enable synchronization across pages
B. Copy-paste the slicer
C. Re-open the file
D. Write a Python script
**Answer:** A
**Explanation:** The 'Sync Slicers' tool synchronizes filter states across selected tabs.
---

### 4. What feature allows users to select multiple items in a slicer without holding down the Ctrl key?
A. Enable 'Multi-select with CTRL' turned OFF in Slicer settings
B. Single select mode
C. Lock aspect ratio
D. Tile format
**Answer:** A
**Explanation:** Disabling 'Multi-select with CTRL' allows direct multi-checkbox toggling on click.
---

### 5. What does the 'Hierarchy Slicer' allow?
A. Expanding and collapsing nested dimensions (e.g. Category $	o$ Subcategory $	o$ Product) within a single slicer
B. Filtering Windows users
C. Hiding the database
D. Deleting measures
**Answer:** A
**Explanation:** Dragging multiple hierarchy levels into a slicer creates an expandable tree structure.
---

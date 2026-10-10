# Visualizing Performance with a Chart

In this final capstone phase of the Beginners track, you will complete the Student Report Card project by creating a visual performance ranking chart, setting up print boundaries, and exporting the finalized dashboard as a presentation-ready PDF report.

---

## Step 1: Creating the Student Comparison Column Chart

To compare student overall percentages visually:
1. Highlight student names in cells **`B3:B13`**.
2. Hold down the **Ctrl** key on your keyboard.
3. Highlight the corresponding percentages in cells **`I3:I13`** (holding Ctrl allows you to highlight two non-adjacent columns!).
4. Go to **Insert > Charts > Insert Column or Bar Chart > 2D Clustered Column**.
5. Position the chart neatly below the summary statistics table (e.g., covering cells `B20:H36`).

---

## Step 2: Styling and Customizing the Chart

1. **Chart Title**: Double-click the chart title and rename it: `Overall Student Performance (%)`.
2. **Chart Colors**: Click the chart, click the **Paintbrush** icon > **Color**, and select an **Emerald Green palette** matching the report theme.
3. **Data Labels**:
   - Click the green **'+' (Chart Elements)** button.
   - Check **[✓] Data Labels > Outside End**.
   - The exact percentage appears above each student's bar!
4. **Clean up**:
   - Delete the vertical Y-axis (since exact numbers are now visible on each bar).
   - Uncheck **Gridlines** to create a clean modern visual.

---

## Step 3: Page Setup & Print Area Configuration

Ensure the report prints as a single elegant page:
1. Select the entire report range: **`A1:J38`**.
2. Go to **Page Layout > Print Area > Set Print Area**.
3. Set **Orientation: Landscape**.
4. Under **Scale to Fit**:
   - Set **Width: 1 page**.
   - Set **Height: 1 page**.
5. Go to **Margins > Custom Margins** and check **[✓] Horizontally** under *Center on page*.

---

## Step 4: Exporting the Final Report as PDF

1. Go to **File > Export > Create PDF/XPS Document**.
2. Name your file: `Greenwood_Academy_Report_Card_2026.pdf`.
3. Click **Publish**.
4. Open the PDF: You have created an automated, beautifully formatted, formula-powered academic report card!

# Multiple Choice Questions

### 1. What key must be held down to select two non-adjacent column ranges (such as Student Names in Col B and Percentages in Col I) simultaneously?
A. Shift
B. Ctrl
C. Alt
D. Tab
**Answer:** B
**Explanation:** Holding the Ctrl key enables multi-selection of non-contiguous cell ranges across the spreadsheet grid.

---

### 2. How can you ensure that both the data table and the performance chart print together on a single physical page?
A. Delete half the rows
B. Set the Print Area over both elements, and configure Scale to Fit Width: 1 page and Height: 1 page
C. Print in black and white
D. Save as CSV
**Answer:** B
**Explanation:** Defining a comprehensive Print Area and locking both Scale to Fit Width and Height to 1 page forces all content onto a single sheet.

---

### 3. Which chart element displays exact percentage scores directly above each student's column bar?
A. Legend
B. Data Labels (Outside End)
C. Error Bars
D. Trendline
**Answer:** B
**Explanation:** Data Labels placed at the "Outside End" position show numeric scores directly above each column bar.

---

### 4. What is the benefit of setting "Center on Page: Horizontally" before exporting an Excel report to PDF?
A. It speeds up PDF conversion
B. It centers the table perfectly between the left and right paper margins rather than hugging the top-left corner
C. It merges all cells
D. It increases font size
**Answer:** B
**Explanation:** Centering horizontally aligns the printed grid symmetrically between the left and right margins for professional presentation.

---

### 5. What file format is optimal for sending a finalized, non-editable copy of the Student Report Card to parents and school administrators?
A. .txt
B. .pdf
C. .csv
D. .xltx
**Answer:** B
**Explanation:** PDF documents preserve fonts, borders, and charts identically across all phones and computers while preventing accidental formula tampering.

---

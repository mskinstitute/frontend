# Sorting, Filtering, and Freezing Panes (डेटा सॉर्टिंग, फ़िल्टरिंग और फ़्रीज़ पैन)

When working with extensive administrative datasets—such as a merit list of 5,000 UPSSSC job applicants—scrolling through thousands of unorganized rows is overwhelming. 

Spreadsheets provide three indispensable data management tools: **Sorting** (क्रमबद्ध करना), **Filtering** (छानना), and **Freezing Panes** (हेडर को स्थिर रखना).

---

## 1. Sorting Data (सॉर्टिंग - क्रमबद्ध करना)

Sorting rearranges table rows according to a specific column's values:

- **Ascending Order (बढ़ते क्रम में - A to Z / 1 to 9):**
  - Text: Alphabetical order ($A \to Z$).
  - Numbers: Smallest to largest ($0 \to 100$).
  - Dates: Oldest to newest.
- **Descending Order (घटते क्रम में - Z to A / 9 to 1):**
  - Text: Reverse alphabetical order ($Z \to A$).
  - Numbers: Highest to lowest (ideal for merit ranking!).
  - Dates: Most recent to oldest.
- **Custom / Multi-Level Sort:** Sort first by **District** ($A \to Z$), and then within each district, sort by **Marks** (Highest to Lowest).

---

## 2. Filtering Data with AutoFilter (फ़िल्टरिंग)

**Filtering** temporarily hides rows that do not meet your specified criteria, displaying only the exact records you need to see.

- **AutoFilter Shortcut in Calc:** **`Ctrl + Shift + L`**
- When AutoFilter is enabled, small dropdown arrow buttons appear in each column header cell.
- **How to Use:**
  - Click the dropdown arrow on the **"District"** column header.
  - Uncheck "Select All" and check **"Lucknow"**.
  - The spreadsheet will instantly display only applicants from Lucknow, temporarily hiding all other districts.
  - The total row count in the status bar updates to show matching records.
- **Clearing the Filter:** Click the filter dropdown and select **"All"** to reveal the full hidden dataset again.

---

## 3. Freezing Panes (फ्रीज पैन - हेडर को लॉक करना)

When you scroll down to row 500 of a large sheet, the top header row (*Roll No, Name, Physics, Chemistry, Maths*) scrolls off the screen, leaving you looking at naked numbers without knowing which column is which!

**Freeze Panes** locks specified top rows or leftmost columns in place so they remain permanently visible on screen as you scroll:

- In **LibreOffice Calc:** Click **View menu $\implies$ Freeze Rows and Columns** (or *Freeze First Row* / *Freeze First Column*).
- In **MS Excel:** Click **View Tab $\implies$ Freeze Panes**.
- Once frozen, a thin dark line appears under Row 1. As you scroll down to row 10,000, Row 1 stays pinned at the very top of your screen!

---

# Multiple Choice Questions

### 1. What is the keyboard shortcut to toggle "AutoFilter" in LibreOffice Calc?
A. `Ctrl + F`
B. `Ctrl + Shift + L`
C. `Alt + F`
D. `F8`
**Answer:** B
**Explanation:** In LibreOffice Calc, pressing `Ctrl + Shift + L` activates or deactivates the AutoFilter dropdown buttons on the active table headers.

---

### 2. What does sorting a list of numbers in "Descending Order" accomplish?
A. Arranges numbers from smallest to largest
B. Arranges numbers from highest to lowest
C. Deletes duplicate numbers
D. Multiplies numbers by -1
**Answer:** B
**Explanation:** Descending order sorts numerical values from the highest/largest down to the lowest/smallest.

---

### 3. Which feature keeps header rows permanently visible on screen while scrolling down through long spreadsheets?
A. Split Window
B. Freeze Panes (Freeze Rows and Columns)
C. AutoFormat
D. Page Setup
**Answer:** B
**Explanation:** Freeze Panes pins specified header rows or left columns to the top/side of the view, ensuring labels stay visible regardless of how far you scroll.

---

### 4. When a filter is applied to a table, what happens to the rows that do not match the filter criteria?
A. They are permanently deleted from the hard drive
B. They are temporarily hidden from view
C. They are moved to Sheet 2
D. Their text color turns white
**Answer:** B
**Explanation:** Filtering is a non-destructive view operation. Non-matching rows are merely hidden from the screen and are restored completely when the filter is cleared.

---

### 5. In which menu of LibreOffice Calc is the "Freeze Rows and Columns" command located?
A. Insert Menu
B. View Menu
C. Tools Menu
D. Format Menu
**Answer:** B
**Explanation:** Screen view customizations and window locking tools like "Freeze Rows and Columns" and Zoom are located under the **View** menu.

---
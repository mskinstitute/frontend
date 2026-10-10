# Creating a Student Report Card Layout

Hands-on application cements technical mastery. In this three-topic mini-project, you will build a complete, professional **Student Academic Report Card & Performance Analyzer** from scratch, incorporating data entry best practices, cell formatting, formulas, and visual charting.

---

## Project Specifications & Architecture

- **Project Goal**: Build an automated grade evaluation sheet for a class of 10 students across 5 academic subjects (Mathematics, Science, English, History, Computer Science).
- **Color Theme**: Emerald Green corporate styling:
  - Header Row: Dark Green fill (`#107C41`) with Bold White text (`#FFFFFF`).
  - Student IDs: Alphanumeric (`STD-101` to `STD-110`).
  - Maximum Marks per Subject: `100`.
  - Passing Threshold: `40` marks.

---

## Step 1: Setting Up the Worksheet Grid Structure

1. Open a new Excel workbook and rename `Sheet1` to **`Student_Report_Card`**.
2. Set tab color to **Green**.
3. In cell **`A1`**, type the master title: `GREENWOOD ACADEMY - ACADEMIC PERFORMANCE REPORT 2026`.
4. Highlight cells **`A1:J1`**, press **`Ctrl + 1`**, go to the **Alignment** tab, and set **Horizontal: Center Across Selection**. Make the font **16 pt Bold**, colored deep green.
5. In row 2, leave an empty visual breathing space.

---

## Step 2: Defining Table Column Headers (Row 3)

Enter the following column headers across cells `A3:J3`:
- **A3**: `Student ID`
- **B3**: `Student Name`
- **C3**: `Mathematics`
- **D3**: `Science`
- **E3**: `English`
- **F3**: `History`
- **G3**: `Computer Science`
- **H3**: `Total Marks (500)`
- **I3**: `Percentage (%)`
- **J3**: `Result (Pass/Fail)`

### Formatting the Header Row:
1. Select `A3:J3`.
2. Fill color: **Dark Green (`#107C41`)**.
3. Font: **Calibri 11 pt, Bold, White**.
4. Alignment: **Middle Align, Center** (except Student Name which aligns Left).
5. Click **Wrap Text** to accommodate two-line column titles cleanly.

---

## Step 3: Entering Student Records (Rows 4 to 13)

Populate the roster with 10 sample student records:
- `STD-101` | Aarav Sharma | 88 | 92 | 79 | 85 | 95
- `STD-102` | Emily Watson | 74 | 81 | 88 | 90 | 82
- `STD-103` | Liam Johnson | 45 | 52 | 60 | 58 | 65
- `STD-104` | Sophia Chen | 95 | 98 | 91 | 94 | 99
- `STD-105` | Noah Patel | 32 | 45 | 50 | 48 | 55
- `STD-106` | Olivia Brown | 82 | 78 | 85 | 80 | 88
- `STD-107` | Lucas Garcia | 68 | 72 | 65 | 70 | 74
- `STD-108` | Mia Davis | 91 | 89 | 94 | 92 | 96
- `STD-109` | Ethan Miller | 55 | 60 | 58 | 62 | 64
- `STD-110` | Isabella Wilson | 78 | 85 | 82 | 79 | 86

Format the entire score grid (`A3:J13`) with **All Borders** (`Alt + H + B + A`) to establish crisp geometric structure.

# Multiple Choice Questions

### 1. In setting up the Student Report Card header in cell A1, why is "Center Across Selection" chosen over "Merge & Center"?
A. Merge & Center cannot use colored text
B. Center Across Selection centers the title across columns A through J while keeping individual cells separate, preventing sorting and formula bugs
C. Center Across Selection reduces file size
D. Merge & Center only works in Word
**Answer:** B
**Explanation:** Center Across Selection achieves the identical aesthetic centering effect without fusing cells, preserving standard column selection and sorting mechanics.

---

### 2. Which formatting feature ensures that column titles like "Total Marks (500)" display neatly on two lines without manually widening the column to 30 characters?
A. Shrink to Fit
B. Wrap Text
C. Rotate Text Up
D. AutoCorrect
**Answer:** B
**Explanation:** "Wrap Text" wraps long label text onto multiple vertical lines within the existing column boundary.

---

### 3. What border style is standard for the outer boundary of a formatted table?
A. No border
B. Thick Box Border (or All Borders for gridlines)
C. Diagonal strikethrough
D. Red double underline
**Answer:** B
**Explanation:** Applying All Borders with an optional Thick Box Border frames tabular records cleanly.

---

### 4. What is the benefit of using standardized alphanumeric codes like "STD-101" instead of relying solely on student names?
A. It speeds up printer processing
B. It provides a guaranteed unique primary key identifier, preventing errors if two students share the same name
C. It reduces font size
D. It prevents the sheet from being copied
**Answer:** B
**Explanation:** Unique alphanumeric IDs prevent confusion between identical names and form reliable primary keys for lookups.

---

### 5. Which ribbon command sequence applies "All Borders" to the highlighted range using keyboard access keys?
A. Alt + H + B + A
B. Ctrl + Shift + B
C. Alt + F4
D. Ctrl + B
**Answer:** A
**Explanation:** The key sequence Alt + H + B + A navigates to Home > Borders > All Borders.

---

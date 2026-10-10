# Cell Addressing and Data Entry (सेल एड्रेसिंग और डेटा एंट्री)

Every spreadsheet calculation relies on accurately pinpointing where numbers are located. In spreadsheets, data is entered and referenced using systematic **Cell Addresses**.

---

## 1. What is a Cell Address? (सेल एड्रेस क्या है?)

A **Cell Address** (also called a **Cell Reference**) is formed by combining the **Column Letter** followed by the **Row Number**:

$$\text{Cell Address} = \text{Column Letter} + \text{Row Number}$$

### Examples:
- **`A1`:** The intersection of Column **A** and Row **1** (The very first cell in any sheet!).
- **`C4`:** Column **C**, Row **4**.
- **`AMJ1048576`:** The absolute bottom-right corner cell in a standard LibreOffice Calc sheet.

---

## 2. Cell Range (सेल रेंज क्या है?)

A **Range** is a continuous group or block of adjacent cells selected together. A range is represented by the starting top-left cell address, a **colon (`:`)**, and the ending bottom-right cell address:

$$\text{Range} = \text{TopLeftCell} : \text{BottomRightCell}$$

### Examples:
- **`A1:A10`:** A vertical column range of 10 cells (from A1 down to A10).
- **`A1:E1`:** A horizontal row range of 5 cells (from A1 across to E1).
- **`B2:D6`:** A rectangular block of 15 cells (3 columns wide $\times$ 5 rows tall $= 15$ cells).

---

## 3. Data Types in Spreadsheets

When you type into a cell, Calc and Excel automatically detect the data type:

| Data Type | Description | Default Alignment | Examples |
| :--- | :--- | :--- | :--- |
| **Text / Label** | Words, names, descriptions, or alphanumeric codes | **Left-Aligned (बाईं ओर)** | `Suresh`, `Roll-101`, `Lucknow` |
| **Number / Value** | Pure numerical values used in mathematical calculations | **Right-Aligned (दाईं ओर)** | `450`, `98.50`, `-25` |
| **Date & Time** | Calendar dates and timestamps | **Right-Aligned (दाईं ओर)** | `13/09/2026`, `10:30 AM` |
| **Formula** | Mathematical expression beginning with an equals sign (`=`) | Result is displayed | `=A1+B1`, `=SUM(C1:C10)` |

> **Crucial Rule for CCC Exam:** 
> - By default, **Text is Left-aligned**, while **Numbers and Dates are Right-aligned**!
> - If you prefix any number with a single apostrophe quote (**`'`**), such as **`'98765`**, the spreadsheet will treat that number as **Text** and align it to the left!

---

## 4. Useful Cell Navigation Shortcuts

- **`Enter`:** Confirms data entry and moves the active cell **down** to the next row.
- **`Shift + Enter`:** Moves the active cell **up** to the previous row.
- **`Tab`:** Moves the active cell **right** to the next column.
- **`Shift + Tab`:** Moves the active cell **left** to the previous column.
- **`Ctrl + Home`:** Jumps directly to the very first cell of the sheet (**`A1`**).
- **`Ctrl + End`:** Jumps directly to the last used cell in the worksheet.

---

# Multiple Choice Questions

### 1. By default, how are numbers aligned inside a cell in LibreOffice Calc and MS Excel?
A. Left-aligned
B. Center-aligned
C. Right-aligned
D. Justified
**Answer:** C
**Explanation:** By default, numerical values and dates are right-aligned inside spreadsheet cells, while alphabetic text labels are left-aligned.

---

### 2. How is a rectangular cell range spanning from cell B2 to cell D7 written in a spreadsheet formula?
A. `B2-D7`
B. `B2:D7`
C. `B2 to D7`
D. `B2;D7`
**Answer:** B
**Explanation:** In spreadsheet notation, a colon (`:`) denotes a contiguous range between two bounding cells, written as `B2:D7`.

---

### 3. What symbol must be typed in front of a number (e.g. phone number or pin code) to force the spreadsheet to treat it as Text?
A. Hash (`#`)
B. Single Apostrophe (`'`)
C. Dollar Sign (`$`)
D. Asterisk (`*`)
**Answer:** B
**Explanation:** Prepending an apostrophe (`'`) forces the spreadsheet engine to treat subsequent numerical characters strictly as a text string, preventing leading zeros from being stripped.

---

### 4. Which keyboard shortcut immediately navigates the active cell back to cell A1 from anywhere in the worksheet?
A. `Home`
B. `Ctrl + Home`
C. `Alt + Home`
D. `Shift + Home`
**Answer:** B
**Explanation:** `Ctrl + Home` instantly jumps the active selection to cell A1 (the very first cell of the sheet).

---

### 5. What is the cell address of the cell located at Column J and Row 25?
A. `25J`
B. `J25`
C. `J:25`
D. `$25$J`
**Answer:** B
**Explanation:** Cell addresses are always written with the column letter preceding the row number, making `J25` the correct syntax.

---
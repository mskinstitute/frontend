# Applying Formulas and Grade Calculations

With the raw score records in place, this second phase automates computation: calculating total points with `SUM`, computing percentage scores with `AVERAGE`, determining Pass/Fail status with logical `IF`, and generating class-wide statistics (`MAX`, `MIN`, `AVERAGE`).

---

## Step 1: Computing Total Marks with SUM

In cell **`H4`** (Total Marks for Aarav Sharma):
1. Type the formula:
   ```excel
   =SUM(C4:G4)
   ```
2. Press **Enter**. Excel computes `439`.
3. Double-click the green **AutoFill handle** at the bottom-right of cell H4 to calculate totals for all 10 students instantly!

---

## Step 2: Calculating Percentage (%)

Since there are 5 subjects with a maximum of 100 marks each, the total possible score is 500:
1. In cell **`I4`**, type:
   ```excel
   =H4 / 500
   ```
   *(Alternatively: `=AVERAGE(C4:G4) / 100`)*.
2. Press **Enter**. Cell I4 displays `0.878`.
3. Select column range `I4:I13`.
4. Click the **Percent Style (`%`)** button on the Home tab, and click **Increase Decimal** once.
5. The column now displays formatted percentages: `87.8%`!
6. AutoFill down to row 13.

---

## Step 3: Determining Pass / Fail with the IF Function

A student passes if their overall percentage is 40% (0.40) or greater:
1. In cell **`J4`**, enter the logical test:
   ```excel
   =IF(I4>=0.40, "PASS", "FAIL")
   ```
2. Double-click the AutoFill handle.
3. Noah Patel (32 in Math, total 230, 46%) passes overall, but notice how conditional formatting can flag subject-level failures!

---

## Step 4: Class Summary Statistics (Rows 15 to 18)

Below the student table, build a summary dashboard:
- In cell **`B15`**: `Class Average Score`
- In cell **`B16`**: `Highest Score in Class (Topper)`
- In cell **`B17`**: `Lowest Score in Class`
- In cell **`B18`**: `Total Students Evaluated`

### The Aggregate Formulas:
- **Class Average Percentage (cell `I15`)**:
  ```excel
  =AVERAGE(I4:I13)
  ```
- **Highest Total Marks (cell `H16`)**:
  ```excel
  =MAX(H4:H13)
  ```
- **Lowest Total Marks (cell `H17`)**:
  ```excel
  =MIN(H4:H13)
  ```
- **Total Students Evaluated (cell `B18`)**:
  ```excel
  =COUNTA(A4:A13)
  ```

---

## Step 5: Highlight Failures with Conditional Formatting

1. Select the subject score cells `C4:G13`.
2. Go to **Home > Conditional Formatting > Highlight Cells Rules > Less Than...**
3. Enter **`40`** and select **Light Red Fill with Dark Red Text**.
4. Instantly, any score under 40 (such as Noah Patel's 32 in Math) is illuminated in bright red!

# Multiple Choice Questions

### 1. Which formula calculates the Total Marks across 5 subjects located in cells C4 through G4?
A. =SUM(C4:G4)
B. =TOTAL(C4:G4)
C. =ADD(C4:G4)
D. =C4+G4
**Answer:** A
**Explanation:** =SUM(C4:G4) adds the contiguous range of cells from C4 to G4 inclusive.

---

### 2. If a student's total score is in cell H4, which formula correctly computes their percentage based on 500 total points?
A. =H4 * 500
B. =H4 / 500
C. =PERCENT(H4, 500)
D. =H4 % 500
**Answer:** B
**Explanation:** Dividing the earned marks (H4) by the maximum marks (500) gives the decimal proportion, which displays as a percentage when formatted with Percent Style.

---

### 3. Which logical formula returns "PASS" if a percentage in cell I4 is greater than or equal to 40% (0.40), and "FAIL" otherwise?
A. =IF(I4 >= 0.40, "PASS", "FAIL")
B. =IF(I4 >= 40%, PASS, FAIL)
C. =CHECK(I4, 40)
D. =ISPASS(I4 >= 0.40)
**Answer:** A
**Explanation:** The IF function requires quotes around text outputs: =IF(condition, "value_if_true", "value_if_false").

---

### 4. Which function tallies how many student ID codes exist in the range A4:A13?
A. =SUM(A4:A13)
B. =COUNTA(A4:A13)
C. =COUNT(A4:A13)
D. =TOTAL(A4:A13)
**Answer:** B
**Explanation:** Because student IDs contain text letters ("STD-101"), the COUNTA function must be used instead of numeric-only COUNT.

---

### 5. How can you highlight all individual subject scores below 40 in light red automatically?
A. Change font color cell by cell
B. Home > Conditional Formatting > Highlight Cells Rules > Less Than (enter 40)
C. Data > Filter
D. Page Layout > Orientation
**Answer:** B
**Explanation:** Conditional Formatting "Less Than" rule evaluates cell values dynamically and applies color formatting to any cell falling below the threshold.

---

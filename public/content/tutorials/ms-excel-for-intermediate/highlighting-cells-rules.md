# Highlighting Cells Based on Rules

Conditional Formatting automatically applies styling—such as cell fills, font colors, and borders—to cells that satisfy specific criteria. It instantly draws attention to critical metrics, overdue deadlines, low inventory thresholds, and duplicate values.

---

## 1. Accessing Highlight Cells Rules

Conditional Formatting is located on the **Home** tab in the *Styles* group:

```
Home Tab > Conditional Formatting > Highlight Cells Rules:
├── Greater Than...
├── Less Than...
├── Between...
├── Equal To...
├── Text that Contains...
├── A Date Occurring...
└── Duplicate Values...
```

![Conditional Formatting Rules](/images/tutorials/ms-excel/conditional-formatting-rules.svg)

---

## 2. Common Highlighting Scenarios

### A. Highlighting Exceptions with Greater Than / Less Than
* **Scenario:** Flag all orders where shipment delay exceeds 5 days.
* **Steps:**
  1. Highlight the *Days Delayed* column (e.g., 'E2:E200').
  2. Click **Conditional Formatting > Highlight Cells Rules > Greater Than...**.
  3. Enter '5' in the value box.
  4. Select **Light Red Fill with Dark Red Text** from the preset dropdown (or choose *Custom Format...*).
  5. Click **OK**.

### B. Finding and Flagging Duplicate Records
* **Scenario:** Identify duplicate Employee IDs or Invoice Numbers.
* **Steps:**
  1. Select the identifier column (e.g., 'A2:A500').
  2. Click **Conditional Formatting > Highlight Cells Rules > Duplicate Values...**.
  3. Choose whether to highlight **Duplicate** or **Unique** entries.
  4. Select a formatting style (e.g., Yellow Fill with Dark Yellow Text).
  5. Click **OK**. Every duplicate ID is highlighted immediately.

### C. Text That Contains (Status Tracking)
* **Scenario:** Color code task status columns:
  * Highlight cells containing 'Completed' in Green.
  * Highlight cells containing 'Pending' in Yellow.
  * Highlight cells containing 'Cancelled' in Red.
* Apply three separate rules using **Highlight Cells Rules > Text that Contains...**.

---

## 3. Top / Bottom Rules

Located directly beneath Highlight Cells Rules, **Top/Bottom Rules** dynamically evaluate numbers relative to the entire selected group:

* **Top 10 Items... / Bottom 10 Items...:** Highlights the highest or lowest N values (you can customize N to Top 3, Top 5, etc.).
* **Top 10%... / Bottom 10%...:** Flags the upper or lower percentile tier.
* **Above Average... / Below Average...:** Calculates the mathematical mean on the fly and highlights values above or below average. As numbers change, the formatting dynamically recalculates!

---

## 4. Managing and Clearing Rules

* **Clear Rules from Selected Cells:** Removes rules from only the active selection.
* **Clear Rules from Entire Sheet:** Strips all conditional formatting across the sheet.
* **Conditional Formatting Rules Manager:** Click **Home > Conditional Formatting > Manage Rules...** (or press **Alt + O + D**) to edit threshold numbers, change colors, or adjust evaluation order.

---

# Multiple Choice Questions

### 1. Where is the Conditional Formatting tool located in the Microsoft Excel ribbon?
A. Data tab > Analysis group
B. Home tab > Styles group
C. Insert tab > Reports group
D. View tab > Display group
**Answer:** B
**Explanation:** Conditional Formatting is located on the Home tab in the Styles command group.

---

### 2. Which preset rule allows you to quickly locate duplicate customer IDs in a column?
A. Top/Bottom Rules > Top 10
B. Highlight Cells Rules > Duplicate Values...
C. Text that Contains > "Duplicate"
D. Data Validation > Unique Only
**Answer:** B
**Explanation:** 'Highlight Cells Rules > Duplicate Values...' instantly detects and colors duplicate entries within the selected range.

---

### 3. What happens to the formatting applied by 'Above Average' if you update the numbers in the column?
A. Nothing; the formatting is frozen
B. Excel automatically recalculates the mean and updates the highlights dynamically
C. You must delete and recreate the rule
D. The sheet displays an error
**Answer:** B
**Explanation:** Conditional formatting rules are dynamic; they re-evaluate whenever cells in the monitored range are modified.

---

### 4. How can you open the Rules Manager to edit, reorder, or delete existing conditional formatting rules?
A. Ctrl + Shift + F
B. Home > Conditional Formatting > Manage Rules...
C. File > Options > Formatting
D. Alt + F11
**Answer:** B
**Explanation:** Selecting 'Manage Rules...' opens the Conditional Formatting Rules Manager dialog box.

---

### 5. If you only want to highlight tasks that contain the word 'Urgent' anywhere in the cell, which rule is best suited?
A. Highlight Cells Rules > Between...
B. Highlight Cells Rules > Text that Contains...
C. Top/Bottom Rules > Bottom 10%
D. Equal To > Exact Match
**Answer:** B
**Explanation:** 'Text that Contains...' searches for substrings within text cells and applies formatting to matching occurrences.

---

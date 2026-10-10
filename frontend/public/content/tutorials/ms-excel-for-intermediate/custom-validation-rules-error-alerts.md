# Custom Validation Rules and Error Alert Modals

Beyond built-in limits, Excel allows you to write custom formulas to enforce sophisticated business constraints (such as preventing duplicate entries or ensuring total percentages equal 100%). Furthermore, understanding the three distinct **Error Alert Styles** determines whether users are strictly blocked or merely cautioned.

---

## 1. The Three Error Alert Styles

When a user violates a validation rule, Excel displays an Error Alert modal. You can choose from three styles under the **Error Alert** tab:

```
+-----------------------------------------------------------------------------------+
| 1. STOP (Red Octagon with White 'X')                                              |
| Strict Enforcement. The user CANNOT bypass this modal. They must either:          |
| - Click "Retry" to enter a compliant value, or                                    |
| - Click "Cancel" to restore the previous valid entry.                             |
+-----------------------------------------------------------------------------------+
| 2. WARNING (Yellow Triangle with Exclamation Mark)                               |
| Moderate Enforcement. Asks: "Continue? [Yes] [No] [Cancel]".                      |
| If the user clicks "Yes", Excel accepts the invalid value!                        |
+-----------------------------------------------------------------------------------+
| 3. INFORMATION (Blue Circle with 'i')                                             |
| Gentle Notification. Informs the user of the deviation with [OK] [Cancel].        |
| Clicking "OK" accepts the invalid entry unconditionally.                         |
+-----------------------------------------------------------------------------------+
```

![Error Alert Modals and Custom Validation](/images/tutorials/ms-excel/data-validation-dialog.svg)

---

## 2. Advanced Custom Formula Rules (Allow: Custom)

Selecting **Allow: Custom** enables you to write formulas that evaluate to **TRUE** or **FALSE**:

### A. Preventing Duplicate Entries in Real-Time
To prevent users from entering duplicate Invoice Numbers or Employee IDs in column A ('A2:A500'):
```excel
=COUNTIF($A$2:$A$500, A2) <= 1
```
*How it works:* If the entered value already exists in the column, COUNTIF returns 2. Since 2 is not <= 1, Excel triggers the Stop modal immediately!

### B. Enforcing Budget Allocation to Equal 100%
To ensure that department spending allocations across row cells 'B2:E2' do not exceed 100%:
```excel
=SUM($B2:$E2) <= 1
```

### C. Rejecting Leading or Trailing Spaces
Ensure clean data entry without accidental spaces:
```excel
=A2 = TRIM(A2)
```

---

## 3. Auditing with 'Circle Invalid Data'

What happens if you apply Data Validation to a sheet that *already* contains bad data? Existing entries are not automatically deleted.
* Go to **Data > Data Validation dropdown arrow > Circle Invalid Data**.
* Excel draws bright red ovals around every pre-existing non-compliant cell!
* Once corrected, click **Clear Validation Circles** to remove the markings.

---

# Multiple Choice Questions

### 1. Which Error Alert style completely prevents a user from entering an invalid value, offering only 'Retry' or 'Cancel'?
A. Information
B. Warning
C. Stop
D. Caution
**Answer:** C
**Explanation:** The 'Stop' error alert style is the only style that strictly blocks non-compliant data from being entered into the cell.

---

### 2. What happens if a user triggers a 'Warning' error alert modal and clicks 'Yes'?
A. The computer reboots
B. Excel accepts and keeps the invalid value in the cell
C. The cell is formatted red
D. The workbook is converted to PDF
**Answer:** B
**Explanation:** The Warning modal cautions the user but permits them to override the rule by clicking 'Yes'.

---

### 3. Which custom formula prevents users from entering duplicate values in the range 'B2:B100'?
A. =DUPLICATE(B2)=0
B. =COUNTIF($B$2:$B$100, B2) <= 1
C. =UNIQUE(B2:B100)
D. =SUM(B2:B100)=1
**Answer:** B
**Explanation:** '=COUNTIF($B$2:$B$100, B2) <= 1' evaluates whether the value appears only once; if a duplicate is attempted, it evaluates to FALSE and rejects the entry.

---

### 4. How can you visually locate pre-existing invalid entries that were typed into cells before Data Validation was applied?
A. Press Ctrl + Z
B. Data tab > Data Validation dropdown > Circle Invalid Data
C. Home tab > Find & Select > Replace
D. Delete the worksheet
**Answer:** B
**Explanation:** The 'Circle Invalid Data' command draws red circles around any cells in the worksheet that violate active validation rules.

---

### 5. In custom validation formulas, what must the expression evaluate to for Excel to permit the data entry?
A. Exactly 0
B. Any text string
C. TRUE (or a non-zero number)
D. #N/A
**Answer:** C
**Explanation:** Custom data validation tests whether the formula returns TRUE; if TRUE, the entry is accepted; if FALSE, the error alert is triggered.

---

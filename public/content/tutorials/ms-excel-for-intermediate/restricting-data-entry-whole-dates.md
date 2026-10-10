# Restricting Data Entry (Numbers, Dates, Length)

Spreadsheet models are only as reliable as the data entered into them. Human typing errors—such as entering negative quantities, typing text into date fields, or entering 9-digit tax codes instead of 10 digits—can corrupt reports. **Data Validation** enforces strict rules at the point of data entry, rejecting invalid entries before they contaminate your workbook.

---

## 1. Accessing Data Validation

1. Select the cell or range you want to restrict (e.g., 'B2:B500').
2. Go to the **Data** tab on the Ribbon.
3. In the *Data Tools* group, click **Data Validation** (or press **Alt + A + V + V**).
4. The Data Validation dialog box opens with three tabs: **Settings**, **Input Message**, and **Error Alert**.

![Data Validation Dialog Box](/images/tutorials/ms-excel/data-validation-dialog.svg)

---

## 2. Setting Up Entry Restrictions (Settings Tab)

Under the **Settings** tab, the **Allow** dropdown defines permitted data types:

### A. Restricting Numbers (Whole Number & Decimal)
* **Whole Number:** For inventory order quantities where fractions make no sense (e.g., Allow: Whole Number | Data: Greater than or equal to | Minimum: 1).
* **Decimal:** For discount percentages or financial rates (e.g., Allow: Decimal | Data: Between | Minimum: 0.00 | Maximum: 0.50).

### B. Restricting Dates and Times
* **Dates:** Ensure users cannot book appointments in the past or beyond a fiscal deadline:
  * Allow: **Date**
  * Data: **Greater than or equal to**
  * Start Date: '=TODAY()' *(Dynamically restricts bookings to today or future dates!)*

### C. Restricting Text Length
* **Text Length:** Ideal for fixed-length identification numbers (like 10-digit PAN cards or 5-digit postal codes):
  * Allow: **Text Length**
  * Data: **Equal to**
  * Length: **10**
  * If a user types 9 or 11 characters, Excel rejects the entry immediately!

---

## 3. Guiding Users with Input Messages

To help users understand restrictions *before* they make a mistake:
1. In the Data Validation dialog, switch to the **Input Message** tab.
2. Check **Show input message when cell is selected**.
3. Title: *"Entry Requirement"*
4. Message: *"Please enter an order quantity between 1 and 100 units."*
5. *Result:* Whenever a user clicks the cell, a polite yellow tooltip appears alongside their cursor.

---

# Multiple Choice Questions

### 1. Where is the Data Validation command located on the Microsoft Excel ribbon?
A. Home tab > Editing group
B. Data tab > Data Tools group
C. Formulas tab > Formula Auditing
D. View tab > Show group
**Answer:** B
**Explanation:** Data Validation is located on the Data tab within the Data Tools group (shortcut Alt + A + V + V).

---

### 2. Which Data Validation setting restricts entries strictly to integers, disallowing fractions and decimals?
A. Decimal
B. Whole Number
C. Text Length
D. List
**Answer:** B
**Explanation:** The 'Whole Number' validation type allows only integer values, blocking decimals and fractions.

---

### 3. How can you dynamically prevent users from entering past dates into an appointment scheduling column?
A. Allow: Date | Data: Greater than or equal to | Start date: =TODAY()
B. Allow: Text | Equal to: "Future"
C. Allow: Any Value
D. Type "No Past Dates" in row 1
**Answer:** A
**Explanation:** Setting validation to Date with 'Greater than or equal to' and formula '=TODAY()' restricts entries to the current date or future dates dynamically.

---

### 4. Which validation rule ensures that users type exactly a 5-digit ZIP or postal code?
A. Whole Number equal to 5
B. Text Length equal to 5
C. Decimal equal to 5.0
D. Date between 1 and 5
**Answer:** B
**Explanation:** 'Text Length' set to 'Equal to 5' enforces that exactly five characters are entered.

---

### 5. What feature in Data Validation displays a helpful tooltip beside the cell as soon as a user clicks into it?
A. Error Alert
B. Input Message
C. ScreenTip macro
D. Comment thread
**Answer:** B
**Explanation:** The 'Input Message' tab lets you configure a prompt that displays automatically when the user selects the cell.

---

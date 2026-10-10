---
title: 'Using Data Sources'
description: 'Connect and manage data sources: linking Excel spreadsheets, sorting and filtering recipients, and handling missing data.'
keywords:
  - data source
  - excel mail merge
  - filter recipients
  - mailings
  - recipient list
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'using-data-sources'
---

# Using Data Sources

## Connecting & Filtering Data Sources

The accuracy of a Mail Merge depends entirely on the cleanliness of your data source. Microsoft Word allows you to link external databases, filter recipients by specific criteria, and remove duplicate entries.

![Connecting Excel Data Sources to Mail Merge](/images/tutorials/ms-word/mail-merge-wizard.svg)

### 1. Best Practices for Preparing an Excel Data Source

Before connecting an Excel sheet to Word:
1. **Row 1 Must Be Headers**: Row 1 of your Excel sheet should contain clean column headers: `First_Name`, `Last_Name`, `Address`, `City`, `State`, `Fees_Due`, `Email`.
2. **No Blank Rows at the Top**: Never put title banners or empty rows above Row 1!
3. **Separate Data Fields**: Keep *First Name* and *Last Name* in separate columns so you can greet recipients as *"Dear Rahul,"* rather than *"Dear Rahul Sharma,"*.
4. **Close Excel**: Save and **close the Excel workbook** before connecting in Word (Word cannot establish an exclusive OLE/ODBC connection if Excel locks the file open!).

### 2. Connecting the Data Source in Word

1. Open your master template in Word.
2. Go to **Mailings** tab > click **Select Recipients** > choose **Use an Existing List...**
3. Browse and select your Excel workbook (`.xlsx`).
4. Select the specific worksheet tab (e.g. `Sheet1$`) and ensure **First row of data contains column headers** is checked.
5. Click **OK**. The Mailings tab buttons will instantly illuminate and activate!

### 3. Filtering & Sorting Recipients

You don't have to merge everyone in your database!
Click **Mailings > Edit Recipient List**:
- **Checkboxes**: Uncheck individual people you wish to skip.
- **Filter...**: Set conditions:
  - *Example*: `City Equal to Delhi` AND `Fees_Due Greater than 0`.
  - Only students in Delhi with pending dues will be generated!
- **Sort...**: Sort alphabetically by `Last_Name` Ascending, or by `PIN_Code` (to qualify for bulk postal discounts!).
- **Find Duplicates**: Automatically scans and detects duplicate email addresses or student IDs.

# Multiple Choice Questions

### 1. Why should you close your Excel spreadsheet file before connecting it to Word Mail Merge?
A. To save battery
B. To release the file lock so Word can establish a database read connection
C. Excel files lose data if left open
D. Word cannot open .xlsx files
**Answer:** B
**Explanation:** Excel locks files when open, which can block Word from establishing an ODBC/OLEDB connection.
---

### 2. What should always be placed in Row 1 of an Excel sheet intended for Mail Merge?
A. A company logo
B. Clean column header names (First_Name, Address, etc.)
C. Blank spacer rows
D. A grand total formula
**Answer:** B
**Explanation:** Row 1 must contain field header names, which become the Merge Field tags in Word.
---

### 3. Where can you filter recipients (e.g. only generate letters for people in "Delhi")?
A. Home > Editing > Find
B. Mailings > Edit Recipient List > Filter
C. Layout > Margins
D. File > Options
**Answer:** B
**Explanation:** Mailings > Edit Recipient List opens the database manager where you can filter and sort records.
---

### 4. Which option under "Select Recipients" allows you to type new contact details directly inside Word without Excel?
A. Use an Existing List
B. Type a New List...
C. Choose from Outlook Contacts
D. AutoFill
**Answer:** B
**Explanation:** "Type a New List..." creates an internal Access-compatible database (.mdb) directly inside Word.
---

### 5. Can Mail Merge sort records by Postal Code automatically before printing envelopes?
A. No, sorting must be done manually in Notepad
B. Yes, through the Sort tab inside Edit Recipient List
C. Only in Access, not in Word
D. Only with VBA macros
**Answer:** B
**Explanation:** The Edit Recipient List dialog contains a multi-level Sort tool to order by postal code or name.
---


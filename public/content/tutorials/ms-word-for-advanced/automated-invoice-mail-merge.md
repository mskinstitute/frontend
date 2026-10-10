---
title: 'Automated Invoice using Mail Merge'
description: 'Hands-on Mini Project: Build an automated corporate billing invoice generated from an Excel database using Mail Merge.'
keywords:
  - invoice mail merge
  - billing invoice
  - mini project invoice
  - merge fields invoice
  - automated billing
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'automated-invoice-mail-merge'
---

# Automated Invoice using Mail Merge

## Mini-Project 4: Automated Corporate Invoice via Mail Merge

In this project, you will combine table formatting, formula calculations, and Mail Merge automation to generate hundreds of professional, personalized customer billing invoices from an external Excel database.

![Automated Billing Invoice Architecture with Mail Merge](/images/tutorials/ms-word/mail-merge-wizard.svg)

### Step 1: Preparing the Excel Billing Database (`BillingData.xlsx`)
Create an Excel spreadsheet with clean headers:
- `Invoice_No`, `Customer_Name`, `Company`, `Billing_Address`, `Course_Title`, `Duration`, `Amount`, `Tax`, `Total_Due`, `Due_Date`.
- Save and close Excel.

### Step 2: Designing the Professional Invoice Layout
1. Open a new Word document. Set Margins to **Narrow** ($0.5\text{ in}$).
2. **Company Header Table (1 Row, 2 Columns)**:
   - Left: Company Logo and *"MSK INSTITUTE OF TECHNOLOGY - Tax Invoice"*.
   - Right: Invoice Metadata Block:
     - `Invoice #: <<Invoice_No>>`
     - `Date: 12-Sep-2026`
     - `Due Date: <<Due_Date>>`
   - Set border to **No Border**.

### Step 3: Bill To & Customer Info Block
1. Insert a stylized card table for customer details:
   - `Bill To:`
   - `<<Customer_Name>>`
   - `<<Company>>`
   - `<<Billing_Address>>`

### Step 4: The Itemized Charges Table
1. Insert a 4-column table:
   - Header Row (Navy Blue fill, Bold White text):
     - `Item Description` | `Duration` | `Tax (18%)` | `Amount Due`
   - Data Row:
     - `<<Course_Title>>` | `<<Duration>>` | `<<Tax>>` | `<<Amount>>`
   - Total Row (Double bottom border):
     - Merged columns 1-3: `Grand Total Payable:`
     - Column 4: `<<Total_Due>>`

### Step 5: Connecting the Data Source & Preview
1. Go to **Mailings > Select Recipients > Use an Existing List...** > select `BillingData.xlsx`.
2. Map your fields using **Insert Merge Field**.
3. Click **Preview Results** to verify that customer #1, customer #2, and customer #3 reflect exact invoice numbers and billing totals!

### Step 6: Batch Generation
Click **Finish & Merge > Edit Individual Documents** to generate all invoices into a single multi-page file ready for archiving, printing, or PDF emailing!

# Multiple Choice Questions

### 1. Why is Narrow margin setting (0.5") recommended when designing professional single-page invoices?
A. It uses less ink
B. It maximizes printable area so headers, tables, and terms fit on one neat page without spilling over
C. Printers only accept narrow margins
D. Word disables tables on normal margins
**Answer:** B
**Explanation:** Narrow margins provide maximum vertical and horizontal room to keep invoices on a single page.
---

### 2. What tool should you use to review individual customer numbers and totals before generating all 500 invoices?
A. Spelling & Grammar
B. Preview Results on the Mailings tab
C. Save As
D. Compare Documents
**Answer:** B
**Explanation:** Preview Results allows cycling through actual recipient records to confirm layout accuracy.
---

### 3. In an automated invoice template, what are the placeholders like <<Total_Due>> called?
A. Formulas
B. Merge Fields
C. Bookmarks
D. AutoCorrects
**Answer:** B
**Explanation:** Merge Fields dynamically pull individual customer data from the linked Excel database.
---

### 4. Which border style is standard beneath the Grand Total row in accounting invoices?
A. Dotted border
B. Double bottom border
C. No border
D. Thick red border
**Answer:** B
**Explanation:** A double bottom underline is the traditional accounting standard indicating a finalized grand total.
---

### 5. Which command under Finish & Merge compiles all customer invoices into a single editable document?
A. Edit Individual Documents
B. Print Documents
C. Send Email Messages
D. Save to OneDrive
**Answer:** A
**Explanation:** "Edit Individual Documents" compiles all merged records into one continuous reviewable document.
---


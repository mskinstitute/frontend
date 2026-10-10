---
title: 'Introduction to Mail Merge'
description: 'Understand the power of Mail Merge: batch personalized letters, invoices, certificates, and labels using an automated data source.'
keywords:
  - mail merge
  - mailings tab
  - form letters
  - merge fields
  - batch printing
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'introduction-to-mail-merge'
---

# Introduction to Mail Merge

## The Architecture of Mail Merge

Imagine having to send personalized admission acceptance letters to 1,200 students, or generate personalized monthly salary slips for 500 employees. Retyping names, addresses, and fees manually would take weeks and lead to human errors.

**Mail Merge** is Microsoft Word's premier batch automation engine. It combines a single base document with a structured recipient database to generate hundreds of customized documents in seconds.

![Mail Merge Architecture and Automated Workflow](/images/tutorials/ms-word/mail-merge-wizard.svg)

### The Three Pillars of Mail Merge

1. **The Main Document**:
   - The master template containing static boilerplate text (company letterhead, formal body paragraphs, signature block) and placeholders called **Merge Fields** (e.g. `<<First_Name>>`, `<<Balance_Due>>`).
2. **The Data Source (Recipient List)**:
   - The database containing recipient records in organized columns and rows.
   - Most commonly an **Excel Workbook (`.xlsx`)**, **Access Database (`.accdb`)**, **Outlook Contacts list**, or **CSV text file**.
3. **The Merged Output Document**:
   - The final product generated when Word matches the main template with the data source.
   - You can choose to:
     - **Edit Individual Documents**: Creates a giant multi-page Word file with 1 page per recipient.
     - **Print Documents**: Sends all merged letters directly to the printer.
     - **Send Email Messages**: Automatically emails personalized emails through Outlook!

### Types of Documents Supported by Mail Merge

- **Letters**: Individual personalized correspondence with custom names, dates, and account numbers.
- **Email Messages**: Mass personalized emails sent through Microsoft Outlook.
- **Envelopes**: Batch prints mailing addresses directly onto envelopes (sizes #10, DL, C5, etc.).
- **Labels**: Generates adhesive mailing labels matching Avery sheet templates (e.g. 30 labels per sheet).
- **Directory / Catalog**: Compiles an address directory or product catalog list.

# Multiple Choice Questions

### 1. What are the three essential components required to execute a Mail Merge in MS Word?
A. Font, Paragraph, and Styles
B. Main Document, Data Source, and Merged Output
C. Header, Footer, and Page Numbers
D. Word, Excel, and PowerPoint
**Answer:** B
**Explanation:** Mail Merge relies on the Main Document (template), Data Source (database), and the resulting Merged Output.
---

### 2. What are the placeholder tags called that represent recipient data inside a Mail Merge document (e.g. <<First_Name>>)?
A. Variables
B. Merge Fields
C. Placeholders
D. Bookmarks
**Answer:** B
**Explanation:** Merge Fields (enclosed in double chevrons like <<Name>>) represent dynamic columns from the data source.
---

### 3. What is the most popular and flexible data source application used with Word Mail Merge?
A. Notepad
B. Microsoft Excel spreadsheet
C. Paint
D. Calculator
**Answer:** B
**Explanation:** Excel spreadsheets (.xlsx) are the most common data sources due to easy column naming and row editing.
---

### 4. Can Mail Merge automatically send personalized emails directly through Microsoft Outlook?
A. No, Word cannot send emails
B. Yes, via "Finish & Merge > Send Email Messages"
C. Only with a third-party plugin
D. Only to 5 recipients at a time
**Answer:** B
**Explanation:** Finish & Merge > Send Email Messages dispatches individual personalized emails through Outlook.
---

### 5. Under which Ribbon tab is the complete Mail Merge toolset located?
A. References
B. Mailings
C. Review
D. Insert
**Answer:** B
**Explanation:** The Mailings tab is dedicated to the entire Mail Merge, envelopes, and labels workflow.
---


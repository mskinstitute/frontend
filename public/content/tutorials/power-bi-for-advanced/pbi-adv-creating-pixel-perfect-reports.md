# Creating Pixel-Perfect Reports: Invoices, Billing & Statements

In executive and legal settings, visual approximations are unacceptable. A commercial invoice must align to exact corporate typography, display official company branding logos, format financial currencies with exact commas and decimal precisions, and fit strict envelope window folds.

---

## 1. Anatomy of a Pixel-Perfect Document

```
+-----------------------------------------------------------------------------+
| PAGE HEADER (Repeats on Page 1 to N)                                        |
| [Company Logo]                                          INVOICE #INV-2025-01|
| TechCorp Solutions Pvt Ltd                              Date: March 15, 2025|
+-----------------------------------------------------------------------------+
| BILL TO:                                                SHIP TO:            |
| Global Enterprise Inc                                   Warehouse 4B        |
| 100 Financial Boulevard, Mumbai                         Navi Mumbai, MH     |
+-----------------------------------------------------------------------------+
| TABLIX BODY (Flows across pages with repeating headers)                     |
| Line # | Item Description              | Qty | Unit Price | Line Total      |
|--------|-------------------------------|-----|------------|-----------------|
| 1      | Enterprise Cloud License      | 10  | $4,500.00  | $45,000.00      |
| 2      | Consulting Integration (Days) | 5   | $1,200.00  | $6,000.00       |
+-----------------------------------------------------------------------------+
| PAGE FOOTER (Repeats on Page 1 to N)                                        |
| Payment Terms: Net 30 Days                 Page: Globals!PageNumber of Total|
+-----------------------------------------------------------------------------+
```

---

## 2. Critical Configuration Rules in Report Builder

1. **Page Size & Margins:**
   - Standard A4: Width = $8.27$ in, Height = $11.69$ in.
   - Standard Margins: $0.5$ in Left, Right, Top, Bottom.
   - **Usable Body Width:** $\text{Page Width} - (\text{Left Margin} + \text{Right Margin}) = 8.27 - (0.5 + 0.5) = \mathbf{7.27 \text{ in}}$.
   - > **GOLDEN RULE:** If Body Width + Left Margin + Right Margin exceeds Page Width by even $0.01$ inch, Power BI will generate a blank alternating page on every export!
2. **Repeating Headers:**
   - In Tablix Properties $\to$ Check **Repeat header rows on each page**.
   - Check **Keep header visible while scrolling**.

---

# Multiple Choice Questions

### 1. What causes a Paginated Report to unexpectedly export with alternating blank pages in PDF format?
A. The computer has low memory
B. The sum of the report Body Width plus Left and Right Margins exceeds the designated Page Width
C. The font size is too small
D. PDF files do not support tables
**Answer:** B
**Explanation:** If the printable body width plus margins exceeds the physical paper width by even a fraction of a millimeter, the extra width spills over into blank alternating pages.

### 2. How do you ensure that column headers repeat at the top of every single printed page in a multi-page paginated report?
A. Copy and paste the header 50 times
B. Configure the Tablix member properties: set `RepeatOnNewPage = True` and `KeepWithGroup = After`
C. Convert the report to an image
D. Use a line chart
**Answer:** B
**Explanation:** Setting `RepeatOnNewPage = True` on static Tablix row headers instructs the pagination engine to duplicate the header row whenever a page break occurs.

### 3. What global built-in variable in Report Builder outputs the standard "Page 1 of 5" footer text?
A. `="Page " & Globals!PageNumber & " of " & Globals!TotalPages`
B. `=PAGE_COUNT()`
C. `=NOW()`
D. `=USERID()`
**Answer:** A
**Explanation:** Report Builder provides the `Globals` collection, where `Globals!PageNumber` and `Globals!TotalPages` supply dynamic pagination numbers for running footers.

### 4. Which file export format from a Paginated Report maintains exact, uncompromised fidelity down to the millimeter?
A. CSV
B. PDF
C. Plain Text (.txt)
D. HTML
**Answer:** B
**Explanation:** PDF is a page-layout vector format that locks visual dimensions, margins, and fonts to exact paper specifications.

### 5. Why are interactive Power BI (.pbix) reports unsuitable for generating legal customer invoices?
A. They cannot calculate multiplication
B. They render inside a fixed digital canvas with internal scrollbars and cannot dynamically paginate multi-page line items or repeat headers across printed pages
C. Invoices are illegal in digital formats
D. DirectQuery is required
**Answer:** B
**Explanation:** Interactive reports are designed for screens; tables develop scrollbars rather than cleanly splitting into consecutive pages with running footers.

---

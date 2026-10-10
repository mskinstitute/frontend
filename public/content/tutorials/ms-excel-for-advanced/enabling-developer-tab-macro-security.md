# Developer Tab & Macro Security Settings

Macros and VBA (Visual Basic for Applications) allow you to automate tedious manual workflows, generate reports at the push of a button, and build custom spreadsheet applications. Because macros can execute computer code, Microsoft Excel hides the **Developer Tab** by default and enforces strict security measures to protect users from malicious macro viruses.

---

## 1. Enabling the Developer Ribbon Tab

To access macro recording, form controls, and the VBA code editor, you must display the Developer tab:

1. Right-click anywhere on the existing Ribbon tabs (e.g., Home or Insert) and select **Customize the Ribbon...** (or go to **File > Options > Customize Ribbon**).
2. In the right-hand column under *Main Tabs*, locate the **Developer** checkbox.
3. Check the box for **Developer**.
4. Click **OK**.

```
Developer Tab Command Groups:
├── Code           (Visual Basic [Alt+F11], Macros [Alt+F8], Record Macro, Macro Security)
├── Add-ins        (Excel Add-ins, COM Add-ins)
├── Controls       (Insert Form Controls / ActiveX Controls, Design Mode)
└── XML            (Source, Map Properties, Import/Export XML)
```

![Developer Tab and VBA Architecture](/images/tutorials/ms-excel/macros-vba-editor.svg)

---

## 2. Understanding Macro Security Settings

Because malicious scripts could harm your system, Excel features a **Trust Center** to control macro execution:

1. Go to **Developer > Macro Security** (or **File > Options > Trust Center > Trust Center Settings > Macro Settings**).
2. The Four Macro Security Levels:
   * **Disable VBA macros without notification:** All macros are blocked silently.
   * **Disable VBA macros with notification (Recommended Default):** Macros are disabled by default, but a yellow security warning bar appears when opening the file: *"Macros have been disabled. [Enable Content]"*. This allows you to verify the source before running code.
   * **Disable VBA macros except digitally signed macros:** Only runs code signed with a verified cryptographic certificate.
   * **Enable VBA macros (Not Recommended; potentially dangerous):** Runs all macros automatically. Never select this on production computers!
3. **Trusted Locations:** Add specific secure company folders (e.g., 'C:\CompanyReports\') to Trusted Locations so your internal automation workbooks open with macros pre-enabled without nagging warning prompts.

---

## 3. Saving Macro-Enabled Workbooks (.xlsm)

Standard Excel workbooks with the `.xlsx` extension **CANNOT store VBA macros**! If you write a macro and save as `.xlsx`, Excel strips out all code permanently.
* Always save workbooks containing macros as **Excel Macro-Enabled Workbook (*.xlsm)**.
* Alternatively, save as **Excel Binary Workbook (*.xlsb)** for faster loading of massive models.

---

# Multiple Choice Questions

### 1. Where do you go in Microsoft Excel to make the hidden Developer tab visible on the Ribbon?
A. Insert tab > Add-ins
B. File > Options > Customize Ribbon (check the Developer box)
C. Formulas tab > Calculation Options
D. Review tab > Protect Workbook
**Answer:** B
**Explanation:** The Developer tab is enabled by going to File > Options > Customize Ribbon and checking the Developer checkbox in the Main Tabs list.

---

### 2. What file extension must be used when saving an Excel workbook containing VBA macro code?
A. .xlsx
B. .xlsm (or .xlsb)
C. .docx
D. .csv
**Answer:** B
**Explanation:** Standard .xlsx files cannot store macro code; saving code requires the Excel Macro-Enabled Workbook format (.xlsm) or Binary format (.xlsb).

---

### 3. Which Macro Security setting is recommended by cybersecurity professionals for day-to-day corporate work?
A. Enable VBA macros (allow all code without prompts)
B. Disable VBA macros with notification (shows a prompt allowing users to enable trusted code)
C. Delete all macros on download
D. Run as Administrator
**Answer:** B
**Explanation:** 'Disable VBA macros with notification' alerts the user when macros are present, giving them the choice to enable content only from trustworthy files.

---

### 4. What keyboard shortcut opens the Microsoft Visual Basic for Applications (VBA) Editor directly?
A. Ctrl + F1
B. Alt + F11
C. Shift + F8
D. Ctrl + Shift + V
**Answer:** B
**Explanation:** Alt + F11 is the universal keyboard shortcut to launch the Visual Basic Editor across all Microsoft Office applications.

---

### 5. What is the purpose of adding a folder to 'Trusted Locations' in the Trust Center?
A. It compresses all files in that folder
B. Workbooks located in that folder execute their macros automatically without triggering security warning banners
C. It backs up the files to OneDrive
D. It prevents the files from being deleted
**Answer:** B
**Explanation:** Designating a directory as a Trusted Location instructs Excel to run macros stored within that path without showing warning prompts.

---

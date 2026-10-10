---
title: 'Linking & Embedding Objects'
description: 'Master Object Linking and Embedding (OLE): Paste Special, live Excel worksheet embeds, PowerPoint slides, and PDF attachments.'
keywords:
  - ole
  - object linking
  - paste special
  - embed excel
  - linked object
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'linking-embedding-objects-ole'
---

# Linking & Embedding Objects

## OLE Architecture: Linking vs. Embedding

Microsoft Windows provides **Object Linking and Embedding (OLE)**, a powerful inter-process communication protocol that allows Word to host live documents from external applications like Microsoft Excel, PowerPoint, and Adobe Acrobat.

### Linked Object vs. Embedded Object

Understanding the architectural distinction between linking and embedding is crucial:

| Feature | Linked Object | Embedded Object |
| :--- | :--- | :--- |
| **Where Data Lives** | Stored in the original external file (e.g. `Sales.xlsx`). | Stored **completely inside** the Word document itself! |
| **File Size** | Keeps Word file size small (stores only a pointer/link). | Increases Word file size by the weight of the embedded file. |
| **Updates** | Changes in Excel **automatically update** in Word! | Changes in the external file do **not** affect the Word file. |
| **Portability** | If you email the Word file without the Excel file, the link breaks! | Self-contained; you can email the Word file anywhere. |

### 1. How to Embed an Excel Spreadsheet

1. In Excel, select the cells you want to embed > press **Ctrl + C**.
2. In Word, go to **Home** tab > click the downward arrow under **Paste** > select **Paste Special...** (or press `Ctrl + Alt + V`).
3. In the dialog:
   - Select **Paste** > **Microsoft Excel Worksheet Object**.
   - Click **OK**.
4. The spreadsheet appears on your canvas.
5. **Double-click the embedded object**: Word's entire Ribbon transforms into the Microsoft Excel Ribbon inside your Word window! You can edit formulas, change cell values, and format decimals directly! Double-click back outside onto the Word canvas when finished.

### 2. How to Create an Active Linked Object

1. Copy the Excel data (`Ctrl + C`).
2. In Word, go to **Paste > Paste Special...**
3. Select the radio button: **Paste Link**!
4. Choose **Microsoft Excel Worksheet Object**.
5. Click **OK**.
6. *Result*: Now, whenever anyone updates numbers in the original Excel file on your company server, the Word report reflects the new totals automatically!

### 3. Displaying as an Icon (File Attachments)

When authoring executive summaries, you may want to attach a 50-page PDF audit report or a PowerPoint slide deck without cluttering the page:
1. Go to **Insert > Object** (Text group).
2. Switch to the **Create from File** tab.
3. Browse and select your file (e.g. `Audit_Report.pdf`).
4. Check the box: **Display as icon**!
5. Click **OK**.
6. A clean PDF or Excel icon appears on your page. Any reader who double-clicks the icon opens the full original file in Acrobat or Excel!

# Multiple Choice Questions

### 1. What does "OLE" stand for in Microsoft Office architecture?
A. Online Learning Environment
B. Object Linking and Embedding
C. Open Layout Extension
D. Office Language Engine
**Answer:** B
**Explanation:** OLE stands for Object Linking and Embedding, allowing documents to host external application objects.
---

### 2. What happens if you email a Word document containing a LINKED Excel object to a colleague without sending the Excel file?
A. The file cannot open
B. The link breaks because Word cannot locate the external file path
C. Word automatically converts it to an image
D. The email bounces
**Answer:** B
**Explanation:** Linked objects require access to the source file path; if the external file is missing, the link breaks.
---

### 3. What is the keyboard shortcut to open the "Paste Special" dialog box in Microsoft Word?
A. Ctrl + V
B. Ctrl + Alt + V
C. Shift + Insert
D. Alt + V
**Answer:** B
**Explanation:** Ctrl + Alt + V directly launches the Paste Special options dialog.
---

### 4. What occurs when you double-click an EMBEDDED Excel Worksheet object inside a Word document?
A. It deletes the object
B. Word's interface temporarily transforms into the Excel Ribbon for in-place editing
C. Word saves as PDF
D. It opens Paint
**Answer:** B
**Explanation:** In-place OLE editing activates Excel's full ribbon and calculation engine directly inside the Word canvas.
---

### 5. Which checkbox inside the Insert > Object dialog allows you to attach files as clickable application icons?
A. Link to Web
B. Display as icon
C. Embed font
D. Create shortcut
**Answer:** B
**Explanation:** "Display as icon" packages the embedded document into a clean, clickable application icon.
---


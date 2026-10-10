---
title: 'Practical Macro Examples'
description: 'Real-world macro automation: auto-cleaning messy pasted text, stamping corporate footers, and 1-click PDF publishing with VBA.'
keywords:
  - vba examples
  - clean text macro
  - macro code
  - export pdf macro
  - practical macros
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'practical-macro-examples'
---

# Practical Macro Examples

## Practical Macro Recipes & VBA Automation

Behind every recorded macro in Microsoft Word is **Visual Basic for Applications (VBA)** code. Pressing **Alt + F11** opens the VBA Integrated Development Environment (IDE), allowing you to inspect, fine-tune, and supercharge your macros.

![Practical VBA Macro Scripts in Microsoft Word](/images/tutorials/ms-word/macros-vba-dialog.svg)

### Recipe 1: The "Clean Pasted Web Text" Macro
When text is pasted from websites, it often contains unwanted formatting, hyperlinks, double spaces, and grey background fills.
This macro strips everything and standardizes the text in one click:

```vba
Sub CleanPastedText()
    ' Strips character and paragraph formatting
    Selection.ClearFormatting
    Selection.Font.Name = "Calibri"
    Selection.Font.Size = 11
    Selection.Font.ColorIndex = wdBlack
    Selection.ParagraphFormat.LineSpacingRule = wdLineSpaceSingle
    Selection.ParagraphFormat.SpaceAfter = 6
    Selection.ParagraphFormat.Alignment = wdAlignParagraphJustify
End Sub
```

### Recipe 2: The "Corporate Footer Stamp" Macro
Automatically injects the standard corporate footer with file path, date, and page numbers across all sections:

```vba
Sub AddCorporateFooter()
    Dim sec As Section
    For Each sec In ActiveDocument.Sections
        With sec.Footers(wdHeaderFooterPrimary).Range
            .Text = "Confidential - MSK Institute | Printed on: " & Format(Date, "dd-mmm-yyyy")
            .Font.Name = "Segoe UI"
            .Font.Size = 9
            .Font.ColorIndex = wdGray50
            .ParagraphFormat.Alignment = wdAlignParagraphCenter
        End With
    Next sec
End Sub
```

### Recipe 3: The 1-Click "Export Clean PDF" Macro
Exports the active document as a high-resolution PDF in the same folder with the same file name, without going through Export menus:

```vba
Sub QuickExportPDF()
    Dim pdfPath As String
    pdfPath = Replace(ActiveDocument.FullName, ".docx", ".pdf")
    pdfPath = Replace(pdfPath, ".docm", ".pdf")
    ActiveDocument.ExportAsFixedFormat OutputFileName:=pdfPath, _
        ExportFormat:=wdExportFormatPDF, OpenAfterExport:=True
End Sub
```

### How to Paste VBA Code into Word
1. Press **Alt + F11** to open the VBA Editor.
2. In the Project Explorer on the left, double-click **Normal > Modules > NewMacros**.
3. Paste the code at the bottom of the window.
4. Press **Ctrl + S** to save. Close the editor.
5. The macro is now ready to run from your Macros dialog or custom button!

# Multiple Choice Questions

### 1. What is the keyboard shortcut to launch the Visual Basic for Applications (VBA) Editor in MS Word?
A. Alt + F1
B. Alt + F11
C. Ctrl + F11
D. Shift + F9
**Answer:** B
**Explanation:** Alt + F11 is the universal keyboard shortcut to open the VBA editor in all Office applications.
---

### 2. In VBA code, which object represents the currently selected text on the document canvas?
A. ActiveSheet
B. Selection
C. RangeText
D. CurrentLine
**Answer:** B
**Explanation:** Selection represents the active text cursor or highlighted block in Word VBA.
---

### 3. What programming language underlies recorded macros in Microsoft Office applications?
A. JavaScript
B. Python
C. Visual Basic for Applications (VBA)
D. C++
**Answer:** C
**Explanation:** VBA (Visual Basic for Applications) is the internal automation programming language of MS Office.
---

### 4. In the VBA Project window, which module store ensures code runs across all documents on your system?
A. Project.docx
B. Normal > Modules > NewMacros
C. System32
D. ThisDocument
**Answer:** B
**Explanation:** Placing macros in Normal > Modules > NewMacros makes them available globally across all Word files.
---

### 5. What VBA method exports an active Word document into a standard PDF file programmatically?
A. Document.PrintToPDF
B. ActiveDocument.ExportAsFixedFormat
C. Document.ConvertToPDF
D. SaveAsPDF()
**Answer:** B
**Explanation:** ActiveDocument.ExportAsFixedFormat is the native VBA method for publishing to PDF format.
---


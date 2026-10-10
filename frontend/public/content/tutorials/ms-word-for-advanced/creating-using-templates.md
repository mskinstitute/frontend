---
title: 'Creating & Using Templates'
description: 'Build standardized corporate templates (.dotx, .dotm): locked styles, building blocks, placeholder fields, and template deployment.'
keywords:
  - word templates
  - dotx format
  - building blocks
  - custom templates
  - corporate branding
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'creating-using-templates'
---

# Creating & Using Templates

## Corporate Document Standardization: Word Templates

A common pitfall in organizations is employees copying an old project document, deleting the text, and typing new content. This introduces formatting drift, leftover confidential metadata, and corrupt styles.

A **Word Template (`.dotx` or `.dotm`)** serves as a pristine master blueprint. When a user double-clicks a template, Word opens a fresh, unsaved copy (`Document1`), leaving the master template untouched and protected.

### 1. Template File Formats

- **Word Template (`.dotx`)**: The standard macro-free template format.
- **Word Macro-Enabled Template (`.dotm`)**: Preserves embedded VBA macros and automated form controls.

### 2. How to Build a Custom Template

1. Design the document with all corporate standards:
   - High-resolution company logo in the header.
   - Standard brand color palette and font pairings.
   - Customized `Heading 1`, `Heading 2`, and `Normal` styles.
   - Standard copyright statement in the footer.
   - Generic placeholder text (e.g. *"[Type Executive Summary Here]"*).
2. Go to **File > Save As** (or press `F12`).
3. In the **Save as type** dropdown, select **Word Template (*.dotx)**.
4. Word automatically directs the save location to your local **Custom Office Templates** folder (`Documents\Custom Office Templates`).
5. Name the file (e.g. `Corporate_Report_Template.dotx`) and click **Save**.

### 3. Deploying & Using Templates

When colleagues need to write a new report:
1. Open Word > click **File > New**.
2. Click the **Personal** (or **Custom**) tab next to Featured.
3. Click your custom template icon.
4. Word spawns a brand new, clean `Document1` file inheriting all margins, styles, logos, and header designs instantly!

# Multiple Choice Questions

### 1. What is the default file extension for a standard macro-free Microsoft Word template?
A. .docx
B. .dotx
C. .dotm
D. .tmpl
**Answer:** B
**Explanation:** .dotx is the standard file format for modern Microsoft Word template master files.
---

### 2. What happens when a user double-clicks a .dotx template file in Windows Explorer?
A. The master template is deleted
B. Word opens a new, unsaved document (Document1) based on the template
C. The template opens in read-only mode in Notepad
D. An error is flagged
**Answer:** B
**Explanation:** Double-clicking a template creates a new document instance, protecting the template from accidental overwriting.
---

### 3. Which file extension must you choose if your master template contains embedded VBA macros?
A. .dotx
B. .dotm
C. .docvba
D. .docx
**Answer:** B
**Explanation:** .dotm (Word Macro-Enabled Template) is required to preserve embedded macros.
---

### 4. In which default Windows directory does Word look for user-created templates?
A. C:\Windows\System32
B. Documents\Custom Office Templates
C. Desktop
D. Program Files\Word
**Answer:** B
**Explanation:** Word stores and indexes user templates in the "Custom Office Templates" folder under Documents.
---

### 5. Where can you access your custom saved templates when starting a new document inside Word?
A. View > Zoom
B. File > New > Personal / Custom tab
C. References > Index
D. Review > Protect
**Answer:** B
**Explanation:** File > New > Personal (or Custom) displays all locally saved user template blueprints.
---


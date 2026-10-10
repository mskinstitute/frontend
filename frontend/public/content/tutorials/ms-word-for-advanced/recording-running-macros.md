---
title: 'Recording & Running Macros'
description: 'Automate repetitive workflows: activate the Developer tab, record macro keystrokes, save in Normal.dotm, and run macros.'
keywords:
  - macros
  - record macro
  - developer tab
  - vba automation
  - run macro
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'recording-running-macros'
---

# Recording & Running Macros

## Macros: Automating Repetitive Tasks

If you find yourself executing the same sequence of 15 formatting steps every morning (setting margins to Narrow, adding a company title, changing font to 12pt Calibri, inserting a date header), you can record a **Macro**.

A Macro is a saved series of commands and instructions that can be played back automatically with a single click or keyboard shortcut.

![Recording and Running Macros in Word](/images/tutorials/ms-word/macros-vba-dialog.svg)

### 1. Activating the Developer Tab

By default, Word hides the Developer tab:
1. Right-click anywhere on the Ribbon > click **Customize the Ribbon...**
2. In the right-hand column under Main Tabs, check the **Developer** checkbox.
3. Click **OK**. The **Developer** tab now appears permanently on your Ribbon!

### 2. Recording a Macro Step-by-Step

1. Navigate to **Developer** tab (or **View** tab) > click **Record Macro**.
2. In the dialog box:
   - **Macro name**: Enter a name without spaces (e.g. `FormatDailyReport`).
   - **Assign macro to**: Choose **Button** (for QAT) or **Keyboard** (e.g. assign shortcut `Alt + Shift + R`).
   - **Store macro in**:
     - *All Documents (Normal.dotm)*: The macro will be available in **every** Word document you ever open on your computer!
     - *Current Document*: The macro is saved only inside this specific file.
   - **Description**: Document what the macro accomplishes.
3. Click **OK**.
4. Notice your mouse pointer now displays a small **cassette tape** icon!
5. Carefully perform the actions you wish to automate (e.g., set margins, apply styles, insert a table).
6. When finished, go to **Developer > Stop Recording** (or click the small square stop button on the bottom Status Bar).

### 3. Running Your Macro

Whenever you want to repeat that sequence:
- Press the assigned keyboard shortcut (e.g. `Alt + Shift + R`), OR
- Go to **Developer > Macros**, select `FormatDailyReport`, and click **Run**.
- Word executes all 15 actions in under **0.1 seconds**!

> ⚠️ **Warning:** The mouse *cannot* be used to select text during macro recording! You must use keyboard navigation keys (`Shift + Arrow keys`, `Ctrl + Home`) to select text while recording.

# Multiple Choice Questions

### 1. Which Ribbon tab is specifically dedicated to advanced developer tools, XML, and VBA Macros?
A. Layout
B. Review
C. Developer
D. References
**Answer:** C
**Explanation:** The Developer tab provides access to VBA coding, Macro recording, and Form Controls.
---

### 2. Where should you store a recorded macro if you want it accessible across ALL documents on your PC?
A. Temporary Folder
B. All Documents (Normal.dotm)
C. Desktop
D. WordArt Gallery
**Answer:** B
**Explanation:** Saving in Normal.dotm makes the macro globally accessible in all Word sessions.
---

### 3. What visual indicator appears next to the mouse pointer while a Macro is actively recording?
A. A red stop sign
B. A cassette tape icon
C. A spinning hourglass
D. A yellow warning star
**Answer:** B
**Explanation:** Word displays a cassette tape icon next to the cursor to remind you that actions are being recorded.
---

### 4. Why must you use keyboard arrow keys rather than the mouse to select text while recording a macro?
A. Mouse clicks are disabled by Windows
B. Word does not record mouse pointer text selections inside the canvas
C. Mouse clicks delete text
D. Macros only work with numbers
**Answer:** B
**Explanation:** Word macro recording captures keyboard commands for text selection; mouse drag selections are ignored.
---

### 5. What file extension must be used when saving a Word document containing active embedded Macros?
A. .docx
B. .docm
C. .txt
D. .pdf
**Answer:** B
**Explanation:** .docm (Word Macro-Enabled Document) is required to preserve VBA macros (standard .docx strips macros for security).
---


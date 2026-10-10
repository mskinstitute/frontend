# Recording and Running Macros with Shortcuts

The **Macro Recorder** acts as a software camera that records your mouse clicks and keystrokes in Excel and translates them into clean Visual Basic (VBA) code. It is the fastest way to automate repetitive formatting routines without writing code by hand.

---

## 1. Absolute vs. Relative Reference Recording

Before pressing Record, you must decide how Excel will treat cell addresses:

```
+-----------------------------------+-----------------------------------+
| Absolute Recording (Default)      | Relative Reference Recording      |
+-----------------------------------+-----------------------------------+
| Macro always operates on the exact| Macro operates on cells relative  |
| coordinates recorded (e.g., A1:D1)| to wherever the active cursor is  |
| regardless of where cursor is.    | positioned when executed!         |
+-----------------------------------+-----------------------------------+
```

* To toggle Relative Reference mode: Click **Developer > Use Relative References** (the button highlights gray when active).

![Recording Macros and Shortcuts](/images/tutorials/ms-excel/macros-vba-editor.svg)

---

## 2. Step-by-Step: Recording Your First Formatting Macro

Let’s record a macro that formats an unstyled data table with a bold navy header, centered text, auto-fitted columns, and accounting borders:

1. Position your cursor in cell **A1** of your raw data table.
2. Click **Developer > Record Macro** (or click the small recording icon in the bottom-left Status Bar).
3. In the *Record Macro* dialog:
   * **Macro name:** **FormatExecutiveTable** *(Names cannot contain spaces or special characters!)*
   * **Shortcut key:** Press **Shift + T** (Setting shortcut to **Ctrl + Shift + T**; avoid overwriting standard shortcuts like Ctrl + C or Ctrl + V).
   * **Store macro in:**
     * *This Workbook:* Macro only works inside this specific file.
     * *Personal Macro Workbook (PERSONAL.XLSB):* Macro becomes globally available across every workbook you ever open on this computer!
   * **Description:** *"Formats raw data into an executive table layout."*
4. Click **OK**. The recording begins!
5. Perform your actions deliberately:
   * Select header row > Apply Navy Fill and White Bold text.
   * Highlight table > Apply thin borders.
   * Select columns > Double-click column boundary to **AutoFit Selection**.
6. Click **Developer > Stop Recording** (or click the blue square in the Status Bar).

---

## 3. Running and Testing the Macro

* **Via Shortcut:** Open a new sheet with messy unformatted data, click cell A1, and press **Ctrl + Shift + T**. Excel formats the entire table in under a quarter of a second!
* **Via Macro Dialog:** Press **Alt + F8**, select **FormatExecutiveTable** from the list, and click **Run**.

> **The "Undo" Warning in Macros:**
> Running a macro **completely clears Excel’s Undo history**! You cannot press Ctrl + Z to undo a macro’s actions. Always test macros on backup copies of important workbooks!

---

# Multiple Choice Questions

### 1. What happens to Excel's Undo history (Ctrl + Z) when you run a macro?
A. Nothing; you can undo it normally
B. The entire Undo history is wiped clean; macro actions cannot be reversed with Ctrl + Z
C. It prompts you to save
D. It creates an undo backup file on the desktop
**Answer:** B
**Explanation:** VBA code execution purges Excel's undo stack, meaning actions performed by macros cannot be reversed with the standard Undo command.

---

### 2. Which setting should you activate if you want a recorded macro to apply formatting to the currently active cell rather than fixed coordinates?
A. Absolute References
B. Use Relative References
C. Static Coordinates
D. Design Mode
**Answer:** B
**Explanation:** Enabling 'Use Relative References' records actions using relative offsets rather than rigid absolute cell coordinates.

---

### 3. Where can you store a recorded macro so it is permanently available across every Excel workbook opened on your computer?
A. This Workbook
B. New Workbook
C. Personal Macro Workbook (PERSONAL.XLSB)
D. Windows Desktop
**Answer:** C
**Explanation:** Saving macros in the hidden Personal Macro Workbook makes them universally accessible across all workbooks on that computer.

---

### 4. What is the keyboard shortcut to open the 'Macro' dialog box listing all available macros?
A. Alt + F8
B. Ctrl + M
C. Shift + F1
D. F12
**Answer:** A
**Explanation:** Alt + F8 opens the Macro management dialog to run, step into, edit, or delete existing macros.

---

### 5. Which of the following is a valid name for an Excel macro?
A. Format Table 2026!
B. 1st_Report_Run
C. Format_Monthly_Report
D. Total$Sales
**Answer:** C
**Explanation:** Macro names must start with a letter and contain only letters, numbers, and underscores; spaces and special characters like ! or $ are prohibited.

---

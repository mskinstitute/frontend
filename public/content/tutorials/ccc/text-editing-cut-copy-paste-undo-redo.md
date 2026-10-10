# Text Editing: Cut, Copy, Paste, Undo, Redo (टेक्स्ट एडिटिंग)

Text editing allows you to alter, correct, rearrange, and duplicate words, sentences, and paragraphs without having to retype them from scratch. 

The **Clipboard** (क्लिपबोर्ड) is an invisible temporary storage area in RAM managed by the operating system that holds text or graphics you have cut or copied.

---

## 1. Text Selection Techniques

Before modifying text, you must select (highlight) it:

- **Single Word:** Double-click on the word.
- **Entire Sentence:** Triple-click anywhere inside the sentence (in Writer) or `Ctrl + Click` (in Word).
- **Entire Paragraph:** Quadruple-click (4 clicks) on the paragraph.
- **Entire Document (Select All):** **`Ctrl + A`**.
- **Continuous Selection:** Click at the start, hold down the **`Shift`** key, and click at the end.

---

## 2. Cut, Copy, and Paste Mechanics

```text
   [Original Document]               [Clipboard (RAM)]              [Target Location]
  "MSK Computer Institute"           
            │
            ├─► [Ctrl + C (Copy)] ─────► Holds Text ───────► [Ctrl + V (Paste)] ─► "MSK Computer Institute"
            │                                                                      (Text appears in BOTH places)
            │
            └─► [Ctrl + X (Cut)] ──────► Holds Text ───────► [Ctrl + V (Paste)] ─► "MSK Computer Institute"
                (Original erased!)                                                 (Text MOVED to new place)
```

### Keyboard Shortcuts:
- **Copy (कॉपी):** **`Ctrl + C`** (Leaves original text intact).
- **Cut (कट):** **`Ctrl + X`** (Deletes original text from source).
- **Paste (पेस्ट):** **`Ctrl + V`** (Inserts clipboard contents at cursor position).
- **Paste Special (पेस्ट स्पेशल):** **`Ctrl + Shift + V`** (Writer/Calc) or **`Ctrl + Alt + V`** (Word). Allows pasting unformatted plain text without carrying over unwanted internet formatting.

---

## 3. Undo and Redo: Reversing Mistakes

Humans make typing and formatting mistakes. Word processors provide a safety net:

- **Undo (अनडू - पूर्ववत करें):** Reverses your last action, restoring text or formatting to its previous state.
  - Shortcut: **`Ctrl + Z`**
- **Redo / Repeat (रीडू - पुनः करें):** Re-applies the action that was just undone by Undo.
  - Shortcut: **`Ctrl + Y`**

---

## 4. Non-Printing Characters (विगेटिंग मार्क)

Sometimes text looks misaligned because of extra spaces or accidental Tab presses. In LibreOffice Writer, you can toggle **Non-Printing Characters** on and off:
- Shortcut: **`Ctrl + F10`**
- Displays visual symbols on screen (which **do not print** on paper):
  - Spaces appear as dots (`·`).
  - Enter / Paragraph breaks appear as pilcrow signs (`¶`).
  - Tab keys appear as small right arrows (`→`).

---

# Multiple Choice Questions

### 1. What is the universal keyboard shortcut for the "Undo" command?
A. `Ctrl + U`
B. `Ctrl + Z`
C. `Ctrl + Y`
D. `Ctrl + X`
**Answer:** B
**Explanation:** `Ctrl + Z` is the universal shortcut to Undo the most recent editing action. (`Ctrl + U` applies underline).

---

### 2. What is the temporary storage area in memory that stores cut or copied data called?
A. Recycle Bin
B. Clipboard
C. Hard Drive
D. ROM
**Answer:** B
**Explanation:** The Clipboard is a temporary RAM buffer maintained by the operating system that retains text, images, or files after a Cut or Copy operation until pasted.

---

### 3. What is the keyboard shortcut for "Paste Special" in LibreOffice Writer?
A. `Ctrl + P`
B. `Ctrl + V`
C. `Ctrl + Shift + V`
D. `Alt + V`
**Answer:** C
**Explanation:** In LibreOffice Writer and Calc, `Ctrl + Shift + V` opens the Paste Special dialog, enabling users to paste unformatted text, RTF, or HTML tables cleanly.

---

### 4. Which keyboard shortcut toggles the display of Non-Printing Characters (¶) in LibreOffice Writer?
A. `Ctrl + F1`
B. `Ctrl + F10`
C. `Ctrl + F12`
D. `F9`
**Answer:** B
**Explanation:** Pressing `Ctrl + F10` in LibreOffice Writer toggles non-printing formatting marks (showing hidden paragraph breaks, spaces, and tabs).

---

### 5. What shortcut selects the entire content of a document at once?
A. `Ctrl + S`
B. `Ctrl + A`
C. `Shift + A`
D. `Alt + A`
**Answer:** B
**Explanation:** `Ctrl + A` (Select All) highlights all text, images, and tables across the entire active document or folder.

---
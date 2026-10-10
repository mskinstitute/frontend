# Editing and Deleting Data

Modifying cell contents efficiently without accidentally overwriting complex formulas or destroying cell borders is a vital daily spreadsheet competency. Excel provides distinct editing modes, clearing tiers, and search-and-replace tools.

---

## Overwriting vs. Editing In-Place

Beginners often make the mistake of single-clicking a cell and typing, which **completely overwrites and deletes** the previous contents:
- **Overwriting**: Single-click a cell and start typing. The existing text/formula is wiped clean and replaced with the new keystrokes.
- **Editing In-Place (Safe Editing)**:
  - **Press `F2`**: Puts the active cell into **Edit Mode**. A blinking cursor appears at the end of the text.
  - **Double-Click**: Double-clicking the cell places the cursor precisely at the clicked character.
  - **Formula Bar**: Click inside the Formula Bar across the top to edit long formulas without obscuring adjacent cells.

---

## Clearing vs. Deleting Cells

Pressing the **Delete** key on your keyboard only clears the *content* (text or numbers) of the cell. It **does not delete the cell itself**, nor does it clear formatting!

### The "Clear" Menu Hierarchy (Home > Editing > Clear)
- **Clear All**: Purges everything—contents, formatting, borders, hyperlinks, and attached cell comments.
- **Clear Formats**: Wipes away colors, bold text, borders, and number formatting, returning the cell to default General plain text while keeping the typed numbers intact.
- **Clear Contents (Delete Key)**: Erases the text or numbers, but preserves the cell's background color, border lines, and number format.
- **Clear Comments / Notes**: Removes threaded review comments.
- **Clear Hyperlinks**: Removes clickable web links while preserving the display text.

---

## Deleting Entire Cells, Rows, and Columns

If you want to physically remove cells from the grid so surrounding cells collapse into the vacant space:
1. Select the cell, row, or column.
2. Go to **Home > Delete > Delete Cells** (or press **`Ctrl + -`** [Ctrl and minus key]).
3. The **Delete dialog** prompts you:
   - *Shift cells left*
   - *Shift cells up*
   - *Entire row* (deletes the entire horizontal row across the sheet)
   - *Entire column* (deletes the entire vertical column)
4. To insert new cells/rows instead, press **`Ctrl + Shift + +`** (Ctrl and plus key).

---

## Find & Replace (`Ctrl + F` / `Ctrl + H`)

- **Find (`Ctrl + F`)**: Locate specific words, codes, or formula strings across the active sheet or entire workbook.
- **Replace (`Ctrl + H`)**: Substitute terms in bulk (e.g., replacing "Dept A" with "Engineering").
- *Options button*: Expand options to match case, search by rows/columns, look within formulas or cell values, and target specific formats (e.g., replace all red cells with green cells).

# Multiple Choice Questions

### 1. Which function key immediately activates "Edit Mode" in the currently selected cell, placing a blinking cursor at the end of the text?
A. F1
B. F2
C. F4
D. F7
**Answer:** B
**Explanation:** Pressing F2 enters cell Edit Mode, allowing you to edit existing text without overwriting the previous contents.

---

### 2. What happens to a cell when you select it and press the Delete key on your keyboard?
A. The cell is physically removed and lower cells shift up
B. Only the cell contents are erased, while background colors, borders, and number formats are preserved
C. The entire row is deleted
D. The formatting is erased, but numbers remain
**Answer:** B
**Explanation:** Pressing Delete only clears the cell's content values; formatting, fill colors, and borders remain intact until cleared via "Clear Formats" or "Clear All".

---

### 3. Which command removes bold styling, background colors, and borders from a cell while keeping its numbers and text completely intact?
A. Home > Clear > Clear Formats
B. Home > Delete > Delete Sheet
C. Ctrl + Z
D. Home > Clear > Clear Contents
**Answer:** A
**Explanation:** "Clear Formats" strips all visual styling, fonts, and borders, reverting the cell to default appearance while preserving the stored values.

---

### 4. What keyboard shortcut opens the Delete Cells dialog to delete selected rows, columns, or shift cells?
A. Ctrl + D
B. Ctrl + - (minus key)
C. Alt + Delete
D. Shift + Backspace
**Answer:** B
**Explanation:** Ctrl + - (minus) triggers the Delete Cells command, while Ctrl + Shift + + (plus) triggers the Insert Cells command.

---

### 5. What universal shortcut opens the Find & Replace dialog box directly to the "Replace" tab in Excel?
A. Ctrl + F
B. Ctrl + H
C. Ctrl + R
D. Alt + R
**Answer:** B
**Explanation:** Ctrl + H opens Find and Replace with the Replace tab active (Ctrl + F opens the Find tab).

---

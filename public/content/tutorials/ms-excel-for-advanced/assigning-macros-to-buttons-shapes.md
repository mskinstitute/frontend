# Assigning Macros to Buttons and Clickable Shapes

Requiring colleagues to remember obscure keyboard shortcuts or navigate through the Developer tab is impractical. By attaching macros to **Form Control Buttons**, **Modern Graphic Shapes**, or **Icons**, you turn your spreadsheet into an intuitive, interactive point-and-click business application.

---

## 1. Method 1: Form Control Buttons (The Classic Windows Button)

1. Go to the **Developer** tab.
2. In the *Controls* group, click **Insert**.
3. Under **Form Controls**, click the **Button (Form Control)** icon (the small rectangular gray box).
4. Your mouse cursor turns into a crosshair `+`. Click and drag on the sheet where you want the button to appear.
5. As soon as you release the mouse, the **Assign Macro** dialog box opens automatically!
6. Select your macro (e.g., 'GenerateMonthlyReport') and click **OK**.
7. Right-click the button, select **Edit Text**, and type a clear label: *"Generate Report"*.
8. Click away. Now, whenever someone clicks that button, the macro executes!

```
Form Controls vs. Modern Shape Buttons:
+-----------------------------------+-----------------------------------+
| Form Control Button               | Graphical Shape Button            |
+-----------------------------------+-----------------------------------+
| Classic gray Windows 95 button    | Polished modern rounded rectangle |
| Limited styling & fonts           | Gradients, shadows, icons, colors |
| Fast and functional               | Visually stunning dashboard UI    |
+-----------------------------------+-----------------------------------+
```

![Assigning Macros to UI Buttons](/images/tutorials/ms-excel/macros-vba-editor.svg)

---

## 2. Method 2: Modern Dashboard Buttons (Using Rounded Rectangles & Icons)

For executive presentation dashboards, standard gray buttons look dated. You can turn any modern shape or icon into a button:

1. Go to **Insert > Illustrations > Shapes > Rounded Rectangle**.
2. Draw the button on your dashboard header.
3. Style the shape using **Shape Format**:
   * Shape Fill: Rich Navy Blue or Emerald Green.
   * Shape Effects: Soft Outer Shadow and Bevel.
   * Text: *"Refresh Dashboard"* (White, bold, centered).
4. Right-click the shape and select **Assign Macro...**.
5. Choose your macro and click **OK**.
*Your custom shape now responds to hover and click events with a pointing hand cursor!*

---

## 3. Positioning Buttons so They Don't Distort on Resize

When columns or rows are resized or filtered, shapes floating over them can stretch awkwardly or disappear:
1. Right-click your button or shape > select **Format Shape...**.
2. In the pane, navigate to **Size & Properties (the square icon) > Properties**:
3. Select **Don't move or size with cells** (or *Move but don't size with cells*).
4. This locks the button’s visual dimensions so resizing adjacent columns won't distort its layout!

---

# Multiple Choice Questions

### 1. Where do you find the Form Control Button in Microsoft Excel?
A. Home tab > Editing
B. Developer tab > Controls group > Insert > Form Controls
C. Data tab > What-If Analysis
D. View tab > Macros
**Answer:** B
**Explanation:** Form Control buttons are located on the Developer tab under the Controls group in the Insert gallery.

---

### 2. How can you attach a macro to a modern graphical shape or icon on a dashboard?
A. You must write an API script in C++
B. Right-click the shape and select 'Assign Macro...'
C. Double-click the formula bar
D. Shapes cannot run macros
**Answer:** B
**Explanation:** Right-clicking any shape, image, or icon and choosing 'Assign Macro...' links that object directly to a VBA macro subroutine.

---

### 3. Which shape property ensures that a button will not become stretched or squashed when users resize worksheet columns?
A. Move and size with cells
B. Don't move or size with cells
C. Lock aspect ratio only
D. Hidden
**Answer:** B
**Explanation:** Choosing 'Don't move or size with cells' locks the graphic object's physical dimensions, preventing distortions when underlying cells change size.

---

### 4. What visual change occurs to the mouse cursor when hovering over an object that has an assigned macro?
A. It turns into an hourglass
B. It turns into a pointing hand cursor
C. It disappears completely
D. It turns into a magnifying glass
**Answer:** B
**Explanation:** Excel displays a pointing hand cursor over clickable shapes and buttons with assigned macros.

---

### 5. How do you select or move a button that has a macro assigned to it without accidentally triggering the macro?
A. Press the Esc key 10 times
B. Right-click the button (or hold Ctrl and left-click)
C. Close the workbook
D. Double-click very fast
**Answer:** B
**Explanation:** Right-clicking (or holding Ctrl while left-clicking) selects the shape for editing, moving, or resizing without firing the assigned code.

---

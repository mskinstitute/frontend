# Creating Mobile-Optimized Dashboard Layouts

Over 60% of modern C-suite executives and field managers access business reports primarily through smartphones and tablets using the **Power BI Mobile App** (available on iOS and Android). Standard desktop 16:9 widescreen reports ($1280 \times 720$ px) look cramped and illegible when squeezed into a vertical phone screen.

Power BI Desktop solves this problem with **Mobile Layout Design**.

---

## 1. The Mobile Layout Canvas in Power BI Desktop

Mobile layout allows you to build a **custom portrait-oriented interface** ($9:16$ vertical grid) specifically for phone screens without affecting the original desktop layout:

```
+--------------------------+          +-------------------+
| Desktop Layout (16:9)    |          | Mobile View (9:16)|
| [Card 1] [Card 2] [Card3]|          | [   Card 1   ]    |
| [ Bar Chart ] [LineChart]|  =====>  | [   Card 2   ]    |
| [ Large Transaction Grid]|          | [ Bar Chart  ]    |
+--------------------------+          | [ Line Chart ]    |
                                      +-------------------+
```

### Key Principles of Mobile Design:
1. **Vertical Scrolling:** Mobile users naturally scroll vertically. Stack high-level summary cards at the top, followed by trends, with detailed tables at the bottom.
2. **Simplified Visuals:** Hide secondary labels and remove busy legends to prevent visual clutter on smaller screens.
3. **Touch Targets:** Ensure buttons and slicers are at least $40 \times 40$ pixels for effortless finger tapping.

---

## 2. Step-by-Step Mobile Layout Creation

1. In Power BI Desktop, navigate to the **View** ribbon tab.
2. Click **Mobile layout** (the canvas changes into a vertical smartphone simulator).
3. On the right, the **Page visuals** pane lists all visuals available from the desktop page.
4. Drag and drop only the most critical visuals onto the phone canvas.
5. Resize visuals:
   - Make KPI cards full-width ($4$ grid units wide).
   - Adjust chart heights for comfortable scrolling.
6. Format mobile visuals independently: You can change font sizes, toggle data labels, and adjust padding specifically for mobile without changing desktop settings!
7. Click the **Desktop layout** icon in the bottom-right corner to return to standard view.

---

# Multiple Choice Questions

### 1. Where do you access the smartphone layout simulator in Power BI Desktop?
A. Under File $\to$ Save As
B. Under the View ribbon tab by clicking "Mobile layout"
C. In Power Query M code
D. In the Windows Control Panel
**Answer:** B
**Explanation:** The "Mobile layout" button under the View ribbon toggles the canvas into a phone emulator where visuals can be arranged specifically for mobile screens.

### 2. If you modify a visual's font size or padding while inside Mobile Layout, what happens to the desktop version of that visual?
A. The desktop layout visual changes automatically
B. Modern Power BI supports independent visual formatting for mobile; mobile changes do not affect the desktop view
C. The visual is deleted
D. DirectQuery is disconnected
**Answer:** B
**Explanation:** Modern Power BI Desktop allows visual formatting properties (font size, margins, visibility) to be customized independently for mobile without altering desktop styling.

### 3. Do you need to include every visual from the desktop page in the mobile layout?
A. Yes, all visuals are mandatory
B. No; you can curate only the most impactful KPIs and trend charts, omitting complex or crowded tables
C. Only pie charts can be added
D. Visuals must be rewritten in Python
**Answer:** B
**Explanation:** Mobile layouts are designed for quick executive consumption. It is best practice to include only top KPIs and essential summary visuals.

### 4. What happens when a user opens a Power BI report on a phone if no mobile layout was designed?
A. The report will not open
B. Power BI renders the full desktop layout in miniature, requiring the user to pinch, zoom, and rotate their phone horizontally
C. Power BI generates an error email
D. All data is hidden
**Answer:** B
**Explanation:** If no mobile layout exists, the Power BI mobile app falls back to displaying the widescreen desktop layout, requiring awkward manual zooming.

### 5. What responsive visual feature allows visuals to automatically resize and hide non-essential elements on smaller mobile screens?
A. Responsive Visual property (enabled in the visual General formatting card)
B. RLS Security Filter
C. Query Folding
D. Bookmark Sync
**Answer:** A
**Explanation:** When the "Responsive" property is toggled on, Power BI visuals automatically adapt their layout, hiding padding and legends as dimensions shrink.

---

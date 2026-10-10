# Chart Annotations, Callouts & High-Resolution Exports

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Guiding the Audience with Annotations
Instead of forcing stakeholders to search through an axis, use **`ax.annotate()`** to attach arrows and text callouts directly to pivotal data events (e.g., product launches, regulatory changes, or marketing campaigns).

---

## 2. Using `ax.annotate()` with Bounding Boxes & Arrows
```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(9, 5))
days = [1, 2, 3, 4, 5, 6, 7]
revenue = [100, 120, 115, 280, 260, 240, 230]

ax.plot(days, revenue, color='#2563eb', marker='o', linewidth=2.5)

# Add callout annotation with arrow
ax.annotate(
    'Diwali Flash Sale\n(+143% Spike)',
    xy=(4, 280),               # Target point to point at
    xytext=(5, 300),           # Location of text box
    arrowprops=dict(facecolor='#ef4444', shrink=0.05, width=1.5, headwidth=8),
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#fee2e2', edgecolor='#ef4444', alpha=0.9),
    fontweight='bold',
    fontsize=10
)

ax.set_ylim(50, 350)
ax.set_title('Daily Revenue Trend with Key Business Event')
plt.show()
```

---

## 3. High-Resolution Publication Exports (`savefig`)
```python
# Save vector graphic (infinite zoom, no pixelation)
fig.savefig('Executive_Report.pdf', bbox_inches='tight')

# Save publication raster graphic (300 DPI for print)
fig.savefig('Marketing_Deck.png', dpi=300, bbox_inches='tight', transparent=False)
```

---

# Multiple Choice Questions

### 1. Which method in Matplotlib attaches a text label with an pointing arrow to a specific coordinate?
A. `ax.annotate()`
B. `ax.pointer()`
C. `ax.callout()`
D. `ax.arrow_text()`
**Answer:** A
**Explanation:** `ax.annotate(text, xy=..., xytext=..., arrowprops=...)` connects a text annotation box to a coordinate via an arrow.
---

### 2. What does `bbox_inches='tight'` do when calling `fig.savefig()`?
A. Automatically crops all extra whitespace margins around the figure so nothing is clipped
B. Compresses image resolution
C. Sets width to 10 inches
D. Converts PNG to JPG
**Answer:** A
**Explanation:** `bbox_inches='tight'` recalculates the figure bounding box to tightly enclose all titles, tick labels, and legends without cutoffs.
---

### 3. Which file extension should you select in `fig.savefig()` to produce a scalable vector graphic that never loses clarity when enlarged?
A. `.svg` or `.pdf`
B. `.jpg`
C. `.bmp`
D. `.gif`
**Answer:** A
**Explanation:** SVG and PDF are vector formats that store lines and paths mathematically rather than as fixed pixel grids, allowing infinite scaling.
---

### 4. In `ax.annotate()`, what does the `xy` argument represent?
A. The coordinates of the target data point being highlighted
B. The location of the text box
C. The size of the font
D. The width of the line
**Answer:** A
**Explanation:** `xy` is the point to annotate (where the arrow points), while `xytext` is where the text label is positioned.
---

### 5. What parameter in `fig.savefig()` produces an image with a transparent background suitable for embedding into PowerPoint slides?
A. `transparent=True`
B. `alpha=0`
C. `clear_bg=True`
D. `no_canvas=True`
**Answer:** A
**Explanation:** `transparent=True` exports figures without an opaque background canvas.
---

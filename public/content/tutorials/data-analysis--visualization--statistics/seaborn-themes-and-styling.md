# Seaborn Themes, Palettes & Aesthetics

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. The Aesthetics of Seaborn
**Seaborn** elevates data visualization by providing refined color palettes, typography defaults, and statistical plotting conventions out of the box.

---

## 2. Setting Aesthetic Styles
Seaborn includes 5 built-in themes:
- **`whitegrid`** (Default for business dashboards; clean with faint gridlines)
- **`darkgrid`** (Default for interactive screens)
- **`white`** (Minimalist paper look)
- **`ticks`** (Classic scientific print look with axis tick dashes)
- **`dark`** (Clean dark canvas)

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Apply theme and set context for presentations
sns.set_theme(style='whitegrid', font_scale=1.1)

# Context scaling: 'paper', 'notebook' (default), 'talk', 'poster'
sns.set_context('talk')
```

---

## 3. Selecting Color Palettes
Choosing the right color palette is critical for conveying data meaning:
1. **Qualitative (Categorical):** Distinct colors for unordered groups (`'tab10'`, `'Set2'`, `'deep'`).
2. **Sequential:** Light-to-dark gradient for ordered quantitative values (`'Blues'`, `'viridis'`, `'crest'`).
3. **Diverging:** Two contrasting hues meeting at a neutral midpoint for values with a critical center (like profit vs loss or temperature anomalies: `'coolwarm'`, `'RdYlGn'`, `'vlag'`).

```python
# Set custom palette
sns.set_palette('crest')
```

---

# Multiple Choice Questions

### 1. Which Seaborn context preset is designed to maximize font sizes and line weights for viewing on large projector screens or conference talks?
A. `'talk'` (or `'poster'`)
B. `'micro'`
C. `'notebook'`
D. `'tiny'`
**Answer:** A
**Explanation:** `sns.set_context('talk')` or `'poster'` scales up labels, ticks, and lines for readability from a distance.
---

### 2. When visualizing Net Profit/Loss data (where 0 is a critical neutral midpoint, positive is green, negative is red), which palette type must be chosen?
A. Qualitative palette
B. Diverging palette
C. Monochromatic palette
D. Random palette
**Answer:** B
**Explanation:** Diverging palettes emphasize deviation in two directions from a meaningful central threshold (zero).
---

### 3. Which style theme in Seaborn provides a white canvas with subtle grey gridlines, ideal for corporate reporting?
A. `'whitegrid'`
B. `'darkgrid'`
C. `'blackout'`
D. `'retro'`
**Answer:** A
**Explanation:** `whitegrid` provides clean white backgrounds with unobtrusive gridlines.
---

### 4. Which built-in command displays all colors in an active palette inside a Jupyter Notebook cell?
A. `sns.palplot()` (or `sns.color_palette()`)
B. `plt.show_palette()`
C. `sns.list_colors()`
D. `pd.show_colors()`
**Answer:** A
**Explanation:** `sns.palplot(sns.color_palette('viridis', 10))` renders the palette swatches visually.
---

### 5. What parameter in Seaborn statistical plots maps a categorical variable to distinct colors?
A. `hue`
B. `color_map`
C. `tint`
D. `shade_by`
**Answer:** A
**Explanation:** The `hue` parameter groups data by a categorical variable and colors each group with a distinct palette hue.
---

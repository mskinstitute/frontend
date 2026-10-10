# Python Visualization Landscape: Matplotlib vs Seaborn vs Plotly

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. The Modern Python Visualization Ecosystem
Python offers three primary libraries for visual analytics:
1. **Matplotlib:** The grandfather foundation. Low-level, granular, pixel-perfect control over every canvas element.
2. **Seaborn:** Built on top of Matplotlib. High-level statistical plotting with built-in themes and direct Pandas DataFrame integration.
3. **Plotly:** Web-first, D3.js-based interactive library supporting zooms, hover tooltips, and dynamic web dashboards.

---

## 2. When to Use Which Tool?

| Library | Strengths | Ideal Use Case |
| :--- | :--- | :--- |
| **Matplotlib** | Complete granular control, publication figures | Custom chart architectures, subplots, print PDFs |
| **Seaborn** | Beautiful defaults, statistical distributions | Exploratory Data Analysis (EDA), heatmaps, regressions |
| **Plotly** | Browser interactivity, tooltips, zooms | Client presentations, Streamlit/Dash web apps |

---

# Multiple Choice Questions

### 1. Which library forms the low-level foundation upon which Seaborn is built?
A. Plotly
B. Matplotlib
C. Bokeh
D. ggplot
**Answer:** B
**Explanation:** Seaborn is built directly on top of Matplotlib, extending its plotting capabilities with statistical aesthetics and tight Pandas integration.
---

### 2. Which Python visualization library produces interactive, browser-based charts with hover tooltips and dynamic zooming by default?
A. Matplotlib
B. Plotly
C. PIL
D. Pygame
**Answer:** B
**Explanation:** Plotly compiles charts into interactive D3.js and WebGL objects natively inside the web browser.
---

### 3. If you need to produce high-resolution, pixel-perfect vector figures (300+ DPI) for academic research papers, which library is the standard?
A. Matplotlib
B. Excel Online
C. Seaborn only
D. Tkinter
**Answer:** A
**Explanation:** Matplotlib's object-oriented architecture allows exact control over every tick, spine, label, and export format (PDF, EPS, SVG, PNG).
---

### 4. What is the primary advantage of Seaborn over raw Matplotlib when working with Pandas DataFrames?
A. Seaborn accepts DataFrame column names directly as strings (e.g. `x='Age', y='Salary', hue='Gender'`)
B. Seaborn does not require Python
C. Seaborn runs on the GPU
D. Seaborn replaces SQL
**Answer:** A
**Explanation:** Seaborn natively understands tidy DataFrames, mapping column names to aesthetics with parameters like `data=df`, `x`, `y`, and `hue`.
---

### 5. Can Matplotlib and Seaborn functions be combined within the same figure?
A. No, they crash if imported together
B. Yes, because Seaborn plots return Matplotlib Axes objects that can be styled using Matplotlib commands
C. Only in Linux
D. Only for 3D plots
**Answer:** B
**Explanation:** Seaborn functions operate directly on Matplotlib Axes, allowing developers to customize Seaborn plots using standard `ax.set_title()` or `plt.tight_layout()`.
---

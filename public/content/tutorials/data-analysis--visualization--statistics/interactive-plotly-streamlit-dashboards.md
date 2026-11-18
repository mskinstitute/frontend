---
id: interactive-plotly-streamlit-dashboards
slug: interactive-plotly-streamlit-dashboards
course: data-analysis--visualization--statistics
chapter: "6: Storytelling & Executive Dashboard Project"
topic: "6.4 Interactive Charts with Plotly & Sharing Apps with Streamlit"
title: "Interactive Python Dashboards with Plotly & Streamlit"
description: "Build zoomable, hover-rich interactive charts with Plotly Express and deploy shareable Python analytics web apps in minutes using Streamlit."
difficulty: Intermediate
readingTime: 14
order: 4
keywords:
  - plotly express python tutorial
  - streamlit dashboard python
  - interactive data visualization python
  - python analytics web app
  - matplotlib vs plotly vs streamlit
  - data analyst portfolio dashboard
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.0.0
---

**Plotly Express creates browser-native, interactive HTML charts with hover tooltips, zooming, and legend filtering in a few lines of Python, while Streamlit turns a plain Python script into a shareable web dashboard with sidebar filters and KPI cards—no HTML, CSS, or JavaScript required.**

Matplotlib and Seaborn are unmatched for static reports, PDFs, and statistical plots. However, business stakeholders often want to hover over exact revenue figures, filter by city or date range, and explore trends themselves. Combining **Plotly + Streamlit** lets Python data analysts ship live interactive portfolio dashboards in under an hour.

---

## 1. Static vs. Interactive Python Visualization

| Tool | Output Type | Best Use Case | Interactivity |
| :--- | :--- | :--- | :--- |
| **Matplotlib / Seaborn** | Static PNG / SVG / PDF | Academic papers, EDA notebooks, automated PDF reports | None (static image) |
| **Plotly Express (`px`)** | Interactive HTML / JSON | Executive hover tooltips, zooming, drill-down exploration | Hover, zoom, pan, legend toggle |
| **Streamlit (`st`)** | Live Python Web App | Self-service stakeholder dashboards & ML demos | Sliders, dropdowns, date filters, file uploads |

---

## 2. Creating Interactive Charts with Plotly Express

```python
import pandas as pd
import plotly.express as px

sales = pd.DataFrame({
    "month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] * 2,
    "region": ["North"] * 6 + ["West"] * 6,
    "revenue_inr": [420000, 465000, 510000, 495000, 560000, 615000,
                    380000, 410000, 455000, 470000, 520000, 590000],
    "orders": [310, 340, 375, 360, 410, 455, 280, 305, 330, 345, 390, 430],
})

fig = px.line(
    sales,
    x="month",
    y="revenue_inr",
    color="region",
    markers=True,
    hover_data=["orders"],
    title="Monthly Regional Revenue Trend (INR)",
    labels={"revenue_inr": "Revenue (₹)", "month": "Month"},
)

# Export standalone interactive HTML file (opens in any browser!)
fig.write_html("regional_revenue.html")
```

Notice how `fig.write_html("regional_revenue.html")` produces a single self-contained file you can email to a manager or embed in a portfolio without requiring Python on the viewer's machine.

---

## 3. Building a Live Filterable Dashboard in Streamlit

Save the script below as `dashboard.py` and run `streamlit run dashboard.py`:

```python
import pandas as pd
import plotly.express as px
import streamlit as st

st.set_page_config(page_title="Retail KPI Dashboard", layout="wide")
st.title("Retail Sales & KPI Analytics Dashboard")

@st.cache_data
def load_sales_data() -> pd.DataFrame:
    return pd.DataFrame({
        "region": ["North", "North", "West", "West", "South", "South"],
        "category": ["Electronics", "Apparel", "Electronics", "Apparel", "Electronics", "Apparel"],
        "revenue": [850000, 420000, 790000, 510000, 680000, 390000],
        "profit": [145000, 92000, 132000, 118000, 115000, 84000],
    })

df = load_sales_data()

# Sidebar interactive filter
selected_regions = st.sidebar.multiselect(
    "Filter by Region",
    options=df["region"].unique().tolist(),
    default=df["region"].unique().tolist(),
)
filtered = df[df["region"].isin(selected_regions)]

# Top KPI Cards
col1, col2, col3 = st.columns(3)
total_rev = int(filtered["revenue"].sum())
total_profit = int(filtered["profit"].sum())
margin = (total_profit / total_rev * 100) if total_rev else 0.0

col1.metric("Total Revenue", f"₹{total_rev:,}")
col2.metric("Total Profit", f"₹{total_profit:,}")
col3.metric("Profit Margin", f"{margin:.1f}%")

# Interactive Plotly chart inside Streamlit
fig = px.bar(
    filtered,
    x="region",
    y="revenue",
    color="category",
    barmode="group",
    title="Revenue by Region & Category",
)
st.plotly_chart(fig, use_container_width=True)
```

### Why `@st.cache_data` Is Critical
Streamlit re-runs your Python script from top to bottom every time a user clicks a dropdown or moves a slider. Decorating your CSV/SQL loader with `@st.cache_data` caches the DataFrame in memory so filters respond in milliseconds instead of re-reading the file on every click.

---

## 4. Hands-On Portfolio Exercise

1. Extend `dashboard.py` to accept a CSV upload via `st.file_uploader("Upload Sales CSV", type="csv")`.
2. Add a `st.download_button` that lets managers export the filtered DataFrame as a clean CSV.
3. Deploy the repository for free on **Streamlit Community Cloud** and add the live URL to your GitHub README and resume.

---

## Practice Quiz

### 1. What method exports a Plotly figure into a standalone interactive file that stakeholders can open in any web browser?
A. `fig.save_png()`
B. `fig.write_html("chart.html")`
C. `fig.to_csv("chart.csv")`
D. `fig.export_sql()`
**Answer:** B
**Explanation:** `fig.write_html()` bundles the chart data and interactive JavaScript renderer into an HTML file with full hover, zoom, and legend filtering.

---

### 2. Why should you decorate data-loading functions with `@st.cache_data` in Streamlit?
A. To encrypt the CSV password
B. Because Streamlit re-executes the script on every widget interaction, caching avoids reloading large files or re-running SQL queries repeatedly
C. To convert Matplotlib plots into SQL tables
D. To disable sidebar filters
**Answer:** B
**Explanation:** `@st.cache_data` memoizes serializable data objects like DataFrames across user interactions, keeping dashboards fast and responsive.

---

### 3. Which command launches a Streamlit Python script locally in your browser?
A. `python run dashboard.py`
B. `streamlit run dashboard.py`
C. `plotly serve dashboard.py`
D. `pip start dashboard.py`
**Answer:** B
**Explanation:** `streamlit run <filename.py>` starts the local Streamlit server and opens the interactive dashboard in your browser.

---

### 4. Which Streamlit layout function places three KPI `st.metric()` cards side by side in a single horizontal row?
A. `st.rows(3)`
B. `st.columns(3)`
C. `st.grid(3)`
D. `st.metric_row(3)`
**Answer:** B
**Explanation:** `col1, col2, col3 = st.columns(3)` creates three side-by-side layout containers for KPI cards or charts.

---

### 5. When is Matplotlib/Seaborn still preferred over Plotly?
A. When building static high-DPI print/PDF charts or statistical pairplots inside automated batch scripts
B. When you need live sidebar dropdowns
C. When deploying an interactive web app
D. Matplotlib is never used anymore
**Answer:** A
**Explanation:** Matplotlib and Seaborn excel at publication-quality static figures, statistical EDA plots, and headless PDF report generation, while Plotly + Streamlit shine for interactive web exploration.

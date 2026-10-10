# Maps and Geospatial Visuals in Power BI

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Geospatial Visualization in Power BI
Power BI offers built-in geospatial capabilities powered by **Bing Maps** and **Azure Maps**:
1. **Map (Bubble Map):** Plots circular bubbles over geographic locations; bubble size represents volume.
2. **Filled Map (Choropleth):** Colors entire geographic regions (States, Countries, Provinces) based on quantitative metrics.
3. **Shape Map:** Compares regions using custom TopoJSON boundaries.

---

## 2. Best Practice: Setting Data Categories
To prevent Bing Maps from confusing "Washington" (the state) with "Washington D.C." (the city) or "Delhi" with other global towns:
- Select the column in the Data Pane.
- On the **Column tools** ribbon, set **Data category** to `State or Province`, `City`, `Postal Code`, or `Country/Region`.

---

# Multiple Choice Questions

### 1. Which search engine powers native geospatial geocoding and map plotting in Power BI?
A. Bing Maps / Azure Maps
B. Yahoo Maps
C. Baidu
D. DuckDuckGo
**Answer:** A
**Explanation:** Microsoft integrates Bing Maps and Azure Maps for geocoding coordinates, addresses, and boundaries.
---

### 2. What action should an analyst take if Power BI incorrectly maps Indian cities to foreign locations?
A. Set the column's 'Data Category' to 'City' and concatenate the Country (e.g. `[City] & ", India"`)
B. Delete the map
C. Use a pie chart
D. Rename the cities
**Answer:** A
**Explanation:** Specifying the Data Category and adding the country context removes geocoding ambiguity.
---

### 3. What is a 'Filled Map' (Choropleth) visual?
A. A map where geographical polygon boundaries (e.g. states, countries) are shaded with color gradients based on a metric
B. A map filled with text
C. A 3D globe only
D. A road map
**Answer:** A
**Explanation:** Filled maps color regional polygon boundaries proportionally to quantitative measures.
---

### 4. What map format is used to upload custom boundary maps (e.g. sales territories or specific district zones) into Power BI Shape Maps?
A. TopoJSON
B. MP4
C. CSV
D. DOCX
**Answer:** A
**Explanation:** Shape Maps utilize TopoJSON geometric boundary definitions for custom geographic regions.
---

### 5. What parameter controls bubble size on a standard Bubble Map visual?
A. Bubble size field well
B. Radius slider
C. Scale factor
D. Zoom setting
**Answer:** A
**Explanation:** Dragging a measure (like Sales Revenue) into the 'Bubble size' field well scales circle areas proportionally.
---

# Power BI Workflow Overview

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. The Standard 5-Stage BI Workflow
Every production Power BI project follows a rigorous 5-step lifecycle:
1. **Get Data (Ingestion):** Connect to spreadsheets, SQL warehouses, web APIs, or ERP databases.
2. **Transform Data (Power Query):** Clean dirty columns, remove nulls, unpivot wide tables, and enforce correct datatypes.
3. **Model Data (Relational Design):** Establish 1-to-many relationships, configure Star Schema, and hide foreign keys.
4. **Author Calculations (DAX):** Write business metrics (Total Revenue, YoY Growth %, YTD Sales) using DAX.
5. **Design & Publish (Visuals & Cloud):** Assemble interactive cards, slicers, and charts, then publish to Power BI Service.

---

# Multiple Choice Questions

### 1. What is the correct chronological sequence of steps in a standard Power BI project?
A. Get Data $	o$ Transform in Power Query $	o$ Model & DAX $	o$ Build Visuals $	o$ Publish
B. Publish $	o$ Model $	o$ Build Visuals $	o$ Get Data
C. Build Visuals $	o$ Get Data $	o$ Model $	o$ Transform
D. DAX $	o$ Publish $	o$ Get Data $	o$ Transform
**Answer:** A
**Explanation:** The standard pipeline ingests data first, cleans it in Power Query, establishes models and DAX, creates visuals, and finally publishes to the cloud.
---

### 2. Why should data cleaning occur in Power Query rather than creating calculated columns in DAX?
A. Power Query transformations are executed once during data refresh and compressed into VertiPaq, conserving RAM and query time
B. DAX cannot do math
C. Power Query is written in Python
D. It is illegal to clean in DAX
**Answer:** A
**Explanation:** Transforming in Power Query compresses data into the columnar model upon refresh, whereas calculated columns consume RAM continuously.
---

### 3. Which view in Power BI Desktop allows you to drag lines between tables to establish primary-to-foreign key relationships?
A. Model View
B. Report View
C. Table View
D. Code View
**Answer:** A
**Explanation:** The Model View displays the relational entity-relationship diagram where relationships are configured.
---

### 4. What is the primary role of the Report View in Power BI Desktop?
A. Designing the visual dashboard canvas with charts, cards, and slicers
B. Writing raw SQL code
C. Managing Windows user passwords
D. Compiling C++ code
**Answer:** A
**Explanation:** Report View is the interactive canvas where visual elements, cards, and filters are laid out.
---

### 5. In which view can you inspect raw underlying tabular data and verify column formatting?
A. Table View (formerly Data View)
B. Model View
C. Canvas View
D. Terminal View
**Answer:** A
**Explanation:** Table View displays the loaded rows and columns of individual tables in the data model.
---

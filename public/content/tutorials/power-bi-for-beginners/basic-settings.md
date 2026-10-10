# Basic Settings & Options

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Critical Power BI Settings for Professional Development
Default Power BI settings are configured for casual users, but professional data analysts immediately adjust two critical global options:

### 1. Disable Auto Date/Time (Save Massive Memory!)
By default, Power BI creates hidden internal date hierarchy tables for *every single date column* in your dataset. In large datasets with 10 date columns, this bloats file sizes by hundreds of megabytes!
- **Fix:** Go to `File` $	o$ `Options and Settings` $	o$ `Current File` $	o$ `Data Load` $	o$ **Uncheck "Auto Date/Time"**.

### 2. Disable Automatic Relationship Detection
Power BI attempts to guess relationships automatically based on matching column names, frequently creating incorrect relationships.
- **Fix:** Uncheck "Autodetect new relationships after data is loaded".

---

# Multiple Choice Questions

### 1. Why do professional BI developers disable the 'Auto Date/Time' setting in Power BI?
A. It creates hidden date hierarchy tables for every date column, significantly bloating file size and RAM consumption
B. Because it prevents computers from showing time
C. Because DAX stops working
D. It deletes the calendar
**Answer:** A
**Explanation:** Auto Date/Time instantiates hidden background tables for every date field, bloating file size and degrading performance.
---

### 2. Under which menu are global and file-specific options located in Power BI Desktop?
A. `File > Options and settings > Options`
B. `Help > Settings`
C. `View > Customize`
D. `Edit > Preferences`
**Answer:** A
**Explanation:** Global and file settings are managed under `File > Options and settings > Options`.
---

### 3. What is the benefit of disabling 'Autodetect new relationships'?
A. It prevents Power BI from making erroneous join assumptions, ensuring the developer explicitly designs the relational data model
B. It increases internet speed
C. It deletes unused tables
D. It hides the model view
**Answer:** A
**Explanation:** Auto-detection can build incorrect relationships between tables sharing generic column names like 'ID' or 'Status'.
---

### 4. What setting enables preview features that Microsoft has not yet made standard general availability?
A. Preview features tab under Options
B. Beta download button
C. Windows registry
D. Task manager
**Answer:** A
**Explanation:** The 'Preview features' pane lets developers test upcoming capabilities (such as new visual formatting or DAX functions).
---

### 5. What setting controls the default language and locale used for parsing dates and currency symbols?
A. Regional Settings
B. System Font
C. Color Palette
D. Theme Manager
**Answer:** A
**Explanation:** Regional Settings dictate whether dates are parsed as DD/MM/YYYY (Indian/UK) or MM/DD/YYYY (US).
---

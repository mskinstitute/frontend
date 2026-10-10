# Pandas Installation & Environment Setup

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Setting Up the Modern Data Analysis Environment
To write production-grade data analysis scripts, data analysts use either **Jupyter Notebooks** (for interactive exploratory data analysis, plotting, and experimentation) or **VS Code / PyCharm** (for end-to-end data pipeline scripts and web APIs).

In this lesson, we will set up our local Python data environment using modern package managers (`pip` or `conda`).

---

## 2. Installing Pandas & Essential Dependencies

### Option A: Standard Pip Installation
In your terminal, command prompt, or virtual environment:

```bash
# Upgrade pip to latest version
python -m pip install --upgrade pip

# Install Pandas along with core scientific companion libraries
pip install pandas numpy openpyxl matplotlib seaborn
```

### Option B: Anaconda or Miniconda
If you are using the Anaconda distribution, Pandas is pre-installed. To update it:
```bash
conda install pandas
```

---

## 3. Verifying Installation & Checking Versions
Always verify that your Python environment is importing the correct binary build of Pandas:

```python
import pandas as pd
import numpy as np

print(f"Pandas Version: {pd.__version__}")
print(f"NumPy Version:  {np.__version__}")

# Check system build dependencies
pd.show_versions()
```

**Sample Output:**
```text
Pandas Version: 2.2.2
NumPy Version:  1.26.4
```

The `pd.show_versions()` function prints detailed diagnostic information, including versions of optional acceleration libraries like `pyarrow`, `bottleneck`, and `numba`.

---

## 4. Setting Display Options for Clean Terminal Output
By default, Pandas truncates large DataFrames to avoid flooding your screen. You can customize these formatting parameters:

```python
# Show up to 20 columns instead of hiding them
pd.set_option('display.max_columns', 20)

# Show up to 100 rows
pd.set_option('display.max_rows', 100)

# Format floats to 2 decimal places with comma separation
pd.set_option('display.float_format', lambda x: f'₹{x:,.2f}')
```

---

# Multiple Choice Questions

### 1. Which command correctly installs Pandas along with Excel reading support using pip?
A. `pip install pandas openpyxl`
B. `pip install pandas-excel`
C. `npm install pandas`
D. `pip get pandas`
**Answer:** A
**Explanation:** `openpyxl` is the modern engine required by Pandas to read and write modern `.xlsx` files via `pd.read_excel()`.
---

### 2. What is the standard, globally recognized Python import alias for the Pandas library?
A. `import pandas as p`
B. `import pandas as pd`
C. `import pandas as pds`
D. `from pandas import *`
**Answer:** B
**Explanation:** The global convention established by the open-source data science community is `import pandas as pd`.
---

### 3. Which built-in Pandas function outputs the installed versions of Pandas and all its system dependencies?
A. `pd.version_info()`
B. `pd.check_env()`
C. `pd.show_versions()`
D. `pd.system_report()`
**Answer:** C
**Explanation:** `pd.show_versions()` displays the version of Pandas as well as all related dependencies like NumPy, openpyxl, pyarrow, and OS platform details.
---

### 4. How can you configure Pandas to display all columns of a wide DataFrame without truncating them?
A. `pd.show_all_columns = True`
B. `pd.set_option('display.max_columns', None)`
C. `pd.display_everything()`
D. `df.untruncate()`
**Answer:** B
**Explanation:** Setting `'display.max_columns'` to `None` instructs Pandas to render every column in the console without collapsing them into ellipses (`...`).
---

### 5. Why is a Jupyter Notebook widely used for Pandas development instead of a plain text file?
A. Jupyter executes code in separate cells, allowing DataFrames and interactive visualizations to remain cached in memory
B. Jupyter runs faster than standard CPython
C. Plain Python files cannot import Pandas
D. Jupyter automatically removes missing values from files
**Answer:** A
**Explanation:** Jupyter Notebooks maintain an active Python kernel in memory, enabling analysts to inspect DataFrames, test transformations, and plot charts cell-by-cell without reloading datasets from disk repeatedly.
---

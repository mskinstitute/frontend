# Method Chaining (pipe, assign) for Clean Production Pipelines

In production data engineering and predictive modeling workflows, clean and testable transformations are essential. Rather than creating endless temporary intermediate variables (`df1`, `df2`, `df_clean`, `df_final`) that clutter memory and cause silent state mutation bugs, modern Python practitioners write **declarative method chains** using `.assign()`, `.pipe()`, and `.query()`.

---

## 1. The Anti-Pattern: Intermediate Variables

```python
# Anti-pattern: Verbose, error-prone, keeps intermediate objects in RAM
df_clean = df.dropna(subset=['customer_id'])
df_clean['revenue'] = df_clean['quantity'] * df_clean['unit_price']
df_filtered = df_clean[df_clean['revenue'] > 50]
df_final = df_filtered.sort_values(by='revenue', ascending=False)
```

### Disadvantages:
1. Generates the notorious `SettingWithCopyWarning`.
2. Hard to refactor into automated unit tests.
3. Every intermediate object holds onto system memory until garbage collected.

---

## 2. The Solution: Method Chaining with `.assign()`

Method chaining chains operations inside parentheses without modifying the original DataFrame in-place:

```python
clean_df = (
    df
    .dropna(subset=['customer_id'])
    .assign(
        revenue=lambda x: x['quantity'] * x['unit_price'],
        tax_amount=lambda x: x['revenue'] * 0.18,
        total_billed=lambda x: x['revenue'] + x['tax_amount']
    )
    .query('total_billed > 500')
    .sort_values(by='total_billed', ascending=False)
)
```

> **Key Rule with `.assign()`: Always use `lambda x:`**  
> Because earlier steps inside the same chain mutate columns that don't exist in the original `df`, using `lambda x:` binds `x` dynamically to the DataFrame state at that exact point in the pipeline!

---

## 3. Modularizing Complex Steps with `.pipe()`

When an operation requires complex logic that cannot be expressed in a single line, define a standalone function and pass it into `.pipe()`:

```python
def remove_outliers_iqr(df, column_name):
    q25 = df[column_name].quantile(0.25)
    q75 = df[column_name].quantile(0.75)
    iqr = q75 - q25
    lower_bound = q25 - 1.5 * iqr
    upper_bound = q75 + 1.5 * iqr
    return df[(df[column_name] >= lower_bound) & (df[column_name] <= upper_bound)]

def standardize_text(df, col):
    return df.assign(**{col: df[col].astype(str).str.strip().str.title()})

# Production Pipeline using .pipe()
model_ready_df = (
    raw_df
    .pipe(standardize_text, col='city')
    .pipe(remove_outliers_iqr, column_name='annual_income')
    .assign(is_high_value=lambda x: x['annual_income'] > 100000)
)
```

---

## 4. Debugging Long Method Chains

To inspect intermediate DataFrame states within a 10-step chain without breaking the chain, insert a custom logging pipe function:

```python
def debug_log(df, step_name):
    print(f"[{step_name}] Shape: {df.shape}, Memory: {df.memory_usage().sum() / 1024:.1f} KB")
    return df

# Insert anywhere in chain
df_result = (
    raw_df
    .pipe(debug_log, step_name="Raw Data")
    .dropna()
    .pipe(debug_log, step_name="Post Dropna")
    .assign(total=lambda x: x['a'] + x['b'])
)
```

---

# Multiple Choice Questions

### 1. Why is passing a `lambda` function recommended inside `.assign()` when creating multiple derived columns in a method chain?
A. Lambdas execute in parallel across all CPU cores.
B. Lambdas access the current state of the transformed DataFrame at that step rather than the original un-evaluated DataFrame.
C. Lambdas prevent integer overflow errors.
D. Lambdas automatically convert columns to category data type.
**Answer:** B
**Explanation:** In chained `.assign()`, referring directly to `df['col']` references the original DataFrame prior to chain execution. A lambda `lambda x: x['col']` references the live DataFrame intermediate product.
---

### 2. What does `df.pipe(func, *args, **kwargs)` do in Pandas?
A. Writes the DataFrame directly to an OS named pipe on Unix/Linux systems.
B. Passes the caller DataFrame as the first argument into `func` and returns the result of the function call.
C. Converts the DataFrame into a SQL staging table.
D. Creates an async Python generator from rows.
**Answer:** B
**Explanation:** `.pipe()` applies a function expecting a DataFrame as its first parameter, allowing seamless functional transformation chains.
---

### 3. Which of the following statements about method chaining in Pandas is FALSE?
A. Wrapping chains in parentheses `()` allows clean multi-line formatting without backslashes.
B. Method chaining guarantees faster execution speed than using C-extensions.
C. Method chaining improves pipeline readability and testability.
D. Standalone unit tests can easily be written for functions designed to be used in `.pipe()`.
**Answer:** B
**Explanation:** Method chaining improves code structure and readability, but underlying computational algorithms remain identical to standard Pandas vectorized operations.
---

### 4. What is the role of `.query()` in a method chain?
A. Executes a direct SQL query against a PostgreSQL database.
B. Filters rows based on an expressive boolean string expression without repeating the DataFrame name.
C. Creates an index on the selected column.
D. Computes aggregate summaries like mean and standard deviation.
**Answer:** B
**Explanation:** `df.query('age > 25 and status == "Active"')` filters rows concisely without needing `df[(df['age'] > 25) & (df['status'] == 'Active')]`.
---

### 5. How can you inspect the shape or columns of a DataFrame in the middle of a 10-step method chain without breaking the chain?
A. By placing `print(df)` between lines.
B. By calling a custom logger function that prints diagnostic info and returns the identical DataFrame using `.pipe()`.
C. By triggering a `KeyboardInterrupt`.
D. By calling `df.to_csv('debug.csv')` inside `.assign()`.
**Answer:** B
**Explanation:** A debug helper `def debug_df(df): print(df.shape); return df` can be piped at any intermediate step to log output while preserving pipeline flow.
---
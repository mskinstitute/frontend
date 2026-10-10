# Nested IFs, IFS and SWITCH Functions

Complex enterprise decision models rarely involve simple two-way yes/no branches. They demand tiered evaluation across multiple tax brackets, volume discount thresholds, and regional compliance rules. In modern Excel, you can choose between traditional **Nested IFs**, the multi-condition **IFS** function, and the exact-match **SWITCH** engine.

---

## 1. Traditional Nested IFs: Anatomy & Pitfalls

Prior to modern Excel updates, testing multiple conditions required nesting subsequent IF statements inside the 'value_if_false' parameter:

```excel
=IF(B2 >= 90, "Platinum",
  IF(B2 >= 75, "Gold",
    IF(B2 >= 60, "Silver",
      IF(B2 >= 40, "Bronze", "Standard"))))
```

### The Hazards of Deep Nesting:
* **The "Pyramid of Doom":** Each level adds closing parentheses ')', making debugging brackets exhausting.
* **Evaluation Order Sensitivity:** Conditions must be strictly sequenced. If you tested '>= 40' first, all scores (including 95) would stop at "Bronze" because 95 is greater than 40!

![Advanced Logical Functions](/images/tutorials/ms-excel/essential-functions-summary.svg)

---

## 2. Modern Multi-Criteria Testing with IFS()

Introduced to eliminate deep nesting parentheses, the **IFS** function evaluates pairs of conditions and corresponding return values:

```excel
Syntax:
=IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)
```

### Clean Sales Tiering Example:
```excel
=IFS(
  D2 >= 100000, "15% Bonus",
  D2 >= 50000,  "10% Bonus",
  D2 >= 20000,  "5% Bonus",
  TRUE,         "No Bonus"
)
```

> **The Universal Fallback Rule (TRUE):**
> Notice the final pair: 'TRUE, "No Bonus"'. If none of the preceding conditions evaluate to TRUE, and no fallback is specified, IFS returns an unsightly **#N/A** error! Writing 'TRUE' as the final test creates a guaranteed default catch-all.

---

## 3. The SWITCH Function: Exact Match Master

When evaluating a single expression against a known list of discrete values (e.g., converting department codes or month numbers), **SWITCH** is far cleaner and faster than IFS:

```excel
Syntax:
=SWITCH(expression, val1, result1, [val2, result2], ..., [default])
```

### Converting Warehouse Codes to Locations:
```excel
=SWITCH(A2,
  "WH-01", "Chicago Central",
  "WH-02", "Dallas Hub",
  "WH-03", "Seattle Terminal",
  "Unknown Depot"
)
```
*Notice:* The expression 'A2' is typed **only once**! The last argument '"Unknown Depot"' acts as the automatic default fallback if no match is found.

---

# Multiple Choice Questions

### 1. What happens in the IFS function if none of the tested conditions evaluate to TRUE and no fallback condition is provided?
A. Excel returns 0
B. Excel returns a #N/A error
C. The cell is left blank
D. Excel defaults to the first value
**Answer:** B
**Explanation:** If none of the conditions in an IFS function are TRUE, Excel returns the #N/A error unless a final fallback pair like 'TRUE, "Default"' is included.

---

### 2. How do you create an automatic catch-all default fallback in the IFS function?
A. Add an ELSE statement
B. Use TRUE as the final logical_test argument
C. Put quotation marks around the final comma
D. Use the DEFAULT() function
**Answer:** B
**Explanation:** Because 'TRUE' is always evaluated as true, placing 'TRUE, defaultValue' as the final argument pair guarantees a fallback result.

---

### 3. What is the key advantage of the SWITCH function over IFS when testing a single cell against multiple possible values?
A. SWITCH works only on weekends
B. You only reference the test cell once at the start of the formula, rather than repeating 'A2 = ...' in every argument
C. SWITCH can only evaluate numbers
D. SWITCH connects to the internet
**Answer:** B
**Explanation:** SWITCH takes the target expression once and matches it against subsequent value/result pairs, eliminating redundant condition statements.

---

### 4. What will '=SWITCH(3, 1, "Low", 2, "Med", 3, "High", "Other")' return?
A. Low
B. Med
C. High
D. Other
**Answer:** C
**Explanation:** The target value is 3, which matches the third pair (3, "High"), returning "High".

---

### 5. Why must tiered conditions in Nested IFs or IFS (such as grading scales >=90, >=80, >=70) be arranged in strict descending or ascending order?
A. Excel requires alphabetical sorting
B. Excel evaluates conditions sequentially and returns the result of the FIRST condition that evaluates to TRUE, terminating further evaluation
C. It reduces formula calculation size
D. To avoid #DIV/0! errors
**Answer:** B
**Explanation:** Logical formulas evaluate from left to right; as soon as a condition is satisfied, Excel immediately returns that value and stops testing remaining arguments.

---

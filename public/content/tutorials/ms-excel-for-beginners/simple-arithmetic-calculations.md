# Simple Arithmetic Calculations (+, -, *, /)

Before diving into complex multi-variable functions, mastering basic arithmetic operations and understanding mathematical operator precedence (order of operations) is essential for building accurate financial forecasts, invoices, and budgets.

---

## The Four Basic Arithmetic Operators

Excel uses standard keyboard arithmetic operators:

| Operator | Math Operation | Example Formula | Result |
| :--- | :--- | :--- | :--- |
| **+** | Addition | `=A2 + B2` | Sum of two cells |
| **-** | Subtraction | `=A2 - B2` | Difference between two cells |
| ***** | Multiplication | `=A2 * B2` | Product of two cells |
| **/** | Division | `=A2 / B2` | Quotient of two cells |
| **^** | Exponentiation (Power) | `=A2 ^ 2` | Squares the value in A2 |
| **%** | Percentage Operator | `=A2 * 18%` | Computes 18% of A2 |

---

## Order of Operations: The PEMDAS Rule

When combining multiple arithmetic operators in a single formula, Excel evaluates them in a strict mathematical hierarchy:

1. **P**arentheses: Expressions enclosed in `()` are evaluated first.
2. **E**xponents: Powers (`^`).
3. **M**ultiplication & **D**ivision: Evaluated from left to right.
4. **A**ddition & **S**ubtraction: Evaluated from left to right.

### The Classic Cost Calculation Mistake
Imagine calculating the total bill for 2 shirts at $30 each plus a $5 shipping fee:
- If you write: `=30 + 5 * 2`
  - Excel multiplies first: `5 * 2 = 10`, then adds `30 + 10 = 40`. **Wrong answer!**
- If you write: `=(30 + 5) * 2`
  - Excel evaluates the parentheses first: `30 + 5 = 35`, then multiplies `35 * 2 = 70`. **Correct answer!**

---

## Point-and-Click Formula Construction

Instead of manually typing cell addresses like "C14" and risking typos:
1. Select the cell where you want the answer.
2. Type **`=`**.
3. Click cell **`A2`** with your mouse (Excel automatically writes "A2" and highlights it in blue).
4. Type your operator, such as **`*`**.
5. Click cell **`B2`** (Excel automatically writes "B2" and highlights it in red).
6. Press **Enter**. Excel computes the total and displays the result!

---

## Viewing Formulas on the Worksheet ('Ctrl + `')

By default, Excel shows the numerical results of formulas on the grid. To verify all calculations across your entire worksheet simultaneously:
- Press **Ctrl + ~** (Ctrl and tilde/backtick, located above the Tab key).
- Excel switches to **Formula Auditing Mode**, widening columns and displaying every underlying formula in plain view!
- Press **Ctrl + ~** again to return to normal numerical display.

# Multiple Choice Questions

### 1. What symbol is used to perform multiplication in an Excel formula?
A. x
B. *
C. &
D. %
**Answer:** B
**Explanation:** Excel uses the asterisk symbol (*) for multiplication (e.g., =A1 * B1), while 'x' is treated as a text letter.

---

### 2. According to the mathematical order of operations (PEMDAS), what is the calculated result of the formula: =10 + 5 * 2?
A. 30
B. 20
C. 25
D. 100
**Answer:** B
**Explanation:** Multiplication takes precedence over addition; Excel first evaluates 5 * 2 = 10, and then adds 10 + 10 = 20.

---

### 3. How can you force Excel to add two numbers together before multiplying by a third number?
A. Enclose the addition in parentheses, e.g., =(A1 + B1) * C1
B. Put the addition in quotes
C. Type PLUS before the formula
D. Press Shift + Enter
**Answer:** A
**Explanation:** Parentheses take top precedence in the order of operations, forcing Excel to calculate expressions inside brackets first.

---

### 4. Which keyboard shortcut toggles between displaying calculated numbers and showing all underlying formulas across the entire worksheet?
A. Ctrl + F9
B. Ctrl + ~ (tilde/backtick)
C. Alt + Enter
D. Ctrl + Shift + F
**Answer:** B
**Explanation:** Ctrl + ~ (tilde / backtick key) toggles Formula View, exposing all formula expressions on the spreadsheet grid for rapid verification.

---

### 5. What symbol represents exponential powers (e.g., 5 squared) in Excel?
A. ^ (caret)
B. #
C. **
D. //
**Answer:** A
**Explanation:** The caret symbol (^) denotes exponentiation; =5^2 computes 5 squared (=25).

---

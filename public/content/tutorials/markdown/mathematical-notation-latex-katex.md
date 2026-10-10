---
title: "Mathematical Notation with LaTeX / KaTeX"
description: "Typeset elegant math formulas in Markdown using inline ($...$) and display block ($$...$$) KaTeX syntax."
order: 16
course: "markdown"
slug: "mathematical-notation-latex-katex"
---

For scientific papers, machine learning documentation, engineering notes, and financial algorithms, plain text lacks the symbols needed to express equations, integrals, matrices, and greek letters. Modern Markdown platforms (including GitHub, Obsidian, and KaTeX) support **LaTeX Mathematical Notation**.

![Markdown Documentation](/images/tutorials/markdown/markdown-documentation.jpg)

---

### 1. Inline Math (`$ ... $`)

To write a mathematical equation within a sentence, wrap the LaTeX expression in **single dollar signs (`$`)**:

```markdown
Einstein's mass-energy equivalence is expressed as $E = mc^2$.
The Pythagorean theorem states that $a^2 + b^2 = c^2$.
```

- **Rendered Output:**  
  Einstein's mass-energy equivalence is expressed as $E = mc^2$.

> **Escaping Rule for Currency:** If you are writing monetary amounts like `$50`, write `\$50` or wrap the price in backticks (`` `$50` ``) so the parser does not accidentally interpret it as the start of a LaTeX equation!

---

### 2. Block / Display Math (`$$ ... $$`)

For complex formulas, fractions, summations, and integrals, use **double dollar signs (`$$`)** on separate lines to render the equation centered in a dedicated display block:

```markdown
$$
f(x) = \int_{-\infty}^{\infty} g(t) e^{-2 \pi i f t} dt
$$
```

---

### 3. Essential LaTeX Math Cheat Sheet for Markdown

| Mathematical Concept | LaTeX Syntax in Markdown | Rendered Preview |
| :--- | :--- | :--- |
| **Fractions** | `\frac{a}{b}` | $\frac{a}{b}$ |
| **Greek Letters** | `\alpha, \beta, \gamma, \pi, \theta` | $\alpha, \beta, \gamma, \pi, \theta$ |
| **Superscripts & Subscripts** | `x_i^2 + y_i^2` | $x_i^2 + y_i^2$ |
| **Summation & Product** | `\sum_{i=1}^n x_i`, `\prod_{j=1}^m y_j` | $\sum_{i=1}^n x_i$ |
| **Square Root** | `\sqrt{x^2 + y^2}` | $\sqrt{x^2 + y^2}$ |
| **Comparison & Symbols** | `\le, \ge, \neq, \approx, \infty` | $\le, \ge, \neq, \approx, \infty$ |

#### Matrices & Linear Algebra:
```markdown
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\times
\begin{bmatrix}
x \\
y
\end{bmatrix}
$$
```

---

### 4. GitHub Native Math Support

Since 2022, GitHub natively supports KaTeX math rendering directly in all READMEs, issues, and discussions using the standard `$inline$` and `$$block$$` syntax.

---

# Multiple Choice Questions

### 1. Which delimiters are used to render inline mathematical formulas in modern Markdown?
A. Single dollar signs ($formula$)
B. Percent signs (%formula%)
C. Hash signs (#formula#)
D. Brackets ([formula])
**Answer:** A
**Explanation:** Wrapping a LaTeX expression in single dollar signs ($...$) renders inline mathematical typography via KaTeX/MathJax.
---

### 2. How do you render a centered, multi-line display mathematical equation block?
A. Wrap in double dollar signs ($$...$$) on separate lines
B. Use <code> tags
C. Put a plus sign at the start of each line
D. Write in capital letters
**Answer:** A
**Explanation:** Double dollar signs ($$...$$) create a standalone, display-mode mathematical equation block.
---

### 3. How do you escape a literal dollar sign (such as a $100 price tag) so it is not parsed as a math equation?
A. Write \$100 or wrap in backticks (`$100`)
B. Type 'dollar-100'
C. Press Enter twice
D. Change the currency to Yen
**Answer:** A
**Explanation:** Backslash escaping (\$) or backtick code wraps prevent Markdown parsers from interpreting dollar symbols as LaTeX delimiters.
---

### 4. What LaTeX syntax renders the fraction 'a over b' in Markdown?
A. \frac{a}{b}
B. a /div/ b
C. [fraction a b]
D. %div(a, b)
**Answer:** A
**Explanation:** The LaTeX command \frac{numerator}{denominator} formats fractions with a horizontal division bar.
---

### 5. Which JavaScript math rendering engine powers GitHub's native math equation support?
A. KaTeX / MathJax
B. jQuery
C. Lodash
D. Bootstrap
**Answer:** A
**Explanation:** KaTeX is a high-speed, lightweight JavaScript library for rendering LaTeX math notation on the web, used by GitHub.
---

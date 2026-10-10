# Tableau Data Model: Logical Layer vs Physical Layer

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. The Two Layers of the Tableau Data Model
In modern Tableau (2020.2+), data modeling operates across two distinct layers:

### 1. The Logical Layer (The "Noodle" Relationships)
- The default canvas view.
- Tables are connected by flexible lines called **Relationships** (noodles).
- **Smart Aggregation:** Tableau retains each table at its native level of detail, preventing duplicate data multiplication issues (fan trap).

### 2. The Physical Layer (Joins & Unions)
- Double-clicking a logical table opens the physical layer.
- Here you configure traditional SQL **Joins** (Inner, Left, Right, Full Outer) or **Unions**.

---

# Multiple Choice Questions

### 1. In modern Tableau, what connects tables in the default Logical Layer?
A. Relationships (flexible "noodles" that adaptively query data at the appropriate level of detail)
B. Permanent SQL joins
C. Web links
D. Excel macros
**Answer:** A
**Explanation:** Relationships in the logical layer do not merge tables physically; they query each table independently at the visualization's required level of detail.
---

### 2. How do you access the traditional Physical Layer (to create Inner/Left Joins) in Tableau Desktop?
A. Double-click on a logical table box on the canvas
B. Right-click the desktop
C. Press Ctrl + Alt + Delete
D. Reinstall Tableau
**Answer:** A
**Explanation:** Double-clicking any logical table opens its internal physical layer where joins and unions reside.
---

### 3. What major data distortion problem do Tableau Relationships prevent compared to traditional joins?
A. Many-to-many Cartesian product data duplication (where fact metrics are multiplied and overstated)
B. Negative numbers
C. Font corruption
D. Screen flicker
**Answer:** A
**Explanation:** Relationships prevent the classic join fan-out problem by aggregating fact tables independently before joining.
---

### 4. What symbol represents a Relationship between two tables on the Tableau data canvas?
A. A flexible orange/grey line ("noodle")
B. A padlock
C. An arrow
D. A dollar sign
**Answer:** A
**Explanation:** Tableau's relationship connections are colloquially and officially referred to as "noodles".
---

### 5. In the Physical Layer, what does a 'Union' do?
A. Appends rows from two or more tables with matching columns together vertically
B. Merges columns horizontally
C. Deletes tables
D. Calculates averages
**Answer:** A
**Explanation:** A Union stacks tables vertically, combining matching fields from multiple files or sheets.
---

# Logical Functions (IF, AND, OR, NOT)

Logical functions form the decision-making engine of your spreadsheets. By combining the fundamental **IF** statement with **AND**, **OR**, and **NOT**, you can create intelligent business models that evaluate complex multi-tier criteria automatically.

---

## 1. The Core IF Function

The **IF** function tests a logical condition and returns one value if the condition is TRUE, and another value if it is FALSE:

```excel
Syntax:
=IF(logical_test, value_if_true, value_if_false)
```

### Basic Business Examples:
* **Passing Grade:** '=IF(C2 >= 40, "Pass", "Fail")'
* **Sales Commission:** '=IF(D2 > 100000, D2 * 0.05, 0)'
* **Stock Alert:** '=IF(E2 <= 10, "Reorder Now", "In Stock")'

![Logical Functions Decision Tree](/images/tutorials/ms-excel/essential-functions-summary.svg)

---

## 2. Expanding Conditions with AND & OR

A single IF statement tests only one condition. By nesting **AND** or **OR** inside the 'logical_test' argument, you can evaluate multiple columns simultaneously:

### A. The AND Function (All Conditions Must Be Met)
Returns TRUE only if **every single argument** evaluates to TRUE:
```excel
Syntax:
=AND(logical1, [logical2], ...)

Example: Bonus Eligibility
=IF(AND(Sales >= 50000, Rating >= 4), "Eligible", "Not Eligible")
```
*If an employee has $60,000 in sales but a Rating of 3, AND returns FALSE and no bonus is granted.*

### B. The OR Function (At Least One Condition Must Be Met)
Returns TRUE if **any one** of the conditions evaluates to TRUE:
```excel
Syntax:
=OR(logical1, [logical2], ...)

Example: Free Shipping Qualification
=IF(OR(CartTotal >= 999, Membership="Gold"), "Free Shipping", "Standard Fee")
```
*If a customer has a Gold membership, they receive free shipping even if their cart total is only $10.*

---

## 3. The NOT Function (Inverting Logic)

The **NOT** function flips boolean truth values:
* '=NOT(TRUE)' returns **FALSE**
* '=NOT(FALSE)' returns **TRUE**
* Example: Check if customer is non-international:
  ```excel
  =IF(NOT(Country="USA"), "International Tariff", "Domestic")
  ```

---

## 4. Nested IF Statements

When evaluating multiple performance tiers (such as letter grades or discount brackets), you can place another IF statement inside the 'value_if_false' parameter:

```excel
=IF(B2 >= 90, "A",
  IF(B2 >= 80, "B",
    IF(B2 >= 70, "C",
      IF(B2 >= 60, "D", "F"))))
```
*Note: Always order your comparisons systematically (either highest to lowest, or lowest to highest) so thresholds trigger in the correct sequence.*

---

# Multiple Choice Questions

### 1. In '=IF(Score >= 50, "Pass", "Fail")', what is returned if Score is exactly 50?
A. Fail
B. Pass
C. #VALUE!
D. TRUE
**Answer:** B
**Explanation:** The condition '>= 50' means greater than OR equal to 50. Since 50 equals 50, the condition is TRUE, returning 'Pass'.

---

### 2. Which function returns TRUE only if ALL tested conditions are satisfied?
A. OR
B. AND
C. NOT
D. XOR
**Answer:** B
**Explanation:** The AND function requires all individual logical arguments to evaluate to TRUE in order to return TRUE.

---

### 3. What will '=OR(5 > 10, 8 = 8, 3 < 1)' evaluate to?
A. FALSE
B. TRUE
C. #N/A
D. 8
**Answer:** B
**Explanation:** Even though '5 > 10' and '3 < 1' are FALSE, '8 = 8' is TRUE. Because OR requires only one TRUE condition, the whole function evaluates to TRUE.

---

### 4. What will '=NOT(10 > 5)' return?
A. TRUE
B. FALSE
C. 10
D. 5
**Answer:** B
**Explanation:** 10 > 5 is TRUE. Wrapping it in NOT(TRUE) inverts the result to FALSE.

---

### 5. If an employee must achieve Sales > 100,000 AND Experience > 3 years to qualify for Manager, which formula correctly tests eligibility?
A. =IF(OR(Sales>100000, Exp>3), "Manager", "Staff")
B. =IF(AND(Sales>100000, Exp>3), "Manager", "Staff")
C. =IF(Sales+Exp>100003, "Manager", "Staff")
D. =IF(NOT(Sales>100000), "Manager", "Staff")
**Answer:** B
**Explanation:** Combining IF with AND ensures both conditions (Sales > 100,000 and Exp > 3) must be simultaneously TRUE to earn the "Manager" outcome.

---

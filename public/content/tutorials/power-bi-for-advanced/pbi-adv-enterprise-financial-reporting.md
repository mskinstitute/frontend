# Case Study 1: Enterprise Financial Reporting & Dynamic FX Conversion

Global enterprises operate across international borders, selling products in Indian Rupees (INR), US Dollars (USD), Euros (EUR), and British Pounds (GBP). Executives require financial dashboards that can dynamically consolidate global revenues into any chosen reporting currency using daily **foreign exchange (FX) rates**.

---

## 1. Multi-Currency Data Architecture

```
[Fact_Sales]
OrderID | OrderDate | LocalCurrency | LocalSalesAmount
101     | 2025-01-15| EUR           | 10,000
102     | 2025-01-15| INR           | 500,000
103     | 2025-01-15| USD           | 12,000
           ^
           | (Connects via Date & CurrencyKey)
[Fact_ExchangeRates]
Date       | FromCurrency | ToCurrency | ExchangeRate
2025-01-15 | EUR          | USD        | 1.08
2025-01-15 | INR          | USD        | 0.012
2025-01-15 | USD          | USD        | 1.00
```

---

## 2. Dynamic Currency Conversion DAX Pattern

```dax
-- Dynamic Converted Sales Measure based on Slicer Selection:
Selected Currency = SELECTEDVALUE(Dim_ReportingCurrency[CurrencyCode], "USD")

Converted Total Sales = 
VAR TargetCurrency = [Selected Currency]
RETURN
SUMX(
    Fact_Sales,
    VAR OrderDt = Fact_Sales[OrderDate]
    VAR LocalCurr = Fact_Sales[LocalCurrency]
    VAR Rate = 
        LOOKUPVALUE(
            Fact_ExchangeRates[ExchangeRate],
            Fact_ExchangeRates[Date], OrderDt,
            Fact_ExchangeRates[FromCurrency], LocalCurr,
            Fact_ExchangeRates[ToCurrency], TargetCurrency
        )
    RETURN
    Fact_Sales[LocalSalesAmount] * COALESCE(Rate, 1)
)
```

Now, when the CEO selects **"EUR"** in the currency slicer, the entire financial dashboard dynamically re-calculates all sales, costs, and profits into Euros using the exact historical exchange rate on the day of each transaction!

---

# Multiple Choice Questions

### 1. In global multi-currency financial reporting, why can't sales in different currencies be summed directly with a simple `SUM(Sales)`?
A. Power BI will crash
B. Adding numbers in different currencies (e.g., summing 100,000 INR and 100,000 USD directly) yields an invalid, meaningless number without exchange rate conversion
C. Currency formatting only supports Dollars
D. It violates web standards
**Answer:** B
**Explanation:** Currency amounts must be normalized into a common baseline reporting currency before mathematical aggregation to reflect real financial value.

### 2. Which DAX function retrieves the user's currency selection from a slicer to drive dynamic FX recalculation?
A. `USER_CHOICE()`
B. `SELECTEDVALUE(Dim_ReportingCurrency[CurrencyCode], "USD")`
C. `FILTER_VALUE()`
D. `SWITCH_CASE()`
**Answer:** B
**Explanation:** `SELECTEDVALUE` returns the single selected value from a slicer, providing the target currency parameter to the conversion formula.

### 3. Why is using historical exchange rates on the date of transaction preferred over using a single static current exchange rate?
A. Historical rates reflect accurate financial performance and GAAP/IFRS accounting standards, neutralizing subsequent currency fluctuations
B. Current rates are illegal
C. Static rates cannot be stored in SQL
D. Historical rates reduce file size
**Answer:** A
**Explanation:** Accounting standards require revenues to be recorded at the exchange rate in effect on the transaction date to accurately measure business performance.

### 4. What function in the dynamic conversion pattern fetches the exact daily rate from the exchange rate table?
A. `VLOOKUP`
B. `LOOKUPVALUE(ResultCol, SearchCol1, Value1, SearchCol2, Value2...)`
C. `SEARCH()`
D. `INDEX()`
**Answer:** B
**Explanation:** `LOOKUPVALUE` performs multi-condition lookups in DAX, matching both the transaction date and currency pairs to retrieve the exact exchange rate.

### 5. What visual element on a financial dashboard signals which currency is currently being displayed across all charts?
A. A dynamic visual title measure (e.g., `"Consolidated Revenue in " & [Selected Currency]`)
B. An audio sound effect
C. A red flashing border
D. A print dialog
**Answer:** A
**Explanation:** Dynamic titles powered by DAX measures clearly communicate the active currency to executives, preventing misinterpretation of financial numbers.

---

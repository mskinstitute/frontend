# Q&A Natural Language Queries: Linguistic Schema Training

Business executives frequently want answers to rapid, unexpected questions without waiting days for a BI team to build a new dashboard:
- *"Show total sales by state as a map"*
- *"Top 5 customers by profit margin in 2025"*
- *"What were laptop sales last quarter?"*

The **Q&A Visual** uses natural language processing (NLP) to parse conversational human questions into dynamic DAX queries and auto-generate the correct visual on the fly!

---

## 1. How the Q&A Engine Works

```
User Types: "show revenue by region for technology"
                         |
           [Power BI Natural Language Parser]
                         |
    1. Recognizes "revenue" as a synonym for [Total Sales]
    2. Identifies "region" as Dim_Geography[Region]
    3. Filters where Dim_Product[Category] = "Technology"
    4. Auto-selects Clustered Bar Chart visual
                         |
             Renders live chart instantly!
```

---

## 2. Q&A Tooling & Linguistic Modeling

In real organizations, business users do not always use the technical column names present in the database. A sales rep might say *"turnover"*, *"income"*, or *"top-line"* when referring to the column `Fact_Sales[SalesAmount]`.

### Training the Q&A Engine:
In Power BI Desktop, go to **Modeling** $\to$ **Q&A Setup**:
1. **Synonyms:** Add business aliases to tables and columns:
   - `Dim_Customer` $\to$ Synonyms: *Client*, *Buyer*, *Account*, *Purchaser*.
   - `Fact_Sales[Profit]` $\to$ Synonyms: *Earnings*, *Net Return*, *Margin*.
2. **Teach Q&A:** Train the engine on industry-specific phrases:
   - Define: *"A 'VIP Customer' is a customer whose Total Sales > $50,000"*.
3. **Review Questions:** Inspect what real users are typing in the Power BI Service and fix un-recognized terms.

---

# Multiple Choice Questions

### 1. What natural language feature in Power BI allows users to type conversational English questions to generate interactive charts instantly?
A. Quick Measures
B. Q&A Visual (Natural Language Query)
C. Smart Narrative
D. Performance Analyzer
**Answer:** B
**Explanation:** The Q&A visual provides an NLP search box that interprets plain-language questions and generates corresponding visuals and DAX calculations dynamically.

### 2. Where do developers configure synonyms and business aliases so that Q&A understands terms like "Turnover" for "Sales"?
A. In the Windows Control Panel
B. Under Modeling $\to$ Q&A Setup $\to$ Field Synonyms
C. In Power Query M code
D. In the Excel ribbon
**Answer:** B
**Explanation:** The Q&A Setup dialog on the Modeling tab provides the synonym management console for training the model on organizational terminology.

### 3. What feature in Q&A Setup allows developers to review the actual queries typed by end-users in the Power BI Service to identify gaps in vocabulary?
A. Review questions
B. Teach Q&A
C. Manage roles
D. View as
**Answer:** A
**Explanation:** "Review questions" displays a log of questions submitted by report consumers, highlighting terms the engine could not parse so developers can add appropriate synonyms.

### 4. If a user types "show total sales by product as a treemap", how does the Q&A visual respond?
A. It throws a syntax error
B. It generates a Treemap visual showing the Total Sales measure grouped by Product Name
C. It downloads a CSV file
D. It deletes the question
**Answer:** B
**Explanation:** The Q&A engine parses both the data intent and the visual type request (e.g., "as a treemap", "as a map", "as a table") and renders the requested visual type.

### 5. Why is linguistic schema modeling considered an enterprise best practice before rolling out self-service BI?
A. It speeds up dataset refresh times
B. It ensures non-technical business users get reliable, accurate answers to natural language questions without understanding internal database naming conventions
C. It reduces license costs
D. It prevents users from filtering
**Answer:** B
**Explanation:** Training the model with synonyms bridges the vocabulary gap between technical database schemas and daily business speech, making self-service queries accurate.

---

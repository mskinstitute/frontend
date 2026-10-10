# Enterprise BI Use Cases: Self-Service vs. Corporate BI

In intermediate business intelligence, understanding organizational data strategy is just as important as mastering DAX. Organizations generally structure their analytics programs into two complementary paradigms: **Self-Service BI** and **Corporate (Governed) BI**.

---

## 1. Self-Service BI vs. Corporate Governed BI

```
                    Enterprise Analytics Spectrum
                                  |
     +----------------------------+----------------------------+
     |                                                         |
Self-Service BI (Agile & Exploratory)          Corporate Governed BI (Standardized)
- Driven by business analysts & departmental teams  - Driven by central IT & Enterprise Data Engineers
- Fast turnaround (days/hours)                     - Rigorous QA, testing, and approval cycles
- Tailored to specific ad-hoc operational questions - Single Source of Truth for executive/statutory reports
- Uses local data mashups                          - Built on central Data Warehouses (Snowflake, Synapse)
```

---

## 2. The Hybrid "Managed Self-Service" Model

Leading global enterprises (e.g., Amazon, Microsoft, Walmart) operate on a **Managed Self-Service Model**:

```
Central Data Engineering Team
            | (Builds & Certifies Gold Semantic Models)
            v
[Certified Semantic Model: "Enterprise Sales & Finance"] <--- Governed, audited, optimized
            |
            +---> Sales Department (Builds their own custom reports connected to Certified Model)
            +---> Marketing Team   (Builds their own campaign reports connected to Certified Model)
            +---> Operations Team  (Builds their own delivery reports connected to Certified Model)
```

### Why Managed Self-Service is the Winning Strategy:
1. **Single Source of Truth:** All departments share the same certified DAX measures (e.g., Gross Revenue is calculated identically everywhere).
2. **Zero Data Duplication:** Fact tables are stored once in cloud storage rather than copied into 50 separate files.
3. **Agility with Governance:** Business users can create their own drag-and-drop visuals without burdening central IT.

---

## 3. Dataset Endorsement: Promoted vs. Certified

In the Power BI Service, datasets can be officially tagged to guide organizational trust:
- **Promoted:** Signifies that a dataset is well-maintained and recommended for departmental use. Can be applied by dataset owners.
- **Certified:** Signifies the highest level of enterprise verification and audit compliance. Can **ONLY** be applied by authorized tenant administrators.

---

# Multiple Choice Questions

### 1. What is the main danger of an ungoverned, purely self-service BI environment across a large enterprise?
A. Power BI Desktop stops updating
B. "Silos of truth" emerge where different departments report conflicting numbers for the same core business metric (e.g., Finance and Sales calculate revenue differently)
C. Computer screens turn black
D. Excel files cannot be opened
**Answer:** B
**Explanation:** Without central governance and shared semantic models, disparate teams create conflicting calculation formulas, leading to conflicting executive numbers and erosion of data trust.

### 2. In a Managed Self-Service BI model, what asset is built and maintained by the central IT/BI team?
A. Every single chart on every user's screen
B. The central, optimized, and Certified Semantic Model containing validated relationships and core DAX business measures
C. PowerPoint presentations
D. Individual user email passwords
**Answer:** B
**Explanation:** Central data engineering teams build and certify the underlying data model, allowing decentralized business analysts to build custom visual reports on top of that trusted foundation.

### 3. Who has the organizational authority to apply the "Certified" endorsement badge to a dataset in the Power BI Service?
A. Any user with a free license
B. Only designated administrators or governance leads specified in the Power BI Tenant Admin settings
C. Microsoft technical support
D. The creator of the visual
**Answer:** B
**Explanation:** To maintain strict trust standards, only designated governance administrators authorized in the Power BI Admin Portal can certify a dataset as enterprise-approved.

### 4. What is the key advantage of connecting multiple report files (.pbix) to a single shared Power BI dataset hosted in the cloud?
A. It speeds up the computer's CPU
B. It eliminates duplicate data storage, ensures consistent KPI calculations, and separates data modeling from visual report authoring
C. It allows reports to be printed in color
D. It bypasses the need for internet access
**Answer:** B
**Explanation:** Reusing a central cloud semantic model separates data modeling from report visualization, preventing redundant data refreshes and enforcing consistent calculations.

### 5. What indicator badge in the Power BI Service signals that a dataset is verified and safe for broad organizational consumption?
A. Beta
B. Certified
C. Draft
D. Archived
**Answer:** B
**Explanation:** The "Certified" badge is the highest level of endorsement in Microsoft Power BI, signifying that the semantic model meets strict enterprise auditing and governance standards.

---

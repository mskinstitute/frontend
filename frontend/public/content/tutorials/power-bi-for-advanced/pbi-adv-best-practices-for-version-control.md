# Version Control with Git, PBIP & Tabular Model Definition Language (TMDL)

For years, the standard Power BI file format was `.pbix`—a binary zip package. Binary files cannot be diffed, merged, or version-controlled in Git. If two developers modified the same `.pbix` file simultaneously, one developer's work was permanently overwritten.

In 2023, Microsoft introduced the **Power BI Project (`.pbip`) format**, unlocking native Git integration and multi-developer team workflows.

---

## 1. The Structure of a Power BI Project (`.pbip`)

When you save a report as a **Power BI Project (`.pbip`)**, Power BI decomposes the binary file into human-readable text folders:

```
MyReport.pbip (Root Project Descriptor)
├── MyReport.Report/                  (Report Layout & Visual Definitions)
│   ├── definition.pbir
│   └── report.json                   (Visual positions, colors, formatting)
└── MyReport.Dataset/                 (Data Model & Calculations)
    ├── definition.pbidataset
    └── definition/                   (TMDL - Tabular Model Definition Language)
        ├── model.tmdl                (Global model metadata)
        ├── relationships.tmdl        (Relationship cardinality & cross-filters)
        ├── tables/
        │   ├── Dim_Customer.tmdl     (Customer table schema & M code)
        │   └── Fact_Sales.tmdl       (Sales table schema & DAX measures)
```

---

## 2. Why TMDL is a Game-Changer

**TMDL (Tabular Model Definition Language)** expresses every table, column, and DAX measure in clean, human-readable YAML-like syntax:

```tmdl
table Fact_Sales
    column OrderID
        dataType: int64
        sourceColumn: OrderID

    measure 'Total Sales' = SUM(Fact_Sales[SalesAmount])
        formatString: \$#,##0.00
        displayFolder: "Sales Metrics"
```

### Git Collaboration Benefits:
1. **Pull Requests & Code Reviews:** Senior engineers can review DAX measures on GitHub/Azure DevOps before merging into `main`.
2. **Branch Merging:** Developer A can add a measure to `Dim_Customer.tmdl` while Developer B adds a measure to `Fact_Sales.tmdl` without merge conflicts!
3. **Rollbacks:** Instant rollback to previous Git commits if a bug is discovered.

---

# Multiple Choice Questions

### 1. Why was the traditional binary `.pbix` file format unsuitable for collaborative Git version control?
A. Git cannot store files larger than 1 MB
B. Binary files cannot be diffed line-by-line or merged; concurrent modifications by two developers resulted in file corruption or lost work
C. Power BI prohibited Git
D. `.pbix` files only run on Android
**Answer:** B
**Explanation:** Binary files cannot be tracked line-by-line in Git. The `.pbip` format solves this by serializing reports and datasets into human-readable text files.

### 2. What does TMDL stand for in modern enterprise Power BI modeling?
A. Total Monthly Data Log
B. Tabular Model Definition Language
C. Temporary Memory Direct Load
D. Transact-SQL Model Development
**Answer:** B
**Explanation:** TMDL (Tabular Model Definition Language) is Microsoft's human-readable text syntax for defining Analysis Services and Power BI semantic models.

### 3. In a `.pbip` project directory, where are DAX measures and table schemas stored?
A. Inside the `.Report` folder
B. Inside individual `.tmdl` text files under the `.Dataset/definition/tables/` directory
C. In an Excel spreadsheet
D. In the Windows registry
**Answer:** B
**Explanation:** The dataset schema is split into individual `.tmdl` files for each table within the dataset definition folder, making code reviews and conflict resolution straightforward.

### 4. What Microsoft cloud platform provides native Git integration directly synchronized with Power BI Service workspaces?
A. Microsoft Azure DevOps & GitHub integrated via Microsoft Fabric
B. Microsoft Paint
C. Windows Media Player
D. OneDrive personal
**Answer:** A
**Explanation:** Microsoft Fabric and Power BI Service feature native Git integration with Azure DevOps and GitHub, automatically syncing workspace changes with cloud Git branches.

### 5. What standard software development practice becomes possible for BI teams once `.pbip` and Git are adopted?
A. Peer code reviews via Pull Requests, automated CI/CD build validation, and branch isolation
B. Eliminating all data refreshes
C. Bypassing DAX formulas
D. Free hardware upgrades
**Answer:** A
**Explanation:** Storing models as code unlocks enterprise DevOps: code reviews, automated linting, branching strategies, and CI/CD automated deployments.

---

---
id: exporting-and-importing-csv-data
slug: exporting-and-importing-csv-data
course: sql-for-beginners
chapter: Database Backup, Export & Import
topic: "Exporting & Importing CSV Data: LOAD DATA INFILE & Workbench"
difficulty: Beginner
readingTime: 12
order: 53
keywords: ["csv import","load data infile","export to csv","into outfile","bulk data transfer","spreadsheet data"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Exporting & Importing CSV Data: LOAD DATA INFILE & Workbench
In real-world data engineering, backend development, and business analytics, you will constantly exchange data with external business teams who work in Microsoft Excel or Google Sheets. Mastering how to rapidly bulk-import hundreds of thousands of spreadsheet rows using **`LOAD DATA INFILE`** and export query results to **CSV files** is an essential practical skill.

---

## 1. High-Speed Bulk Import: `LOAD DATA INFILE`

While inserting 100,000 rows via standard SQL `INSERT` statements can take minutes, MySQL's **`LOAD DATA INFILE`** engine can parse and ingest the same data in **under two seconds**!

```sql
LOAD DATA LOCAL INFILE 'C:/data/students.csv'
INTO TABLE students
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(first_name, last_name, email, fee_paid, enrollment_date);
```

### Breaking Down the Clauses:
- **`LOCAL`:** Instructs the MySQL client to read the file from your local machine and transmit it to the server.
- **`FIELDS TERMINATED BY ','`:** Specifies the column delimiter (comma for CSV, `\t` for TSV).
- **`ENCLOSED BY '"'`:** Handles strings that contain commas inside quotes (e.g., `"Flat 4, Nariman Point"`).
- **`LINES TERMINATED BY '\r\n'`:** Standard Windows line endings (`\n` on Linux/macOS).
- **`IGNORE 1 ROWS`:** Skips the first header row containing column titles.
- **`(column_list)`:** Maps CSV fields to specific table columns.

---

## 2. Enabling `local_infile` Security in MySQL

Because reading local client files has security implications, MySQL disables `LOCAL INFILE` by default in modern installations. To enable it:

```sql
-- Enable on server session:
SET GLOBAL local_infile = 1;
```

And when connecting from the terminal, append the **`--local-infile=1`** flag:
```bash
mysql --local-infile=1 -u root -p msk_tech_academy
```

---

## 3. Exporting Query Results to CSV (`INTO OUTFILE`)

You can export any query directly to a comma-separated text file on the server using **`INTO OUTFILE`**:

```sql
SELECT customer_id, full_name, email, account_balance
FROM customers
WHERE account_status = 'Active'
INTO OUTFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/active_customers.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n';
```

> [!WARNING]
> **The `secure_file_priv` Restriction:** For security, MySQL will refuse to write files to arbitrary directories like `C:\` or `/etc/`. It restricts file exports to the directory configured in `SHOW VARIABLES LIKE 'secure_file_priv';`.

---

## 4. Visual CSV Import/Export via MySQL Workbench

If you prefer a point-and-click GUI workflow without security permissions tweaking:
1. Right-click any table in the Schemas Navigator -> Select **Table Data Import Wizard**.
2. Browse to your CSV file -> Click **Next**.
3. Map CSV columns to table columns using the visual dropdown interface.
4. Click **Next** to run the import.
5. To export: Execute any `SELECT` query -> Click the **"Export"** floppy disk icon in the Result Grid toolbar -> Choose **CSV**.

---

## 5. Best Practices & Common Pitfalls

- **Watch Out for Header Rows:** Always specify `IGNORE 1 ROWS` when importing CSVs with header columns. Otherwise, the string `"fee_paid"` will attempt to insert into a `DECIMAL` column, throwing an error!
- **Line Ending Discrepancies:** CSV files generated on Windows use Carriage Return + Line Feed (`\r\n`), while files generated on Linux/macOS use Line Feed (`\n`). Always check your file's line ending format.

---

# Multiple Choice Questions

### 1. Which MySQL statement provides the fastest method for bulk-importing thousands of rows from a text or CSV file into a database table?
A. INSERT BULK
B. LOAD DATA INFILE
C. IMPORT CSV
D. READ TABLE
**Answer:** B
**Explanation:** `LOAD DATA INFILE` is MySQL's highly optimized bulk-loader, ingesting rows orders of magnitude faster than standard `INSERT` statements.
---

### 2. What clause in `LOAD DATA INFILE` skips the first line of a CSV file containing column headers?
A. SKIP HEADER
B. IGNORE 1 ROWS
C. DROP ROW 1
D. OMIT FIRST
**Answer:** B
**Explanation:** `IGNORE 1 ROWS` instructs the parser to skip the initial line (typically holding column names) and begin importing from row 2.
---

### 3. Which server configuration variable restricts where files can be written to disk when using `INTO OUTFILE`?
A. local_infile
B. secure_file_priv
C. datadir
D. file_export_path
**Answer:** B
**Explanation:** `secure_file_priv` designates a specific directory where MySQL is permitted to read and write files using `LOAD DATA` and `INTO OUTFILE`.
---

### 4. What does the `ENCLOSED BY '"'` clause accomplish during CSV import?
A. It encrypts all strings with quotes
B. It permits fields containing internal commas (e.g., addresses) to be parsed as single values if surrounded by quotes
C. It limits strings to 10 characters
D. It forces all text to uppercase
**Answer:** B
**Explanation:** `ENCLOSED BY '"'` handles standard CSV formatting where text fields containing commas are wrapped in quotation marks.
---

### 5. Why is the `LOCAL` keyword used in `LOAD DATA LOCAL INFILE`?
A. To indicate the file resides on the client machine connecting to MySQL, rather than on the server's local file system
B. To create a local table in RAM
C. To bypass root authentication
D. To convert text to Latin-1
**Answer:** A
**Explanation:** The `LOCAL` keyword tells the client to locate and read the file from the client's local drive and stream it across the network connection to the server.
---

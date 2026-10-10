# Sharing, Threaded Comments and Tracking Changes

Modern enterprise workflows involve multiple analysts, managers, and auditors collaborating on the same financial workbook. Mastering Excel's collaboration ecosystem—differentiating **Threaded Comments** from **Legacy Notes**, inspecting the **Show Changes** audit ledger, and sharing securely—ensures accountable teamwork.

---

## 1. Modern Threaded Comments vs. Legacy Notes

Excel maintains two distinct annotation tools with different purposes:

```
+-----------------------------------+-----------------------------------+
| Modern Threaded Comments          | Legacy Notes (Yellow Sticky Notes)|
+-----------------------------------+-----------------------------------+
| Used for conversation & review    | Used for technical documentation  |
| Features @Mentions (@Rajesh)      | No @mentions or replies           |
| Supports nested reply chains      | Static hover note                 |
| Resolvable task threads           | Permanent documentation marker    |
| Visual: Purple corner triangle    | Visual: Red corner triangle       |
+-----------------------------------+-----------------------------------+
```

![Collaboration Comments and Auditing](/images/tutorials/ms-excel/data-validation-dialog.svg)

---

## 2. Using Threaded Comments & @Mentions

1. Right-click any cell > choose **New Comment** (or press **Ctrl + Shift + F2**).
2. Type your question or observation.
3. Type the **`@` symbol** followed by a colleague’s name or email (e.g., *"@Ananya Patel please verify Q3 logistics expense"*).
4. Click the green arrow **Post** button (or press **Ctrl + Enter**).
5. Excel automatically sends an email notification to that colleague with a direct deep-link to the exact cell!
6. Once resolved, click the three dots `...` on the comment > select **Resolve Thread**. The thread collapses neatly into an archived audit trail.

---

## 3. The 'Show Changes' Audit Ledger (Cloud Track Changes)

When workbooks are stored in OneDrive or SharePoint:
* Click **Review > Show Changes**.
* A dedicated side pane opens displaying a chronological timeline of every edit made in the workbook over the last 60 days:
  * Who made the edit.
  * Exact timestamp.
  * What the old value was vs. what the new value is.
  * Which sheet and cell coordinate was affected.
* Clicking any change in the list highlights that cell on screen immediately!

---

# Multiple Choice Questions

### 1. What is the key visual indicator that distinguishes a modern Threaded Comment from a Legacy Note on a cell?
A. Threaded Comments have a purple corner tag; Legacy Notes have a red corner triangle
B. Threaded Comments make the cell flash
C. Legacy notes turn the cell black
D. There is no visual difference
**Answer:** A
**Explanation:** Modern threaded comments are indicated by a purple/violet corner indicator, while traditional notes display a red corner mark.

---

### 2. What happens when you @mention a teammate in a modern Excel Threaded Comment?
A. It deletes their account
B. Excel sends them an automated email alert with a preview and direct link to that exact cell
C. It locks their computer
D. It opens a voice call
**Answer:** B
**Explanation:** Using @mentions triggers an automated notification email to the tagged person with a direct link to the referenced cell.

---

### 3. What feature in cloud-hosted Excel provides an audit trail of every cell edit made over the past 60 days?
A. Spell Check
B. Review tab > Show Changes
C. Find & Replace
D. Developer tab > Trace
**Answer:** B
**Explanation:** The 'Show Changes' pane records cell-level edit histories, listing timestamps, previous values, new values, and user names.

---

### 4. What keyboard shortcut posts a typed Threaded Comment instantly?
A. Esc
B. Ctrl + Enter
C. Alt + F4
D. Shift + Backspace
**Answer:** B
**Explanation:** Pressing Ctrl + Enter posts and commits a comment thread.

---

### 5. What should you do when a conversation on a Threaded Comment has reached a conclusion?
A. Delete the entire worksheet
B. Click the three dots and select 'Resolve Thread'
C. Change the font color
D. Save the file as a CSV
**Answer:** B
**Explanation:** Resolving a comment thread archives the conversation while preserving the historical discussion for future auditing.

---

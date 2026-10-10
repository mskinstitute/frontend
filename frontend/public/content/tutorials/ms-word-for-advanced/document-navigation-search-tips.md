---
title: 'Document Navigation & Search Tips'
description: 'Advanced search techniques: wildcard regular expressions, bookmarks, cross-references, and the Go To dialog.'
keywords:
  - wildcards search
  - regex search
  - bookmarks
  - cross-references
  - find and replace
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'document-navigation-search-tips'
---

# Document Navigation & Search Tips

## Advanced Search & Navigation: Wildcards & Cross-References

When working with massive legal depositions, medical records, or books exceeding 300 pages, basic text search is insufficient. Microsoft Word features a powerful **Wildcard Regex Search Engine**, internal **Bookmarks**, and dynamic **Cross-References**.

### 1. Wildcard Searches (Word's Built-In Regex)

In the **Find and Replace** dialog box (`Ctrl + H`), click **More >>** and check **Use wildcards**:

| Wildcard Syntax | Meaning & Match Pattern | Practical Example |
| :--- | :--- | :--- |
| `?` | Matches any single character | `b?t` matches *bat*, *bet*, *bit*, *bot* |
| `*` | Matches any string of characters | `t*n` matches *ten*, *teen*, *transportation* |
| `[a-z]` | Matches any character in range | `[0-9]` matches any digit |
| `[!a-z]` | Matches any character NOT in range | `[!0-9]` matches non-digits |
| `<` and `>` | Marks start / end of word | `<in>` matches only the standalone word *in* |
| `{n}` | Matches exact count of occurrences | `[0-9]{10}` finds all 10-digit mobile numbers! |

#### Power Example: Swapping "First Last" to "Last, First"
- In Find type: `(<*>) (<*>)`
- In Replace type: `\2, \1`
- Word uses capture groups to reverse all names across a 500-page member directory in 2 seconds!

### 2. Bookmarks: Tagging Critical Sections

Bookmarks assign invisible names to specific locations or selected text:
1. Highlight the target text or place your cursor at the target paragraph.
2. Go to **Insert** tab > **Links** group > click **Bookmark**.
3. Type a Bookmark name (must start with a letter and contain no spaces, e.g. `TerminationClause`).
4. Click **Add**.
5. To jump to it anytime: Press **Ctrl + G** (Go To) > select **Bookmark** > pick `TerminationClause` > press Enter!

### 3. Dynamic Cross-References

Instead of writing static text like *"See Table 4 on page 24"* (which becomes wrong if page numbers shift):
1. Go to **Insert > Cross-reference** (or References tab).
2. **Reference type**: Select *Numbered item*, *Heading*, *Bookmark*, or *Table*.
3. **Insert reference to**: Choose **Page number** or **Entire caption**.
4. Click **Insert**.
5. *Result*: A dynamic field is inserted! If the referenced table moves to page 32 later, pressing **F9** updates the cross-reference to *"See Table 4 on page 32"* automatically!

# Multiple Choice Questions

### 1. Which checkbox must be enabled in the Find and Replace dialog to unlock pattern matching with ? and * operators?
A. Match case
B. Find whole words only
C. Use wildcards
D. Sounds like
**Answer:** C
**Explanation:** "Use wildcards" activates Microsoft Word's internal regex pattern matching engine.
---

### 2. Which wildcard pattern finds all 10-digit telephone numbers in a document?
A. #10
B. [0-9]{10}
C. *10*
D. digit(10)
**Answer:** B
**Explanation:** [0-9]{10} matches exactly 10 consecutive numeric digits.
---

### 3. What is the purpose of inserting an automated "Cross-Reference" in a report instead of typing page numbers manually?
A. It bolds the text
B. The cross-reference updates its page number automatically if referenced elements shift
C. It prevents printing
D. It translates the text
**Answer:** B
**Explanation:** Dynamic cross-references automatically recalculate page numbers upon document updates.
---

### 4. What restriction applies to Bookmark names created in Microsoft Word?
A. They must be in uppercase only
B. They must start with a letter and cannot contain spaces
C. They must be numbers only
D. They must end in .txt
**Answer:** B
**Explanation:** Word bookmark identifiers must begin with an alphabetic character and contain zero spaces.
---

### 5. What is the keyboard shortcut to open the "Go To" navigation dialog box in MS Word?
A. Ctrl + G
B. Ctrl + J
C. Ctrl + N
D. Alt + G
**Answer:** A
**Explanation:** Ctrl + G launches the Go To navigation tab to jump to pages, sections, bookmarks, or lines.
---


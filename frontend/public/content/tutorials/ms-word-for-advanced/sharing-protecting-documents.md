---
title: 'Sharing & Protecting Documents'
description: 'Document security: password encryption, restrict editing (read-only and fill-in forms only), digital signatures, and Document Inspector.'
keywords:
  - protect document
  - restrict editing
  - password protect
  - document inspector
  - encrypt with password
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'sharing-protecting-documents'
---

# Sharing & Protecting Documents

## Document Security: Protection, Encryption & Metadata

Distributing confidential contracts, student grades, or corporate templates requires strict governance over who can open, edit, or copy your data. Microsoft Word provides multi-tiered security protocols.

### 1. Encrypting with a Password (Opening Protection)

Prevents unauthorized users from opening or reading the file without the secret password:
1. Click **File > Info**.
2. Click the **Protect Document** tile.
3. Select **Encrypt with Password**.
4. Enter a strong password and confirm it.
5. Save the file.
6. *Result*: The file is secured with military-grade **256-bit AES encryption**. Anyone attempting to open it must enter the password first.
> ⚠️ **Warning:** Microsoft cannot recover lost passwords! If you forget your password, the document cannot be recovered.

### 2. Restrict Editing (Restricting Modifications)

Allows recipients to read the document, but strictly controls *how* they can edit:
1. Go to **Review** tab (or **File > Info**) > click **Restrict Editing**.
2. The Restrict Editing task pane opens on the right:
   - **Formatting restrictions**: Limit formatting to a selection of approved styles (stops users from messing up corporate fonts!).
   - **Editing restrictions**: Check "Allow only this type of editing in the document":
     - *No changes (Read only)*: Total lockdown; recipients can view but not edit a single character.
     - *Tracked changes*: Users can edit, but all changes are permanently forced into Track Changes!
     - *Comments*: Users can only highlight text and leave comments.
     - *Filling in forms*: Ideal for job applications and surveys; users can ONLY type inside designated form fields, while all surrounding boilerplate text is completely locked!
3. Click **Yes, Start Enforcing Protection** > enter a password.

### 3. The Document Inspector: Removing Hidden Metadata

Before sending a document to an external client or posting it online, hidden metadata must be purged:
1. Go to **File > Info > Check for Issues > Inspect Document**.
2. Word scans for:
   - Personal author names, company names, and revision history.
   - Hidden text and off-canvas shapes.
   - Document properties and custom XML data.
3. Click **Remove All** next to sensitive categories to sanitize the document prior to publishing!

# Multiple Choice Questions

### 1. Which editing restriction mode locks all boilerplate text while allowing users to type ONLY inside designated form fields?
A. No changes (Read only)
B. Filling in forms
C. Comments only
D. Tracked changes
**Answer:** B
**Explanation:** "Filling in forms" restricts user input strictly to fillable form controls, locking all other text.
---

### 2. What encryption standard does Microsoft Word use when you protect a document with a password via File > Info?
A. 56-bit DES
B. 128-bit WEP
C. 256-bit AES encryption
D. Plain text hashing
**Answer:** C
**Explanation:** Modern MS Word utilizes robust 256-bit AES encryption to lock password-protected files.
---

### 3. Which tool sanitizes a document by stripping hidden author names, personal metadata, and revision comments before public distribution?
A. Spell Check
B. The Document Inspector
C. Format Painter
D. AutoRecover
**Answer:** B
**Explanation:** The Document Inspector scans and purges personal metadata, author tags, and hidden content.
---

### 4. Where on the Ribbon can you access the "Restrict Editing" task pane directly?
A. Home
B. Review tab (Protect group)
C. Layout
D. References
**Answer:** B
**Explanation:** Review > Protect > Restrict Editing opens the permissions and editing lockdown pane.
---

### 5. What happens if you lose or forget the password used to Encrypt a Word document?
A. Microsoft Support can email it to you
B. The document cannot be opened or recovered
C. Pressing F12 bypasses it
D. It resets after 24 hours
**Answer:** B
**Explanation:** Word encryption is cryptographically irreversible; lost passwords cannot be retrieved by Microsoft.
---


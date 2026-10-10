# Composing, Sending, and Attaching Files in Email (ईमेल लिखना और भेजना)

Writing an email requires adhering to proper addressing fields and understanding the underlying transmission protocols that deliver your messages worldwide in seconds.

---

## 1. The Compose Window: To, Cc, and Bcc

When you click the **Compose (+)** button to draft an email, you must specify the recipients:

```text
+-------------------------------------------------------------------------+
| New Message                                                     [ - ] [ ✕ ] |
+-------------------------------------------------------------------------+
| To:       student@gmail.com                                             |
| Cc:       principal@gmail.com                                           |
| Bcc:      inspector@gmail.com                                           |
| Subject:  Application for Leave - Sumit Sharma                          |
+-------------------------------------------------------------------------+
| Dear Sir,                                                               |
| I am writing to request leave from 14th to 16th September...             |
|                                                                         |
| [Attach Paperclip 📎]  [Send Button]                                    |
+-------------------------------------------------------------------------+
```

1. **To (प्राप्तकर्ता):** The primary recipient(s) for whom the message is directly intended.
2. **Cc (Carbon Copy - कार्बन कॉपी):**
   - Secondary recipients who need to be kept informed (e.g. keeping your supervisor in the loop).
   - **Important:** Everyone listed in `To` and `Cc` can **SEE** each other's email addresses!
3. **Bcc (Blind Carbon Copy - गुप्त कार्बन कॉपी):**
   - Secret recipients!
   - **Crucial Feature:** Recipients in the `Bcc` line receive a copy of the email, but **NONE of the other recipients in `To` or `Cc` can see that this person received a copy**!
   - Ideal when broadcasting exam notifications to 500 students while protecting their private email privacy.
4. **Subject Line (विषय):** A brief, clear summary of what the email is about (e.g. *"Job Application for Computer Instructor"*). Never leave the subject blank!

---

## 2. Attaching Files (Paperclip Icon 📎)

You can attach PDF certificates, resume documents, and photographs to an email:
- Click the **Paperclip icon (📎)** at the bottom of the compose window.
- Select your file from the computer.
- **Attachment Size Limit:**
  - In **Gmail**: The maximum direct file attachment limit is **`25 MB`**.
  - If your file exceeds 25 MB (e.g. a 100 MB video), Gmail automatically uploads it to **Google Drive** and inserts a download cloud link instead!

---

## 3. Email Communication Protocols (Super Important for CCC!)

The NIELIT exam frequently tests the technical protocols that govern email:

| Protocol | Full Form | Port Number | Primary Function |
| :--- | :--- | :--- | :--- |
| **SMTP** | Simple Mail Transfer Protocol | Port 25 / 587 | **SENDING (पुश करना)** outgoing emails from client to server |
| **POP3** | Post Office Protocol version 3 | Port 110 / 995 | **RECEIVING (डाउनलोड करना)** emails to a single local device |
| **IMAP** | Internet Message Access Protocol | Port 143 / 993 | **RECEIVING & SYNCING** emails across multiple devices (Mobile + PC)|

---

# Multiple Choice Questions

### 1. What does the acronym "Bcc" stand for in an email compose window?
A. Best Carbon Copy
B. Blind Carbon Copy
C. Base Communication Channel
D. Bulk Customer Contact
**Answer:** B
**Explanation:** Bcc stands for Blind Carbon Copy. Addresses placed in the Bcc field are concealed from all other recipients of the message.

---

### 2. Which networking protocol is exclusively responsible for SENDING outgoing emails across the internet?
A. POP3
B. IMAP
C. SMTP (Simple Mail Transfer Protocol)
D. FTP
**Answer:** C
**Explanation:** SMTP (Simple Mail Transfer Protocol) is the standard protocol used to push and transmit outgoing email messages from client machines to mail servers.

---

### 3. What is the standard maximum direct file attachment size limit in Google Gmail?
A. 10 MB
B. 25 MB
C. 50 MB
D. 100 MB
**Answer:** B
**Explanation:** Gmail permits direct email file attachments of up to 25 MB in size. Files exceeding 25 MB are automatically shared via Google Drive cloud links.

---

### 4. Which icon is universally clicked to attach files and documents to an email?
A. Magnifying Glass
B. Paperclip icon (📎)
C. Scissors
D. Trash Can
**Answer:** B
**Explanation:** The paperclip icon is the universal symbol in email clients representing the file attachment feature.

---

### 5. What is the primary advantage of IMAP over POP3 for receiving emails?
A. IMAP is 100% free while POP3 is paid
B. IMAP synchronizes emails across multiple devices (phone, laptop) simultaneously without deleting them from the server
C. IMAP sends emails faster
D. IMAP works without internet
**Answer:** B
**Explanation:** IMAP leaves messages on the central server and synchronizes folders in real time across multiple client devices, whereas POP3 downloads and typically removes them locally.

---
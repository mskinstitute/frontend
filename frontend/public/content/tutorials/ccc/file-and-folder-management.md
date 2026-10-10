# File and Folder Management (फ़ाइल और फ़ोल्डर प्रबंधन)

Computers store vast amounts of information. Without a logical filing system, finding a specific document or photo would be like searching for a needle in a haystack.

In Windows, files and folders are managed using **File Explorer** (फ़ाइल एक्सप्लोरर), which organizes your storage drives into a neat hierarchical tree structure.

---

## 1. What is a File? (फ़ाइल क्या है?)

A **File** is the basic unit of digital storage. It is a collection of related data, text, image, audio, or program instructions saved under a unique **File Name**.

Every file name consists of two parts separated by a dot (`.`):
```text
                 filename.extension
                      │        │
           Primary Name        File Extension
           (e.g., CCC_Notes)   (e.g., .docx, .pdf, .jpg)
```
- **Primary Name:** Chosen by the user to describe the content (e.g. `Suresh_Resume`).
- **File Extension:** Usually 3 or 4 letters assigned by the software that indicates the file format and tells the OS which app should open it (e.g. `.docx` opens in Word, `.xlsx` opens in Excel).

---

## 2. What is a Folder (Directory)? (फ़ोल्डर क्या है?)

A **Folder** (also called a **Directory**) is a virtual digital container used to organize and group related files together.

- A folder can contain files as well as other folders. A folder located inside another folder is called a **Subfolder (सबफ़ोल्डर)**.
- Folders have names, but unlike files, **folders do not have file extensions**!

---

## 3. Storage Hierarchy and Directory Path

Windows organizes storage into drives designated by capital letters:
- **`C:` Drive:** The primary system drive containing the Windows operating system and installed programs.
- **`D:`, `E:`, `F:` Drives:** Secondary partitions used for user files, photos, movies, and backup documents.

An absolute address showing the exact location of a file is called its **File Path (फ़ाइल पाथ)**:
```text
D:MSK_InstituteCCC_BatchChapter1_Notes.pdf
│        │            │             │
Drive  Folder     Subfolder      File Name
```

---

## 4. Fundamental File Operations & Shortcuts

| Operation | Action Description | Keyboard Shortcut |
| :--- | :--- | :--- |
| **Open File Explorer** | Opens This PC / Explorer window | **`Windows + E`** |
| **Create New Folder** | Creates a new empty folder instantly | **`Ctrl + Shift + N`** |
| **Rename** | Renames the selected file or folder | **`F2`** |
| **Copy (कॉपी)** | Duplicates file to clipboard (original stays) | **`Ctrl + C`** |
| **Cut (कट / Move)** | Moves file to clipboard (original removed) | **`Ctrl + X`** |
| **Paste (पेस्ट)** | Pastes copied/cut file at target location | **`Ctrl + V`** |
| **Select All** | Selects all files inside current folder | **`Ctrl + A`** |
| **Delete** | Sends selected file to Recycle Bin | **`Delete`** |
| **Permanent Delete**| Erases file permanently from disk | **`Shift + Delete`** |

---

## 5. File Naming Rules in Windows

When naming files and folders in Windows:
- A file name can be up to **255 characters** long.
- **Illegal Characters:** You **CANNOT** use the following 9 reserved symbols in file or folder names:
  ```text
     /   :   *   ?   "   <   >   |
  ```
  *(Tip to remember: Slash, Colon, Asterisk, Question mark, Quotes, Less/Greater than, Pipe).*

---

# Multiple Choice Questions

### 1. Which keyboard shortcut creates a brand-new folder instantly in Windows File Explorer?
A. `Ctrl + N`
B. `Ctrl + Shift + N`
C. `Alt + N`
D. `F3`
**Answer:** B
**Explanation:** In Windows File Explorer, pressing `Ctrl + Shift + N` immediately creates a "New folder" at the current directory location.

---

### 2. What is the standard function key shortcut to rename a selected file or folder?
A. `F1`
B. `F2`
C. `F5`
D. `F12`
**Answer:** B
**Explanation:** Pressing `F2` while an item is selected highlights its name, allowing you to edit and rename the file or folder directly.

---

### 3. Which of the following characters is NOT permitted when naming a file in Windows?
A. Hyphen (`-`)
B. Underscore (`_`)
C. Question Mark (`?`)
D. Dollar Sign (`$`)
**Answer:** C
**Explanation:** Windows strictly prohibits 9 reserved special characters in file names: ` / : * ? " < > |`. Question mark (`?`) is an invalid character.

---

### 4. What is the keyboard shortcut to open Windows File Explorer directly?
A. `Windows + E`
B. `Windows + F`
C. `Ctrl + E`
D. `Alt + E`
**Answer:** A
**Explanation:** Pressing `Windows Key + E` launches File Explorer (formerly Windows Explorer) from any screen in Windows.

---

### 5. What is the fundamental difference between "Copy" (`Ctrl + C`) and "Cut" (`Ctrl + X`)?
A. Copy deletes the original file, Cut preserves it
B. Copy creates a duplicate preserving the original; Cut removes the file from its source location to move it
C. Cut only works on text, Copy works on files
D. There is no difference
**Answer:** B
**Explanation:** Copying duplicates data to the clipboard while leaving the source file intact. Cutting moves the file to the clipboard, deleting it from the original location once pasted elsewhere.

---
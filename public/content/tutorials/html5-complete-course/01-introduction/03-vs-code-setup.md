---
id: html-vs-code-setup
slug: vs-code-setup
course: html5-complete-course
chapter: 1
topic: 1.3
title: VS-Code Setup
description: Learn how to download VS Code, install essential extensions (Live Server), and run your first HTML page in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 7
order: 3
keywords:
  - vs code setup
  - visual studio code html
  - live server extension
  - emmet boilerplate shortcut
  - code editor for html
  - html setup for school students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# VS Code Setup (The Best Tool for HTML Coding)

In Topics 1.1 and 1.2, you learned what HTML is and what a standard HTML document looks like. Now comes the practical question: **Where do we write our HTML code?**

You can write HTML in basic Windows **Notepad**. But in Notepad, all text looks plain black, there is no automatic error checking, and you have to manually refresh your browser every time you make a change.

Imagine writing with a plain wooden pencil versus having a **Smart Digital Pen** that:
- Highlights words in bright, helpful colors,
- Automatically corrects your spelling,
- And helps you finish your work 5 times faster!

That smart software is called a **Code Editor**. The most popular, fastest, and 100% free code editor in the world is **Visual Studio Code (VS Code)**, made by Microsoft.

---

# Why Should You Use VS Code? (Top Benefits)

| Feature | Windows Notepad | Visual Studio Code |
|---|---|---|
| **Color Coding (Syntax Highlighting)** | ❌ Everything is plain black | ✅ Tags, attributes, and text are displayed in bright, distinct colors |
| **Auto-Complete (IntelliSense)** | ❌ You must type every letter manually | ✅ Typing `<p` automatically closes `</p>` for you |
| **Instant Boilerplate (Emmet)** | ❌ Not available | ✅ Typing `!` and pressing Enter generates the full boilerplate in 1 second |
| **Live Server** | ❌ Manually press F5 to reload | ✅ Saving your code (`Ctrl + S`) automatically refreshes the browser |
| **Price** | Free | 100% Free (by Microsoft) |

---

# Step-by-Step Installation Guide

Installing VS Code on your computer or laptop is very easy:

### Step 1: Open the Official Website
Open your browser and visit: [code.visualstudio.com](https://code.visualstudio.com)

### Step 2: Download the Installer
Click the big blue button: **"Download for Windows"** (or Mac / Linux). The setup file will download to your computer.

### Step 3: Run the Setup
Double-click the downloaded `.exe` file to begin installation.

### Step 4 (Most Important Step ⚠️):
During the installation, you will see a screen with several checkboxes. Make sure to **check (tick)** these two options:
- ✅ **Add "Open with Code" action to Windows Explorer file context menu**
- ✅ **Add to PATH (requires shell restart)**

These options allow you to right-click on any project folder and immediately open it in VS Code!

### Step 5: Finish Installation
Click "Next", then "Install". Within 1 to 2 minutes, the installation will finish. Click "Finish" to open VS Code.

---

# Creating Your First HTML Folder and File

Now let us set up your workspace to write your first webpage:

1. **Create a New Project Folder:**
   On your computer (on the Desktop or in your D: Drive), create a new folder named: `html-practice`.

2. **Open the Folder in VS Code:**
   - Launch VS Code.
   - In the top menu bar, click: **File ➡️ Open Folder...**
   - Select your new `html-practice` folder.

3. **Create a New HTML File:**
   - On the left sidebar (EXPLORER), you will see your folder name.
   - Click the **New File** 📄 icon next to the folder name.
   - Type the filename: `index.html` and press **Enter**.

> 📌 **Why name it `index.html`?**
> Every web server and browser looks for `index.html` as the default home page of a website. That is why developers always name their primary webpage `index.html`.

---

# Magic Trick: Generate Full Boilerplate in 1 Second (Emmet)

You do not need to manually type the whole boilerplate skeleton every time!

1. In your empty `index.html` file, type just an exclamation mark: **`!`**
2. You will see a small popup menu labeled "Emmet Abbreviation".
3. Press **`Enter`** or **`Tab`** on your keyboard.

💥 **Boom!** The complete HTML5 boilerplate code will instantly appear on your screen:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>
```

---

# Essential Extension: Install Live Server

Normally, whenever you make a change in your code, you have to switch to your browser and press F5 (Reload). 

With the **Live Server** extension, whenever you save your file (`Ctrl + S`), the browser **reloads automatically** without you having to press anything!

### How to Install Live Server:
1. Click the Extensions icon on the left sidebar (or press **`Ctrl + Shift + X`**).
2. In the search box at the top, type: `Live Server`.
3. Find "Live Server" by **Ritwick Dey** and click the **Install** button.
4. It will install within a few seconds.

### How to Run Your Webpage with Live Server:
1. Inside the `<body>` of your `index.html`, add some content:
   ```html
   <h1>Hello, VS Code!</h1>
   <p>Live Server is working perfectly.</p>
   ```
2. **Right-click** anywhere on your code editor screen.
3. Select **"Open with Live Server"**.
4. Your default web browser will open automatically and display your webpage!
5. Now, change any text in VS Code and press **`Ctrl + S`** (Save). Watch your browser update instantly!

---

# Two More Helpful Extensions for Beginners

1. **Auto Rename Tag:**
   - When you change an opening tag (like changing `<h1>` to `<h2>`), it automatically updates the closing tag to `</h2>` too. You do not have to rename it twice!

2. **Prettier - Code Formatter:**
   - If your code looks messy or disorganized, Prettier cleans and aligns everything neatly.
   - Shortcut to format code: **`Shift + Alt + F`**.

---

# Handy Keyboard Shortcuts (Cheat Sheet)

Remembering these shortcuts will speed up your coding:

| Shortcut | Action |
|---|---|
| **`Ctrl + S`** | Save file (Get into the habit of pressing this often!) |
| **`Shift + Alt + F`** | Format code neatly |
| **`Ctrl + /`** | Add or remove a comment |
| **`Ctrl + B`** | Show or hide the left sidebar |
| **`Ctrl + Shift + X`** | Open the Extensions Marketplace |
| **`Alt + Up/Down Arrow`** | Move a line of code up or down |

---

# Quick Summary

- ✅ **VS Code** is a free, fast, and powerful code editor from Microsoft.
- ✅ Always tick **"Add to PATH"** during installation.
- ✅ Always name your primary webpage **`index.html`**.
- ✅ Type **`!`** and press **`Enter`** to instantly generate the full HTML5 boilerplate (Emmet).
- ✅ The **Live Server** extension automatically refreshes your browser whenever you save (`Ctrl + S`).

---

---

## ⚠️ Common Beginner Mistakes & How to Avoid Them

### 1. Forgetting to Close Non-Empty Tags
Every paired tag must have a matching closing tag with a forward slash `/`:
```html
<!-- ❌ INCORRECT (Missing closing tag) -->
<p>This paragraph is never closed!
<h1>Next Heading</h1>

<!-- ✅ CORRECT -->
<p>This paragraph is cleanly closed.</p>
<h1>Next Heading</h1>
```

### 2. Writing Tags in Uppercase
While browsers tolerate `<H1>` or `<P>`, standard modern W3C HTML5 code conventions strictly use lowercase tag and attribute names:
```html
<!-- ❌ Outdated practice -->
<DIV CLASS="CONTAINER"><P>Text</P></DIV>

<!-- ✅ Modern W3C Standard -->
<div class="container"><p>Text</p></div>
```

---

## Practice Quiz

Test your understanding with these questions:

### 1. Which shortcut in VS Code instantly generates the HTML5 boilerplate code?
A. `?` and Enter
B. `!` and Enter (or Tab)
C. `Ctrl + H`
D. `<html>` and Space
**Answer:** B

---

### 2. Which extension automatically refreshes your browser when you save your HTML file?
A. Python
B. Live Server
C. Calculator
D. Chrome Tab
**Answer:** B

---

### 3. What is the keyboard shortcut to open the Extensions Marketplace in VS Code?
A. `Ctrl + Shift + X`
B. `Ctrl + Alt + Delete`
C. `Ctrl + P`
D. `Shift + Esc`
**Answer:** A

---

### 4. What is the standard name for the default home page file in any website project?
A. `home.docx`
B. `index.html`
C. `main.txt`
D. `page1.html`
**Answer:** B

---

### 5. Which keyboard shortcut in VS Code neatly formats and indents your code?
A. `Ctrl + S`
B. `Shift + Alt + F`
C. `Ctrl + C`
D. `Alt + F4`
**Answer:** B

---

# Practice Challenge (Today's Homework)

1. If you haven't installed VS Code yet, download and install it from `code.visualstudio.com`.
2. Open Extensions and install **Live Server**.
3. Create a new folder on your computer named: `my-first-site`.
4. Open the folder in VS Code and create `index.html`.
5. Use the **`!`** shortcut to generate your boilerplate.
6. Inside `<body>`, add your name and school name.
7. Right-click and choose **Open with Live Server** to preview your live webpage! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Elements** (Introduction).

👉 **[Continue to Next Lesson: Elements →](/tutorials/html5-complete-course/elements)**

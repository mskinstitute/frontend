# Setting up Environment: VSCode, Live Server

To write JavaScript productively, professional developers configure a modern development environment. While you can write code in Notepad, using industry-standard tools like **Visual Studio Code (VS Code)** and the **Live Server** extension accelerates your learning and debugging tenfold.

---

## 1. Installing Visual Studio Code

Visual Studio Code (VS Code) is the world's most popular free code editor, built by Microsoft using web technologies (Electron, TypeScript, and Node.js).

### Step-by-Step Installation:
1. Navigate to **[code.visualstudio.com](https://code.visualstudio.com)**.
2. Download the installer for your operating system (Windows, macOS, or Linux).
3. Run the installer. On Windows, ensure you check:
   - *Add "Open with Code" action to Windows Explorer file context menu*.
   - *Add to PATH*.
4. Launch VS Code.

---

## 2. Essential Extensions for JavaScript Developers

In VS Code, click the **Extensions** icon in the left sidebar (or press `Ctrl + Shift + X` on Windows / `Cmd + Shift + X` on Mac). Install the following extensions:

```
+-----------------------------------------------------------------------------+
|                      RECOMMENDED VS CODE EXTENSIONS                         |
+-----------------------------------------------------------------------------+
| 1. Live Server (by Ritwick Dey)                                             |
|    Launches a local development server with automatic live reload on save! |
|                                                                             |
| 2. Prettier - Code Formatter                                                |
|    Automatically formats indentation, quotes, and spacing on every save     |
|                                                                             |
| 3. ESLint                                                                   |
|    Flags syntax errors, undeclared variables, and code smells in real-time  |
|                                                                             |
| 4. JavaScript (ES6) code snippets                                           |
|    Accelerates typing with quick snippets (clg -> console.log)              |
+-----------------------------------------------------------------------------+
```

---

## 3. Creating Your First Project with Live Server

Let's set up a clean, structured project folder:

### Step 1: Create Project Folder
On your desktop or projects directory, create a folder named `js-starter`:
```text
js-starter/
├── index.html
├── style.css
└── app.js
```

### Step 2: Write the HTML Boilerplate (`index.html`)
In VS Code, open `index.html` and type `!` followed by `Tab` to generate HTML5 boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript Starter | MSK Institute</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
  <div class="container">
    <h1 id="heading">Welcome to JavaScript!</h1>
    <button id="btn">Click to Test JS</button>
    <p id="output"></p>
  </div>
</body>
</html>
```

### Step 3: Write Your JavaScript Code (`app.js`)
```javascript
console.log("app.js loaded successfully!");

const btn = document.getElementById("btn");
const output = document.getElementById("output");

btn.addEventListener("click", () => {
  output.textContent = "Congratulations! JavaScript is working perfectly.";
  output.style.color = "#10b981";
  output.style.fontWeight = "bold";
});
```

### Step 4: Launch Live Server
1. Right-click inside `index.html`.
2. Select **Open with Live Server** (or click "Go Live" in the bottom-right status bar).
3. A browser window automatically opens at `http://127.0.0.1:5500/index.html`.
4. Click the button and watch the text update instantly!
5. Change any text in VS Code and press `Ctrl + S`: the browser reloads automatically without manual refresh!

---

## 4. Configuring Prettier "Format on Save"

To ensure your code always looks clean and professionally formatted:
1. Open VS Code Settings (`Ctrl + ,`).
2. Search for **Format On Save**.
3. Check the checkbox: **Editor: Format On Save**.
4. Set **Editor: Default Formatter** to **Prettier - Code Formatter**.

---

## Practice Quiz

### Q1: What is Visual Studio Code (VS Code)?
- A) An operating system like Windows
- B) A popular, lightweight, and extensible code editor developed by Microsoft
- C) A database management system
- D) A browser like Google Chrome
**Answer:** B
**Explanation:** VS Code is a free, open-source code editor with rich extension support, widely considered the industry standard for web development.

### Q2: What is the primary benefit of the "Live Server" extension in VS Code?
- A) It uploads your website to an AWS production cluster
- B) It launches a local development web server and automatically refreshes the browser page whenever you save a file
- C) It writes unit tests automatically
- D) It translates JavaScript to Python
**Answer:** B
**Explanation:** Live Server serves files locally and triggers automated browser reloads on file saves, eliminating tedious manual browser refreshes.

### Q3: Why is testing JavaScript via `http://127.0.0.1:5500` (HTTP protocol) better than double-clicking `index.html` (file:// protocol)?
- A) It prevents security restrictions (CORS) that block ES6 modules, Fetch API calls, and Web Workers under the `file://` protocol
- B) Double-clicking causes computer crashes
- C) Chrome cannot open HTML files directly
- D) `http://` makes text fonts darker
**Answer:** A
**Explanation:** Modern browser security blocks features like ES6 imports (`type="module"`) and `fetch()` when accessed via `file://`. A local HTTP server is required.

### Q4: Which VS Code extension automatically enforces consistent indentation, quotation marks, and line breaks on save?
- A) Prettier - Code Formatter
- B) Spotify Extension
- C) Docker
- D) GitLens
**Answer:** A
**Explanation:** Prettier is an opinionated code formatter that standardizes syntax formatting across teams.

### Q5: What is the shortcut in VS Code to quickly open the Integrated Terminal?
- A) `Ctrl + ` ` (Backtick) / `Cmd + ` `
- B) `Ctrl + Alt + Delete`
- C) `F5`
- D) `Shift + Esc`
**Answer:** A
**Explanation:** Pressing `Ctrl + ` ` toggles the integrated terminal inside VS Code.

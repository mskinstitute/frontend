---
title: "Fenced Code Blocks & Syntax Highlighting"
description: "Write multi-line fenced code blocks with triple backticks and language identifiers (py, js, html, css, bash, json)."
order: 15
course: "markdown"
slug: "fenced-code-blocks-syntax-highlighting"
---

For multi-line programming code, server configuration files, and terminal command sequences, Markdown provides **Fenced Code Blocks**. With modern syntax highlighters (like Prism.js, Highlight.js, and Shiki), fenced code blocks render colorized, readable code matching your favorite IDE.

![Markdown Syntax Anatomy](/images/tutorials/markdown/markdown-syntax-cheatsheet-anatomy.svg)

---

### 1. Fenced Code Block Syntax

To create a fenced code block, place **three or more backticks (```)** on a line before and after your code:

```markdown
```javascript
function calculateTotal(price, tax) {
  return price + (price * tax);
}
console.log(calculateTotal(100, 0.18));
```
```

- **HTML Output:**
  `<pre><code class="language-javascript">...</code></pre>`
- **Tilde Alternative:** You can also use three or more tildes (`~~~`) instead of backticks.

---

### 2. Popular Language Identifiers (Info Strings)

The word immediately following the opening triple backticks is the **Language Identifier** (or info string). Modern highlighters use this to tokenize and colorize keywords, strings, comments, and numbers:

| Language | Identifier | Example Usage |
| :--- | :--- | :--- |
| **JavaScript** | `js` or `javascript` | Frontend scripts, Node.js code |
| **TypeScript** | `ts` or `typescript` | Type definitions, interfaces |
| **Python** | `py` or `python` | Data analysis, machine learning |
| **HTML** | `html` | Web templates, markup snippets |
| **CSS** | `css` | Stylesheet rules, media queries |
| **JSON** | `json` | Configuration files, API responses |
| **Bash / Shell** | `bash` or `sh` | Terminal installation commands |
| **SQL** | `sql` | Database queries (`SELECT`, `INSERT`) |
| **YAML** | `yaml` or `yml` | GitHub Actions, Docker Compose |
| **Markdown** | `markdown` or `md` | Markdown examples |

---

### 3. Showing Terminal Commands (`bash` vs `shell`)

When writing documentation for terminal commands, write the commands cleanly so readers can copy-paste without errors:

```markdown
```bash
# Install packages
npm install express dotenv

# Run development server
npm run dev
```
```

> **Pro Tip (Omit the `$` Prompt):** Avoid writing `$ npm install` inside copyable blocks. If a user clicks a "Copy Code" button, the leading `$` will copy into their terminal and cause a command-not-found error!

---

### 4. Nesting Code Blocks Inside Code Blocks

If you are writing a Markdown tutorial *about* Markdown, how do you show a fenced code block *inside* another fenced code block?

**Rule:** Use **four backticks (````)** for the outer fence, and **three backticks (```)** for the inner fence:

```markdown
````markdown
Here is how you write JavaScript in Markdown:

```javascript
console.log("Hello, World!");
```
````
```

---

# Multiple Choice Questions

### 1. Which delimiter is most commonly used to open and close a fenced code block?
A. Triple backticks (```)
B. Triple hashes (###)
C. Triple colons (:::)
D. Triple quotes (""")
**Answer:** A
**Explanation:** Three consecutive backticks (```) at the start and end of a code block denote a fenced code block.
---

### 2. What purpose does the word immediately following the opening backticks (e.g. '```python') serve?
A. It compiles the Python script on the server
B. It acts as the language identifier for syntax-highlighting tokenizers
C. It names the computer file
D. It deletes non-Python characters
**Answer:** B
**Explanation:** The language identifier (info string) informs syntax highlighters which programming grammar rules to use for colorization.
---

### 3. Which HTML elements are produced by a fenced code block?
A. <pre><code>...</code></pre>
B. <p><script>...</script></p>
C. <textarea>...</textarea>
D. <div><span>...</span></div>
**Answer:** A
**Explanation:** Fenced code blocks compile to a <pre> (preformatted text) block containing a <code> element with a language class.
---

### 4. How can you display a 3-backtick code block example inside another code block in a tutorial?
A. Use 4 backticks (````) for the outer enclosing fence
B. You cannot show code blocks inside Markdown
C. Press Spacebar 50 times
D. Type 'nested-code'
**Answer:** A
**Explanation:** A code block can be enclosed within an outer fence that has a greater number of backticks (such as 4 backticks).
---

### 5. Why should technical writers avoid prefixing copyable shell command lines with '$ '?
A. The dollar sign is copyrighted
B. Users who click 'Copy Code' buttons will copy the '$' symbol, causing syntax errors when pasted into their terminal
C. Linux terminals will crash
D. Markdown parsers automatically convert '$' to Euro symbols
**Answer:** B
**Explanation:** Copying a leading '$' character into a command-line shell causes the shell to fail to recognize the command name.
---

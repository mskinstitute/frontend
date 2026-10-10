---
title: "Linting & Formatting with markdownlint & Prettier"
description: "Enforce consistent markdown style guides, fix heading spacing, and automate linting in CI/CD pipelines."
order: 25
course: "markdown"
slug: "linting-formatting-markdownlint-prettier"
---

When dozens of software engineers collaborate on open-source repositories or company documentation wikis, inconsistent formatting quickly creeps in: some developers use two spaces for lists, others use four; some leave blank lines around headings, others omit them; broken links and duplicate headings go unnoticed.

**markdownlint** and **Prettier** automate code style enforcement, catching errors before they reach production.

![Markdown Documentation](/images/tutorials/markdown/markdown-documentation.jpg)

---

### 1. What is markdownlint?

**markdownlint** is a static analysis tool that inspects Markdown files against a set of standardized quality rules. It is available as a VS Code extension, a Node.js CLI tool (`markdownlint-cli`), and a GitHub Action.

#### Top Common markdownlint Rules:
- **MD001 / heading-increment:** Heading levels should only increment by one level at a time (e.g., cannot jump from `#` directly to `###`).
- **MD009 / no-trailing-spaces:** Disallows unintentional trailing whitespace at the ends of lines.
- **MD013 / line-length:** Recommends wrapping lines at 80 or 120 characters for clean terminal viewing.
- **MD022 / blanks-around-headings:** Headings must be surrounded by blank lines.
- **MD025 / single-title:** A document should have only one top-level `# H1` heading.
- **MD033 / no-inline-html:** Flags raw HTML elements when strict pure-markdown compliance is desired.

---

### 2. Configuring markdownlint (`.markdownlint.json`)

You can customize or disable specific rules for your project by adding a `.markdownlint.json` configuration file in the project root:

```json
{
  "default": true,
  "MD013": false,
  "MD033": {
    "allowed_elements": ["details", "summary", "kbd", "img", "br"]
  },
  "MD024": {
    "siblings_only": true
  }
}
```

---

### 3. Formatting with Prettier

[Prettier](https://prettier.io) is an opinionated code formatter that supports Markdown and CommonMark out of the box:
- Automatically wraps lines consistently.
- Cleans up uneven list indentation.
- Formats pipe tables so columns line up neatly.

#### Running Prettier via Terminal:
```bash
# Check for formatting violations
npx prettier --check "**/*.md"

# Automatically format and fix all markdown files
npx prettier --write "**/*.md"
```

---

### 4. Automating Linting in GitHub Actions CI

Catch broken markdown automatically on every Pull Request by adding a GitHub Actions workflow:

```yaml
# .github/workflows/lint-markdown.yml
name: Lint Markdown
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run markdownlint
        uses: DavidAnson/markdownlint-cli2-action@v16
        with:
          globs: "**/*.md"
```

---

# Multiple Choice Questions

### 1. Which static analysis tool is widely used to detect style inconsistencies and syntax violations in Markdown?
A. markdownlint
B. PyLint
C. ESLint Vue
D. Stylelint CSS
**Answer:** A
**Explanation:** markdownlint is the dedicated static analysis tool for checking Markdown files against standardized style rules.
---

### 2. What does markdownlint rule 'MD001' enforce?
A. Documents must not contain numbers
B. Heading levels must only increment by one level at a time (e.g. H1 -> H2, not H1 -> H3)
C. Images must be in black and white
D. The file must end with a dot
**Answer:** B
**Explanation:** MD001 verifies that heading levels increment logically (e.g. H1 followed by H2) without skipping intermediate levels.
---

### 3. What command formats all Markdown files in a repository automatically using Prettier?
A. npx prettier --write "**/*.md"
B. npm run delete
C. git reset --hard
D. markdown-clean
**Answer:** A
**Explanation:** The --write flag instructs Prettier to automatically reformat and overwrite target files with standardized styling.
---

### 4. What configuration filename is used to customize markdownlint rules in a repository?
A. .markdownlint.json (or .markdownlint.yaml)
B. settings.exe
C. style.css
D. rules.ini
**Answer:** A
**Explanation:** .markdownlint.json or .markdownlint.yaml is placed in the project root to configure rule overrides.
---

### 5. Why is integrating markdownlint into a continuous integration (CI) pipeline beneficial?
A. It compiles Markdown into machine binary code
B. It automatically blocks pull requests that contain broken formatting, improper headings, or missing blank lines
C. It generates bitcoin cryptocurrency
D. It restarts the server every 5 minutes
**Answer:** B
**Explanation:** Running linters in CI ensures that all contributors adhere to team documentation standards before code is merged.
---

---
title: "Issue & Pull Request Templates in GitHub"
description: "Standardize open-source contributions using .github/ISSUE_TEMPLATE and PULL_REQUEST_TEMPLATE.md forms."
order: 22
course: "markdown"
slug: "issue-pull-request-templates"
---

When an open-source repository gains popularity, maintainers often receive hundreds of bug reports and feature requests. Without a structured format, users frequently submit vague bug reports like *"It crashed, please fix"*, missing critical reproduction steps, operating system details, or error logs.

GitHub solves this by allowing maintainers to define **Issue and Pull Request Templates** written in Markdown!

![Markdown Documentation](/images/tutorials/markdown/markdown-documentation.jpg)

---

### 1. Repository Directory Structure

To enable automated templates, create a hidden `.github` folder in the root of your project:

```
my-project/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
├── README.md
└── package.json
```

---

### 2. Crafting a Bug Report Template (`bug_report.md`)

When a user clicks *"New Issue"*, GitHub pre-fills the editor with your template:

```markdown
---
name: 🐛 Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: bug
assignees: ''
---

### 📝 Description
<!-- A clear and concise description of what the bug is. -->

### 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### 🎯 Expected Behavior
<!-- What you expected to happen. -->

### 💻 Environment Details
- **OS:** [e.g. Windows 11, Ubuntu 22.04, macOS Sonoma]
- **Node.js Version:** [e.g. v20.11.0]
- **Browser:** [e.g. Chrome 122, Safari 17]

### 📋 Additional Context / Screenshots
<!-- Add any error console logs or screenshots here. -->
```

---

### 3. Pull Request Template (`PULL_REQUEST_TEMPLATE.md`)

Ensures contributors verify their changes before opening a PR:

```markdown
## 📌 Description of Changes
<!-- Provide a summary of the changes introduced in this PR -->

## 🔗 Related Issue
Closes #<!-- Issue number here (e.g. Closes #42) -->

## ✅ Contributor Checklist
- [ ] My code follows the project's coding style guide.
- [ ] I have added automated unit tests covering these changes.
- [ ] All existing and new tests pass locally (`npm test`).
- [ ] I have updated the documentation where applicable.
```

---

# Multiple Choice Questions

### 1. In which directory must GitHub issue templates be placed in a repository?
A. .github/ISSUE_TEMPLATE/
B. public/templates/
C. node_modules/issues/
D. dist/bugs/
**Answer:** A
**Explanation:** GitHub looks in the .github/ISSUE_TEMPLATE/ directory for pre-configured issue markdown forms.
---

### 2. What is the standard filename for a default GitHub Pull Request template?
A. PR_RULES.txt
B. PULL_REQUEST_TEMPLATE.md
C. merge_checklist.html
D. git_push.md
**Answer:** B
**Explanation:** PULL_REQUEST_TEMPLATE.md inside .github/ automatically populates whenever a developer opens a new pull request.
---

### 3. What keyword in a PR description automatically closes an associated issue when merged (e.g. 'Closes #42')?
A. Closes or Fixes
B. Delete
C. Terminate
D. Erase
**Answer:** A
**Explanation:** GitHub recognizes closing keywords like 'Closes #42', 'Fixes #42', and 'Resolves #42' to automatically close the linked issue upon merging.
---

### 4. What purpose does YAML frontmatter serve at the top of an issue template file?
A. It styles the background in pink
B. It configures the template name, default issue title prefix, and automated labels
C. It compiles the C++ code
D. It emails the maintainer's personal phone
**Answer:** B
**Explanation:** Frontmatter at the top of an issue template defines metadata like template name, description, assigned labels, and default title prefix.
---

### 5. Why are interactive task checkboxes (- [ ]) recommended in a Pull Request template?
A. To slow down contributors
B. To create a clear quality assurance checklist that contributors must verify before requesting review
C. To turn off automated testing
D. Checkboxes are required by US copyright law
**Answer:** B
**Explanation:** A checklist helps contributors self-audit tests, documentation updates, and linting before burdening maintainers with review.
---

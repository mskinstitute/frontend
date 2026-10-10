# Inspecting Commit History with `git log` and Formatting Flags

As software evolves over months and years, inspecting historical commits becomes crucial for tracking features, conducting post-mortems on bugs, and reviewing peer contributions. The `git log` command is Git's primary time machine.

---

## 1. Basic History Inspection: `git log`

Executing `git log` lists the commits made in that repository in reverse chronological order (newest commit first):

```bash
git log
```

### Standard Output Format:
```text
commit 7b3f81e28d4c5a9b0c2d4e6f8a0b1c2d3e4f5a6b (HEAD -> main)
Author: Sumit Sharma <sumit@mskinstitute.com>
Date:   Mon Sep 15 10:30:00 2026 +0530

    feat(auth): add JWT token expiration check

commit 4a2c91d8f1e3a5b7c9d0e2f4a6b8c0d2e4f6a8b0
Author: Neha Gupta <neha@mskinstitute.com>
Date:   Sun Sep 14 16:15:22 2026 +0530

    fix(css): fix mobile navbar z-index overflow
```

> [!NOTE]
> When the log output exceeds your terminal height, Git pages the output using `less`.
> - Press **Spacebar** to scroll down one page.
> - Press **`b`** to scroll up.
> - Press **`q`** to quit and return to the command prompt.

---

## 2. Essential Power Flags for `git log`

### A. Compact Single-Line View (`--oneline`)
Condenses each commit into its short 7-character hash and commit title:
```bash
git log --oneline
```
Output:
```text
7b3f81e (HEAD -> main) feat(auth): add JWT token expiration check
4a2c91d fix(css): fix mobile navbar z-index overflow
9f1e82b docs: update project README
```

### B. Limit Output Count (`-n <number>`)
View only the last $N$ commits:
```bash
git log -n 5 --oneline
```

### C. Show Changed Files and Stats (`--stat`)
Displays the files modified, number of lines inserted (`+`), and deleted (`-`):
```bash
git log --stat -n 2
```

### D. Show Full Line-by-Line Code Patches (`-p`)
Shows the actual line diff introduced by each commit:
```bash
git log -p -n 1
```

---

## 3. Visual Branch Graph (`--graph --oneline --all`)

When multiple developers are branching and merging, visualizing the branch tree topology directly in your terminal is invaluable:

```bash
git log --graph --oneline --all --decorate
```

### Terminal Output:
```text
* 7b3f81e (HEAD -> main) Merge branch 'feature-payment'
|\  
| * 3a89e12 (feature-payment) feat: integrate Stripe checkout API
| * 2c510fa feat: add webhook listener
* | 4a2c91d fix: update landing page typography
|/  
* 9f1e82b Initial commit
```

### Pro Tip: Create an Alias for Visual Log
Save this command permanently as an alias:
```bash
git config --global alias.lg "log --graph --oneline --all --decorate"

# Now simply run:
git lg
```

---

## 4. Filtering History

Git lets you filter commit history with precision:

```bash
# 1. Filter by author
git log --author="Sumit"

# 2. Filter by date range
git log --since="2 weeks ago" --until="yesterday"

# 3. Filter by search keyword in commit messages
git log --grep="bugfix"

# 4. Filter history of a specific single file
git log -p src/utils/auth.js
```

---

## Practice Quiz

### Q1: What is the default ordering of commits displayed by `git log`?
- A) Alphabetical order by commit author
- B) Reverse chronological order (newest commits first)
- C) Chronological order (oldest commits first)
- D) Random order
**Answer:** B
**Explanation:** `git log` displays commits in reverse chronological order, showing the latest commit at the top.

### Q2: Which key allows you to exit the Git log pager and return to the terminal prompt?
- A) `Esc`
- B) `Ctrl + C`
- C) `q`
- D) `Enter`
**Answer:** C
**Explanation:** Git uses the `less` terminal pager by default; pressing `q` immediately quits the pager.

### Q3: Which flag formats the output of `git log` into a clean single-line representation per commit?
- A) `--compact`
- B) `--short`
- C) `--oneline`
- D) `--inline`
**Answer:** C
**Explanation:** `git log --oneline` shows the 7-character abbreviated commit hash followed by the commit message on a single line.

### Q4: Which combination of flags renders an ASCII graphical tree of all branches and merge topologies in the terminal?
- A) `git log --tree`
- B) `git log --graph --oneline --all`
- C) `git log --visual`
- D) `git log --branches`
**Answer:** B
**Explanation:** `--graph` draws ASCII branch and merge lines, `--oneline` keeps entries compact, and `--all` includes commits across all branches.

### Q5: How can you view the commit history for changes that specifically affected only `src/db.js`?
- A) `git log src/db.js`
- B) `git show src/db.js`
- C) `git inspect src/db.js`
- D) `git track src/db.js`
**Answer:** A
**Explanation:** Passing a file path to `git log` (e.g., `git log src/db.js`) filters history to display only commits that modified that specific file.

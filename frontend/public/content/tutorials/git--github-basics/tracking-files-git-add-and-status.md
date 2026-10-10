# Tracking Changes: `git status` and Staging with `git add`

In Git, files do not automatically jump from your text editor into the permanent commit history. You must explicitly inspect your changes using `git status` and stage them using `git add`. This deliberate workflow gives you total control over what enters your project history.

---

## 1. Checking Status with `git status`

The `git status` command displays the exact state of your working directory and staging area relative to your last commit:

```bash
git status
```

### Understanding Status Outputs:
When you run `git status`, Git categorizes files into three distinct sections:

1. **Changes to be committed (Staged)**: Files added to the staging area with `git add`, ready for the next commit.
2. **Changes not staged for commit (Modified)**: Tracked files that have been edited on disk, but not yet staged.
3. **Untracked files**: Brand new files that have never been committed or staged before.

### Example Terminal Output:
```text
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   src/auth.js

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   package.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	notes.txt
```

### Pro Tip: Compact Short Status (`-s` or `--short`)
```bash
git status -s
```
Output flags:
- `??` : Untracked file
- ` M` (space then M in red) : Modified in working tree, not staged
- `M ` (green M then space) : Staged and ready to commit
- `MM` : Staged, but modified *again* in working directory after staging!

---

## 2. Staging Changes with `git add`

The `git add` command copies changes from the Working Directory into the Staging Area (The Index):

### Common `git add` Variations:

```bash
# 1. Stage a single specific file
git add index.html

# 2. Stage multiple files explicitly
git add app.js styles.css src/components/Header.jsx

# 3. Stage all files in a specific folder
git add src/api/

# 4. Stage ALL modified, deleted, and untracked files across the entire repo
git add .
# Or equivalently:
git add -A
```

> [!WARNING]
> Blindly running `git add .` without checking `git status` first is dangerous! You risk accidentally staging sensitive environment files (`.env`), database passwords, or bloated dependencies (`node_modules`). Always review `git status` first.

---

## 3. Advanced Staging: Interactive Patch Staging (`git add -p`)

What if you made 20 lines of changes in `app.js`, but 10 lines belong to a bug fix and 10 lines belong to an unfinished new feature?
You can stage individual "hunks" (chunks) interactively using the patch flag:

```bash
git add -p app.js
```

Git will display each modified chunk and prompt:
- `y` : stage this hunk
- `n` : do not stage this hunk
- `s` : split this hunk into smaller pieces
- `q` : quit interactive staging

---

## 4. Unstaging Files (`git restore --staged`)

If you accidentally staged a file that shouldn't be in the commit:
```bash
# Unstage file (moves it back from Staging Area to Modified in Working Tree)
git restore --staged unwanted_file.js

# Legacy syntax (older Git versions < 2.23):
git reset HEAD unwanted_file.js
```

---

## Practice Quiz

### Q1: What information is provided by running `git status`?
- A) A list of all remote internet connections
- B) The state of the working directory and staging area, highlighting untracked, modified, and staged files
- C) The entire commit history of the Linux kernel
- D) The operating system CPU usage
**Answer:** B
**Explanation:** `git status` shows the currently active branch and inspects which files are untracked, modified, or staged ready for commit.

### Q2: What does the command `git add .` do?
- A) Adds a new user to the repository
- B) Stages all new, modified, and deleted files in the current directory and its subdirectories
- C) Deletes all files in the current folder
- D) Commits changes directly to GitHub
**Answer:** B
**Explanation:** `git add .` recursively adds all changes (new, modified, and deleted) within the current directory to the staging index.

### Q3: In `git status -s` (short status), what does a green `M` on the left followed by a space mean?
- A) The file has merge conflicts
- B) The file has been modified and staged in the index
- C) The file has been deleted from disk
- D) The file is ignored by `.gitignore`
**Answer:** B
**Explanation:** In short status, the first column represents the staging area (index) and the second column represents the working tree. A green `M` in the first column means staged changes.

### Q4: Which command allows you to interactively review and stage individual hunks (parts) of a modified file?
- A) `git add -f`
- B) `git add -p` (or `--patch`)
- C) `git commit --amend`
- D) `git status --all`
**Answer:** B
**Explanation:** `git add -p` (patch) opens an interactive prompt allowing developers to stage parts of a file hunk-by-hunk.

### Q5: How do you safely remove a file from the staging area without losing the changes on your disk?
- A) `rm filename`
- B) `git restore --staged filename`
- C) `git clean -f`
- D) `git delete`
**Answer:** B
**Explanation:** `git restore --staged <file>` removes the file from the staging index while keeping the edits intact in your working directory.

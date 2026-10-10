# Shelving Changes Temporarily with `git stash` (save, pop, apply, drop)

Software development is full of interruptions: you are deep in the middle of writing an unfinished feature when an urgent production bug alert arrives. Your current code is broken and half-written—you can't commit it, but you also can't lose it. The `git stash` command is your temporary clipboard.

---

## 1. How Git Stash Works

`git stash` takes the dirty state of your working directory (all modified tracked files and staged changes) and saves it onto an internal stack of unfinished changes, returning your working directory to a clean `HEAD` state!

```
[ Working Directory: Broken, half-finished code ]
                     |
                 git stash
                     |
                     v
[ Stash Stack ] <------------------ [ Clean Working Directory ]
  stash@{0}: WIP on feature-cart    (Ready to switch branches & fix bug!)
```

---

## 2. Core Stash Commands

### A. Stashing Your Changes
```bash
# Quick stash
git stash

# Stash with a descriptive message (Recommended!)
git stash push -m "WIP: half-implemented payment modal"
```

### B. Including Untracked Files (`-u`)
By default, `git stash` only stashes **tracked** files. If you created brand new files that haven't been committed before, add the `-u` (or `--include-untracked`) flag:
```bash
git stash -u
```

---

## 3. Inspecting and Restoring Stashes

### A. View All Saved Stashes (`git stash list`)
```bash
git stash list
```
Output:
```text
stash@{0}: On feature-cart: WIP: half-implemented payment modal
stash@{1}: On main: WIP: temporary database connection string
```

### B. Restoring Changes: `git stash pop` vs. `git stash apply`

| Command | Restores Changes to Working Tree? | Removes Stash from Stack? |
|---|---|---|
| **`git stash pop`** | **Yes** | **Yes** (deletes the stash item if no conflicts occur) |
| **`git stash apply`** | **Yes** | **No** (leaves the stash on the stack so you can reuse it elsewhere) |

```bash
# Apply most recent stash and remove it from stack
git stash pop

# Apply a specific older stash by index without removing it
git stash apply stash@{1}
```

---

## 4. Cleaning Up Stashes

Stashes accumulate over time and consume disk space. Clean them up regularly:

```bash
# 1. Drop a specific stash from the stack
git stash drop stash@{0}

# 2. Clear ALL stashes completely (irreversible!)
git stash clear
```

---

## 5. Typical Real-World Scenario

1. Working on `feature-redesign`, edited 3 files. Code doesn't compile yet.
2. Manager asks for urgent hotfix on `main`.
3. You stash: `git stash push -m "WIP redesign"`.
4. Switch to main: `git switch main`.
5. Fix bug, commit, and push: `git commit -am "fix: hotfix security header"` -> `git push`.
6. Switch back: `git switch feature-redesign`.
7. Restore your work: `git stash pop`.
8. Continue coding right where you left off!

---

## Practice Quiz

### Q1: What does `git stash` do?
- A) Permanently deletes all modified files
- B) Shelves all uncommitted modifications onto an internal stack, restoring a clean working directory
- C) Commits code directly to production servers
- D) Clones a repository from GitHub
**Answer:** B
**Explanation:** `git stash` saves uncommitted local changes on a temporary stack so you can work on a clean tree without losing your work in progress.

### Q2: Why does `git stash` ignore newly created untracked files by default?
- A) Untracked files are encrypted
- B) Standard stash only captures files already tracked in Git's index unless `-u` (`--include-untracked`) is passed
- C) New files cannot be saved in Git
- D) It is a bug in Git
**Answer:** B
**Explanation:** By default, `git stash` only stores modifications to tracked files. To include untracked files, you must use `git stash -u`.

### Q3: What is the primary difference between `git stash pop` and `git stash apply`?
- A) `pop` creates a branch; `apply` does not
- B) `pop` restores the changes and deletes the stash from the stack; `apply` restores the changes but keeps the stash on the stack
- C) `apply` only works on macOS
- D) `pop` requires an internet connection
**Answer:** B
**Explanation:** `git stash pop` applies the stash and removes it from the stash stack, whereas `git stash apply` keeps the stash saved for potential reuse.

### Q4: Which command lists all stashes currently stored in the repository?
- A) `git stash list`
- B) `git stash show --all`
- C) `git log --stash`
- D) `git status --stash`
**Answer:** A
**Explanation:** `git stash list` prints all stashed states along with their indices (e.g. `stash@{0}`) and descriptions.

### Q5: How can you discard and delete all stashed entries from your repository completely?
- A) `git stash drop --all`
- B) `git stash clear`
- C) `git stash erase`
- D) `git rm stash`
**Answer:** B
**Explanation:** `git stash clear` wipes all stashed entries from the stack permanently.

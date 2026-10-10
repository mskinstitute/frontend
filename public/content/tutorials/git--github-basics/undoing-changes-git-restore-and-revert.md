# Undoing Changes Safely: `git restore`, `git reset`, and `git revert`

Making mistakes is an inevitable part of programming. Git's greatest strength is its ability to undo almost any action. However, because different undo commands have vastly different consequences, understanding when to use `git restore`, `git reset`, or `git revert` is critical to avoiding accidental data loss.

---

## 1. Decision Matrix: Which Undo Command Should You Use?

```
What do you want to undo?
|
+---> 1. Unstaged changes in Working Directory? ---------> `git restore <file>`
|
+---> 2. Staged changes in Index? -----------------------> `git restore --staged <file>`
|
+---> 3. Local unpushed commit(s) on your machine? ------> `git reset` (soft / mixed / hard)
|
+---> 4. Commit already pushed to a shared remote repo? -> `git revert <commit-hash>`
```

---

## 2. Modern Undoing in the Working Tree: `git restore`

Introduced in Git 2.23, `git restore` is designed for safety:

```bash
# 1. Discard uncommitted changes in a specific file (IRREVERSIBLE!)
git restore index.html

# 2. Discard all uncommitted changes across entire working tree
git restore .

# 3. Unstage a file (moves it out of Staging Area back to modified in working tree)
git restore --staged package.json
```

---

## 3. Rewinding Local History: `git reset`

`git reset` moves the current branch pointer backward in time. It has three distinct modes:

```
            (C1) <--- (C2) <--- (C3) [HEAD, main]
                        ^
                        |
            Command: git reset HEAD~1
```

### The Three Modes of `git reset`:

| Mode | Moves Branch Pointer Back? | Keeps Changes in Staging Area? | Keeps Changes in Working Directory? | Safety Level |
|---|:---:|:---:|:---:|:---:|
| **`--soft`** | **Yes** | **Yes** (Staged) | **Yes** | Completely Safe |
| **`--mixed`** (default) | **Yes** | **No** (Unstaged) | **Yes** | Safe |
| **`--hard`** | **Yes** | **No** | **No** (Destroyed!) | **DANGEROUS!** |

### Practical Examples:
```bash
# Undo the last commit, but KEEP all modified files staged in index:
git reset --soft HEAD~1

# Undo the last commit and unstage files, but keep edits on disk in working tree:
git reset HEAD~1

# Completely obliterate the last commit and wipe out all local file modifications:
git reset --hard HEAD~1
```

> [!CAUTION]
> `git reset --hard` permanently discards uncommitted work in your working tree. There is no undo for uncommitted files lost to `--hard`!

---

## 4. The Collaborative Safe Undo: `git revert`

> [!IMPORTANT]
> **Golden Rule of Git**: Never use `git reset` on commits that have already been pushed to a shared public branch (like `main`)! Resetting rewrites history and breaks other developers' clones.

Instead, use **`git revert`**:
- `git revert` does **not** erase the bad commit from history.
- Instead, it creates a **brand new commit** that introduces the exact opposite mathematical inverse of the bad commit!

```
Before Revert:
(C1) ---> (C2: Introduced payment bug) ---> (C3) [main, origin/main]

Command: git revert C2

After Revert:
(C1) ---> (C2: Bug) ---> (C3) ---> (C4: Revert "Introduced payment bug") [main]
```

Because history is purely additive, `git revert` is 100% safe for pushed production branches.

---

## Practice Quiz

### Q1: Which command safely discards uncommitted changes in `app.js` in your working directory?
- A) `git restore app.js`
- B) `git clean app.js`
- C) `git undo app.js`
- D) `git delete app.js`
**Answer:** A
**Explanation:** `git restore <file>` discards local uncommitted changes in the specified file, reverting it to the state in the staging area or latest commit.

### Q2: What is the effect of running `git reset --soft HEAD~1`?
- A) Deletes the repository
- B) Moves the branch pointer back 1 commit, keeping all changed files staged in the index ready to re-commit
- C) Discards all work on disk
- D) Force-pushes to GitHub
**Answer:** B
**Explanation:** `git reset --soft` rolls back the commit object while leaving all the changed code safely staged in the index.

### Q3: Why is `git reset --hard` considered a dangerous command?
- A) It costs money
- B) It permanently destroys all uncommitted changes in the working directory without any way to recover them
- C) It causes hardware failure
- D) It revokes your GitHub token
**Answer:** B
**Explanation:** `--hard` resets both the staging index and the working directory, discarding uncommitted file edits irretrievably.

### Q4: If a buggy commit has already been pushed to a shared team branch on GitHub, what is the best command to undo it?
- A) `git reset --hard`
- B) `git revert <commit-hash>`
- C) `git delete --remote`
- D) `git init`
**Answer:** B
**Explanation:** `git revert` creates a new forward commit that reverses the changes of the target commit, preserving unbroken linear history for teammates.

### Q5: What does `git restore --staged <file>` do?
- A) Deletes the file permanently from the hard drive
- B) Unstages the file from the index while preserving the modifications on disk in the working tree
- C) Commits the file with an empty message
- D) Replaces the file with a blank text file
**Answer:** B
**Explanation:** `git restore --staged` removes changes from the staging area without affecting the actual code on disk in your working tree.

# Recording Snapshots: `git commit` and Semantic Commit Messages

Once you have staged your desired changes, the next step is to record them permanently in the repository object database using `git commit`. A commit represents a cryptographic snapshot of your project at a specific instant in time.

---

## 1. How `git commit` Works

When you commit, Git:
1. Takes the files currently in the **Staging Area (Index)**.
2. Creates a tree object representing the directory structure.
3. Packages author metadata, committer timestamp, commit message, and pointers to parent commits into a **Commit Object**.
4. Computes the 40-character SHA-1 hash for this commit.
5. Advances the current branch pointer (and `HEAD`) to point to the new commit.

```
Commit Object Hierarchy:
+-------------------------------------------------------------+
| Commit Hash: 7b3f81e...                                     |
| Author: Sumit Sharma <sumit@mskinstitute.com>               |
| Date:   Mon Sep 15 10:30:00 2026 +0530                      |
| Parent: 4a2c91d...                                          |
| Message: feat(auth): add JWT token expiration check         |
| Tree:   9f1e82b...  --> [ Blobs & sub-trees for all files ] |
+-------------------------------------------------------------+
```

---

## 2. Basic Commit Commands

### A. Committing with an Inline Message (`-m`)
The most common everyday command:
```bash
git commit -m "Add responsive navigation bar for mobile screens"
```

### B. Committing via Text Editor (Multi-line Commits)
Omitting the `-m` flag opens your configured editor (VS Code, Nano, Vim) to write a detailed multi-line message:
```bash
git commit
```

### C. The Shortcut: Stage Tracked Files & Commit (`-am`)
If files are **already tracked** (previously committed) and you simply edited them:
```bash
# Automatically stages all tracked modified files AND commits in one shot
git commit -am "fix: correct typo in checkout pricing calculation"
```
> [!CAUTION]
> `-a` only stages modified tracked files! It will **not** stage newly created (untracked) files.

---

## 3. Amending the Last Commit (`git commit --amend`)

Have you ever committed, only to realize 5 seconds later that you forgot to include one file, or made a spelling mistake in your commit message?
Instead of creating a messy follow-up commit like *"oops forgot this file"*, you can amend the most recent commit:

```bash
# 1. Stage the forgotten file
git add forgotten_file.css

# 2. Amend the previous commit without changing the message
git commit --amend --no-edit

# Or amend both code and update the commit message:
git commit --amend -m "feat: complete navbar styling with mobile drawer"
```

> [!WARNING]
> Only amend commits that exist purely on your local machine! Never amend or rewrite commits that have already been pushed to a shared remote branch on GitHub.

---

## 4. Professional Semantic Commit Conventions (Conventional Commits)

Top engineering teams (and open-source projects) adhere to the **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Common Standard Types:
| Type | Purpose | Example |
|---|---|---|
| **`feat`** | A brand new feature for the user | `feat(auth): support Google OAuth login` |
| **`fix`** | A bug fix | `fix(cart): prevent negative discount calculation` |
| **`docs`** | Documentation changes only | `docs(readme): update deployment instructions` |
| **`style`** | Formatting, missing semi-colons, whitespace | `style(css): reorder media queries with prettier` |
| **`refactor`** | Code restructure that neither fixes bugs nor adds features | `refactor(db): extract connection pool singleton` |
| **`perf`** | Code change that improves performance | `perf(search): debounce live search input by 300ms` |
| **`test`** | Adding or correcting unit/integration tests | `test(auth): add unit test for expired JWT token` |
| **`chore`** | Build system, dependency updates, tooling | `chore(deps): bump tailwindcss to v4.0` |

---

## Practice Quiz

### Q1: What is a Git commit?
- A) A temporary backup that expires after 24 hours
- B) A permanent, immutable snapshot of the staged files along with author, timestamp, and message
- C) An automated upload to an AWS S3 bucket
- D) A pull request on GitHub
**Answer:** B
**Explanation:** A commit is a permanent snapshot of the staged index recorded into Git's object database with author metadata, parent references, and a commit message.

### Q2: What does the command `git commit -m "message"` do?
- A) Staged and unstaged files are committed simultaneously
- B) All files currently in the Staging Area are recorded into a new commit with the specified message
- C) Pushes code directly to production servers
- D) Modifies user email settings
**Answer:** B
**Explanation:** `git commit -m "message"` creates a new commit snapshot from the staged changes using the message provided.

### Q3: What is the limitation of using `git commit -am "message"`?
- A) It can only be executed once per day
- B) It does not automatically stage brand new (untracked) files
- C) It deletes deleted files permanently from disk
- D) It only works on Linux
**Answer:** B
**Explanation:** The `-a` flag automatically stages modified and deleted *tracked* files, but completely ignores untracked files.

### Q4: When is it safe to use `git commit --amend`?
- A) Whenever you want, especially on public shared branches
- B) Only on local commits that have not yet been pushed to a shared remote repository
- C) Only when GitHub is offline
- D) Only on Monday mornings
**Answer:** B
**Explanation:** Amending replaces the commit hash, rewriting history. It is safe for local, unpushed commits, but dangerous on shared public branches.

### Q5: In Conventional Commits, which type is appropriate for a commit that updates third-party npm or pip dependencies?
- A) `feat`
- B) `fix`
- C) `chore`
- D) `perf`
**Answer:** C
**Explanation:** `chore` is used for routine maintenance tasks, tooling configurations, and dependency updates that do not alter production source features or fix bugs.

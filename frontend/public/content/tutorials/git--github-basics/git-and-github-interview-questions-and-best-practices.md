# Git & GitHub Interview Master Blueprint: Top Questions & Industry Best Practices

Version control proficiency is tested in almost every technical interview for frontend, backend, data science, and DevOps engineering roles. Interviewers assess whether you understand Git's underlying mental model or merely memorize recipes.

---

## 1. Top 10 High-Frequency Technical Interview Questions

### Q1: What is the difference between `git merge` and `git rebase`?
- **Answer**: Both integrate changes from one branch into another. `git merge` preserves complete historical context by generating a non-destructive three-way merge commit with two parents. `git rebase` rewrites history by re-playing your commits linearly on top of the target base branch, resulting in a cleaner, flatter commit history without merge commits.
- **Follow-up**: *When should you NOT rebase?* Never rebase public shared branches because rewrites invalidate collaborators' base commit hashes.

### Q2: What is the difference between `git reset` and `git revert`?
- **Answer**: `git reset` moves the current branch pointer backward, effectively erasing commits from the active branch history (dangerous on shared remote branches). `git revert` creates a brand new forward commit that applies the mathematical inverse of a previous commit, leaving historical timeline intact (safe for shared branches).

### Q3: What is the difference between `git fetch` and `git pull`?
- **Answer**: `git fetch` downloads remote commits, branches, and tags into local memory (`origin/main`) without altering the working directory. `git pull` runs `git fetch` followed immediately by `git merge`, incorporating changes directly into your active working branch.

### Q4: Explain Git's internal object model.
- **Answer**: Git is a content-addressable key-value store with four fundamental objects:
  1. **Blob**: Raw compressed file data without filename or permissions.
  2. **Tree**: Represents a directory, linking filenames and file permissions to blob hashes and subtrees.
  3. **Commit**: Contains a pointer to a top-level tree, parent commit hashes, author/committer metadata, timestamp, and message.
  4. **Tag**: An annotated pointer to a specific commit object with tagger metadata.

### Q5: What is "Detached HEAD" state and how do you fix it?
- **Answer**: A detached HEAD occurs when `HEAD` points directly to an individual commit hash rather than to a named branch pointer (e.g. after running `git checkout <commit-hash>`). Any commits made in this state are orphans and will be garbage collected if you switch away.
- **Fix**: To preserve work made in detached HEAD, create a branch at the current commit:
  ```bash
  git switch -c new-branch-name
  ```

---

## 2. Essential Industry Best Practices Checklist

| Category | Best Practice Rule | Why It Matters |
|---|---|---|
| **Commits** | Make atomic, single-purpose commits | Makes reverts trivial and git bisect debugging painless |
| **Messages** | Follow Conventional Commits (`feat:`, `fix:`) | Enables automated changelog generation and semantic versioning |
| **Security** | Never commit `.env` or API credentials | Prevents critical security leaks and data breaches |
| **Branching** | Protect `main` with PR reviews and CI tests | Guarantees production stability and team code review standards |
| **Hygiene** | Delete merged feature branches promptly | Keeps local and remote repository lists clean and manageable |
| **Discipline** | Always `git status` and `git diff` before `git add` | Prevents accidental commits of temporary test code or logs |

---

## 3. Rescue Operations: The Git Emergency Toolkit

### Accidentally Deleted a Branch or Lost Commits?
Git rarely deletes data immediately! Commits are preserved for at least 30 days in the **Reflog**:
```bash
# 1. Inspect recent HEAD movements
git reflog

# 2. Recover the lost commit hash
git switch -c recovered-branch 7b3f81e
```

### Accidentally Committed to the Wrong Branch?
```bash
# 1. Undo commit from wrong branch, keeping changes staged
git reset --soft HEAD~1

# 2. Switch to the correct branch
git switch correct-branch

# 3. Commit there!
git commit -m "feat: commit on correct branch"
```

---

## Practice Quiz

### Q1: What is the purpose of `git reflog`?
- A) It formats JavaScript files
- B) It records a local journal of every time `HEAD` moved (commits, checkouts, rebases), allowing recovery of "lost" or deleted commits
- C) It connects to remote cloud servers
- D) It deletes untracked files
**Answer:** B
**Explanation:** `git reflog` tracks every change of `HEAD` on your local machine, serving as a safety net to rescue discarded or rebased commits.

### Q2: What does it mean when Git is in a "Detached HEAD" state?
- A) The repository is corrupt
- B) `HEAD` points directly to a commit hash instead of a named branch reference
- C) The CPU has overheated
- D) GitHub blocked your account
**Answer:** B
**Explanation:** Detached HEAD means you are viewing a specific commit directly rather than through a named branch reference pointer.

### Q3: Which command creates and switches to a new branch preserving commits made while in a Detached HEAD state?
- A) `git switch -c <new-branch-name>`
- B) `git stash drop`
- C) `git reset --hard`
- D) `git clean -fd`
**Answer:** A
**Explanation:** Running `git switch -c <name>` attaches a new branch pointer to your current commit, safely anchoring your detached work.

### Q4: In an interview, what is the best explanation of what Git blobs store?
- A) Full filenames, folder hierarchies, and permissions
- B) The raw compressed content of files, without filename or metadata
- C) The names of commit authors
- D) CSS stylesheet rules
**Answer:** B
**Explanation:** Blobs (Binary Large Objects) in Git store solely the raw compressed contents of files. The filename and directory paths are stored in Tree objects.

### Q5: Why are atomic commits considered a software engineering best practice?
- A) They run faster on multicore CPUs
- B) Each commit accomplishes one logical unit of work, making code review straightforward and allowing individual bugfixes to be reverted without breaking unrelated features
- C) They reduce internet bandwidth
- D) They eliminate the need for QA testing
**Answer:** B
**Explanation:** Atomic commits encapsulate a single, complete logical change. If that specific change causes an issue later, it can be reverted cleanly without impacting other features.

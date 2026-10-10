# Merging Branches: Fast-Forward vs Three-Way Merges (`git merge`)

Once work on an isolated feature branch is completed and tested, it must be integrated back into the main project trunk. The process of combining disparate lines of development is called **merging** (`git merge`).

---

## 1. How Merging Works

To merge branch `B` into branch `A`:
1. You must first switch into the receiving branch (`A`).
2. Run `git merge B`.

```bash
# 1. Switch to destination branch
git switch main

# 2. Merge the feature branch into main
git merge feature-login
```

Depending on the commit history structure, Git automatically chooses between two merging strategies: **Fast-Forward Merge** or **Three-Way Merge**.

---

## 2. Strategy 1: Fast-Forward Merge

A Fast-Forward merge occurs when there is a direct linear path from the current branch tip to the incoming feature branch tip. In other words, **no new commits were made on `main`** while the feature branch was being developed!

```
Before Fast-Forward Merge:
(C1) <--- (C2) [main, HEAD]
            \
             (C3) <--- (C4) [feature-login]

Command: git switch main && git merge feature-login

After Fast-Forward Merge:
(C1) <--- (C2) <--- (C3) <--- (C4) [feature-login, main, HEAD]
```

### Key Properties of Fast-Forward:
- No merge commit is created.
- Git simply moves the `[main]` pointer forward along the commit chain to `C4`.
- Fast, clean, and creates zero overhead.

### Forcing a Merge Commit (`--no-ff`):
Some teams prefer to preserve explicit historical evidence that a branch existed:
```bash
git merge --no-ff feature-login
```

---

## 3. Strategy 2: Three-Way Merge (Recursive / Ort)

A Three-Way Merge occurs when both branches have diverged: commits were made on `main` AND commits were made on `feature-login` at the same time:

```
Diverged History Before Merge:
             (C3) <--- (C4) [feature-login]
            /
(C1) <--- (C2) [Common Ancestor Base]
            \
             (C5) <--- (C6) [main, HEAD]
```

### Why is it called "Three-Way"?
Git uses three distinct snapshots to calculate the merged result:
1. **The Common Ancestor Commit (`C2`)**: The point where the two branches split.
2. **The Current Branch Tip (`C6` - `main`)**.
3. **The Incoming Branch Tip (`C4` - `feature-login`)**.

By comparing both branch tips against their common base, Git can automatically deduce what each developer intended to change:
- If a line was changed only in `feature-login` and untouched on `main`, Git applies the feature change.
- If a line was changed only on `main` and untouched in `feature-login`, Git preserves the `main` change.

```
After Three-Way Merge:
             (C3) <--- (C4) [feature-login]
            /              \
(C1) <--- (C2)              (C7) [Merge Commit! main, HEAD]
            \              /
             (C5) <--- (C6)
```

Git generates a brand new **Merge Commit (`C7`)** that uniquely has **two parents** (`C4` and `C6`).

---

## 4. Summary: Merge Types Comparison

| Aspect | Fast-Forward Merge | Three-Way Merge (`ort`/`recursive`) |
|---|---|---|
| **Branch Topology** | Linear (no divergence) | Divergent (both branches advanced) |
| **New Commit Created?** | No (pointer moves forward) | Yes (a dedicated merge commit with 2 parents) |
| **Commit Message** | Reuses existing feature commit | Automatically prompts for merge commit message |
| **Conflict Potential** | Low / None | Possible if same lines were edited concurrently |

---

## Practice Quiz

### Q1: What must you do before running `git merge feature-payment`?
- A) Delete the feature branch
- B) Checkout (switch to) the target receiving branch (e.g. `main`)
- C) Push all code to GitHub
- D) Restart your terminal
**Answer:** B
**Explanation:** `git merge <source>` merges the specified source branch into the branch you are *currently* on. You must be on the receiving branch.

### Q2: When does Git perform a Fast-Forward merge?
- A) When the project contains fewer than 10 files
- B) When the target branch has not advanced (no new commits) since the feature branch was created
- C) Whenever an internet connection is faster than 100 Mbps
- D) When the user specifies `--fast`
**Answer:** B
**Explanation:** A fast-forward merge occurs when the destination branch's commit is a direct ancestor of the feature branch, allowing Git to simply move the pointer forward.

### Q3: What unique property distinguishes a Merge Commit resulting from a three-way merge?
- A) It has no commit hash
- B) It has two parent commits
- C) It cannot be viewed with `git log`
- D) It deletes the feature branch automatically
**Answer:** B
**Explanation:** A merge commit connects two divergent branches and therefore has two parent commits (the heads of both merged branches).

### Q4: Which flag forces Git to generate a dedicated merge commit even if a fast-forward merge was possible?
- A) `--force-commit`
- B) `--no-ff`
- C) `--merge-always`
- D) `--record-all`
**Answer:** B
**Explanation:** `--no-ff` (no fast-forward) tells Git to always create a merge commit object, retaining visual branch boundaries in git history.

### Q5: In a three-way merge, which three snapshots are evaluated to determine the merge result?
- A) Yesterday's commit, today's commit, tomorrow's commit
- B) The Common Ancestor commit, Current Branch tip (`HEAD`), and Incoming Branch tip
- C) Staging area, Working tree, and GitHub remote
- D) Three random commits chosen by Git
**Answer:** B
**Explanation:** Git calculates the merge by evaluating the Common Ancestor (where branches diverged), the current branch tip, and the incoming branch tip.

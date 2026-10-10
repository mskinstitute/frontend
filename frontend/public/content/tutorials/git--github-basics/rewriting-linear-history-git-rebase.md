# Rebasing Branches: Linear History with `git rebase` vs `git merge`

In team development, branches inevitably diverge. While `git merge` combines branches by generating a two-parent merge commit, Git provides an alternative approach called **`git rebase`**. Rebasing rewrites history to create a clean, completely linear commit timeline.

---

## 1. The Core Concept: Re-basing Your Commits

Consider two diverging branches:
```
Base Branch (main):     (C1) ---> (C2) -------------> (C3) ---> (C4) [main]
                                    \
Feature Branch:                      (C5) ---> (C6) [feature-search]
```

### If You Use `git merge`:
Merging creates a merge commit tying `C4` and `C6` together, preserving the branching knot.

### If You Use `git rebase`:
"Rebase" literally means: **take the base of my branch and change it to a new base commit!**
Git:
1. Temporarily shelves commits `C5` and `C6` as diff patches.
2. Fast-forwards `feature-search` to the tip of `main` (`C4`).
3. Re-applies the patches `C5` and `C6` one by one on top of `C4` as **brand new commits** (`C5'` and `C6'` with new hashes!).

```
After `git rebase main`:
(C1) ---> (C2) ---> (C3) ---> (C4) [main] ---> (C5') ---> (C6') [feature-search]
```

The resulting history is completely flat and linear, as if you started developing your feature today!

---

## 2. How to Rebase in Practice

```bash
# 1. Switch to the feature branch you want to rebase
git switch feature-search

# 2. Rebase onto main
git rebase main
```

### Resolving Conflicts During Rebase:
If a conflict occurs while applying `C5'`:
1. Git halts and displays the conflict markers in the file.
2. Edit the file, remove the conflict markers, and stage: `git add <file>`.
3. > [!IMPORTANT]
   **Do NOT run `git commit`!** Instead, continue the rebase:
   ```bash
   git rebase --continue
   ```
4. If you want to abort the rebase and return to where you started:
   ```bash
   git rebase --abort
   ```

---

## 3. Interactive Rebasing: Polishing Commits (`git rebase -i`)

Before submitting a Pull Request, you might have several messy commits:
- *"wip"*
- *"fixed typo"*
- *"forgot semicolon"*
- *"actual feature"*

Interactive rebase lets you clean, reorder, and squash them into professional commits:

```bash
# Interactively rebase the last 4 commits
git rebase -i HEAD~4
```

Git opens an editor showing:
```text
pick 3a89e12 feat: add search input component
pick 4b91e23 wip: test debounce
pick 7c10d34 fix typo in search handler
pick 9f20e45 style: align search dropdown
```

### Common Interactive Commands:
- **`pick`**: Keep the commit as is.
- **`reword`**: Keep the commit, but edit the commit message.
- **`edit`**: Pause to amend files within this commit.
- **`squash` (or `s`)**: Melds this commit into the previous commit, combining messages!
- **`drop` (or `d`)**: Completely deletes the commit!

---

## 4. The Golden Rule of Rebasing

> [!CAUTION]
> **The Golden Rule of Rebase**: Never rebase a branch that has been pushed to a public, shared repository (like `main`)!
> Rebasing changes commit hashes. If teammates have branched off those commits, rebasing creates duplicate conflicting histories that cause chaos. Only rebase your own private local feature branches.

---

## Practice Quiz

### Q1: What is the primary visual difference between a history merged with `git merge` vs `git rebase`?
- A) Rebasing creates a flat, linear commit history without merge commits; merging preserves branch divergence with merge commits
- B) Rebasing deletes the source code
- C) Merging works offline, but rebasing requires cloud servers
- D) Rebasing can only run on Sundays
**Answer:** A
**Explanation:** `git rebase` re-applies commits on top of another base, resulting in a single linear sequence of commits with no merge knots.

### Q2: What happens to the commit hashes of commits that are rebased?
- A) They remain 100% identical
- B) They are assigned brand new SHA-1 hashes because their parent commit and timestamps have changed
- C) They become text letters only
- D) They are erased
**Answer:** B
**Explanation:** Because a commit hash is computed from its contents, author date, and parent commit, rebasing onto a new parent produces brand new commit hashes.

### Q3: During an active rebase with conflicts, after resolving conflict markers and staging files, what command should you run?
- A) `git commit -m "resolved"`
- B) `git rebase --continue`
- C) `git merge --finish`
- D) `git push --force`
**Answer:** B
**Explanation:** During a rebase, you run `git rebase --continue` to apply the next shelved patch. Running `git commit` disrupts the rebase loop.

### Q4: What does the `squash` (or `s`) command do inside an interactive rebase (`git rebase -i`)?
- A) Deletes the branch
- B) Combines the selected commit into the previous commit above it
- C) Compresses all JPEG files in the repo
- D) Closes an issue on GitHub
**Answer:** B
**Explanation:** In interactive rebase, `squash` merges the changes of a commit into its predecessor, allowing you to combine several messy commits into one cohesive commit.

### Q5: Why must developers never rebase public shared branches like `main`?
- A) It deletes the GitHub account
- B) Rebasing rewrites commit history, which diverges from teammates' local repositories and leads to severe merge conflicts
- C) It is blocked by Git hardware
- D) It converts Python files into C++
**Answer:** B
**Explanation:** Rewriting public history invalidates other developers' base commits, forcing them to painfully reconcile duplicate diverging histories.

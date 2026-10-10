# Switching Branches with `git switch` and `git checkout -b`

Creating branches is only half the battle; navigating between them is an everyday developer reflex. Over Git's history, the command for switching branches has evolved to be safer and more intuitive.

---

## 1. The Modern Command: `git switch`

Historically, the `git checkout` command was used for both switching branches AND discarding file changes. Because this dual role caused confusion and accidental data loss, Git 2.23 introduced two dedicated commands:
- **`git switch`**: Exclusively for switching and creating branches.
- **`git restore`**: Exclusively for discarding or un-staging file changes.

### Switching Between Existing Branches:
```bash
# Switch to an existing local branch named 'dev'
git switch dev
```
Terminal output:
```text
Switched to branch 'dev'
Your branch is up to date with 'origin/dev'.
```

### Creating and Switching in One Step (`-c` flag):
To create a brand new branch and immediately switch `HEAD` to it:
```bash
git switch -c feature-user-profile
```
Terminal output:
```text
Switched to a new branch 'feature-user-profile'
```

### Switch Back to the Previous Branch (`-`):
Just like `cd -` in terminal shells, you can instantly hop back to whatever branch you were on previously:
```bash
git switch -
```

---

## 2. The Traditional Command: `git checkout`

Because millions of tutorials, StackOverflow answers, and CI/CD pipelines use `git checkout`, every developer must know its syntax:

```bash
# Switch to an existing branch
git checkout main

# Create and immediately switch to a new branch (-b flag)
git checkout -b feature-dark-mode
```

> [!NOTE]
> `git switch -c <name>` is modern, clearer, and equivalent to `git checkout -b <name>`. Both commands accomplish the exact same outcome under the hood.

---

## 3. What Happens in Your Working Directory When You Switch?

When you run `git switch <branch>`:
1. Git moves `HEAD` to point to the new branch pointer.
2. Git rewrites the files in your **Working Directory** to match the snapshot of the commit pointed to by that branch!
3. Files created in the other branch disappear from your disk, and files present in the target branch materialize instantly.

```
Working on 'feature-auth' branch:
Working Directory contains: [ auth.js, login.html, index.html ]

Execute: git switch main
Git updates Working Directory:
Working Directory now contains: [ index.html ] (auth.js and login.html disappear from disk!)
```

---

## 4. Preventing Switch Conflicts: Uncommitted Changes

What happens if you modified `styles.css` on `main`, forgot to commit, and try to `git switch feature-payment`?
- If the modified file does **not** conflict with changes on the target branch, Git carries the modified file over to the new branch with you.
- If the target branch has different changes to `styles.css`, Git will abort and protect your work:

```text
error: Your local changes to the following files would be overwritten by checkout:
	styles.css
Please commit your changes or stash them before you switch branches.
Aborting
```

### Solution:
Either commit your changes or use `git stash` to shelve them temporarily before switching!

---

## Practice Quiz

### Q1: Which modern Git command was introduced specifically to navigate and create branches without overloading file-restoring behavior?
- A) `git jump`
- B) `git switch`
- C) `git move`
- D) `git navigate`
**Answer:** B
**Explanation:** `git switch` was introduced in Git 2.23 as a dedicated, safe command for switching and creating branches.

### Q2: What is the single-line command to create a new branch named `bugfix-12` and switch to it immediately using `git switch`?
- A) `git switch -new bugfix-12`
- B) `git switch -c bugfix-12`
- C) `git branch -switch bugfix-12`
- D) `git switch --create-new bugfix-12`
**Answer:** B
**Explanation:** The `-c` (create) flag with `git switch -c <name>` creates a new branch and checks it out in one step.

### Q3: What is the equivalent legacy command for `git switch -c feature-api`?
- A) `git branch feature-api`
- B) `git checkout -b feature-api`
- C) `git init -b feature-api`
- D) `git commit -b feature-api`
**Answer:** B
**Explanation:** `git checkout -b <name>` is the classic command that creates and checks out a new branch.

### Q4: How do you quickly return to your previously active branch without typing its full name?
- A) `git switch --back`
- B) `git switch -`
- C) `git switch prev`
- D) `git switch ..`
**Answer:** B
**Explanation:** `git switch -` (or `git checkout -`) switches back to the branch that was checked out immediately prior to the current one.

### Q5: What happens to files on your disk in the working directory when you switch from branch A to branch B?
- A) Files remain frozen and cannot be changed
- B) Git updates files in the working directory to match the exact snapshot of the commit at the tip of branch B
- C) All files are deleted permanently
- D) Git creates a separate virtual machine
**Answer:** B
**Explanation:** Git updates your physical working directory files so that they reflect the exact tree snapshot of the branch you switched into.

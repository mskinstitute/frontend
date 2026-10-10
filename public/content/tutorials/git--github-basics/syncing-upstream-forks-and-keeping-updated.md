# Syncing Upstream Repositories and Keeping Forks Updated

When contributing to open-source software, hundreds of developers may merge code into the original project every week. If your personal fork falls behind, you will encounter merge conflicts and outdated code. Keeping your fork in sync with the original repository (called **upstream**) is a vital skill.

---

## 1. The Multi-Remote Topology: `origin` vs `upstream`

When you work on a fork, your local machine communicates with **two different remote repositories**:

```
[ Original Project ] (e.g. github.com/facebook/react)
         ^
         |  upstream (read-only for you)
         |
[ Your Local Machine ] (D:/projects/react)
         |
         |  origin (your read-and-write fork)
         v
[ Your Personal Fork ] (e.g. github.com/sumit-msk/react)
```

- **`origin`**: Points to **your personal fork** on GitHub. You have write/push access here.
- **`upstream`**: Points to the **original canonical repository**. You read/fetch updates from here.

---

## 2. Setting Up the `upstream` Remote

When you first clone your personal fork, Git only knows about `origin`:

```bash
git remote -v
# Output:
# origin  git@github.com:sumit-msk/react.git (fetch)
# origin  git@github.com:sumit-msk/react.git (push)
```

### Adding the Original Project as `upstream`:
```bash
git remote add upstream git@github.com:facebook/react.git
```

### Verify Both Remotes:
```bash
git remote -v
# Output:
# origin    git@github.com:sumit-msk/react.git (fetch)
# origin    git@github.com:sumit-msk/react.git (push)
# upstream  git@github.com:facebook/react.git (fetch)
# upstream  git@github.com:facebook/react.git (push)
```

---

## 3. The 4-Step Terminal Sync Workflow

Whenever you sit down to write new code or before opening a PR, sync your local `main` branch with `upstream`:

```bash
# Step 1: Switch to your local main branch
git switch main

# Step 2: Fetch all latest branches and commits from upstream
git fetch upstream

# Step 3: Fast-forward merge upstream/main into your local main
git merge upstream/main

# Step 4: Push the updated main to your personal GitHub fork (origin)
git push origin main
```

Your local repository AND your personal fork on GitHub are now 100% up-to-date with the original open-source project!

---

## 4. Alternative: GitHub Web UI "Sync Fork" Button

GitHub also provides a convenient web button on your fork's homepage:
1. Navigate to your fork repository on GitHub (`github.com/your-username/repo-name`).
2. Under the repository header, look for:
   **"This branch is 12 commits behind upstream:main"**.
3. Click the **Sync fork** button -> **Update branch**.
4. Then, pull down the updates to your laptop:
   ```bash
   git switch main
   git pull origin main
   ```

---

## Practice Quiz

### Q1: In open-source Git workflows, what does the remote alias `upstream` conventionally refer to?
- A) Your local computer's backup hard drive
- B) The original central repository from which you created your fork
- C) A temporary testing server
- D) The staging branch on your laptop
**Answer:** B
**Explanation:** `upstream` is the convention used for the original canonical repository maintained by the project authors, while `origin` points to your personal fork.

### Q2: What command configures the original repository as an `upstream` remote?
- A) `git remote add upstream <original-repo-url>`
- B) `git link upstream <original-repo-url>`
- C) `git fork sync <original-repo-url>`
- D) `git clone upstream <original-repo-url>`
**Answer:** A
**Explanation:** `git remote add <name> <url>` adds a new remote bookmark. Specifying `upstream` establishes the link to the original project.

### Q3: What is the recommended terminal sequence to pull in upstream updates to your local `main` branch?
- A) `git switch main` -> `git fetch upstream` -> `git merge upstream/main`
- B) `git delete main` -> `git init`
- C) `git push upstream main`
- D) `git stash drop`
**Answer:** A
**Explanation:** Switching to `main`, fetching from `upstream`, and merging `upstream/main` updates your local branch cleanly to match the latest upstream commits.

### Q4: Why is it crucial to sync your fork before starting work on a new feature?
- A) To avoid building features on top of obsolete code and prevent painful merge conflicts
- B) Git will not run commands if a fork is behind
- C) It saves battery life on your laptop
- D) It compresses video files
**Answer:** A
**Explanation:** Developing on an outdated branch causes merge conflicts and may result in building on code that has already been refactored or removed upstream.

### Q5: After merging `upstream/main` into your local `main`, why should you run `git push origin main`?
- A) To upload the synced commits to your personal GitHub fork so it stays up-to-date in the cloud
- B) To delete your local files
- C) To request money from GitHub
- D) To create a new SSH key
**Answer:** A
**Explanation:** Merging upstream updates happens on your local computer; running `git push origin main` updates your personal cloud fork on GitHub.

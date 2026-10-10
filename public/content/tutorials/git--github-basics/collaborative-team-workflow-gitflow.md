# Collaborative Team Git Flow Simulation (Feature Branches, PRs, Merges)

In commercial software development, working in isolation is rare. Teams of 5, 20, or 200 engineers must deliver features concurrently without breaking production. The **Feature Branch Workflow (Git Flow)** is the gold standard methodology adopted by tech companies worldwide.

---

## 1. The Feature Branch Mental Model

The golden rule of professional team workflows is simple:
> **The `main` branch is SACRED.** It must always compile, pass all tests, and be deployable to production at any second. No engineer ever commits directly to `main`!

```
                                  [ Pull Request & Review ]
                                     +-----------------+
                                     |                 |
(main) ----------(C1)----------------+-----------------+-----(C4: Merge Commit)-----> (Production)
                   \                                   /
                    \                                 /
(feat-payment)       +----(C2: Commit)----(C3: Commit)+
```

---

## 2. End-to-End Simulation: Building a Team Feature

Let's simulate how a software engineer (Sumit) implements a new user profile feature in a team setting:

### Phase 1: Start from the Latest Production Code
Always pull the latest changes before branching:
```bash
git switch main
git pull origin main
```

### Phase 2: Create a Semantic Feature Branch
Branch names should follow team naming conventions (`feat/`, `fix/`, `chore/`):
```bash
git switch -c feat/user-profile-avatar
```

### Phase 3: Write Code in Atomic Commits
Work locally, testing changes:
```bash
# Edit files, stage, and commit
git add src/components/AvatarUpload.jsx
git commit -m "feat(profile): create avatar image upload modal"

git add src/api/upload.js
git commit -m "feat(api): handle multipart image upload to S3"
```

### Phase 4: Push Feature Branch to GitHub
```bash
git push -u origin feat/user-profile-avatar
```

### Phase 5: Open a Pull Request on GitHub
- Select `base: main` $\leftarrow$ `compare: feat/user-profile-avatar`.
- Write a clear PR description detailing testing steps.
- Request review from teammate (e.g. `@neha-lead`).

### Phase 6: Address Feedback and Merge
- Reviewer requests a security check on image mime types.
- Sumit commits the fix locally and pushes to the same branch:
  ```bash
  git commit -am "fix(upload): validate PNG and JPEG mime types"
  git push origin feat/user-profile-avatar
  ```
- Reviewer approves (**LGTM!**).
- Click **Squash and merge** on GitHub!

### Phase 7: Local Housekeeping
Once merged on GitHub, clean up your local machine:
```bash
# Switch back to main
git switch main

# Pull down the merged changes
git pull origin main

# Delete the local feature branch
git branch -d feat/user-profile-avatar
```

---

## 3. Team Collaboration Golden Rules

1. **Keep branches short-lived**: Branches that live for weeks accumulate brutal merge conflicts. Merge within 1–3 days.
2. **Pull `main` frequently**: If other teammates merge changes while you are working, rebase or merge `main` into your feature branch early and often.
3. **Automate testing**: Configure GitHub Actions so broken tests automatically block merging.

---

## Practice Quiz

### Q1: In standard team engineering workflows, why is committing directly to the `main` branch strictly prohibited?
- A) It costs money per commit
- B) `main` represents stable production; direct commits bypass peer reviews, automated testing, and risk crashing production
- C) Git crashes if anyone commits to main
- D) Only robots are allowed to write code
**Answer:** B
**Explanation:** Protecting `main` ensures all production-bound code undergoes peer review, automated linting, and unit testing before integration.

### Q2: What is the first command an engineer should run before branching off to start a new feature?
- A) `git switch main && git pull origin main`
- B) `git reset --hard`
- C) `git clean -f`
- D) `git push --all`
**Answer:** A
**Explanation:** Pulling the latest changes from `main` guarantees that your new feature branch starts from the most recent, up-to-date baseline.

### Q3: What should you do after your feature branch has been approved and merged on GitHub?
- A) Reformat your computer
- B) Switch to local `main`, pull the merged commits, and safely delete the old local feature branch
- C) Delete the repository
- D) Never touch Git again
**Answer:** B
**Explanation:** Good branch hygiene requires switching back to `main`, updating it via `git pull`, and deleting the merged local feature branch (`git branch -d`).

### Q4: Why are short-lived branches (1–3 days) preferred over long-lived branches (several weeks)?
- A) Long-lived branches severely diverge from `main`, leading to catastrophic merge conflicts and integration friction
- B) Git branches expire automatically after 7 days
- C) GitHub limits accounts to 10 total commits
- D) Short branches compile faster in C++
**Answer:** A
**Explanation:** The longer a branch lives in isolation, the more it diverges from other teammates' concurrent work, increasing merge conflict severity.

### Q5: What is branch protection on GitHub?
- A) Password-protecting files with ZIP encryption
- B) Repository settings that enforce rules on specific branches (e.g. requiring PR reviews, passing CI status checks, and preventing force pushes)
- C) Anti-virus software for Git
- D) Locking the keyboard
**Answer:** B
**Explanation:** Branch protection rules enforce quality controls on critical branches (like `main`), requiring PR approvals and green CI tests before merges are allowed.

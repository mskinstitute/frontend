# Creating and Managing Pull Requests (PRs) on GitHub

The **Pull Request (PR)** is the foundational collaboration workflow of modern software engineering. It is how developers propose changes, invite teammates to review code, run automated tests, and safely merge features into production.

---

## 1. What is a Pull Request?

A Pull Request is not a Git command—it is a feature popularized by GitHub.
When you create a Pull Request, you are literally asking the maintainers:
> *"I have finished developing feature X on branch `feature-auth`. Would you please **pull** my commits into your `main` branch?"*

```
Your Branch:    (C1) ---> (C2) [feature-auth]
                                     |
                             [ Pull Request ]
                                     |
Target Branch:  (C1) <---------------+ (main)
```

---

## 2. The Complete Pull Request Workflow

Professional software teams follow this 6-step PR cycle daily:

### Step 1: Create a Focused Feature Branch
Never write code directly on `main`:
```bash
git switch main
git pull
git switch -c feat-stripe-checkout
```

### Step 2: Develop, Stage, and Commit
Write your code and create semantic commits:
```bash
git add src/payments/stripe.js
git commit -m "feat(payment): integrate Stripe checkout session API"
```

### Step 3: Push the Branch to GitHub
```bash
git push -u origin feat-stripe-checkout
```

### Step 4: Open the Pull Request on GitHub
1. Navigate to your repository on GitHub.
2. A yellow notification banner will appear: **"feat-stripe-checkout had recent pushes... Compare & pull request"**. Click it!
3. Select the **base branch** (`main`) and the **compare branch** (`feat-stripe-checkout`).
4. Write a descriptive **Title** and **Description**:
   - What problem does this solve?
   - What approach did you take?
   - How can the reviewer test it?
5. Click **Create pull request**.

---

## 3. Writing an Exceptional PR Description

A high quality PR description accelerates code reviews and prevents misunderstandings. Industry-standard PR template:

```markdown
## Summary
Integrates Stripe checkout API to allow customers to pay for course subscriptions online.

## Changes Made
- Added `stripe` npm dependency.
- Implemented `/api/checkout` endpoint with Webhook signature verification.
- Created checkout modal in `src/components/CheckoutModal.jsx`.

## How to Test
1. Run `npm install` and `npm run dev`.
2. Navigate to `/courses/python-for-beginners`.
3. Click "Enroll Now" and verify test card numbers succeed.

## Closes
Closes #42
```

> [!TIP]
> Writing keywords like **`Closes #42`** or **`Fixes #15`** in your PR description tells GitHub to automatically close the associated issue when the PR is merged!

---

## 4. Merging Options on GitHub

When a PR is approved by reviewers and passes all CI/CD checks, maintainers have three merge strategies available:

```
[ Merge pull request ]  v
--------------------------
1. Create a merge commit  : Creates a 3-way merge commit preserving all commits and branch context.
2. Squash and merge       : Combines all commits into a single clean commit on main (keeps main history spotless!).
3. Rebase and merge       : Re-applies commits linearly without a merge commit.
```

---

## Practice Quiz

### Q1: What is the primary purpose of a Pull Request (PR) on GitHub?
- A) To delete files from the repository
- B) To propose changes from one branch to another, enabling peer review, testing, and discussion before merging
- C) To restart the web server
- D) To create a new user account
**Answer:** B
**Explanation:** A Pull Request lets developers present code changes, gather peer feedback, review diffs, and ensure quality before merging into the target branch.

### Q2: When creating a Pull Request, what is the "base" branch?
- A) The branch where you wrote your new code
- B) The target destination branch that will receive the merged changes (e.g. `main`)
- C) A branch stored on an external USB flash drive
- D) The oldest branch in Git history
**Answer:** B
**Explanation:** In GitHub PR terminology, `base` is the branch you want to merge *into*, and `compare` is the branch containing your proposed commits.

### Q3: What happens when you include the phrase `Fixes #104` in a GitHub Pull Request description?
- A) GitHub deletes issue 104 immediately
- B) GitHub automatically closes issue #104 once the Pull Request is merged into the default branch
- C) GitHub sends a text message to the repository owner
- D) Nothing happens
**Answer:** B
**Explanation:** GitHub recognizes special issue-closing keywords (`Fixes`, `Closes`, `Resolves`) followed by the issue number, automatically closing the issue upon merge.

### Q4: What does the "Squash and merge" option do when merging a Pull Request?
- A) Compresses all images in the repository
- B) Combines all commits from the feature branch into a single, clean commit on the target branch
- C) Deletes the GitHub repository
- D) Rejects the Pull Request
**Answer:** B
**Explanation:** "Squash and merge" squashes all individual commit objects from the PR branch into one single commit on the destination branch, keeping the main history tidy.

### Q5: What is a "Draft Pull Request" on GitHub?
- A) A PR that charges a fee
- B) A PR marked as work-in-progress to solicit early feedback while preventing accidental merges
- C) A PR that can only be seen by robots
- D) A PR that expires in 1 hour
**Answer:** B
**Explanation:** Draft PRs indicate that development is still underway, allowing team members to view code and discuss architecture without allowing the PR to be merged prematurely.

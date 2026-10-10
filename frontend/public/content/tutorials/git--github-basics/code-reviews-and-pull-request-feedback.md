# Code Reviews, Inline Comments, Approvals and Changes Requested

Code reviews are the primary defense against software bugs, architectural rot, and security vulnerabilities. On GitHub, the Pull Request interface provides a comprehensive suite of review tools designed to foster collaborative learning and high engineering standards.

---

## 1. The Anatomy of a GitHub Code Review

When a teammate asks you to review their Pull Request:
1. Navigate to the PR on GitHub and click the **Files changed** tab.
2. Review the diffs line by line. Additions are green (`+`), deletions are red (`-`).
3. Hover your mouse over any line of code and click the blue **`+`** icon to start an inline comment.

```
+-----------------------------------------------------------------------------+
| Line 42: const userToken = jwt.sign(payload, "secret_key_123");             |
+-----------------------------------------------------------------------------+
| [Review Comment]                                                            |
| Hey! Let's avoid hardcoding secrets in source files. Can we use             |
| `process.env.JWT_SECRET` instead?                                           |
|                                                                             |
| [ Add single comment ]           [ Start a review ]                         |
+-----------------------------------------------------------------------------+
```

### Single Comment vs. Starting a Review:
- **Add single comment**: Posts immediately and notifies the author right away. (Can be noisy if you leave 10 comments).
- **Start a review (Recommended)**: Batches all your comments into a "Pending" draft. You can refine them and publish all comments at once when your review is complete.

---

## 2. Suggesting Code Changes Directly

Reviewers can do more than point out problems—they can provide ready-to-commit solutions!
Click the **Add a suggestion** icon (`+-`) inside the comment box:

````markdown
```suggestion
const userToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
```
````

The author can click **Commit suggestion** directly in GitHub, instantly incorporating your suggested code without switching back to their terminal!

---

## 3. Submitting the Review: The 3 Verdicts

Once you have examined the files, click **Review changes** in the upper right. Choose one of three verdicts:

| Verdict | When to Choose | Effect on PR |
|---|---|---|
| **Comment** | Submit general feedback or ask clarifying questions without giving approval | Leaves PR open; does not count toward branch protection approval quotas |
| **Approve** | You verified the code, tests pass, and it is ready to be merged | Marks the PR as approved green checkmark |
| **Request changes** | Critical bugs, security issues, or architectural flaws must be addressed | **Blocks** the PR from being merged until the author pushes fixes and requests re-review |

---

## 4. How the Author Addresses Review Feedback

If a reviewer requests changes:
1. Do not open a new PR!
2. Simply make the requested edits locally on your machine on that same feature branch.
3. Commit the fixes and push:
   ```bash
   git add src/auth.js
   git commit -m "fix(auth): read JWT secret from environment variable"
   git push origin feat-auth
   ```
4. GitHub automatically appends the new commits to the existing Pull Request and updates the diff!
5. In GitHub, click the **Re-request review** circular arrow icon next to the reviewer's name.

---

## Practice Quiz

### Q1: What is the main benefit of selecting "Start a review" instead of "Add single comment" on a GitHub PR?
- A) It prevents the author from seeing your comments forever
- B) It batches all your comments into a pending draft, sending one clean consolidated notification to the author
- C) It automatically merges the pull request
- D) It deletes the feature branch
**Answer:** B
**Explanation:** Starting a review holds comments in draft until you finish the entire review, preventing a barrage of separate email notifications for each line commented on.

### Q2: Which GitHub review verdict explicitly blocks a protected branch from being merged until resolved?
- A) Comment
- B) Approve
- C) Request changes
- D) Rebase
**Answer:** C
**Explanation:** Selecting "Request changes" blocks the pull request from being merged until the author pushes updates and the reviewer approves.

### Q3: How can a PR author incorporate a code suggestion made by a reviewer with a single click?
- A) Run `git apply suggestion` in terminal
- B) Click the "Commit suggestion" button directly on the GitHub review comment interface
- C) Copy and paste it into WhatsApp
- D) File a support ticket with GitHub
**Answer:** B
**Explanation:** GitHub provides a "Commit suggestion" button that allows authors to commit proposed code changes directly into the branch from the web UI.

### Q4: When an author pushes new commits to a branch with an open PR, what happens?
- A) The original PR is deleted and a new one must be opened
- B) The open PR automatically updates with the new commits and refreshes the diff
- C) The whole repository is wiped clean
- D) The commits are discarded
**Answer:** B
**Explanation:** A Pull Request tracks the branch itself; whenever new commits are pushed to that branch, the PR automatically incorporates them into its timeline and diff.

### Q5: What is "LGTM" in code review slang?
- A) "Load Git To Memory"
- B) "Looks Good To Me" (indicating review approval)
- C) "Local Git Translation Module"
- D) "Legacy Git Test Method"
**Answer:** B
**Explanation:** In engineering team culture, LGTM stands for "Looks Good To Me", standard shorthand for code review approval.

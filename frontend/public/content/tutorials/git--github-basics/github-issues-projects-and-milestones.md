# Project Management with GitHub Issues, Milestones & Kanban Boards

Modern software engineering requires rigorous task management. GitHub provides a native project management suite—**Issues**, **Labels**, **Milestones**, and **GitHub Projects (Kanban)**—enabling engineering teams to plan sprints, triage bugs, and track deliverables directly alongside the codebase.

---

## 1. Tracking Work with GitHub Issues

A **GitHub Issue** is a dedicated tracking ticket for a bug, feature request, task, or technical debt item.

```
+-----------------------------------------------------------------------------+
| Issue #28: [Bug] Mobile menu does not close after clicking route link      |
+-----------------------------------------------------------------------------+
| Author: sumit-msk | Labels: bug, mobile, priority-high | Milestone: v1.1.0  |
+-----------------------------------------------------------------------------+
| Description:                                                                |
| When browsing on iPhone Safari, selecting a link in the mobile menu drawer  |
| navigates correctly, but the black backdrop overlay remains stuck.          |
|                                                                             |
| Steps to Reproduce:                                                         |
| 1. Open home page on mobile screen (< 768px).                               |
| 2. Click Hamburger icon.                                                    |
| 3. Click "Courses". Observe backdrop state.                                 |
+-----------------------------------------------------------------------------+
```

### Issue Templates:
To ensure high quality bug reports, repositories can define structured markdown templates in `.github/ISSUE_TEMPLATE/`:
- `bug_report.md`: Enforces steps to reproduce, expected behavior, and device info.
- `feature_request.md`: Enforces problem description, proposed solution, and alternatives considered.

---

## 2. Organizing Work: Labels & Milestones

### A. Categorizing with Labels
Labels provide color-coded visual tags for filtering issues and PRs:
- **Type**: `bug` (red), `enhancement` (light blue), `documentation` (blue), `refactor` (purple).
- **Priority**: `priority:critical` (dark red), `priority:low` (green).
- **Good First Issue**: Specifically marks beginner-friendly tasks for new contributors.

### B. Grouping by Milestones
A **Milestone** acts as a container for a group of issues and PRs tied to a target release date or sprint:
- Examples: `Sprint 14 - Q3 Launch`, `v2.0.0 Major Release`.
- Displays a real-time progress bar: **"65% complete (13 closed, 7 open)"**.

---

## 3. GitHub Projects (Interactive Kanban Boards)

GitHub Projects allows teams to visualize issues as cards on an interactive Agile Kanban board:

```
+-------------------+   +-------------------+   +-------------------+   +-------------------+
|      Todo         |   |    In Progress    |   |    In Review      |   |       Done        |
+-------------------+   +-------------------+   +-------------------+   +-------------------+
| #32 Setup Redis   |   | #28 Fix mobile    |   | #29 PR: Stripe    |   | #20 Auth API      |
| cache layer       |   | navbar backdrop   |   | payment webhook   |   | endpoint          |
+-------------------+   +-------------------+   +-------------------+   +-------------------+
```

### Automated Workflows:
- When an issue is assigned $\rightarrow$ automatically moves to **In Progress**.
- When a Pull Request is opened linked to an issue $\rightarrow$ moves to **In Review**.
- When the PR merges into `main` $\rightarrow$ automatically moves to **Done**!

---

## Practice Quiz

### Q1: What is a GitHub Issue used for?
- A) Re-installing the operating system
- B) Tracking bugs, feature requests, tasks, and discussions directly within a repository
- C) Encrypting user passwords
- D) Purchasing computer hardware
**Answer:** B
**Explanation:** GitHub Issues provide an integrated ticketing system to track bugs, enhancements, and tasks connected to your codebase.

### Q2: What is the benefit of using Issue Templates in `.github/ISSUE_TEMPLATE/`?
- A) It charges users for filing bugs
- B) It prompts users to provide structured information (reproduction steps, browser version, expected behavior), preventing incomplete bug reports
- C) It automatically writes code to fix the bug
- D) It deletes outdated repositories
**Answer:** B
**Explanation:** Issue templates standardize incoming bug reports and feature requests so engineers receive the necessary debugging context immediately.

### Q3: What does the special label `good first issue` signify on GitHub?
- A) An issue that is strictly for senior architects only
- B) A beginner-friendly, well-scoped task curated to help newcomers make their first open-source contribution
- C) An issue that has zero lines of code
- D) An expired task
**Answer:** B
**Explanation:** `good first issue` is a community standard tag indicating that the task is approachable for first-time contributors.

### Q4: What does a GitHub Milestone represent?
- A) A measure of internet download speed
- B) A target deliverable or release date that groups related issues and displays a progress completion bar
- C) The physical distance between two developer laptops
- D) A personal salary milestone
**Answer:** B
**Explanation:** Milestones aggregate related issues and PRs toward a specific target version or deadline, providing real-time completion tracking.

### Q5: How do GitHub Projects enhance team development?
- A) They provide visual Kanban boards and sprint tables that automatically track issues from Todo to Done
- B) They replace Git commands entirely
- C) They eliminate the need for writing tests
- D) They host relational SQL databases
**Answer:** A
**Explanation:** GitHub Projects provides agile Kanban boards and spreadsheet tables with automated card movement tied to branch PR events.

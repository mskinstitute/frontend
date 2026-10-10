# What is GitHub? Remote Hosting, Social Coding & Open Source

Many beginners conflate Git with GitHub, believing they are the same product. In reality, they are two completely distinct tools that work together seamlessly. Understanding the distinction is fundamental to modern web engineering.

---

## 1. Git vs. GitHub: The Fundamental Distinction

| Metric | Git | GitHub |
|---|---|---|
| **What is it?** | A command-line tool / software program | A cloud-based web hosting service & collaboration platform |
| **Where does it run?** | Locally on your computer (offline) | Remotely on Microsoft cloud servers (online) |
| **Creator** | Linus Torvalds (2005) | Chris Wanstrath, PJ Hyett, Tom Preston-Werner (2008, acquired by Microsoft in 2018) |
| **Core Function** | Tracks file revisions, branches, and commit histories | Hosts Git repositories online for team sharing, code reviews, and CI/CD |
| **GUI vs CLI** | Primarily Command Line Interface (CLI) | Rich Graphical Web Interface (GUI) |
| **Competitors** | Mercurial, SVN, Perforce | GitLab, Bitbucket, SourceForge, AWS CodeCommit |

> [!IMPORTANT]
> **Analogy**: Git is like the engine of a car; GitHub is like the highway and parking garage where cars meet, travel, and park. You can use Git entirely on your laptop without ever creating a GitHub account!

---

## 2. Core Value Pillars of GitHub

Why do more than 100 million developers and 90% of Fortune 100 companies use GitHub?

```
+-----------------------------------------------------------------------------+
|                          GITHUB ECOSYSTEM PLATFORM                          |
+-----------------------------------------------------------------------------+
|  [ Cloud Backup & Sync ]      [ Pull Requests & Reviews ]   [ GitHub Actions ] |
|  Safe remote off-site         Asynchronous peer code        Automated CI/CD    |
|  repository storage           reviews & approvals           testing & deploys  |
|                                                                             |
|  [ Issues & Projects ]        [ Open Source Hub ]          [ GitHub Pages ]   |
|  Bug tracking & agile         Forking, starring, and       Free static web    |
|  Kanban project boards        community contributions      hosting            |
+-----------------------------------------------------------------------------+
```

### 1. Cloud Backup & Remote Synchronization
- If your laptop breaks or gets stolen, your entire codebase, commit history, and branches are preserved safely in the cloud.
- You can clone your project onto a new machine with a single command: `git clone`.

### 2. Team Collaboration via Pull Requests (PRs)
- Instead of pushing directly to production, engineers push their feature branch to GitHub and open a **Pull Request**.
- Teammates can view line-by-line diffs, leave inline review comments, request adjustments, and approve code before merging.

### 3. Continuous Integration & Automation (GitHub Actions)
- GitHub Actions automatically runs automated unit tests, linting, and Docker container builds every time someone pushes code or opens a PR.

### 4. Open-Source Community Ecosystem
- GitHub is the global home of open source. The code for React, Vue, Next.js, Linux, TensorFlow, and Python is openly hosted, starred, and contributed to on GitHub.

---

## 3. Creating Your GitHub Account

1. Navigate to **[github.com](https://github.com/join)**.
2. Sign up with a professional email address and username.
3. Configure Two-Factor Authentication (2FA) for security.

---

## Practice Quiz

### Q1: What is the relationship between Git and GitHub?
- A) Git and GitHub are the exact same software program
- B) Git is a local version control command-line tool, while GitHub is a cloud hosting platform for Git repositories
- C) GitHub only works if Git is uninstalled
- D) Git was created by GitHub in 2020
**Answer:** B
**Explanation:** Git is the local version control software, whereas GitHub is a remote web platform that hosts Git repositories in the cloud for sharing and collaboration.

### Q2: Can you use Git on your computer without having an internet connection or a GitHub account?
- A) No, Git requires constant internet connection to commit
- B) Yes, Git is completely distributed and operates 100% locally on your machine
- C) No, Git requires an active credit card on GitHub
- D) Only on Linux operating systems
**Answer:** B
**Explanation:** Git is a local, distributed VCS. You can create repositories, commit changes, branch, and inspect diffs completely offline without an account on GitHub.

### Q3: Which of the following is a direct competitor to GitHub?
- A) GitLab
- B) Bitbucket
- C) AWS CodeCommit
- D) All of the above
**Answer:** D
**Explanation:** GitLab, Atlassian Bitbucket, and AWS CodeCommit are all remote repository hosting platforms that compete with GitHub.

### Q4: What is the primary collaboration mechanism on GitHub for proposing changes and requesting peer reviews before merging?
- A) Emailing ZIP files to coworkers
- B) Opening a Pull Request (PR)
- C) Direct FTP upload
- D) Creating a GitHub issue
**Answer:** B
**Explanation:** Pull Requests on GitHub allow developers to present their branches, display diffs, discuss implementations, and obtain review approvals before merging.

### Q5: Who acquired GitHub in 2018?
- A) Google
- B) Apple
- C) Microsoft
- D) Meta (Facebook)
**Answer:** C
**Explanation:** Microsoft acquired GitHub in 2018 for $7.5 billion, continuing to invest heavily in its developer tooling and AI capabilities.

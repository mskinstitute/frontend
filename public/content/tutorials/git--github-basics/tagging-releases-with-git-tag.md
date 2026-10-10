# Tagging Milestones and Software Releases with `git tag`

In software engineering, development moves continuously, but users and deployments interact with specific milestones: `v1.0.0`, `v2.1.4-beta`, etc. Git provides **tags** to mark specific points in repository history as important release milestones.

---

## 1. What is a Git Tag?

While a **branch** is a moving pointer that advances every time you make a commit, a **tag** is an **immutable, permanent snapshot pointer**. Once placed on a commit, a tag never moves.

```
Branches Move:
(C1) ---> (C2) ---> (C3) [main advances...]

Tags Stay Fixed:
            ^
            |
         [v1.0.0] <--- Fixed permanent milestone!
```

---

## 2. The Two Types of Git Tags

Git supports two distinct types of tags:

| Attribute | Lightweight Tag | Annotated Tag (Recommended) |
|---|---|---|
| **What is it?** | Just a simple bookmark pointer to a commit hash | A full Git object stored in the database with checksum |
| **Metadata** | None | Stores tagger name, email, timestamp, and release message |
| **GPG Signing** | Cannot be cryptographically signed | Can be signed with GPG keys for verified releases |
| **Use Case** | Quick local private bookmarks | Official software versions, production deployments |

---

## 3. Creating and Managing Tags

### A. Creating an Annotated Tag (`-a`)
Always use annotated tags for official releases:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0: Initial public launch with auth & payments"
```

### B. Creating a Lightweight Tag
```bash
git tag v1.0.0-lw
```

### C. Tagging a Past Commit
You don't have to be standing on a commit to tag it; just provide its hash:
```bash
git tag -a v0.9.0 4a2c91d -m "Release version 0.9.0 beta"
```

### D. Listing All Tags
```bash
git tag

# Filter tags by pattern
git tag -l "v1.*"
```

### E. Viewing Tag Metadata (`git show`)
```bash
git show v1.0.0
```
Output:
```text
tag v1.0.0
Tagger: Sumit Sharma <sumit@mskinstitute.com>
Date:   Mon Sep 15 11:45:00 2026 +0530

Release version 1.0.0: Initial public launch with auth & payments

commit 7b3f81e28d4c5a9b0c2d4e6f8a0b1c2d3e4f5a6b
Author: Sumit Sharma <sumit@mskinstitute.com>
...
```

---

## 4. Pushing Tags to GitHub

> [!WARNING]
> By default, running `git push` does **NOT** transfer tags to remote servers! You must explicitly push tags:

```bash
# Push a single specific tag
git push origin v1.0.0

# Or push ALL local tags at once
git push origin --tags
```

### Releases on GitHub:
When you push tags like `v1.0.0` to GitHub, GitHub automatically:
1. Surfaces them under the **Releases / Tags** tab.
2. Bundles the codebase into downloadable `.zip` and `.tar.gz` source code archives.
3. Allows maintainers to attach compiled binaries, release notes, and changelogs.

### Deleting a Tag:
```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag on GitHub
git push origin --delete v1.0.0
```

---

## Practice Quiz

### Q1: What is the fundamental difference between a Git branch and a Git tag?
- A) Branches cost money; tags are free
- B) A branch pointer moves forward with every new commit, whereas a tag remains permanently fixed to a specific commit
- C) Tags only work with text files
- D) Branches cannot be deleted
**Answer:** B
**Explanation:** Branches are dynamic pointers that advance as new commits are added; tags are permanent milestone markers pointing to a specific commit.

### Q2: Why are Annotated Tags (`git tag -a`) preferred over Lightweight Tags for official releases?
- A) They are faster to download
- B) They store the tagger's name, email, date, and an explanatory release message, and can be cryptographically verified
- C) They automatically deploy code to AWS
- D) They do not require a commit hash
**Answer:** B
**Explanation:** Annotated tags are full Git database objects containing tagger metadata, timestamps, and descriptive release notes.

### Q3: If you run `git push origin main`, are your newly created local tags automatically pushed to GitHub?
- A) Yes, always
- B) No, Git does not push tags by default; you must run `git push origin <tag>` or `git push origin --tags`
- C) Only if the tags were created within the last 5 minutes
- D) Only on Linux
**Answer:** B
**Explanation:** Git requires explicit instructions to transfer tags to a remote repository; running a standard branch push omits tags.

### Q4: How can you tag an older commit that occurred 3 days ago?
- A) You cannot; tags only apply to today's commits
- B) Pass the commit hash at the end of the tag command: `git tag -a v1.0.0 <commit-hash> -m "message"`
- C) Edit the `.git/HEAD` file in Notepad
- D) Run `git rewind`
**Answer:** B
**Explanation:** Appending the commit hash to `git tag -a <tagname> <commit-hash>` creates a tag on that specific historical commit.

### Q5: What command deletes a remote tag named `v1.2.0` from GitHub?
- A) `git tag --remove v1.2.0`
- B) `git push origin --delete v1.2.0`
- C) `git remote drop v1.2.0`
- D) `git delete tag v1.2.0`
**Answer:** B
**Explanation:** `git push origin --delete <tagname>` instructs the remote server `origin` to delete the specified tag reference.

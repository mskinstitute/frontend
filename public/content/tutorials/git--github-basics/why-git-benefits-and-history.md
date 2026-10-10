# Why Git? History, Architecture & Core Benefits

To truly master Git, one must understand its origin and why its creator, Linus Torvalds, designed it differently from every version control tool that preceded it. Git was built not just to track code, but to handle one of the largest, most complex open-source projects on earth: the Linux Kernel.

---

## 1. The Origin Story of Git

In 2002, the Linux Kernel development team used a proprietary distributed VCS called BitKeeper. In 2005, the relationship between BitKeeper's parent company and the Linux community broke down, revoking free access.

Faced with no existing open-source tool capable of meeting their performance and distributed workflow needs, **Linus Torvalds** took a temporary leave from kernel development in April 2005. Within weeks, he engineered and released the first operational version of **Git**.

### Linus Torvalds' Core Design Goals:
1. **Speed & Scalability**: Patching and committing must take milliseconds, even on a project with hundreds of thousands of files.
2. **Non-linear Development**: Massively parallel branching and merging without server bottlenecks.
3. **Data Integrity (Cryptographic Hashing)**: Content cannot be modified or corrupted without Git detecting it instantly.
4. **Complete Distribution**: No single point of failure; high resistance to network latency.

---

## 2. Snapshots, Not Deltas: Git's Fundamental Paradigm

Most legacy VCS systems (such as CVS, Subversion, and RCS) think of information as a **list of file-based changes (deltas)**:

```
Delta-based VCS (SVN / CVS):
File A:  v1 ---> delta 1 ---> delta 2 ---> delta 3
File B:  v1 -----------------> delta 1 ---> delta 2
File C:  v1 ---> delta 1 -----------------> delta 2
```

Git does not store deltas! **Git thinks of its data as a stream of snapshots over time**:

```
Git Snapshot Model:
Commit 1: [ File A (v1) ] [ File B (v1) ] [ File C (v1) ]
                 |               |               |
Commit 2: [ File A (v2) ] [ File B (v1) ] [ File C (v2) ]  <-- (File B points to previous blob!)
                 |               |               |
Commit 3: [ File A (v2) ] [ File B (v2) ] [ File C (v2) ]  <-- (File A & C point to previous blobs!)
```

> [!IMPORTANT]
> If a file has not changed in a new commit, Git does not store the file again. Instead, it stores a lightweight pointer (link) to the exact same file blob previously stored! This makes Git exceptionally space-efficient and blazing fast.

---

## 3. Cryptographic Integrity: SHA-1 & Object Hashing

Everything in Git is checksummed before it is stored and is then referred to by that checksum. This means it is impossible to change the contents of any file or directory without Git knowing about it:
- Git uses a cryptographic hash function (historically **SHA-1**, transitioning to **SHA-256**).
- A SHA-1 hash is a 40-character hexadecimal string calculated from the raw file contents and header:
  ```
  2a4b6c8d1e3f5a7b9c0d2e4f6a8b0c2d4e6f8a0b
  ```
- If even a single comma or whitespace character changes, the hash completely changes. This guarantees that your history cannot be silently tampered with or corrupted by disk failures.

---

## 4. Key Pillars of Git's Industry Dominance

1. **Performance**: Nearly all operations are local. Running `git diff` against code from 6 months ago takes 0.05 seconds because the entire repository history is stored locally in `.git`.
2. **Branching as a Daily Tool**: In other VCSs, branching was viewed as a heavy architectural event. In Git, branches are used for every 15-minute bugfix or experiment.
3. **Open-Source Standard**: Over 95% of active software projects globally rely on Git and Git-based hosts (GitHub, GitLab, Bitbucket).

---

## Practice Quiz

### Q1: Who originally created Git in 2005?
- A) Guido van Rossum
- B) Linus Torvalds
- C) James Gosling
- D) Tim Berners-Lee
**Answer:** B
**Explanation:** Linus Torvalds, the creator of the Linux operating system kernel, designed and wrote the initial implementation of Git in 2005.

### Q2: How does Git store project revisions compared to traditional delta-based VCS systems?
- A) Git stores differences (deltas) between individual lines of code only
- B) Git stores full snapshots of the project at each commit, using pointers for unchanged files
- C) Git stores files as uncompressed base64 strings in a central database
- D) Git creates a complete duplicate copy of every single project file on every commit
**Answer:** B
**Explanation:** Git treats data as a stream of snapshots. If a file does not change between commits, Git simply creates a link/pointer to the existing blob rather than re-copying it.

### Q3: What cryptographic mechanism does Git use to ensure historical data integrity and detect corruption?
- A) RSA 4096-bit public encryption
- B) Cryptographic checksum hashing (SHA-1 / SHA-256)
- C) Cyclic Redundancy Check (CRC32)
- D) AES 256 symmetric encryption
**Answer:** B
**Explanation:** Git calculates a SHA-1 (or SHA-256) cryptographic hash for every object (blobs, trees, commits). Any corruption or unauthorized change to file content alters the hash immediately.

### Q4: If you modify a single comment in a file and run a Git commit, what happens to the files that were NOT modified?
- A) They are deleted from history
- B) They are re-uploaded to the server
- C) Git stores a lightweight pointer to the previously stored version of those files
- D) Git prompts the user to re-save all files manually
**Answer:** C
**Explanation:** For efficiency, Git does not re-store identical file content; it points the tree entry to the preexisting object hash in the object database.

### Q5: Why is checking commit history (`git log`) in Git vastly faster than in Subversion (SVN)?
- A) Git compresses all text into binary machine code
- B) The full commit history resides on the local disk inside the `.git` folder, requiring no network latency
- C) Git log only searches the current day's changes
- D) Git skips checking author information during log display
**Answer:** B
**Explanation:** Git holds the entire repository history locally on your computer. An operation like `git log` never waits on an internet connection or remote server response.

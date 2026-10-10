# Installing Git and Initial Configuration (`git config user.name / email`)

Before creating repositories or writing commits, Git must be properly installed on your operating system and configured with your identity. Every Git commit embeds the author's name and email permanently into its cryptographic hash, making initial configuration essential.

---

## 1. Installing Git Across Operating Systems

### A. Windows
1. Download the official installer from **[git-scm.com](https://git-scm.com)** (Git for Windows).
2. Run the `.exe` installer. Recommended installation settings:
   - Default editor: **Visual Studio Code** (or your preferred editor).
   - Default branch name for new repositories: **`main`** (modern standard).
   - Adjusting your PATH environment: **Git from the command line and also from 3rd-party software**.
   - Line ending conversions: **Checkout Windows-style, commit Unix-style line endings** (`core.autocrlf = true`).

### B. macOS
On macOS, Git can be installed via Xcode Command Line Tools or Homebrew:
```bash
# Using Homebrew (Recommended)
brew install git

# Or trigger Apple Xcode Command Line Developer Tools
xcode-select --install
```

### C. Linux (Ubuntu / Debian / Fedora)
```bash
# Ubuntu / Debian
sudo apt update
sudo apt install git -y

# Fedora / RHEL
sudo dnf install git -y
```

### Verify Installation:
Open your terminal (PowerShell, Command Prompt, macOS Terminal, or Linux Bash) and verify:
```bash
git --version
# Expected output: git version 2.40.0 (or newer)
```

---

## 2. The Three Levels of Git Configuration

Git configurations can be applied at three different scopes:

| Scope Flag | Config File Location | Scope of Effect |
|---|---|---|
| **`--system`** | `/etc/gitconfig` (Unix) or `C:\Program Files\Git\etc\gitconfig` (Windows) | Applies to every user and every repository on the operating system |
| **`--global`** | `~/.gitconfig` or user profile `.gitconfig` | Applies to the current operating system user across **all** their repos |
| **`--local`** | `.git/config` inside the active repository folder | Applies **only** to this specific project repository |

> [!TIP]
> Git evaluates configurations in order of precedence: **`--local` overrides `--global`, which overrides `--system`**.

---

## 3. Essential First-Time Configurations

### Step 1: Set Your Identity (Mandatory)
Git requires an author name and email address. These will be stamped onto every commit you ever create:
```bash
# Set your full name
git config --global user.name "Sumit Sharma"

# Set your email address (use your GitHub-associated email)
git config --global user.email "sumit@mskinstitute.com"
```

### Step 2: Set Default Initial Branch Name
Historically Git defaulted to `master`. The modern industry standard adopted by GitHub, GitLab, and the Git community is `main`:
```bash
git config --global init.defaultBranch main
```

### Step 3: Set Your Preferred Code Editor
Configure VS Code as Git's default text editor for commit messages and interactive rebasing:
```bash
git config --global core.editor "code --wait"
```

### Step 4: Configure Line Ending Normalization (`core.autocrlf`)
Operating systems handle line breaks differently: Windows uses `CRLF` (`\r\n`), while macOS and Linux use `LF` (`\n`). Without normalization, teams collaborating across Windows and Mac will experience phantom diffs on every line:
```bash
# On Windows machines:
git config --global core.autocrlf true

# On macOS and Linux machines:
git config --global core.autocrlf input
```

---

## 4. Inspecting and Verifying Your Configuration

To review all active configuration parameters:
```bash
# List all resolved configurations
git config --list

# Show where each configuration setting originates
git config --list --show-origin

# Check a single specific setting
git config user.name
# Output: Sumit Sharma
```

---

## Practice Quiz

### Q1: Which `git config` scope applies settings across all repositories for the currently logged-in user?
- A) `--local`
- B) `--system`
- C) `--global`
- D) `--project`
**Answer:** C
**Explanation:** The `--global` flag modifies the user's personal configuration file (`~/.gitconfig`), applying settings across all repositories on that machine.

### Q2: What happens if a repository has a `--local` setting that conflicts with a `--global` setting?
- A) Git throws a fatal configuration exception
- B) The `--local` repository setting takes precedence and overrides the `--global` setting
- C) The `--global` setting always wins
- D) Both settings are erased
**Answer:** B
**Explanation:** Git applies settings in priority order: Local overrides Global, which overrides System. This allows you to use a work email in a company repo and a personal email globally.

### Q3: Why is configuring `user.name` and `user.email` mandatory in Git?
- A) Git refuses to connect to the internet without them
- B) Every commit is stamped with author identity, which forms part of the immutable cryptographic commit hash
- C) It is required to pay for a Git software license
- D) It sets up your operating system login password
**Answer:** B
**Explanation:** Git commits record the author and committer metadata (name and email). Without this identity, Git cannot attribute revisions or compute the commit object.

### Q4: What is the purpose of configuring `core.autocrlf = true` on a Windows developer workstation?
- A) It speeds up Python script execution
- B) It converts CRLF line endings to LF when committing code to the repository, and converts LF back to CRLF on checkout
- C) It prevents accidental deletion of files
- D) It encrypts source code files on Windows
**Answer:** B
**Explanation:** On Windows, `core.autocrlf = true` ensures that line endings are normalized to Unix standard `LF` in the repository while maintaining Windows `CRLF` in the local working tree.

### Q5: Which command verifies the currently installed version of Git in your terminal?
- A) `git --check`
- B) `git --version`
- C) `git verify`
- D) `git info`
**Answer:** B
**Explanation:** Running `git --version` displays the installed version of Git (e.g. `git version 2.45.2.windows.1`).

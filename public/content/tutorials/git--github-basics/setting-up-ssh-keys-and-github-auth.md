# Setting up SSH Keys, Personal Access Tokens (PAT) and Authentication

To push code from your local machine to GitHub, Git must authenticate your identity. In August 2021, GitHub permanently removed support for plain account passwords when authenticating Git operations over HTTPS. Today, you must authenticate using either **SSH Keys** (recommended) or **Personal Access Tokens (PAT)**.

---

## 1. Why Password Authentication Was Deprecated

Plain text passwords suffer from major security flaws:
- They can be intercepted, shoulder-surfed, or phished.
- A leaked password grants full access to your entire GitHub account.
- They cannot be easily scoped or set to expire automatically.

### Modern Solutions:
1. **SSH (Secure Shell) Keys**: Cryptographic public/private key pairs. Zero passwords to type; permanently secure and lightning fast.
2. **Personal Access Tokens (PAT)**: Scoped, revocable alphanumeric strings used as password replacements over HTTPS.

---

## 2. Generating and Configuring SSH Keys (Recommended)

SSH uses asymmetric public-key cryptography. You keep the **private key** secret on your laptop, and upload the **public key** (`.pub`) to GitHub.

### Step 1: Check for Existing SSH Keys
```bash
ls -al ~/.ssh
# Look for id_ed25519 or id_rsa
```

### Step 2: Generate a Modern Ed25519 Key Pair
The Ed25519 algorithm is faster and more secure than legacy RSA:
```bash
ssh-keygen -t ed25519 -C "sumit@mskinstitute.com"
```
- Press **Enter** to accept the default file location (`~/.ssh/id_ed25519`).
- Enter a passphrase for extra local security (or press Enter for no passphrase).

### Step 3: Add Your Private Key to the SSH Agent
```bash
# Start ssh-agent in the background
eval "$(ssh-agent -s)"

# Add your private key
ssh-add ~/.ssh/id_ed25519
```

### Step 4: Copy Your Public Key to Clipboard
```bash
# On Windows PowerShell:
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard

# On macOS:
pbcopy < ~/.ssh/id_ed25519.pub

# On Linux:
cat ~/.ssh/id_ed25519.pub
```

### Step 5: Add Public Key to GitHub
1. Log in to **GitHub** -> Click your profile avatar -> **Settings**.
2. Under "Access", click **SSH and GPG keys** -> Click **New SSH key**.
3. Provide a title (e.g. `Work Laptop Windows 11`).
4. Key type: **Authentication Key**.
5. Paste your copied public key into the Key box and click **Add SSH key**.

### Step 6: Test Your SSH Connection
```bash
ssh -T git@github.com
```
Expected success output:
```text
Hi sumit-msk! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 3. Alternative: Personal Access Tokens (PAT)

If your corporate firewall blocks outgoing SSH port 22, you can use HTTPS with a Personal Access Token:

1. On GitHub, go to **Settings** -> **Developer Settings** -> **Personal Access Tokens** -> **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Set an expiration (e.g., 90 days) and check the `repo` scope.
4. Copy the token string immediately (e.g., `ghp_xxxxxxxxxxxx`).
5. When Git prompts for your password in the terminal, **paste the PAT string** instead of your GitHub password.

---

## Practice Quiz

### Q1: Why did GitHub deprecate password authentication for Git operations in 2021?
- A) Passwords cannot be typed in terminals
- B) To enforce stronger security protocols like asymmetric SSH cryptography and scoped, revocable tokens
- C) GitHub became a paid-only service
- D) To prevent Windows users from cloning repositories
**Answer:** B
**Explanation:** Plain password authentication was removed to prevent phishing, credential stuffing, and unauthorized account takeovers.

### Q2: In asymmetric SSH cryptography, which key must remain strictly private and never be shared or uploaded to GitHub?
- A) The public key (`.pub`)
- B) The private key (e.g. `id_ed25519`)
- C) The `config` file
- D) The `known_hosts` file
**Answer:** B
**Explanation:** The private key resides solely on your local computer and must never be shared. Only the public key (`.pub`) is uploaded to GitHub.

### Q3: Which command generates a secure, modern Ed25519 SSH key pair?
- A) `ssh-keygen -t ed25519 -C "email@example.com"`
- B) `git key generate`
- C) `ssh-create --new`
- D) `git auth ed25519`
**Answer:** A
**Explanation:** `ssh-keygen -t ed25519 -C "email"` is the standard OpenSSH command for generating Ed25519 curve keypairs.

### Q4: How do you verify that your SSH key is successfully authenticating with GitHub?
- A) `ping github.com`
- B) `ssh -T git@github.com`
- C) `git status --remote`
- D) `curl https://github.com`
**Answer:** B
**Explanation:** `ssh -T git@github.com` establishes a test SSH handshake with GitHub and verifies that your public key is recognized.

### Q5: If you use HTTPS URLs (e.g. `https://github.com/user/repo.git`), what must you provide when Git prompts for your password?
- A) Your Gmail password
- B) A Personal Access Token (PAT) generated in GitHub Developer Settings
- C) Your computer login password
- D) Your GitHub account password
**Answer:** B
**Explanation:** When using HTTPS, GitHub requires a Personal Access Token (PAT) with repository scopes in place of an account password.

# Automated CI/CD Pipelines with GitHub Actions

Enterprise engineering organizations require continuous confidence that code merged into main repositories compiles without type errors, satisfies linting rules, passes test suites, and deploys reliably. **GitHub Actions** automates this lifecycle via **Continuous Integration (CI)** and **Continuous Deployment (CD)** pipelines triggered on pull requests and branch merges.

---

## 1. Enterprise CI/CD Pipeline Architecture

```
Developer opens Pull Request
          │
          ▼
GitHub Actions CI Pipeline (Triggers in Parallel):
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ 1. Lint & Format        │ 2. Type Check           │ 3. Automated Tests      │
│    (ESLint + Prettier)  │    (tsc --noEmit)       │    (Vitest + RTL)       │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
                                   │
                     All Checks Pass? ✅
                                   │
                                   ▼
Pull Request Merged to 'main' ──► CD Pipeline ──► Production Build ──► Deploy to CDN
```

---

## 2. Complete CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main]

jobs:
  validate:
    name: Lint, Typecheck, and Test
    runs-on: ubuntu-latest

    steps:
      # 1. Check out repository code
      - name: Checkout Code
        uses: actions/checkout@v4

      # 2. Setup Node.js with caching
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      # 3. Deterministic Dependency Installation
      - name: Install Dependencies
        run: npm ci

      # 4. Lint Verification
      - name: Run ESLint
        run: npm run lint

      # 5. TypeScript Strict Type Checking
      - name: Type Check (No Emit)
        run: npx tsc --noEmit

      # 6. Run Unit and Integration Tests with Coverage
      - name: Run Vitest Suite
        run: npm run test:coverage

      # 7. Verify Production Build Compiles
      - name: Build Production Bundle
        run: npm run build
```

---

## 3. Continuous Deployment (CD) Workflow (`.github/workflows/cd.yml`)

Deploy compiled assets securely to cloud providers (AWS S3 + CloudFront, Vercel, or Cloudflare Pages) using OpenID Connect (OIDC) authentication:

```yaml
name: Continuous Deployment

on:
  push:
    branches: [main]

permissions:
  id-token: write # Required for secure OIDC cloud authentication
  contents: read

jobs:
  deploy:
    name: Deploy to Production CDN
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.PROD_API_URL }}

      # Deploy static assets to AWS S3
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v3
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubDeployRole
          aws-region: us-east-1

      - name: Sync Assets to S3
        run: |
          aws s3 sync dist/ s3://enterprise-frontend-bucket/ --delete             --cache-control "public, max-age=31536000, immutable"             --exclude "index.html"
          aws s3 cp dist/index.html s3://enterprise-frontend-bucket/index.html             --cache-control "no-cache, no-store, must-revalidate"

      - name: Invalidate CloudFront CDN Cache
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} --paths "/*"
```

---

## 4. Branch Protection Rules

In GitHub repository settings, configure **Branch Protection Rules** on `main`:
- Require status checks to pass before merging: check `validate` job.
- Require signed commits.
- Require at least 1 peer code review approval.
- Enforce linear git history.

This prevents any developer from accidentally pushing broken code directly into production.

---

## Practice Quiz

### Q1: What is the primary purpose of Continuous Integration (CI) in a React project?
- A) To send emails to users
- B) To automatically run linters, type checks, and automated test suites on every pull request before code is merged into the production branch
- C) To format hard drives
- D) To translate code to Python
**Answer:** B
**Explanation:** CI validates every incoming code change automatically, ensuring bugs, lint errors, and broken tests are caught before changes reach the shared codebase.

### Q2: Why is actions/setup-node@v4 configured with cache: "npm"?
- A) To delete the package.json file
- B) To cache npm package archives between pipeline runs, accelerating npm ci step from minutes down to seconds
- C) To encrypt the repository
- D) To bypass security scans
**Answer:** B
**Explanation:** Caching the package manager cache directory across workflow runs avoids re-downloading packages over the internet on every commit, speeding up CI builds.

### Q3: Why does the S3 sync command exclude index.html when setting max-age=31536000, immutable?
- A) S3 cannot store HTML files
- B) Hashed assets can be cached forever, but index.html must be cached with no-cache so users immediately receive new asset hashes when new versions deploy
- C) index.html is secret
- D) To delete index.html from the server
**Answer:** B
**Explanation:** Hashed JavaScript and CSS files are immutable and safe to cache for a year, but index.html must never be cached immutably or users will never see new deployments.

### Q4: What is the advantage of using GitHub OpenID Connect (OIDC) over long-lived AWS IAM Secret Keys?
- A) OIDC is slower
- B) OIDC issues short-lived, dynamically generated tokens for each workflow run without storing long-lived, leakable AWS secret keys in repository secrets
- C) OIDC does not require AWS
- D) OIDC only works on macOS
**Answer:** B
**Explanation:** OIDC eliminates the security hazard of static, long-lived cloud credentials stored in GitHub Secrets by exchanging cryptographically verified workflow tokens for temporary cloud access.

### Q5: What does a CloudFront cache invalidation command (aws cloudfront create-invalidation) achieve?
- A) It purges cached responses from all edge CDN points of presence, ensuring edge servers fetch the newly deployed index.html immediately
- B) It deletes the S3 bucket
- C) It closes the website
- D) It resets user passwords
**Answer:** A
**Explanation:** Invalidating CloudFront clears cached copies across global CDN nodes, ensuring edge locations serve fresh content without waiting for default cache expiration timers.

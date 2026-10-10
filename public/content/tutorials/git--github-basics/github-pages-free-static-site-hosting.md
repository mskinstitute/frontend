# Deploying Web Projects for Free using GitHub Pages

Building a frontend web application is exciting, but sharing it with friends, recruiters, and clients requires hosting. **GitHub Pages** is a free, blazing-fast static website hosting service integrated directly into GitHub repositories.

---

## 1. What is GitHub Pages?

GitHub Pages takes HTML, CSS, JavaScript, images, and static assets straight from a branch in your repository and publishes them live to the internet:
- **Free hosting**: Zero monthly hosting fees.
- **Automated SSL**: Free HTTPS certificates included out of the box.
- **Custom Domains**: Supports connecting your own domain (e.g. `portfolio.sumitsharma.dev`).
- **Default URL Format**:
  ```text
  https://<username>.github.io/<repository-name>/
  ```

> [!NOTE]
> GitHub Pages hosts **static frontends** only (HTML, CSS, JS, React client-side builds, Vite builds). It does **not** execute server-side backends like Python Django, Node.js Express, or PHP.

---

## 2. Deploying a Basic Website in 3 Steps

If your repository contains standard static files (`index.html`, `styles.css`, `app.js`):

### Step 1: Ensure `index.html` is at the Root
GitHub Pages looks for `index.html` as the default entry point of your site.

### Step 2: Push Your Code to GitHub
```bash
git add .
git commit -m "feat: complete portfolio layout"
git push origin main
```

### Step 3: Enable GitHub Pages in Repository Settings
1. On GitHub, navigate to your repository -> Click **Settings**.
2. In the left sidebar under "Code and automation", click **Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**.
   - Branch: Select **`main`** and folder **`/(root)`**.
   - Click **Save**.
4. Within 60 seconds, GitHub Actions builds and deploys your site! A green banner displays your live URL:
   `Your site is live at https://sumit-msk.github.io/my-portfolio/`.

---

## 3. Deploying React / Vite / Next.js Export Builds

For modern frontend frameworks that compile into a `dist/` or `out/` folder:

### Using GitHub Actions (Modern Workflow):
1. In Pages Settings, change **Source** to **GitHub Actions**.
2. Select the **Static HTML** or **Next.js** suggested template.
3. GitHub automatically creates a `.github/workflows/deploy.yml` workflow that builds and deploys your application on every push!

---

## 4. Configuring a Custom Domain

Want your project to run on `mycoolapp.com` instead of `.github.io`?
1. In GitHub Pages settings, enter your domain under **Custom domain** (e.g. `www.mycoolapp.com`).
2. Log into your DNS provider (GoDaddy, Namecheap, Cloudflare).
3. Create a **CNAME** record:
   - Host: `www`
   - Target / Value: `<your-username>.github.io`
4. Check **Enforce HTTPS** on GitHub for automatic SSL encryption.

---

## Practice Quiz

### Q1: What is GitHub Pages?
- A) A paid cloud server for running MySQL databases
- B) A free static website hosting service that publishes web files directly from a GitHub repository
- C) A social network for reading books
- D) An alternative to VS Code
**Answer:** B
**Explanation:** GitHub Pages turns any GitHub repository containing HTML, CSS, and client-side JavaScript into a live public website for free.

### Q2: What file must be present at the root of the selected branch for GitHub Pages to serve a site by default?
- A) `server.py`
- B) `index.html`
- C) `app.exe`
- D) `main.cpp`
**Answer:** B
**Explanation:** `index.html` is the universal web entry point that web servers (including GitHub Pages) search for when visitors load a root URL.

### Q3: What type of applications CANNOT be hosted on GitHub Pages?
- A) Pure HTML5 and CSS3 websites
- B) Client-side React / Vue single-page applications
- C) Server-side dynamic applications requiring active Node.js/Express, Python/Django, or database runtimes
- D) Portfolio landing pages
**Answer:** C
**Explanation:** GitHub Pages only serves static client assets. Backend servers that process server-side logic and connect directly to databases cannot run on Pages.

### Q4: What is the default URL format for a project hosted on GitHub Pages?
- A) `https://<username>.github.io/<repository-name>/`
- B) `https://github.com/<username>/<repo>/live`
- C) `https://<repo>.com`
- D) `ftp://github.pages/<username>`
**Answer:** A
**Explanation:** GitHub assigns each user a subdomain at `<username>.github.io`, followed by the repository path for project sites.

### Q5: Does GitHub Pages support free automated HTTPS encryption?
- A) No, SSL certificates cost $50/month
- B) Yes, GitHub automatically provisions and renews SSL/TLS certificates for both default and custom domains
- C) Only for enterprise accounts
- D) Only on Internet Explorer
**Answer:** B
**Explanation:** GitHub provides automatic, free SSL/TLS certificate issuance and renewal with an "Enforce HTTPS" toggle.

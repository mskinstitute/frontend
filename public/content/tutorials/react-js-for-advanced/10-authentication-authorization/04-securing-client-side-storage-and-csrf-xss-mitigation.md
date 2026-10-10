# Securing Client-Side Storage and CSRF / XSS Mitigation

Single-page applications are vulnerable to two primary client-side security threats: **Cross-Site Scripting (XSS)** and **Cross-Site Request Forgery (CSRF)**. Securing enterprise React codebases requires understanding data sanitization, Content Security Policies (CSP), and secure storage boundaries.

---

## 1. Cross-Site Scripting (XSS) in React

XSS occurs when an attacker tricks an application into executing malicious JavaScript inside a user's browser. While React's JSX automatically escapes strings (e.g. `{userInput}` escapes `<script>` tags to `&lt;script&gt;`), developers often bypass this protection inadvertently.

### Common XSS Vulnerabilities in React

#### Vulnerability 1: `dangerouslySetInnerHTML`
```tsx
// ❌ Dangerous: Raw user HTML injected directly into DOM
<div dangerouslySetInnerHTML={{ __html: userComment.rawText }} />

// ✅ Safe: Always sanitize with DOMPurify before injection
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment.rawText) }} />
```

#### Vulnerability 2: Dangerous `javascript:` URLs in Anchor Tags
```tsx
// ❌ Dangerous: If userWebsite is "javascript:alert(document.cookie)", clicking executes script!
<a href={userWebsite}>Visit Profile</a>

// ✅ Safe: Validate protocol whitelist
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
<a href={isSafeUrl(userWebsite) ? userWebsite : "#"}>Visit Profile</a>
```

---

## 2. Cross-Site Request Forgery (CSRF) Mitigation

CSRF occurs when a malicious website instructs a victim's browser to execute an unwanted action on a trusted application where the victim is currently authenticated via cookies.

```
Victim visits malicious-site.com
Malicious site triggers: <img src="https://bank.com/api/transfer?to=attacker&amt=5000" />
Browser automatically attaches bank.com session cookies!
```

### Mitigation Strategies
1. **`SameSite=Lax` or `SameSite=Strict` Cookie Attribute:** Blocks cross-site cookie transmission on third-party requests.
2. **Double Submit CSRF Token:** Server generates a random CSRF token in an accessible cookie, and client Axios interceptors mirror it into a custom header (`X-CSRF-Token`):
   ```ts
   apiClient.interceptors.request.use((config) => {
     const csrfToken = getCookie("CSRF-TOKEN");
     if (csrfToken && config.headers) {
       config.headers["X-CSRF-Token"] = csrfToken;
     }
     return config;
   });
   ```

---

## 3. Client Storage Comparison

| Storage Mechanism | XSS Vulnerability | Persistence | Size Limit | Automatic Cookie Transmission |
| :--- | :--- | :--- | :--- | :--- |
| **In-Memory Variable** | Highest safety (resets on reload) | Session/Tab lifetime | Memory bound | No |
| **`httpOnly` Cookie** | Protected from JavaScript access | Configurable | ~4 KB | Yes (on HTTP requests) |
| **`localStorage`** | **Vulnerable to any XSS** | Permanent | ~5-10 MB | No |
| **`sessionStorage`** | **Vulnerable to any XSS** | Tab lifetime | ~5 MB | No |

---

## 4. Content Security Policy (CSP)

A Content Security Policy header sent by the web server acts as the final line of defense against XSS by restricting which domains can execute scripts, connect to WebSockets, or load stylesheets:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.enterprise.com wss://api.enterprise.com;
```

---

## Practice Quiz

### Q1: How does React's default JSX syntax protect against Cross-Site Scripting (XSS)?
- A) It blocks network traffic on port 80
- B) It automatically escapes all strings rendered inside JSX expressions into safe HTML entities before injecting into the DOM
- C) It compiles all HTML to binary WebAssembly
- D) It deletes dangerous words from the dictionary
**Answer:** B
**Explanation:** React escapes strings rendered in JSX (converting < and > to safe entities), preventing injected HTML markup or scripts from executing.

### Q2: What security library should always be used to sanitize strings before passing to dangerouslySetInnerHTML?
- A) jQuery
- B) DOMPurify
- C) Lodash
- D) Axios
**Answer:** B
**Explanation:** DOMPurify is the industry-standard library that strips dangerous executable tags (<script>, onload attributes, javascript: URIs) while preserving safe HTML markup.

### Q3: Why is an <a href={userInput}> tag susceptible to XSS even in standard React?
- A) Because React does not allow anchor tags
- B) If the user inputs a URI starting with javascript: (e.g. javascript:stealTokens()), clicking the link executes malicious code in the browser context
- C) Because anchor tags bypass the Virtual DOM
- D) Because links are rendered by the server
**Answer:** B
**Explanation:** While React escapes inner text, href attributes accepting untrusted strings can execute malicious payloads if the string begins with the javascript: pseudo-protocol.

### Q4: How does the SameSite=Strict cookie attribute protect against CSRF attacks?
- A) It prevents the cookie from ever being sent on any cross-site request originating from a third-party website
- B) It deletes the cookie after 5 seconds
- C) It converts the cookie into a JWT token
- D) It encrypts the user's hard drive
**Answer:** A
**Explanation:** SameSite=Strict ensures the browser attaches the cookie strictly when navigation originates from the same origin, neutralizing cross-site request forgery.

### Q5: What is the primary function of a Content Security Policy (CSP) HTTP response header?
- A) It speeds up CSS animations
- B) It restricts the domains from which scripts, styles, images, and network connections can be loaded, blocking unauthorized script execution
- C) It provides password hashing
- D) It replaces the need for HTTPS
**Answer:** B
**Explanation:** CSP allows servers to specify trusted origins for scripts, assets, and connections, mitigating XSS attacks by preventing injected unauthorized scripts from executing or exfiltrating data.

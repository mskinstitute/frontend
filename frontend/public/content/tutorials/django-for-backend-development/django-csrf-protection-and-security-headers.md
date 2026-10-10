# CSRF Protection

**Cross-Site Request Forgery (CSRF)** is a critical web security vulnerability where a malicious third-party site tricks an authenticated user's browser into executing unauthorized mutations (e.g. changing passwords, transferring funds, or updating records) on a trusted application. Django includes an industry-leading, built-in CSRF defense framework.

---

## 1. How CSRF Attacks Work

```
1. User logs into https://bank.enterprise.com (Session cookie is set in browser)
2. In another tab, user visits https://malicious-site.com
3. Malicious site automatically submits hidden form:
   <form action="https://bank.enterprise.com/transfer" method="POST">
     <input name="amount" value="5000" />
     <input name="to_account" value="attacker_id" />
   </form>
4. Browser automatically attaches bank.enterprise.com cookies!
5. Without CSRF tokens: Bank executes unauthorized transfer!
```

---

## 2. Django's Defense: Synchronizer Token Pattern

Django stops CSRF using cryptographically secure **Synchronizer Tokens**:
- The server generates a unique secret token bound to the user's session or cookie.
- Every mutating HTML form must embed this token.
- `CsrfViewMiddleware` verifies that the submitted token matches the secret cookie. An attacker on an external domain cannot read or forge the token!

### In HTML Templates:
Every `<form method="POST">` **must** include `{% csrf_token %}`:

```django
<form method="POST" action="{% url 'articles:create' %}">
  {% csrf_token %} {# Injects hidden <input type="hidden" name="csrfmiddlewaretoken" value="..." /> #}
  <input type="text" name="title" required />
  <button type="submit">Publish</button>
</form>
```

If the token is missing or invalid on a POST request, Django immediately aborts and returns **403 Forbidden (CSRF verification failed)**.

---

## 3. Handling CSRF in AJAX & SPA Frontends (React / Axios)

Single Page Applications (React, Vue) sending JSON requests (`application/json`) cannot use HTML form inputs. Instead, Django places the CSRF token in a readable cookie (`csrftoken`), which the frontend sends in the `X-CSRFToken` HTTP header:

```python
# config/settings.py
# Set cookie to be accessible by client JavaScript for AJAX/React:
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "Lax"
```

In React / Axios:

```ts
import axios from "axios";

// Helper to extract cookie value
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

// Global Axios configuration: automatically attaches Django CSRF token
axios.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");
  if (csrfToken && config.headers) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});
```

---

## 4. Exempting Webhooks with `@csrf_exempt`

External incoming webhooks (e.g. Stripe, GitHub, Twilio) originate from third-party servers that do not possess browser sessions or CSRF tokens. Exempt these specific endpoints defensively:

```python
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

@csrf_exempt
def stripe_webhook_view(request):
    # Verify cryptographic signature using Stripe SDK instead of CSRF!
    ...
```

---

## Practice Quiz

### Q1: What does the {% csrf_token %} template tag render inside an HTML <form>?
- A) A JavaScript alert popup
- B) A hidden <input type="hidden" name="csrfmiddlewaretoken" value="..."> containing a cryptographically secure token
- C) A CSS stylesheet link
- D) An encrypted password field
**Answer:** B
**Explanation:** {% csrf_token %} renders a hidden HTML input containing the current session's CSRF token, which Django verifies upon form submission.

### Q2: Why does an attacker's website fail to send a valid CSRF token on behalf of a victim?
- A) Browsers prevent all HTTP POST requests
- B) The Same-Origin Policy prevents the attacker's external domain from reading the victim's cookies to extract the secret CSRF token
- C) CSRF tokens expire in 100 milliseconds
- D) Django blocks all foreign IP addresses
**Answer:** B
**Explanation:** The browser's Same-Origin Policy forbids third-party websites from reading cookies belonging to another domain, preventing attackers from acquiring the required CSRF token.

### Q3: Which HTTP header does Django inspect when receiving AJAX / React POST requests containing a CSRF token?
- A) X-Requested-With
- B) X-CSRFToken
- C) Authorization-CSRF
- D) Cookie-Verify
**Answer:** B
**Explanation:** Django's CsrfViewMiddleware checks both form POST payloads (csrfmiddlewaretoken) and the X-CSRFToken HTTP request header.

### Q4: When is it safe and acceptable to use the @csrf_exempt decorator?
- A) On the user login and registration forms
- B) Strictly on external third-party webhook endpoints (like Stripe payment callbacks) where requests originate server-to-server and authenticity is verified via HMAC signatures
- C) On all API endpoints to save time
- D) In production mode
**Answer:** B
**Explanation:** Only machine-to-machine webhook endpoints lacking browser sessions should be exempted, provided they independently verify authenticity using HMAC or cryptographic signatures.

### Q5: What setting determines whether the CSRF cookie can be read by JavaScript via document.cookie?
- A) CSRF_COOKIE_HTTPONLY
- B) CSRF_USE_SESSIONS
- C) CSRF_SECURE
- D) CSRF_COOKIE_AGE
**Answer:** A
**Explanation:** When CSRF_COOKIE_HTTPONLY is False (the default), JavaScript can read the token from document.cookie to attach it to outgoing AJAX headers.

# OAuth2 and Social Login Integration

Enterprise applications frequently delegate identity management to trusted identity providers (Google, GitHub, Microsoft, Okta) via the **OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange)**. PKCE is the gold-standard security protocol for single-page applications where client secrets cannot be securely stored.

---

## 1. Why PKCE is Mandatory for SPAs

In traditional OAuth 2.0, the backend uses a `client_secret` to exchange an authorization code for tokens. Because SPAs run entirely in the browser, any embedded secret is publicly readable via DevTools.

```
PKCE Protocol Flow:
1. Client generates high-entropy random string: 'code_verifier'
2. Client hashes verifier via SHA-256: 'code_challenge'
3. Client redirects to IdP: /authorize?code_challenge=xyz&code_challenge_method=S256
4. User logs in at IdP, IdP redirects back with '?code=auth_code_123'
5. Client sends: POST /token { code: auth_code_123, code_verifier: random_string }
6. IdP hashes code_verifier, matches against code_challenge, and issues tokens!
```

---

## 2. Generating PKCE Challenge in TypeScript

```ts
// utils/pkce.ts
function dec2hex(dec: number) {
  return ("0" + dec.toString(16)).substr(-2);
}

export function generateCodeVerifier(length = 64): string {
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  
  // Base64URL encode
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
```

---

## 3. Initiating Social Login (Google / GitHub)

```tsx
import React from "react";
import { generateCodeVerifier, generateCodeChallenge } from "./utils/pkce";

export function SocialLoginButtons() {
  const handleOAuthLogin = async (provider: "google" | "github") => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // Persist verifier temporarily in sessionStorage for callback verification
    sessionStorage.setItem("pkce_verifier", verifier);

    const endpoints = {
      google: "https://accounts.google.com/o/oauth2/v2/auth",
      github: "https://github.com/login/oauth/authorize",
    };

    const clientIds = {
      google: "ENTERPRISE_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      github: "ENTERPRISE_GITHUB_CLIENT_ID",
    };

    const params = new URLSearchParams({
      client_id: clientIds[provider],
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: "code",
      scope: provider === "google" ? "openid profile email" : "read:user user:email",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state: crypto.randomUUID(), // CSRF prevention token
    });

    // Redirect user to Identity Provider login page
    window.location.href = `${endpoints[provider]}?${params.toString()}`;
  };

  return (
    <div className="space-y-3 max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h2 className="text-white font-bold text-lg mb-4">Enterprise Single Sign-On</h2>

      <button
        onClick={() => handleOAuthLogin("google")}
        className="w-full py-2.5 px-4 bg-white text-slate-900 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition"
      >
        Continue with Google Workspace
      </button>

      <button
        onClick={() => handleOAuthLogin("github")}
        className="w-full py-2.5 px-4 bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition"
      >
        Continue with GitHub Enterprise
      </button>
    </div>
  );
}
```

---

## 4. Handling the OAuth Callback in React

```tsx
// pages/OAuthCallback.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const verifier = sessionStorage.getItem("pkce_verifier");

    if (!code || !verifier) {
      setError("Missing authorization code or PKCE verifier");
      return;
    }

    // Post authorization code and verifier to your application backend
    fetch("/api/auth/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, code_verifier: verifier }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("OAuth token exchange failed");
        return res.json();
      })
      .then((data) => {
        sessionStorage.removeItem("pkce_verifier");
        navigate("/dashboard");
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [searchParams, navigate]);

  if (error) {
    return <div className="p-8 text-rose-400">Authentication Error: {error}</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent mx-auto mb-4 rounded-full" />
        <p className="text-sm font-medium">Finalizing identity verification...</p>
      </div>
    </div>
  );
}
```

---

## Practice Quiz

### Q1: Why is OAuth 2.0 PKCE (Proof Key for Code Exchange) mandatory for Single Page Applications?
- A) SPAs cannot securely hide a client_secret because all client-side code and assets are exposed to the user
- B) PKCE increases CSS rendering performance
- C) Modern browsers ban standard OAuth
- D) PKCE converts OAuth responses to GraphQL
**Answer:** A
**Explanation:** Because SPAs execute in the user's browser, any embedded client secret can be inspected and extracted by malicious actors. PKCE replaces static client secrets with dynamically generated cryptographic challenges.

### Q2: What is the relationship between the code_verifier and code_challenge in PKCE?
- A) code_challenge is an encrypted copy of the user password
- B) code_challenge is the Base64URL-encoded SHA-256 hash of the random code_verifier string
- C) They are identical random strings
- D) code_verifier is generated on the server and sent to the client
**Answer:** B
**Explanation:** The client creates a high-entropy random string (code_verifier) and hashes it with SHA-256 to produce the code_challenge, which is sent to the IdP during the initial redirect.

### Q3: What is the purpose of the state query parameter in OAuth 2.0 authorization requests?
- A) To specify the user's geographical state/province
- B) To mitigate Cross-Site Request Forgery (CSRF) attacks by allowing the client to verify that the redirect matches the session that initiated the request
- C) To pass Redux state to Google
- D) To set the browser language
**Answer:** B
**Explanation:** The state parameter contains a unique cryptographically secure random token generated by the client. Comparing state upon return verifies that the authorization callback was initiated by this user session.

### Q4: Where should the code_verifier be stored while the browser is redirected to the external Identity Provider?
- A) In a public URL query parameter
- B) In sessionStorage or an in-memory session cookie on the client
- C) Hardcoded in package.json
- D) In the browser history title
**Answer:** B
**Explanation:** sessionStorage persists data across full-page navigations within the same tab while isolating it from other tabs and clearing it automatically when the tab closes.

### Q5: What error occurs if an attacker intercepts the authorization code and attempts to exchange it without the code_verifier?
- A) The IdP returns 200 OK
- B) The IdP rejects the exchange because the attacker cannot provide the un-hashed secret matching the original SHA-256 code_challenge
- C) The server shuts down
- D) The attacker receives a guest token
**Answer:** B
**Explanation:** Without the original code_verifier, the authorization server cannot verify the cryptographic challenge, stopping code injection and authorization interception attacks.

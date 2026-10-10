# JWT Authentication Flow and Silent Token Refresh

JSON Web Tokens (JWT) are the industry standard for stateless authentication in modern web applications. An enterprise authentication architecture requires a two-token system: short-lived **Access Tokens** (held in memory) and long-lived **Refresh Tokens** (stored in `httpOnly`, `SameSite=Strict` cookies) with automated silent token rotation via Axios or fetch interceptors.

---

## 1. The Two-Token Architecture

Storing access tokens in `localStorage` or `sessionStorage` exposes user credentials to **Cross-Site Scripting (XSS)** theft. Storing tokens exclusively in plain cookies exposes them to **Cross-Site Request Forgery (CSRF)**.

```
Enterprise Dual-Token Architecture:
┌────────────────────────┐                    ┌────────────────────────┐
│ Client (React App)     │                    │ Auth Backend (Node/DJ) │
└──────────┬─────────────┘                    └───────────┬────────────┘
           │  1. POST /api/auth/login                     │
           ├─────────────────────────────────────────────►│
           │  2. Returns: AccessToken (in JSON body)       │
           │     Sets: httpOnly RefreshToken cookie       │
           │◄─────────────────────────────────────────────┤
           │                                              │
           │  3. Authenticated API call with Bearer Token │
           ├─────────────────────────────────────────────►│
           │                                              │
           │  4. 401 Unauthorized (AccessToken expired)   │
           │◄─────────────────────────────────────────────┤
           │                                              │
           │  5. POST /api/auth/refresh (cookie attached) │
           ├─────────────────────────────────────────────►│
           │  6. Returns new AccessToken                  │
           │◄─────────────────────────────────────────────┤
           │                                              │
           │  7. Replays original failed API request      │
           ├─────────────────────────────────────────────►│
```

---

## 2. Axios Silent Refresh Interceptor

An enterprise Axios interceptor detects `401 Unauthorized` responses, queues pending outgoing requests, executes a silent refresh, and retries the original request seamlessly without logging the user out:

```ts
// api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.enterprise.com/v1",
  withCredentials: true, // Crucial: automatically includes httpOnly refresh cookies
});

// In-memory access token storage (isolated from XSS access to localStorage)
let memoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

// Request Interceptor: Injects Bearer token into headers
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (memoryAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`;
  }
  return config;
});

// Response Interceptor: Silent Token Refresh Queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Detect 401 and avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another request is already refreshing; queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Silent refresh request (cookie sent automatically via withCredentials)
        const refreshResponse = await axios.post<{ accessToken: string }>(
          "https://api.enterprise.com/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        setAccessToken(null);
        // Force redirect to login page on refresh token invalidation
        window.location.href = "/login?expired=true";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 3. Auth Context Provider

Wrap your application in an `AuthProvider` that initiates a silent refresh on initial application mount:

```tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, setAccessToken } from "./client";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial mount: check if refresh cookie exists by performing silent refresh
    apiClient
      .post<{ accessToken: string }>("/auth/refresh")
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await apiClient.post("/auth/logout");
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```

---

## Practice Quiz

### Q1: Why is storing JWT Access Tokens in localStorage considered an enterprise security vulnerability?
- A) LocalStorage is cleared whenever the browser restarts
- B) Any malicious third-party script injected via Cross-Site Scripting (XSS) can synchronously read localStorage and steal the credentials
- C) LocalStorage cannot store strings longer than 10 characters
- D) LocalStorage only works on mobile devices
**Answer:** B
**Explanation:** JavaScript running in the browser page has unrestricted read access to localStorage; if an XSS vulnerability exists, attackers can steal tokens directly.

### Q2: Why should Refresh Tokens be stored in httpOnly, SameSite=Strict cookies?
- A) httpOnly cookies cannot be read or accessed by client-side JavaScript, rendering them immune to XSS theft
- B) httpOnly cookies bypass HTTPS encryption
- C) httpOnly cookies can only be opened by Google Chrome
- D) httpOnly cookies compress payloads by 90%
**Answer:** A
**Explanation:** The httpOnly cookie flag prevents client-side scripts from accessing the cookie via document.cookie, protecting the refresh token from XSS exfiltration.

### Q3: What is the function of the failedQueue array in the Axios response interceptor?
- A) It holds error messages to display in red popups
- B) It holds requests that arrived while a silent token refresh was already in flight, allowing them to replay once the new token arrives
- C) It deletes rejected promises
- D) It disconnects the network socket
**Answer:** B
**Explanation:** If multiple concurrent requests fail with 401 simultaneously, the queue holds pending promises until a single refresh call completes, avoiding race conditions and duplicate refresh requests.

### Q4: What does withCredentials: true configure in Axios?
- A) It sends your local machine username to the server
- B) It instructs the browser to include cross-origin cookies (like the refresh token cookie) in outgoing HTTP requests
- C) It encrypts JSON payloads with AES-256
- D) It saves the response to disk
**Answer:** B
**Explanation:** withCredentials: true instructs the browser to send cookies, authorization headers, and TLS client certificates on cross-origin CORS requests.

### Q5: What should happen when the /auth/refresh endpoint itself returns a 401 or 403 error?
- A) The client should retry in an infinite loop every 10ms
- B) The refresh token is invalid or expired; the client must clear local auth state and redirect the user to the login screen
- C) The browser reboots
- D) The client displays a blank white screen
**Answer:** B
**Explanation:** If the refresh token is revoked or expired, silent renewal is impossible; the client must clear authentication state and redirect the user to authenticate again.

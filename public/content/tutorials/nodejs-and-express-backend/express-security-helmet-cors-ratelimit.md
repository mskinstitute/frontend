# Security Hardening: Helmet, CORS, Express Rate Limiting & HPP

Exposing an unhardened Express.js backend directly to the public internet invites automated bot attacks, DDoS floods, clickjacking, cross-site request forgery, and parameter pollution. Hardening your application with four industry-standard security middleware packages is mandatory for every production deployment.

---

## 1. The 4 Security Pillars

1. **Helmet (`helmet`):** Secures Express apps by setting 15+ HTTP response headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).
2. **CORS (`cors`):** Restricts cross-origin resource sharing so that only your designated frontend domains can access the API.
3. **Rate Limiting (`express-rate-limit`):** Throttles repetitive requests from identical IP addresses, thwarting brute-force login attacks and DoS floods.
4. **HPP (`hpp`):** Protects against HTTP Parameter Pollution attacks where attackers duplicate query parameters to bypass filters.

---

## 2. Production Security Configuration

```javascript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

const app = express();

// 1. HELMET: Set security HTTP headers
app.use(helmet());

// 2. CORS: Restrict API access to trusted frontend origins
const allowedOrigins = ['https://mskinstitute.com', 'https://admin.mskinstitute.com'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or matched domains
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true, // Allow cookies across origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

// 3. RATE LIMITING: Global and Route-Specific Throttling
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per IP per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false
});
app.use('/api', globalLimiter);

// Strict limiter for sensitive authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 failed login attempts per hour per IP!
  message: { error: 'Too many login attempts. Account temporarily locked for 1 hour.' }
});
app.use('/api/v1/auth/login', authLimiter);

// 4. Body parsing
app.use(express.json({ limit: '10kb' })); // Mitigate body flood attacks

// 5. HPP: Prevent HTTP Parameter Pollution (e.g. ?sort=name&sort=price)
app.use(hpp({
  whitelist: ['price', 'ratings', 'category'] // Allow duplicates for specific filter fields
}));
```

---

# Multiple Choice Questions

### 1. What is the primary purpose of the `helmet` package in an Express.js application?
A. It compiles React JSX templates.
B. It automatically configures essential HTTP security headers (like HSTS, X-Content-Type-Options, and X-Frame-Options) to protect against common web attacks.
C. It compresses database tables.
D. It validates credit card numbers.
**Answer:** B
**Explanation:** Helmet sets crucial HTTP response headers that protect clients and servers against clickjacking, MIME-type sniffing, and cross-site scripting attacks.
---

### 2. Why should an authentication route like `/api/auth/login` have a dedicated, strict rate limiter?
A. To prevent brute-force credential stuffing and password guessing attacks.
B. To delete expired user sessions automatically.
C. Because Node.js cannot handle more than 5 users.
D. To ensure passwords are stored in uppercase.
**Answer:** A
**Explanation:** Aggressive rate limiting on login routes prevents automated botnets from attempting thousands of password guesses against user accounts.
---

### 3. What does CORS (Cross-Origin Resource Sharing) control?
A. Database replication speeds between data centers.
B. Which origins (domains, protocols, and ports) are permitted by the browser to read responses from the backend API.
C. Node.js garbage collection intervals.
D. CSS stylesheet inheritance rules.
**Answer:** B
**Explanation:** CORS is a browser security mechanism that regulates whether web applications running at one origin can access resources from a different origin.
---

### 4. What vulnerability does the `hpp` (HTTP Parameter Pollution) middleware prevent?
A. Cross-site script injections inside SVG images.
B. Attackers injecting duplicate query string parameters (e.g., `?role=user&role=admin`) to bypass validation logic or crash query engines.
C. Memory leaks in the V8 engine.
D. DNS spoofing attacks.
**Answer:** B
**Explanation:** HTTP Parameter Pollution occurs when duplicate parameters turn a string into an unexpected array, potentially bypassing validation rules or manipulating queries.
---

### 5. What HTTP response status code is returned when a client exceeds the threshold set by `express-rate-limit`?
A. 400 Bad Request
B. 404 Not Found
C. 429 Too Many Requests
D. 503 Service Unavailable
**Answer:** C
**Explanation:** HTTP status code 429 Too Many Requests is the official RFC standard indicating that the user has sent too many requests in a given amount of time.
---

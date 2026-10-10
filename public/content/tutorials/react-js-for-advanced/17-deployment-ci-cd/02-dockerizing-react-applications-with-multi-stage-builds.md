# Dockerizing React Applications with Multi-Stage Builds

Containerization guarantees that a React application builds and runs identically across local development, staging environments, and production Kubernetes clusters. A naive Docker build copies all source code and `node_modules` into the final image, resulting in massive container images (>1.5 GB) riddled with security vulnerabilities. **Multi-Stage Docker Builds** isolate the Node.js build tools and compile static HTML/JS/CSS assets into a lightweight, ultra-secure Nginx container (<25 MB).

---

## 1. Multi-Stage Build Architecture

```
Stage 1: Build Environment (Node.js Alpine) - ~450 MB
├── Installs npm dependencies
├── Compiles TypeScript
├── Runs vite build
└── Generates /app/dist static folder
         │
         │ (Copies ONLY the compiled /dist folder!)
         ▼
Stage 2: Production Runtime (Nginx Alpine) - ~25 MB
├── Lightweight high-performance web server
├── No Node.js runtime, no npm, no source code!
└── Serves pre-compressed static assets at 10,000 req/sec
```

---

## 2. Production Dockerfile

```dockerfile
# ==========================================
# STAGE 1: Build Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source files and compile
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production Nginx Server
# ==========================================
FROM nginx:1.25-alpine AS runner

# Remove default nginx static html
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom enterprise Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Production Nginx Configuration (`nginx.conf`)

Single Page Applications require routing all non-file URL requests back to `index.html` to allow React Router to handle client-side routing. Without `try_files $uri $uri/ /index.html`, refreshing `/dashboard` returns a `404 Not Found`!

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Enable Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # SPA Fallback: Direct all unknown paths to index.html for client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Long-term immutable caching for hashed static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

---

## 4. Dockerignore Configuration (`.dockerignore`)

Prevent copying local build artifacts and sensitive files into the Docker context:

```
node_modules
dist
.git
.env
.env.local
npm-debug.log
.DS_Store
```

---

## 5. Building and Running the Container

```bash
# Build optimized image tagged as enterprise-react:latest
docker build -t enterprise-react:latest .

# Run container on port 8080
docker run -d -p 8080:80 --name react-app enterprise-react:latest
```

Inspect the final image with `docker images`: notice the image size is **under 25 MB**, with zero Node.js vulnerabilities!

---

## Practice Quiz

### Q1: What is the primary advantage of Multi-Stage Docker builds for React applications?
- A) It allows Docker to run on Windows 98
- B) It separates the heavy build environment (Node.js, npm, compilers) from the final runtime image (lightweight Nginx), reducing image size from ~1.5 GB down to ~25 MB and eliminating security vulnerabilities
- C) It converts React into PHP
- D) It bypasses Docker build steps
**Answer:** B
**Explanation:** Multi-stage builds compile assets in a temporary build stage and copy only the final static output into a clean Nginx container, resulting in tiny, secure production images.

### Q2: Why is try_files $uri $uri/ /index.html mandatory in an Nginx SPA configuration?
- A) It deletes broken HTML files
- B) In single-page applications, routes (like /dashboard or /profile) do not exist as physical files on disk; Nginx must fall back to serving index.html so React Router can process the route in the browser
- C) It enables SSL certificates
- D) It disables JavaScript
**Answer:** B
**Explanation:** Because SPAs use client-side routing, URLs do not correspond to physical files. Without the try_files fallback to index.html, browser refreshes on deep routes return HTTP 404 errors.

### Q3: Why is COPY package*.json ./ followed by RUN npm ci placed before COPY . . in the Dockerfile?
- A) To make the file look organized
- B) To exploit Docker layer caching: dependency installation layers are re-used unless package.json changes, drastically speeding up subsequent builds
- C) Because Docker cannot copy multiple files at once
- D) To prevent npm from downloading packages
**Answer:** B
**Explanation:** Docker caches each layer. If source code changes but package.json remains untouched, Docker reuses the cached npm ci layer, saving minutes of build time.

### Q4: Why is npm ci preferred over npm install in Docker builds?
- A) npm ci only works with CSS
- B) npm ci strictly installs dependencies matching the exact package-lock.json file, guaranteeing reproducible builds and deleting existing node_modules
- C) npm ci is slower
- D) npm ci creates git commits
**Answer:** B
**Explanation:** npm ci (clean install) enforces strict adherence to package-lock.json and fails if there is any mismatch, ensuring deterministic, reproducible builds in CI/CD.

### Q5: What security benefit is achieved by discarding the Node.js runtime from the final production container?
- A) It eliminates all Node.js and npm package vulnerabilities (CVEs) from the running production image, since only the static Nginx server is exposed
- B) It prevents users from viewing CSS
- C) It hides HTML source code
- D) It blocks all incoming HTTP traffic
**Answer:** A
**Explanation:** The production image contains no Node runtime, compilers, or dev dependencies, drastically shrinking the attack surface and passing enterprise container security scans.

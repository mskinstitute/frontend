# Production Optimization, Dockerization & Vercel Cloud Deployment

Shipping a Next.js application to production requires more than typing `npm run dev`. In this final masterclass tutorial, we optimize the production build, explore **standalone Docker containerization**, and deploy to global edge networks via **Vercel**.

---

## 1. Production Build Analysis

Before deploying, run the production build and analyze bundle sizes:

```bash
# Compile and optimize for production
npm run build

# Start local production server to test performance
npm run start
```

### Next.js Image Optimization (`next/image`)
Never use raw `<img>` tags in production. The `<Image />` component automatically:
- Resizes images based on client device screen width.
- Converts images on the fly to modern **WebP** and **AVIF** formats.
- Prevents Cumulative Layout Shift (CLS) by reserving space.
- Delivers lazy-loading by default.

---

## 2. Dockerizing Next.js with Standalone Output

For deployments to AWS ECS, Google Cloud Run, DigitalOcean, or Kubernetes, configure Next.js to produce a self-contained **standalone build**:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Automatically traces dependencies and creates minimal production folder!
};

module.exports = nextConfig;
```

### Multi-Stage Production `Dockerfile`:
```dockerfile
# 1. Dependency Stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Production Runner Stage (Ultra-lightweight ~120MB image!)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

---

## 3. Deploying to Vercel

Vercel is the native cloud platform created by the creators of Next.js:
1. Connect your GitHub repository to Vercel.
2. Vercel automatically detects Next.js settings, runs `npm run build`, and provisions global CDN edge networks.
3. Configure Environment Variables (`MONGODB_URI`, `AUTH_SECRET`) in Project Settings.
4. Enjoy instant preview deployments on every Git Pull Request and automatic production zero-downtime deployments on `main` push!

---

# Multiple Choice Questions

### 1. What does setting `output: 'standalone'` in `next.config.js` do?
A. It compiles Next.js into a single `.exe` file.
B. It automatically traces dependencies to produce a minimal `.next/standalone` folder containing only the exact files needed for production, drastically reducing Docker image size.
C. It allows Next.js to run without Node.js.
D. It disables database access.
**Answer:** B
**Explanation:** Standalone output leverages dependency tracing to produce an ultra-lean deployment artifact containing only necessary production node_modules and assets.
---

### 2. What advantages does the Next.js `<Image />` component offer over standard HTML `<img>` tags?
A. It requires Flash player.
B. It automatically serves modern formats (WebP/AVIF), resizes dynamically based on viewport, prevents layout shift, and lazy-loads off-screen images.
C. It converts images to ASCII art.
D. It prevents users from downloading images.
**Answer:** B
**Explanation:** Next.js `<Image />` automates responsive sizing, modern compression formats, and lazy loading to boost Core Web Vitals.
---

### 3. Why are Multi-Stage builds used in Dockerfiles for Node.js / Next.js?
A. To make the build script look more complex.
B. To separate devDependencies and build tools from the final runtime container, resulting in a significantly smaller, more secure production image.
C. Because Docker only allows 3 lines of code per stage.
D. To download Linux 3 times.
**Answer:** B
**Explanation:** Multi-stage builds discard compilers, test libraries, and intermediate artifacts, leaving only the compiled runtime files in a secure, minimal container.
---

### 4. Which command compiles and generates the optimized production build of a Next.js application?
A. `npm run dev`
B. `npm run build`
C. `npm test`
D. `npm start`
**Answer:** B
**Explanation:** `npm run build` analyzes components, compiles TypeScript, pre-renders static pages, and bundles production assets.
---

### 5. What happens during a Vercel Git-integrated deployment when a developer pushes a new feature branch?
A. The live production website is overwritten immediately.
B. Vercel automatically creates an isolated Preview Deployment with a unique URL, allowing the team to test changes before merging to production.
C. The git commit is rejected.
D. All database records are cleared.
**Answer:** B
**Explanation:** Vercel automatically generates unique preview URLs for each git branch and PR, enabling safe testing before production deployment.
---

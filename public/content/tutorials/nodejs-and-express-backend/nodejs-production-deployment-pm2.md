# Production Configuration, Environment Variables & PM2 Process Manager

Running `node server.js` in a terminal is fine for local testing, but deploying a raw command in production means the moment an uncaught exception occurs or the server machine restarts, your entire website goes offline. Professional Node.js production environments require **environment configuration management**, **graceful shutdown handling**, and a process manager like **PM2**.

---

## 1. Managing Environment Variables (`dotenv`)

Never hardcode database connection strings, API secrets, or ports in code:

```bash
# .env (NEVER commit to Git! Add to .gitignore)
PORT=5000
NODE_ENV=production
DATABASE_URL=mongodb+srv://admin:secret@cluster0.mongodb.net/prod_db
JWT_SECRET=c8d48291a9b24479e0f2b380d6b99
CORS_ORIGIN=https://mskinstitute.com
```

Load environment variables at the absolute entry point of your server:

```javascript
import 'dotenv/config';

const port = process.env.PORT || 5000;
console.log(`Running in ${process.env.NODE_ENV} mode on port ${port}`);
```

---

## 2. Why PM2 (Process Manager 2)?

PM2 is the production runtime process manager for Node.js:
- **Zero-Downtime Reloads:** Reloads updated code without dropping a single active client connection.
- **Cluster Mode:** Automatically spawns worker processes across all available CPU cores, bypassing the single-threaded limit!
- **Automatic Restarts:** Instantly revives dead worker instances upon crashes or memory leaks.
- **System Startup Hook:** Configures systemd/init scripts so the application reboots automatically if the server machine restarts.

---

## 3. Configuring PM2 with `ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [
    {
      name: 'msk-backend-api',
      script: './src/server.js',
      instances: 'max', // Spawns 1 process per CPU core!
      exec_mode: 'cluster',
      autorestart: true,
      watch: false, // Do NOT watch files in production
      max_memory_restart: '1G', // Restart worker if memory exceeds 1 GB
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

---

## 4. Essential PM2 CLI Commands

```bash
# Start application in cluster mode using configuration
pm2 start ecosystem.config.cjs --env production

# View real-time cluster status and memory usage
pm2 status

# Real-time streaming log viewer
pm2 logs msk-backend-api

# Zero-downtime rolling code reload
pm2 reload msk-backend-api

# Generate OS system startup script
pm2 startup
pm2 save
```

---

# Multiple Choice Questions

### 1. What is the primary benefit of running PM2 in `cluster` mode with `instances: 'max'`?
A. It changes JavaScript from interpreted to compiled C++.
B. It spawns multiple instances of your Node.js application across all available CPU cores to maximize throughput and utilize multithreading.
C. It eliminates the need for database indexes.
D. It forces all requests to run through port 80 only.
**Answer:** B
**Explanation:** Because Node.js is single-threaded, cluster mode allows an 8-core server to run 8 worker instances sharing the same TCP port, utilizing 100% of available CPU power.
---

### 2. Why should the `.env` file containing secrets never be committed to a public or team Git repository?
A. Git cannot parse files that start with a dot.
B. It leaks sensitive credentials, API keys, and database passwords, posing an extreme security breach.
C. It causes merge conflicts in package.json.
D. Git will convert all numbers inside .env to zeros.
**Answer:** B
**Explanation:** Committing credentials to source control exposes production infrastructure to unauthorized access, leaks, and catastrophic data breaches.
---

### 3. What command configures PM2 to automatically revive all registered applications upon server machine reboot?
A. `pm2 reboot-all`
B. `pm2 startup && pm2 save`
C. `npm run auto-start`
D. `systemctl restart node`
**Answer:** B
**Explanation:** `pm2 startup` generates and registers a system boot script (e.g. systemd), and `pm2 save` snapshots the current process list to restart on reboot.
---

### 4. What is the advantage of `pm2 reload` over `pm2 restart` during a production deployment?
A. `pm2 reload` performs a zero-downtime rolling restart, reloading workers sequentially so active incoming requests are never dropped.
B. `pm2 reload` updates Node.js to the latest version.
C. `pm2 reload` wipes the database clean.
D. There is no difference between the two commands.
**Answer:** A
**Explanation:** `pm2 reload` restarts workers one by one in a rolling fashion, ensuring there is always at least one active process ready to handle client traffic.
---

### 5. What does the `max_memory_restart: '1G'` setting in PM2 do?
A. It allocates a guaranteed 1GB of GPU memory to Express.
B. It monitors worker process RAM consumption and automatically restarts any worker that exceeds 1GB, mitigating slow memory leaks.
C. It restricts the maximum file upload size to 1GB.
D. It deletes files larger than 1GB from the server disk.
**Answer:** B
**Explanation:** Automatic memory restarts protect long-running services against memory leaks by cleanly cycling processes that cross designated RAM thresholds.
---

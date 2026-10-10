# File System Operations: Sync, Async & Promises API (fs/promises)

File system manipulation is a daily responsibility for backend engineers: reading configurations, saving user uploads, processing log files, and streaming large datasets. Node.js provides three distinct flavors of the **`fs` (File System)** module: **Synchronous**, **Callback-based Asynchronous**, and **Promises-based Asynchronous (`fs/promises`)**.

---

## 1. The Three `fs` API Flavors

### 1. Synchronous (`fs.readFileSync`) - **AVOID IN REQUEST HANDLERS**
Blocks the entire Event Loop until the disk read finishes. Permissible ONLY during initial server boot to load config files.

```javascript
// DO NOT DO THIS inside an Express route handler!
const data = fs.readFileSync('/var/log/system.log', 'utf8');
```

### 2. Callback-based (`fs.readFile`)
The historical Node.js pattern; executes asynchronously without blocking the main thread.

```javascript
fs.readFile('./config.json', 'utf8', (err, data) => {
  if (err) return console.error('Read failed:', err);
  console.log('Config:', JSON.parse(data));
});
```

### 3. Modern Promises API (`node:fs/promises`) - **RECOMMENDED STANDARD**
Clean, modern, fully non-blocking, and seamlessly integrated with `async / await`:

```javascript
import fs from 'node:fs/promises';
import path from 'node:path';

async function manageUserData(user) {
  const filePath = path.join(process.cwd(), 'data', `user-${user.id}.json`);

  // 1. Write file with pretty-printed JSON
  await fs.writeFile(filePath, JSON.stringify(user, null, 2), 'utf8');

  // 2. Read file back
  const rawData = await fs.readFile(filePath, 'utf8');
  const parsedUser = JSON.parse(rawData);

  // 3. Append to activity log
  await fs.appendFile(
    path.join(process.cwd(), 'data', 'activity.log'),
    `[${new Date().toISOString()}] User ${user.id} updated\n`
  );

  return parsedUser;
}
```

---

## 2. Directory and Metadata Operations

Node.js offers complete control over file system trees and permissions:

```javascript
import fs from 'node:fs/promises';

async function fileOperationsDemo() {
  // Check if directory exists; create recursively if missing
  await fs.mkdir('./uploads/avatars', { recursive: true });

  // Inspect file metadata (size, creation time, permissions)
  const stats = await fs.stat('./package.json');
  console.log('File size in bytes:', stats.size);
  console.log('Is directory?', stats.isDirectory());
  console.log('Last modified:', stats.mtime);

  // Read all files in a directory
  const files = await fs.readdir('./src');
  console.log('Source files:', files);

  // Safely delete a file
  await fs.unlink('./temp.txt').catch(err => {
    if (err.code !== 'ENOENT') throw err; // Ignore if file already doesn't exist
  });
}
```

---

# Multiple Choice Questions

### 1. Which Node.js file system API is the modern industry standard for use with `async/await`?
A. `node:fs/sync`
B. `node:fs/promises`
C. `node:fs/callbacks`
D. `node:fs/streams-only`
**Answer:** B
**Explanation:** `node:fs/promises` provides asynchronous, Promise-returning file system methods designed specifically for `async/await` syntax.
---

### 2. Why is using synchronous methods like `fs.readFileSync()` considered a critical anti-pattern inside an Express.js route handler?
A. It throws an uncatchable syntax error.
B. It blocks the single Node.js main thread for all connected clients during the disk read operation.
C. It permanently corrupts the hard drive.
D. Synchronous methods cannot read UTF-8 strings.
**Answer:** B
**Explanation:** Because Node.js handles requests on a single main thread, any synchronous I/O blocks the event loop, preventing all other concurrent HTTP requests from being served.
---

### 3. How do you create nested directories (e.g., `uploads/2026/invoices`) without throwing an error if intermediate parent directories do not exist?
A. `fs.mkdir('./uploads/2026/invoices', { recursive: true })`
B. `fs.createFolderHierarchy('./uploads/2026/invoices')`
C. `fs.deepMake('./uploads/2026/invoices')`
D. Set `process.env.RECURSIVE_MKDIR = true`
**Answer:** A
**Explanation:** Passing `{ recursive: true }` to `fs.mkdir()` or `fs.promises.mkdir()` creates all missing parent directories automatically without error.
---

### 4. What does the `fs.stat()` method return?
A. The number of lines in a text file.
B. A `Stats` object containing file metadata such as file size, creation timestamp, last modified time, and file type flags.
C. A list of active network connections to the file.
D. The SQL schema of the file.
**Answer:** B
**Explanation:** `fs.stat()` retrieves file system metadata, exposing properties like `.size`, `.mtime`, `.isDirectory()`, and `.isFile()`.
---

### 5. Which method from `fs/promises` deletes a file from the file system?
A. `fs.delete()`
B. `fs.remove()`
C. `fs.unlink()`
D. `fs.drop()`
**Answer:** C
**Explanation:** In UNIX and Node.js file systems, the standard method to delete a file is `fs.unlink()`.
---

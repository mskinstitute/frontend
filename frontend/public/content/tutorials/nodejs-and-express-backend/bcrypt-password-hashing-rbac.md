# Password Hashing with Bcrypt & Role-Based Access Control (RBAC)

Storing plaintext passwords in a database is an egregious security violation. In this tutorial, we implement military-grade password hashing with **Bcrypt** and implement **Role-Based Access Control (RBAC)** to restrict sensitive endpoints based on user permissions.

---

## 1. Why Bcrypt? (Salting & Adaptive Work Factors)

MD5 and SHA-256 are designed to be fast, making them vulnerable to modern GPU brute-force attacks capable of testing billions of hashes per second.

**Bcrypt** counters this with two essential security features:
1. **Cryptographic Salt:** Appends random bytes to the password before hashing, preventing Rainbow Table lookup attacks.
2. **Adaptive Work Factor (Cost Factor):** Allows developers to slow down the algorithm exponentially. A cost factor of `12` means an attacker takes hundreds of milliseconds per guess on high-end hardware, making brute force economically impossible.

```javascript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash password before saving to database
export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compare password during login
export async function verifyPassword(plainPassword, storedHash) {
  return await bcrypt.compare(plainPassword, storedHash);
}
```

---

## 2. Role-Based Access Control (RBAC) Architecture

RBAC restricts resource access based on assigned organizational roles (e.g., `student`, `instructor`, `admin`, `superadmin`).

```text
Incoming Request -> [ Authenticate JWT ] -> [ RestrictTo('admin', 'instructor') ] -> [ Controller ]
```

### Implementing the Authorization Guard:

```javascript
// src/middleware/authorize.js
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user was populated by prior authentication middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Forbidden: You do not have permission to perform this action. Required: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};
```

---

## 3. Protecting Admin Endpoints

```javascript
import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/authorize.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// 1. Any logged-in user can view their own profile
router.get('/me', protectRoute, userController.getMyProfile);

// 2. ONLY users with role 'admin' can delete other user accounts
router.delete('/:id', protectRoute, restrictTo('admin'), userController.deleteUser);

// 3. Instructors or Admins can publish courses
router.post('/courses', protectRoute, restrictTo('instructor', 'admin'), userController.createCourse);

export default router;
```

---

# Multiple Choice Questions

### 1. Why are fast hashing algorithms like SHA-256 unsuitable for storing user passwords compared to Bcrypt?
A. SHA-256 is deprecated by the W3C.
B. High-speed GPUs can compute billions of SHA-256 hashes per second, making brute-force and dictionary attacks trivial.
C. SHA-256 cannot hash strings longer than 8 characters.
D. SHA-256 only works on Windows.
**Answer:** B
**Explanation:** Bcrypt is intentionally CPU/memory intensive with an adjustable work factor, thwarting brute-force cracking on high-speed hardware.
---

### 2. What is a "Salt" in password hashing?
A. A cookie sent to the client browser.
B. Random cryptographically secure data added to the password prior to hashing, ensuring identical passwords generate unique hashes.
C. A database indexing algorithm.
D. A CSS background pattern.
**Answer:** B
**Explanation:** Salts ensure that even if two users choose the same password ("password123"), their resulting Bcrypt hashes are completely distinct, defeating rainbow table attacks.
---

### 3. What does `bcrypt.compare(candidatePassword, userHash)` return?
A. The user's plaintext password.
B. A Promise resolving to `true` if the password matches the hash, or `false` otherwise.
C. An encrypted integer.
D. An HTTP 200 response object.
**Answer:** B
**Explanation:** `bcrypt.compare()` safely extracts the salt from the hash, hashes the candidate password, and performs a constant-time comparison returning a boolean.
---

### 4. In Role-Based Access Control (RBAC), what HTTP status code indicates that the authenticated user lacks sufficient permissions for a requested resource?
A. 400 Bad Request
B. 401 Unauthorized
C. 403 Forbidden
D. 404 Not Found
**Answer:** C
**Explanation:** HTTP 403 Forbidden explicitly indicates the client is recognized and authenticated, but lacks permissions to execute the requested operation.
---

### 5. What is the recommended default salt work factor (cost) for Bcrypt in modern web applications?
A. 1
B. 4
C. 10 to 12
D. 500
**Answer:** C
**Explanation:** A cost factor of 10 to 12 provides a strong balance, taking approximately 100–300ms per hash on modern server hardware without degrading user login experience.
---

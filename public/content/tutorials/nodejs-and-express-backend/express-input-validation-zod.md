# Input Validation & Data Sanitization with Joi or Zod

Never trust client input. Accepting unsanitized, unvalidated data directly into database queries or business operations leads to SQL/NoSQL injection, cross-site scripting (XSS), prototype pollution, and application crashes. In modern Node.js and TypeScript architectures, **Zod** has emerged as the premier schema validation library.

---

## 1. Why Zod?

- **TypeScript-First:** Static type inference is derived directly from the runtime schema (`z.infer<typeof schema>`), eliminating duplicate type declarations.
- **Zero Dependencies:** Extremely fast, lightweight, and works seamlessly on both Node.js backends and browser frontends.
- **Composable & Declarative:** Intuitive chainable validators for strings, numbers, arrays, and nested objects.

---

## 2. Defining a Zod Validation Schema

```javascript
import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address format')
      .toLowerCase()
      .trim(),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),

    age: z
      .number()
      .int()
      .min(18, 'Must be at least 18 years old')
      .optional()
  })
});
```

---

## 3. Creating a Reusable Validation Middleware

```javascript
// src/middleware/validate.js
export const validate = (schema) => async (req, res, next) => {
  try {
    // Validate params, query, and body against the schema
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });

    // Replace req properties with clean, sanitized, coerced data
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;

    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.').replace('body.', ''),
        message: err.message
      }));

      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
    next(error);
  }
};
```

---

## 4. Applying Validation to Routes

```javascript
import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerUserSchema } from '../schemas/user.schema.js';
import { registerUser } from '../controllers/auth.controller.js';

const router = Router();

// Route is protected: invalid payloads are rejected BEFORE hitting the controller!
router.post('/register', validate(registerUserSchema), registerUser);

export default router;
```

---

# Multiple Choice Questions

### 1. What is the primary advantage of validating request input with a library like Zod or Joi before hitting the controller?
A. It speeds up CSS rendering on mobile devices.
B. It rejects malformed, incomplete, or malicious payloads at the API boundary, guaranteeing that controllers receive only clean, expected data.
C. It allows databases to run without indexes.
D. It eliminates the need for HTTP status codes.
**Answer:** B
**Explanation:** Schema validation acts as a secure boundary guard, preventing corrupt or malicious data from reaching controllers and database layers.
---

### 2. How can TypeScript types be inferred directly from a Zod schema without writing manual interfaces?
A. `type MyType = z.infer<typeof mySchema>;`
B. `type MyType = mySchema.toTypeScript();`
C. `type MyType = eval(mySchema);`
D. `type MyType = typeof mySchema.types;`
**Answer:** A
**Explanation:** `z.infer<typeof schema>` automatically extracts the TypeScript static type from the runtime Zod schema definition.
---

### 3. Which HTTP status code is standard when a request payload fails schema validation rules?
A. 200 OK
B. 400 Bad Request (or 422 Unprocessable Entity)
C. 500 Internal Server Error
D. 502 Bad Gateway
**Answer:** B
**Explanation:** Client validation failures are client-side errors represented by `400 Bad Request` or `422 Unprocessable Entity`.
---

### 4. What does the `.trim()` and `.toLowerCase()` transformers on a Zod string accomplish?
A. They convert the string into a binary image.
B. They sanitize and normalize the input value automatically during the parsing phase.
C. They delete the string from memory.
D. They translate the string into French.
**Answer:** B
**Explanation:** Zod transformers like `.trim()` and `.toLowerCase()` sanitize incoming data before it is handed off to subsequent middleware and controllers.
---

### 5. What method on a Zod schema validates data asynchronously and throws a `ZodError` if validation fails?
A. `schema.parseAsync(data)`
B. `schema.runCheck(data)`
C. `schema.test(data)`
D. `schema.assertValid(data)`
**Answer:** A
**Explanation:** `schema.parseAsync()` parses and validates data asynchronously, throwing a `ZodError` with detailed issue descriptions if validation criteria are not met.
---

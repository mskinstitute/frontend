# JSON Schema Validation in Modern JavaScript

In client-server architectures, relying solely on TypeScript type declarations is insufficient because **TypeScript types are completely erased at runtime**. When receiving JSON from untrusted external APIs, third-party webhooks, or user forms, runtime **JSON Schema Validation** (using libraries like Ajv or Zod) guarantees data integrity and security.

---

## 1. What is JSON Schema?

**JSON Schema** is a formal, language-agnostic IETF standard for annotating and validating JSON documents:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UserRegistrationPayload",
  "type": "object",
  "properties": {
    "username": { "type": "string", "minLength": 3, "maxLength": 30 },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 18 },
    "roles": {
      "type": "array",
      "items": { "type": "string", "enum": ["user", "editor", "admin"] }
    }
  },
  "required": ["username", "email"],
  "additionalProperties": false
}
```

---

## 2. Validating with Ajv (Another JSON Schema Validator)

**Ajv** is the industry standard in JavaScript and Node.js for high-speed schema compilation:

```javascript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Enable email, uri, date-time formats

const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['admin', 'member'] }
  },
  required: ['name', 'email', 'role'],
  additionalProperties: false
};

// Compile schema into high-speed validator function
const validateUser = ajv.compile(userSchema);

// Validating data
const incomingData = {
  name: 'A', // Too short!
  email: 'not-an-email', // Invalid format!
  role: 'superadmin', // Not in enum!
  hackedField: true // Not allowed by additionalProperties: false!
};

const isValid = validateUser(incomingData);

if (!isValid) {
  console.error('Validation Errors:', validateUser.errors);
  // Prints detailed structured error list!
} else {
  console.log('Payload is safe and valid.');
}
```

---

## 3. Why `"additionalProperties": false` is Critical for Security

In REST endpoints and webhooks, attackers often submit unexpected payload keys (e.g. `isAdmin: true` or `balance: 999999`). This vulnerability is known as **Mass Assignment**.

Setting `"additionalProperties": false` ensures that any payload containing undeclared fields is immediately rejected!

```
Incoming Request ──► Contains { id: 1, role: 'admin' }
                            │
               Schema: additionalProperties: false
                            │
                            ▼
               REJECTED! Unknown property 'role' blocked!
```

---

## 4. JSON Schema vs. TypeScript

| Dimension | TypeScript Interface | JSON Schema / Runtime Validator |
| :--- | :--- | :--- |
| **Execution Phase** | Compile time only | Runtime (evaluates live JSON over network) |
| **Runtime Footprint** | 0 bytes (Erased from JS output) | Validates live API responses and webhooks |
| **Constraint Depth** | Types only (`string`, `number`) | Constraints (`minLength`, regex `pattern`, `minimum`) |

---

## Practice Quiz

### Q1: Why is TypeScript alone insufficient for validating incoming JSON API responses?
- A) TypeScript does not support JSON
- B) TypeScript types are erased during compilation; they provide zero runtime verification of incoming network data
- C) TypeScript is slower than JavaScript
- D) TypeScript only works in Node.js
**Answer:** B
**Explanation:** TypeScript types exist only during compilation. At runtime, external payloads must be validated by runtime libraries to catch malformed data.

### Q2: What does additionalProperties: false enforce in a JSON Schema?
- A) It prevents the object from having any properties
- B) It rejects payloads that contain fields not explicitly declared in the properties definition (preventing Mass Assignment attacks)
- C) It freezes the object in memory
- D) It converts arrays to objects
**Answer:** B
**Explanation:** `"additionalProperties": false` forbids any undeclared keys from appearing in the payload, protecting against unexpected property injection.

### Q3: What library is the industry benchmark for high-performance JSON Schema compilation and validation in Node.js and the browser?
- A) Lodash
- B) Ajv
- C) Axios
- D) Express
**Answer:** B
**Explanation:** Ajv (Another JSON Schema Validator) compiles schemas into optimized JavaScript code for near-instant validation.

### Q4: Which schema constraint ensures a string matches an email format in standard JSON Schema?
- A) "type": "email"
- B) "format": "email"
- C) "validate": "email"
- D) "isEmail": true
**Answer:** B
**Explanation:** In JSON Schema specifications, semantic string formats are specified using the `"format"` keyword (e.g. `"format": "email"`, `"format": "date-time"`).

### Q5: In an Ajv validation instance, what property contains the list of validation failure descriptions when validate(data) returns false?
- A) validate.errors
- B) validate.failures
- C) validate.messages
- D) validate.stack
**Answer:** A
**Explanation:** When validation returns `false`, `validate.errors` contains an array of error objects detailing which constraints failed.

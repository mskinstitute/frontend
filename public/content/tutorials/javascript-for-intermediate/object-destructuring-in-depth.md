# Object Destructuring in Depth in Modern JavaScript

Object destructuring is a powerful syntax introduced in ES6 that allows you to extract properties from objects and bind them to distinct variables. Mastering advanced destructuring techniques—including default values, aliasing, nested pattern matching, and function parameter destructuring—is fundamental for writing concise modern JavaScript.

---

## 1. Property Renaming (Aliasing)

When extracting a property, you can assign it to a variable with a different name using the syntax `{ propertyName: newVariableName }`:

```javascript
const apiResponse = {
  usr_id: 'usr_9481',
  fst_nm: 'Priya',
  lst_nm: 'Sharma'
};

// Destructure and rename to clean camelCase variables
const {
  usr_id: id,
  fst_nm: firstName,
  lst_nm: lastName
} = apiResponse;

console.log(id);        // 'usr_9481'
console.log(firstName); // 'Priya'
```

---

## 2. Default Values with Fallbacks

You can specify fallback values that apply only if the extracted property is strictly `undefined`:

```javascript
const userProfile = {
  username: 'alex_code',
  role: 'editor',
  theme: undefined // Explicitly undefined
};

const {
  username,
  role = 'subscriber',
  theme = 'system-default',
  avatarUrl = '/images/default-avatar.png'
} = userProfile;

console.log(theme);     // 'system-default' (Fell back because value was undefined)
console.log(avatarUrl); // '/images/default-avatar.png' (Key did not exist)
```

> **Note:** Default values trigger **only** on `undefined`. Values of `null`, `false`, `0`, or `""` are considered defined and will **not** trigger the fallback default!

---

## 3. Combining Renaming and Default Values

You can rename a variable and supply a default value in the same statement:

```javascript
const settings = {
  max_retry: null,
  timeout_ms: undefined
};

const {
  timeout_ms: timeout = 3000,
  max_retry: retries = 5
} = settings;

console.log(timeout); // 3000 (undefined -> fallback triggered)
console.log(retries); // null (null is defined -> NO fallback!)
```

---

## 4. Deep Nested Destructuring

Destructuring patterns can mirror complex nested structures to extract deeply nested values in a single step:

```javascript
const enterpriseOrder = {
  orderId: 'ORD-774',
  customer: {
    name: 'Apex Corp',
    billingAddress: {
      city: 'Seattle',
      postal: '98101'
    }
  }
};

// Extract city directly from deep structure
const {
  customer: {
    billingAddress: { city, postal }
  }
} = enterpriseOrder;

console.log(city);   // 'Seattle'
console.log(postal); // '98101'
// Note: 'customer' and 'billingAddress' variables are NOT created!
```

---

## 5. Function Parameter Destructuring with Defaults

Destructuring function parameters creates self-documenting APIs with named arguments and default configurations:

```javascript
// Clean options configuration pattern
function createDatabaseConnection({
  host = 'localhost',
  port = 5432,
  database,
  ssl = true
} = {}) { // '= {}' prevents error if no argument is passed!
  console.log(`Connecting to ${database} at ${host}:${port} (SSL: ${ssl})`);
}

// Usage:
createDatabaseConnection({
  database: 'analytics_prod',
  ssl: false
});
// Connecting to analytics_prod at localhost:5432 (SSL: false)

// Calling with no arguments uses all defaults safely:
createDatabaseConnection(); 
// Connecting to undefined at localhost:5432 (SSL: true)
```

---

## Practice Quiz

### Q1: In const { status: code } = response;, what variable name is created in scope?
- A) status
- B) code
- C) Both status and code
- D) response.status
**Answer:** B
**Explanation:** The syntax `{ propertyName: newVariableName }` extracts the value of `status` from `response` and creates a local variable named `code`.

### Q2: When does a default value in object destructuring (const { port = 8080 } = config;) trigger?
- A) Whenever config.port is null, false, or 0
- B) Strictly when config.port is undefined
- C) Only when config is an empty string
- D) Whenever config.port is NaN
**Answer:** B
**Explanation:** Default values in destructuring are evaluated strictly when the property evaluates to `undefined`.

### Q3: What is the output of const { name = 'Anonymous' } = { name: null }?
- A) 'Anonymous'
- B) null
- C) undefined
- D) TypeError
**Answer:** B
**Explanation:** Because `name` is explicitly set to `null` (not `undefined`), the default fallback is not triggered, and `null` is assigned.

### Q4: Why is = {} added to function configure({ timeout = 5000 } = {})?
- A) To force synchronous execution
- B) To allow the function to be called without arguments (configure()) without throwing a TypeError
- C) To bind the function's this context
- D) To convert arguments into an Array
**Answer:** B
**Explanation:** If no argument is passed to `configure()`, the parameter defaults to `{}`. Without `= {}`, attempting to destructure `undefined` would throw `TypeError: Cannot destructure property of undefined`.

### Q5: In nested destructuring const { user: { email } } = account;, which variable is declared in scope?
- A) user only
- B) email only
- C) Both user and email
- D) account.user
**Answer:** B
**Explanation:** In nested destructuring, intermediate parent keys like `user` define the structural path only; only the leaf variables (`email`) are declared in the local scope.

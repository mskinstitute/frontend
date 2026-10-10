# Factory & Builder Patterns in Modern JavaScript

As software systems grow in complexity, instantiating objects using raw `new` constructor calls with dozens of parameters leads to unwieldy code. The **Factory Pattern** and the **Builder Pattern** are creational patterns that abstract and organize complex object construction.

---

## 1. The Factory Pattern

The **Factory Pattern** provides an interface for creating objects without specifying their exact concrete classes, delegating the instantiation logic based on parameters or environment conditions:

```javascript
class EmailNotification {
  send(user, msg) { console.log(`[Email to ${user.email}]: ${msg}`); }
}

class SMSNotification {
  send(user, msg) { console.log(`[SMS to ${user.phone}]: ${msg}`); }
}

class PushNotification {
  send(user, msg) { console.log(`[Push to Device ${user.deviceId}]: ${msg}`); }
}

// Factory Class
class NotificationFactory {
  static createNotification(channel) {
    switch (channel.toLowerCase()) {
      case 'email': return new EmailNotification();
      case 'sms':   return new SMSNotification();
      case 'push':  return new PushNotification();
      default:
        throw new Error(`Unsupported notification channel: "${channel}"`);
    }
  }
}

// Consumer code does not depend on concrete classes:
const service = NotificationFactory.createNotification('sms');
service.send({ phone: '+1-555-0199' }, 'Your verification code is 4920');
```

---

## 2. The Builder Pattern

The **Builder Pattern** separates the construction of a complex object from its representation, allowing the same construction process to create various representations using **fluent method chaining**:

### Solving the "Telescoping Constructor" Anti-Pattern:
```javascript
// ANTI-PATTERN: Telescoping constructor with 7 parameters (confusing & error-prone!)
// new HttpRequest('https://api.com', 'POST', null, { 'Auth': '...' }, 5000, true, 'json');
```

### Clean Builder Pattern Implementation:
```javascript
class HttpRequest {
  constructor(builder) {
    this.url = builder.url;
    this.method = builder.method;
    this.headers = builder.headers;
    this.body = builder.body;
    this.timeout = builder.timeout;
    this.requiresAuth = builder.requiresAuth;
  }

  async execute() {
    console.log(`Sending ${this.method} to ${this.url}`);
    return fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body ? JSON.stringify(this.body) : undefined
    });
  }
}

class HttpRequestBuilder {
  constructor(url) {
    this.url = url;
    this.method = 'GET';
    this.headers = {};
    this.body = null;
    this.timeout = 3000;
    this.requiresAuth = false;
  }

  setMethod(method) {
    this.method = method.toUpperCase();
    return this; // Return 'this' for fluent chaining!
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  setBody(data) {
    this.body = data;
    this.headers['Content-Type'] = 'application/json';
    return this;
  }

  setTimeout(ms) {
    this.timeout = ms;
    return this;
  }

  requireAuth() {
    this.requiresAuth = true;
    return this;
  }

  // Final Step: Builds the HttpRequest object!
  build() {
    return new HttpRequest(this);
  }
}

// Usage: Fluent, self-documenting code
const request = new HttpRequestBuilder('https://api.example.com/v1/users')
  .setMethod('POST')
  .setHeader('Accept', 'application/json')
  .setBody({ username: 'sarah_dev', role: 'admin' })
  .requireAuth()
  .setTimeout(5000)
  .build();

request.execute();
```

---

## 3. Comparing Factory vs. Builder

| Feature | Factory Pattern | Builder Pattern |
| :--- | :--- | :--- |
| **Focus** | Deciding **which** concrete subclass to create | Constructing a complex object **step-by-step** |
| **Syntax Style** | Single method call (`create(type)`) | Fluent method chaining (`.set().set().build()`) |
| **Complexity** | Simple polymorphism | High configuration flexibility with many optional parameters |

---

## Practice Quiz

### Q1: What is the primary purpose of the Factory Pattern?
- A) To encrypt object properties
- B) To provide a centralized interface for instantiating objects without exposing concrete class logic to consumers
- C) To render HTML templates
- D) To clean up event listeners
**Answer:** B
**Explanation:** The Factory Pattern abstracts object creation, allowing the calling code to request an object by type or criteria without knowing the specific concrete class.

### Q2: What problem does the Builder Pattern solve?
- A) The "Telescoping Constructor" problem where constructors require long, confusing lists of positional arguments
- B) Network latency
- C) Memory leaks in closures
- D) CSS specificity conflicts
**Answer:** A
**Explanation:** The Builder Pattern replaces complex constructors having many positional or optional parameters with clean, fluent step-by-step configuration methods.

### Q3: Why do builder methods (like setMethod() or setHeader()) return this?
- A) To enable method chaining (fluent interface)
- B) To freeze the object
- C) To make methods asynchronous
- D) To bind event listeners
**Answer:** A
**Explanation:** Returning `this` allows subsequent builder method calls to be chained together in a fluent, readable pipeline: `builder.setA().setB().build()`.

### Q4: Which method is conventionally invoked as the final step in a Builder class to return the constructed object?
- A) .finalize()
- B) .build()
- C) .create()
- D) .done()
**Answer:** B
**Explanation:** In standard design pattern conventions, `.build()` (or `.toInstance()`) validates the configuration and instantiates the final target object.

### Q5: If an application needs to instantiate different database drivers (Postgres, Mongo, SQLite) based on environment configuration, which pattern is best?
- A) Observer Pattern
- B) Factory Pattern
- C) Prototype Pattern
- D) Proxy Pattern
**Answer:** B
**Explanation:** A Database Driver Factory can inspect configuration variables (e.g. `DB_TYPE`) and instantiate the matching driver class polymorphically.

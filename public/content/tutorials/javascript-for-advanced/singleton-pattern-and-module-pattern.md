# Singleton Pattern & Module Pattern in Modern JavaScript

Design patterns provide battle-tested architectural blueprints for common software engineering challenges. The **Singleton Pattern** and the **Module Pattern** are foundational creational and structural patterns in JavaScript used for state centralization, resource pooling, and namespace encapsulation.

---

## 1. The Singleton Pattern

The **Singleton Pattern** restricts the instantiation of a class to **one single instance** across the entire application, providing a global point of access.

### Modern Implementation: Class-Based with Instance Guard
```javascript
class DatabasePool {
  static #instance = null;

  constructor(connectionUri) {
    if (DatabasePool.#instance) {
      // Return existing singleton instance!
      return DatabasePool.#instance;
    }

    this.connectionUri = connectionUri;
    this.connections = [];
    this.isConnected = true;

    // Cache the single instance
    DatabasePool.#instance = this;
  }

  static getInstance(uri = 'mongodb://localhost:27017/prod') {
    if (!DatabasePool.#instance) {
      DatabasePool.#instance = new DatabasePool(uri);
    }
    return DatabasePool.#instance;
  }

  query(sql) {
    return `Executing "${sql}" on pool ${this.connectionUri}`;
  }
}

// Verification:
const pool1 = new DatabasePool('db1');
const pool2 = new DatabasePool('db2'); // Ignored uri, returns pool1!

console.log(pool1 === pool2); // TRUE! Identical memory reference!
```

---

## 2. Singletons via ES Modules (Native Singleton)

Because ECMAScript Modules execute once and cache their exports, **simply exporting an instantiated object makes it a native singleton with zero boilerplate**:

```javascript
// LoggerService.js
class Logger {
  constructor() {
    this.logs = [];
  }
  log(msg) { this.logs.push(msg); }
}

// Export single instantiated instance:
export const logger = Object.freeze(new Logger());
```

```javascript
// app.js & auth.js both import logger:
import { logger } from './LoggerService.js';
// Both files receive the exact same singleton instance!
```

---

## 3. The Classic Module Pattern (Closure-Based)

Before native ES Modules, the **Module Pattern** used Immediately Invoked Function Expressions (IIFEs) and closures to simulate private state and expose a public API:

```javascript
const CartModule = (function () {
  // Private variables and functions (inaccessible from outside!)
  let items = [];
  const taxRate = 0.08;

  function calculateTotal() {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return subtotal * (1 + taxRate);
  }

  // Public API returned to consumer
  return {
    addItem(product) {
      items.push(product);
      console.log(`Added ${product.name}`);
    },
    getItemCount() {
      return items.length;
    },
    getTotal() {
      return calculateTotal();
    }
  };
})();

// Usage:
CartModule.addItem({ name: 'Headphones', price: 100 });
console.log(CartModule.getTotal()); // 108
// console.log(CartModule.items); // undefined! (Truly private!)
```

---

## 4. Comparing the Patterns

| Feature | Singleton Pattern | Module Pattern |
| :--- | :--- | :--- |
| **Primary Goal** | Guarantee exactly one instance exists globally | Encapsulate private state and expose clean public API |
| **Instantiation** | Lazily or eagerly instantiated class | Typically evaluated immediately via IIFE or ESM |
| **Ideal For** | Database pools, WebSocket connections, state stores | Utility namespaces, service controllers, widgets |

---

## Practice Quiz

### Q1: What is the core guarantee of the Singleton Pattern?
- A) It guarantees that a class has only one instance and provides a global point of access to it
- B) It prevents errors from being thrown
- C) It guarantees functions execute in under 10 milliseconds
- D) It renders UI components in parallel
**Answer:** A
**Explanation:** The Singleton pattern ensures that a class is instantiated only once throughout the program's lifecycle, reusing that single instance for all requests.

### Q2: Why are ES Modules natural singletons in JavaScript?
- A) Because export default creates a class
- B) Because a module file is executed only once upon first import, and its exported bindings are cached for all subsequent imports
- C) Because modules use localStorage
- D) Because of strict mode
**Answer:** B
**Explanation:** ES Modules follow a singleton instantiation model: the module code runs once when first imported, and all subsequent imports across different files receive the cached instance.

### Q3: How did the traditional JavaScript Module Pattern achieve data privacy before ES2022 private fields?
- A) Using HTML cookies
- B) Using Immediately Invoked Function Expressions (IIFEs) and Lexical Closures to encapsulate private variables
- C) By prefixing variables with $
- D) By compiling to C++
**Answer:** B
**Explanation:** The Module Pattern uses an IIFE to establish a private lexical scope; variables declared inside remain enclosed and inaccessible except through the returned public object methods.

### Q4: Why is Object.freeze() often called on singleton objects?
- A) To prevent external code from adding, deleting, or reassigning properties on the singleton instance
- B) To convert numbers to strings
- C) To make the singleton asynchronous
- D) To encrypt the singleton
**Answer:** A
**Explanation:** `Object.freeze(singletonInstance)` ensures immutability, preventing external consumers from mutating methods or properties on the shared instance.

### Q5: What is a common testing criticism of the Singleton Pattern?
- A) Singletons run too fast to test
- B) Global state singletons introduce hidden dependencies between unit tests and make mocking difficult unless reset mechanisms are provided
- C) Singletons cannot be used in Jest
- D) Singletons crash during CI/CD
**Answer:** B
**Explanation:** Because singletons maintain shared global state across invocations, unit tests can inadvertently affect one another unless the singleton state is reset between tests.

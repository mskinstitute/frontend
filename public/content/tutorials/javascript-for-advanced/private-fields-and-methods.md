# Private Fields & Methods (#field) in Modern JavaScript

For over two decades, JavaScript lacked true language-level encapsulation. Developers relied on naming conventions (like `_underscorePrefix`) or closures to simulate privacy. Introduced officially in ES2022, **Private Class Fields and Methods** (using the `#` prefix) provide hard, engine-enforced privacy.

---

## 1. The Historical Problem: Soft Conventions vs. Hard Privacy

```javascript
// LEGACY: Underscore was merely a gentleman's agreement!
class LegacyAccount {
  constructor(pin) {
    this._pin = pin; // Anyone can still do: account._pin = 0000!
  }
}
```

External consumers could inspect and mutate `_pin` directly, breaking invariants and leaking secrets.

---

## 2. Modern Private Fields Syntax: `#field`

Private fields are declared at the class body level using the `#` symbol. Attempting to access them outside the class results in a **compile-time SyntaxError**:

```javascript
class SecureVault {
  // 1. Private Field Declaration
  #masterKey;
  #balance = 0;

  constructor(owner, initialKey, deposit) {
    this.owner = owner;       // Public property
    this.#masterKey = initialKey; // Private property
    this.#balance = deposit;      // Private property
  }

  // Public method accessing private field internally
  verifyAndWithdraw(enteredKey, amount) {
    if (this.#masterKey !== enteredKey) {
      throw new Error('Access Denied: Invalid Security Key.');
    }
    if (amount > this.#balance) {
      throw new Error('Insufficient Vault Funds.');
    }
    this.#balance -= amount;
    return `Dispensed $${amount}. Remaining: $${this.#balance}`;
  }
}

const vault = new SecureVault('Wayne Enterprises', 'batman99', 500000);

console.log(vault.owner); // "Wayne Enterprises"

// ATTEMPTING TO ACCESS PRIVATE FIELD OUTSIDE CLASS:
// console.log(vault.#masterKey);
// SYNTAX ERROR: Private field '#masterKey' must be declared in an enclosing class!
```

---

## 3. Private Methods & Accessors

You can make helper methods, getters, and setters private using `#`:

```javascript
class CryptographicKeyManager {
  #rawSeed;

  constructor(seed) {
    this.#rawSeed = seed;
  }

  // Private helper method
  #generateHash(data) {
    return `hash_${data}_${this.#rawSeed}`;
  }

  // Public API
  signPayload(payload) {
    return this.#generateHash(payload);
  }
}

const manager = new CryptographicKeyManager('secret_seed_42');
console.log(manager.signPayload('transfer_funds')); // "hash_transfer_funds_secret_seed_42"
// manager.#generateHash('test'); // SyntaxError!
```

---

## 4. Subclasses Cannot Access Private Fields!

Private fields are strictly private to the **exact class in which they were declared**. Derived subclasses cannot access private fields of their parent class:

```javascript
class Parent {
  #secret = 'TopSecret';
}

class Child extends Parent {
  reveal() {
    // return this.#secret; // SYNTAX ERROR! Private field '#secret' is not accessible in Child!
  }
}
```

---

## 5. Checking Private Fields with the `in` Operator (ES2022)

To safely check whether an unknown object contains a private field without throwing errors:

```javascript
class TokenValidator {
  #token;

  constructor(token) {
    this.#token = token;
  }

  static isTokenValidator(obj) {
    // Checks if obj contains the #token private brand
    return #token in obj;
  }
}

console.log(TokenValidator.isTokenValidator(new TokenValidator('xyz'))); // true
console.log(TokenValidator.isTokenValidator({}));                       // false
```

---

## Practice Quiz

### Q1: What syntax defines a true private field in modern ECMAScript classes?
- A) _fieldName
- B) #fieldName
- C) private fieldName
- D) $fieldName
**Answer:** B
**Explanation:** The `#` prefix (e.g. `#fieldName`) is the official ES2022 syntax for declaring engine-enforced private fields and methods.

### Q2: What happens when code outside a class attempts to access an instance's private field (e.g. instance.#secret)?
- A) It returns undefined
- B) It throws a SyntaxError at parse time
- C) It logs a warning to the console
- D) It returns null
**Answer:** B
**Explanation:** Private identifier access outside the enclosing class is a parse-time `SyntaxError`, providing hard compile-level privacy.

### Q3: Can a derived subclass access private fields declared in its parent class?
- A) Yes, via this.#field
- B) No, private fields are completely inaccessible to subclasses
- C) Yes, via super.#field
- D) Only if the subclass is in the same file
**Answer:** B
**Explanation:** Private fields are strictly scoped to the declaring class body; derived classes cannot access private fields of their parent class.

### Q4: How can you check if an object contains a private field #key without throwing an exception?
- A) Object.hasOwn(obj, '#key')
- B) #key in obj
- C) obj.hasOwnProperty('#key')
- D) typeof obj.#key !== 'undefined'
**Answer:** B
**Explanation:** ES2022 introduced the ergonomic brand check `#field in object`, returning `true` if the object possesses that private brand and `false` otherwise.

### Q5: Does Object.getOwnPropertyNames(instance) or Object.keys(instance) reveal private fields?
- A) Yes, all properties are listed
- B) No, private fields do not appear in reflection or object key enumeration methods
- C) Only in Node.js
- D) Yes, but with names prefixed with #
**Answer:** B
**Explanation:** Private fields are completely hidden from reflection APIs (`Object.keys()`, `Object.getOwnPropertyNames()`, `for...in`), preventing external introspection.

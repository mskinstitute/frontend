# Class Syntax & Constructor Methods in Modern JavaScript

Introduced in ECMAScript 2015 (ES6), the `class` syntax provides a clean, declarative syntax over JavaScript's existing prototype-based inheritance model. While classes in JavaScript are syntactic sugar over prototypes, they introduce strict semantics, constructor encapsulation, and class-level invariants.

---

## 1. Class Declaration & The constructor Method

A class defines the blueprint for objects. The `constructor()` method is a special function that runs automatically whenever a new instance is created via the `new` operator:

```javascript
class BankAccount {
  // Constructor: Initializes instance properties
  constructor(accountHolder, initialBalance = 0) {
    this.accountHolder = accountHolder;
    this.balance = initialBalance;
    this.createdAt = new Date();
  }

  // Instance Method (Added to BankAccount.prototype)
  deposit(amount) {
    if (amount <= 0) throw new Error('Deposit amount must be positive.');
    this.balance += amount;
    return this.balance;
  }

  withdraw(amount) {
    if (amount > this.balance) throw new Error('Insufficient funds.');
    this.balance -= amount;
    return this.balance;
  }
}

// Instantiation
const myAccount = new BankAccount('Sarah Connor', 1000);
myAccount.deposit(500);
console.log(`Balance: $${myAccount.balance}`); // Balance: $1500
```

```
Instance Memory Model:
  myAccount ──► [ { accountHolder: 'Sarah', balance: 1500 } ]
                      │
                      ▼ __proto__
                BankAccount.prototype ──► [ deposit(), withdraw() ]
```

---

## 2. Key Differences Between Classes & Constructor Functions

| Feature | ES6 Class | Constructor Function (`function Account()`) |
| :--- | :--- | :--- |
| **Strict Mode** | Automatically runs in `'use strict'` | Non-strict unless explicitly declared |
| **Invocation without `new`** | **Throws TypeError** immediately | Fails silently and pollutes global `window` |
| **Hoisting** | Temporal Dead Zone (Cannot instantiate before declaration) | Hoisted (Can be called before definition) |
| **Method Enumerability** | Methods on prototype are **non-enumerable** | Prototype methods are enumerable by default |

```javascript
// Classes CANNOT be called without 'new':
// BankAccount('Alex', 100); // TypeError: Class constructor BankAccount cannot be invoked without 'new'
```

---

## 3. Subclassing with extends and super()

To inherit from an existing class, use `extends`. The subclass constructor **must invoke `super()`** before accessing `this`:

```javascript
class PremiumAccount extends BankAccount {
  constructor(accountHolder, initialBalance, cashbackRate = 0.02) {
    // MUST call super() before accessing 'this'!
    super(accountHolder, initialBalance);
    this.cashbackRate = cashbackRate;
  }

  // Method overriding
  deposit(amount) {
    const cashback = amount * this.cashbackRate;
    const totalDeposit = amount + cashback;
    console.log(`Bonus Cashback Earned: $${cashback}`);
    return super.deposit(totalDeposit); // Invoke parent method via super
  }
}

const vip = new PremiumAccount('John Connor', 5000);
vip.deposit(1000); // Bonus Cashback: $20, Balance: $6020
```

> **Critical Rule:** In a derived class constructor, accessing `this` before calling `super()` results in a `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

---

## Practice Quiz

### Q1: What happens if you attempt to instantiate an ES6 class without the new keyword (e.g. BankAccount())?
- A) It returns an empty object {}
- B) It attaches properties to window
- C) It throws a TypeError
- D) It calls constructor as a regular function
**Answer:** C
**Explanation:** The ECMAScript specification explicitly forbids invoking class constructors without `new`, immediately throwing a `TypeError`.

### Q2: What must be called inside a derived subclass constructor before accessing the this keyword?
- A) this.init()
- B) super()
- C) Object.create()
- D) parent()
**Answer:** B
**Explanation:** In derived classes, the instance `this` is initialized by the parent constructor. Calling `super()` is mandatory before referencing `this`.

### Q3: Where are standard methods declared inside a class body (like deposit()) stored in memory?
- A) Duplicated on every instance object
- B) On the class's prototype (e.g., BankAccount.prototype)
- C) In the Global window object
- D) Inside a Web Worker thread
**Answer:** B
**Explanation:** Class methods are attached to the prototype object (`ClassName.prototype`), allowing all instances to share a single copy in memory.

### Q4: Are ES6 classes hoisted like traditional function declarations?
- A) Yes, they can be instantiated before their declaration line
- B) No, they reside in the Temporal Dead Zone (TDZ) and throw a ReferenceError if accessed early
- C) Only in Node.js
- D) Yes, if declared with export
**Answer:** B
**Explanation:** Class declarations are not hoisted like function declarations; attempting to instantiate a class before its declaration results in a `ReferenceError`.

### Q5: How do prototype methods created via class syntax differ in enumerability from traditional prototype functions?
- A) Class prototype methods are non-enumerable (hidden from Object.keys and for...in loops)
- B) Class prototype methods cannot be executed
- C) There is no difference
- D) Class methods are frozen
**Answer:** A
**Explanation:** To avoid unexpected property enumeration in loops, all methods defined in an ES6 class body are configured with `enumerable: false` by default.

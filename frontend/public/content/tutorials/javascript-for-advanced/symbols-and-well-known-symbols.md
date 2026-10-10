# Symbols & Well-Known Symbols in Modern JavaScript

Introduced in ES6, **`Symbol`** is a primitive data type that represents a unique, immutable identifier. Symbols are used to define private-like object properties that never collide with other keys, and to hook into JavaScript's internal engine mechanics via **Well-Known Symbols**.

---

## 1. Creating and Using Symbols

Every call to `Symbol()` produces a globally unique value, even with the same description:

```javascript
const sym1 = Symbol('apiKey');
const sym2 = Symbol('apiKey');

console.log(sym1 === sym2); // FALSE! Each Symbol is guaranteed unique!
console.log(typeof sym1);   // "symbol"
```

### Using Symbols as Object Keys (Collision-Proof Properties):
```javascript
const USER_ID = Symbol('unique_id');

const user = {
  name: 'Alex',
  [USER_ID]: 'USR_98214' // Symbol-keyed property
};

console.log(user[USER_ID]); // "USR_98214"

// Symbols are hidden from standard object iteration!
console.log(Object.keys(user)); // ['name'] (USER_ID is omitted!)
console.log(JSON.stringify(user)); // '{"name":"Alex"}' (Omitted from JSON!)

// Explicit retrieval via reflection:
console.log(Object.getOwnPropertySymbols(user)); // [ Symbol(unique_id) ]
```

---

## 2. The Global Symbol Registry: `Symbol.for()` & `Symbol.keyFor()`

When multiple scripts or iframes need to share the same Symbol instance:

```javascript
// Registers or retrieves 'app.version' from global cross-realm registry
const globalSym1 = Symbol.for('app.version');
const globalSym2 = Symbol.for('app.version');

console.log(globalSym1 === globalSym2); // TRUE! Same shared symbol!

// Retrieve string key from symbol:
console.log(Symbol.keyFor(globalSym1)); // "app.version"
```

---

## 3. Well-Known Symbols (Engine Hooks)

Well-Known Symbols are built-in symbols that expose internal engine algorithms:

### 1. `Symbol.toPrimitive`: Custom Type Coercion
Customizes how an object converts to a string or number:

```javascript
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.currency} ${this.amount.toFixed(2)}`;
    return this.amount; // 'default' hint
  }
}

const wallet = new Money(50, 'USD');
console.log(+wallet + 10);     // 60 (Number coercion)
console.log(`${wallet}`);       // "USD 50.00" (String coercion)
```

### 2. `Symbol.hasInstance`: Customizing `instanceof`
```javascript
class EvenNumber {
  static [Symbol.hasInstance](instance) {
    return typeof instance === 'number' && instance % 2 === 0;
  }
}

console.log(4 instanceof EvenNumber); // true!
console.log(7 instanceof EvenNumber); // false!
```

### 3. `Symbol.species`: Subclass Derivative Constructor
Allows derived classes (like custom Array subclasses) to dictate what constructor built-in methods (like `.map()` or `.filter()`) return.

---

## Practice Quiz

### Q1: What is the primary characteristic of a Symbol primitive in JavaScript?
- A) It is always converted to an integer
- B) It is a guaranteed unique, immutable identifier
- C) It is stored in localStorage
- D) It can only be used in Node.js
**Answer:** B
**Explanation:** Every `Symbol()` instantiation creates a completely unique, immutable primitive value in memory.

### Q2: How do Symbol-keyed properties behave during Object.keys() and JSON.stringify()?
- A) They throw a TypeError
- B) They are ignored and excluded from standard key enumeration and JSON serialization
- C) They appear at the beginning of the list
- D) They are converted to strings
**Answer:** B
**Explanation:** Symbol properties are non-enumerable in standard `Object.keys()`, `for...in`, and `JSON.stringify()`, keeping them isolated from routine iterations.

### Q3: What method creates or retrieves a shared symbol from the runtime's Global Symbol Registry?
- A) Symbol.create()
- B) Symbol.for(key)
- C) Symbol.register(key)
- D) Symbol.global()
**Answer:** B
**Explanation:** `Symbol.for(key)` searches the global registry for a symbol with that key; if found, it returns it; otherwise, it creates and registers a new one.

### Q4: Which Well-Known Symbol customizes how an object is coerced into a string, number, or default primitive?
- A) Symbol.convert
- B) Symbol.toPrimitive
- C) Symbol.toString
- D) Symbol.coerce
**Answer:** B
**Explanation:** The `[Symbol.toPrimitive]` method hook determines how an object converts to primitives under various hint contexts (`'number'`, `'string'`, `'default'`).

### Q5: How can you retrieve an array of all Symbol properties defined on an object?
- A) Object.keys(obj)
- B) Object.getOwnPropertySymbols(obj)
- C) obj.getSymbols()
- D) Reflect.symbols(obj)
**Answer:** B
**Explanation:** `Object.getOwnPropertySymbols(obj)` returns an array of all symbol-keyed properties defined directly on the object.

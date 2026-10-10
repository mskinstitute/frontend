# Getters, Setters & Static Methods in Modern JavaScript

Modern JavaScript classes provide accessor properties (`get` and `set`) for computed values and data validation, alongside `static` methods and properties that belong to the class constructor itself rather than to individual instances.

---

## 1. Accessor Properties: Getters and Setters

Getters and setters bind an object property to a function that is invoked whenever that property is read or assigned. They resemble standard properties syntactically while providing encapsulation:

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius; // Internal convention
  }

  // Getter: Invoked when reading temp.celsius
  get celsius() {
    return this._celsius;
  }

  // Setter: Invoked when assigning temp.celsius = value
  set celsius(value) {
    if (typeof value !== 'number') {
      throw new TypeError('Temperature must be a numerical value.');
    }
    if (value < -273.15) {
      throw new RangeError('Temperature cannot be below Absolute Zero (-273.15°C).');
    }
    this._celsius = value;
  }

  // Computed Getter: Fahrenheit
  get fahrenheit() {
    return (this._celsius * 9) / 5 + 32;
  }

  // Setter for Fahrenheit updates internal Celsius!
  set fahrenheit(val) {
    this.celsius = ((val - 32) * 5) / 9;
  }
}

const weather = new Temperature(25);
console.log(weather.celsius);    // 25
console.log(weather.fahrenheit); // 77

weather.fahrenheit = 212; // Updates via setter
console.log(weather.celsius);    // 100
```

---

## 2. Static Methods and Properties

The `static` keyword defines methods and properties that exist on the **class constructor itself**, not on instance objects. They are ideal for utility functions, factory methods, or shared constants:

```javascript
class User {
  // Static Property (ES2022)
  static MIN_PASSWORD_LENGTH = 8;

  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  // Static Factory Method: Constructs User from JSON API response
  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    return new User(data.name, data.email);
  }

  // Static Utility: Compares two users
  static areEqual(userA, userB) {
    return userA.email.toLowerCase() === userB.email.toLowerCase();
  }
}

// Access static members via the Class name:
console.log(User.MIN_PASSWORD_LENGTH); // 8

const user1 = User.fromJSON('{"name": "Elena", "email": "elena@example.com"}');
console.log(user1.username); // "Elena"

// Instances CANNOT access static methods:
// user1.fromJSON(...); // TypeError: user1.fromJSON is not a function
```

```
Class Architecture:
  User Constructor ──► [ static fromJSON(), static areEqual() ]
         │
    new User()
         │
         ▼
  user1 Instance   ──► [ username, email ] ──► User.prototype [ instance methods ]
```

---

## 3. Static Inheritance

In JavaScript, static members are inherited through the prototype chain of constructor functions:

```javascript
class BaseService {
  static getServiceName() {
    return 'Base Core Service';
  }
}

class AuthService extends BaseService {}

console.log(AuthService.getServiceName()); // 'Base Core Service' (Inherited statically!)
```

---

## Practice Quiz

### Q1: How do you access a getter property defined as get fullName() on an instance user?
- A) user.fullName()
- B) user.fullName
- C) user.get('fullName')
- D) user->fullName
**Answer:** B
**Explanation:** Getters are accessed like standard object properties (without parentheses): `user.fullName`.

### Q2: What is the primary purpose of a setter method?
- A) To convert objects into JSON
- B) To intercept property assignment, allowing validation, type-checking, or side-effect triggers
- C) To make properties read-only
- D) To delete properties
**Answer:** B
**Explanation:** Setters execute custom logic when a property assignment occurs (`user.prop = val`), enabling input validation before setting values.

### Q3: Can an instance of a class directly call a static method (e.g. instance.myStaticMethod())?
- A) Yes, always
- B) No, static methods belong to the constructor function itself and cannot be invoked from an instance
- C) Only if declared public
- D) Yes, in strict mode
**Answer:** B
**Explanation:** Static methods exist on the constructor class (e.g. `User.myStaticMethod()`), not on the instance or instance prototype.

### Q4: What common design pattern is frequently implemented using static class methods?
- A) Factory Method Pattern (e.g. User.fromJSON(data))
- B) Decorator Pattern
- C) Virtual DOM Pattern
- D) Model-View-Controller
**Answer:** A
**Explanation:** Static factory methods (like `User.fromJSON()` or `Array.from()`) provide clean alternative constructors for instantiating objects.

### Q5: What error occurs if a setter attempts to assign to the exact same property name without a backing field (e.g. set score(val) { this.score = val; })?
- A) SyntaxError
- B) RangeError: Maximum call stack size exceeded (Infinite recursion)
- C) TypeError: Cannot reassign score
- D) NaN
**Answer:** B
**Explanation:** Assigning `this.score = val` inside `set score(val)` re-invokes the setter recursively until the Call Stack overflows.

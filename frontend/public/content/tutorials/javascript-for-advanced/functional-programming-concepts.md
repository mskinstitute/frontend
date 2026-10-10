# Functional Programming in Modern JavaScript

Functional Programming (FP) treats computation as the evaluation of mathematical functions, avoiding mutable shared state and side effects. Beyond basic `map` and `filter`, advanced functional architecture relies on algebraic structures like **Functors** and **Monads** to handle errors, asynchronous tasks, and null values with declarative safety.

---

## 1. The Core FP Pillars

1. **Pure Functions:** Same inputs always yield identical outputs; zero side effects.
2. **Immutability:** Data structures are never mutated; transformations yield new copies.
3. **Referential Transparency:** An expression can be replaced with its evaluated value without altering program behavior.
4. **First-Class & Higher-Order Functions:** Functions can be passed, returned, and composed.

---

## 2. What is a Functor?

A **Functor** is simply an object or data structure that implements a **`map()`** method, satisfying two mathematical laws:
- *Identity:* `functor.map(x => x)` is equivalent to `functor`.
- *Composition:* `functor.map(x => f(g(x)))` is equivalent to `functor.map(g).map(f)`.

JavaScript `Array` is the most common native Functor:
```javascript
// Array Functor
[1, 2, 3].map(x => x * 2); // [2, 4, 6]
```

### The Container Functor (Identity Box):
```javascript
class Box {
  constructor(value) {
    this.value = value;
  }

  static of(val) {
    return new Box(val);
  }

  // Functor map interface:
  map(fn) {
    return Box.of(fn(this.value));
  }
}

// Chaining pure transformations inside a Box:
const result = Box.of(10)
  .map(x => x + 5)
  .map(x => x * 2)
  .map(x => `Total: $${x}`);

console.log(result.value); // "Total: $30"
```

---

## 3. What is a Monad? The Maybe Monad (Eliminating Null Checks)

A **Monad** is a specialized Functor that also implements a **`flatMap()`** (or `chain()`) method to unwrap nested structures (`Box(Box(val)) -> Box(val)`).

The **Maybe Monad** safely handles computations that may return `null` or `undefined` without throwing `TypeError`:

```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(val) {
    return new Maybe(val);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    // If empty, short-circuit and propagate Nothing safely!
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }

  // Monadic bind / flatMap
  flatMap(fn) {
    return this.isNothing() ? this : fn(this.value);
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }
}
```

### Eliminating Nested If-Statements with Maybe:
```javascript
const rawApiResponse = {
  user: {
    profile: {
      address: {
        city: 'Tokyo'
      }
    }
  }
};

// Safe access pipeline with zero null crashes!
const userCity = Maybe.of(rawApiResponse)
  .map(data => data.user)
  .map(user => user.profile)
  .map(profile => profile.address)
  .map(addr => addr.city)
  .getOrElse('City Not Provided');

console.log(userCity); // "Tokyo"

// Tested on completely empty object:
const missingCity = Maybe.of({})
  .map(data => data.user)
  .map(user => user.profile)
  .getOrElse('Default City');

console.log(missingCity); // "Default City" (Zero TypeError thrown!)
```

---

## 4. The Either Monad: Declarative Error Handling

`Either` represents values with two possibilities: `Left(error)` or `Right(success)`. Computations map over `Right`, but short-circuit on `Left`:

```javascript
class Right {
  constructor(val) { this.value = val; }
  map(fn) { return new Right(fn(this.value)); }
}

class Left {
  constructor(err) { this.error = err; }
  map(fn) { return this; } // Short-circuit on error!
}

function parseJson(str) {
  try {
    return new Right(JSON.parse(str));
  } catch (e) {
    return new Left(e.message);
  }
}
```

---

## Practice Quiz

### Q1: What defines a "Functor" in Functional Programming?
- A) A function that runs in a thread
- B) A data structure or container that implements a map() method obeying Identity and Composition laws
- C) A CSS transition
- D) A binary tree
**Answer:** B
**Explanation:** A Functor is any type implementing a compliant `.map()` method that applies a transformation to its wrapped value while preserving the container structure.

### Q2: What problem is solved by the Maybe Monad?
- A) Network latency
- B) Defensive null and undefined checking by short-circuiting operations if a value is absent, eliminating TypeErrors
- C) Database indexing
- D) Thread deadlock
**Answer:** B
**Explanation:** The `Maybe` monad encapsulates optional values, applying transformations when present and short-circuiting safely when null or undefined.

### Q3: What is the primary difference between a Functor and a Monad?
- A) Functors only work on numbers
- B) Monads implement flatMap() (chain/bind) to flatten nested containers (e.g. Container(Container(x)) into Container(x)), preventing nested layers
- C) Monads cannot use map()
- D) There is no difference
**Answer:** B
**Explanation:** While a functor maps a function `A -> B`, a monad handles functions that return monads (`A -> Monad(B)`), unwrapping nested layers via `flatMap()`.

### Q4: What does "Referential Transparency" mean?
- A) Code can be converted into JSON
- B) Any function call can be replaced with its evaluated return value without altering the correctness or behavior of the program
- C) Variables are public
- D) Transparent DOM elements
**Answer:** B
**Explanation:** Referential transparency means a function call with given arguments can be directly replaced with its resulting value without affecting program state.

### Q5: In the Either Monad pattern, which side conventionally represents a successful computation vs. an error?
- A) Left represents error; Right represents success (is "right")
- B) Right represents error; Left represents success
- C) Both represent success
- D) Left is for numbers, Right is for strings
**Answer:** A
**Explanation:** By functional convention, `Right` holds the successful value, while `Left` holds the error or failure reason.

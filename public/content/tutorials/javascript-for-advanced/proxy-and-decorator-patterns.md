# Proxy & Decorator Patterns in Modern JavaScript

Structural design patterns manage how objects and classes are composed into larger architectures. The **Proxy Pattern** and the **Decorator Pattern** add functionality to existing objects without modifying their underlying source code.

---

## 1. The Proxy Pattern

A **Proxy** acts as an intermediary or surrogate for another object, intercepting operations (property access, assignment, function invocation) to add access control, caching, or logging.

JavaScript provides native language-level support via the **`Proxy`** object:

```javascript
const user = {
  id: 101,
  username: 'alex_dev',
  role: 'editor',
  salary: 85000
};

// Security Proxy: Protects sensitive salary property
const secureUserProxy = new Proxy(user, {
  get(target, prop, receiver) {
    if (prop === 'salary') {
      throw new Error('Access Denied: You do not have clearance to view salary.');
    }
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    if (prop === 'role' && value === 'admin') {
      throw new Error('Unauthorized: Cannot grant admin privileges directly.');
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log(secureUserProxy.username); // "alex_dev"
// secureUserProxy.salary; // Error: Access Denied!
// secureUserProxy.role = 'admin'; // Error: Unauthorized!
```

---

## 2. Virtual Proxy for Lazy Loading

A Virtual Proxy delays the instantiation of an expensive resource until it is actually accessed:

```javascript
class Heavy3DModel {
  constructor(modelPath) {
    console.log(`[Expensive] Loading 3D model meshes from: ${modelPath}`);
    this.modelPath = modelPath;
  }
  render() { console.log(`Rendering 3D model ${this.modelPath}`); }
}

class Lazy3DModelProxy {
  constructor(modelPath) {
    this.modelPath = modelPath;
    this.realModel = null; // Instantiation deferred!
  }

  render() {
    if (!this.realModel) {
      this.realModel = new Heavy3DModel(this.modelPath);
    }
    this.realModel.render();
  }
}

const proxyModel = new Lazy3DModelProxy('/assets/car.obj');
// No heavy loading has occurred yet!
console.log('App loaded.');

// Loading happens ONLY when render() is called:
proxyModel.render();
```

---

## 3. The Decorator Pattern

The **Decorator Pattern** dynamically attaches additional responsibilities and behaviors to an object without altering its class definition.

```javascript
// Base Component
class Coffee {
  cost() { return 5; }
  description() { return 'Simple Coffee'; }
}

// Decorator 1: Milk
function withMilk(coffee) {
  const originalCost = coffee.cost();
  const originalDesc = coffee.description();
  return {
    ...coffee,
    cost: () => originalCost + 1.5,
    description: () => `${originalDesc}, with Steamed Milk`
  };
}

// Decorator 2: Caramel
function withCaramel(coffee) {
  const originalCost = coffee.cost();
  const originalDesc = coffee.description();
  return {
    ...coffee,
    cost: () => originalCost + 2.0,
    description: () => `${originalDesc}, with Caramel Drizzle`
  };
}

// Stacking decorators dynamically:
let myOrder = new Coffee();
myOrder = withMilk(myOrder);
myOrder = withCaramel(myOrder);

console.log(myOrder.description()); // "Simple Coffee, with Steamed Milk, with Caramel Drizzle"
console.log(`Total: $${myOrder.cost()}`); // Total: $8.5
```

---

## 4. Comparing Proxy vs. Decorator

| Feature | Proxy Pattern | Decorator Pattern |
| :--- | :--- | :--- |
| **Intent** | Controls, intercepts, and manages **access** to an object | Dynamically **adds new features and responsibilities** |
| **Interface** | Typically mirrors target interface identically | Enhances or expands target interface |
| **Relationship** | Often instantiated internally or created as wrapper | Composed and chained by the client |

---

## Practice Quiz

### Q1: What is the primary purpose of the Proxy Pattern?
- A) To compress image files
- B) To provide a surrogate or placeholder for another object to intercept and control access to it
- C) To render CSS styles
- D) To compile code to WebAssembly
**Answer:** B
**Explanation:** A proxy intercepts operations on a target object, enabling logging, security gating, caching, or lazy initialization.

### Q2: What native JavaScript object allows intercepting fundamental operations like property lookup and assignment?
- A) Object.assign
- B) Proxy
- C) EventBus
- D) Symbol.iterator
**Answer:** B
**Explanation:** The native `Proxy` constructor allows developers to create custom interceptor traps (`get`, `set`, `has`, `apply`) for any target object.

### Q3: What is a "Virtual Proxy"?
- A) A proxy that runs on a virtual server
- B) A proxy that postpones creating an expensive resource until the moment it is actually accessed
- C) A Virtual DOM node
- D) A Web Worker proxy
**Answer:** B
**Explanation:** A Virtual Proxy defers the creation of expensive objects (memory-intensive 3D models, database connections) until they are first needed.

### Q4: How does the Decorator Pattern differ from standard Class Inheritance?
- A) Decorators only work in TypeScript
- B) Decorators allow responsibilities to be attached dynamically at runtime and stacked flexibly, avoiding rigid compile-time class hierarchies
- C) Decorators run slower than inheritance
- D) Decorators delete original methods
**Answer:** B
**Explanation:** While inheritance adds behavior statically at compile-time, decorators wrap objects dynamically at runtime, allowing arbitrary stacking of features.

### Q5: What standard JavaScript API should be used inside Proxy traps to perform default behavior on the target?
- A) Object.prototype
- B) Reflect
- C) super
- D) eval
**Answer:** B
**Explanation:** The `Reflect` API provides static methods matching every Proxy trap (e.g. `Reflect.get(target, prop)`), cleanly forwarding default operations.

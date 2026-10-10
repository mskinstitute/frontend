# WeakMap & WeakSet for Memory Management

In JavaScript, standard `Map` and `Set` collections hold strong references to their entries. If an object is placed inside a `Map`, the garbage collector cannot reclaim it, even if all other references to it have been destroyed. **`WeakMap`** and **`WeakSet`** hold **weak references**, allowing objects to be garbage-collected cleanly and preventing memory leaks.

---

## 1. Strong References vs. Weak References

```
Standard Map (Strong Reference):
  [ DOM Button ] ◄─── Held strongly by Map key!
        ▲
  btn = null;  <── Button is NOT collected because Map holds it alive! (Memory Leak!)

WeakMap (Weak Reference):
  [ DOM Button ] < - - Weak Reference from WeakMap
        ▲
  btn = null;  <── Button IS GARBAGE COLLECTED! Key/value vanishes automatically!
```

---

## 2. Key Restrictions of Weak Collections

Because the garbage collector can reclaim keys at any moment:
1. **Keys MUST be Objects:** Primitives (`string`, `number`) are not allowed as keys.
2. **Not Iterable:** There is no `.forEach()`, `for...of`, `.keys()`, `.values()`, or `.size` property!
3. **No Clearing:** There is no `.clear()` method.

Supported methods: `.get()`, `.set()`, `.has()`, `.delete()`.

---

## 3. Top Production Use Cases

### 1. Attaching Private Metadata to DOM Elements
When tracking widget state without polluting DOM dataset attributes or leaking memory when elements are removed:

```javascript
// Safe DOM element metadata cache
const elementClickTracker = new WeakMap();

function registerClick(buttonEl) {
  const currentCount = elementClickTracker.get(buttonEl) || 0;
  elementClickTracker.set(buttonEl, currentCount + 1);
  console.log(`Button clicked ${currentCount + 1} times.`);
}

// When buttonEl is removed from the DOM:
buttonEl.remove();
buttonEl = null;
// The button and its count are AUTOMATICALLY garbage-collected! Zero memory leak!
```

### 2. True Private Data in Classes (Pre-ES2022 Pattern)
```javascript
const privateData = new WeakMap();

class SecureUser {
  constructor(secret) {
    // Store secret mapped weakly to 'this' instance
    privateData.set(this, { secret });
  }

  getSecret() {
    return privateData.get(this).secret;
  }
}
```

---

## 4. WeakSet: Unique Object Tracking

`WeakSet` stores a collection of weakly held objects. It is ideal for tagging objects or tracking "visited" status in graph traversals without altering the objects:

```javascript
const visitedNodes = new WeakSet();

function traverseGraph(node) {
  if (visitedNodes.has(node)) {
    console.log('Cycle detected or already processed:', node.id);
    return;
  }

  visitedNodes.add(node);
  node.children.forEach(child => traverseGraph(child));
}
```

---

## Practice Quiz

### Q1: What is the primary difference between a Map and a WeakMap?
- A) WeakMap runs faster
- B) WeakMap keys must be objects and are held weakly, allowing them to be garbage-collected if no other references exist
- C) Map can only store numbers
- D) WeakMap uses local storage
**Answer:** B
**Explanation:** `WeakMap` holds weak references to its object keys, meaning having an object as a key does not prevent the garbage collector from freeing it.

### Q2: Why does a WeakMap NOT have a .size property or .forEach() method?
- A) It is not implemented in V8 yet
- B) Because the garbage collector could reclaim keys at any unpredictable moment, making the set of keys non-deterministic
- C) WeakMap is deprecated
- D) WeakMap is asynchronous
**Answer:** B
**Explanation:** Because keys can be collected non-deterministically during garbage collection cycles, exposing `.size` or iteration would produce unpredictable results.

### Q3: What error occurs if you attempt to use a primitive string as a key in a WeakMap (e.g. weakMap.set('id', 42))?
- A) SyntaxError
- B) TypeError: Invalid value used as weak map key
- C) ReferenceError
- D) It converts the string into an object automatically
**Answer:** B
**Explanation:** `WeakMap` keys must be garbage-collectable object references; attempting to pass a primitive throws a `TypeError`.

### Q4: Why is WeakMap ideal for caching data associated with DOM nodes?
- A) It formats HTML automatically
- B) When a DOM node is removed from the document and references dropped, its cached data is freed automatically without memory leaks
- C) It connects to IndexedDB
- D) It renders at 60 FPS
**Answer:** B
**Explanation:** Using DOM elements as `WeakMap` keys ensures that whenever elements are deleted from the DOM, their corresponding cached data is automatically cleaned up.

### Q5: What methods are supported on a WeakSet instance?
- A) add(), has(), delete()
- B) push(), pop(), shift()
- C) map(), filter(), reduce()
- D) get(), set(), clear()
**Answer:** A
**Explanation:** `WeakSet` supports only three methods: `add(object)`, `has(object)`, and `delete(object)`.

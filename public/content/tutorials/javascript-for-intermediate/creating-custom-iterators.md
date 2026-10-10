# Creating Custom Iterators in Modern JavaScript

By implementing the `[Symbol.iterator]` method on your own custom objects and classes, you can define custom traversal behaviors. This enables custom data structures (such as Linked Lists, Trees, Pagination Streams, and Number Ranges) to work seamlessly with `for...of` loops, spread syntax, and destructuring.

---

## 1. Making a Custom Object Iterable

To make any plain object iterable, attach a method under the computed property key `[Symbol.iterator]`:

```javascript
const countdown = {
  start: 5,
  end: 1,

  [Symbol.iterator]() {
    let current = this.start;
    const finalVal = this.end;

    return {
      next() {
        if (current >= finalVal) {
          return { value: current--, done: false };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

// Now it works directly with for...of!
for (const num of countdown) {
  console.log(num); // 5, 4, 3, 2, 1
}

// And spread operator!
console.log([...countdown]); // [5, 4, 3, 2, 1]
```

---

## 2. Implementing Iterators in Classes: A Range Class

A reusable `Range` class that can generate numeric sequences:

```javascript
class NumberRange {
  constructor(from, to, step = 1) {
    this.from = from;
    this.to = to;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.from;
    const stop = this.to;
    const step = this.step;

    return {
      next() {
        if (current <= stop) {
          const val = current;
          current += step;
          return { value: val, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// Usage:
const evensUnderTen = new NumberRange(2, 10, 2);

for (const val of evensUnderTen) {
  console.log(val); // 2, 4, 6, 8, 10
}
```

```
Range(2, 10, 2)
  ├── 1st next() ──► { value: 2,  done: false }
  ├── 2nd next() ──► { value: 4,  done: false }
  ├── 3rd next() ──► { value: 6,  done: false }
  ├── 4th next() ──► { value: 8,  done: false }
  ├── 5th next() ──► { value: 10, done: false }
  └── 6th next() ──► { value: undefined, done: true } (Exits loop)
```

---

## 3. Iterating a Data Structure: Linked List

Iterators decouple data structure internals from consumer loops:

```javascript
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(value) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = newNode;
  }

  [Symbol.iterator]() {
    let current = this.head;
    return {
      next() {
        if (current) {
          const val = current.value;
          current = current.next;
          return { value: val, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const list = new LinkedList();
list.append('Alice');
list.append('Bob');
list.append('Charlie');

for (const name of list) {
  console.log('Customer:', name); // Alice, Bob, Charlie
}
```

---

## Practice Quiz

### Q1: What must a class implement to enable instance objects to be used with the for...of statement?
- A) A method named getIterator()
- B) A method named [Symbol.iterator]() that returns an iterator object with a next() method
- C) An entries() function returning an Array
- D) An inherit interface from IterableList
**Answer:** B
**Explanation:** Any class with a `[Symbol.iterator]()` method returning an object with a compliant `next()` method is an iterable and can be consumed by `for...of`.

### Q2: What happens if an iterator returns { value: 10, done: false } indefinitely without ever setting done: true?
- A) JavaScript throws an IteratorOverflowException
- B) A for...of loop consuming it will run in an infinite loop unless terminated by break or return
- C) The browser forces done: true after 100 iterations
- D) The value is automatically coerced to NaN
**Answer:** B
**Explanation:** Infinite iterators are valid in JavaScript; loops consuming them will continue indefinitely unless exited with `break`, `return`, or an exception.

### Q3: What is the return value of [Symbol.iterator]()?
- A) A Promise
- B) An Iterator object that contains a next() method
- C) A JSON string
- D) A standard Array of values
**Answer:** B
**Explanation:** The `[Symbol.iterator]` function is a factory that produces an iterator object containing the `next()` method.

### Q4: Can custom iterators be consumed using the spread operator ([...customIterable])?
- A) No, only arrays can use spread
- B) Yes, the spread operator invokes [Symbol.iterator]() and gathers values into an array
- C) Only in Node.js
- D) Only if the object inherits from Array
**Answer:** B
**Explanation:** The spread syntax `[...iterable]` internally iterates through the iterable until `done: true`, accumulating all `value` properties into a new array.

### Q5: What should an iterator's next() method return once all elements have been yielded?
- A) { value: null, done: false }
- B) { value: undefined, done: true }
- C) null
- D) undefined
**Answer:** B
**Explanation:** Standard convention requires `{ value: undefined, done: true }` to signify the iterator is exhausted.

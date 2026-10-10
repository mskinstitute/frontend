# Generators with function* in Modern JavaScript

While custom iterators are powerful, manually managing state variables and returning `{ value, done }` boilerplate can be tedious. **Generators**—defined using the `function*` syntax and the `yield` operator—provide a clean, stateful way to define iterative algorithms.

---

## 1. Syntax & Core Mechanics

A generator function returns a **Generator object**, which conforms to both the **Iterable** and **Iterator** protocols simultaneously:

```javascript
function* numberSequence() {
  console.log('Sequence started');
  yield 1;
  console.log('Resumed after 1');
  yield 2;
  console.log('Resumed after 2');
  yield 3;
  console.log('Sequence finished');
}

// Calling the generator does NOT execute code immediately!
// It returns a Generator Iterator:
const gen = numberSequence();

console.log(gen.next()); // Prints: 'Sequence started', Returns: { value: 1, done: false }
console.log(gen.next()); // Prints: 'Resumed after 1', Returns: { value: 2, done: false }
console.log(gen.next()); // Prints: 'Resumed after 2', Returns: { value: 3, done: false }
console.log(gen.next()); // Prints: 'Sequence finished', Returns: { value: undefined, done: true }
```

```
Generator Execution Pause/Resume:
  gen.next() ──► Executes until first 'yield' ──► Pauses execution!
  gen.next() ──► Resumes from pause point      ──► Pauses at next 'yield'!
```

---

## 2. Infinite Generators & Lazy Evaluation

Because generators pause until `next()` is explicitly called, they can represent **infinite sequences** without consuming infinite memory (**Lazy Evaluation**):

```javascript
function* idGenerator() {
  let id = 1000;
  while (true) {
    yield `UID_${id++}`;
  }
}

const ids = idGenerator();

console.log(ids.next().value); // 'UID_1000'
console.log(ids.next().value); // 'UID_1001'
console.log(ids.next().value); // 'UID_1002'
// Memory footprint remains constant!
```

---

## 3. Two-Way Communication: Passing Values into next(value)

The `yield` keyword is not only an output statement—it can also receive inputs passed to `gen.next(arg)`:

```javascript
function* conversation() {
  const name = yield 'What is your name?';
  const role = yield `Nice to meet you, ${name}! What is your role?`;
  return `Registered ${name} as ${role}.`;
}

const chat = conversation();

console.log(chat.next().value);       // 'What is your name?'
console.log(chat.next('Priya').value); // 'Nice to meet you, Priya! What is your role?'
console.log(chat.next('Architect').value); // 'Registered Priya as Architect.'
```

---

## 4. Delegating Generators with yield*

The `yield*` operator delegates iteration to another generator or iterable:

```javascript
function* frontendTech() {
  yield 'HTML';
  yield 'CSS';
  yield 'JavaScript';
}

function* backendTech() {
  yield 'Node.js';
  yield 'Django';
}

function* fullStackCurriculum() {
  yield* frontendTech(); // Delegates to frontendTech generator
  yield* backendTech();  // Delegates to backendTech generator
  yield 'Docker';
}

console.log([...fullStackCurriculum()]);
// ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Django', 'Docker']
```

---

## Practice Quiz

### Q1: How do you declare a generator function in JavaScript?
- A) function generator() {}
- B) function* myGenerator() {}
- C) async function*() {}
- D) yield function() {}
**Answer:** B
**Explanation:** Generator functions are declared using an asterisk following the function keyword: `function* myGen() {}` or `function *myGen() {}`.

### Q2: What happens when you invoke a generator function (e.g. const g = myGen())?
- A) It executes the entire function body to completion
- B) It returns a Generator iterator object without executing the function body yet
- C) It throws a SyntaxError if there is no return statement
- D) It blocks the thread until all yields resolve
**Answer:** B
**Explanation:** Calling a generator function does not run the code immediately; it instantiates and returns a generator iterator ready to be stepped through via `.next()`.

### Q3: What is the role of the yield keyword inside a generator?
- A) It terminates the program
- B) It pauses the generator's execution and emits the specified value to the iterator caller
- C) It converts the value into a Promise
- D) It deletes the variable from memory
**Answer:** B
**Explanation:** `yield` pauses execution of the generator function and emits `{ value: yieldValue, done: false }` to the consumer until `.next()` is called again.

### Q4: What does the yield* operator do?
- A) Multiplies the yielded value by 2
- B) Delegates iteration to another generator or iterable collection
- C) Catches any errors thrown inside the generator
- D) Marks the generator as asynchronous
**Answer:** B
**Explanation:** `yield*` delegates iteration to another iterable or generator, yielding each of its values sequentially.

### Q5: Can an infinite while (true) loop inside a generator crash the browser with an Out of Memory error?
- A) Yes, infinite loops always crash the browser
- B) No, because execution suspends at each yield until .next() is called externally
- C) Only if the browser tab is minimized
- D) Yes, because generators run on the CPU core directly
**Answer:** B
**Explanation:** Because generators evaluate lazily and freeze their execution frame on `yield`, an infinite loop only progresses one step at a time when `.next()` is called.

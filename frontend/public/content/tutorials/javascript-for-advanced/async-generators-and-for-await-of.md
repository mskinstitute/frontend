# Async Generators & For-Await-Of in Modern JavaScript

While standard generator functions (`function*`) produce synchronous sequences, modern applications frequently stream asynchronous data chunks—such as real-time WebSocket messages, chunked HTTP response bodies, database cursor pages, and file streams. **Async Generators** (`async function*`) and the **`for await...of`** loop provide first-class language support for asynchronous iteration.

---

## 1. Defining an Async Generator: `async function*`

An async generator function combines `async` with `function*`:
- Each `yield` expression can emit a value or a Promise.
- Calling `.next()` returns a **Promise that resolves to `{ value, done }`**.

```javascript
async function* fetchUserPages(totalPages) {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`[Network] Fetching page ${page}...`);
    // Await API response inside generator
    const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=2`);
    const users = await response.json();

    yield users; // Emits page data asynchronously
  }
}
```

---

## 2. Consuming Streams with `for await...of`

The `for await...of` loop pauses at each iteration until the promise yielded by the async iterator settles:

```javascript
async function processAllPages() {
  const pageStream = fetchUserPages(3);

  // Iterates over each asynchronous batch smoothly!
  for await (const userBatch of pageStream) {
    console.log(`Received batch of ${userBatch.length} users:`);
    userBatch.forEach(u => console.log(` - ${u.name}`));
  }

  console.log('All user pages processed successfully!');
}

processAllPages();
```

```
Async Stream Execution:
  for await...of
      │
      ├──► Awaits page 1 ──► [ Yields 2 Users ] ──► Loop body runs
      ├──► Awaits page 2 ──► [ Yields 2 Users ] ──► Loop body runs
      ├──► Awaits page 3 ──► [ Yields 2 Users ] ──► Loop body runs
      └──► done: true    ──► Loop finishes
```

---

## 3. Streaming Large Files with ReadableStream

Modern browsers and Node.js expose `ReadableStream` on fetch responses. Async iteration enables stream processing without loading gigabyte-sized files into RAM:

```javascript
async function readTextStream(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const textChunk = decoder.decode(value, { stream: true });
      console.log('Received Chunk:', textChunk.length, 'bytes');
    }
  } finally {
    reader.releaseLock();
  }
}
```

---

## 4. Backpressure Management

A major advantage of `for await...of` is **automatic backpressure**:
If processing a chunk takes 500ms, the loop will **not** request the next chunk from the generator until the current loop iteration finishes, preventing memory overflow.

---

## Practice Quiz

### Q1: What does invoking an async generator function (async function*()) return?
- A) A standard synchronous array
- B) An AsyncGenerator object conforming to both AsyncIterable and AsyncIterator protocols
- C) A single resolved Promise
- D) A Web Worker
**Answer:** B
**Explanation:** Calling an `async function*` returns an `AsyncGenerator` object whose `.next()` method returns a Promise resolving to `{ value, done }`.

### Q2: What loop statement is designed to consume AsyncIterables in modern JavaScript?
- A) for...in
- B) for await...of
- C) while (async)
- D) for...of await
**Answer:** B
**Explanation:** The `for await...of` loop statement iterates over async iterable collections, automatically awaiting the Promise returned at each iteration.

### Q3: What is "backpressure" and how does for await...of assist in managing it?
- A) Network bandwidth compression
- B) Ensuring fast data producers do not overwhelm slower data consumers by awaiting consumption before requesting the next item
- C) Encrypting database connections
- D) Preventing CSS layout reflows
**Answer:** B
**Explanation:** Backpressure occurs when data arrives faster than it can be processed. `for await...of` prevents consumer overflow by pausing stream generation until each iteration completes.

### Q4: Can you use the await keyword inside an async function* generator?
- A) No, generators only allow yield
- B) Yes, you can freely use both await and yield inside async generators
- C) Only in TypeScript
- D) Only within try blocks
**Answer:** B
**Explanation:** Async generators allow both `await` (pausing for promises to settle) and `yield` (emitting values to the consumer).

### Q5: What does iterator.next() return when called on an async iterator?
- A) { value: any, done: boolean }
- B) A Promise resolving to { value: any, done: boolean }
- C) An Observable stream
- D) A Callback function
**Answer:** B
**Explanation:** Unlike synchronous iterators which return an object directly, async iterator `.next()` returns a Promise that resolves to `{ value, done }`.

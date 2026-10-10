# Streaming JSON & NDJSON in Modern JavaScript

Standard `JSON.parse()` requires the **entire response payload** to be fully downloaded into memory before parsing begins. For huge datasets (e.g. 500MB log exports, live analytics feeds, financial order books), buffering the whole file in RAM causes browser tabs to crash with Out of Memory errors. **Streaming JSON** and **NDJSON (Newline Delimited JSON)** allow records to be processed item-by-item as chunks arrive over the wire.

---

## 1. What is NDJSON (Newline Delimited JSON)?

**NDJSON** (also known as JSON Lines or `.jsonl`) stores each JSON record on its own line separated by a newline character `\n`:

```
{"id": 1, "event": "PAGE_VIEW", "url": "/home", "timestamp": 1710000000}
{"id": 2, "event": "BUTTON_CLICK", "button": "signup", "timestamp": 1710000005}
{"id": 3, "event": "FORM_SUBMIT", "form": "register", "timestamp": 1710000010}
```

### Why NDJSON is Superior for Streaming:
- No enclosing square brackets `[` or trailing commas `,`.
- Each line can be passed directly to `JSON.parse(line)` immediately as it arrives!

---

## 2. Parsing NDJSON Streams with ReadableStream

```javascript
async function consumeNdjsonStream(url, onRecordReceived) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let leftoverBuffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    // Decode incoming binary chunk into string and append to leftover buffer
    leftoverBuffer += decoder.decode(value, { stream: true });

    // Split buffer by newlines
    const lines = leftoverBuffer.split('\n');

    // The last element may be incomplete! Keep it in the buffer for next chunk
    leftoverBuffer = lines.pop();

    // Process all fully completed lines
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        try {
          const record = JSON.parse(trimmed);
          onRecordReceived(record); // Stream to UI or store
        } catch (e) {
          console.error('Malformed NDJSON line:', trimmed);
        }
      }
    }
  }

  // Process any remaining tail in the buffer
  if (leftoverBuffer.trim()) {
    onRecordReceived(JSON.parse(leftoverBuffer.trim()));
  }
}
```

```
Network Stream (Byte Chunks)
  ├── Chunk 1: '{"id":1}\n{"id":'  ──► Process record 1; Buffer '{"id":'
  └── Chunk 2: '2}\n{"id":3}\n'     ──► Complete record 2; Process record 3
```

---

## 3. High-Performance Transform Streams

In modern browsers supporting `TransformStream` and `TextDecoderStream`, you can pipe streams with declarative backpressure:

```javascript
async function modernStream(url) {
  const response = await fetch(url);
  
  const stream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new LineSplitterStream());

  for await (const line of stream) {
    const json = JSON.parse(line);
    renderRowToTable(json);
  }
}
```

---

## Practice Quiz

### Q1: What is the defining characteristic of NDJSON (Newline Delimited JSON)?
- A) All numbers are written in Roman numerals
- B) Each JSON object is on its own separate line terminated by a newline character (\n), without outer brackets or separating commas
- C) It is encoded in XML
- D) It only works in Node.js
**Answer:** B
**Explanation:** NDJSON places valid, distinct JSON objects on individual lines separated by `\n`, allowing each line to be parsed independently.

### Q2: Why does JSON.parse() fail when dealing with a 500MB continuous data stream?
- A) JSON.parse only accepts 10 characters
- B) JSON.parse requires the entire payload string to exist in memory before executing, risking Out of Memory crashes and blocking the thread
- C) JSON cannot contain arrays
- D) It requires a Web Worker
**Answer:** B
**Explanation:** `JSON.parse` is an all-or-nothing parser; buffering massive payloads in memory causes high latency and can trigger out-of-memory errors.

### Q3: Why is leftoverBuffer = lines.pop() used when splitting streaming chunks by newline?
- A) To delete the first line
- B) Because chunk boundaries rarely align cleanly with newlines, meaning the last split element is often an incomplete, partial JSON line
- C) To reverse the array
- D) To prevent memory leaks
**Answer:** B
**Explanation:** Network chunks can split mid-line (e.g. `{"id": 4`), so the partial segment must be retained and prepended to the next incoming chunk.

### Q4: Which standard browser API converts raw Uint8Array binary stream chunks into text strings while handling split multi-byte characters?
- A) String.fromCharCode()
- B) TextDecoder with { stream: true }
- C) JSON.stringify()
- D) btoa()
**Answer:** B
**Explanation:** `new TextDecoder('utf-8').decode(chunk, { stream: true })` decodes binary bytes into text, preserving multi-byte UTF-8 character boundaries across chunk edges.

### Q5: What is the memory footprint of streaming 10 million NDJSON records compared to standard JSON.parse?
- A) It consumes 10 times more memory
- B) It maintains a constant, near-zero memory footprint because records are parsed and processed incrementally without buffering the whole file
- C) It consumes the exact same memory
- D) It requires 16GB RAM
**Answer:** B
**Explanation:** Streaming processes one record at a time, allowing processed objects to be garbage-collected immediately, maintaining low, constant memory usage.

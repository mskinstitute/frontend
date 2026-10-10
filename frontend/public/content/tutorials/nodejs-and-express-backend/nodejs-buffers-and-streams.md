# Buffers and Streams: Readable, Writable & Pipeline for Large Files

When dealing with large files, video feeds, or high-throughput network packets, loading the entire payload into RAM via `fs.readFile()` will instantly exhaust server memory and crash the process. Node.js solves this with **Buffers** (raw binary memory) and **Streams** (processing data chunk-by-chunk in real time).

---

## 1. Understanding Buffers

A **Buffer** is a fixed-size chunk of memory allocated outside the V8 JavaScript heap. It stores raw binary bytes (octets):

```javascript
// Allocate buffer of 10 bytes initialized with zeros
const buf = Buffer.alloc(10);

// Create buffer from UTF-8 string
const strBuf = Buffer.from('Hello Node.js', 'utf-8');
console.log(strBuf); // <Buffer 48 65 6c 6c 6f 20 4e 6f 64 65 2e 6a 73>
console.log(strBuf.toString('hex')); // Hexadecimal representation
console.log(strBuf.toString('base64')); // Base64 encoding
```

---

## 2. The 4 Fundamental Stream Types

1. **Readable Streams:** Source of data to read from (`fs.createReadStream`, `http.IncomingMessage`).
2. **Writable Streams:** Destination to write data into (`fs.createWriteStream`, `http.ServerResponse`).
3. **Duplex Streams:** Both Readable and Writable simultaneously (TCP socket).
4. **Transform Streams:** Modifies or transforms the data chunk as it passes through (`zlib.createGzip`, crypto cipher).

---

## 3. Streaming Huge Files with Backpressure and `pipeline`

Using `.pipe()` is convenient, but if a stream errors mid-transmission, old `.pipe()` calls often leak open file descriptors. Modern Node.js standardizes on `stream.promises.pipeline` to handle errors and cleanup automatically:

```javascript
import fs from 'node:fs';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function compressLargeLogFile(inputPath, outputPath) {
  try {
    const readStream = fs.createReadStream(inputPath);
    const gzipTransform = zlib.createGzip();
    const writeStream = fs.createWriteStream(outputPath);

    // pipeline manages backpressure and ensures all streams close cleanly on failure
    await pipeline(readStream, gzipTransform, writeStream);
    console.log('File compressed successfully with zero memory overhead!');
  } catch (err) {
    console.error('Pipeline failed:', err.message);
  }
}

compressLargeLogFile('./access-5gb.log', './access-5gb.log.gz');
```

---

## 4. What is Backpressure?

If a Readable stream produces data faster than the Writable destination can write to disk or network (e.g. reading from an NVMe SSD at 3 GB/s and sending over a 10 Mbps internet connection), incoming chunks accumulate in RAM. **Backpressure** pauses the readable stream until the writable stream drains its buffer, maintaining a constant, predictable memory footprint under 30 MB regardless of file size.

---

# Multiple Choice Questions

### 1. Where is the memory for a Node.js `Buffer` allocated?
A. In browser localStorage.
B. Outside the V8 JavaScript garbage-collected heap in native C++ memory.
C. Inside CSS stylesheets.
D. On an external Redis cluster.
**Answer:** B
**Explanation:** Buffers represent raw binary memory allocated outside the V8 heap, enabling fast, zero-copy interactions with the OS network and file systems.
---

### 2. Why is streaming preferred over `fs.readFile()` when handling multi-gigabyte files in a backend API?
A. Streams prevent the entire file from being loaded into RAM, processing data in small chunks (e.g. 64KB) to keep memory usage minimal.
B. Streams delete the file after reading.
C. `fs.readFile()` only supports text files under 1 KB.
D. Streams convert all data to HTML.
**Answer:** A
**Explanation:** Streams process data in small chunks sequentially, allowing a 10GB file to be transferred with only ~30MB of RAM.
---

### 3. What is "backpressure" in Node.js streams?
A. A physical cooling fan in the server rack.
B. The mechanism that throttles a fast data producer when a slow data consumer's internal buffer becomes full.
C. A network security attack.
D. Compiling TypeScript into WebAssembly.
**Answer:** B
**Explanation:** Backpressure occurs when data flows in faster than it can be consumed; the stream pauses the producer until the consumer signals it is ready for more chunks.
---

### 4. Which built-in utility handles error cleanup and automatically tears down streams when an error occurs during piped execution?
A. `stream.link()`
B. `stream.promises.pipeline()`
C. `fs.watch()`
D. `process.exit()`
**Answer:** B
**Explanation:** `pipeline()` safely pipes streams together, forwards errors correctly, and ensures all file descriptors are closed if any stream fails.
---

### 5. Which type of stream is `zlib.createGzip()`, which takes uncompressed bytes and outputs compressed bytes?
A. Readable Stream only
B. Writable Stream only
C. Transform Stream
D. Static Stream
**Answer:** C
**Explanation:** A Transform stream is a duplex stream where the output is computed dynamically from the input chunks (e.g., compression, encryption).
---

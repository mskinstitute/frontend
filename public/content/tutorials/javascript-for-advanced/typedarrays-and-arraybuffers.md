# TypedArrays & ArrayBuffers in Modern JavaScript

Standard JavaScript arrays are dynamic, hash-like objects capable of holding heterogeneous types. While flexible, they carry substantial memory overhead and cannot directly interface with raw binary hardware protocols, WebGL shaders, audio streams, or WebAssembly. **`ArrayBuffer`** and **`TypedArrays`** provide fast, fixed-size, low-level binary memory management.

---

## 1. ArrayBuffer: The Raw Memory Slab

An `ArrayBuffer` represents a fixed-length contiguous block of raw binary memory:

```javascript
// Allocate a 16-byte memory block (initialized with zeros)
const buffer = new ArrayBuffer(16);

console.log('Buffer byte length:', buffer.byteLength); // 16
```

> **Crucial Rule:** You **cannot** directly read or write to an `ArrayBuffer` directly! You must access it through a **View**—either a `TypedArray` or a `DataView`.

---

## 2. TypedArray Views

A `TypedArray` interprets the underlying buffer as an array of elements of a specific numerical type:

```
        Raw ArrayBuffer (16 Bytes)
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │ 10│ 11│ 12│ 13│ 14│ 15│
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
▲                   ▲                   ▲                   ▲
│ Int32 (4 bytes)   │ Int32 (4 bytes)   │ Int32 (4 bytes)   │ Int32 (4 bytes)
```

| TypedArray | Element Type | Bytes per Element | Value Range |
| :--- | :--- | :--- | :--- |
| `Int8Array` | 8-bit Signed Int | 1 | -128 to 127 |
| `Uint8Array` | 8-bit Unsigned Int | 1 | 0 to 255 |
| `Uint8ClampedArray`| 8-bit Clamped Int | 1 | 0 to 255 (Clamps overflow, Canvas/Image data) |
| `Int16Array` | 16-bit Signed Int | 2 | -32,768 to 32,767 |
| `Int32Array` | 32-bit Signed Int | 4 | -2,147,483,648 to 2,147,483,647 |
| `Float32Array` | 32-bit Float | 4 | IEEE 754 floating point (WebGL vectors) |
| `Float64Array` | 64-bit Float | 8 | Standard JS Number precision |

```javascript
const buffer = new ArrayBuffer(8); // 8 bytes

// View buffer as two 32-bit integers:
const int32View = new Int32Array(buffer);
int32View[0] = 42;
int32View[1] = 1000;

console.log(int32View.length); // 2 elements
```

---

## 3. DataView & Endianness (Byte Ordering)

When parsing binary file formats (e.g. PNG headers, MP3 tags) or network packets, different systems store multi-byte numbers in different byte orders (**Big-Endian** vs **Little-Endian**). `DataView` allows heterogeneous reading/writing with explicit endianness control:

```javascript
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);

// Write 16-bit int at byte offset 0 in Little-Endian format:
view.setUint16(0, 0x1234, true); // true = little-endian

// Read back in Big-Endian:
console.log(view.getUint16(0, false).toString(16)); // "3412" (Bytes swapped!)
```

---

## 4. Subarray vs. Slice (Zero-Copy Sharing)

- **`typedArray.subarray(start, end)`:** Creates a new TypedArray view **sharing the exact same memory buffer** (Zero copy!).
- **`typedArray.slice(start, end)`:** Creates a **deep copy** with a newly allocated buffer.

```javascript
const original = new Uint8Array([10, 20, 30, 40]);
const sub = original.subarray(1, 3); // Views [20, 30]

sub[0] = 99; // Mutates shared buffer!
console.log(original[1]); // 99! (Shared memory)
```

---

## Practice Quiz

### Q1: What is an ArrayBuffer in JavaScript?
- A) A dynamic array of strings
- B) A fixed-length contiguous block of raw binary memory
- C) A JSON file buffer
- D) A WebSocket connection
**Answer:** B
**Explanation:** An `ArrayBuffer` is a low-level object representing a fixed-length chunk of raw binary data in memory.

### Q2: Can you directly write values into an ArrayBuffer without using a View?
- A) Yes, using buffer.push()
- B) No, an ArrayBuffer cannot be read or modified directly; you must wrap it in a TypedArray or DataView
- C) Only in Node.js
- D) Yes, via buffer[0] = 1
**Answer:** B
**Explanation:** `ArrayBuffer` is purely a memory allocation; accessing or manipulating bytes requires a view such as `Uint8Array` or `DataView`.

### Q3: What makes Uint8ClampedArray unique compared to a standard Uint8Array?
- A) It holds negative numbers
- B) If a value exceeds 255 or falls below 0, it clamps to 255 or 0 instead of wrapping around, which is essential for HTML5 Canvas RGBA pixel manipulation
- C) It is asynchronous
- D) It runs on the GPU
**Answer:** B
**Explanation:** `Uint8ClampedArray` clamps values outside 0–255 to the nearest bound (e.g. 300 becomes 255, -10 becomes 0), matching image pixel requirements.

### Q4: What is the primary purpose of DataView?
- A) To display charts in the browser
- B) To read and write heterogeneous numbers with explicit control over endianness (byte order) at arbitrary byte offsets
- C) To validate forms
- D) To render 3D WebGL models
**Answer:** B
**Explanation:** `DataView` provides byte-level access to an ArrayBuffer with explicit control over endianness (big-endian vs little-endian), which is critical for parsing binary protocols.

### Q5: How does typedArray.subarray() differ from typedArray.slice()?
- A) subarray() throws an error on large buffers
- B) subarray() creates a new view referencing the same memory buffer (zero copy), whereas slice() copies the memory into a fresh buffer
- C) slice() works only on strings
- D) There is no difference
**Answer:** B
**Explanation:** `.subarray()` creates a new TypedArray view over the existing memory buffer without copying bytes, while `.slice()` allocates a new buffer and copies the data.

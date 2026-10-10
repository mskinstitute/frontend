# Storing Complex Objects & Blobs in IndexedDB

One of the greatest capabilities of IndexedDB is its native support for the **Structured Clone Algorithm**. Unlike `localStorage` (which requires manual `JSON.stringify` that strips binary data and types), IndexedDB natively stores complex JavaScript objects—including `Blob`, `File`, `ArrayBuffer`, `Date`, `Map`, `Set`, and cyclic objects.

---

## 1. Supported Types vs. JSON Limitations

| Data Type | `localStorage` (via JSON) | IndexedDB (Structured Clone) |
| :--- | :--- | :--- |
| **Binary Blobs & Files** | Drops or requires huge base64 strings | Native binary storage (Zero overhead) |
| **TypedArrays & ArrayBuffers** | Loses typed structure | Supported natively |
| **Date Objects** | Converted to plain ISO string | Preserved as true `Date` instances |
| **RegExp Objects** | Lost / converted to empty object `{}`| Preserved |
| **Circular Object References** | Throws `TypeError: Converting circular structure` | Supported natively |

---

## 2. Storing & Retrieving Binary Images and PDF Blobs

In an offline PWA or multimedia app, you can download files via `fetch()`, store the raw binary `Blob` directly in IndexedDB, and render it offline without network access:

```javascript
// Function to download and persist an image file offline
async function cacheImageOffline(db, imageUrl, imageId) {
  // Step 1: Download raw binary blob
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Step 2: Store directly into IndexedDB
  const tx = db.transaction(['mediaStore'], 'readwrite');
  const store = tx.objectStore('mediaStore');

  store.put({
    id: imageId,
    contentType: blob.type,
    fileData: blob, // Storing raw binary Blob directly!
    savedAt: new Date()
  });

  return new Promise((resolve) => {
    tx.oncomplete = () => {
      console.log(`Image "${imageId}" stored offline in IndexedDB.`);
      resolve();
    };
  });
}
```

---

## 3. Rendering Stored Blobs in the DOM

To display a stored Blob without uploading or converting to base64, use `URL.createObjectURL()`:

```javascript
async function displayOfflineImage(db, imageId, imgElement) {
  const tx = db.transaction(['mediaStore'], 'readonly');
  const store = tx.objectStore('mediaStore');
  const request = store.get(imageId);

  request.onsuccess = () => {
    const record = request.result;
    if (record && record.fileData instanceof Blob) {
      // Generate a temporary local object URL
      const objectUrl = URL.createObjectURL(record.fileData);
      imgElement.src = objectUrl;

      // Clean up object URL when image loads to prevent memory leaks
      imgElement.onload = () => URL.revokeObjectURL(objectUrl);
    }
  };
}
```

```
Network / File System ──► Blob ──► IndexedDB (Binary on disk)
                                         │
                                         ▼ URL.createObjectURL()
                                   blob:https://... ──► <img src="...">
```

---

## 4. Storing Multi-Tier Relational Graphs

Because IndexedDB uses the Structured Clone Algorithm, complex hierarchical objects with circular relationships can be stored safely:

```javascript
const nodeA = { name: 'Node Alpha' };
const nodeB = { name: 'Node Beta', partner: nodeA };
nodeA.partner = nodeB; // Circular reference!

// Storing in IndexedDB:
const tx = db.transaction(['graphStore'], 'readwrite');
tx.objectStore('graphStore').put({ id: 'graph_1', root: nodeA });
// Succeeds without error! JSON.stringify would have thrown an exception!
```

---

## Practice Quiz

### Q1: What algorithm enables IndexedDB to natively store Blobs, Dates, and cyclic references without JSON.stringify()?
- A) The Base64 Compression Algorithm
- B) The Structured Clone Algorithm
- C) The WebAssembly Memory Mapper
- D) The V8 Garbage Collector
**Answer:** B
**Explanation:** IndexedDB relies on the Structured Clone Algorithm to serialize and deserialize rich JavaScript structures, including binary Blobs, Maps, Sets, and Dates.

### Q2: What Web API function creates a temporary DOMString URL (e.g. blob:https://...) from a stored Blob for rendering in an <img> tag?
- A) URL.createObjectURL(blob)
- B) Blob.toUrl()
- C) window.convertBlob()
- D) document.renderBlob()
**Answer:** A
**Explanation:** `URL.createObjectURL(blob)` generates a unique temporary URL pointing to the in-memory Blob, allowing it to be used in `src` attributes of images, videos, and iframes.

### Q3: Why is storing large binary files as Blobs in IndexedDB superior to storing Base64 strings in localStorage?
- A) Base64 encoding inflates file size by ~33% and localStorage has a strict ~5MB limit, while IndexedDB stores raw binary efficiently with gigabyte quotas
- B) localStorage does not support strings
- C) Blobs cannot be read in JavaScript
- D) Base64 strings crash CSS
**Answer:** A
**Explanation:** Base64 encoding increases data volume by ~33% and blocks the main thread in `localStorage`, whereas IndexedDB stores binary efficiently with high storage limits.

### Q4: What should you call after an image has finished loading a blob: URL to prevent memory leaks in the browser?
- A) URL.revokeObjectURL(url)
- B) delete URL
- C) blob.destroy()
- D) window.gc()
**Answer:** A
**Explanation:** `URL.revokeObjectURL(objectUrl)` releases the internal reference to the Blob held by the browser, allowing the memory to be reclaimed.

### Q5: What happens if you attempt to store an object with circular references into IndexedDB?
- A) It throws TypeError: Converting circular structure
- B) The Structured Clone Algorithm handles it gracefully, preserving the circular reference in storage
- C) It crashes the browser
- D) It deletes the object
**Answer:** B
**Explanation:** The Structured Clone algorithm natively supports cyclic graphs, preserving circular object references across storage and retrieval.

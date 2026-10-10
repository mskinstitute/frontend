# IndexedDB Architecture & Transactions in Modern JavaScript

While `localStorage` is restricted to ~5MB of synchronous string data, modern Progressive Web Apps (PWAs) and offline-first enterprise applications require gigabytes of structured storage. **IndexedDB** is a transactional, asynchronous, object-oriented database built natively into every modern web browser.

---

## 1. Architecture: Key Concepts

```
┌─────────────────────────────────────────────────────────────┐
│                    INDEXEDDB DATABASE                       │
├─────────────────────────────────────────────────────────────┤
│  • Database Name (e.g. 'EnterpriseAppDB')                   │
│  • Version Number (e.g. 1, 2, 3)                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Object Store: 'users' (like a SQL Table or Mongo Coll)│  │
│  │   • Primary Key: 'id' (keyPath)                       │  │
│  │   • Index: 'email' (unique: true)                     │  │
│  │   • Index: 'role'  (unique: false)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **Object Stores:** Collections of records storing JavaScript objects, arrays, and binary Blobs.
- **Transactions:** Every read or write operation is scoped inside an atomic transaction (`readonly` or `readwrite`).
- **Asynchronous:** Operates without blocking the main browser thread.

---

## 2. Opening a Database & Schema Migration: `onupgradeneeded`

Schema changes (creating object stores or indexes) can **only** occur during a database version change in the `onupgradeneeded` event:

```javascript
const DB_NAME = 'EnterpriseDB';
const DB_VERSION = 1;

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  console.log('Database upgrade triggered! Initializing schema...');

  // Create Object Store with keyPath 'id'
  if (!db.objectStoreNames.contains('customers')) {
    const store = db.createObjectStore('customers', { keyPath: 'id' });
    
    // Create searchable indexes
    store.createIndex('by_email', 'email', { unique: true });
    store.createIndex('by_country', 'country', { unique: false });
  }
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('Database opened successfully!');
  performOperations(db);
};

request.onerror = (event) => {
  console.error('Failed to open IndexedDB:', event.target.error);
};
```

---

## 3. CRUD Operations with Atomic Transactions

All operations require opening a transaction:

```javascript
function performOperations(db) {
  // 1. Open a ReadWrite Transaction
  const transaction = db.transaction(['customers'], 'readwrite');
  const store = transaction.objectStore('customers');

  // 2. Insert Record
  const newCustomer = {
    id: 'CUST-101',
    name: 'Sarah Connor',
    email: 'sarah@skynet-resistance.org',
    country: 'USA',
    orders: [100, 250, 40]
  };

  const addRequest = store.put(newCustomer); // 'put' inserts or updates!

  addRequest.onsuccess = () => {
    console.log('Customer saved to IndexedDB.');
  };

  // 3. Query Record via Index
  const emailIndex = store.index('by_email');
  const queryRequest = emailIndex.get('sarah@skynet-resistance.org');

  queryRequest.onsuccess = () => {
    console.log('Found Customer:', queryRequest.result.name);
  };

  // Transaction Lifecycle Events
  transaction.oncomplete = () => {
    console.log('All transaction operations committed to disk atomically!');
  };

  transaction.onerror = (e) => {
    console.error('Transaction aborted:', e.target.error);
  };
}
```

---

## 4. Modernizing IndexedDB with Promises (idb Library Pattern)

Because native IndexedDB uses legacy DOM event listeners (`onsuccess`/`onerror`), wrapping it in Promises or using modern libraries like `idb` creates cleaner async/await code:

```javascript
function getRecordAsync(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
```

---

## Practice Quiz

### Q1: In which lifecycle event can object stores and indexes be created or modified in IndexedDB?
- A) onsuccess
- B) onupgradeneeded
- C) oncomplete
- D) onopen
**Answer:** B
**Explanation:** Modifications to the database schema (creating or deleting object stores and indexes) can only be executed inside the `onupgradeneeded` callback when the version changes.

### Q2: What are the two primary transaction modes used in IndexedDB?
- A) 'insert' and 'delete'
- B) 'readonly' and 'readwrite'
- C) 'public' and 'private'
- D) 'fast' and 'slow'
**Answer:** B
**Explanation:** IndexedDB transactions are scoped as either `'readonly'` (concurrent non-blocking reads) or `'readwrite'` (exclusive atomic writes).

### Q3: How does IndexedDB differ fundamentally from localStorage?
- A) IndexedDB stores data in plain text cookies
- B) IndexedDB is asynchronous, transactional, can store gigabytes of complex JS objects and binary data, and does not block the UI thread
- C) IndexedDB can only store 5MB
- D) IndexedDB only works in Node.js
**Answer:** B
**Explanation:** Unlike the synchronous 5MB string-only `localStorage`, `IndexedDB` is a full-featured asynchronous transactional database capable of holding large structured and binary data.

### Q4: What method inserts or overwrites an existing record based on primary key in an Object Store?
- A) store.add()
- B) store.put()
- C) store.insert()
- D) store.upsert()
**Answer:** B
**Explanation:** While `.add()` fails if a record with the same key exists, `.put()` updates existing records or inserts new ones (upsert).

### Q5: What is the purpose of an Index in an IndexedDB Object Store?
- A) To sort CSS styles
- B) To allow querying records by object properties other than the primary keyPath
- C) To count the number of tables
- D) To encrypt the database file
**Answer:** B
**Explanation:** Indexes allow querying records by secondary properties (like searching customers by `email` or `country`) rather than only by primary key.

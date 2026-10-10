# LocalStorage in Modern JavaScript

The `localStorage` object provides a mechanism for storing key-value pairs in the user's web browser with **no expiration date**. Data persists even when the browser window is closed and reopened, making it ideal for persisting theme preferences, shopping cart state, and user settings.

---

## 1. Characteristics of LocalStorage

- **Persistence:** Data remains stored indefinitely until cleared via JavaScript or user browser settings.
- **Storage Capacity:** Approximately **5MB to 10MB** per origin (depending on browser).
- **Domain Scoped (Same-Origin Policy):** Data is isolated by protocol, domain, and port (`https://example.com` cannot access `http://example.com` or `https://api.example.com`).
- **Synchronous API:** Methods execute on the main thread (blocking operations).
- **String Only:** All keys and values are stored strictly as **strings**!

---

## 2. Core API Methods

```javascript
// 1. setItem(key, value): Stores a key-value pair
localStorage.setItem('theme', 'dark');

// 2. getItem(key): Retrieves the value for a key (or returns null if non-existent)
const activeTheme = localStorage.getItem('theme');
console.log('Saved theme:', activeTheme); // 'dark'

// 3. removeItem(key): Deletes a specific key
localStorage.removeItem('theme');

// 4. clear(): Wipes all stored keys for the current origin
localStorage.clear();

// 5. length & key(index): Inspection
console.log('Total items in storage:', localStorage.length);
```

---

## 3. Storing Objects & Arrays with JSON Serialization

Because `localStorage` only stores strings, attempting to pass a raw object results in `"[object Object]"`:

```javascript
const user = { id: 1, name: 'Alex' };

// MISTAKE:
localStorage.setItem('user', user);
console.log(localStorage.getItem('user')); // "[object Object]" (Useless!)

// CORRECT WAY: Serialize with JSON
localStorage.setItem('user', JSON.stringify(user));

// RETRIEVE: Deserialize with JSON.parse()
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // 'Alex'
```

---

## 4. Safe Storage Wrapper with try...catch

Accessing `localStorage` can throw errors if:
1. The user has disabled cookies/storage in privacy settings.
2. The browser is in strict private/incognito mode.
3. The storage quota has been exceeded (`QuotaExceededError`).

```javascript
const StorageService = {
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Storage quota exceeded or disabled for key "${key}":`, error);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
};
```

---

## 5. Listening to Storage Changes Across Tabs: The storage Event

When `localStorage` is updated in one browser tab, other open tabs on the same origin receive a `storage` event:

```javascript
window.addEventListener('storage', (event) => {
  console.log(`Key changed: ${event.key}`);
  console.log(`Old Value: ${event.oldValue}`);
  console.log(`New Value: ${event.newValue}`);
  console.log(`Triggered by URL: ${event.url}`);

  if (event.key === 'theme') {
    document.body.className = event.newValue;
  }
});
```

---

## Practice Quiz

### Q1: How long does data saved in localStorage persist?
- A) Until the current browser tab is closed
- B) Exactly 24 hours
- C) Indefinitely, until explicitly deleted by code or user browser reset
- D) Until the operating system reboots
**Answer:** C
**Explanation:** Unlike `sessionStorage`, `localStorage` has no expiration time; data persists across tab closes and browser restarts.

### Q2: What data type does localStorage store for values?
- A) Any primitive or binary object
- B) Strictly UTF-16 strings
- C) Encrypted JSON blobs
- D) ArrayBuffers
**Answer:** B
**Explanation:** `localStorage` stores both keys and values strictly as strings. Non-string values are automatically coerced to strings.

### Q3: What happens if you call localStorage.getItem('non_existent_key')?
- A) It throws a ReferenceError
- B) It returns undefined
- C) It returns null
- D) It returns an empty string ""
**Answer:** C
**Explanation:** When querying a key that does not exist in the storage map, `getItem()` returns `null`.

### Q4: Why must objects be passed through JSON.stringify() before saving to localStorage?
- A) To compress the object into gzip format
- B) Otherwise JavaScript coerces the object to the literal string "[object Object]"
- C) To protect against SQL injection
- D) To satisfy the browser's cryptographic requirement
**Answer:** B
**Explanation:** Because `localStorage` coerces inputs to strings, passing an un-serialized object calls its `.toString()` method, yielding `"[object Object]"`.

### Q5: In what scenario will the window storage event fire?
- A) Every time localStorage is updated in the current active tab
- B) When localStorage is modified in a DIFFERENT tab or window of the same origin
- C) When the user clears history
- D) Whenever cookies expire
**Answer:** B
**Explanation:** The `storage` event fires in all other tabs/windows of the same origin to synchronize state; it does not fire in the document that made the modification.

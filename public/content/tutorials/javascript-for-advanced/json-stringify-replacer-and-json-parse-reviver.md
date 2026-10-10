# JSON.stringify Replacer & JSON.parse Reviver

Almost every JavaScript developer uses `JSON.stringify(data)` and `JSON.parse(str)`. However, few realize that both methods accept a powerful second argument: the **Replacer** and the **Reviver**. These transform functions enable masking sensitive fields, formatting custom types, and restoring `Date` and `Map` instances during serialization.

---

## 1. JSON.stringify() with the Replacer

The syntax for `JSON.stringify`:
```javascript
JSON.stringify(value, replacer, space);
```

### Option A: Replacer as a Function (Filter / Transformer)
The replacer function is called for every key-value pair. Returning `undefined` **omits the property from the output**:

```javascript
const userProfile = {
  id: 101,
  username: 'alex_admin',
  passwordHash: '$2b$10$e892u3...', // SENSITIVE!
  creditCard: '4111-2222-3333-4444', // SENSITIVE!
  createdAt: new Date()
};

// Mask sensitive fields during serialization:
const safeJson = JSON.stringify(userProfile, (key, value) => {
  if (key === 'passwordHash') return undefined; // Strips key completely!
  if (key === 'creditCard') return '****-****-****-' + value.slice(-4); // Masks
  return value; // Passthrough other values
}, 2);

console.log(safeJson);
// {
//   "id": 101,
//   "username": "alex_admin",
//   "creditCard": "****-****-****-4444",
//   "createdAt": "2026-03-15T..."
// }
```

### Option B: Replacer as an Array (Property Whitelist)
Passing an array of property names acts as an exact whitelist:

```javascript
// Include ONLY 'id' and 'username'
const whitelistedJson = JSON.stringify(userProfile, ['id', 'username']);
console.log(whitelistedJson); // '{"id":101,"username":"alex_admin"}'
```

---

## 2. JSON.parse() with the Reviver

By default, `JSON.parse()` converts ISO date strings into plain strings. A **Reviver function** inspects each key-value pair and transforms it back into a native JavaScript object:

```javascript
const jsonString = '{"eventId":"EV-99","scheduledDate":"2026-06-15T09:30:00.000Z"}';

// Reviver: Restore ISO string into a true Date instance!
const parsedEvent = JSON.parse(jsonString, (key, value) => {
  // Check if string matches ISO 8601 date pattern
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
});

console.log(parsedEvent.scheduledDate instanceof Date); // TRUE!
console.log(parsedEvent.scheduledDate.getFullYear());    // 2026
```

---

## 3. Serializing BigInt and Custom Types

By default, attempting to serialize a `BigInt` throws `TypeError: Do not know how to serialize a BigInt`. A replacer handles this cleanly:

```javascript
const transaction = {
  id: 'TX-1',
  amountSatoshis: 1000000000000000000n // BigInt!
};

const json = JSON.stringify(transaction, (key, val) => 
  typeof val === 'bigint' ? val.toString() + 'n' : val
);

console.log(json); // '{"id":"TX-1","amountSatoshis":"1000000000000000000n"}'
```

---

## Practice Quiz

### Q1: What happens if a JSON.stringify() replacer function returns undefined for a given property key?
- A) It outputs "key": null
- B) The property is completely omitted from the resulting JSON string
- C) It throws a TypeError
- D) It outputs "key": undefined
**Answer:** B
**Explanation:** Returning `undefined` from a `JSON.stringify` replacer function causes the key to be omitted from the output JSON.

### Q2: How can you whitelist only the properties "id" and "title" when calling JSON.stringify(book)?
- A) JSON.stringify(book, ['id', 'title'])
- B) JSON.stringify(book, { allow: ['id', 'title'] })
- C) JSON.stringify(book, 'id,title')
- D) JSON.stringify(book, 2)
**Answer:** A
**Explanation:** Supplying an array of strings as the second argument to `JSON.stringify` acts as an exact property whitelist.

### Q3: What is the primary role of the reviver function in JSON.parse(str, reviver)?
- A) To encrypt the JSON string
- B) To transform and instantiate parsed values (such as converting ISO date strings back into true Date instances)
- C) To validate HTML tags
- D) To measure parsing speed
**Answer:** B
**Explanation:** The reviver function inspects every parsed key-value pair, enabling custom deserialization like converting date strings back to native `Date` objects.

### Q4: Why does JSON.stringify({ amount: 100n }) throw an error without a replacer?
- A) 100n is too small
- B) The JSON specification has no representation for BigInt, so JSON.stringify throws a TypeError unless handled by a replacer
- C) BigInt only works in Node.js
- D) Strict mode is disabled
**Answer:** B
**Explanation:** Standard JSON does not define a representation for `BigInt`, causing `JSON.stringify` to throw a `TypeError` unless converted in a replacer.

### Q5: What does the third parameter in JSON.stringify(obj, null, 2) control?
- A) The recursion depth limit
- B) The indentation spacing for pretty-printing human-readable JSON
- C) The HTTP port
- D) The timeout in seconds
**Answer:** B
**Explanation:** The third argument specifies indentation spaces (or a tab string) for pretty-printing formatted JSON.

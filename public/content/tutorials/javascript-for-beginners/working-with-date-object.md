# Working with the Date Object in JavaScript

Handling timestamps, calculating elapsed time, and formatting dates are essential skills for building web applications (booking engines, analytics dashboards, expiration timers). JavaScript provides the built-in **`Date`** object to manage dates and times.

---

## 1. Creating Date Instances

A JavaScript `Date` object represents a single moment in time, measured in milliseconds since the **Unix Epoch** (January 1, 1970, 00:00:00 UTC).

```javascript
// 1. Current date and time:
const now = new Date();
console.log(now); // e.g. Mon Sep 15 2026 10:45:00 GMT+0530

// 2. From an ISO 8601 date string:
const eventDate = new Date("2026-09-15T09:00:00");

// 3. From individual arguments: (Year, MonthIndex, Day, Hours, Minutes, Seconds)
// ⚠️ WARNING: Month is 0-indexed! 0 = January, 8 = September, 11 = December!
const customDate = new Date(2026, 8, 15, 10, 30);

// 4. From Epoch Milliseconds:
const fromEpoch = new Date(0); // Jan 01 1970
```

---

## 2. Getting Date & Time Components

```javascript
const d = new Date();

console.log(d.getFullYear()); // 2026
console.log(d.getMonth());    // 8 (September, 0-indexed!)
console.log(d.getDate());     // 15 (Day of the month, 1-31)
console.log(d.getDay());      // 1 (Day of week: 0=Sunday, 1=Monday... 6=Saturday)
console.log(d.getHours());    // Current hour (0-23)
console.log(d.getMinutes());  // Current minute (0-59)
console.log(d.getSeconds());  // Current second (0-59)
console.log(d.getTime());     // Milliseconds since Jan 1, 1970
```

---

## 3. Calculating Time Differences (Elapsed Time)

Because subtracting dates yields the difference in milliseconds, time calculations are straightforward:

```javascript
const startDate = new Date("2026-01-01");
const endDate = new Date("2026-01-11");

const diffInMs = endDate - startDate; // Milliseconds difference
const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

console.log(`Course duration: ${diffInDays} days`); // 10 days
```

---

## 4. Modern Formatting: `Intl.DateTimeFormat`

Instead of clumsy manual string assembly, modern browsers provide the powerful **Internationalization API (`Intl`)**:

```javascript
const today = new Date();

// Format for India (English):
const formatterIN = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "full",
  timeStyle: "short"
});
console.log(formatterIN.format(today));
// "Tuesday, 15 September, 2026 at 10:45 AM"

// Format for United States:
const formatterUS = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
console.log(formatterUS.format(today));
// "Sep 15, 2026"
```

---

## Practice Quiz

### Q1: In the JavaScript `Date` object, what number represents the month of January?
- A) 1
- B) 0 (zero-indexed months: 0 to 11)
- C) -1
- D) `null`
**Answer:** B
**Explanation:** In JavaScript, month indices run from 0 (January) to 11 (December), while days of the month (`getDate()`) run from 1 to 31.

### Q2: What does `date.getDay()` return?
- A) The day of the month (1 to 31)
- B) The day of the week as an integer (0 for Sunday through 6 for Saturday)
- C) The total days in the year
- D) The name of the month
**Answer:** B
**Explanation:** `getDay()` returns the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday), whereas `getDate()` returns the day of the month.

### Q3: What is the "Unix Epoch"?
- A) January 1, 2000
- B) January 1, 1970, 00:00:00 UTC
- C) The date when JavaScript was invented
- D) The system boot timestamp
**Answer:** B
**Explanation:** The Unix Epoch is the standard baseline epoch from which POSIX and JavaScript timestamps measure elapsed milliseconds.

### Q4: How do you get the current timestamp in milliseconds without creating a full `new Date()` object?
- A) `Date.now()`
- B) `Date.time()`
- C) `Date.ms()`
- D) `Date.current()`
**Answer:** A
**Explanation:** `Date.now()` is a static method that returns the current timestamp in milliseconds since the Unix Epoch directly and efficiently.

### Q5: What modern built-in API is recommended for locale-sensitive, human-readable date and time formatting?
- A) `Intl.DateTimeFormat`
- B) `String.toDate()`
- C) `Date.parseLocale()`
- D) `JSON.stringifyDate()`
**Answer:** A
**Explanation:** The ECMAScript Internationalization API (`Intl.DateTimeFormat`) provides comprehensive, locale-aware date and time formatting across languages and regions.

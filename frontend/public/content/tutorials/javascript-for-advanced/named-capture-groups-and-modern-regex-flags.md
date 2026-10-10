# Named Capture Groups & Modern Regex Flags

Traditional regular expressions rely on numeric indices (`match[1]`, `match[2]`) to extract captured substrings. As regex patterns grow complex, numeric indexing becomes fragile and unreadable. Modern ECMAScript introduced **Named Capture Groups** (`(?<name>...)`) and modern flags (**`d`**, **`s`**, **`u`**, **`v`**) to make pattern matching self-documenting and Unicode-compliant.

---

## 1. Named Capture Groups: `(?<name>pattern)`

Assign semantic identifiers to captured sub-patterns:

```javascript
// Traditional Numeric Capture (Fragile):
// const match = text.match(/(\d{4})-(\d{2})-(\d{2})/);
// const year = match[1];

// Modern Named Capture Groups:
const datePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = datePattern.exec('Release Date: 2026-09-15');

console.log(match.groups);
// { year: "2026", month: "09", day: "15" }

// Clean Object Destructuring:
const { year, month, day } = match.groups;
console.log(`Formatted: ${day}/${month}/${year}`); // "15/09/2026"
```

---

## 2. Using Named Groups in `replace()` & `replaceAll()`

Named groups can be referenced in replacement strings using `$<name>`:

```javascript
const isoDate = '2026-12-25';

// Reformat YYYY-MM-DD into DD.MM.YYYY using named groups:
const europeanDate = isoDate.replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  '$<day>.$<month>.$<year>'
);

console.log(europeanDate); // "25.12.2026"
```

---

## 3. Modern Regex Flags Deep Dive

| Flag | Name | Purpose | Example |
| :--- | :--- | :--- | :--- |
| **`d`** (ES2022)| Indices | Generates exact start/end match slice indices in `match.indices` | `/foo/d.exec('foo').indices` |
| **`s`** (ES2018)| dotAll | Allows the dot `.` to match newline characters (`\n`, `\r`) | `/start.*end/s` |
| **`u`** (ES2015)| Unicode | Treats pattern as a sequence of Unicode code points (handles emojis) | `/\u{1F600}/u` |
| **`v`** (ES2024)| UnicodeSets | Advanced set operations (intersection `&&`, subtraction `--`) | `[[a-z]--[b-d]]/v` |
| **`y`** (ES2015)| Sticky | Matches strictly from `regex.lastIndex` without searching forward | `/abc/y` |

### The `d` Flag (Match Indices):
```javascript
const regex = /(?<word>\w+)/d;
const res = regex.exec('Hello World');

console.log(res.indices.groups.word); // [0, 5] (Start index: 0, End index: 5!)
```

### The `s` (dotAll) Flag:
```javascript
const text = `Title: Introduction\nContent: First Chapter\nFooter: End`;

// Without 's', dot '.' fails across newlines!
// With 's', '.' matches EVERYTHING including newlines:
const matched = text.match(/Title:.*Footer/s);
console.log(matched[0]); // Matches entire multi-line block!
```

---

## Practice Quiz

### Q1: What syntax declares a Named Capture Group in JavaScript Regular Expressions?
- A) (:name pattern)
- B) (?<name>pattern)
- C) (name: pattern)
- D) (?=name pattern)
**Answer:** B
**Explanation:** Named capture groups use the syntax `(?<groupName>subpattern)`, accessible via `match.groups.groupName`.

### Q2: How can you reference a named capture group inside a string replace() replacement pattern?
- A) \\1
- B) $<groupName>
- C) &groupName
- D) {groupName}
**Answer:** B
**Explanation:** Replacement strings reference named groups using the `$<name>` syntax (e.g. `'$<year>'`).

### Q3: What does the s (dotAll) flag enable in regular expressions?
- A) Case-insensitive search
- B) Allows the dot (.) wildcard to match newline characters (\n, \r), which it excludes by default
- C) Strict syntax checking
- D) Single-match mode
**Answer:** B
**Explanation:** By default, `.` matches any character except newlines; the `s` flag enables dotAll mode so `.` matches all characters including line breaks.

### Q4: What feature was introduced by the d flag in ES2022?
- A) Decoupled regex
- B) Generates a match.indices array containing exact start and end offset indices for all capture groups
- C) Debug mode
- D) Date matching
**Answer:** B
**Explanation:** The `d` flag populates `match.indices` with start and end index tuples `[start, end]` for full matches and capture groups.

### Q5: If a regex with named groups does NOT match, what does match.groups evaluate to?
- A) An empty object {}
- B) match is null, so accessing match.groups throws a TypeError unless optional chaining (match?.groups) is used
- C) undefined
- D) false
**Answer:** B
**Explanation:** When no match is found, `.exec()` or `.match()` returns `null`; accessing `.groups` on `null` throws an error without optional chaining.

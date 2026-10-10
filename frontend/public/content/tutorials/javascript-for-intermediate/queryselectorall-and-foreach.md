# querySelectorAll & forEach in Modern JavaScript

Selecting and manipulating collections of DOM nodes is a cornerstone of client-side web development. While single-element selectors like `getElementById()` or `querySelector()` return either an `Element` or `null`, `document.querySelectorAll()` matches all DOM elements satisfying a standard CSS selector and returns a static `NodeList`.

---

## 1. querySelector vs. querySelectorAll

Understanding the return types and behavioral differences is vital:

| Feature | `querySelector()` | `querySelectorAll()` | `getElementsByClassName()` |
| :--- | :--- | :--- | :--- |
| **Return Type** | Single `Element` or `null` | Static `NodeList` | Live `HTMLCollection` |
| **Selector Syntax** | Any CSS selector | Any CSS selector | Class name string only |
| **Iteration Support** | N/A (Single node) | Native `.forEach()` | Requires conversion to Array |
| **DOM Mutation Effect**| No effect on variable | Snapshot (Static) | Live updates with DOM changes |

```javascript
// Selecting single element
const submitBtn = document.querySelector('#btn-submit');

// Selecting all matching elements (Static NodeList)
const featureCards = document.querySelectorAll('.card.feature');
console.log(`Found ${featureCards.length} feature cards.`);
```

---

## 2. Iterating with NodeList.prototype.forEach

Modern browsers support `.forEach()` directly on `NodeList` instances, enabling clean functional iteration without manual `for` loops.

```javascript
const navLinks = document.querySelectorAll('nav a.nav-item');

navLinks.forEach((link, index) => {
  // Check if link is active
  if (link.getAttribute('href') === window.location.pathname) {
    link.classList.add('active');
  }
  
  // Attach telemetry or custom interaction
  link.addEventListener('click', (event) => {
    console.log(`User clicked nav item #${index + 1}: ${link.textContent}`);
  });
});
```

---

## 3. NodeList vs. HTMLCollection vs. Array

A `NodeList` is not an `Array`. While modern `NodeList` has `.forEach()`, it lacks array transformation methods like `.map()`, `.filter()`, `.reduce()`, or `.some()`.

### Converting NodeList to an Array

To leverage array transformations, convert the `NodeList` using the spread operator or `Array.from()`:

```javascript
const priceBadges = document.querySelectorAll('.badge-price');

// Option A: Spread operator (Recommended)
const priceElements = [...priceBadges];

// Option B: Array.from() with mapping callback
const prices = Array.from(priceBadges, (el) => parseFloat(el.textContent.replace('$', '')));

// Now you can filter and reduce!
const affordablePrices = prices.filter(price => price < 50.00);
const totalPrice = prices.reduce((sum, price) => sum + price, 0);

console.log('Prices under $50:', affordablePrices);
console.log('Total Cart Value:', totalPrice.toFixed(2));
```

```
DOM Tree Selector:
  document.querySelectorAll('.item')
                 │
                 ▼
         Static NodeList
      ┌──────┬──────┬──────┐
      │ el 0 │ el 1 │ el 2 │
      └──────┴──────┴──────┘
                 │
         [...spread operator]
                 │
                 ▼
           Standard Array
    (.map, .filter, .reduce available)
```

---

## 4. Static vs. Live Collections

`querySelectorAll()` returns a **static snapshot**. Changes to the DOM after the query will **not** be reflected in the existing `NodeList`:

```javascript
const container = document.querySelector('#container');
const staticList = document.querySelectorAll('.item'); // e.g., 3 items
const liveList = document.getElementsByClassName('item'); // 3 items

// Add a new element dynamically
const newItem = document.createElement('div');
newItem.className = 'item';
container.appendChild(newItem);

console.log(staticList.length); // Still 3! (Static snapshot)
console.log(liveList.length);   // 4! (Live collection updated automatically)
```

> **Performance Tip:** Static collections are generally faster and safer because iterating over a live collection while mutating the DOM can cause infinite loops or skipped indices.

---

## 5. Practical Example: Tab Controller

```javascript
function initTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetSelector = button.getAttribute('data-tab-target');
      const targetPane = document.querySelector(targetSelector);

      // Deactivate all buttons & panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('show'));

      // Activate current
      button.classList.add('active');
      if (targetPane) {
        targetPane.classList.add('show');
      }
    });
  });
}
```

---

## Practice Quiz

### Q1: What does document.querySelectorAll() return when matching multiple elements?
- A) A standard JavaScript Array
- B) A static NodeList
- C) A live HTMLCollection
- D) An object map of element IDs
**Answer:** B
**Explanation:** querySelectorAll() returns a static NodeList representing a snapshot of elements matching the CSS selector at query time.

### Q2: How can you convert a NodeList into a true JavaScript Array to use array methods like .filter()?
- A) JSON.parse(nodeList)
- B) [...nodeList] or Array.from(nodeList)
- C) nodeList.toArray()
- D) Object.assign([], nodeList)
**Answer:** B
**Explanation:** Spreading the NodeList `[...nodeList]` or calling `Array.from(nodeList)` produces a real JavaScript Array instance.

### Q3: How does a static NodeList behave when a new matching element is appended to the DOM after querying?
- A) It throws a ConcurrentModificationException
- B) It automatically appends the new node
- C) Its length remains unchanged because it is a snapshot
- D) It becomes null and must be re-queried
**Answer:** C
**Explanation:** A static NodeList does not update automatically when DOM mutations occur; it captures the state at the exact moment of execution.

### Q4: Which method is natively available on modern NodeList instances without converting to an Array?
- A) .map()
- B) .filter()
- C) .forEach()
- D) .reduce()
**Answer:** C
**Explanation:** Modern browser implementations of NodeList include `.forEach()`, allowing direct iteration over its elements.

### Q5: What is returned by document.querySelectorAll('.non-existent-class') if no elements match?
- A) null
- B) undefined
- C) An empty NodeList with length 0
- D) An error is thrown
**Answer:** C
**Explanation:** Unlike querySelector() which returns null if no match is found, querySelectorAll() returns an empty NodeList with length 0.

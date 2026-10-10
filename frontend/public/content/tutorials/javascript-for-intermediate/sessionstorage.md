# SessionStorage in Modern JavaScript

The `sessionStorage` object is a companion to `localStorage` within the Web Storage API. While it shares an identical method interface (`setItem`, `getItem`, `removeItem`, `clear`), its lifecycle and scoping rules are strictly bounded by the **browser tab session**.

---

## 1. Key Differences: sessionStorage vs. localStorage

| Feature | `sessionStorage` | `localStorage` |
| :--- | :--- | :--- |
| **Data Lifetime** | Cleared immediately when the browser tab/window is closed | Persists indefinitely until explicitly deleted |
| **Scope Boundary** | Scoped strictly to the specific browser tab and origin | Shared across all tabs, windows, and iframes of same origin |
| **New Tab Behavior** | Opening a new tab creates a fresh, empty session | New tab accesses identical existing data |
| **Capacity** | Typically 5MB per origin | Typically 5MB–10MB per origin |
| **Storage API** | `setItem`, `getItem`, `removeItem`, `clear` | `setItem`, `getItem`, `removeItem`, `clear` |

```
  User opens Tab 1 (Origin: mysite.com) ──► sessionStorage [A: 1]
  User opens Tab 2 (Origin: mysite.com) ──► sessionStorage [EMPTY!] (Independent session!)
  
  Both Tab 1 and Tab 2 share ──────────► localStorage   [Persistent Data]
```

---

## 2. API Usage

The syntax for `sessionStorage` is identical to `localStorage`:

```javascript
// Store temporary wizard step state
sessionStorage.setItem('currentStep', '3');
sessionStorage.setItem('tempFormData', JSON.stringify({ name: 'Alex', plan: 'pro' }));

// Read session data
const step = sessionStorage.getItem('currentStep'); // '3'
const formData = JSON.parse(sessionStorage.getItem('tempFormData'));

// Delete single item
sessionStorage.removeItem('currentStep');

// Clear all items in current tab's session
sessionStorage.clear();
```

---

## 3. Ideal Use Cases for sessionStorage

1. **Multi-Step Checkout / Registration Wizards:** Preserves filled fields across page navigation within the same tab, but resets if the user abandons the tab.
2. **Single-Tab Data Isolation:** Banking portals or sensitive financial dashboards where multiple tabs must not share state.
3. **Scroll Position Recovery:** Storing scroll offset before navigating to an article to return to the exact reading spot when clicking "Back".
4. **Temporary Session Tokens:** Tokens that should expire immediately upon closing the active window.

---

## 4. Gotcha: Page Refresh vs. Tab Close

- **Page Refresh (F5 / Reload):** `sessionStorage` **survives** normal page refreshes and page restorations!
- **Tab Close:** Closing the tab terminates the session and **wipes** all data completely.
- **Duplicate Tab:** Duplicating a tab (`Ctrl + click` on tab) copies the current session storage snapshot into the new tab, but from that point forward they are completely isolated.

---

## Practice Quiz

### Q1: When is data stored in sessionStorage automatically deleted?
- A) When the user refreshes the page
- B) When the current browser tab or window is closed
- C) After 15 minutes of inactivity
- D) When the computer goes to sleep
**Answer:** B
**Explanation:** `sessionStorage` is scoped to the tab session lifecycle; data is deleted immediately when the browser tab is closed, but survives page refreshes.

### Q2: If a user opens the same URL in two separate browser tabs, do they share the same sessionStorage?
- A) Yes, all tabs on the same origin share storage
- B) No, each browser tab maintains its own isolated sessionStorage context
- C) Only if the browser is Google Chrome
- D) Yes, if they use the same Wi-Fi
**Answer:** B
**Explanation:** `sessionStorage` is isolated per browser tab; data written in Tab 1 is never accessible by Tab 2.

### Q3: Does refreshing a page (pressing F5) wipe sessionStorage?
- A) Yes, all data is destroyed
- B) No, sessionStorage persists through page reloads within the same tab
- C) Only in private browsing mode
- D) Yes, unless the user clicks Remember Me
**Answer:** B
**Explanation:** `sessionStorage` survives standard page reloads and historical navigations within that tab.

### Q4: Which storage mechanism is best suited for a multi-step checkout form that should not leak to other tabs?
- A) document.cookie
- B) sessionStorage
- C) localStorage
- D) IndexedDB
**Answer:** B
**Explanation:** `sessionStorage` isolates form state to the active tab and clears automatically when the tab is closed, making it ideal for checkout wizards.

### Q5: What is the typical storage capacity of sessionStorage in modern browsers?
- A) 4 Kilobytes
- B) Around 5 Megabytes per origin
- C) 500 Megabytes
- D) Unlimited
**Answer:** B
**Explanation:** Like `localStorage`, modern browsers allocate roughly 5MB of string storage per origin for `sessionStorage`.

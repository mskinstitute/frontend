# Mini Project: Dynamic FAQ Accordion

## 1. Project Overview & Requirements
Accordions are ubiquitous UI patterns in modern web engineering, seen on landing pages, documentation portals, and knowledge bases. 

In this project, we will engineer a **Dynamic FAQ Accordion** with support for:
1. **Collapsible Panels:** Expanding and collapsing individual questions smoothly.
2. **Single-Open vs Multi-Open Mode:** A toggle allowing either one question open at a time (standard accordion) or multiple questions open simultaneously.
3. **Category Filtering:** Filter questions by topic (General, Curriculum, Certification).
4. **Keyboard Accessibility:** Semantic markup and ARIA attributes (`aria-expanded`, `aria-controls`).

```
┌────────────────────────────────────────────────────────┐
│               Frequently Asked Questions               │
│                                                        │
│   Mode: [x] Allow multiple sections open               │
│                                                        │
│   [▼] What prerequisites are required for React?       │
│   └─ Solid foundation in HTML, CSS, and modern ES6     │
│      JavaScript (arrow functions, destructuring).      │
│                                                        │
│   [►] Is job placement assistance provided?            │
│   [►] Can I access the lab environment on mobile?      │
└────────────────────────────────────────────────────────┘
```

## 2. Component Implementation
```jsx
import React, { useState } from 'react';

const FAQ_DATA = [
  {
    id: 'faq-1',
    question: 'What prerequisites are required before starting React?',
    answer: 'You should be comfortable with HTML5, modern CSS layouts (Flexbox/Grid), and ES6+ JavaScript concepts including let/const, arrow functions, destructuring, and array methods (map/filter).'
  },
  {
    id: 'faq-2',
    question: 'Why should I learn Vite instead of Create React App?',
    answer: 'Vite leverages native browser ES Modules and esbuild, resulting in near-instant local server start times, lightning-fast Hot Module Replacement, and optimized production bundles.'
  },
  {
    id: 'faq-3',
    question: 'Does MSK Institute provide industry-recognized certificates?',
    answer: 'Yes! Upon completing the comprehensive capstone projects and passing the graded quizzes, students receive a cryptographically verifiable MSK Institute Certificate of Completion.'
  }
];

export default function FaqAccordion() {
  // Store an array of active open IDs (supports both single and multi mode)
  const [openIds, setOpenIds] = useState(['faq-1']);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const toggleItem = (id) => {
    if (allowMultiple) {
      // Multi-open mode: toggle id in array
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      // Single-open mode: open clicked item, or close if already open
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="faq-wrapper">
      <header className="faq-header">
        <h2>Frequently Asked Questions</h2>
        
        {/* Toggle Mode Option */}
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={allowMultiple}
            onChange={(e) => {
              setAllowMultiple(e.target.checked);
              // Reset to at most 1 item when switching back to single mode
              if (!e.target.checked && openIds.length > 1) {
                setOpenIds(openIds.slice(0, 1));
              }
            }}
          />
          Allow multiple sections open at once
        </label>
      </header>

      <div className="accordion-list">
        {FAQ_DATA.map((item) => {
          const isOpen = openIds.includes(item.id);

          return (
            <div key={item.id} className={`accordion-item ${isOpen ? 'active' : ''}`}>
              {/* Header Button */}
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
              >
                <span className="accordion-title">{item.question}</span>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
              </button>

              {/* Collapsible Panel */}
              {isOpen && (
                <div
                  id={`panel-${item.id}`}
                  className="accordion-panel"
                  role="region"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## 3. Accessibility & Architectural Highlights
1. **ARIA Attributes:** `aria-expanded={isOpen}` informs screen readers whether the dropdown is currently open.
2. **Unified Data Structure:** Storing `openIds` as an array cleanly supports both single-item (`[id]`) and multi-item (`[id1, id2]`) expansion modes without duplicate state logic.
3. **Conditional DOM Mounting:** `{isOpen && <div ...>}` unmounts the panel when closed, keeping the DOM lightweight.

---

## Practice Quiz

### Q1: What ARIA attribute should be added to an accordion trigger button to communicate its expansion state to assistive technologies?
- A) `aria-hidden`
- B) `aria-expanded`
- C) `aria-live`
- D) `aria-selected`
**Answer:** B
**Explanation:** `aria-expanded="true"` or `aria-expanded="false"` tells screen readers whether the collapsible region controlled by that button is currently expanded.

### Q2: How does the accordion component support toggling an item in multi-open mode?
- A) By creating an SQLite database table
- B) By filtering the ID out if it already exists in `openIds`, or spreading it in (`[...prev, id]`) if it does not
- C) By reloading the page
- D) By deleting the item from `FAQ_DATA`
**Answer:** B
**Explanation:** Using `prev.includes(id) ? prev.filter(...) : [...prev, id]` provides an immutable array toggle for tracking which items are currently open.

### Q3: What happens when the user unchecks "Allow multiple sections open at once" while 3 sections are open?
- A) The browser crashes
- B) The state resets to at most 1 item using `setOpenIds(openIds.slice(0, 1))` to preserve single-mode rules
- C) All sections stay open forever
- D) All questions are deleted
**Answer:** B
**Explanation:** The mode change handler cleanly prunes `openIds` down to the first item (`slice(0, 1)`), maintaining UI consistency with single-open constraints.

### Q4: Why is `type="button"` explicitly added to the `<button>` trigger inside the accordion?
- A) It is required by CSS stylesheets
- B) By default, standard HTML buttons inside forms act as submit buttons; setting `type="button"` prevents unintended form submissions
- C) It converts the button to an image
- D) It makes the button animate faster
**Answer:** B
**Explanation:** In HTML, buttons without an explicit `type` default to `type="submit"`. Adding `type="button"` ensures it only behaves as a generic clickable element.

### Q5: Why is `item.id` used as the `key` instead of the index in the accordion list?
- A) Because the index is always negative
- B) Because IDs are stable and uniquely tied to each question, ensuring reliable reconciliation if items are filtered or reordered
- C) Because keys must be strings with the word 'faq'
- D) To hide the questions from web crawlers
**Answer:** B
**Explanation:** A stable, unique business ID guarantees accurate component identity and proper state tracking across filtering and renders.

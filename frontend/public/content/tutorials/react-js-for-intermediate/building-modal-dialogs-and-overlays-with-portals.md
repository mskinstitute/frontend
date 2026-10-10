# Building Modal Dialogs and Overlays with Portals

## 1. Anatomy of a Production Modal
A production-grade modal dialog is more than just a centered box. It requires:
1. **Physical DOM Portaling:** Mounting to `document.body` via `createPortal`.
2. **Backdrop / Overlay:** Dimming the underlying interface and closing on backdrop click.
3. **Escape Key Dismissal:** Listening for the `Escape` key to close the modal.
4. **Body Scroll Locking:** Preventing the background page from scrolling while the modal is open.
5. **Accessibility:** Using semantic ARIA attributes (`role="dialog"`, `aria-modal="true"`).

```
┌────────────────────────────────────────────────────────┐
│ Darkened Backdrop Overlay (z-50)                       │
│                                                        │
│       ┌────────────────────────────────────────┐       │
│       │ Modal Dialog Container                 │       │
│       │                                        │       │
│       │ Header: Confirm Action           [ ✕ ] │       │
│       │ Body: Are you sure you want to enroll? │       │
│       │                                        │       │
│       │ Footer: [ Cancel ]     [ Confirm ]     │       │
│       └────────────────────────────────────────┘       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 2. Complete Modal Implementation
```jsx
// src/components/Modal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  // 1. Close on Escape Key & Lock Body Scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock background page scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Restore scroll and remove listener on cleanup
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // If closed, render nothing
  if (!isOpen) return null;

  // 2. Portal to document.body
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose} // Close when clicking darkened backdrop
      role="presentation"
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from triggering inside card!
      >
        <header className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-close"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </header>

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
```

## 3. Accompanying CSS Styles
```css
/* Modal Backdrop Overlay */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65); /* Darkened blur */
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

/* Modal Card */
.modal-content {
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

## 4. The Critical `e.stopPropagation()` Nuance
Notice line 35: `onClick={(e) => e.stopPropagation()}` on `.modal-content`.

Because the outer `.modal-backdrop` has an `onClick={onClose}` handler, clicking anywhere inside the modal card would bubble up to the backdrop and close the modal! Invoking `e.stopPropagation()` on the inner container halts event bubbling, ensuring the modal only closes when the user clicks **outside** the card on the darkened backdrop.

---

## Practice Quiz

### Q1: Why is `e.stopPropagation()` called on the inner modal card container?
- A) To make the modal animate faster
- B) To prevent clicks inside the modal card from bubbling up to the backdrop's `onClick={onClose}` handler and closing the modal unintentionally
- C) To disable keyboard inputs
- D) It is required by TypeScript
**Answer:** B
**Explanation:** `e.stopPropagation()` confines the click event to the modal card, ensuring that only clicks on the backdrop overlay trigger the `onClose` callback.

### Q2: Why should `document.body.style.overflow = 'hidden'` be set when a modal opens?
- A) To prevent the background webpage from scrolling behind the modal
- B) To hide images on the webpage
- C) To turn off the browser scrollbar permanently
- D) To prevent form submissions
**Answer:** A
**Explanation:** Locking `overflow: hidden` on `document.body` stops background page scrolling while the overlay modal is active.

### Q3: What must be done in the `useEffect` cleanup function when locking body scroll?
- A) Restart the computer
- B) Restore the body's overflow property (e.g. `document.body.style.overflow = 'unset'`) so page scrolling works after the modal closes
- C) Clear all localStorage
- D) Reload the browser tab
**Answer:** B
**Explanation:** If the cleanup function fails to reset `document.body.style.overflow`, the page will remain permanently unscrollable even after the modal is unmounted.

### Q4: Which standard keyboard key should dismiss accessible modal overlays?
- A) Enter
- B) Escape (`e.key === 'Escape'`)
- C) Tab
- D) Shift
**Answer:** B
**Explanation:** W3C accessibility guidelines mandate that pressing the `Escape` key must dismiss modal dialogs.

### Q5: What ARIA attributes should be added to an accessible modal dialog?
- A) `role="dialog"` and `aria-modal="true"`
- B) `role="textbox"`
- C) `aria-disabled="true"`
- D) `role="heading"`
**Answer:** A
**Explanation:** `role="dialog"` and `aria-modal="true"` notify assistive screen readers that a modal dialog overlay has trapped user interaction.

# Typing Synthetic Events and Form Elements

React normalizes browser events into cross-browser `SyntheticEvent` wrappers. In TypeScript, passing inline event handlers often benefits from automatic type inference, but extracting handlers into separate named functions requires explicit typing of both the event wrapper and the underlying HTML element.

---

## 1. Common React Event Types

React exports dedicated types for every event category in the `React` namespace:

| Event Handler | React Event Type | Target Element Generic |
| :--- | :--- | :--- |
| `onChange` (text/select) | `React.ChangeEvent<T>` | `HTMLInputElement`, `HTMLSelectElement`, `HTMLTextAreaElement` |
| `onClick` | `React.MouseEvent<T>` | `HTMLButtonElement`, `HTMLDivElement` |
| `onSubmit` | `React.FormEvent<T>` | `HTMLFormElement` |
| `onKeyDown` / `onKeyUp` | `React.KeyboardEvent<T>` | `HTMLInputElement`, `HTMLElement` |
| `onFocus` / `onBlur` | `React.FocusEvent<T>` | `HTMLInputElement` |
| `onDrag` / `onDrop` | `React.DragEvent<T>` | `HTMLDivElement` |

---

## 2. Typing Form Input Changes

When managing form state, pass the exact HTML form element generic to `React.ChangeEvent`:

```tsx
import React, { useState } from "react";

interface FormState {
  username: string;
  role: "developer" | "designer" | "manager";
  bio: string;
  newsletter: boolean;
}

export function TypedProfileForm() {
  const [formData, setFormData] = useState<FormState>({
    username: "",
    role: "developer",
    bio: "",
    newsletter: false,
  });

  // Explicitly typed text input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Typed select change handler
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as FormState["role"],
    }));
  };

  // Typed textarea change handler
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      bio: e.target.value,
    }));
  };

  // Typed form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting validated form payload:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-6 bg-slate-900 rounded-xl text-white">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Role</label>
        <select
          value={formData.role}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Bio</label>
        <textarea
          value={formData.bio}
          onChange={handleTextAreaChange}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm h-20"
        />
      </div>

      <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 font-semibold rounded text-sm">
        Save Profile
      </button>
    </form>
  );
}
```

---

## 3. Keyboard Event Handling & Key Filtering

```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearch();
  } else if (e.key === "Escape") {
    clearSearch();
  }
};
```

---

## 4. `e.target` vs `e.currentTarget`

TypeScript differentiates between `e.target` and `e.currentTarget`:
- **`e.currentTarget`:** The element to which the event handler is currently attached (strictly typed to generic `T`).
- **`e.target`:** The element that dispatched the original event (could be a nested child span or icon, typed as `EventTarget`).

Always use `e.currentTarget` when reading properties on the registered element container!

---

## Practice Quiz

### Q1: What is the correct type signature for an onChange handler bound to an <input type="text">?
- A) (e: Event) => void
- B) (e: React.ChangeEvent<HTMLInputElement>) => void
- C) (e: React.InputEvent) => void
- D) (e: React.FormEvent<string>) => void
**Answer:** B
**Explanation:** Input change events in React are typed as React.ChangeEvent parameterized with HTMLInputElement.

### Q2: What is the difference between e.target and e.currentTarget in a typed React mouse event?
- A) There is no difference
- B) e.currentTarget is the element to which the listener is directly attached; e.target is the specific nested element where the event originated
- C) e.target is only available in Internet Explorer
- D) e.currentTarget is an async Promise
**Answer:** B
**Explanation:** In React and the DOM, currentTarget refers to the element whose listener is executing, whereas target is the deepest DOM node clicked, which might be a nested child icon or text node.

### Q3: Why is e.preventDefault() required on form onSubmit events?
- A) To prevent the browser from reloading the page and issuing a synchronous HTTP POST navigation
- B) To run TypeScript compilation
- C) To delete input values
- D) To close the browser tab
**Answer:** A
**Explanation:** Traditional HTML forms trigger a full page navigation upon submission; e.preventDefault() cancels the default browser submit action to enable client-side SPA processing.

### Q4: Which React event type should be used when handling drag and drop interactions?
- A) React.MouseEvent<HTMLDivElement>
- B) React.DragEvent<HTMLDivElement>
- C) React.HoverEvent<HTMLDivElement>
- D) React.MoveEvent<HTMLDivElement>
**Answer:** B
**Explanation:** HTML5 drag and drop events (onDragOver, onDrop, onDragStart) are encapsulated in React.DragEvent<T>.

### Q5: How can you check if the user pressed the Enter key in a type-safe manner?
- A) if (e.keyCode === "enter")
- B) if (e.key === "Enter")
- C) if (e.isEnter)
- D) if (e.target.enterKey)
**Answer:** B
**Explanation:** Modern standards use the e.key string property (with "Enter", "Escape", "ArrowUp", etc.) rather than deprecated numeric keycodes.

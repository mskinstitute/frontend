# Custom Form Controls with useField

Standard HTML `<input>` and `<select>` elements rarely satisfy enterprise UI standards. Design systems demand bespoke controls: custom multi-select tag pickers, star rating widgets, masked phone inputs, and toggle switches. Formik's `useField` hook connects arbitrary custom React components directly to Formik's validation and state engine.

---

## 1. Anatomy of `useField`

The `useField` hook accepts a field name (or props object) and returns a tuple containing three items:

```tsx
const [field, meta, helpers] = useField(name);
```

- **`field`:** Props to spread onto standard inputs (`name`, `value`, `onChange`, `onBlur`).
- **`meta`:** Metadata regarding field state (`value`, `error`, `touched`, `initialValue`).
- **`helpers`:** Imperative setter functions (`setValue`, `setTouched`, `setError`) to update Formik state programmatically from custom UI events.

---

## 2. Building a Custom Switch Toggle Control

```tsx
import React from "react";
import { useField } from "formik";

interface SwitchToggleProps {
  name: string;
  label: string;
  description?: string;
}

export function SwitchToggle({ name, label, description }: SwitchToggleProps) {
  // Bind custom toggle directly to Formik
  const [field, meta, helpers] = useField<boolean>(name);

  const isChecked = Boolean(field.value);

  const handleToggle = () => {
    helpers.setValue(!isChecked);
    helpers.setTouched(true);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <div>
        <label className="text-sm font-semibold text-white block">{label}</label>
        {description && <p className="text-xs text-slate-400">{description}</p>}
        {meta.touched && meta.error && (
          <span className="text-xs text-rose-400 block mt-1">{meta.error}</span>
        )}
      </div>

      {/* Custom accessible switch primitive */}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
          isChecked ? "bg-cyan-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
```

---

## 3. Building a Multi-Select Tag Input

```tsx
import React, { useState } from "react";
import { useField } from "formik";

interface TagInputProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function TagInput({ name, label, placeholder = "Type and press Enter..." }: TagInputProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const [inputValue, setInputValue] = useState("");

  const tags = field.value || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        helpers.setValue([...tags, inputValue.trim()]);
      }
      setInputValue("");
      helpers.setTouched(true);
    }
  };

  const removeTag = (indexToRemove: number) => {
    helpers.setValue(tags.filter((_, idx) => idx !== indexToRemove));
    helpers.setTouched(true);
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs text-slate-400 font-medium">{label}</label>

      <div className="flex flex-wrap gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg min-h-[44px] items-center">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 bg-cyan-950/60 text-cyan-300 border border-cyan-800 text-xs px-2.5 py-1 rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-cyan-400 hover:text-white font-bold ml-1"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent text-sm text-white focus:outline-none min-w-[120px]"
        />
      </div>

      {meta.touched && meta.error && (
        <div className="text-xs text-rose-400 mt-1">{meta.error}</div>
      )}
    </div>
  );
}
```

---

## 4. Seamless Formik Consumption

Because `SwitchToggle` and `TagInput` manage their own Formik subscriptions internally via `useField`, consuming them in forms is completely clean:

```tsx
<Formik initialValues={{ enable2FA: false, skillTags: ["React", "TypeScript"] }} onSubmit={...}>
  <Form className="space-y-4">
    <SwitchToggle
      name="enable2FA"
      label="Two-Factor Authentication"
      description="Require TOTP hardware token on login"
    />
    <TagInput name="skillTags" label="Developer Competencies" />
    <button type="submit">Save Settings</button>
  </Form>
</Formik>
```

---

## Practice Quiz

### Q1: What does the useField hook return in Formik?
- A) An HTMLInputElement DOM node
- B) A 3-element tuple: [field, meta, helpers]
- C) A Redux dispatch function
- D) An Axios instance
**Answer:** B
**Explanation:** useField returns a tuple with field (binding props), meta (field state and errors), and helpers (imperative setters setValue, setTouched, setError).

### Q2: How do you programmatically update a custom component's value in Formik without a standard onChange event?
- A) document.querySelector().value = x
- B) Calling helpers.setValue(newValue) returned by useField
- C) dispatch(updateValue(x))
- D) By reloading the page
**Answer:** B
**Explanation:** helpers.setValue(val) updates Formik's internal values object programmatically, triggering validation and updating dependent components.

### Q3: Why should helpers.setTouched(true) be called when a user interacts with a custom control?
- A) To activate CSS animations
- B) To inform Formik that the user has interacted with the control, ensuring validation error messages display if validation fails
- C) To submit the form immediately
- D) To clear all inputs
**Answer:** B
**Explanation:** Marking a field as touched via setTouched(true) ensures that Formik's error display heuristics (touched && error) render appropriate error messaging.

### Q4: Can custom controls built with useField accept generic types (e.g. useField<string[]>(name))?
- A) No, Formik only supports strings
- B) Yes, useField supports TypeScript generics to type the expected field value and setter helpers
- C) Only in JavaScript files
- D) Only when running on NodeJS
**Answer:** B
**Explanation:** useField<T> accepts a generic parameter to strictly type field.value and helpers.setValue, providing compile-time type safety.

### Q5: What is the primary architectural advantage of building design system inputs with useField?
- A) They bypass browser security
- B) They encapsulate form binding, touched states, and error handling internally, keeping parent form templates clean and declarative
- C) They eliminate CSS stylesheets
- D) They run on a separate Web Worker thread
**Answer:** B
**Explanation:** By encapsulating Formik integration inside the control via useField, the consuming form simply passes name="fieldKey" without repetitive boilerplate.

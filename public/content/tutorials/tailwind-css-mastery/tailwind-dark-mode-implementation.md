# Class-Based Dark Mode Setup with System Preference Support

Modern digital products demand high-contrast **Dark Mode** support for reduced eye strain and enhanced battery life. Tailwind CSS provides native support for dark themes using either the **`media` strategy** (automatic OS detection) or the **`class` strategy** (manual user toggle stored in `localStorage`).

---

## 1. Configuring Dark Mode in `tailwind.config.js`

For manual user toggles, configure the `selector` (or `class`) strategy:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables class-based dark mode (targets .dark on <html>)
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 2. Using the `dark:` Modifier

Prefix any utility class with `dark:` to define its appearance when dark mode is active:

```html
<!-- Card with Dark Mode Variants -->
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
  <h2 class="text-slate-900 dark:text-white font-bold text-xl">
    Full-Stack Web Development
  </h2>
  <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
    Learn Node.js, Express, MongoDB, and Next.js in our Shikohabad coding lab.
  </p>
  <button class="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
    View Syllabus
  </button>
</div>
```

---

## 3. Implementing the Theme Toggle in React / Next.js

```tsx
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference from localStorage or OS
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    localStorage.theme = nextMode ? 'dark' : 'light';
  };

  return (
    <button onClick={toggleTheme} class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

---

# Multiple Choice Questions

### 1. When `darkMode: 'class'` is configured in `tailwind.config.js`, how does Tailwind activate dark styles?
A. By inspecting the user's GPS coordinates to check if it is nighttime.
B. By checking for the presence of the `.dark` CSS class on an ancestor element (typically the `<html>` root element).
C. By measuring ambient light through the device webcam.
D. By setting browser cookies automatically.
**Answer:** B
**Explanation:** In class mode, Tailwind checks if a parent or root element has the `class="dark"` attribute, activating all `dark:*` utility rules.
---

### 2. What happens if `darkMode: 'media'` is selected instead of `'class'`?
A. Dark mode can only be toggled manually using buttons.
B. Dark mode automatically mirrors the user's operating system theme settings via the `prefers-color-scheme` media query, ignoring manual HTML class toggles.
C. Dark mode only applies to video media tags.
D. All text turns red.
**Answer:** B
**Explanation:** The `media` strategy relies strictly on the browser's `@media (prefers-color-scheme: dark)` query, preventing manual website theme switching.
---

### 3. Which class combination creates a card with a white background in light mode and dark slate background in dark mode?
A. `bg-white light:bg-slate-900`
B. `bg-white dark:bg-slate-900`
C. `bg-theme-auto`
D. `color-mode-switch`
**Answer:** B
**Explanation:** `bg-white` sets the default light background, and `dark:bg-slate-900` overrides it when dark mode is enabled.
---

### 4. Why should theme preferences be stored in `localStorage`?
A. To prevent web crawlers from indexing the page.
B. To preserve the user's dark/light theme choice across page reloads and future browsing sessions.
C. To reduce bundle size.
D. To encrypt user credentials.
**Answer:** B
**Explanation:** Storing theme state in `localStorage` ensures that the user's preference persists across browser refreshes and site visits.
---

### 5. How does Tailwind prevent flash of incorrect theme (FOUC) on initial page load?
A. By rendering pages as server-side PDF documents.
B. By inserting a small inline blocking script in `<head>` that reads `localStorage` and toggles `.dark` before the DOM renders.
C. By delaying page rendering by 5 seconds.
D. By disabling all CSS transitions.
**Answer:** B
**Explanation:** An inline script in `<head>` executes synchronously before HTML parsing, adding `class="dark"` to `<html>` immediately to eliminate theme flashing.
---
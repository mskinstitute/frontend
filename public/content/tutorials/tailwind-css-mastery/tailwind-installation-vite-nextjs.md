# Installation via PostCSS, Vite & Next.js Framework Integration

To leverage Tailwind CSS in modern frontend workflows, developers integrate it into build tools like **Vite**, **Next.js (App Router)**, or standalone **PostCSS** build pipelines. In this guide, you will learn how Tailwind scans template files, configures content paths, and injects directives into global stylesheets.

---

## 1. Installation in a Vite (React/Vue) Project

```bash
# 1. Install Tailwind, PostCSS & Autoprefixer
npm install -D tailwindcss postcss autoprefixer

# 2. Generate configuration files
npx tailwindcss init -p
```

This generates two files:
- `postcss.config.js`
- `tailwind.config.js`

---

## 2. Configuring Content Paths in `tailwind.config.js`

Tailwind's engine must know which files contain class names to purge unused styles:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#38BDF8',
          DEFAULT: '#0284C7',
          dark: '#0369A1',
        }
      }
    },
  },
  plugins: [],
}
```

> **Critical Rule:** If you add a new directory (e.g., `./components/**/*.{jsx,tsx}`) and forget to list it in `content: []`, Tailwind will NOT generate styles for those components!

---

## 3. Injecting Tailwind Directives

In your main stylesheet (`src/index.css` or `app/globals.css`), inject Tailwind's layers:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- **`@tailwind base`**: Resets browser defaults (Preflight reset: removes margins, sets box-sizing border-box).
- **`@tailwind components`**: Placeholder for custom multi-class reusable components.
- **`@tailwind utilities`**: Injects all utility classes (`flex`, `pt-4`, `bg-red-500`).

---

## 4. Next.js 15 Integration

When creating a modern Next.js 15 project:
```bash
npx create-next-app@latest my-project --tailwind --typescript --app
```
Next.js configures Tailwind automatically with PostCSS and App Router support in `app/globals.css`.

---

# Multiple Choice Questions

### 1. What is the role of the `content` array in `tailwind.config.js`?
A. It defines the text strings displayed inside HTML buttons.
B. It lists the file paths and globs that Tailwind should scan to detect used utility classes for JIT stylesheet generation.
C. It imports Google Fonts into the project.
D. It specifies which external APIs the application is permitted to call.
**Answer:** B
**Explanation:** Tailwind scans all files matching globs in the `content` array to extract class names and compile the corresponding CSS rules.
---

### 2. What happens if a developer creates a new folder `src/widgets/` with React components but does NOT update `tailwind.config.js`?
A. The application will crash with a fatal runtime exception.
B. Tailwind will not scan those files, and none of the Tailwind classes used inside `src/widgets/` will be rendered or applied.
C. The browser will automatically convert classes to inline styles.
D. Git will reject commits from that folder.
**Answer:** B
**Explanation:** If a file path is omitted from the `content` glob list, Tailwind never parses it and omits those classes from the generated output CSS.
---

### 3. What is the purpose of the `@tailwind base;` directive?
A. It injects Tailwind Preflight, resetting default browser margins, paddings, and font sizes to create a clean, consistent baseline.
B. It creates a database connection to PostgreSQL.
C. It loads the React virtual DOM.
D. It enables Dark Mode automatically.
**Answer:** A
**Explanation:** `@tailwind base` pulls in Preflight, an opinionated set of base styles built on top of modern-normalize to smooth out cross-browser inconsistencies.
---

### 4. Which command initializes a fresh `tailwind.config.js` along with a companion `postcss.config.js`?
A. `npm run build-tailwind`
B. `npx tailwindcss init -p`
C. `git init tailwind`
D. `npx create-css --all`
**Answer:** B
**Explanation:** Passing the `-p` flag to `npx tailwindcss init` creates both `tailwind.config.js` and `postcss.config.js`.
---

### 5. Why is **Autoprefixer** typically installed alongside Tailwind CSS and PostCSS?
A. To automatically translate Spanish text to English.
B. To automatically parse CSS and add vendor prefixes (like `-webkit-` and `-moz-`) based on CanIUse browser support data.
C. To format code with Prettier.
D. To convert CSS into TypeScript definitions.
**Answer:** B
**Explanation:** Autoprefixer uses Browserslist data to append vendor prefixes to CSS rules, ensuring cross-browser compatibility across legacy and modern devices.
---
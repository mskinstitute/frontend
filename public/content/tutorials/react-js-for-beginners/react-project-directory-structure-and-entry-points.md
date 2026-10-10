# React Project Directory Structure and Entry Points

## 1. Anatomy of a Production React Project
When you scaffold a modern React application using Vite, a clean and standardized folder structure is created. Understanding the exact role of each file and folder ensures smooth collaboration and clean architectural scalability.

```
msk-react-project/
├── index.html              # HTML shell hosting the root DOM container
├── package.json            # Manifest of scripts and dependencies
├── vite.config.js          # Vite build and plugin configuration
├── public/                 # Static assets served untouched at root URL
│   └── favicon.ico         # Browser tab icon
└── src/                    # Application source code
    ├── main.jsx            # Application entry point (mounts React to DOM)
    ├── App.jsx             # Top-level root React component
    ├── App.css             # Component-specific styles for App
    ├── index.css           # Global CSS reset and typography
    └── assets/             # Bundled images, SVGs, and fonts
```

## 2. The HTML Host: `index.html`
Unlike older bundlers where `index.html` resided in a hidden public folder, Vite treats `index.html` as the project's direct entry point at the root level.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MSK Institute React App</title>
  </head>
  <body>
    <!-- The mount target: React controls all children inside this element -->
    <div id="root"></div>

    <!-- The script module that bootstraps React -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
The `<div id="root"></div>` serves as the container where React mounts its component tree. Notice the direct `<script type="module" src="/src/main.jsx"></script>` tag, which gives Vite immediate visibility into the JavaScript entry point.

## 3. The React Entry Point: `src/main.jsx`
In `main.jsx`, React establishes its bridge to the browser's Document Object Model using `react-dom/client`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Locate the physical DOM node
const rootElement = document.getElementById('root');

// 2. Create the React concurrent root
const root = ReactDOM.createRoot(rootElement);

// 3. Render the root component tree into the container
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Key Elements of `main.jsx`:
- **`createRoot` (React 18+):** Creates a modern concurrent root container. This unlocks automatic batching of state updates and concurrent rendering capabilities.
- **`<React.StrictMode>`:** A development-only wrapper that helps surface potential side-effect bugs, deprecated APIs, and uncleaned timers by intentionally invoking component render functions twice in local development. It is completely inactive in production builds.

## 4. The Root Component: `src/App.jsx`
`App.jsx` is the topmost React component in your application hierarchy. It imports child components, coordinates global layouts, and returns JSX markup:

```jsx
import React from 'react';

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Welcome to MSK Institute React Mastery</h1>
        <p>Mastering modern front-end web engineering.</p>
      </header>
    </div>
  );
}
```

## 5. `public/` vs `src/assets/`
Front-end engineers often confuse static asset locations:
- **`public/`:** Files placed here (e.g., `robots.txt`, `favicon.ico`) are served directly at the root path (`/favicon.ico`). They are **not processed or hashed** by Vite's build pipeline.
- **`src/assets/`:** Images, fonts, and stylesheets placed here are imported directly into JavaScript files (`import logo from './assets/logo.png'`). Vite hashes their filenames for long-term browser cache invalidation (`logo.8f3a12.png`) and inlines small images as base64 data URIs.

---

## Practice Quiz

### Q1: In a modern Vite React application, where is the `index.html` file located?
- A) Deep inside the `node_modules/` folder
- B) Directly in the project root directory
- C) Inside the `src/components/` folder
- D) Inside the backend database server
**Answer:** B
**Explanation:** In Vite projects, `index.html` resides directly at the root of the project directory and serves as the primary entry point for the build tool.

### Q2: What is the primary purpose of `ReactDOM.createRoot` in React 18+?
- A) To create an SQLite database table
- B) To create a concurrent React root attached to a real DOM element
- C) To install npm packages from GitHub
- D) To configure SSL certificates for HTTPS
**Answer:** B
**Explanation:** `ReactDOM.createRoot` initializes a React concurrent root container tied to a physical DOM node (such as `<div id="root">`), enabling React 18 concurrent features and rendering.

### Q3: What does `<React.StrictMode>` do during development?
- A) It blocks all network requests to external APIs
- B) It prevents CSS styles from loading
- C) It intentionally double-invokes lifecycle and render functions to uncover accidental side-effects
- D) It minifies code for faster terminal compilation
**Answer:** C
**Explanation:** React StrictMode runs in development mode only, deliberately executing render functions twice to help developers detect memory leaks, uncleaned effects, and impure functions.

### Q4: Why should production image assets generally be imported from `src/assets/` rather than referenced from `public/`?
- A) Files in `public/` cannot be displayed in web browsers
- B) Files in `src/assets/` are processed by the bundler with content hashing and cache optimization
- C) `src/assets/` makes the images vector SVGs automatically
- D) `public/` only accepts `.txt` files
**Answer:** B
**Explanation:** Bundlers process assets imported from `src/` by optimizing file sizes and appending content hashes to filenames, guaranteeing reliable browser cache-busting upon application updates.

### Q5: What is the standard HTML `id` used by conventional React starters to mount the root application component?
- A) `container`
- B) `root`
- C) `main-app`
- D) `react-body`
**Answer:** B
**Explanation:** By convention, standard React applications mount into `<div id="root"></div>` using `document.getElementById('root')`.

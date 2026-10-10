# MSK Code Playground - Standalone Module & Deployment Architecture Guide

**MSK Code Playground** is a fully modular, zero-dependency in-browser code editor and multi-language compiler created for **MSK Institute**. It is built with an independent **"App-in-an-App"** architecture, allowing it to run embedded within tutorials or as a completely isolated, standalone web application.

---

## 🚀 Key Features & Capabilities

- **Multi-Language Support**:
  - **Python 3.12 (Pyodide WebAssembly)**: Runs entirely client-side with interactive `matplotlib` plot captures and scientific libraries.
  - **Modern Web Development (HTML5, CSS3, ES6 JavaScript)**: Live responsive iframe preview with real-time DOM console injection and CSS demo sync.
  - **Relational SQL & MySQL Engine**: In-memory SQLite (`sql.js` WebAssembly) combined with a custom MySQL transpiler (`CREATE DATABASE`, `USE`, `SHOW DATABASES`, `SHOW TABLES`, `DESCRIBE`, and visual Schemas Tree Explorer).
  - **C (GCC 14.1.0) & C++ (G++ 14.1.0)**: Microsecond compilation via Judge0 CE with full UTF-8/emoji support (`-O2 -lm`), `#line` error mapping, and beginner snippet auto-wrapping inside `int main()`.
  - **Java (OpenJDK 17)**: Server-side compilation and execution.
  - **Markdown Editor**: Real-time Markdown live preview with split-screen editing.
- **Developer & Student Power Tools**:
  - **Monaco Editor Engine**: VS Code editing experience with syntax highlighting, autocomplete, code folding, bracket colorization, and multiple themes.
  - **100vh Zen Mode**: Distraction-free full-viewport focus mode.
  - **Ray.so / Carbon Code Screenshot Exporter**: Export high-resolution 2x Retina code cards with designer gradient backgrounds.
  - **MSK AI Code Tutor & Explainer**: Context-aware diagnosis of errors, tracebacks, and interactive code walkthroughs.
  - **Interactive Coding Practice**: Curated challenges with automated test cases and pass/fail evaluation.
  - **Multi-File Workspace**: Create, delete, rename files and folders, drag-and-drop file import, and one-click ZIP import/export.
  - **Offline & Private**: Client-side storage via `localStorage`, zero telemetry.

---

## 📦 How to Extract & Deploy as a Separate Standalone Website

Because the playground is 100% self-contained inside `src/features/playground`, it does **not** rely on MSK Institute's database, user sessions, or main website styles. It can be deployed independently at any time.

### Step 1: Create a Fresh Next.js App
```bash
npx create-next-app@latest msk-code-playground --typescript --tailwind --app --eslint
cd msk-code-playground
```

### Step 2: Install Required Dependencies
```bash
npm install @monaco-editor/react lucide-react jszip canvas-confetti react-hot-toast
npm install -D @types/canvas-confetti
```

### Step 3: Copy the Playground Feature Folder
Copy the entire feature folder into your standalone app:
```bash
cp -r path/to/MSK-Institute-Website/src/features/playground src/features/playground
```

### Step 4: Add the Compiler API Route
Create `src/app/api/compile/route.ts` and add:
```ts
export { POST } from '@/features/playground/api/compileRoute';
```

### Step 5: Render in `src/app/page.tsx`
In `src/app/page.tsx`:
```tsx
'use client';

import dynamic from 'next/dynamic';

const PlaygroundApp = dynamic(() => import('@/features/playground'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1e1e1e] text-slate-400">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#1e1e1e]">
      <PlaygroundApp />
    </main>
  );
}
```

### Step 6: Deploy Anywhere
Deploy with zero server infrastructure on **Vercel**, **Cloudflare Pages**, **Netlify**, or **Docker/VPS**:
```bash
vercel deploy --prod
```

---

## 🌐 Deploying on a Subdomain (e.g., `code.mskinstitute.in` or `playground.mskinstitute.in`)

If you want to keep the playground inside this repository while serving it under an independent subdomain:

### Option A: Next.js Hostname Rewrite (Middleware)
In `middleware.ts`:
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';

  // If visitor opens code.mskinstitute.in or playground.mskinstitute.in
  if (hostname.startsWith('code.') || hostname.startsWith('playground.')) {
    return NextResponse.rewrite(new URL('/playground', req.url));
  }

  return NextResponse.next();
}
```

### Option B: Independent Git Worktree / Cloudflare Subdomain
Point `playground.mskinstitute.in` CNAME directly to a separate Vercel deployment built from the standalone repository.

---

## 🧩 Usage in Other Components

### Full Screen or Page
```tsx
import PlaygroundApp from '@/features/playground';

export default function MyPage() {
  return <PlaygroundApp initialLanguage="python" />;
}
```

### Modal Overlay (e.g., in Tutorials or LMS)
```tsx
import { PlaygroundModal } from '@/features/playground';

export default function TutorialReader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Try Code</button>
      <PlaygroundModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialLanguage="cpp"
        initialCode={`#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello MSK!" << endl;\n  return 0;\n}`}
      />
    </>
  );
}
```

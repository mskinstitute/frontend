# TypeQuest by MSK - Standalone Module & Deployment Guide

**TypeQuest** is a fully modular, zero-dependency touch typing and developer code speed trainer created for MSK Institute. It is built as an independent "App-in-an-App" architecture.

---

## 🚀 Key Features
- **Curriculum (Beginner to Pro)**: Home row anchors, top row, bottom row, numbers, and programmer symbols.
- **Real-World Code Typing**: JavaScript, Python, C++, HTML/CSS, SQL, and React syntax drills.
- **Speed & Timed Tests**: 15s, 30s, 60s, and 120s modes with real-time WPM, CPM, and precision metrics.
- **Synthesized Audio Engine**: Zero-latency mechanical switch, typewriter, and bubble sounds synthesized purely via the Web Audio API (no external MP3 files needed).
- **Interactive Virtual Keyboard & Finger Guide**: Real-time key glows, shift indicators, and hand placement posture.
- **Offline & Private**: All statistics, best WPM, and progress are stored client-side in `localStorage`.

---

## 📦 How to Copy TypeQuest to Another Project

### Step 1: Copy Folder
Simply copy the entire `src/features/typequest` directory into your other project:
```bash
cp -r src/features/typequest path/to/other-project/src/features/typequest
```

### Step 2: Ensure Dependencies
TypeQuest uses standard modern React and Lucide icons:
```bash
npm install lucide-react
```
*(Tailwind CSS is used for utility styling).*

### Step 3: Render Anywhere
In any Next.js, Vite, or React page:
```tsx
import TypeQuestApp from '@/features/typequest';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <TypeQuestApp />
    </div>
  );
}
```

---

## 🌐 How to Deploy on a Separate Domain (e.g., `typequest.mskinstitute.in`)

To deploy TypeQuest as an independent standalone website:

1. **Option A (Subdomain on existing Next.js app via DNS / Middleware)**:
   - Point the DNS CNAME record `typequest` to your hosting provider.
   - In Next.js middleware, rewrite requests from host `typequest.mskinstitute.in` directly to `/tools/typing`.

2. **Option B (Independent Repository / Single-Page App)**:
   - Create a minimal Vite or Next.js app:
     ```bash
     npx create-next-app@latest typequest-standalone --typescript --tailwind --app
     ```
   - Copy `src/features/typequest` into the new project's `src/` folder.
   - Set `src/app/page.tsx` to render `<TypeQuestApp />`.
   - Deploy to Vercel, Cloudflare Pages, Netlify, or your custom VPS.

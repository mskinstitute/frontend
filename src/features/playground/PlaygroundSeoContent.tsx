import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Database,
  Keyboard,
  Maximize2
} from 'lucide-react';

export default function PlaygroundSeoContent() {
  return (
    <article className="mt-16 pt-12 border-t border-slate-800 text-slate-300 space-y-12">
      {/* Title & Introduction */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Zero Installation &bull; 100% In-Browser Execution
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Interactive Online Code Playground & Multi-Language Compiler
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-300">
          The <strong>MSK Code Playground</strong> is a high-performance in-browser developer sandbox engineered by{' '}
          <strong>MSK Institute of Computer Technology</strong>. Designed for computer science students, coding beginners, 
          and professional developers, it combines Microsoft&apos;s <strong>Monaco Editor</strong> (the core engine behind VS Code) 
          with WebAssembly runtimes like <strong>Pyodide</strong> and compiled sandbox environments. 
          Write, test, and debug code in <strong>Python, HTML5, CSS3, JavaScript, C, C++, and MySQL</strong> instantly 
          without configuring local compilers, virtual environments, or heavy software suites.
        </p>
      </section>

      {/* Supported Languages Matrix */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-secondary" />
            Supported Programming Languages & Environments
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Practice real code across diverse domains in one unified, tabbed workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-secondary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              Py
            </div>
            <h4 className="text-base font-bold text-white">Python 3 (Pyodide)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Python 3 runtime running inside your browser via WebAssembly. Execute loops, algorithms, string operations, math, json, and standard data structures with live terminal output.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-secondary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              Web
            </div>
            <h4 className="text-base font-bold text-white">HTML5, CSS3 & JS</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant live preview sandbox for frontend web design. Craft HTML layouts, style with modern CSS, and script dynamic behaviors with JavaScript with zero reload delay.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-secondary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
              C++
            </div>
            <h4 className="text-base font-bold text-white">C & C++ Compiler</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compile and run C/C++ code right in your browser. Perfect for mastering pointers, memory concepts, recursion, sorting algorithms, and university coursework.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-secondary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              SQL
            </div>
            <h4 className="text-base font-bold text-white">MySQL & SQLite</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive relational query engine for database practice. Create tables, insert records, and run complex SELECT queries with formatted result tables.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-secondary" />
          <span>Engineered for Maximum Coding Productivity</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Code2 className="w-4 h-4 text-secondary" />
              <span>Monaco Editor (VS Code)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enjoy syntax highlighting, bracket matching, auto-closing quotes, multi-cursor selection, code folding, and smooth persistent zoom memory.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              <span>Zen Focus Mode</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toggle fullscreen focus mode with a single click or keyboard shortcut. Expand your coding canvas, collapse sidebars, and eliminate all distractions during exams or coding marathons.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>12-Hour Local Persistence</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accidental browser crash or power cut? Your open files, created tabs, and active code are safely preserved in browser IndexedDB/localStorage with 12-hour smart memory.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step How-To Guide */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-secondary" />
          <span>How to Write & Run Code in MSK Playground</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col space-y-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-mono font-bold flex items-center justify-center text-sm">
              1
            </span>
            <h4 className="text-base font-semibold text-white">Select Language or Template</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your preferred programming language from the file explorer sidebar or language selector. Load sample starter code for Python, Web, C++, or SQL.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col space-y-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-mono font-bold flex items-center justify-center text-sm">
              2
            </span>
            <h4 className="text-base font-semibold text-white">Write Code in Monaco Editor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type your code with intelligent autocompletion, indentation guides, and error highlights. Add multiple files to practice modular programming.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col space-y-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-mono font-bold flex items-center justify-center text-sm">
              3
            </span>
            <h4 className="text-base font-semibold text-white">Execute & View Live Output</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Press <kbd className="text-secondary font-mono">Shift + Enter</kbd> or click &ldquo;Run Code&rdquo; to execute. View console output, error traces, or live interactive web previews in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Client-Side Privacy Guarantee */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          100% Client-Side Privacy Guarantee
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Zero Server Latency &bull; Your Code Never Leaves Your Device
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Unlike online compilers that send your code over the internet to remote queue workers, 
          MSK Code Playground executes code directly on your computer using WebAssembly and isolated iframes. 
          Enjoy lightning-fast execution speeds, offline-friendly capability, and complete privacy for your sensitive assignments and projects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant execution without cold-start server delays</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No account registration or API keys required</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ideal for school computer labs, coding bootcamps, and exams</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Export and download code files directly to your hard drive</span>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-secondary" />
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Answers to common questions about the MSK Code Playground and online compilers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Can I run Python without installing Python on my PC?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! The playground runs Pyodide, a WebAssembly compilation of Python 3. It executes natively in Chrome, Edge, Firefox, and Safari without installing any software or Python interpreters.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Will my code be saved if I refresh or close the tab?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. MSK Code Playground includes a 12-hour persistence engine that stores your active files and editor state in your browser&apos;s local IndexedDB and localStorage cache.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Can I preview HTML, CSS, and JavaScript websites?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. Selecting web mode renders an interactive sandboxed browser preview window with live CSS rendering and JavaScript DOM execution.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">How do I practice relational SQL queries?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can run SQL queries directly inside Playground, or for advanced database schema exploration, ER diagrams, and SQLite binary downloads, switch to our dedicated{' '}
              <Link href="/tools/sql-studio" className="text-secondary underline">MSK SQL Studio</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking & Next Steps */}
      <section className="bg-gradient-to-r from-secondary/20 via-primary to-slate-900 border border-secondary/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest">
            Level Up Your Programming Career
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            Learn Coding With Er. Sumit Kumar at MSK Institute
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Take your programming skills from beginner to job-ready software engineer. Enroll in full-stack web development, Python data science, or NIELIT O-Level/CCC certifications in Shikohabad.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools/sql-studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-secondary hover:bg-secondary-light transition-all shadow-md"
          >
            <span>SQL Studio</span>
          </Link>
          <Link
            href="/tools/db-viewer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <span>DB Viewer</span>
          </Link>
        </div>
      </section>
    </article>
  );
}

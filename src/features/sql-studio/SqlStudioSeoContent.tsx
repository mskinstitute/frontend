import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function SqlStudioSeoContent() {
  return (
    <article className="mt-16 pt-12 border-t border-slate-800 text-slate-300 space-y-12">
      {/* Title & Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          In-Browser SQL Studio & Web Database Workbench
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-300">
          <strong>MSK SQL Studio</strong> is a zero-setup, professional online SQL environment built for students, 
          software engineers, and database administrators. Powered by Microsoft&apos;s industry-standard{' '}
          <strong>Monaco Editor</strong> (the code engine powering VS Code) and the official{' '}
          <strong>SQLite 3 WebAssembly engine</strong>, it lets you write, debug, and execute complex SQL and MySQL-compatible 
          queries directly inside your browser without installing database servers or configuring ports.
        </p>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Monaco Editor Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full VS Code experience with SQL syntax highlighting, intelligent autocomplete, line numbering, multi-cursor editing, and <kbd className="text-secondary font-mono">Ctrl + Enter</kbd> execution.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Full DDL & DML Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run <code className="text-emerald-300">SELECT</code> queries with multi-table joins, aggregations, subqueries, as well as <code className="text-emerald-300">CREATE TABLE</code>, <code className="text-emerald-300">INSERT</code>, <code className="text-emerald-300">UPDATE</code>, and <code className="text-emerald-300">DELETE</code> statements.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Download Modified SQLite DB</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Modify tables, add records, and download the resulting SQLite binary file directly to your disk with one click. Ready to use in Python or production projects.
          </p>
        </div>
      </section>

      {/* Guide: Learning SQL at MSK Institute */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-secondary" />
          <span>Why Practice SQL In-Browser?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Relational databases are the backbone of modern web applications, enterprise software, and mobile apps. 
          When learning Python, MERN stack, or preparing for technical exams like NIELIT CCC, BCA, or B.Tech CS, students 
          frequently waste hours configuring local MySQL or PostgreSQL services. 
          With MSK SQL Studio, you get a zero-friction playground where queries run instantaneously in browser memory.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Practice INNER, LEFT, RIGHT, and FULL OUTER joins</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Master GROUP BY, HAVING, and aggregate functions (COUNT, SUM, AVG)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Design relational schemas with Primary and Foreign Keys</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Export query results to CSV spreadsheets for reports</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-secondary" />
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to know about using the in-browser SQL Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Can I run MySQL queries in this studio?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! MSK SQL Studio includes automatic MySQL normalization that maps MySQL constructs (such as <code className="text-slate-200">#</code> comments, <code className="text-slate-200">AUTO_INCREMENT</code>, and standard helper functions) into SQLite WebAssembly.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">How does the connection with Database Viewer work?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you inspect a file in <Link href="/tools/db-viewer" className="text-secondary underline">Database Viewer</Link> and click &ldquo;Edit in SQL Studio&rdquo;, your database is transferred locally via browser IndexedDB without any file re-upload.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Can I download my database after inserting new records?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Absolutely. Click the &ldquo;Save .db&rdquo; button in the top control bar to download your updated SQLite binary database file directly to your computer.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Is my SQL code or database sent to a server?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never. The entire SQL execution pipeline runs client-side in your computer&apos;s memory using WebAssembly. Your queries and data are 100% private.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-secondary/20 via-primary to-slate-900 border border-secondary/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest">
            Learn From Er. Sumit Kumar
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            Want to master Full-Stack Web Development & Python?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Join MSK Institute Shikohabad for practical lab training in Python, React, Node.js, and relational database engineering.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools/db-viewer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <span>Quick DB Viewer</span>
          </Link>
        </div>
      </section>
    </article>
  );
}

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Lock,
  FileSpreadsheet,
  Terminal,
  HelpCircle,
  Laptop,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function DbViewerSeoContent() {
  return (
    <article className="mt-16 pt-12 border-t border-slate-800 text-slate-300 space-y-12">
      {/* Overview & Value Proposition */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How to Open & View SQLite (<code className="text-secondary">.db</code>) Files Online Without Software
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-300">
          Traditionally, inspecting a SQLite database file (<code className="text-slate-100">.db</code>,{' '}
          <code className="text-slate-100">.sqlite</code>, or <code className="text-slate-100">.sqlite3</code>) 
          required downloading and installing heavy native desktop software like DB Browser for SQLite, DBeaver, or command-line tools. 
          The <strong>MSK Database Viewer</strong> eliminates this barrier completely. Built with cutting-edge 
          <strong>WebAssembly (WASM)</strong>, it runs the official SQLite 3 engine directly within your modern web browser.
        </p>
      </section>

      {/* 3 Step How-To Guide */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-secondary" />
          <span>Quick 3-Step Guide to Inspecting Any Database File</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col space-y-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-mono font-bold flex items-center justify-center text-sm">
              1
            </span>
            <h4 className="text-base font-semibold text-white">Drag & Drop Your File</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag your <code className="text-secondary">.db</code>, <code className="text-secondary">.sqlite</code>, or <code className="text-secondary">.sql</code> file directly into the viewer box, or click &ldquo;Open .DB / .SQL File&rdquo;.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col space-y-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-mono font-bold flex items-center justify-center text-sm">
              2
            </span>
            <h4 className="text-base font-semibold text-white">Browse Tables & Schema</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly view all tables and views in the left sidebar with live row counts. Switch between interactive data spreadsheet records and column DDL definitions.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col space-y-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-mono font-bold flex items-center justify-center text-sm">
              3
            </span>
            <h4 className="text-base font-semibold text-white">Export or Edit in SQL Studio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter and export any table to CSV or JSON with one click. Need to run custom queries or alter tables? Click &ldquo;Edit in SQL Studio&rdquo; for full IDE power.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Client-Side Privacy Guarantee */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            100% Client-Side Privacy Guarantee
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Your Database Never Leaves Your Computer
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlike many other online database viewers that upload your files to remote cloud servers, 
            <strong> MSK Database Viewer executes 100% locally in your web browser</strong> using client-side JavaScript 
            and WebAssembly. No sensitive student records, customer databases, or proprietary schemas are ever transmitted over the network.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero server upload latency — instant multi-megabyte file parsing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Works seamlessly even when your internet connection drops</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Perfect for college assignments, viva preparation, and confidential client data</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-secondary">
            Supported File Types
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-secondary font-bold">
                .db / .sqlite
              </span>
              <p className="text-slate-400">Standard binary SQLite database files (SQLite 3 format).</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-blue-400 font-bold">
                .sqlite3
              </span>
              <p className="text-slate-400">Modern Python (<code className="text-slate-200">import sqlite3</code>) and Django/Rails databases.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-400 font-bold">
                .sql
              </span>
              <p className="text-slate-400">Plain SQL script dumps containing CREATE TABLE and INSERT statements.</p>
            </div>
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
            Common questions regarding opening, inspecting, and editing SQLite database files in the browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Can I view databases created with Python sqlite3?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! Python creates standard SQLite3 binary files. Simply drag your <code className="text-slate-200">database.db</code> or <code className="text-slate-200">app.sqlite3</code> file right into this tool to inspect tables and rows instantly.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Can I edit data and run custom SQL queries?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. While the Database Viewer is optimized for fast read-only inspection, clicking the &ldquo;Edit in SQL Studio&rdquo; button seamlessly transfers your loaded database into our full-featured in-browser SQL Workbench with Monaco Editor.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">How do I export tables to Excel or CSV?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select the table you wish to export, then click the &ldquo;CSV&rdquo; button in the top right corner. The file downloads directly to your device and opens smoothly in Microsoft Excel or Google Sheets.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-white">Is there any file size limit?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Because WebAssembly runs directly inside your computer&apos;s RAM, it comfortably handles database files up to several hundred megabytes depending on your device memory.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking & Next Steps */}
      <section className="bg-gradient-to-r from-primary to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest">
            Next-Level Database Skills
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            Ready to write complex queries, joins, and aggregations?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Switch to the MSK SQL Studio to execute multi-statement queries, format code, design ER diagrams, and save updated SQLite files.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/tools/sql-studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-secondary hover:bg-secondary-light transition-all shadow-md"
          >
            <span>Launch SQL Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <span>Explore Courses</span>
          </Link>
        </div>
      </section>
    </article>
  );
}

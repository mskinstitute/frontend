'use client';

import React, { useState } from 'react';
import {
  Workflow,
  Globe,
  FileCode,
  Laptop,
  Server,
  Database,
  ArrowRight,
  ArrowDown,
  Code2,
  Link2,
  Palette,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  Boxes,
  Maximize2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * 1. Flowchart & Architecture Process Pipeline
 * Renders A -> B -> C or A ➡️ B ➡️ C as a modern, interactive visual flowchart.
 */
export function FlowchartPipeline({ code }: { code: string }) {
  // Find lines with arrows
  const arrowLine = code
    .split('\n')
    .find((l) => l.includes('➡️') || l.includes('->') || l.includes('-->') || l.includes('=>'));

  if (!arrowLine) return null;

  // Split steps
  const steps = arrowLine
    .split(/➡️|-->|->|=>/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (steps.length < 2) return null;

  const getStepIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('code') || lower.includes('html') || lower.includes('file') || lower.includes('index')) {
      return <FileCode className="w-5 h-5 text-rose-600" />;
    }
    if (lower.includes('browser') || lower.includes('chrome') || lower.includes('edge') || lower.includes('web')) {
      return <Globe className="w-5 h-5 text-blue-600" />;
    }
    if (lower.includes('screen') || lower.includes('webpage') || lower.includes('page') || lower.includes('ui')) {
      return <Laptop className="w-5 h-5 text-emerald-600" />;
    }
    if (lower.includes('server') || lower.includes('api') || lower.includes('backend')) {
      return <Server className="w-5 h-5 text-amber-600" />;
    }
    if (lower.includes('database') || lower.includes('db') || lower.includes('sql')) {
      return <Database className="w-5 h-5 text-indigo-600" />;
    }
    return <Workflow className="w-5 h-5 text-secondary" />;
  };

  return (
    <div className="my-6 rounded-2xl border border-border-subtle bg-gradient-to-br from-slate-50/80 via-white to-orange-50/30 p-5 sm:p-7 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary">Visual Architecture & Process Flow</h4>
            <p className="text-[11px] text-text-muted">How data and code flow step-by-step</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white border border-border-subtle text-secondary">
          Flowchart
        </span>
      </div>

      {/* Nodes Pipeline */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2 py-2">
        {steps.map((rawStep, idx) => {
          // Parse title and optional parenthesis subtitle: e.g. "Your Code (index.html)"
          const parenMatch = rawStep.match(/^(.*?)\s*\((.*?)\)$/);
          const title = parenMatch ? parenMatch[1].trim() : rawStep;
          const subtitle = parenMatch ? parenMatch[2].trim() : null;

          return (
            <React.Fragment key={idx}>
              {/* Step Card */}
              <div className="relative w-full sm:flex-1 p-4 rounded-xl bg-white border border-border-subtle shadow-2xs hover:shadow-sm hover:border-secondary/40 transition-all flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group">
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-surface border border-border-subtle">
                    Step {idx + 1}
                  </span>
                  <div className="p-1.5 rounded-lg bg-surface group-hover:scale-110 transition-transform">
                    {getStepIcon(rawStep)}
                  </div>
                </div>

                <div className="space-y-0.5 w-full">
                  <div className="font-bold text-sm text-primary leading-snug">{title}</div>
                  {subtitle && (
                    <div className="text-xs font-mono font-semibold text-secondary truncate">
                      {subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow Connector */}
              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center p-1 text-secondary/80 flex-shrink-0 animate-pulse">
                  <ArrowRight className="hidden sm:block w-5 h-5" />
                  <ArrowDown className="sm:hidden w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 2. HTML Element Anatomy Diagram
 * Replaces ASCII element diagrams (<p> ... </p> Start Tag Content End Tag)
 */
export function HtmlElementAnatomyDiagram() {
  return (
    <div className="my-6 rounded-2xl border border-border-subtle bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary">HTML Element Anatomy Breakdown</h4>
            <p className="text-[11px] text-text-muted">The complete package understood by web browsers</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
          Core Concept
        </span>
      </div>

      {/* Visual Component Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Start Tag */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border-2 border-emerald-300 flex flex-col items-center text-center space-y-2 shadow-2xs">
          <code className="text-lg font-mono font-black text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            &lt;p&gt;
          </code>
          <div className="font-bold text-xs uppercase tracking-wider text-emerald-900 font-mono">
            Opening Tag (Start)
          </div>
          <p className="text-[11px] text-emerald-950/80 leading-relaxed">
            Tells the browser: a new paragraph element starts right here.
          </p>
        </div>

        {/* 2. Inner Content */}
        <div className="p-4 rounded-xl bg-amber-50/80 border-2 border-amber-300 flex flex-col items-center text-center space-y-2 shadow-2xs">
          <span className="text-sm font-bold text-amber-950 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs leading-snug">
            Welcome to MSK Institute!
          </span>
          <div className="font-bold text-xs uppercase tracking-wider text-amber-900 font-mono">
            Element Content
          </div>
          <p className="text-[11px] text-amber-950/80 leading-relaxed">
            The actual text, images, or child tags displayed to the visitor.
          </p>
        </div>

        {/* 3. End Tag */}
        <div className="p-4 rounded-xl bg-rose-50/80 border-2 border-rose-300 flex flex-col items-center text-center space-y-2 shadow-2xs">
          <code className="text-lg font-mono font-black text-rose-800 bg-white px-3 py-1 rounded-lg border border-rose-200 shadow-2xs">
            &lt;/p&gt;
          </code>
          <div className="font-bold text-xs uppercase tracking-wider text-rose-900 font-mono">
            Closing Tag (End)
          </div>
          <p className="text-[11px] text-rose-950/80 leading-relaxed">
            Notice the forward slash (<span className="font-mono font-bold">/</span>): signals where the paragraph ends.
          </p>
        </div>
      </div>

      {/* Bracket / Summary Banner */}
      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
          <span className="font-bold text-primary">
            HTML Element = Opening Tag + Content + Closing Tag
          </span>
        </div>
        <span className="text-text-muted">
          Tag: Just <code className="text-secondary font-mono">&lt;p&gt;</code> • Element: The entire combination
        </span>
      </div>
    </div>
  );
}

/**
 * 3. HTML Link & Attribute Anatomy Diagram
 * Replaces ASCII anchor diagrams (<a href="..."> Visit MSK </a>)
 */
export function HtmlLinkAnatomyDiagram() {
  return (
    <div className="my-6 rounded-2xl border border-border-subtle bg-gradient-to-br from-slate-50 via-white to-sky-50/20 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary">Hyperlink & Attribute Anatomy Breakdown</h4>
            <p className="text-[11px] text-text-muted">Understanding anchor tags and destination attributes</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700">
          Link Anatomy
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col space-y-1.5">
          <code className="text-sm font-mono font-bold text-slate-800">&lt;a</code>
          <span className="text-xs font-bold text-slate-700 font-mono">Opening Tag</span>
          <p className="text-[11px] text-slate-600">Defines a clickable hyperlink.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col space-y-1.5">
          <code className="text-sm font-mono font-bold text-amber-800">href="..."</code>
          <span className="text-xs font-bold text-amber-900 font-mono">Destination Attribute</span>
          <p className="text-[11px] text-amber-900/80">Hypertext Reference (URL to open on click).</p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col space-y-1.5">
          <span className="text-sm font-bold text-emerald-900 truncate">Visit MSK Institute</span>
          <span className="text-xs font-bold text-emerald-900 font-mono">Clickable Text</span>
          <p className="text-[11px] text-emerald-900/80">User-facing anchor text on screen.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col space-y-1.5">
          <code className="text-sm font-mono font-bold text-rose-800">&lt;/a&gt;</code>
          <span className="text-xs font-bold text-rose-900 font-mono">Closing Tag</span>
          <p className="text-[11px] text-rose-900/80">Closes the hyperlink element.</p>
        </div>
      </div>

      {/* Live Interactive Preview */}
      <div className="p-4 rounded-xl bg-surface border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Live Rendered Link Preview:</span>
          <a
            href="https://www.mskinstitute.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-secondary font-bold underline hover:text-secondary-light transition-colors"
          >
            Visit MSK Institute
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <span className="text-text-muted font-mono text-[11px]">
          Hover or click to test link behavior!
        </span>
      </div>
    </div>
  );
}

/**
 * 4. CSS Border Styles Showcase
 * Replaces ASCII dashed/dotted lines with real rendered CSS borders
 */
export function CssBorderStylesShowcase() {
  const styles = [
    {
      name: 'solid',
      style: 'border-2 border-solid border-secondary',
      desc: 'Clean continuous stroke (Most common for cards, buttons, inputs)',
      badgeBg: 'bg-secondary/10 text-secondary border-secondary/20',
    },
    {
      name: 'dashed',
      style: 'border-2 border-dashed border-amber-500',
      desc: 'Dashes (Coupons, discount cards, drag-and-drop upload zones)',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      name: 'dotted',
      style: 'border-2 border-dotted border-blue-500',
      desc: 'Series of round dots (Subtle section breaks, active focus rings)',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'double',
      style: 'border-4 border-double border-emerald-600',
      desc: 'Two parallel solid lines (Certificate frames, diplomas, awards)',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'none',
      style: 'border-none bg-slate-100/70',
      desc: 'Default browser value (No border displayed)',
      badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-border-subtle bg-white p-5 sm:p-7 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary">Live CSS Border Style Showcase</h4>
            <p className="text-[11px] text-text-muted">Live interactive preview of all standard border-style values</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-secondary/10 border border-secondary/20 text-secondary">
          Live CSS Demo
        </span>
      </div>

      {/* Live Rows */}
      <div className="space-y-3">
        {styles.map((item) => (
          <div
            key={item.name}
            className="p-3.5 rounded-xl bg-surface/60 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${item.badgeBg}`}>
                {item.name}
              </span>
            </div>

            {/* Live Rendered CSS Border Box */}
            <div className="flex-1 min-w-[160px]">
              <div
                className={`w-full py-2 px-4 rounded-lg bg-white ${item.style} flex items-center justify-center text-xs font-mono font-semibold text-text-muted shadow-2xs`}
              >
                Sample {item.name} border
              </div>
            </div>

            <div className="text-xs text-text-muted sm:w-64 flex-shrink-0 text-left sm:text-right">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 5. The 3 Ingredients of a Border Infographic
 * Replaces ASCII box: THE 3 INGREDIENTS OF A BORDER
 */
export function BorderIngredientsCard() {
  const [copied, setCopied] = useState(false);
  const shorthandCode = 'border: 3px solid #f59e0b;';

  const handleCopy = () => {
    navigator.clipboard.writeText(shorthandCode);
    setCopied(true);
    toast.success('Shorthand copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">The 3 Ingredients of a Border 🖼️</h4>
            <p className="text-[11px] text-amber-900/80">The School Certificate Wooden Frame Analogy</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900">
          Architecture
        </span>
      </div>

      {/* 3 Ingredient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ingredient 1 */}
        <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Ingredient 1
            </span>
            <h5 className="font-mono font-bold text-sm text-primary">border-width</h5>
            <p className="text-xs font-semibold text-text-muted">THICKNESS OF THE FRAME</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
              <span>1px wire</span>
              <span className="font-bold text-secondary">3px standard</span>
              <span>6px heavy</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-slate-50 border-[3px] border-solid border-slate-400 flex items-center justify-center text-[10px] text-slate-600 font-mono">
              3px frame
            </div>
          </div>
        </div>

        {/* Ingredient 2 */}
        <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Ingredient 2 (Mandatory ⚠️)
            </span>
            <h5 className="font-mono font-bold text-sm text-primary">border-style</h5>
            <p className="text-xs font-semibold text-text-muted">DESIGN PATTERN</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
              <span>solid</span>
              <span>dashed</span>
              <span>double</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-slate-50 border-2 border-dashed border-amber-500 flex items-center justify-center text-[10px] text-amber-700 font-mono">
              dashed pattern
            </div>
          </div>
        </div>

        {/* Ingredient 3 */}
        <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Ingredient 3
            </span>
            <h5 className="font-mono font-bold text-sm text-primary">border-color</h5>
            <p className="text-xs font-semibold text-text-muted">COLOR OF THE FRAME</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 justify-center py-1">
              <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-300" title="Charcoal" />
              <span className="w-4 h-4 rounded-full bg-blue-600 border border-blue-300" title="Royal Blue" />
              <span className="w-4 h-4 rounded-full bg-amber-500 border border-amber-300 ring-2 ring-amber-300" title="Gold" />
              <span className="w-4 h-4 rounded-full bg-emerald-600 border border-emerald-300" title="Emerald" />
            </div>
            <div className="w-full h-8 rounded-lg bg-slate-50 border-2 border-solid border-amber-500 flex items-center justify-center text-[10px] text-amber-700 font-mono">
              #f59e0b gold
            </div>
          </div>
        </div>
      </div>

      {/* Shorthand Summary Box */}
      <div className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-text-muted font-sans font-semibold">Combine with Shorthand:</span>
          <code className="text-secondary font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200">
            {shorthandCode}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-secondary bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 6. Clean Blueprint Architecture Canvas
 * Renders general ASCII diagrams as clean engineering blueprints instead of black terminal blocks
 */
export function BlueprintDiagramCanvas({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Diagram copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50/90 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Boxes className="w-4 h-4 text-secondary" />
          <span>{title || 'Visual Architecture Blueprint'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-slate-600 hover:text-primary transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-white"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy Diagram'}</span>
        </button>
      </div>

      {/* Blueprint Canvas */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
          {code}
        </pre>
      </div>
    </div>
  );
}

/**
 * Auto-detects if code block should be rendered as an enhanced visual diagram.
 */
export function detectAndRenderVisualDiagram(code: string, lang: string): React.ReactNode | null {
  const trimmed = code.trim();
  const lower = trimmed.toLowerCase();

  // 1. Flowchart Pipeline
  if (
    trimmed.includes('➡️') ||
    ((trimmed.includes('->') || trimmed.includes('-->')) &&
      (lower.includes('code') || lower.includes('browser') || lower.includes('server') || lower.includes('database') || lower.includes('client')))
  ) {
    return <FlowchartPipeline code={trimmed} />;
  }

  // 2. HTML Element Anatomy Diagram
  if (
    trimmed.includes('<p>') &&
    (trimmed.includes('Start Tag') || trimmed.includes('Opening Tag')) &&
    (trimmed.includes('End Tag') || trimmed.includes('Closing Tag'))
  ) {
    return <HtmlElementAnatomyDiagram />;
  }

  // 3. HTML Link & Attribute Anatomy Diagram
  if (
    trimmed.includes('<a') &&
    trimmed.includes('href') &&
    (trimmed.includes('Opening Tag') || trimmed.includes('Destination URL') || trimmed.includes('Clickable Text'))
  ) {
    return <HtmlLinkAnatomyDiagram />;
  }

  // 4. The 3 Ingredients of a Border
  if (
    lower.includes('3 ingredients of a border') ||
    (lower.includes('border-width') && lower.includes('border-style') && lower.includes('border-color') && lower.includes('thickness of the frame'))
  ) {
    return <BorderIngredientsCard />;
  }

  // 5. CSS Border Styles Showcase
  if (
    lower.includes('solid') &&
    lower.includes('dashed') &&
    lower.includes('dotted') &&
    lower.includes('double') &&
    lower.includes('continuous stroke')
  ) {
    return <CssBorderStylesShowcase />;
  }

  // 6. Generic ASCII box diagram (+----+ or |    |)
  if (
    (trimmed.startsWith('+---') || trimmed.startsWith('+===') || trimmed.startsWith('┌───')) &&
    trimmed.includes('|')
  ) {
    return <BlueprintDiagramCanvas code={trimmed} />;
  }

  return null;
}

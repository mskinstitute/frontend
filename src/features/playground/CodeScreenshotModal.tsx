'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Camera,
  Sparkles,
  Sliders,
  Hash,
  Layers,
  ZoomIn,
  Eye,
  Minus,
  Plus,
  Maximize2,
  Minimize2,
  Tv,
} from 'lucide-react';
import { SupportedLanguage } from './types';
import {
  tokenizeCodeToLines,
  getTokenColor,
  TokenizedLine,
} from '@/lib/prism-highlighter';
import toast from 'react-hot-toast';

interface CodeScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: SupportedLanguage;
  filename?: string;
}

export type ResolutionOption = 1 | 2 | 3;
export type ShadowOption = 'shadow' | 'glow' | 'none';

interface GradientPreset {
  id: string;
  name: string;
  background: string;
  stops: [string, string, string];
  isTransparent?: boolean;
}

const GRADIENTS: GradientPreset[] = [
  {
    id: 'charcoal',
    name: 'Charcoal Minimal (Dark)',
    background: 'linear-gradient(135deg, #18191c 0%, #23272f 50%, #18191c 100%)',
    stops: ['#18191c', '#23272f', '#18191c'],
  },
  {
    id: 'sunset',
    name: 'MSK Sunset',
    background: 'linear-gradient(135deg, #ff6b00 0%, #ff8e53 50%, #e040fb 100%)',
    stops: ['#ff6b00', '#ff8e53', '#e040fb'],
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    background: 'linear-gradient(135deg, #0A2540 0%, #007acc 50%, #00d2ff 100%)',
    stops: ['#0A2540', '#007acc', '#00d2ff'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    background: 'linear-gradient(135deg, #2b0054 0%, #7b1fa2 50%, #ff007f 100%)',
    stops: ['#2b0054', '#7b1fa2', '#ff007f'],
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
    stops: ['#064e3b', '#059669', '#34d399'],
  },
  {
    id: 'midnight',
    name: 'Midnight Aurora',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    stops: ['#0f172a', '#1e1b4b', '#312e81'],
  },
  {
    id: 'flame',
    name: 'Sunset Flame',
    background: 'linear-gradient(135deg, #e11d48 0%, #ea580c 50%, #facc15 100%)',
    stops: ['#e11d48', '#ea580c', '#facc15'],
  },
  {
    id: 'transparent',
    name: 'Transparent Card',
    background: 'transparent',
    stops: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
    isTransparent: true,
  },
];

export default function CodeScreenshotModal({
  isOpen,
  onClose,
  code,
  language,
  filename = 'main.py',
}: CodeScreenshotModalProps) {
  const [selectedGradient, setSelectedGradient] = useState<GradientPreset>(GRADIENTS[0]);
  const [padding, setPadding] = useState<number>(32);
  const [isAutoRatio, setIsAutoRatio] = useState<boolean>(true);
  const [manualRatio, setManualRatio] = useState<number>(1.5);
  const [resolution, setResolution] = useState<ResolutionOption>(2);
  const [fontSize, setFontSize] = useState<number>(13.5);
  const [shadowStyle, setShadowStyle] = useState<ShadowOption>('shadow');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showMacDots, setShowMacDots] = useState<boolean>(true);
  const [zoomMode, setZoomMode] = useState<'fit' | '100%'>('fit');
  const [customFilename, setCustomFilename] = useState<string>(filename);
  const [fitScale, setFitScale] = useState<number>(1);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Sync custom filename when prop updates
  useEffect(() => {
    setCustomFilename(filename);
  }, [filename]);

  // Tokenize code into line-by-line syntax tokens
  const tokenizedLines: TokenizedLine[] = useMemo(() => {
    return tokenizeCodeToLines(code || '', language);
  }, [code, language]);

  const lineHeight = Math.round(fontSize * 1.7);

  // Calculate pixel dimensions: Ratio changes the EDITOR's width, while Background ALWAYS tightly hugs with padding
  const dimensions = useMemo(() => {
    let maxCharLength = 0;
    for (const lineTokens of tokenizedLines) {
      let len = 0;
      for (const tok of lineTokens) {
        len += tok.text.length;
      }
      if (len > maxCharLength) maxCharLength = len;
    }

    const estimatedCharWidth = fontSize * 0.6;
    const gutterWidth = showLineNumbers ? 48 : 0;
    const naturalCodeWidth = Math.max(
      420,
      Math.ceil(maxCharLength * estimatedCharWidth + gutterWidth + 48)
    );
    const titleBarHeight = 38;
    const codeAreaHeight = tokenizedLines.length * lineHeight + 26;
    const watermarkHeight = showWatermark ? 30 : 10;
    const innerCardHeight = titleBarHeight + codeAreaHeight + watermarkHeight;

    const naturalRatio = Number((naturalCodeWidth / innerCardHeight).toFixed(2));

    // Ratio directly changes the EDITOR's size (width)
    let innerCardWidth = naturalCodeWidth;
    if (!isAutoRatio && manualRatio > 0) {
      innerCardWidth = Math.max(380, Math.round(innerCardHeight * manualRatio));
    }

    const effectiveRatio = Number((innerCardWidth / innerCardHeight).toFixed(2));

    // Background ALWAYS strictly wraps the editor with the chosen padding (uniform on all 4 sides)
    const outerW = innerCardWidth + padding * 2;
    const outerH = innerCardHeight + padding * 2;
    const cardX = padding;
    const cardY = padding;

    return {
      innerCardWidth,
      innerCardHeight,
      outerW,
      outerH,
      cardX,
      cardY,
      gutterWidth,
      titleBarHeight,
      effectiveRatio,
      naturalRatio,
    };
  }, [
    tokenizedLines,
    fontSize,
    lineHeight,
    showLineNumbers,
    showWatermark,
    padding,
    isAutoRatio,
    manualRatio,
  ]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-fit card within viewport in 'fit' mode
  useEffect(() => {
    if (!isOpen) return;

    if (zoomMode !== 'fit') {
      setFitScale(1);
      return;
    }

    const computeScale = () => {
      if (!viewportRef.current) return;
      const vRect = viewportRef.current.getBoundingClientRect();
      const cardW = dimensions.outerW;
      const cardH = dimensions.outerH;

      if (cardW > 0 && cardH > 0) {
        const availableW = Math.max(280, vRect.width - 48);
        const availableH = Math.max(220, vRect.height - 48);

        const scaleX = availableW / cardW;
        const scaleY = availableH / cardH;
        const calculated = Math.min(1, Math.min(scaleX, scaleY));
        setFitScale(Math.max(0.25, Number(calculated.toFixed(2))));
      }
    };

    computeScale();
    const timer = setTimeout(computeScale, 50);
    window.addEventListener('resize', computeScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeScale);
    };
  }, [isOpen, zoomMode, dimensions]);

  if (!isOpen) return null;

  // Render high-res Canvas with full token-level syntax highlighting
  const generateCanvas = async (): Promise<HTMLCanvasElement> => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      await document.fonts.ready;
    }

    const dpr = resolution; // 1, 2, or 3
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    const {
      innerCardWidth,
      innerCardHeight,
      outerW,
      outerH,
      cardX,
      cardY,
      gutterWidth,
      titleBarHeight,
    } = dimensions;

    canvas.width = outerW * dpr;
    canvas.height = outerH * dpr;

    ctx.scale(dpr, dpr);

    // 1. Draw outer background
    if (!selectedGradient.isTransparent) {
      const grad = ctx.createLinearGradient(0, 0, outerW, outerH);
      grad.addColorStop(0, selectedGradient.stops[0]);
      grad.addColorStop(0.5, selectedGradient.stops[1]);
      grad.addColorStop(1, selectedGradient.stops[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, outerW, outerH);
    } else {
      ctx.clearRect(0, 0, outerW, outerH);
    }

    // 2. Draw card shadow or glow
    ctx.save();
    if (shadowStyle === 'glow' && !selectedGradient.isTransparent) {
      ctx.shadowColor = selectedGradient.stops[1];
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = 8;
    } else if (shadowStyle === 'shadow') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 36;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 14;
    }
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, innerCardWidth, innerCardHeight, 14);
    ctx.fillStyle = '#1e1e1e';
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, innerCardWidth, innerCardHeight, 14);
    ctx.stroke();

    // 3. Title Bar
    const dotsY = cardY + 19;
    const dotRadius = 5.5;

    if (showMacDots) {
      // Red dot
      ctx.beginPath();
      ctx.arc(cardX + 20, dotsY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff5f56';
      ctx.fill();

      // Yellow dot
      ctx.beginPath();
      ctx.arc(cardX + 38, dotsY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffbd2e';
      ctx.fill();

      // Green dot
      ctx.beginPath();
      ctx.arc(cardX + 56, dotsY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#27c93f';
      ctx.fill();
    }

    // Centered Filename
    ctx.font = `600 11.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(customFilename || filename, cardX + innerCardWidth / 2, cardY + 23);

    // Title bar divider line
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX, cardY + titleBarHeight);
    ctx.lineTo(cardX + innerCardWidth, cardY + titleBarHeight);
    ctx.stroke();

    // 4. Code lines
    const font = `${fontSize}px 'Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace`;
    ctx.font = font;
    const startY = cardY + titleBarHeight + 22;

    tokenizedLines.forEach((lineTokens, idx) => {
      const lineY = startY + idx * lineHeight;

      if (showLineNumbers) {
        ctx.fillStyle = '#52525b';
        ctx.textAlign = 'right';
        ctx.font = `${fontSize - 1.5}px 'Fira Code', 'JetBrains Mono', 'Consolas', monospace`;
        ctx.fillText(String(idx + 1), cardX + gutterWidth - 14, lineY);
      }

      ctx.textAlign = 'left';
      let curX = cardX + gutterWidth + 14;

      for (const tok of lineTokens) {
        ctx.fillStyle = getTokenColor(tok.type, tok.text);
        ctx.font = font;
        ctx.fillText(tok.text, curX, lineY);
        curX += ctx.measureText(tok.text).width;
      }
    });

    // 5. Watermark
    if (showWatermark) {
      const wmY = cardY + innerCardHeight - 12;
      ctx.font = `bold 10.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = '#ff6b00';
      ctx.textAlign = 'right';
      ctx.fillText(`⚡ MSK Code Playground • mskinstitute.in`, cardX + innerCardWidth - 16, wmY);
    }

    return canvas;
  };

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      const canvas = await generateCanvas();
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (customFilename || filename || 'code').replace(/\.[^/.]+$/, '');
      const ratioTag = isAutoRatio ? 'auto' : `r${dimensions.effectiveRatio}`;
      link.download = `${cleanName}-${ratioTag}-${resolution}x.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Screenshot downloaded (${resolution}x Retina)!`, { icon: '📸' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export screenshot image');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsCopying(true);
    try {
      const canvas = await generateCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Could not create PNG blob');
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2500);
          toast.success(`Copied to clipboard (${resolution}x PNG)!`, { icon: '📋' });
        } else {
          handleDownloadPng();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard write image error, downloading instead:', err);
      handleDownloadPng();
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1a1b1e] border border-[#333] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* 1. MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#232428] border-b border-[#333]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-sm">Export Beautiful Code Snippet</h2>
                <span className="px-1.5 py-0.2 bg-[#333] text-orange-400 border border-orange-500/20 rounded text-[10px] font-mono">
                  {resolution}x Retina
                </span>
                <span className="px-1.5 py-0.2 bg-[#333] text-sky-400 border border-sky-500/20 rounded text-[10px] font-mono">
                  {isAutoRatio ? 'Auto Ratio' : `Ratio ${dimensions.effectiveRatio}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Generate high-resolution social code cards with syntax highlighting & custom framing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono hidden md:inline">ESC to close</span>
            <button
              onClick={onClose}
              aria-label="Close Modal"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. CONTROLS TOOLBAR (Clean, No-Scrollbar Layout) */}
        <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 px-4 sm:px-5 py-2.5 bg-[#202125] border-b border-[#2e3035] text-xs">
          {/* Row Left: Theme Swatches (COMPLETELY SCROLLBAR FREE) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px] shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              Theme:
            </span>
            {/* Scrollbar-free theme circles */}
            <div className="flex items-center gap-1.5 flex-nowrap overflow-visible">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGradient(g)}
                  className={`w-6 h-6 rounded-full transition-all cursor-pointer border shrink-0 ${
                    selectedGradient.id === g.id
                      ? 'scale-120 border-white ring-2 ring-orange-500 shadow-md'
                      : 'border-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                  } ${g.isTransparent ? 'bg-slate-800 border-dashed' : ''}`}
                  style={{ background: g.background }}
                  title={g.name}
                />
              ))}
            </div>
          </div>

          {/* Row Right: Manual Padding, Manual Ratio, Resolution, Toggles */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-slate-300">
            {/* 1. MANUAL PADDING INPUT (Slider + Stepper + Direct Typing) */}
            <div className="flex items-center gap-1.5 bg-[#18191c] px-2 py-1 rounded-lg border border-[#333]">
              <span className="text-slate-400 text-[10.5px] font-medium shrink-0">Pad:</span>

              <button
                type="button"
                onClick={() => setPadding((p) => Math.max(0, p - 4))}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white bg-[#28292d] hover:bg-[#333] rounded cursor-pointer"
                title="Decrease padding by 4px"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>

              <input
                type="range"
                min={0}
                max={96}
                step={2}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-14 sm:w-16 h-1 accent-orange-500 bg-[#333] rounded cursor-pointer"
                title={`Padding: ${padding}px`}
              />

              <button
                type="button"
                onClick={() => setPadding((p) => Math.min(120, p + 4))}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white bg-[#28292d] hover:bg-[#333] rounded cursor-pointer"
                title="Increase padding by 4px"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>

              <div className="flex items-center ml-0.5">
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={padding}
                  onChange={(e) =>
                    setPadding(Math.max(0, Math.min(120, Number(e.target.value) || 0)))
                  }
                  className="w-9 bg-[#25272c] text-white text-center font-mono text-[11px] py-0.2 rounded border border-[#444] focus:outline-none focus:border-orange-500"
                  title="Type custom padding in pixels"
                />
                <span className="text-slate-500 text-[10px] ml-1">px</span>
              </div>
            </div>

            {/* 2. MANUAL EDITOR RATIO SELECTOR (Controls Editor Size, NOT Background) */}
            <div className="flex items-center gap-1.5 bg-[#18191c] px-2 py-1 rounded-lg border border-[#333]">
              <span className="text-slate-400 text-[10.5px] font-medium shrink-0">Ratio:</span>

              {/* Auto Button */}
              <button
                type="button"
                onClick={() => setIsAutoRatio(true)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  isAutoRatio
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-[#28292d]'
                }`}
                title="Auto-fit editor width to code"
              >
                Auto
              </button>

              {/* Minus Stepper */}
              <button
                type="button"
                onClick={() => {
                  setIsAutoRatio(false);
                  setManualRatio((r) => Math.max(0.6, Number((r - 0.05).toFixed(2))));
                }}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white bg-[#28292d] hover:bg-[#333] rounded cursor-pointer"
                title="Decrease editor ratio by 0.05"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>

              {/* Fluid Ratio Slider */}
              <input
                type="range"
                min={0.7}
                max={2.4}
                step={0.02}
                value={isAutoRatio ? dimensions.naturalRatio : manualRatio}
                onChange={(e) => {
                  setIsAutoRatio(false);
                  setManualRatio(Number(e.target.value));
                }}
                className="w-14 sm:w-16 h-1 accent-orange-500 bg-[#333] rounded cursor-pointer"
                title={`Editor Ratio: ${isAutoRatio ? dimensions.naturalRatio : manualRatio}`}
              />

              {/* Plus Stepper */}
              <button
                type="button"
                onClick={() => {
                  setIsAutoRatio(false);
                  setManualRatio((r) => Math.min(2.8, Number((r + 0.05).toFixed(2))));
                }}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white bg-[#28292d] hover:bg-[#333] rounded cursor-pointer"
                title="Increase editor ratio by 0.05"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>

              {/* Direct Numeric Input Box for Ratio */}
              <div className="flex items-center ml-0.5">
                <input
                  type="number"
                  step="0.05"
                  min="0.6"
                  max="3.0"
                  value={isAutoRatio ? dimensions.naturalRatio : manualRatio}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setIsAutoRatio(false);
                      setManualRatio(Math.max(0.5, Math.min(3.0, val)));
                    }
                  }}
                  className="w-11 bg-[#25272c] text-white text-center font-mono text-[11px] py-0.2 rounded border border-[#444] focus:outline-none focus:border-orange-500"
                  title="Type custom editor aspect ratio (e.g. 1.0, 1.33, 1.78)"
                />
              </div>
            </div>

            {/* 3. RESOLUTION SELECTOR (1x, 2x, 3x) */}
            <div className="flex items-center gap-1 bg-[#18191c] p-0.5 rounded-lg border border-[#333]">
              <span className="text-slate-400 text-[10.5px] pl-1.5 pr-0.5 font-medium hidden md:inline">
                Res:
              </span>
              {([1, 2, 3] as ResolutionOption[]).map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`px-1.5 py-0.5 rounded text-[10.5px] font-semibold font-mono transition-colors cursor-pointer ${
                    resolution === res
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Export Resolution: ${res}x DPR`}
                >
                  {res}x
                </button>
              ))}
            </div>

            {/* 4. TOGGLES: Lines, Watermark, Dots, Shadow, Zoom */}
            <div className="flex items-center gap-1.5">
              {/* Line Numbers Toggle */}
              <button
                type="button"
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10.5px] font-medium transition-colors cursor-pointer ${
                  showLineNumbers
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-300'
                    : 'bg-[#18191c] border-[#333] text-slate-400 hover:text-white'
                }`}
                title="Toggle line numbers"
              >
                <Hash className="w-3 h-3" />
                <span className="hidden sm:inline">Lines</span>
              </button>

              {/* Watermark Toggle */}
              <button
                type="button"
                onClick={() => setShowWatermark(!showWatermark)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10.5px] font-medium transition-colors cursor-pointer ${
                  showWatermark
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-300'
                    : 'bg-[#18191c] border-[#333] text-slate-400 hover:text-white'
                }`}
                title="Toggle MSK watermark branding"
              >
                <span>⚡ MSK</span>
              </button>

              {/* macOS Dots Toggle */}
              <button
                type="button"
                onClick={() => setShowMacDots(!showMacDots)}
                className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg border text-[10.5px] font-medium transition-colors cursor-pointer ${
                  showMacDots
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-300'
                    : 'bg-[#18191c] border-[#333] text-slate-400 hover:text-white'
                }`}
                title="Toggle macOS 3-dots window controls"
              >
                <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <span>Dots</span>
              </button>

              {/* Glow / Shadow Toggle */}
              <button
                type="button"
                onClick={() =>
                  setShadowStyle((s) => (s === 'shadow' ? 'glow' : s === 'glow' ? 'none' : 'shadow'))
                }
                className={`hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg border text-[10.5px] font-medium transition-colors cursor-pointer ${
                  shadowStyle === 'glow'
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                    : shadowStyle === 'shadow'
                    ? 'bg-[#18191c] border-[#333] text-slate-300'
                    : 'bg-[#18191c] border-[#333] text-slate-500'
                }`}
                title="Cycle card shadow / glow"
              >
                <Sparkles className="w-3 h-3" />
                <span className="capitalize">{shadowStyle}</span>
              </button>

              {/* Zoom View Mode */}
              <div className="flex items-center gap-0.5 bg-[#18191c] p-0.5 rounded-lg border border-[#333]">
                {(['fit', '100%'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setZoomMode(mode)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer uppercase ${
                      zoomMode === mode
                        ? 'bg-[#333] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. ARTBOARD PREVIEW VIEWPORT (Scaled to fit without scrollbars) */}
        <div
          ref={viewportRef}
          className="relative flex-1 bg-[#0f1115] bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:18px_18px] p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[360px] max-h-[58vh] select-none"
        >
          {/* Scaled Preview Wrapper */}
          <div
            style={{
              transform: zoomMode === 'fit' ? `scale(${fitScale})` : 'scale(1)',
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="flex items-center justify-center shrink-0"
          >
            {/* The Outer Gradient Canvas Card: ALWAYS wraps with exactly padding */}
            <div
              ref={cardRef}
              className={`rounded-2xl transition-all overflow-hidden shrink-0 flex items-center justify-center ${
                selectedGradient.isTransparent ? 'border border-dashed border-white/20' : ''
              }`}
              style={{
                background: selectedGradient.background,
                padding: `${padding}px`,
                boxShadow:
                  shadowStyle === 'glow' && !selectedGradient.isTransparent
                    ? `0 20px 60px -15px ${selectedGradient.stops[1]}66`
                    : shadowStyle === 'shadow'
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    : 'none',
              }}
            >
              {/* Inner Dark Code Window: Width is determined by code width / manual ratio */}
              <div
                className="bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all"
                style={{
                  width: `${dimensions.innerCardWidth}px`,
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
                }}
              >
                {/* macOS Window Controls Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#2b2b2b]">
                  {showMacDots ? (
                    <div className="flex items-center gap-1.5 w-16">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                  ) : (
                    <div className="w-16" />
                  )}

                  {/* Editable Filename */}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      aria-label="File Name"
                      className="bg-transparent text-[11.5px] font-semibold text-slate-400 tracking-wide font-mono text-center hover:text-white hover:bg-white/5 px-2 py-0.5 rounded border border-transparent hover:border-slate-700 transition-colors focus:outline-none focus:border-orange-500 focus:text-white cursor-text"
                      title="Click to edit filename"
                    />
                  </div>

                  <div className="w-16" />
                </div>

                {/* Live Syntax Highlighted Code Body */}
                <div
                  className="p-4 sm:p-5 font-mono leading-relaxed select-none overflow-x-auto"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${lineHeight}px`,
                    fontFamily:
                      "'Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace",
                  }}
                >
                  {tokenizedLines.map((lineTokens, lineIdx) => (
                    <div key={lineIdx} className="flex gap-3.5">
                      {showLineNumbers && (
                        <span
                          className="w-6 text-right text-slate-600 select-none shrink-0 font-mono"
                          style={{ fontSize: `${fontSize - 1.5}px` }}
                        >
                          {lineIdx + 1}
                        </span>
                      )}
                      <span className="whitespace-pre">
                        {lineTokens.length === 0 ? (
                          ' '
                        ) : (
                          lineTokens.map((tok, tokIdx) => (
                            <span
                              key={tokIdx}
                              style={{ color: getTokenColor(tok.type, tok.text) }}
                            >
                              {tok.text}
                            </span>
                          ))
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Watermark Footer */}
                {showWatermark && (
                  <div className="px-4 py-2 bg-[#181818]/60 border-t border-[#282828] flex items-center justify-end text-[10.5px]">
                    <span className="font-semibold text-orange-400 flex items-center gap-1 tracking-wide font-sans">
                      ⚡ MSK Code Playground • mskinstitute.in
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. MODAL FOOTER ACTIONS */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#232428] border-t border-[#333]">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden sm:inline">Export:</span>
            <span className="px-1.5 py-0.5 bg-[#2d2d30] text-slate-300 font-mono rounded text-[10.5px]">
              {dimensions.outerW * resolution} x {dimensions.outerH * resolution}px ({resolution}x)
            </span>
            <span className="hidden md:inline">• Editor Ratio: {dimensions.effectiveRatio}</span>
            <span className="hidden lg:inline">• {tokenizedLines.length} lines</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Image Button */}
            <button
              type="button"
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2d2e33] hover:bg-[#383a40] text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-[#40434a]"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopying ? 'Copying...' : 'Copy Image'}</span>
                </>
              )}
            </button>

            {/* Download PNG Button */}
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : `Download ${resolution}x PNG`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { usePwa } from '@/context/PwaContext';
import {
  X,
  Download,
  Laptop,
  Smartphone,
  Apple,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Monitor,
  Check,
} from 'lucide-react';
import Image from 'next/image';

export default function InstallAppModal() {
  const {
    isInstallModalOpen,
    closeInstallModal,
    installApp,
    isNativePromptAvailable,
    isInstalling,
    isIOS,
  } = usePwa();

  const [activeTab, setActiveTab] = useState<'desktop' | 'android' | 'ios'>('desktop');

  // Auto-detect user platform
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveTab('ios');
    } else if (/android/.test(ua)) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isInstallModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeInstallModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInstallModalOpen, closeInstallModal]);

  if (!isInstallModalOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={closeInstallModal}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-border-subtle overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-primary via-[#0E355A] to-primary p-6 text-white relative">
          <button
            onClick={closeInstallModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-md flex-shrink-0 border-2 border-white/20">
              <Image
                src="/logo.jpg"
                alt="MSK Institute Logo"
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="install-modal-title" className="text-xl font-extrabold text-white">
                  Install MSK Institute App
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3 h-3" />
                  Official App
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Install as a dedicated desktop or mobile application (standalone window, no browser tabs)
              </p>
            </div>
          </div>

          {/* Benefits pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/15 text-[11px] font-semibold text-blue-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
              <span>Full App Window</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Offline Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>No Browser Tabs</span>
            </div>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="p-6 space-y-5">
          <div className="flex rounded-xl bg-surface p-1 border border-border-subtle">
            <button
              onClick={() => setActiveTab('desktop')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'desktop'
                  ? 'bg-white text-primary shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop (PC/Mac)</span>
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'android'
                  ? 'bg-white text-primary shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ios'
                  ? 'bg-white text-primary shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone / iPad</span>
            </button>
          </div>

          {/* Tab Content: Desktop */}
          {activeTab === 'desktop' && (
            <div className="space-y-3.5 text-xs text-text-main">
              <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Quickest: Address Bar Install Icon
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Look at the right end of your Chrome or Edge address bar (URL bar). Click the{' '}
                    <strong className="text-primary">Install App</strong> icon (🖥️ or ⬇️ or ⊕) and select{' '}
                    <strong className="text-secondary">&ldquo;Install&rdquo;</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Or via Browser Menu (⋮)
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Click the <strong className="text-primary">three dots (⋮)</strong> in Chrome/Edge ➔ select{' '}
                    <strong className="text-secondary">&ldquo;Install MSK Institute...&rdquo;</strong> ➔ click{' '}
                    <strong>Install</strong>.
                  </p>
                </div>
              </div>

              {/* Crucial Note to prevent browser shortcut */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex gap-3 items-start">
                <div className="p-1 rounded-lg bg-amber-500 text-white flex-shrink-0 mt-0.5">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">
                    Important: To Install as an App (Not a Webpage Shortcut)
                  </p>
                  <p className="text-amber-800/90 leading-relaxed text-[11px]">
                    If you use <em>&ldquo;Save and share ➔ Create shortcut...&rdquo;</em>, remember to{' '}
                    <strong className="underline decoration-amber-600">check the box: ☑ &ldquo;Open as window&rdquo;</strong>.
                    This guarantees it runs as a dedicated desktop application without browser tabs or address bar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Android */}
          {activeTab === 'android' && (
            <div className="space-y-3.5 text-xs text-text-main">
              <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Open Chrome Menu (⋮)
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Tap the <strong className="text-primary">three dots (⋮)</strong> in the top-right corner of Google Chrome.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Select &ldquo;Install App&rdquo;
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Tap <strong className="text-secondary">&ldquo;Install app&rdquo;</strong> (or &ldquo;Add to Home screen&rdquo;).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Tap &ldquo;Install&rdquo;
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Chrome will download the verified <strong>WebAPK</strong> application and place the MSK Institute icon directly in your phone&apos;s app drawer!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: iOS Safari */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5 text-xs text-text-main">
              <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Tap the Share Button (⎕↑)
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    In Safari, tap the <strong className="text-primary">Share icon</strong> at the bottom bar (box with an arrow pointing up).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Select &ldquo;Add to Home Screen&rdquo; (➕)
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Scroll down the options list and tap <strong className="text-secondary">&ldquo;Add to Home Screen&rdquo;</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">
                    Tap &ldquo;Add&rdquo;
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    Tap <strong>Add</strong> in the top-right corner. The app will launch in standalone fullscreen app mode!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => installApp()}
              disabled={isInstalling}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-secondary hover:bg-secondary-light text-white font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              <span>
                {isNativePromptAvailable
                  ? 'Install App Directly'
                  : 'Try Automatic Install'}
              </span>
            </button>
            <button
              onClick={closeInstallModal}
              className="py-3 px-5 border border-border-subtle hover:bg-surface text-text-muted font-bold rounded-xl transition-colors text-xs sm:text-sm cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

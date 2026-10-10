'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, ExternalLink, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { SupportedLanguage } from './types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  code: string;
  filename?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  language,
  code,
  filename,
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    try {
      // Safe UTF-8 Base64 encoding for code
      const base64Code = btoa(unescape(encodeURIComponent(code)));
      const url = new URL('/playground', window.location.origin);
      url.hash = `lang=${encodeURIComponent(language)}&code=${encodeURIComponent(base64Code)}`;
      setShareUrl(url.toString());
    } catch {
      // Fallback to direct URI encoding if btoa fails on unexpected characters
      const url = new URL('/playground', window.location.origin);
      url.hash = `lang=${encodeURIComponent(language)}&code=${encodeURIComponent(code)}`;
      setShareUrl(url.toString());
    }
  }, [isOpen, language, code]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Shareable link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#1e1e1e] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#252526] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Share Code</h2>
              <p className="text-[11px] text-slate-400">
                Share {filename || 'your code'} via Link or QR Code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center gap-5">
          {/* QR Code Container */}
          <div className="p-3.5 bg-white rounded-xl shadow-md border-4 border-slate-800 flex flex-col items-center">
            {shareUrl ? (
              <QRCodeSVG
                value={shareUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            ) : (
              <div className="w-[180px] h-[180px] flex items-center justify-center text-slate-400">
                <QrCode className="w-12 h-12 animate-pulse text-secondary" />
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 text-center">
            📱 Scan with any phone camera to open in mobile playground
          </span>

          {/* Shareable Link Input & Copy */}
          <div className="w-full space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">
              Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-[#141414] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary-light active:scale-95 text-white font-bold rounded-lg text-xs transition-all cursor-pointer shadow-xs shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 capitalize">
              Language: <strong className="text-white">{language}</strong>
            </span>
            {shareUrl && (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-secondary hover:underline text-[11px] font-semibold"
              >
                <span>Open in new tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

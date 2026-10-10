'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface WebShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'icon' | 'button' | 'compact' | 'pill';
  label?: string;
  className?: string;
}

export default function WebShareButton({
  title = 'MSK Institute - Computer Training & Coding Academy',
  text = 'Learn Python, Full-Stack Web Development, and Computer Courses in Shikohabad.',
  url,
  variant = 'button',
  label = 'Share',
  className = '',
}: WebShareButtonProps) {
  const [copied, setCopied] = useState(false);

  // Helper to ensure valid absolute URL for Web Share API & clipboard
  const getAbsoluteShareUrl = () => {
    if (typeof window !== 'undefined') {
      if (!url) return window.location.href;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (url.startsWith('/')) return `${window.location.origin}${url}`;
      if (url.startsWith('#')) return `${window.location.origin}${window.location.pathname}${url}`;
      return `${window.location.origin}/${url}`;
    }
    if (!url) return 'https://www.mskinstitute.in';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://www.mskinstitute.in${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        return true;
      }
    } catch {
      // Continue to fallback
    }

    // Fallback using temporary textarea
    try {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = getAbsoluteShareUrl();

    // Try Web Share API first (supported on modern mobile browsers)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        // If user cancelled or dismissed share sheet, do not show error
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: Copy absolute URL to clipboard
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast.success('Link copied to clipboard!', { icon: '📋' });
      setTimeout(() => setCopied(false), 2200);
    } else {
      toast.error('Could not copy link to clipboard.');
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center p-2 rounded-xl border border-border-subtle bg-white hover:bg-surface text-text-muted hover:text-primary transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0 ${className}`}
        aria-label={label}
        title={label}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-white hover:bg-surface text-xs font-semibold text-text-muted hover:text-primary transition-all active:scale-95 touch-manipulation cursor-pointer shadow-2xs ${className}`}
        aria-label={label}
        title={label}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied!' : label}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-xs font-bold transition-all active:scale-95 touch-manipulation cursor-pointer ${className}`}
        aria-label={label}
        title={label}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Link Copied!' : label}</span>
      </button>
    );
  }

  // Default 'button' variant
  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-subtle bg-white hover:bg-surface text-primary font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 touch-manipulation cursor-pointer ${className}`}
      aria-label={label}
      title={label}
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      <span>{copied ? 'Link Copied!' : label}</span>
    </button>
  );
}

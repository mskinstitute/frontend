'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { HeadingItem } from '@/lib/markdown';

interface TutorialOnThisPageProps {
  headings: HeadingItem[];
}

export default function TutorialOnThisPage({ headings }: TutorialOnThisPageProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0 select-none pl-6 border-l border-border-subtle/80">
      <div className="sticky top-24 space-y-3 max-h-[80vh] overflow-y-auto pr-2 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted">
          <List className="w-3.5 h-3.5 text-secondary" />
          <span>On This Page</span>
        </div>

        <nav className="space-y-1 text-xs">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => scrollToSection(e, h.id)}
                className={`block py-1 pl-2.5 transition-colors leading-normal truncate ${
                  h.level === 3 ? 'ml-2 text-[11px]' : ''
                } ${
                  isActive
                    ? 'border-l-2 border-l-secondary text-secondary font-bold pl-2 bg-orange-50/50 rounded-r'
                    : 'border-l-2 border-l-transparent text-text-muted hover:text-primary hover:border-slate-300'
                }`}
              >
                {h.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

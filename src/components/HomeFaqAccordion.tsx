'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export default function HomeFaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-primary hover:text-secondary transition-colors cursor-pointer gap-4"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-black flex-shrink-0">
                  Q
                </span>
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? 'rotate-180 text-secondary' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border-subtle/50 home-faq-answer">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { HelpCircle } from 'lucide-react';
import { BranchFaq, Branch } from '@/types';

interface BranchFaqsProps {
  faqs: BranchFaq[];
  branch: Branch;
}

export default function BranchFaqs({ faqs, branch }: BranchFaqsProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 bg-surface border-t border-border-subtle">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-wider">
            Helpful Information
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
            Frequently Asked Questions — {branch.city}
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Common questions regarding offline admissions, student facilities, and course certifications at our {branch.city} campus.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background-alt p-6 rounded-2xl border border-border-subtle hover:border-secondary/40 transition-colors"
            >
              <h3 className="text-base font-bold text-text-primary flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-sm text-text-secondary mt-2.5 pl-7 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

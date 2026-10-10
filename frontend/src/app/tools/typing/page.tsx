import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TypeQuestApp from '@/features/typequest';

export const metadata: Metadata = {
  title: 'TypeQuest by MSK - Advanced Touch Typing & Code Typing Master | MSK Institute',
  description:
    'Master touch typing from beginner to expert with TypeQuest by MSK. Interactive home-row academy, real Python & JavaScript code typing drills, live WPM tracking, virtual keyboard, and instant audio feedback.',
  keywords: [
    'Typing Master Online',
    'Touch Typing Practice',
    'Code Typing Test',
    'Developer Typing Speed',
    'MSK Institute Typing Tool',
    'TypeQuest by MSK',
    'Free Typing Test India',
    'Keyboard Speed Test',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/tools/typing',
  },
};

export default function TypingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="border-b border-slate-900 bg-slate-950/90 px-4 py-3 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-secondary font-semibold">TypeQuest</span>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Tools</span>
          </Link>
        </div>
      </div>

      {/* Main Typing Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="w-full min-h-[600px] bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <span className="text-xs font-mono">Initializing TypeQuest Engine...</span>
            </div>
          }
        >
          <TypeQuestApp />
        </Suspense>
      </main>
    </div>
  );
}

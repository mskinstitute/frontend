import Link from 'next/link';
import { Home, BookOpen, FileText, Code2, Keyboard, PhoneCall, ArrowLeft, Search } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found (404) | MSK Institute',
  description: 'The requested page could not be found. Explore our programming courses, free coding tutorials, or contact MSK Institute in Shikohabad.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    { title: 'All Courses', href: '/courses', desc: 'Python, Web Dev, CCC & ADCA', icon: BookOpen },
    { title: 'Free Tutorials', href: '/study-material', desc: '1,600+ interactive lessons', icon: FileText },
    { title: 'Code Playground', href: '/playground', desc: 'Online multi-language compiler', icon: Code2 },
    { title: 'TypeQuest Typing', href: '/tools/typing', desc: 'Developer speed typing arena', icon: Keyboard },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
          Error 404
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight">
            Page Not Found
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            The link you followed may be broken, or the page may have been moved to our updated curriculum.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex items-start gap-3 p-4 rounded-xl border border-border-subtle bg-white hover:border-secondary/50 hover:shadow-sm transition-all group"
              >
                <div className="p-2 rounded-lg bg-surface text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border-subtle">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
          <a
            href="https://wa.me/918393042166?text=Hi%20MSK%20Institute,%20I%20was%20looking%20for%20a%20page%20on%20your%20website%20that%20seems%20missing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle hover:bg-surface text-primary font-bold text-sm rounded-xl transition-all"
          >
            <PhoneCall className="w-4 h-4 text-secondary" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}

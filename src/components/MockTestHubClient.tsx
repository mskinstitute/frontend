'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Award, Clock, BookOpen, CheckCircle2, 
  ArrowRight, Sparkles, Filter, ShieldCheck, Flame, Laptop
} from 'lucide-react';
import { Course } from '@/types';

interface MockTestHubClientProps {
  courses: Course[];
}

export default function MockTestHubClient({ courses }: MockTestHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Top featured exams with curated badges
  const featuredExams = [
    {
      slug: 'ccc',
      title: 'NIELIT CCC (Course on Computer Concepts)',
      badge: 'Most Popular for UP Govt Jobs',
      category: 'Govt Certification',
      questions: 20,
      duration: 25,
      href: '/mock-test/ccc',
      desc: 'Bilingual (Hindi/English) official pattern questions on LibreOffice, Internet, and Cyber Security with instant scorecard.',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      badgeColor: 'bg-amber-500/15 text-amber-700',
    },
    {
      slug: 'python-mastery-beginner-to-advanced--3-months',
      title: 'Python Programming Mastery',
      badge: 'Software Development',
      category: 'Programming',
      questions: 15,
      duration: 20,
      href: '/mock-test/python-mastery-beginner-to-advanced--3-months',
      desc: 'OOP, data types, list comprehensions, lambda functions, and real syntax debugging test.',
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-500/30',
      badgeColor: 'bg-blue-500/15 text-blue-700',
    },
    {
      slug: 'full-stack-web-dev-bootcamp',
      title: 'Full-Stack Web Dev (MERN Stack)',
      badge: 'High Salary Career',
      category: 'Web Dev',
      questions: 15,
      duration: 20,
      href: '/mock-test/full-stack-web-dev-bootcamp',
      desc: 'React.js, Node.js, Express, MongoDB, RESTful APIs, and frontend state management assessment.',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'bg-emerald-500/15 text-emerald-700',
    },
    {
      slug: 'adca',
      title: 'ADCA (Advance Diploma in Computer Applications)',
      badge: '1-Year Diploma',
      category: 'Office & Accounting',
      questions: 15,
      duration: 20,
      href: '/mock-test/adca',
      desc: 'MS Office, Advanced Excel VLOOKUP, Tally Prime accounting, Photoshop, and networking questions.',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30',
      badgeColor: 'bg-purple-500/15 text-purple-700',
    },
    {
      slug: 'sql-mysql-mastery-beginner-to-advanced--3-months',
      title: 'SQL & MySQL Database Mastery',
      badge: 'Data & Backend',
      category: 'Database',
      questions: 15,
      duration: 20,
      href: '/mock-test/sql-mysql-mastery-beginner-to-advanced--3-months',
      desc: 'SELECT queries, INNER/LEFT JOINs, GROUP BY, aggregations, primary/foreign keys, and ACID properties.',
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30',
      badgeColor: 'bg-cyan-500/15 text-cyan-700',
    },
    {
      slug: 'html5-complete-course',
      title: 'HTML5 Complete Course',
      badge: 'Web Fundamentals',
      category: 'Frontend',
      questions: 15,
      duration: 20,
      href: '/mock-test/html5-complete-course',
      desc: 'Semantic HTML5 tags, accessibility attributes, forms, and SEO meta structure assessment.',
      gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
      borderColor: 'border-orange-500/30',
      badgeColor: 'bg-orange-500/15 text-orange-700',
    },
  ];

  // Dynamic Categories from catalog
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      (c.categories || []).forEach((cat) => set.add(cat));
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return courses.filter((c) => {
      const matchesSearch = 
        !q || 
        c.title.toLowerCase().includes(q) || 
        (c.shortDescription && c.shortDescription.toLowerCase().includes(q)) ||
        (c.categories && c.categories.some((cat) => cat.toLowerCase().includes(q)));

      const matchesCat = 
        selectedCategory === 'ALL' || 
        (c.categories && c.categories.includes(selectedCategory));

      return matchesSearch && matchesCat;
    });
  }, [courses, searchQuery, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Featured Exams Hero Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border-subtle pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-secondary tracking-wider uppercase">
              <Flame className="w-4 h-4 fill-secondary text-secondary" />
              Highest Demand Skill Tests
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary mt-1">
              Top Featured Mock Exams
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Timed tests with instant grade certificates & WhatsApp score sharing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredExams.map((exam) => (
            <div
              key={exam.slug}
              className={`relative bg-linear-to-b ${exam.gradient} bg-white rounded-3xl border ${exam.borderColor} p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${exam.badgeColor}`}>
                    {exam.badge}
                  </span>
                  <span className="text-[11px] font-bold text-text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    {exam.duration} Mins
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-primary group-hover:text-secondary transition-colors">
                    <Link href={exam.href} className="focus:outline-hidden">
                      {exam.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {exam.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-text-muted pt-2 border-t border-border-subtle/60">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    {exam.questions} Questions
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Grading S/A/B/C/D
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={exam.href}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <span>Start Mock Test</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Category Filter Toolbar */}
      <section className="bg-surface/60 rounded-3xl border border-border-subtle p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course mock test (e.g. Python, Excel, Tally)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-text-muted flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <span>
              Showing <strong className="text-primary">{filteredCourses.length}</strong> of{' '}
              {courses.length} Course Tests
            </span>
          </div>
        </div>

        {/* Categories Chips */}
        {categoriesList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-extrabold text-text-muted uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categoriesList.slice(0, 8).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-secondary text-white shadow-xs'
                    : 'bg-white border border-border-subtle text-text-muted hover:text-primary hover:border-text-muted/40'
                }`}
              >
                {cat === 'ALL' ? 'All Courses' : cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Complete Course Mock Tests Grid */}
      <section className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-border-subtle space-y-4">
            <Laptop className="w-12 h-12 text-text-muted mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-primary">
                No mock test found matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-text-muted">
                Try searching for broader keywords like &ldquo;Web&rdquo;, &ldquo;Python&rdquo;, or &ldquo;Excel&rdquo;.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary-light transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => {
              // Special case: CCC points to /mock-test/ccc
              const testLink = c.slug === 'ccc' ? '/mock-test/ccc' : `/mock-test/${c.slug}`;

              return (
                <div
                  key={c.id || c.slug}
                  className="bg-white rounded-2xl border border-border-subtle hover:border-secondary/40 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-surface text-secondary border border-border-subtle uppercase tracking-wider">
                        {c.categories?.[0] || 'Certification'}
                      </span>
                      <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-secondary" />
                        20 Mins
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                        <Link href={testLink}>
                          {c.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {c.shortDescription || `Evaluate your practical knowledge in ${c.title} with timed questions and instant score review.`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-text-muted pt-2 border-t border-border-subtle/50">
                      <span>15 Timed Questions</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">50% Pass</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <Link
                      href={testLink}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white rounded-xl font-bold text-xs transition-colors"
                    >
                      <span>Take Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/courses/${c.slug}`}
                      className="p-2.5 rounded-xl border border-border-subtle hover:bg-surface text-text-muted hover:text-primary transition-colors text-xs font-semibold"
                      title="View Course Syllabus"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Take MSK Mock Tests Guidance */}
      <section className="bg-surface/60 rounded-3xl border border-border-subtle p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-secondary uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Exam Simulator Benefits
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Why Practice with MSK Institute Mock Tests?
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Engineered to simulate real test conditions and give actionable diagnostic feedback before final exams or corporate interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Real Countdown Timer</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Experience the time pressure of real IT certifications and competitive exams.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Instant Scorecard</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Automatic grading across Grades S, A, B, C, D, and Fail with granular topic breakdown.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Code Snippets & Answers</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Review correct answers with in-depth technical explanations and code syntax traces.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">1-Click WhatsApp Share</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Share your score on WhatsApp status and challenge classmates to beat your result.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

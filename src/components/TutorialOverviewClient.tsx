'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { TutorialItem, Course } from '@/types';
import TutorialSidebar from '@/components/TutorialSidebar';

interface TutorialOverviewClientProps {
  tutorial: TutorialItem;
  course: Course;
}

export default function TutorialOverviewClient({
  tutorial,
  course,
}: TutorialOverviewClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    try {
      const completedKey = `completed_${tutorial.slug}`;
      const list = JSON.parse(localStorage.getItem(completedKey) || '[]');
      if (Array.isArray(list)) setCompletedTopics(list);
    } catch {}
  }, [tutorial.slug]);

  // Sort chapters & topics deterministically
  const sortedChapters = [...(course.chapters || [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((ch) => ({
      ...ch,
      topics: [...(ch.topics || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }));

  // Find the first topic to start learning
  const firstTopic = sortedChapters[0]?.topics?.[0];
  const firstTopicSlug =
    (firstTopic as any)?.slug ||
    firstTopic?.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') ||
    'introduction';

  // Total topics
  const totalTopics = sortedChapters.reduce((acc, ch) => acc + ch.topics.length, 0) || tutorial.topicsCount || 48;
  const isPythonTrack = tutorial.slug.startsWith('python-for-');
  const isDataAnalysisTrack =
    tutorial.slug === 'numpy-complete-course' ||
    tutorial.slug === 'pandas-complete-course' ||
    tutorial.slug === 'data-analysis--visualization--statistics' ||
    tutorial.slug === 'tableau-for-beginners' ||
    tutorial.slug === 'data-analysis--advanced-pandas--ml-basics' ||
    tutorial.slug.startsWith('power-bi-for-');

  const cheatsheetHref = isPythonTrack
    ? '/study-material?id=cheat-python-beginners&type=cheatsheet'
    : tutorial.slug === 'pandas-complete-course' ||
      tutorial.slug === 'numpy-complete-course' ||
      tutorial.slug.startsWith('data-analysis--')
    ? '/study-material?id=cheat-pandas-data-science&type=cheatsheet'
    : tutorial.slug.startsWith('power-bi-for-')
    ? '/study-material?id=cheat-power-bi-dax-modeling&type=cheatsheet'
    : tutorial.slug.startsWith('sql-for-')
    ? '/study-material?id=cheat-sql-data-analytics&type=cheatsheet'
    : tutorial.slug.startsWith('ms-excel-for-')
    ? '/study-material?id=cheat-excel-top50&type=cheatsheet'
    : tutorial.slug === 'html5-complete-course'
    ? '/study-material?id=cheat-html5-complete&type=cheatsheet'
    : '/study-material?type=cheatsheet';

  const parentCourseHref = isPythonTrack
    ? '/courses/python-mastery'
    : isDataAnalysisTrack
    ? '/courses/data-analysis-mastery-combo-course--12-months'
    : `/courses/${tutorial.courseSlug}`;

  const parentCourseLabel = isPythonTrack
    ? 'Full 3-Month Python Mastery Course'
    : isDataAnalysisTrack
    ? 'Full 12-Month Data Analysis Mastery'
    : 'View Live Course & Demo';

  const estimatedTimeLabel =
    tutorial.totalHours ||
    (course.duration?.value ? `${course.duration.value} ${course.duration.unit}` : '40 Hours');

  // Icon
  const renderIcon = () => {
    if (tutorial.icon === 'python' || tutorial.title?.toLowerCase().includes('python')) {
      return (
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.016 2.008c-3.13 0-5.016 1.34-5.016 3.793v2.85h5.016v.95H4.258C2.106 9.601 1 11.238 1 13.791c0 2.68 1.488 4.209 4.148 4.209h2.383v-3.082c0-2.453 1.886-3.793 5.016-3.793h4.945v-.95h-7.328V8.65h7.328V5.801c0-2.453-1.886-3.793-5.016-3.793h-.46zm-1.886 1.9a.95.95 0 110 1.9.95.95 0 010-1.9zm1.886 18.084c3.13 0 5.016-1.34 5.016-3.793v-2.85h-5.016v-.95h7.758c2.152 0 3.258-1.637 3.258-4.19 0-2.68-1.488-4.209-4.148-4.209h-2.383v3.082c0 2.453-1.886 3.793-5.016 3.793H6.54v.95h7.328v1.525H6.54v2.85c0 2.453 1.886 3.792 5.016 3.792h.46zm1.886-1.9a.95.95 0 110-1.9.95.95 0 010 1.9z" />
          </svg>
        </div>
      );
    }
    if (tutorial.icon === 'html' || tutorial.title?.toLowerCase().includes('html')) {
      return (
        <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#E34F26] shadow-sm">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.5 0h21l-1.91 21.463L11.977 24l-8.564-2.538L1.5 0zm7.031 9.75l-.232-2.718 10.059-.001.237-2.67H5.281l.707 8.059h9.387l-.312 3.493-3.086.833-3.084-.834-.197-2.213H6.18l.386 4.346 5.411 1.502 5.405-1.502.736-8.309H8.531z" />
          </svg>
        </div>
      );
    }
    if (tutorial.icon === 'c' || tutorial.title?.toLowerCase() === 'c' || tutorial.title?.toLowerCase().includes('c programming')) {
      return (
        <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-sm font-mono font-black text-2xl">
          C
        </div>
      );
    }
    if (tutorial.icon === 'cpp' || tutorial.icon === 'c++' || tutorial.title?.toLowerCase().includes('c++')) {
      return (
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-sm font-mono font-black text-2xl">
          C++
        </div>
      );
    }
    if (tutorial.icon === 'java' || tutorial.title?.toLowerCase().includes('java')) {
      return (
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-sm font-mono font-black text-2xl">
          Java
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center text-secondary shadow-sm">
        <BookOpen className="w-8 h-8" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden p-3 border-b border-border-subtle bg-surface flex items-center justify-between">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border-subtle rounded-xl text-xs font-bold text-primary shadow-2xs"
        >
          <Menu className="w-4 h-4 text-secondary" />
          Course Curriculum
        </button>

        <span className="text-xs font-bold text-text-muted">
          {tutorial.documentationTitle || `${tutorial.title} Documentation`}
        </span>
      </div>

      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
          <TutorialSidebar
            tutorialSlug={tutorial.slug}
            tutorialTitle={tutorial.title || course.title}
            chapters={course.chapters || []}
            completedTopics={completedTopics}
          />
        </div>

        {/* Mobile Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
              <TutorialSidebar
                tutorialSlug={tutorial.slug}
                tutorialTitle={tutorial.title || course.title}
                chapters={course.chapters || []}
                completedTopics={completedTopics}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-14 space-y-10 max-w-5xl">
          {/* Hero Overview */}
          <div className="space-y-6">
            {/* Logo Box */}
            {renderIcon()}

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">
                {tutorial.badge || 'Beginner'}
              </span>
              {tutorial.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-surface text-text-muted border border-border-subtle text-xs font-semibold rounded-lg lowercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-primary tracking-tight">
                {tutorial.documentationTitle || `${tutorial.title} Documentation`}
              </h1>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed font-medium">
                {tutorial.shortDescription || course.shortDescription}
              </p>
            </div>

            {/* Key Metrics Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted pt-1">
              <span className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-secondary" />
                ~{estimatedTimeLabel}
              </span>
              <span className="flex items-center gap-2 font-medium">
                <BookOpen className="w-4 h-4 text-secondary" />
                {sortedChapters.length || tutorial.lessonsCount || 9} Chapters
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Layers className="w-4 h-4 text-secondary" />
                {totalTopics} Structured Topics
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mentored by Er. Sumit Kumar
              </span>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href={`/tutorials/${tutorial.slug}/${firstTopicSlug}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-secondary hover:bg-secondary-light text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href={cheatsheetHref}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                title="Open quick syntax revision cheatsheet"
              >
                <Layers className="w-5 h-5 text-purple-600" />
                Quick Cheatsheet
              </Link>

              <Link
                href={parentCourseHref}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-primary hover:bg-primary-light text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                {parentCourseLabel}
              </Link>
            </div>
          </div>

          {/* Data Analysis Mastery Track Navigator */}
          {isDataAnalysisTrack && (
            <section className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-primary">
                    Part of the 12-Month Data Analysis Mastery Curriculum
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted">
                    15 integrated courses, 150 chapters, and 541 topics covering Excel, SQL, Python, NumPy, Pandas, Statistics, Power BI, Tableau & ML.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/tools/sql-studio"
                    className="text-xs font-bold text-primary hover:text-secondary hover:underline whitespace-nowrap"
                  >
                    SQL Studio &rarr;
                  </Link>
                  <Link
                    href="/mock-test/data-analysis-mastery-combo-course--12-months"
                    className="text-xs font-bold text-secondary hover:underline whitespace-nowrap"
                  >
                    Free Mock Test &rarr;
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { slug: 'numpy-complete-course', stage: 'Python Data Stack', title: 'NumPy Scientific Computing', meta: '12 Chapters • 36 Topics' },
                  { slug: 'pandas-complete-course', stage: 'Python Data Stack', title: 'Pandas Wrangling & EDA', meta: '8 Chapters • 24 Topics' },
                  { slug: 'data-analysis--visualization--statistics', stage: 'Stats & Viz', title: 'Visualization & Statistics', meta: '6 Chapters • 23 Topics' },
                  { slug: 'power-bi-for-beginners', stage: 'Business Intelligence', title: 'Power BI (Beginner–Adv)', meta: '31 Chapters • 91 Topics' },
                  { slug: 'tableau-for-beginners', stage: 'Business Intelligence', title: 'Tableau Desktop', meta: '5 Chapters • 18 Topics' },
                  { slug: 'data-analysis--advanced-pandas--ml-basics', stage: 'ML & Capstones', title: 'Advanced Pandas & ML', meta: '6 Chapters • 20 Topics' },
                ].map((mod) => {
                  const isCurrent =
                    tutorial.slug === mod.slug ||
                    (mod.slug === 'power-bi-for-beginners' && tutorial.slug.startsWith('power-bi-for-'));
                  return (
                    <Link
                      key={mod.slug}
                      href={`/tutorials/${mod.slug}`}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-white border-secondary ring-1 ring-secondary/20 shadow-xs'
                          : 'bg-white/70 border-border-subtle hover:border-secondary/50 hover:bg-white'
                      }`}
                    >
                      <div className="text-[11px] font-black uppercase tracking-wider text-secondary">
                        {mod.stage} {isCurrent ? '• Current' : ''}
                      </div>
                      <div className="font-bold text-sm text-primary mt-0.5">{mod.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{mod.meta}</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Python Mastery 3-Level Progression Navigator */}
          {isPythonTrack && (
            <section className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-primary">
                    Part of the 3-Month Python Mastery Curriculum
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted">
                    Follow all three progressive tiers in sequence—46 chapters, 236 practical topics, and 14 portfolio projects.
                  </p>
                </div>
                <Link
                  href="/mock-test/python-mastery"
                  className="text-xs font-bold text-secondary hover:underline whitespace-nowrap"
                >
                  Take Free Python Mock Test &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    slug: 'python-for-beginners',
                    level: 'Level 1 • Month 1',
                    title: 'Python for Beginners',
                    meta: '16 Chapters • 90 Topics',
                  },
                  {
                    slug: 'python-for-intermediate',
                    level: 'Level 2 • Month 2',
                    title: 'Python for Intermediate',
                    meta: '15 Chapters • 76 Topics',
                  },
                  {
                    slug: 'python-for-advanced',
                    level: 'Level 3 • Month 3',
                    title: 'Python for Advanced',
                    meta: '15 Chapters • 70 Topics',
                  },
                ].map((tier) => {
                  const isCurrent = tutorial.slug === tier.slug;
                  return (
                    <Link
                      key={tier.slug}
                      href={`/tutorials/${tier.slug}`}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-white border-secondary ring-1 ring-secondary/20 shadow-xs'
                          : 'bg-white/70 border-border-subtle hover:border-secondary/50 hover:bg-white'
                      }`}
                    >
                      <div className="text-[11px] font-black uppercase tracking-wider text-secondary">
                        {tier.level} {isCurrent ? '• Current' : ''}
                      </div>
                      <div className="font-bold text-sm text-primary mt-0.5">{tier.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{tier.meta}</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Full Crawlable Chapter-by-Chapter Lesson Directory */}
          {sortedChapters.length > 0 && (
            <section className="space-y-5 pt-4 border-t border-border-subtle">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary">
                    Complete Chapter-by-Chapter Curriculum
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mt-1">
                    Jump directly into any lesson below. Every topic includes runnable code examples and self-check practice quizzes.
                  </p>
                </div>
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-lg w-fit">
                  {sortedChapters.length} Chapters • {totalTopics} Lessons
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedChapters.map((chapter, chIdx) => (
                  <div
                    key={chapter.id}
                    className="rounded-2xl border border-border-subtle bg-white p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border-subtle/70 pb-2.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-primary">
                        {chapter.title.replace(/^\d+:\s*/, `${chIdx + 1}. `)}
                      </h3>
                      <span className="text-[11px] font-bold text-text-muted bg-surface px-2 py-0.5 rounded shrink-0">
                        {chapter.topics.length} topics
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {chapter.topics.map((topic, tIdx) => {
                        const tSlug =
                          (topic as any).slug ||
                          topic.title
                            .toLowerCase()
                            .trim()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-');
                        const done = completedTopics.includes(tSlug);
                        return (
                          <li key={topic.id}>
                            <Link
                              href={`/tutorials/${tutorial.slug}/${tSlug}`}
                              className="group flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-secondary transition-colors py-0.5"
                            >
                              <span className="font-mono text-[11px] text-slate-400 group-hover:text-secondary shrink-0">
                                {chIdx + 1}.{tIdx + 1}
                              </span>
                              <span className={done ? 'text-emerald-700 font-semibold' : 'font-medium text-text-main group-hover:text-secondary'}>
                                {topic.title}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

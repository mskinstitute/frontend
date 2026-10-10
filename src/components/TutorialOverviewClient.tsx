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

  // Find the first topic to start learning
  const firstTopic = course.chapters?.[0]?.topics?.[0];
  const firstTopicSlug =
    (firstTopic as any)?.slug ||
    firstTopic?.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') ||
    'introduction';

  // Total topics
  const totalTopics = course.chapters?.reduce((acc, ch) => acc + ch.topics.length, 0) || tutorial.topicsCount || 48;

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

        {/* Main Content Area (Image 2) */}
        <main className="flex-1 min-w-0 p-6 sm:p-12 lg:p-16 space-y-8 flex flex-col justify-center max-w-4xl">
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
            <h1 className="text-4xl sm:text-6xl font-black text-primary tracking-tight">
              {tutorial.documentationTitle || `${tutorial.title} Documentation`}
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed font-medium">
              {tutorial.shortDescription || course.shortDescription}
            </p>
          </div>

          {/* Key Metrics Row (Image 2) */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted pt-2">
            <span className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-text-muted" />
              ~{tutorial.totalHours || course.duration?.value ? `${course.duration?.value} ${course.duration?.unit}` : '40 Hours'}
            </span>
            <span className="flex items-center gap-2 font-medium">
              <BookOpen className="w-4 h-4 text-text-muted" />
              {tutorial.lessonsCount || course.chapters?.length || 9} Lessons
            </span>
            <span className="flex items-center gap-2 font-medium">
              <Layers className="w-4 h-4 text-text-muted" />
              {totalTopics} Topics
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/tutorials/${tutorial.slug}/${firstTopicSlug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary-light text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href={
                tutorial.slug === 'python-for-beginners'
                  ? '/study-material?id=cheat-python-beginners&type=cheatsheet'
                  : tutorial.slug === 'html5-complete-course'
                  ? '/study-material?id=cheat-html5-complete&type=cheatsheet'
                  : '/study-material?type=cheatsheet'
              }
              className="inline-flex items-center gap-2 px-6 py-4 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              title="Open quick syntax revision cheatsheet"
            >
              <Layers className="w-5 h-5 text-purple-600" />
              Quick Cheatsheet
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}

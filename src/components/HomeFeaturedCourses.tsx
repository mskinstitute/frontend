'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles, BookOpen, Laptop, CheckCircle2, ChevronRight } from 'lucide-react';
import { Course } from '@/types';

interface HomeFeaturedCoursesProps {
  courses: Course[];
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Programs' },
  { id: 'coding', label: 'Coding & Web Dev' },
  { id: 'nielit', label: 'NIELIT Govt (CCC)' },
  { id: 'diploma', label: '1-Year Diplomas (ADCA)' },
];

export default function HomeFeaturedCourses({ courses }: HomeFeaturedCoursesProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCourses = courses.filter((course) => {
    if (activeTab === 'all') return true;
    const title = course.title.toLowerCase();
    const cats = course.categories.map((c) => c.toLowerCase());
    const slug = course.slug.toLowerCase();

    if (activeTab === 'coding') {
      return (
        title.includes('python') ||
        title.includes('web') ||
        title.includes('html') ||
        title.includes('mern') ||
        title.includes('javascript') ||
        cats.some((c) => c.includes('programming') || c.includes('web') || c.includes('developer'))
      );
    }

    if (activeTab === 'nielit') {
      return (
        title.includes('ccc') ||
        slug.includes('ccc') ||
        cats.some((c) => c.includes('literacy') || c.includes('digital') || c.includes('nielit'))
      );
    }

    if (activeTab === 'diploma') {
      return (
        title.includes('adca') ||
        title.includes('dca') ||
        title.includes('diploma') ||
        slug.includes('adca') ||
        course.duration.value >= 6
      );
    }

    return true;
  });

  // Display top courses for selected tab
  const displayCourses = filteredCourses.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface hover:bg-slate-100 text-text-muted hover:text-primary border border-border-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayCourses.map((course) => (
          <div
            key={course.id}
            className="group bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col hover:-translate-y-0.5"
          >
            {/* Thumbnail Header */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.featuredImageUrl}
                alt={`${course.title} at MSK Institute`}
                width={600}
                height={340}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

              <span className="absolute top-3.5 right-3.5 bg-primary/90 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-lg backdrop-blur-xs">
                {course.level}
              </span>

              {course.certificate && (
                <span className="absolute bottom-3 left-3 bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                  ★ Certified Course
                </span>
              )}
            </div>

            {/* Course Content */}
            <div className="p-6 flex-grow flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {course.categories.slice(0, 2).map((cat, i) => (
                    <span
                      key={i}
                      className="text-[10px] uppercase font-black text-[#B83A00] tracking-wider px-2 py-0.5 bg-[#B83A00]/10 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Course Title */}
                <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>
              </div>

              {/* Bottom Meta & Action */}
              <div className="space-y-3 pt-4 border-t border-border-subtle mt-auto">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1.5 font-bold text-primary">
                    <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    <span>
                      {course.duration.value} {course.duration.unit}
                    </span>
                  </span>
                  <span className="text-[10px] font-bold text-text-muted uppercase px-2 py-0.5 bg-surface border border-border-subtle rounded">
                    {course.mode === 'BOTH' ? 'Online & Offline Lab' : course.mode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="#book-demo"
                    className="text-center py-2 px-2 bg-surface hover:bg-slate-100 text-primary border border-border-subtle font-bold text-xs rounded-xl transition-colors block"
                  >
                    Free Demo
                  </a>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-center py-2 px-2 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors block"
                  >
                    View Syllabus ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore All Courses Link */}
      <div className="text-center pt-2">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle hover:bg-surface text-primary font-bold text-sm rounded-xl transition-colors shadow-2xs hover:shadow-xs"
        >
          <span>Explore All 12+ Professional Computer Courses</span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>
      </div>
    </div>
  );
}

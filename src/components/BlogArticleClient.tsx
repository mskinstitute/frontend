'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BlogPost, Course } from '@/types';
import WebShareButton from '@/components/WebShareButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface BlogArticleClientProps {
  blog: BlogPost;
  relatedCourses: Course[];
}

export default function BlogArticleClient({ blog, relatedCourses }: BlogArticleClientProps) {
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  const handleCopyCode = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => {
      setCopiedSnippetIndex(null);
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        })
        .catch(() => null);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>

        <WebShareButton
          title={`${blog.title} | MSK Institute`}
          text={blog.excerpt}
          variant="compact"
          label="Share Article"
        />
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-secondary text-white text-xs font-bold uppercase rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>
          <span className="text-xs text-text-muted">•</span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Published {blog.publishedAt}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary leading-tight">
          {blog.title}
        </h1>

        <p className="text-base sm:text-xl text-text-muted leading-relaxed font-medium">
          {blog.excerpt}
        </p>

        {/* Author Card */}
        <div className="flex items-center gap-3 p-3.5 bg-surface rounded-2xl border border-border-subtle w-fit mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            width={44}
            height={44}
            loading="eager"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
          />
          <div>
            <div className="font-bold text-sm text-primary">{blog.author.name}</div>
            <div className="text-xs text-text-muted">{blog.author.role}</div>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-md aspect-video relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blog.coverImage}
          alt={blog.title}
          width={1200}
          height={675}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="space-y-8 text-primary leading-relaxed text-base sm:text-lg">
        {typeof blog.content === 'string' ? (
          <div className="prose-container">
            <MarkdownRenderer content={blog.content} />
          </div>
        ) : (
          <>
            {blog.content.introduction && (
              <div className="bg-surface p-6 rounded-2xl border border-border-subtle text-text-muted text-base leading-relaxed italic">
                {blog.content.introduction}
              </div>
            )}

            {blog.content.sections?.map((section, idx) => (
              <section key={idx} className="space-y-4 pt-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  {section.heading}
                </h2>

                <p className="text-text-muted leading-relaxed text-base sm:text-lg">
                  {section.body}
                </p>

                {section.callout && (
                  <div className="bg-secondary/10 border-l-4 border-l-secondary p-4 rounded-r-xl text-sm font-medium text-primary">
                    {section.callout}
                  </div>
                )}

                {section.codeSnippet && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] my-4">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-800 text-xs text-slate-400">
                      <span>{section.codeLanguage || 'code'}</span>
                      <button
                        onClick={() => handleCopyCode(idx, section.codeSnippet || '')}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        aria-label="Copy code snippet"
                      >
                        {copiedSnippetIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{section.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}

            {blog.content.conclusion && (
              <div className="p-6 bg-primary text-white rounded-2xl space-y-2 mt-8">
                <h3 className="text-xl font-bold text-white">Summary & Next Steps</h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {blog.content.conclusion}
                </p>
              </div>
            )}
          </>
        )}

        {/* Tags */}
        <div className="pt-4 border-t border-border-subtle flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">Tags:</span>
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-surface text-text-muted rounded-lg text-xs font-medium border border-border-subtle"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related Recommended Courses */}
      {relatedCourses.length > 0 && (
        <div className="pt-10 border-t border-border-subtle space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Recommended Training Programs
            </div>
            <h3 className="text-2xl font-bold text-primary">Master These Skills in Our Offline Labs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-surface text-primary border border-border-subtle text-[11px] font-bold uppercase rounded-md">
                      {course.level}
                    </span>
                    <span className="text-xs font-bold text-secondary">
                      {course.duration.value} {course.duration.unit}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-primary">{course.title}</h4>
                  <p className="text-xs text-text-muted line-clamp-2">{course.shortDescription}</p>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Explore Course Curriculum
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, FileText, Calendar, ArrowRight, Sparkles, 
  MapPin, CheckCircle2, Award, Clock, Laptop 
} from 'lucide-react';
import { Course, LiveBatch } from '@/types';
import { getClusterForCourse } from '@/lib/topical-clusters';

interface CourseRelatedContentProps {
  course: Course;
  batches?: LiveBatch[];
}

export default function CourseRelatedContent({ course, batches = [] }: CourseRelatedContentProps) {
  const cluster = getClusterForCourse(course.slug, course.categories || []);

  if (!cluster) {
    return null;
  }

  // Filter live batches matching this course or cluster
  const matchingBatches = batches.filter(
    (b) =>
      b.courseSlug === course.slug ||
      b.title.toLowerCase().includes(course.title.toLowerCase().split(' ')[0]) ||
      (cluster.clusterId === 'python' && b.title.toLowerCase().includes('python')) ||
      (cluster.clusterId === 'web-development' && (b.title.toLowerCase().includes('mern') || b.title.toLowerCase().includes('web')))
  ).filter((b) => b.status === 'OPEN' || b.status === 'UPCOMING');

  return (
    <section className="mt-14 pt-12 border-t border-border-subtle space-y-10 no-print" aria-label="Related Learning Resources">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Topical Learning Ecosystem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
          Explore Related Tutorials, Career Guides & Live Batches
        </h2>
        <p className="text-text-muted text-sm max-w-3xl leading-relaxed">
          Complement your practical classroom training with chapter-by-chapter syntax notes, viva interview preparation questions, and active cohort schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Related Practical Tutorials */}
        {cluster.tutorialSlugs.length > 0 && (
          <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-primary font-bold text-base border-b border-border-subtle pb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span>Interactive Tutorials</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Step-by-step code lessons with browser playground practice and self-assessment quizzes:
              </p>
              <ul className="space-y-2 text-xs">
                {cluster.tutorialSlugs.slice(0, 4).map((tSlug) => (
                  <li key={tSlug}>
                    <Link
                      href={`/tutorials/${tSlug}`}
                      className="group flex items-center justify-between p-2 rounded-xl bg-surface hover:bg-secondary/10 transition-colors font-medium text-text-main hover:text-secondary"
                    >
                      <span className="capitalize line-clamp-1">{tSlug.replace(/-/g, ' ')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-secondary group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-border-subtle">
              <Link
                href="/study-material?type=tutorial"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-light transition-colors"
              >
                <span>Browse All Tutorial Series</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. Viva & Interview Questions Blogs */}
        {cluster.blogSlugs.length > 0 && (
          <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-primary font-bold text-base border-b border-border-subtle pb-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <span>Viva & Career Guides</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Exam preparation guides, technical interview roadmaps, and viva answers written by lead mentors:
              </p>
              <ul className="space-y-2 text-xs">
                {cluster.blogSlugs.map((bSlug) => (
                  <li key={bSlug}>
                    <Link
                      href={`/blogs/${bSlug}`}
                      className="group flex items-center justify-between p-2 rounded-xl bg-surface hover:bg-secondary/10 transition-colors font-medium text-text-main hover:text-secondary"
                    >
                      <span className="capitalize line-clamp-2 leading-snug">{bSlug.replace(/-/g, ' ')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-secondary group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-border-subtle">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-light transition-colors"
              >
                <span>Read All Publications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. Upcoming Live Batches or Offline Lab Notice */}
        <div className="bg-gradient-to-br from-primary via-slate-900 to-primary text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-base border-b border-white/10 pb-3 text-white">
              <div className="p-2 bg-white/10 rounded-xl text-secondary">
                <Calendar className="w-5 h-5" />
              </div>
              <span>Upcoming Live Cohorts</span>
            </div>

            {matchingBatches.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-300">
                  Join upcoming interactive practical batches starting soon at our Shikohabad lab:
                </p>
                {matchingBatches.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/live-batches/${batch.id}`}
                    className="block p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white group-hover:text-secondary transition-colors line-clamp-1">{batch.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                        {batch.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <span>Starts {batch.startDate}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Regular rolling batches commence on the 1st and 15th of every month. Attend hands-on practicals at our air-conditioned computer facility.
                </p>
                <div className="p-3 bg-white/10 rounded-xl space-y-2 border border-white/10 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Gali No. 3, Near Gyan Jyoti Public School, Shikohabad (UP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Free 2-Day Trial Demo Available</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/10">
            <Link
              href="/live-batches"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow transition-colors text-center"
            >
              <span>View All Batch Schedules</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

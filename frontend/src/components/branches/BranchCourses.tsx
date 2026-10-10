import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Award, Sparkles } from 'lucide-react';
import { Course, Branch } from '@/types';

interface BranchCoursesProps {
  courses: Course[];
  branch: Branch;
}

export default function BranchCourses({ courses, branch }: BranchCoursesProps) {
  if (!courses || courses.length === 0) {
    return (
      <section id="courses" className="py-12 bg-background-alt border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Courses at {branch.name}</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Offline curriculum programs for this location are currently being updated. In the meantime, you can explore all our globally available online programs.
          </p>
          <div className="mt-6">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              <span>Explore All MSK Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-16 bg-background-alt border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Standardized Practical Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Courses Available at {branch.name}
            </h2>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl">
              All courses taught at this campus feature certified syllabus coverage, hands-on computer lab sessions, mentor doubt-solving, and globally verifiable certificates.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors self-start md:self-auto"
          >
            <span>View Full 66+ Course Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <article
              key={course.id}
              className="group bg-surface rounded-2xl border border-border-subtle p-5 hover:border-secondary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded">
                    {course.categories?.[0] || 'Software'}
                  </span>

                  <span className="text-[11px] font-semibold text-text-muted bg-background-alt px-2 py-0.5 rounded border border-border-subtle">
                    {course.level || 'Beginner to Advanced'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary group-hover:text-secondary transition-colors mb-2 line-clamp-1">
                  <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                </h3>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {course.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-xs text-text-muted mb-4 pt-2 border-t border-border-subtle/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    {course.duration ? `${course.duration.value} ${course.duration.unit.toLowerCase()}` : 'Flexible'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-secondary" />
                    Certified
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-secondary" />
                    Lab Practice
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle/60 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ Available at {branch.city}
                </span>

                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                >
                  <span>Syllabus & Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

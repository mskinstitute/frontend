'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ExternalLink, Github, Code2, 
  CheckCircle2, ArrowRight, User, BookOpen, 
  Layers, Search, Filter
} from 'lucide-react';
import { StudentProject } from '@/data/studentProjects';

interface StudentProjectsClientProps {
  initialProjects: StudentProject[];
}

const CATEGORIES = [
  'All',
  'Full-Stack',
  'Frontend',
  'Python',
  'Data Analytics',
  'Office & Automation'
] as const;

export default function StudentProjectsClient({ initialProjects }: StudentProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.studentName.toLowerCase().includes(query) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="bg-surface/60 rounded-2xl border border-border-subtle p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-white border border-border-subtle text-primary hover:border-secondary/40 hover:text-secondary'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech, topic, student..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-border-subtle text-xs text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
            />
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border-subtle">
          <span>
            Showing <strong>{filteredProjects.length}</strong> of {initialProjects.length} student capstone projects
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-secondary hover:underline cursor-pointer font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-surface/30 rounded-3xl border border-border-subtle space-y-3">
          <Code2 className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold text-primary">No Projects Found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            No student capstones matched your search criteria. Try selecting another category or resetting the search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-3xl border border-border-subtle shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Content */}
              <div className="p-6 sm:p-7 space-y-5">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#B83A00]/10 text-[#B83A00] px-2.5 py-0.5 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-medium text-text-muted">
                    {project.batch}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-extrabold text-primary group-hover:text-secondary transition-colors leading-snug">
                  {project.title}
                </h3>

                {/* Student Info */}
                <div className="flex items-center gap-2.5 text-xs text-text-muted bg-surface/50 p-2.5 rounded-xl border border-border-subtle">
                  <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-primary">{project.studentName}</span>
                    <span className="mx-1.5">•</span>
                    <span>{project.studentRole}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {project.description}
                </p>

                {/* Technical Highlights */}
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Engineering Highlights:
                  </h4>
                  <ul className="space-y-1.5">
                    {project.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs text-text-muted">
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-semibold bg-surface border border-border-subtle text-primary px-2.5 py-0.5 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action Bar */}
              <div className="p-4 sm:p-6 bg-surface/40 border-t border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  href={`/courses/${project.courseSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-secondary" />
                  <span className="line-clamp-1">Built in: {project.courseTitle}</span>
                </Link>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-border-subtle hover:border-gray-400 text-xs font-medium rounded-lg text-primary transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  <Link
                    href={`/courses/${project.courseSlug}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Course Info</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

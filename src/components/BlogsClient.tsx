'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight, Sparkles, X, User } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogsClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialBlogs.forEach((b) => cats.add(b.category));
    return ['All', ...Array.from(cats)];
  }, [initialBlogs]);

  // Featured blog
  const featuredBlog = useMemo(() => {
    return initialBlogs.find((b) => b.featured) || initialBlogs[0];
  }, [initialBlogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      if (selectedCategory !== 'All' && blog.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const str = `${blog.title} ${blog.excerpt} ${blog.category} ${blog.tags.join(' ')}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [initialBlogs, selectedCategory, searchTerm]);

  return (
    <div className="space-y-12">
      {/* Featured Blog Banner (Shown when no search term and "All" category is selected) */}
      {!searchTerm && selectedCategory === 'All' && featuredBlog && (
        <div className="bg-gradient-to-br from-primary to-primary-light rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-white text-xs font-bold uppercase rounded-full shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Article
                </span>
                <span className="text-xs text-slate-300 font-medium">{featuredBlog.category}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                <Link href={`/blogs/${featuredBlog.slug}`} className="hover:text-secondary-light transition-colors">
                  {featuredBlog.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed">
                {featuredBlog.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredBlog.author.avatar}
                    alt={featuredBlog.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/30"
                  />
                  <span>{featuredBlog.author.name}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featuredBlog.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredBlog.readTime}
                </span>
              </div>

              <div className="pt-4">
                <Link
                  href={`/blogs/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-xl shadow transition-colors"
                >
                  Read Full Article
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Row: Category tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-text-muted border-border-subtle hover:bg-surface hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles & topics..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm focus:outline-none focus:border-secondary transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-text-muted hover:text-primary"
              aria-label="Clear filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="py-20 text-center bg-surface border border-border-subtle rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-border-subtle flex items-center justify-center mx-auto text-text-muted">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-primary">No articles found</h3>
          <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto">
            We couldn&apos;t find any blog posts matching &ldquo;{searchTerm}&rdquo;. Try another topic.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            Show All Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <Link href={`/blogs/${blog.slug}`} className="block relative overflow-hidden aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    width={600}
                    height={338}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-primary/80 backdrop-blur-sm text-white text-[11px] font-bold uppercase rounded-md">
                      {blog.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {blog.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface text-text-muted text-[11px] font-medium rounded-md border border-border-subtle"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    width={24}
                    height={24}
                    loading="lazy"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="truncate max-w-[120px]">{blog.author.name}</span>
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-secondary group-hover:text-secondary-light transition-colors"
                >
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

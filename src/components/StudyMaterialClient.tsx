'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  FileCode,
  Layers,
  FileText,
  Bookmark,
  Search,
  Download,
  ShoppingBag,
  CheckCircle,
  Copy,
  Check,
  X,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  User,
  Phone,
  Send,
  Code,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StudyMaterial, StudyMaterialType, TutorialItem } from '@/types';
import { trackNoteDownload } from '@/lib/tracking';
import { trackFileDownload, trackFormStart } from '@/lib/dataLayer';
import TutorialCard from '@/components/TutorialCard';

interface StudyMaterialClientProps {
  initialMaterials: StudyMaterial[];
  tutorials?: TutorialItem[];
}

function StudyMaterialQuerySync({
  initialMaterials,
  onSetSelectedType,
  onOpenTutorial,
  onOpenCheatsheet,
  onOpenHandbook,
  onOpenNoteToBuy,
}: {
  initialMaterials: StudyMaterial[];
  onSetSelectedType: (type: string) => void;
  onOpenTutorial: (m: StudyMaterial) => void;
  onOpenCheatsheet: (m: StudyMaterial) => void;
  onOpenHandbook: (m: StudyMaterial) => void;
  onOpenNoteToBuy: (m: StudyMaterial) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const idParam = searchParams.get('id');
    const typeParam = searchParams.get('type');

    if (typeParam && ['tutorial', 'cheatsheet', 'note', 'handbook'].includes(typeParam)) {
      onSetSelectedType(typeParam);
    }

    if (idParam) {
      const match = initialMaterials.find(
        (m) => m.id.toLowerCase() === idParam.toLowerCase() || m.slug === idParam
      );
      if (match) {
        if (match.type === 'tutorial') onOpenTutorial(match);
        else if (match.type === 'cheatsheet') onOpenCheatsheet(match);
        else if (match.type === 'handbook') onOpenHandbook(match);
        else if (match.type === 'note' && match.tier === 'paid') onOpenNoteToBuy(match);
      }
    }
  }, [
    searchParams,
    initialMaterials,
    onSetSelectedType,
    onOpenTutorial,
    onOpenCheatsheet,
    onOpenHandbook,
    onOpenNoteToBuy,
  ]);

  return null;
}

export default function StudyMaterialClient({
  initialMaterials,
  tutorials = [],
}: StudyMaterialClientProps) {
  // Active Type Tab: 'all' | 'tutorial' | 'cheatsheet' | 'note' | 'handbook'
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Active Modals
  const [activeTutorial, setActiveTutorial] = useState<StudyMaterial | null>(null);
  const [activeCheatsheet, setActiveCheatsheet] = useState<StudyMaterial | null>(null);
  const [activeHandbook, setActiveHandbook] = useState<StudyMaterial | null>(null);
  const [activeNoteToBuy, setActiveNoteToBuy] = useState<StudyMaterial | null>(null);

  // Cheatsheet modal internal search & filter state
  const [cheatsheetSearch, setCheatsheetSearch] = useState('');
  const [activeCheatsheetCategory, setActiveCheatsheetCategory] = useState('All');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const openCheatsheetModal = (item: StudyMaterial) => {
    setCheatsheetSearch('');
    setActiveCheatsheetCategory('All');
    setActiveCheatsheet(item);
  };

  // Copy state tracker: records snippet index or command key
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Inquiry Checkout Form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories extraction
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialMaterials.forEach((m) => {
      if (m.category) cats.add(m.category);
    });
    const standardCats = ['All', 'Python', 'Data Analytics', 'Web Development', 'MS Office', 'Cyber Security'];
    cats.forEach((c) => {
      if (!standardCats.includes(c) && c !== 'All') {
        standardCats.push(c);
      }
    });
    return standardCats;
  }, [initialMaterials]);

  // Counts by type
  const counts = useMemo(() => {
    const tutCount = tutorials.length;
    return {
      all: initialMaterials.length + tutCount,
      tutorial: tutCount,
      cheatsheet: initialMaterials.filter((m) => m.type === 'cheatsheet').length,
      note: initialMaterials.filter((m) => m.type === 'note').length,
      handbook: initialMaterials.filter((m) => m.type === 'handbook').length,
    };
  }, [initialMaterials, tutorials]);

  // Filter tutorials
  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tut) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const cat = selectedCategory.toLowerCase();
        const matchesTitle = tut.title?.toLowerCase().includes(cat);
        const matchesTags = tut.tags?.some((t) => t.toLowerCase().includes(cat));
        if (!matchesTitle && !matchesTags) return false;
      }

      // Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const text = `${tut.title} ${tut.shortDescription} ${tut.tags?.join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [tutorials, selectedCategory, searchTerm]);

  // Filter materials based on type, category, and search keyword
  const filteredMaterials = useMemo(() => {
    return initialMaterials.filter((item) => {
      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Search keyword
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const text = `${item.title} ${item.description} ${item.category} ${item.topicsCovered.join(' ')}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [initialMaterials, selectedType, selectedCategory, searchTerm]);

  // Copy helper
  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  // Filtered Cheatsheet Sections inside Modal
  const filteredCheatsheetSections = useMemo(() => {
    if (!activeCheatsheet?.cheatsheetContent?.sections) return [];
    const query = cheatsheetSearch.trim().toLowerCase();

    return activeCheatsheet.cheatsheetContent.sections
      .filter((sec) => {
        if (activeCheatsheetCategory !== 'All' && sec.categoryTitle !== activeCheatsheetCategory) {
          return false;
        }
        return true;
      })
      .map((sec) => {
        if (!query) return sec;
        const matchingItems = sec.items.filter((item) => {
          return (
            item.commandOrSyntax.toLowerCase().includes(query) ||
            item.explanation.toLowerCase().includes(query) ||
            (item.example && item.example.toLowerCase().includes(query)) ||
            sec.categoryTitle.toLowerCase().includes(query)
          );
        });
        return {
          ...sec,
          items: matchingItems,
        };
      })
      .filter((sec) => sec.items.length > 0);
  }, [activeCheatsheet, cheatsheetSearch, activeCheatsheetCategory]);

  const totalCheatsheetItemsCount = useMemo(() => {
    if (!activeCheatsheet?.cheatsheetContent?.sections) return 0;
    return activeCheatsheet.cheatsheetContent.sections.reduce(
      (acc, s) => acc + s.items.length,
      0
    );
  }, [activeCheatsheet]);

  const matchingCheatsheetItemsCount = useMemo(() => {
    return filteredCheatsheetSections.reduce((acc, s) => acc + s.items.length, 0);
  }, [filteredCheatsheetSections]);

  // Download as PDF without redirecting
  const handleDownloadCheatsheetPdf = async () => {
    if (!activeCheatsheet) return;
    try {
      setIsDownloadingPdf(true);
      const { downloadCheatsheetPdf } = await import('@/lib/cheatsheetPdfGenerator');
      downloadCheatsheetPdf(activeCheatsheet);
      trackFileDownload({
        fileName: `${activeCheatsheet.slug || activeCheatsheet.title || 'cheatsheet'}.pdf`,
        downloadType: 'cheatsheet',
      });
      toast.success('PDF Cheatsheet downloaded successfully!');
    } catch (error) {
      console.error('Failed to download PDF cheatsheet:', error);
      toast.error('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Inquiry Checkout Submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!/^\d{10}$/.test(buyerPhone.trim())) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (activeNoteToBuy) {
        trackNoteDownload(activeNoteToBuy.title, true);
      }
      toast.success(
        `Purchase inquiry for "${activeNoteToBuy?.title}" submitted! Our team will contact you via WhatsApp.`
      );
      setBuyerName('');
      setBuyerPhone('');
      setActiveNoteToBuy(null);
    }, 1200);
  };

  const renderTypeIcon = (type: StudyMaterialType) => {
    switch (type) {
      case 'tutorial':
        return <FileCode className="w-4 h-4 text-emerald-600" />;
      case 'cheatsheet':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'note':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'handbook':
        return <Bookmark className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getBadgeStyle = (type: StudyMaterialType) => {
    switch (type) {
      case 'tutorial':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cheatsheet':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'note':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'handbook':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const renderMaterialCard = (item: StudyMaterial) => {
    return (
      <div
        key={item.id}
        className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6 group"
      >
        <div className="space-y-4">
          {/* Header Badge Row */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase rounded-md border ${getBadgeStyle(
                item.type
              )}`}
            >
              {renderTypeIcon(item.type)}
              {item.type}
            </span>

            <span
              className={`px-2 py-0.5 text-[11px] font-black uppercase rounded-md shadow-2xs ${
                item.tier === 'free'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}
            >
              {item.tier === 'free' ? 'Free' : item.price}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3
              onClick={() => {
                if (item.type === 'tutorial') setActiveTutorial(item);
                else if (item.type === 'cheatsheet') openCheatsheetModal(item);
                else if (item.type === 'handbook') setActiveHandbook(item);
              }}
              className={`text-lg font-bold text-primary group-hover:text-secondary transition-colors ${
                item.type === 'tutorial' || item.type === 'cheatsheet' || item.type === 'handbook'
                  ? 'cursor-pointer'
                  : ''
              }`}
            >
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
              {item.description}
            </p>
          </div>

          {/* Metadata details */}
          <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1 border-t border-border-subtle/60">
            <span className="font-semibold text-primary">{item.category}</span>
            <span>•</span>
            <span>{item.level}</span>
            {item.readTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-text-muted" />
                  {item.readTime}
                </span>
              </>
            )}
            {item.pages && (
              <>
                <span>•</span>
                <span>{item.pages} Pages</span>
              </>
            )}
          </div>

          {/* Topics Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.topicsCovered.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-surface rounded-md text-[11px] text-text-muted border border-border-subtle"
              >
                {topic}
              </span>
            ))}
            {item.topicsCovered.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-text-muted font-bold">
                +{item.topicsCovered.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-4 border-t border-border-subtle">
          {item.type === 'tutorial' && (
            <button
              onClick={() => setActiveTutorial(item)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-light text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Open Tutorial
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {item.type === 'cheatsheet' && (
            <button
              onClick={() => openCheatsheetModal(item)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              View Cheatsheet
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {item.type === 'handbook' && (
            <button
              onClick={() => setActiveHandbook(item)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              Explore Handbook
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {item.type === 'note' &&
            (item.tier === 'free' ? (
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackNoteDownload(item.title, false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-light text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF Notes
              </a>
            ) : (
              <button
                onClick={() => setActiveNoteToBuy(item)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Unlock Package ({item.price})
              </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <StudyMaterialQuerySync
          initialMaterials={initialMaterials}
          onSetSelectedType={setSelectedType}
          onOpenTutorial={setActiveTutorial}
          onOpenCheatsheet={openCheatsheetModal}
          onOpenHandbook={setActiveHandbook}
          onOpenNoteToBuy={setActiveNoteToBuy}
        />
      </Suspense>

      {/* Material Type Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-surface border border-border-subtle rounded-2xl max-w-4xl mx-auto shadow-2xs">
        {[
          { id: 'all', label: 'All Materials', count: counts.all, icon: Sparkles },
          { id: 'tutorial', label: 'Tutorials', count: counts.tutorial, icon: FileCode },
          { id: 'cheatsheet', label: 'Cheatsheets', count: counts.cheatsheet, icon: Layers },
          { id: 'note', label: 'PDF Notes', count: counts.note, icon: FileText },
          { id: 'handbook', label: 'Handbooks', count: counts.handbook, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-text-muted hover:text-primary hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row: Category Chips & Local Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-2xs'
                  : 'bg-white text-text-muted border-border-subtle hover:bg-surface hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by keyword or topic..."
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

      {/* Resource Count Banner */}
      <div className="flex items-center justify-between text-xs text-text-muted px-1">
        <span>
          Showing <strong>{selectedType === 'tutorial' ? filteredTutorials.length : selectedType === 'all' ? filteredMaterials.length + filteredTutorials.length : filteredMaterials.length}</strong> resources
          {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
        </span>
        {selectedType === 'tutorial' && (
          <span className="text-secondary font-medium hidden sm:inline">
            ✨ Click any tutorial card to explore documentation & lessons
          </span>
        )}
      </div>

      {/* Empty State */}
      {(selectedType === 'tutorial' ? filteredTutorials.length === 0 : selectedType === 'all' ? (filteredMaterials.length === 0 && filteredTutorials.length === 0) : filteredMaterials.length === 0) && (
        <div className="py-20 text-center bg-surface border border-border-subtle rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-white border border-border-subtle flex items-center justify-center mx-auto text-text-muted">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-primary">No resources found</h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto">
              We couldn&apos;t find any study materials matching your current filters. Try changing your search or category filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 1. Tutorials Tab View */}
      {selectedType === 'tutorial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tut) => (
            <TutorialCard key={tut.id} tutorial={tut} />
          ))}
        </div>
      )}

      {/* 2. All Materials View: Show Tutorials first, then Cheatsheets, Notes, Handbooks */}
      {selectedType === 'all' && (
        <div className="space-y-12">
          {filteredTutorials.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                  <FileCode className="w-5 h-5 text-secondary" />
                  <span>Interactive Tutorials & Notes</span>
                </div>
                <button
                  onClick={() => setSelectedType('tutorial')}
                  className="text-xs font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                >
                  View all tutorials
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map((tut) => (
                  <TutorialCard key={tut.id} tutorial={tut} />
                ))}
              </div>
            </div>
          )}

          {filteredMaterials.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-lg">
                <Layers className="w-5 h-5 text-secondary" />
                <span>Cheatsheets, PDF Notes & Handbooks</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((item) => renderMaterialCard(item))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Cheatsheet / Note / Handbook Views */}
      {selectedType !== 'all' && selectedType !== 'tutorial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => renderMaterialCard(item))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 1. INTERACTIVE TUTORIAL MODAL (Show as open reader) */}
      {/* ---------------------------------------------------- */}
      {activeTutorial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveTutorial(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border-subtle bg-surface flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-md">
                    Tutorial
                  </span>
                  <span className="text-xs font-semibold text-text-muted">
                    {activeTutorial.category} • {activeTutorial.level}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeTutorial.readTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-primary">
                  {activeTutorial.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveTutorial(null)}
                className="p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 divide-y divide-border-subtle/70">
              {/* Summary Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-emerald-950 text-sm leading-relaxed">
                <p className="font-semibold mb-1 text-emerald-900">Tutorial Overview</p>
                {activeTutorial.tutorialContent?.summary || activeTutorial.description}
              </div>

              {/* Prerequisites */}
              {activeTutorial.tutorialContent?.prerequisites && (
                <div className="pt-6 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Prerequisites:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-primary">
                    {activeTutorial.tutorialContent.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-surface p-2 rounded-lg border border-border-subtle">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step by step instructions with copyable code snippets */}
              <div className="pt-6 space-y-6">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-600" />
                  Hands-On Code Walkthrough
                </h3>

                {activeTutorial.tutorialContent?.steps.map((step, idx) => {
                  const copyKey = `tut-step-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="bg-surface/50 border border-border-subtle rounded-xl p-4 space-y-3"
                    >
                      <h4 className="text-sm font-bold text-primary">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                        {step.content}
                      </p>

                      {step.codeSnippet && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#0d1117]">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-slate-800 text-[11px] text-slate-400">
                            <span>{step.codeLanguage || 'code'}</span>
                            <button
                              onClick={() => handleCopy(copyKey, step.codeSnippet || '')}
                              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              aria-label="Copy code"
                            >
                              {copiedKey === copyKey ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                            <code>{step.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Key Takeaways */}
              {activeTutorial.tutorialContent?.keyTakeaways && (
                <div className="pt-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Key Learning Takeaways:
                  </h4>
                  <div className="space-y-2">
                    {activeTutorial.tutorialContent.keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-text-muted"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
              {activeTutorial.downloadUrl ? (
                <a
                  href={activeTutorial.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Lab Repository on GitHub
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setActiveTutorial(null)}
                className="px-4 py-2 bg-white border border-border-subtle text-text-muted hover:text-primary rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. INTERACTIVE CHEATSHEET MODAL */}
      {/* ---------------------------------------------------- */}
      {activeCheatsheet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveCheatsheet(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-border-subtle bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 flex items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[11px] font-bold uppercase rounded-md flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-600" />
                    Quick Cheatsheet
                  </span>
                  <span className="px-2 py-0.5 bg-surface text-text-muted text-[11px] font-semibold rounded-md border border-border-subtle">
                    {activeCheatsheet.category}
                  </span>
                  <span className="px-2 py-0.5 bg-surface text-text-muted text-[11px] font-semibold rounded-md border border-border-subtle">
                    {activeCheatsheet.level}
                  </span>
                  <span className="text-xs text-text-muted hidden sm:inline">
                    • {totalCheatsheetItemsCount} Commands across {activeCheatsheet.cheatsheetContent?.sections.length || 0} Categories
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-primary truncate">
                  {activeCheatsheet.title}
                </h2>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {activeCheatsheet.description}
                </p>
              </div>
              <button
                onClick={() => setActiveCheatsheet(null)}
                className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="p-3 sm:p-4 border-b border-border-subtle bg-surface/70 space-y-3">
              {/* Search Bar with live counter and clear button */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-purple-600 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={cheatsheetSearch}
                  onChange={(e) => setCheatsheetSearch(e.target.value)}
                  placeholder="Search syntax, commands, keywords, or examples (e.g. print, list, dict, open)..."
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-primary placeholder:text-text-muted/70 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                />
                {cheatsheetSearch && (
                  <button
                    onClick={() => setCheatsheetSearch('')}
                    className="absolute right-3 p-1 text-text-muted hover:text-primary rounded-md transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips & Counter */}
              <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                  <button
                    onClick={() => setActiveCheatsheetCategory('All')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeCheatsheetCategory === 'All'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-white text-text-muted hover:text-primary border border-border-subtle'
                    }`}
                  >
                    All ({totalCheatsheetItemsCount})
                  </button>
                  {activeCheatsheet.cheatsheetContent?.sections.map((sec, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCheatsheetCategory(sec.categoryTitle)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeCheatsheetCategory === sec.categoryTitle
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-white text-text-muted hover:text-primary border border-border-subtle'
                      }`}
                    >
                      {sec.categoryTitle.replace(/^\d+\.\s*/, '')} ({sec.items.length})
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-medium text-text-muted flex-shrink-0">
                  {cheatsheetSearch.trim() ? (
                    <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      {matchingCheatsheetItemsCount} matching {matchingCheatsheetItemsCount === 1 ? 'command' : 'commands'}
                    </span>
                  ) : (
                    <span>{totalCheatsheetItemsCount} total commands</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body: Cards List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {filteredCheatsheetSections.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-surface rounded-2xl border border-dashed border-border-subtle">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-600">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-primary">No matching syntax found</p>
                    <p className="text-xs text-text-muted">
                      No syntax matching &ldquo;{cheatsheetSearch}&rdquo; in this cheatsheet.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCheatsheetSearch('');
                      setActiveCheatsheetCategory('All');
                    }}
                    className="px-4 py-1.5 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Filter & Search
                  </button>
                </div>
              ) : (
                filteredCheatsheetSections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-900 border-b border-purple-100 pb-1.5 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        {sec.categoryTitle}
                      </span>
                      <span className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {sec.items.length} {sec.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </h3>

                    <div className="space-y-2.5">
                      {sec.items.map((item, itemIdx) => {
                        const copyKey = `cs-${secIdx}-${itemIdx}`;
                        return (
                          <div
                            key={itemIdx}
                            className="bg-surface hover:bg-white border border-border-subtle hover:border-purple-300 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group shadow-2xs hover:shadow-xs"
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-xs sm:text-[13px] font-bold font-mono bg-white group-hover:bg-purple-50/50 px-2.5 py-1 rounded-lg border border-border-subtle group-hover:border-purple-200 text-purple-700 select-all transition-colors">
                                  {item.commandOrSyntax}
                                </code>
                              </div>
                              <p className="text-xs text-text-muted leading-relaxed">{item.explanation}</p>
                              {item.example && (
                                <p className="text-[11px] text-purple-900/80 bg-purple-50/60 px-2 py-1 rounded-md border border-purple-100/80 font-mono inline-block">
                                  <span className="text-purple-500 font-semibold select-none">e.g. </span>
                                  {item.example}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleCopy(copyKey, item.commandOrSyntax)}
                              className="self-start sm:self-center flex items-center gap-1 px-3 py-1.5 bg-white border border-border-subtle hover:border-purple-400 text-xs text-text-muted hover:text-purple-700 rounded-lg transition-all cursor-pointer flex-shrink-0 shadow-2xs active:scale-95"
                              aria-label="Copy syntax"
                            >
                              {copiedKey === copyKey ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-green-600 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDownloadCheatsheetPdf}
                  disabled={isDownloadingPdf}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer active:scale-95"
                  title="Download cheatsheet directly as PDF file"
                >
                  {isDownloadingPdf ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF Cheatsheet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setActiveCheatsheet(null)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-border-subtle text-text-muted hover:text-primary rounded-xl text-xs sm:text-sm font-semibold cursor-pointer hover:bg-surface transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. INTERACTIVE HANDBOOK OUTLINE MODAL */}
      {/* ---------------------------------------------------- */}
      {activeHandbook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveHandbook(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle bg-indigo-50/50 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase rounded-md">
                  Handbook & Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-primary">
                  {activeHandbook.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{activeHandbook.pages} Pages Comprehensive Manual</span>
                  <span>•</span>
                  <span>{activeHandbook.readTime}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveHandbook(null)}
                className="p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {activeHandbook.description}
              </p>

              {/* Highlights */}
              {activeHandbook.handbookContent?.highlights && (
                <div className="bg-surface p-4 rounded-xl border border-border-subtle space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    What Makes This Handbook Special:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-primary">
                    {activeHandbook.handbookContent.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chapter Table of Contents */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Table of Contents ({activeHandbook.handbookContent?.chapters.length} Chapters)
                </h3>
                <div className="space-y-2.5">
                  {activeHandbook.handbookContent?.chapters.map((ch) => (
                    <div
                      key={ch.number}
                      className="p-3.5 rounded-xl border border-border-subtle bg-white hover:border-indigo-300 transition-colors flex items-start gap-3"
                    >
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {ch.number}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-primary">{ch.title}</h4>
                        <p className="text-xs text-text-muted">{ch.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface border-t border-border-subtle flex items-center justify-between gap-3">
              {activeHandbook.downloadUrl && (
                <a
                  href={activeHandbook.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Complete Handbook (PDF)
                </a>
              )}
              <button
                onClick={() => setActiveHandbook(null)}
                className="px-4 py-2 bg-white border border-border-subtle text-text-muted hover:text-primary rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. INQUIRY CHECKOUT MODAL (For paid packages) */}
      {/* ---------------------------------------------------- */}
      {activeNoteToBuy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveNoteToBuy(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xl space-y-6 relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveNoteToBuy(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-primary">Inquire About Notes Package</h3>
              <p className="text-xs text-text-muted">
                Complete details to purchase <strong>{activeNoteToBuy.title}</strong> for{' '}
                <strong className="text-secondary">{activeNoteToBuy.price}</strong>.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Singh"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Mobile Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="bg-surface p-3.5 rounded-xl border border-border-subtle text-xs text-text-muted leading-relaxed">
                Our institute coordinator will verify your request and send a secure UPI barcode to your WhatsApp. Once verified, the digital PDF repository link will be instantly dispatched to you.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-xl transition-colors shadow disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Submitting request...' : 'Submit Inquiry Request'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

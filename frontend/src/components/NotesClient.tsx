'use client';

import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, Download, ShoppingBag, CheckCircle, X, Phone, User, Send, ArrowRight } from 'lucide-react';
import { Note } from '@/types';
import { trackNoteDownload } from '@/lib/tracking';
import { trackFormStart } from '@/lib/dataLayer';

export default function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeNoteToBuy, setActiveNoteToBuy] = useState<Note | null>(null);
  
  // Checkout form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories extraction
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialNotes.forEach(n => cats.add(n.category));
    return ['All', ...Array.from(cats)];
  }, [initialNotes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    if (selectedCategory === 'All') return initialNotes;
    return initialNotes.filter(n => n.category === selectedCategory);
  }, [initialNotes, selectedCategory]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      toast.error('Please enter your name');
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
      toast.success(`Purchase request for "${activeNoteToBuy?.title}" sent! Our support team will contact you for payment link.`);
      setBuyerName('');
      setBuyerPhone('');
      setActiveNoteToBuy(null);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-secondary text-white border-secondary shadow-sm'
                : 'bg-white text-text-muted border-border-subtle hover:bg-surface hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 bg-surface text-primary border border-border-subtle text-[11px] font-bold uppercase rounded-md">
                  {note.category}
                </span>
                <span
                  className={`px-2.5 py-1 text-xs font-black uppercase rounded-md shadow-sm ${
                    note.tier === 'free'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}
                >
                  {note.tier === 'free' ? 'Free Access' : note.price}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <FileText className="w-5.5 h-5.5 text-secondary flex-shrink-0" />
                  {note.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {note.description}
                </p>
              </div>

              {/* Topics Covered tag list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">Topics Included:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {note.topicsCovered.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface rounded-full text-xs text-text-muted border border-border-subtle"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action footer */}
            <div className="pt-4 border-t border-border-subtle">
              {note.tier === 'free' ? (
                <a
                  href={note.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackNoteDownload(note.title, false)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-lg shadow transition-colors"
                >
                  <Download className="w-4.5 h-4.5" />
                  Download PDF Revision Guide
                </a>
              ) : (
                <button
                  onClick={() => setActiveNoteToBuy(note)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-lg shadow transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  Unlock Study Package ({note.price})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Checkout Modal */}
      {activeNoteToBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xl space-y-6 relative max-w-md w-full">
            <button
              onClick={() => setActiveNoteToBuy(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:text-primary hover:bg-surface transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-primary">Inquire About Notes Package</h3>
              <p className="text-xs text-text-muted">
                Complete details to purchase <strong>{activeNoteToBuy.title}</strong> for <strong>{activeNoteToBuy.price}</strong>.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {/* Buyer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Singh"
                    value={buyerName}
                    onFocus={() => trackFormStart('notes_purchase_inquiry')}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              {/* Buyer Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-text-muted" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              {/* Payment Info Callout */}
              <div className="bg-surface p-3 rounded-lg border border-border-subtle text-xs text-text-muted leading-relaxed">
                Our staff will verify your request and send a secure UPI barcode/payment link to your phone number. Once verified, the digital PDF will be dispatched to you on WhatsApp.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-lg transition-colors shadow disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting request...' : 'Submit Checkout Request'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

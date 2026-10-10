'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, Calendar, Clock, User, Award, 
  BookOpen, CheckCircle, Mail, Phone, MessageSquare, 
  ArrowRight, Check, Flame, History 
} from 'lucide-react';
import { LiveBatch } from '@/types';
import BatchEnrollmentForm from './BatchEnrollmentForm';

interface LiveBatchesClientProps {
  batches: LiveBatch[];
}

function BatchQuerySync({
  batches,
  onSelectBatch,
}: {
  batches: LiveBatch[];
  onSelectBatch: (id: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const batchParam = searchParams.get('batch');
    if (batchParam && batches.some((b) => b.id === batchParam)) {
      onSelectBatch(batchParam);
    }
  }, [searchParams, batches, onSelectBatch]);

  return null;
}

export default function LiveBatchesClient({ batches }: LiveBatchesClientProps) {
  const activeBatches = batches.filter((b) => b.status !== 'COMPLETED' && b.status !== 'ARCHIVED');
  const concludedBatches = batches.filter((b) => b.status === 'COMPLETED' || b.status === 'ARCHIVED');

  // Default directly to first active batch so server rendering produces full stable content with zero shift
  const defaultBatchId = activeBatches[0]?.id || batches[0]?.id || '';
  const [selectedBatchId, setSelectedBatchId] = useState(defaultBatchId);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || activeBatches[0] || batches[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      {/* Left Columns - Batch details */}
      <div className="lg:col-span-2 space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            Upcoming Live Cohorts & Batches
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Our live batches combine structured lectures with real-time lab exercises. Under the direct mentorship of Er. Sumit Kumar, you will build live projects, complete programming challenges, and prepare for global certifications.
          </p>
        </div>

        {/* Dynamic active batch cards list */}
        <div className="space-y-6">
          {activeBatches.map((b) => {
            const startDateStr = b.startDate ? (() => {
              try {
                const d = new Date(b.startDate);
                if (!isNaN(d.getTime())) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
              } catch {}
              return b.startDate;
            })() : 'Upcoming Batch';

            const isActiveSelection = b.id === selectedBatchId;
            const remainingSeats = b.leftSeats ?? 5;
            const total = b.totalSeats || 20;

            return (
              <div 
                key={b.id}
                onClick={() => setSelectedBatchId(b.id)}
                className={`bg-white p-6 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                  isActiveSelection 
                    ? 'border-secondary ring-2 ring-secondary/15 scale-[1.01]' 
                    : 'border-border-subtle hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2.5 py-1 rounded uppercase tracking-wider">
                        Starting {startDateStr}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted bg-gray-100 px-2.5 py-1 rounded uppercase tracking-wider">
                        {b.duration || 'Live Training'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                      {b.title}
                      {isActiveSelection && <span className="w-2 h-2 rounded-full bg-secondary" />}
                    </h3>
                    <p className="text-xs text-text-muted">{b.courseTitle}</p>
                  </div>

                  <div className="text-right sm:text-right flex-shrink-0">
                    <span className="text-lg font-black text-secondary">{b.price}</span>
                    <p className="text-[11px] text-red-500 font-bold mt-1 animate-pulse">
                      Only {remainingSeats} of {total} seats left!
                    </p>
                  </div>
                </div>

                <p className="text-sm text-text-muted mt-4 leading-relaxed">
                  {b.description}
                </p>

                {/* Batch Highlights grid with Instructor Picture */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border-subtle text-xs text-text-muted items-center">
                  <div className="flex items-center gap-3">
                    {b.instructorPicture ? (
                      <div className="relative flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.instructorPicture}
                          alt={b.instructor}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="w-10 h-10 rounded-full object-cover border-2 border-secondary/60 shadow-xs"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-black text-xs flex-shrink-0">
                        {b.instructor[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-primary">{b.instructor}</div>
                      <div className="text-[11px] text-text-muted">{b.schedule}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:text-right">
                    <div className="flex items-center gap-1.5 sm:justify-end text-green-700 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>100% Practical Labs & Projects</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:justify-end text-text-muted">
                      <Award className="w-3.5 h-3.5 text-secondary" />
                      <span>Includes Verified Certificate</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Bar */}
                <div className="mt-5 pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className={`text-xs font-bold ${
                    isActiveSelection ? 'text-secondary' : 'text-text-muted'
                  }`}>
                    {isActiveSelection ? '✓ Selected for instant enquiry form' : 'Click card to select for enquiry form'}
                  </span>

                  <Link
                    href={`/live-batches/${b.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concluded Batches Archive Section */}
        {concludedBatches.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-border-subtle">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <History className="w-5 h-5 text-text-muted" />
                Concluded Batches Archive
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The cohorts below have completed their training curriculum. Interested in joining the next cohort? Submit an enquiry or browse upcoming batches above.
              </p>
            </div>

            <div className="space-y-4">
              {concludedBatches.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface/60 rounded-2xl border border-border-subtle p-5 space-y-4 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-700 bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
                          Cohort Concluded
                        </span>
                        <span className="text-[10px] font-medium text-text-muted">
                          {b.schedule}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-primary">{b.title}</h4>
                      <p className="text-xs text-text-muted">{b.courseTitle}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-text-muted">Admissions Closed</span>
                      <Link
                        href={`/courses/${b.courseSlug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface border border-border-subtle hover:border-secondary text-primary hover:text-secondary text-xs font-medium rounded-lg transition-colors"
                      >
                        <span>View Curriculum</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - High Converting Lead Generation Form */}
      <div className="lg:col-span-1" id="register-form">
        {selectedBatch && (
          <BatchEnrollmentForm
            batch={selectedBatch}
            courseTitle={selectedBatch.courseTitle || selectedBatch.title}
            isSticky={true}
          />
        )}
      </div>

      <Suspense fallback={null}>
        <BatchQuerySync batches={batches} onSelectBatch={setSelectedBatchId} />
      </Suspense>
    </div>
  );
}

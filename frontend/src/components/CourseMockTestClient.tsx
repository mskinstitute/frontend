'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Clock, CheckCircle2, Bookmark, BookmarkCheck,
  RotateCcw, Share2, Award, ArrowRight, ArrowLeft, 
  HelpCircle, FileCheck, Send, Sparkles, BookOpen, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { CourseMockTestConfig, CourseMockQuestion } from '@/data/courseMockQuestions';

interface CourseMockTestClientProps {
  config: CourseMockTestConfig;
}

export default function CourseMockTestClient({ config }: CourseMockTestClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(config.durationMinutes * 60);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer Countdown
  useEffect(() => {
    if (isExamSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = config.questions;
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const totalQuestions = questions.length;

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isExamSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optIdx,
    }));
  };

  const handleClearAnswer = (qId: number) => {
    if (isExamSubmitted) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Score Calculation
  const scoreResult = useMemo(() => {
    let score = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const topicName = q.topic || 'General Concepts';
      if (!topicBreakdown[topicName]) {
        topicBreakdown[topicName] = { correct: 0, total: 0 };
      }
      topicBreakdown[topicName].total += 1;

      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
        topicBreakdown[topicName].correct += 1;
      }
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    let grade = 'Fail';
    let gradeTitle = 'Needs Improvement';
    if (percentage >= 85) {
      grade = 'S';
      gradeTitle = 'Super Grade (Distinction)';
    } else if (percentage >= 75) {
      grade = 'A';
      gradeTitle = 'Grade A (Excellent)';
    } else if (percentage >= 65) {
      grade = 'B';
      gradeTitle = 'Grade B (Good)';
    } else if (percentage >= 55) {
      grade = 'C';
      gradeTitle = 'Grade C (Satisfactory)';
    } else if (percentage >= 50) {
      grade = 'D';
      gradeTitle = 'Grade D (Pass)';
    }

    return {
      score,
      total: totalQuestions,
      percentage,
      grade,
      gradeTitle,
      isPassed: percentage >= config.passingPercentage,
      topicBreakdown,
    };
  }, [userAnswers, questions, totalQuestions, config.passingPercentage]);

  // WhatsApp Viral Share
  const handleWhatsAppShare = () => {
    const nameStr = candidateName.trim() ? candidateName.trim() : 'I';
    const text = `🎯 ${nameStr} scored ${scoreResult.percentage}% (${scoreResult.gradeTitle}) in the ${config.courseTitle} Mock Test by MSK Institute Shikohabad! Test your skills here: https://www.mskinstitute.in/mock-test/${config.courseSlug}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const handleInquireBatch = () => {
    const text = `Hello Er. Sumit Kumar, I took the online ${config.courseTitle} Mock Test on MSK Institute website and scored ${scoreResult.percentage}% (${scoreResult.gradeTitle}). I want to enroll in the new batch in Shikohabad. Please share upcoming batch dates and fees.`;
    window.open(`https://api.whatsapp.com/send?phone=918393042166&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filtered review questions
  const filteredReviewQuestions = useMemo(() => {
    return questions.filter((q) => {
      const userAns = userAnswers[q.id];
      const isCorrect = userAns === q.correctIndex;
      if (reviewFilter === 'incorrect') return userAns !== undefined && !isCorrect;
      if (reviewFilter === 'correct') return isCorrect;
      return true;
    });
  }, [questions, userAnswers, reviewFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-border-subtle p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
              {config.category}
            </span>
            <span className="text-xs text-text-muted">
              {config.difficulty}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-primary">
            {config.courseTitle} — Official Mock Assessment
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-text-muted hidden sm:block">
            <span>{totalQuestions} Questions</span>
          </div>

          {!isExamSubmitted && (
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono shadow-xs ${
              timeLeft < 180 
                ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' 
                : 'bg-surface border border-border-subtle text-primary'
            }`}>
              <Clock className="w-4 h-4 text-secondary" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Exam Interface */}
      {!isExamSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Active Question */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  {currentQ.topic || 'Assessment'}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-text-muted">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </h3>
              </div>

              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-surface text-text-muted hover:text-primary border border-border-subtle'
                }`}
              >
                {flaggedQuestions[currentQ.id] ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    <span>Flagged for Review</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Review Later</span>
                  </>
                )}
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-bold text-primary leading-relaxed">
                {currentQ.question}
              </p>

              {/* Optional Code Snippet */}
              {currentQ.codeSnippet && (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 shadow-inner">
                  <pre>{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary/10 border-secondary ring-1 ring-secondary font-semibold text-primary'
                        : 'bg-white border-border-subtle hover:bg-surface/50 text-text-muted hover:text-primary'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-secondary text-white shadow-xs'
                        : 'bg-surface border border-border-subtle text-primary'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-border-subtle bg-white hover:bg-surface disabled:opacity-40 disabled:pointer-events-none text-primary cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={userAnswers[currentQ.id] === undefined}
                  onClick={() => handleClearAnswer(currentQ.id)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-red-600 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary-light text-white shadow-xs cursor-pointer transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finish Assessment</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Question Palette */}
          <div className="bg-white rounded-3xl border border-border-subtle p-6 space-y-6 shadow-xs">
            <h4 className="font-bold text-primary text-sm">Question Navigation Palette</h4>

            {/* Quick Status Legends */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-center border-b border-border-subtle pb-4">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                <div>{answeredCount}</div>
                <div className="text-[10px] font-normal">Answered</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                <div>{flaggedCount}</div>
                <div className="text-[10px] font-normal">Review</div>
              </div>
              <div className="p-2 rounded-xl bg-surface border border-border-subtle text-text-muted font-bold">
                <div>{unansweredCount}</div>
                <div className="text-[10px] font-normal">Remaining</div>
              </div>
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];

                let buttonClass = 'bg-surface border-border-subtle text-text-muted';
                if (isAnswered) buttonClass = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                if (isFlagged) buttonClass = 'bg-amber-400 border-amber-500 text-slate-950 font-bold';
                if (isCurrent) buttonClass += ' ring-2 ring-secondary ring-offset-2';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${buttonClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Finish Test CTA */}
            <div className="pt-2 border-t border-border-subtle">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Exam & See Results</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results Screen: Scorecard, Certificate, and Detailed Review */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white via-surface/40 to-white rounded-3xl border-2 border-secondary/20 p-6 sm:p-10 shadow-md space-y-8 max-w-4xl mx-auto">
            {/* Certificate Header Banner */}
            <div className="text-center space-y-2 border-b border-border-subtle pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary">
                <Award className="w-3.5 h-3.5" />
                Official MSK Institute Assessment
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-primary">
                {config.courseTitle} — Performance Report
              </h2>
              <p className="text-xs sm:text-sm text-text-muted">
                Examination Readiness Report • Verified Digital Score
              </p>
            </div>

            {/* Candidate Details Personalization Box */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-text-muted uppercase">Candidate Name:</span>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your name to generate certificate"
                  className="font-extrabold text-primary text-base sm:text-lg border-b border-dashed border-gray-300 focus:border-secondary focus:outline-none bg-transparent"
                />
              </div>

              <div className="text-center sm:text-right space-y-0.5">
                <div className="text-xs text-text-muted font-medium">Roll ID:</div>
                <div className="text-xs font-mono font-bold text-secondary">
                  MSK-MOCK-{config.courseSlug.toUpperCase().slice(0, 5)}-{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>
            </div>

            {/* Scorecard Hero Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-1 shadow-2xs">
                <span className="text-xs font-medium text-text-muted">Score</span>
                <div className="text-3xl sm:text-4xl font-black text-primary">
                  {scoreResult.score} <span className="text-sm font-semibold text-text-muted">/ {scoreResult.total}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">Correct Answers</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-1 shadow-2xs">
                <span className="text-xs font-medium text-text-muted">Accuracy</span>
                <div className="text-3xl sm:text-4xl font-black text-secondary">
                  {scoreResult.percentage}%
                </div>
                <span className="text-xs font-bold text-text-muted">Passing Criteria: {config.passingPercentage}%</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-border-subtle space-y-1 shadow-2xs">
                <span className="text-xs font-medium text-text-muted">Assessment Grade</span>
                <div className={`text-3xl sm:text-4xl font-black ${
                  scoreResult.isPassed ? 'text-amber-500' : 'text-red-500'
                }`}>
                  Grade {scoreResult.grade}
                </div>
                <span className="text-xs font-bold text-primary">{scoreResult.gradeTitle}</span>
              </div>
            </div>

            {/* Topic Breakdown Bars */}
            <div className="bg-white p-6 rounded-2xl border border-border-subtle space-y-4">
              <h4 className="font-bold text-sm text-primary">Topic-wise Competency Breakdown</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(scoreResult.topicBreakdown).map(([topic, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={topic} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-primary">{topic}</span>
                        <span className="text-text-muted">{data.correct} / {data.total} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Viral Growth & Enrollment CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 1-Click WhatsApp Share */}
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm rounded-xl shadow-sm cursor-pointer transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Scorecard on WhatsApp</span>
                </button>

                {/* Retake Test */}
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setFlaggedQuestions({});
                    setTimeLeft(config.durationMinutes * 60);
                    setIsExamSubmitted(false);
                    setCurrentQuestionIndex(0);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-border-subtle hover:bg-surface text-primary font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Test</span>
                </button>
              </div>

              {/* Admissions Upsell Box */}
              <div className="bg-gradient-to-r from-secondary/10 via-surface to-secondary/10 rounded-2xl border border-secondary/20 p-5 sm:p-6 text-center space-y-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-secondary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Master {config.courseTitle}
                </span>
                <h3 className="text-base sm:text-lg font-black text-primary">
                  Ready to Level Up Your Real-World Coding & Software Skills?
                </h3>
                <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
                  Join our physical practical lab batch at MSK Institute Shikohabad or interactive online live batches. 1-student-1-PC policy, live portfolio capstone projects, and direct mentoring by Er. Sumit Kumar.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    href={`/courses/${config.courseSlug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <span>View Course Curriculum & Fees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={handleInquireBatch}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-secondary/30 hover:border-secondary text-primary hover:text-secondary text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-secondary" />
                    <span>Inquire for Upcoming Batch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
              <h3 className="font-extrabold text-primary text-lg">Detailed Question Explanations</h3>

              {/* Review Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-border-subtle text-xs font-semibold">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    reviewFilter === 'all' ? 'bg-white text-primary shadow-2xs font-bold' : 'text-text-muted hover:text-primary'
                  }`}
                >
                  All ({questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    reviewFilter === 'incorrect' ? 'bg-red-50 text-red-700 shadow-2xs font-bold' : 'text-text-muted hover:text-red-600'
                  }`}
                >
                  Incorrect ({totalQuestions - scoreResult.score})
                </button>
                <button
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    reviewFilter === 'correct' ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold' : 'text-text-muted hover:text-emerald-700'
                  }`}
                >
                  Correct ({scoreResult.score})
                </button>
              </div>
            </div>

            <div className="space-y-6 divide-y divide-border-subtle">
              {filteredReviewQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted bg-surface px-2 py-0.5 rounded uppercase">
                          Question {q.id} • {q.topic}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-primary">
                          {q.question}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : userAns !== undefined
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {isCorrect ? 'Correct (+1)' : userAns !== undefined ? 'Incorrect (0)' : 'Unattempted'}
                      </span>
                    </div>

                    {q.codeSnippet && (
                      <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs overflow-x-auto">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Options status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectOpt = optIdx === q.correctIndex;
                        const isUserChoice = userAns === optIdx;

                        let style = 'bg-surface border-border-subtle text-text-muted';
                        if (isCorrectOpt) style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        else if (isUserChoice) style = 'bg-red-50 border-red-300 text-red-900 line-through';

                        return (
                          <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${style}`}>
                            <span className="font-mono font-bold text-[11px]">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                            {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="bg-surface/50 p-3.5 rounded-xl border border-border-subtle text-xs text-text-muted leading-relaxed">
                      <span className="font-bold text-primary">Explanation: </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-primary">Submit Assessment?</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
                {unansweredCount > 0 && (
                  <span className="block text-amber-600 font-bold mt-1">
                    Warning: You still have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border-subtle text-xs font-bold text-primary hover:bg-surface cursor-pointer transition-colors"
              >
                Keep Reviewing
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setIsExamSubmitted(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

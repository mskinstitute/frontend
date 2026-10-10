'use client';

import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Award, Brain, ArrowRight, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string; // e.g. "C"
  explanation?: string;
}

interface PracticeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  questions: QuizQuestion[];
}

export default function PracticeQuizModal({
  isOpen,
  onClose,
  title,
  questions,
}: PracticeQuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (label: string) => {
    if (answered) return;
    setSelectedOption(label);
    setAnswered(true);

    if (label.toUpperCase() === currentQ.correctAnswer.toUpperCase()) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-surface border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-secondary">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">Practice Quiz: {title}</h3>
              <p className="text-xs text-text-muted">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-white transition-colors cursor-pointer"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!isFinished ? (
            <>
              {/* Question */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Question #{currentQuestionIndex + 1}
                </span>
                <h4 className="text-lg font-bold text-primary leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isChosen = selectedOption === opt.label;
                  const isCorrect = opt.label.toUpperCase() === currentQ.correctAnswer.toUpperCase();

                  let buttonStyle = 'bg-surface border-border-subtle hover:bg-slate-100 text-primary';
                  if (answered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen && !isCorrect) {
                      buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                    } else {
                      buttonStyle = 'opacity-50 bg-surface border-border-subtle text-text-muted';
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={answered}
                      onClick={() => handleSelectOption(opt.label)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-white border border-border-subtle font-bold text-xs flex items-center justify-center shadow-2xs">
                          {opt.label}
                        </span>
                        <span className="text-sm">{opt.text}</span>
                      </div>

                      {answered && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {answered && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {answered && currentQ.explanation && (
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto text-secondary">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-primary">Quiz Completed!</h3>
                <p className="text-sm text-text-muted">
                  You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>!
                </p>
              </div>
              <div className="p-4 bg-surface rounded-2xl border border-border-subtle max-w-xs mx-auto text-xs text-text-muted">
                {score === questions.length ? (
                  <span className="text-emerald-700 font-bold">🎉 Outstanding! Perfect score!</span>
                ) : score >= questions.length / 2 ? (
                  <span className="text-blue-700 font-bold">👍 Good job! Review the concepts to aim for 100%.</span>
                ) : (
                  <span className="text-orange-700 font-bold">📚 Keep practicing! Reread the lesson and try again.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-border-subtle flex items-center justify-between">
          {!isFinished ? (
            <>
              <div className="text-xs text-text-muted font-medium">
                Score: {score} / {questions.length}
              </div>
              {answered ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {currentQuestionIndex + 1 === questions.length ? 'See Results' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border-subtle text-primary text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

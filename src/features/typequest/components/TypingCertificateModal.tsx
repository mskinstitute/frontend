'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Award,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  User,
  Lock,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { TestResult, UserGamification } from '../types';
import { Student } from '@/types';

interface TypingCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: TestResult | null;
  gamification: UserGamification;
  bestWpm?: number;
  averageAccuracy?: number;
  onUpdateStudentProfile?: (id: string, name: string) => void;
  onUpdateStudentName?: (name: string) => void;
}

export default function TypingCertificateModal({
  isOpen,
  onClose,
  result,
  gamification,
  bestWpm = 0,
  averageAccuracy = 0,
  onUpdateStudentProfile,
  onUpdateStudentName,
}: TypingCertificateModalProps) {
  const [certMode, setCertMode] = useState<'PUBLIC' | 'ENROLLED'>('PUBLIC');
  const [publicNameInput, setPublicNameInput] = useState(gamification.studentName || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState(gamification.studentId || '');
  const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);
  const studentInputRef = useRef<HTMLInputElement>(null);
  const publicNameInputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (certMode === 'PUBLIC') {
          publicNameInputRef.current?.focus();
        } else {
          studentInputRef.current?.focus();
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, certMode]);

  // Verification helper
  const verifyStudentId = useCallback(
    async (rawId: string) => {
      const trimmed = rawId.trim();
      if (!trimmed) {
        setVerifiedStudent(null);
        setVerifyError('Student ID is required to generate and download certificate.');
        return false;
      }

      setIsVerifying(true);
      setVerifyError(null);

      try {
        const res = await fetch(`/api/students?id=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const student: Student = await res.json();
          if (student && student.studentId) {
            setVerifiedStudent(student);
            setVerifyError(null);
            if (onUpdateStudentProfile) {
              onUpdateStudentProfile(student.studentId, student.name);
            } else if (onUpdateStudentName) {
              onUpdateStudentName(student.name);
            }
            return true;
          }
        }
        setVerifiedStudent(null);
        setVerifyError(`Student ID "${trimmed}" not found in MSK Institute records. Please check and enter a valid registered ID.`);
        return false;
      } catch (err) {
        console.error('Failed to verify student ID:', err);
        setVerifiedStudent(null);
        setVerifyError('Failed to verify student ID due to network error. Please try again.');
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [onUpdateStudentProfile, onUpdateStudentName]
  );

  // Auto-verify if studentId already exists in gamification state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (gamification.studentId) {
        setStudentIdInput(gamification.studentId);
        verifyStudentId(gamification.studentId);
      } else {
        setVerifiedStudent(null);
        setVerifyError(null);
      }
    }
  }, [isOpen, gamification.studentId, verifyStudentId]);

  // Escape key closes modal without exiting fullscreen
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine certification metrics
  const certWpm = result?.wpm ?? (bestWpm > 0 ? bestWpm : 45);
  const certAccuracy = result?.accuracy ?? (averageAccuracy > 0 ? averageAccuracy : 96);
  const certDate = result
    ? new Date(result.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  // Unique Certificate ID
  const certId = `MSK-TQ-${(certWpm * 73 + certAccuracy * 17).toString(16).toUpperCase().padStart(6, '0')}`;

  // Proficiency Tier
  const getProficiencyTier = (wpm: number) => {
    if (wpm >= 90) return { title: 'Master / Elite', badge: 'Diamond Tier' };
    if (wpm >= 70) return { title: 'Advanced Professional', badge: 'Gold Tier' };
    if (wpm >= 50) return { title: 'Intermediate Competent', badge: 'Silver Tier' };
    return { title: 'Certified Touch Typist', badge: 'Bronze Tier' };
  };

  const proficiency = getProficiencyTier(certWpm);
  const verifyUrl = `https://www.mskinstitute.in/verify-cert?id=${certId}&studentId=${encodeURIComponent(
    verifiedStudent?.studentId || ''
  )}&wpm=${certWpm}&acc=${certAccuracy}`;

  const isEnrolledMode = certMode === 'ENROLLED';
  const recipientName = (isEnrolledMode ? (verifiedStudent?.name || '') : publicNameInput).trim();
  const canDownload = isEnrolledMode ? !!verifiedStudent : recipientName.length >= 2;

  const handleWhatsAppShare = () => {
    const text = `🏆 I achieved ${certWpm} WPM typing speed with ${certAccuracy}% accuracy on MSK Institute TypeQuest! 🚀\n\nTest your typing speed & get your free certificate here:\nhttps://www.mskinstitute.in/tools/typing`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://www.mskinstitute.in/tools/typing');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Generate Official PDF with jsPDF
  const handleDownloadPdf = async () => {
    if (isEnrolledMode && !verifiedStudent) {
      setVerifyError('Student ID is required and must match MSK Institute records before downloading.');
      return;
    }
    if (!isEnrolledMode && recipientName.length < 2) {
      setVerifyError('Please enter your full name (at least 2 letters) to generate and download the certificate.');
      return;
    }

    setIsGenerating(true);
    setVerifyError(null);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Page dimensions: 297mm x 210mm
      // Background base
      doc.setFillColor(254, 252, 248);
      doc.rect(0, 0, 297, 210, 'F');

      // Outer Decorative Border (Double Gold/Navy)
      doc.setDrawColor(212, 175, 55); // Gold
      doc.setLineWidth(2.5);
      doc.rect(10, 10, 277, 190);

      doc.setDrawColor(30, 41, 59); // Slate Navy
      doc.setLineWidth(0.8);
      doc.rect(13, 13, 271, 184);

      // Corner Accents
      const corners = [
        [15, 15],
        [282, 15],
        [15, 195],
        [282, 195],
      ];
      doc.setFillColor(212, 175, 55);
      corners.forEach(([cx, cy]) => {
        doc.circle(cx, cy, 2.5, 'F');
      });

      // Certificate Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(194, 65, 12); // Deep Orange
      doc.text('MSK INSTITUTE OF TECHNOLOGY & COMPUTER SKILLS', 148.5, 30, { align: 'center' });

      doc.setFontSize(28);
      doc.setTextColor(15, 23, 42); // Navy Dark
      doc.text('CERTIFICATE OF TYPING PROFICIENCY', 148.5, 46, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text('THIS IS PROUDLY PRESENTED TO', 148.5, 60, { align: 'center' });

      // Student Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(30);
      doc.setTextColor(234, 88, 12); // Primary Brand
      const formattedName = (recipientName || 'CERTIFIED TYPIST').toUpperCase();
      doc.text(formattedName, 148.5, 76, { align: 'center' });

      // Underline
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.7);
      doc.line(65, 80, 232, 80);

      // Verified Student ID Subtitle
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const subtitleText = isEnrolledMode && verifiedStudent
        ? `STUDENT ID / ROLL NO: ${verifiedStudent.studentId.toUpperCase()}`
        : `PUBLIC TOUCH TYPING CREDENTIAL ID: ${certId}`;
      doc.text(subtitleText, 148.5, 86, { align: 'center' });

      // Award description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.text(
        `for successfully demonstrating verified touch typing mastery and excellence on MSK TypeQuest as an accredited`,
        148.5,
        94,
        { align: 'center' }
      );
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${proficiency.title.toUpperCase()} (${proficiency.badge})`, 148.5, 101, { align: 'center' });

      // Metric Badge Boxes
      // Box 1: WPM
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(42, 108, 65, 28, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(234, 88, 12);
      doc.text(`${certWpm} WPM`, 74.5, 122, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('VERIFIED SPEED', 74.5, 130, { align: 'center' });

      // Box 2: Accuracy
      doc.roundedRect(116, 108, 65, 28, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text(`${certAccuracy}%`, 148.5, 122, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('ACCURACY RATE', 148.5, 130, { align: 'center' });

      // Box 3: Level & Grade
      doc.roundedRect(190, 108, 65, 28, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text(`LEVEL ${gamification.level}`, 222.5, 122, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('ACADEMY STANDING', 222.5, 130, { align: 'center' });

      // QR Code Integration
      const canvas = qrCanvasRef.current?.querySelector('canvas');
      if (canvas) {
        const qrImage = canvas.toDataURL('image/png');
        doc.addImage(qrImage, 'PNG', 42, 146, 28, 28);
      }

      // Verification details next to QR
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Certificate No: ${certId}`, 75, 153);
      doc.text(
        isEnrolledMode && verifiedStudent
          ? `Student ID: ${verifiedStudent.studentId.toUpperCase()}`
          : `Track: Open Learner Touch Typing`,
        75,
        159
      );
      doc.text(`Date of Issue: ${certDate}`, 75, 165);
      doc.text('Verification: Scan QR code or visit mskinstitute.in/tools/typing', 75, 171);

      // Signature Area (Right Side)
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.line(190, 166, 255, 166);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('Academic Director', 222.5, 172, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('MSK Institute Certified Board', 222.5, 177, { align: 'center' });

      // Save PDF
      const safeName = (recipientName || 'Learner').replace(/\s+/g, '_');
      const safeFileName = `MSK_TypeQuest_Certificate_${safeName}_${certWpm}WPM.pdf`;
      doc.save(safeFileName);
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 modal-interactive"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary/20 to-amber-500/20 border border-secondary/40 flex items-center justify-center text-secondary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Official Typing Certificate
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Verified certificate of typing speed with Google Sheet student authentication
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual-Mode Selector & Verification Strip */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-3">
          {/* Mode Pill Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setCertMode('PUBLIC');
                  setVerifyError(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  certMode === 'PUBLIC'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Public Learner (Instant)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCertMode('ENROLLED');
                  setVerifyError(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  certMode === 'ENROLLED'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MSK Enrolled Student
              </button>
            </div>

            {/* Cert Tracking ID */}
            <div className="text-xs text-slate-400 font-mono">
              Cert ID: <span className="text-amber-400 font-semibold">{certId}</span>
            </div>
          </div>

          {/* Input Controls */}
          {certMode === 'PUBLIC' ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                <span className="text-xs font-semibold text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <User className="w-4 h-4 text-secondary" />
                  Your Full Name: <span className="text-rose-400 font-bold">*</span>
                </span>
                <div className="relative flex-1 max-w-sm">
                  <input
                    ref={publicNameInputRef}
                    type="text"
                    autoFocus
                    value={publicNameInput}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      setPublicNameInput(e.target.value);
                      if (onUpdateStudentName) onUpdateStudentName(e.target.value);
                    }}
                    placeholder="Enter your full name for certificate"
                    maxLength={40}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg text-sm text-white font-medium focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant certificate for all learners</span>
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                <span className="text-xs font-semibold text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <User className="w-4 h-4 text-secondary" />
                  Student ID: <span className="text-rose-400 font-bold">*</span>
                </span>
                <div className="relative flex-1 max-w-xs">
                  <input
                    ref={studentInputRef}
                    type="text"
                    autoFocus
                    value={studentIdInput}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      setStudentIdInput(e.target.value);
                      if (verifiedStudent) setVerifiedStudent(null);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        verifyStudentId(studentIdInput);
                      }
                    }}
                    placeholder="e.g. std-001 or MSK-2026-001"
                    maxLength={30}
                    className={`w-full px-3 py-1.5 bg-slate-900 border rounded-lg text-sm text-white font-mono uppercase tracking-wide focus:outline-none transition-colors ${
                      verifiedStudent
                        ? 'border-emerald-500 ring-1 ring-emerald-500/50'
                        : verifyError
                        ? 'border-rose-500 ring-1 ring-rose-500/50'
                        : 'border-slate-700 focus:border-secondary focus:ring-1 focus:ring-secondary'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  disabled={isVerifying || !studentIdInput.trim()}
                  onClick={() => verifyStudentId(studentIdInput)}
                  className="px-3.5 py-1.5 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                >
                  {isVerifying ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {certMode === 'ENROLLED' && verifiedStudent && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Verified Student: <strong className="text-white font-bold">{verifiedStudent.name}</strong> ({verifiedStudent.studentId.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
                Verified via MSK Sheet
              </span>
            </div>
          )}

          {verifyError && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}
        </div>

        {/* Certificate Visual Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40 flex justify-center items-center no-scrollbar">
          <div className="w-full max-w-3xl aspect-[1.414/1] bg-gradient-to-br from-amber-50/95 via-stone-50 to-orange-50/90 text-slate-900 rounded-xl p-5 sm:p-8 shadow-2xl border-4 border-amber-500/80 relative flex flex-col justify-between select-none">
            {/* Inner Border */}
            <div className="absolute inset-2 border-2 border-slate-800/80 pointer-events-none rounded-lg" />

            {/* Corner Decorative Studs */}
            <span className="absolute top-3.5 left-3.5 w-2 h-2 rounded-full bg-amber-600" />
            <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-600" />
            <span className="absolute bottom-3.5 left-3.5 w-2 h-2 rounded-full bg-amber-600" />
            <span className="absolute bottom-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-600" />

            {/* Certificate Top Header */}
            <div className="text-center pt-1 sm:pt-2">
              <div className="text-[10px] sm:text-xs font-bold tracking-widest text-amber-800 uppercase font-serif">
                MSK Institute of Technology & Computer Skills
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 font-serif tracking-tight mt-1">
                CERTIFICATE OF TYPING PROFICIENCY
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 mt-1 uppercase tracking-widest">
                This is proudly presented to
              </p>
            </div>

            {/* Recipient Name & Verification Status */}
            <div className="text-center my-1 sm:my-2">
              <div
                className={`text-xl sm:text-3xl md:text-4xl font-extrabold font-serif tracking-wide border-b-2 inline-block px-4 pb-1 ${
                  canDownload
                    ? 'text-orange-600 border-amber-500/70'
                    : 'text-slate-400 border-slate-300 italic'
                }`}
              >
                {canDownload ? recipientName.toUpperCase() : 'YOUR NAME HERE'}
              </div>

              <div className="text-[10px] sm:text-xs font-mono font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                {isEnrolledMode && verifiedStudent
                  ? `Verified MSK Student ID: ${verifiedStudent.studentId.toUpperCase()}`
                  : `Open Learner Credential ID: ${certId}`}
              </div>

              <p className="text-[10px] sm:text-xs text-slate-700 mt-1.5 max-w-lg mx-auto">
                for demonstrating verified touch typing mastery and excellence on MSK TypeQuest.
              </p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-900 border border-amber-500/40">
                {proficiency.title} • {proficiency.badge}
              </span>
            </div>

            {/* Metric Display Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto my-1 sm:my-2 w-full">
              <div className="bg-white/90 border border-slate-300 rounded-lg p-2 text-center shadow-sm">
                <div className="text-lg sm:text-2xl font-black text-orange-600 font-mono">
                  {certWpm}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                  WPM Speed
                </div>
              </div>

              <div className="bg-white/90 border border-slate-300 rounded-lg p-2 text-center shadow-sm">
                <div className="text-lg sm:text-2xl font-black text-emerald-600 font-mono">
                  {certAccuracy}%
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                  Accuracy
                </div>
              </div>

              <div className="bg-white/90 border border-slate-300 rounded-lg p-2 text-center shadow-sm">
                <div className="text-lg sm:text-2xl font-black text-slate-800 font-mono">
                  Lvl {gamification.level}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                  Standing
                </div>
              </div>
            </div>

            {/* Bottom Row: QR Code and Signature */}
            <div className="flex items-end justify-between px-2 sm:px-6 pt-1 sm:pt-2 border-t border-slate-300/80">
              {/* QR Verification Area */}
              <div className="flex items-center gap-2.5">
                <div
                  ref={qrCanvasRef}
                  className="bg-white p-1 rounded-md border border-slate-300 shadow-sm"
                >
                  <QRCodeCanvas
                    value={verifyUrl}
                    size={48}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-600 leading-tight">
                  <div className="font-mono font-bold text-slate-800">{certId}</div>
                  <div>Issued: {certDate}</div>
                  <div className="text-slate-500 font-medium">Scan to verify credential</div>
                </div>
              </div>

              {/* Signature Line */}
              <div className="text-center">
                <div className="font-serif italic text-sm sm:text-base font-bold text-slate-800 border-b border-slate-400 pb-0.5 px-4">
                  MSK Academy
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase mt-0.5">
                  Academic Director
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">MSK Certified Board</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {canDownload ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">
                  Certificate ready for <strong>{recipientName}</strong> ({certWpm} WPM, {certAccuracy}% Acc).
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">
                  {isEnrolledMode ? 'Valid Student ID required' : 'Enter your name to unlock certificate'}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Share typing certificate on WhatsApp status"
            >
              <span>Share on WhatsApp</span>
            </button>

            {/* Copy Share Link */}
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              disabled={!canDownload || isGenerating}
              onClick={handleDownloadPdf}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
                canDownload && !isGenerating
                  ? 'bg-gradient-to-r from-secondary to-orange-500 hover:from-secondary/90 hover:to-orange-600 text-white shadow-secondary/25 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>
                {isGenerating
                  ? 'Generating PDF...'
                  : canDownload
                  ? 'Download Certificate PDF'
                  : isEnrolledMode
                  ? 'Student ID Required'
                  : 'Enter Name to Download'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

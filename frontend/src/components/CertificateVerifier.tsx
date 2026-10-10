'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import { Search, Printer, CheckCircle, AlertTriangle, ShieldCheck, Award, Calendar, RefreshCw } from 'lucide-react';
import { fetchCertificateById, fetchStudentById, fetchCourses } from '@/services/api';
import { Certificate, Student, Course } from '@/types';
import { trackCertificateVerification } from '@/lib/tracking';
import WebShareButton from '@/components/WebShareButton';

function CertificateVerifierContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || '';

  const [certId, setCertId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  const handleSearch = async (idToSearch: string) => {
    if (!idToSearch.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    setCertificate(null);
    setStudent(null);
    setCourse(null);

    // Sync query parameters with routing
    router.replace(`/verify-certificate?id=${encodeURIComponent(idToSearch.trim())}`);

    try {
      const cert = await fetchCertificateById(idToSearch.trim());
      if (cert) {
        setCertificate(cert);

        // Perform joins for UI display
        const [std, allCourses] = await Promise.all([
          fetchStudentById(cert.studentId),
          fetchCourses()
        ]);

        if (std) setStudent(std);
        
        const matchedCourse = allCourses.find(c => c.slug === cert.courseSlug);
        if (matchedCourse) setCourse(matchedCourse);
        
        if (cert.status === 'valid') {
          toast.success('Certificate verified successfully!');
        } else {
          toast.error('Warning: This certificate has been revoked.');
        }
        trackCertificateVerification(idToSearch.trim(), cert.status === 'valid');
      } else {
        toast.error('No certificate found matching that ID.');
        trackCertificateVerification(idToSearch.trim(), false);
      }
    } catch (error) {
      console.error('Verification query failure:', error);
      toast.error('Failed to perform verification check. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const handlePrint = () => {
    window.print();
  };

  // Compile dynamic verification URL for the QR code
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify-certificate?id=${encodeURIComponent(certificate?.id || '')}` 
    : `https://www.mskinstitute.in/verify-certificate?id=${encodeURIComponent(certificate?.id || '')}`;

  return (
    <div className="space-y-12">
      {/* 1. Search Box Component */}
      <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm max-w-xl mx-auto space-y-4 no-print">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          Enter Certificate ID to Verify
        </h2>
        <p className="text-xs text-text-muted">
          Provide the unique certificate reference number printed at the bottom of the certificate (e.g., <code>MSK-2026-0001</code>).
        </p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(certId);
          }} 
          className="flex flex-col sm:flex-row gap-2 pt-2"
        >
          <div className="relative flex-grow">
            <label htmlFor="verify-cert-id" className="sr-only">Enter Certificate ID to Verify</label>
            <Search className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <input
              id="verify-cert-id"
              type="text"
              placeholder="e.g. MSK-2026-0001"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-subtle rounded-lg text-sm text-text-main font-semibold focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Authenticity'
            )}
          </button>
        </form>
      </div>

      {/* 2. Verification Details View */}
      {loading && (
        <div className="text-center py-12 no-print">
          <RefreshCw className="w-10 h-10 text-secondary animate-spin mx-auto mb-3" />
          <p className="text-text-muted font-medium">Validating credentials against database registry...</p>
        </div>
      )}

      {/* Verification Card Results */}
      {!loading && searched && certificate && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Status Alert (No Print) */}
          <div className="no-print">
            {certificate.status === 'valid' ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Valid Credential Verified</h4>
                  <p className="text-xs mt-0.5 text-green-700">
                    This certificate is official and registered in the MSK Institute database. The recipient completed the coursework program and passed the evaluations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Credential Revoked / Suspended</h4>
                  <p className="text-xs mt-0.5 text-red-700">
                    Warning: This certificate has been flagged as revoked or suspended in our registry. Please contact administration for verification.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Certificate Container (A4 print optimized layout) */}
          <div className="certificate-container bg-white border-[12px] border-double border-primary p-8 sm:p-16 rounded-xl shadow-md relative overflow-hidden flex flex-col items-center text-center gap-8 min-h-[500px]">
            {/* Corner Decorative Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-secondary/40 pointer-events-none" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-secondary/40 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-secondary/40 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-secondary/40 pointer-events-none" />

            {/* Header branding */}
            <div className="space-y-1">
              <span className="text-xs tracking-widest font-black uppercase text-secondary">Certificate of Excellence</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                MSK INSTITUTE OF TECHNOLOGY
              </h1>
              <p className="text-[10px] text-text-muted font-bold tracking-wider uppercase">
                SHIKOHABAD, UTTAR PRADESH, INDIA
              </p>
            </div>

            {/* Middle Title */}
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm italic font-serif text-text-muted">
                This is to certify that the student
              </p>
              <h2 className="text-3xl font-black text-primary border-b-2 border-secondary/30 pb-1.5 px-4 w-fit mx-auto">
                {student?.name || 'Rahul Kumar'}
              </h2>
              <p className="text-sm leading-relaxed text-text-muted">
                has successfully completed all requirements for the professional training course
              </p>
              <h3 className="text-xl font-bold text-primary">
                {course?.title || 'Python Programming Masterclass'}
              </h3>
              <p className="text-sm text-text-muted">
                conducted at our training facility, achieving a final evaluation mark of{' '}
                <strong className="text-secondary">{certificate.grade} ({certificate.gradeLabel})</strong>.
              </p>
            </div>

            {/* Footer stamp, signature, and QR code */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 items-end gap-6 pt-6 border-t border-border-subtle mt-4">
              {/* Dynamic Verification QR code */}
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="p-1.5 border border-border-subtle bg-white rounded shadow-sm">
                  <QRCodeSVG value={verificationUrl} size={90} />
                </div>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                  Scan to Verify Online
                </span>
              </div>

              {/* Unique ID Stamp */}
              <div className="flex flex-col items-center justify-center text-xs">
                <div className="flex items-center gap-1 text-[10px] font-black text-secondary uppercase tracking-widest">
                  <Award className="w-4 h-4" />
                  Official Credential
                </div>
                <span className="font-mono font-bold text-primary mt-1 text-sm bg-surface px-2.5 py-1 border border-border-subtle rounded">
                  {certificate.id}
                </span>
                <span className="text-[9px] text-text-muted mt-1 uppercase font-semibold">
                  Completion Date: {certificate.completionDate}
                </span>
              </div>

              {/* Signature Line */}
              <div className="flex flex-col items-center justify-end text-xs">
                <div className="font-serif italic text-primary font-bold text-base border-b border-primary/50 w-36 pb-1">
                  {certificate.instructor}
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1.5">
                  Authorized Director
                </span>
                <span className="text-[9px] text-text-muted mt-0.5 uppercase font-medium">
                  {certificate.organization}
                </span>
              </div>
            </div>
          </div>

          {/* Action button (No Print) */}
          <div className="flex flex-wrap justify-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-lg shadow hover:shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4.5 h-4.5" />
              Print Certificate (A4 PDF)
            </button>

            <WebShareButton
              title={`MSK Institute Verified Certificate - ${student?.name || 'Student'}`}
              text={`Authentic graduation certificate verified for ${student?.name || 'Student'} in ${course?.title || 'Certification Course'} at MSK Institute.`}
              label="Share Credential"
              className="!border-border-subtle"
            />

            <button
              onClick={() => {
                setCertificate(null);
                setSearched(false);
                setCertId('');
                router.replace('/verify-certificate');
              }}
              className="px-6 py-3 border border-border-subtle hover:bg-surface text-text-muted hover:text-primary rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
            >
              Verify Another Certificate
            </button>
          </div>
        </div>
      )}

      {/* 3. Empty Searched State */}
      {!loading && searched && !certificate && (
        <div className="text-center py-16 bg-white border border-border-subtle rounded-xl shadow-sm max-w-xl mx-auto no-print">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-primary">Certificate Not Found</h3>
          <p className="text-text-muted text-sm mt-1 max-w-md mx-auto px-4">
            We were unable to locate any student certificate record matching the ID <strong>"{certId}"</strong>. Please verify the ID format and try again.
          </p>
          <button
            onClick={() => {
              setSearched(false);
              setCertId('');
            }}
            className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg shadow"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default function CertificateVerifier() {
  return (
    <Suspense 
      fallback={
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-secondary animate-spin mx-auto mb-2" />
          <p className="text-text-muted text-sm">Loading verification subsystem...</p>
        </div>
      }
    >
      <CertificateVerifierContent />
    </Suspense>
  );
}

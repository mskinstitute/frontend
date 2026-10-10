'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Database, Plus, Trash2, Edit2, ShieldAlert, Award, 
  BookOpen, Download, Power, RefreshCw, CheckCircle, XCircle,
  Activity, BarChart2, Smartphone, Users, FileCheck, HelpCircle
} from 'lucide-react';
import { Course, Certificate, Student } from '@/types';
import { fetchCourses, fetchCertificateById } from '@/services/api';
import { getLocalAnalyticsEvents } from '@/lib/tracking';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'analytics'>('courses');
  const [analyticsEvents, setAnalyticsEvents] = useState<Array<{ event: string; params: Record<string, any>; timestamp: string; url: string }>>([]);
  
  // Local Database States
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states - Course
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSlug, setCourseSlug] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [courseMode, setCourseMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('OFFLINE');
  const [courseDuration, setCourseDuration] = useState('3');
  const [courseType, setCourseType] = useState<'SINGLE' | 'COMBO'>('SINGLE');
  const [selectedIncludedCourseIds, setSelectedIncludedCourseIds] = useState<string[]>([]);

  // Form states - Certificate
  const [showCertModal, setShowCertModal] = useState(false);
  const [certId, setCertId] = useState('');
  const [certStudentId, setCertStudentId] = useState('std-001');
  const [certCourseSlug, setCertCourseSlug] = useState('python-mastery-beginner-to-advanced--3-months');
  const [certGrade, setCertGrade] = useState('A+');
  const [certGradeLabel, setCertGradeLabel] = useState('Outstanding');

  useEffect(() => {
    async function loadData() {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);

        // Fetch mock certificates from local JSON file
        const certRes = await fetch('/data/certificates.json');
        if (certRes.ok) {
          const certs = await certRes.json();
          setCertificates(certs);
        }

        // Load local tracking events
        setAnalyticsEvents(getLocalAnalyticsEvents());
      } catch (err) {
        console.error('Failed to load admin registry:', err);
        toast.error('Failed to fetch initial configuration database.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshAnalytics = () => {
    setAnalyticsEvents(getLocalAnalyticsEvents());
    toast.success('Analytics logs refreshed');
  };

  const clearAnalytics = () => {
    try {
      localStorage.removeItem('msk_analytics_events');
      setAnalyticsEvents([]);
      toast.success('Local analytics logs cleared');
    } catch {
      toast.error('Failed to clear storage');
    }
  };

  // Course Add Action
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseSlug.trim() || !courseDesc.trim()) {
      toast.error('Please fill in all course parameters');
      return;
    }

    if (courseType === 'COMBO' && selectedIncludedCourseIds.length === 0) {
      toast.error('Please select at least one included course for a Combo bundle');
      return;
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      status: 'PUBLISH',
      title: courseTitle.trim(),
      slug: courseSlug.trim().toLowerCase(),
      featuredImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      shortDescription: courseDesc.trim(),
      categories: courseType === 'COMBO' ? ['Combo', 'Certification'] : ['Coding', 'Web Development'],
      level: courseLevel,
      language: ['Hindi', 'English'],
      duration: {
        value: parseInt(courseDuration) || 3,
        unit: 'MONTHS'
      },
      certificate: true,
      mode: courseMode,
      courseType: courseType,
      ...(courseType === 'COMBO'
        ? {
            includedCourseIds: selectedIncludedCourseIds,
            // DO NOT use/store chapters in combo course
          }
        : {
            chapters: [
              {
                id: `ch-${Date.now()}`,
                title: 'Introduction Chapter',
                sortOrder: 1,
                topics: [
                  {
                    id: `topic-${Date.now()}`,
                    title: 'Getting Started Guide',
                    sortOrder: 1
                  }
                ]
              }
            ]
          }
      )
    };

    setCourses([newCourse, ...courses]);
    toast.success(`Simulated ${courseType === 'COMBO' ? 'Combo Course' : 'Single Course'} added!`);
    setShowCourseModal(false);
    
    // Reset form
    setCourseTitle('');
    setCourseSlug('');
    setCourseDesc('');
    setCourseDuration('3');
    setCourseType('SINGLE');
    setSelectedIncludedCourseIds([]);
  };

  // Course Remove Action
  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success('Course removed from local memory.');
  };

  // Course Toggle Status Action
  const handleToggleCourseStatus = (id: string) => {
    setCourses(courses.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'PUBLISH' ? 'DRAFT' : 'PUBLISH' } 
        : c
    ));
    toast.success('Course publication status toggled!');
  };

  // Certificate Add Action
  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) {
      toast.error('Certificate ID is required');
      return;
    }
    if (certificates.some(c => c.id.trim().toLowerCase() === certId.trim().toLowerCase())) {
      toast.error('A certificate with this ID already exists');
      return;
    }

    const newCert: Certificate = {
      id: certId.trim().toUpperCase(),
      studentId: certStudentId,
      courseSlug: certCourseSlug,
      issueDate: new Date().toISOString().split('T')[0],
      completionDate: new Date().toISOString().split('T')[0],
      grade: certGrade,
      gradeLabel: certGradeLabel,
      status: 'valid',
      instructor: 'M. S. Khan',
      organization: 'MSK Institute of Technology'
    };

    setCertificates([newCert, ...certificates]);
    toast.success('Certificate registered in memory registry!');
    setShowCertModal(false);
    setCertId('');
  };

  // Certificate Revoke Action
  const handleToggleCertificateStatus = (id: string) => {
    setCertificates(certificates.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'valid' ? 'revoked' : 'valid' } 
        : c
    ));
    toast.success('Certificate validity status toggled!');
  };

  // Certificate Delete Action
  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter(c => c.id !== id));
    toast.success('Certificate removed from registry memory.');
  };

  // Helper to trigger JSON file download
  const downloadJson = (data: any, filename: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`${filename} download triggered! Replace the local file in /public/data/`);
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <RefreshCw className="w-10 h-10 text-secondary animate-spin mx-auto mb-3" />
        <p className="text-text-muted font-medium">Loading developer dashboard consoles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Dashboard Title banner */}
      <div className="bg-primary text-white p-8 rounded-2xl border border-primary-light flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Database className="w-6 h-6 text-secondary" />
            Developer Database Pre-integration Console
          </h1>
          <p className="text-sm text-gray-300">
            Simulate and compile JSON data structures before setting up the live Python (FastAPI/Django) backend.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadJson(courses, 'all-courses.json')}
            className="px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            Save all-courses.json
          </button>
          <button
            onClick={() => downloadJson(certificates, 'certificates.json')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            Save certificates.json
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-4">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'courses'
              ? 'border-secondary text-secondary font-black'
              : 'border-transparent text-text-muted hover:text-primary'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          Manage Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'certificates'
              ? 'border-secondary text-secondary font-black'
              : 'border-transparent text-text-muted hover:text-primary'
          }`}
        >
          <Award className="w-4.5 h-4.5" />
          Manage Certificates ({certificates.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('analytics');
            setAnalyticsEvents(getLocalAnalyticsEvents());
          }}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-secondary text-secondary font-black'
              : 'border-transparent text-text-muted hover:text-primary'
          }`}
        >
          <Activity className="w-4.5 h-4.5 text-secondary" />
          Live Analytics & Tracking ({analyticsEvents.length})
        </button>
      </div>

      {/* Course management view */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Pre-Rendered Courses</h2>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
              Add Simulated Course
            </button>
          </div>

          <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface border-b border-border-subtle text-text-muted font-bold text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Course Title / Slug</th>
                    <th className="px-6 py-3">Type / Structure</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Level</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-medium">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-surface/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary">{course.title}</div>
                        <div className="text-xs text-text-muted">Slug: {course.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        {course.courseType === 'COMBO' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            COMBO ({course.includedCourseIds?.length || 0} Courses)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                            SINGLE ({course.chapters?.length || 0} Modules)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{course.duration.value} {course.duration.unit}</td>
                      <td className="px-6 py-4 text-xs font-semibold">{course.mode}</td>
                      <td className="px-6 py-4 text-xs font-semibold">{course.level}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${
                            course.status === 'PUBLISH'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleCourseStatus(course.id)}
                          className="p-1 rounded bg-surface hover:bg-secondary/10 hover:text-secondary text-text-muted transition-colors cursor-pointer"
                          title="Toggle Status (Publish/Draft)"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1 rounded bg-surface hover:bg-red-50 hover:text-red-600 text-text-muted transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Certificate management view */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Certificate Registry Pool</h2>
            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
              Issue New Certificate
            </button>
          </div>

          <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface border-b border-border-subtle text-text-muted font-bold text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Certificate ID</th>
                    <th className="px-6 py-3">Student Ref</th>
                    <th className="px-6 py-3">Course Slug</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Registry Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-medium">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-surface/50">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{cert.id}</td>
                      <td className="px-6 py-4">{cert.studentId}</td>
                      <td className="px-6 py-4 text-xs text-text-muted">{cert.courseSlug}</td>
                      <td className="px-6 py-4 font-semibold text-secondary">{cert.grade} ({cert.gradeLabel})</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded ${
                            cert.status === 'valid'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {cert.status === 'valid' ? (
                            <>
                              <CheckCircle className="w-3 h-3 flex-shrink-0" />
                              Valid
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 flex-shrink-0" />
                              Revoked
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleCertificateStatus(cert.id)}
                          className="p-1 rounded bg-surface hover:bg-secondary/10 hover:text-secondary text-text-muted transition-colors cursor-pointer"
                          title="Toggle Status (Valid/Revoke)"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="p-1 rounded bg-surface hover:bg-red-50 hover:text-red-600 text-text-muted transition-colors cursor-pointer"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics & Tracking Telemetry View */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Live Event Tracking & Telemetry Stream
              </h2>
              <p className="text-xs text-text-muted">
                Captures real-time user interactions, GA4 dispatch events, lead submissions, PWA installs, and note downloads.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshAnalytics}
                className="px-3 py-2 bg-surface hover:bg-gray-100 text-text-main border border-border-subtle text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-secondary" />
                Refresh Events
              </button>
              <button
                onClick={clearAnalytics}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Local Logs
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Total Events</span>
                <Activity className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-black text-primary">{analyticsEvents.length}</div>
              <p className="text-[10px] text-text-muted">Captured in browser session</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Pageviews</span>
                <BarChart2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-primary">
                {analyticsEvents.filter(e => e.event === 'page_view').length}
              </div>
              <p className="text-[10px] text-text-muted">Client route transitions</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Leads & Bookings</span>
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-black text-primary">
                {analyticsEvents.filter(e => e.event.includes('booking') || e.event.includes('enrollment') || e.event.includes('lead')).length}
              </div>
              <p className="text-[10px] text-text-muted">Form conversions</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>PWA Actions</span>
                <Smartphone className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-primary">
                {analyticsEvents.filter(e => e.event.includes('pwa')).length}
              </div>
              <p className="text-[10px] text-text-muted">Install clicks & triggers</p>
            </div>
          </div>

          {/* Event Stream Log Table */}
          <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-surface/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-primary">Recent Events Log (Latest 100)</h3>
              <span className="text-xs text-text-muted font-medium">Google Analytics 4 Active (GA4)</span>
            </div>

            {analyticsEvents.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-sm space-y-2">
                <Activity className="w-8 h-8 mx-auto text-text-muted/50" />
                <p>No telemetry events logged yet.</p>
                <p className="text-xs">Navigate across pages, click contact links, or test forms to see real-time events appear.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface text-text-muted uppercase tracking-wider font-semibold">
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Event Action</th>
                      <th className="px-4 py-3">Route / URL</th>
                      <th className="px-4 py-3">Payload Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-mono">
                    {analyticsEvents.map((item, idx) => {
                      const timeStr = (() => {
                        try {
                          return new Date(item.timestamp).toLocaleTimeString();
                        } catch {
                          return item.timestamp;
                        }
                      })();

                      return (
                        <tr key={idx} className="hover:bg-surface/50 transition-colors">
                          <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">{timeStr}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              item.event.includes('booking') || item.event.includes('enrollment')
                                ? 'bg-green-100 text-green-800'
                                : item.event.includes('pwa')
                                ? 'bg-purple-100 text-purple-800'
                                : item.event.includes('contact')
                                ? 'bg-amber-100 text-amber-800'
                                : item.event.includes('certificate')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.event}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-text-main font-sans">{item.url || '/'}</td>
                          <td className="px-4 py-2.5 text-text-muted font-sans max-w-md truncate">
                            {JSON.stringify(item.params)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simulated Course Modal Form */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xl space-y-6 max-w-md w-full relative my-8">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:text-primary hover:bg-surface cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary flex items-center gap-1.5">
              <BookOpen className="w-5.5 h-5.5 text-secondary" />
              Add Simulated Course
            </h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="admin-course-type" className="text-xs font-bold text-text-muted uppercase block">Course Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCourseType('SINGLE')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      courseType === 'SINGLE'
                        ? 'bg-secondary text-white border-secondary shadow-sm'
                        : 'bg-surface text-text-muted border-border-subtle hover:bg-gray-100'
                    }`}
                  >
                    Single Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseType('COMBO')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      courseType === 'COMBO'
                        ? 'bg-secondary text-white border-secondary shadow-sm'
                        : 'bg-surface text-text-muted border-border-subtle hover:bg-gray-100'
                    }`}
                  >
                    Combo Bundle
                  </button>
                </div>
              </div>

              {courseType === 'COMBO' && (
                <div className="space-y-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <label className="text-xs font-bold text-amber-900 uppercase block">
                    Select Included Courses ({selectedIncludedCourseIds.length} selected)
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {courses.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-xs text-text-main cursor-pointer hover:bg-white p-1 rounded">
                        <input
                          type="checkbox"
                          checked={selectedIncludedCourseIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIncludedCourseIds([...selectedIncludedCourseIds, c.id]);
                            } else {
                              setSelectedIncludedCourseIds(selectedIncludedCourseIds.filter((id) => id !== c.id));
                            }
                          }}
                          className="rounded text-secondary focus:ring-secondary"
                        />
                        <span className="truncate">{c.title}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-700 italic">
                    * Chapters are not stored or shown for Combo courses; included courses will be shown instead.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="admin-course-title" className="text-xs font-bold text-text-muted uppercase block">Course Title</label>
                <input
                  id="admin-course-title"
                  type="text"
                  required
                  placeholder="e.g. Adv Database Administration"
                  value={courseTitle}
                  onChange={(e) => {
                    setCourseTitle(e.target.value);
                    setCourseSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
                  }}
                  className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-course-slug" className="text-xs font-bold text-text-muted uppercase block">Url Slug</label>
                <input
                  id="admin-course-slug"
                  type="text"
                  required
                  placeholder="e.g. database-admin"
                  value={courseSlug}
                  onChange={(e) => setCourseSlug(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="admin-course-duration" className="text-xs font-bold text-text-muted uppercase block">Duration (Months)</label>
                  <input
                    id="admin-course-duration"
                    type="number"
                    required
                    min="1"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-course-level" className="text-xs font-bold text-text-muted uppercase block">Difficulty Level</label>
                  <select
                    id="admin-course-level"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-course-mode" className="text-xs font-bold text-text-muted uppercase block">Learning Mode</label>
                <select
                  id="admin-course-mode"
                  value={courseMode}
                  onChange={(e) => setCourseMode(e.target.value as any)}
                  className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                >
                  <option value="ONLINE">Online Only</option>
                  <option value="OFFLINE">Offline Classroom</option>
                  <option value="BOTH">Online & Offline</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-course-desc" className="text-xs font-bold text-text-muted uppercase block">Short Description</label>
                <textarea
                  id="admin-course-desc"
                  required
                  rows={3}
                  placeholder="Summarize course goals..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-secondary hover:bg-secondary-light text-white font-bold rounded-lg shadow cursor-pointer transition-colors"
              >
                Simulate Addition
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Certificate Modal Form */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xl space-y-6 max-w-md w-full relative">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:text-primary hover:bg-surface cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary flex items-center gap-1.5">
              <Award className="w-5.5 h-5.5 text-secondary" />
              Issue New Certificate
            </h3>
            <form onSubmit={handleAddCertificate} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="admin-cert-id" className="text-xs font-bold text-text-muted uppercase block">Certificate ID</label>
                <input
                  id="admin-cert-id"
                  type="text"
                  required
                  placeholder="e.g. MSK-2026-0004"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="admin-cert-studentid" className="text-xs font-bold text-text-muted uppercase block">Student ID</label>
                  <select
                    id="admin-cert-studentid"
                    value={certStudentId}
                    onChange={(e) => setCertStudentId(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                  >
                    <option value="std-001">std-001 (Rahul Kumar)</option>
                    <option value="std-002">std-002 (Priya Sharma)</option>
                    <option value="std-003">std-003 (Amit Singh)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-cert-courseslug" className="text-xs font-bold text-text-muted uppercase block">Course Program</label>
                  <select
                    id="admin-cert-courseslug"
                    value={certCourseSlug}
                    onChange={(e) => setCertCourseSlug(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="admin-cert-grade" className="text-xs font-bold text-text-muted uppercase block">Grade</label>
                  <input
                    id="admin-cert-grade"
                    type="text"
                    required
                    placeholder="e.g. A+"
                    value={certGrade}
                    onChange={(e) => setCertGrade(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-cert-gradelabel" className="text-xs font-bold text-text-muted uppercase block">Grade Label</label>
                  <input
                    id="admin-cert-gradelabel"
                    type="text"
                    required
                    placeholder="e.g. Outstanding"
                    value={certGradeLabel}
                    onChange={(e) => setCertGradeLabel(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-secondary hover:bg-secondary-light text-white font-bold rounded-lg shadow cursor-pointer transition-colors"
              >
                Register Simulated Certificate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

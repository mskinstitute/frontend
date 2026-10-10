'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, ArrowRight, ArrowLeft, CheckCircle2, 
  Sparkles, Award, Clock, DollarSign, Send, RotateCcw, 
  Briefcase, Laptop, GraduationCap, Building2, PhoneCall
} from 'lucide-react';

interface WizardState {
  education: string;
  goal: string;
  timeCommitment: string;
  mode: string;
}

interface CourseMatch {
  title: string;
  slug: string;
  duration: string;
  badge: string;
  salaryRange: string;
  description: string;
  targetRoles: string[];
  keyHighlights: string[];
}

export default function CareerFinderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<WizardState>({
    education: '',
    goal: '',
    timeCommitment: '',
    mode: '',
  });

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (key: keyof WizardState, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Recommendation Logic
  const getRecommendation = (): CourseMatch => {
    const { goal, timeCommitment } = answers;

    if (goal === 'govt_job') {
      return {
        title: 'NIELIT CCC (Basic Computer Course) & Office Automation',
        slug: 'ccc',
        duration: '3 Months',
        badge: 'Government Job Essential',
        salaryRange: '₹2.4 LPA – ₹4.8 LPA (State/Central Govt)',
        description: 'Mandatory computer qualification required for UP Police, Lekhpal, VDO, and clerical government recruitments.',
        targetRoles: ['UP Govt Clerk / Assistant', 'Lekhpal / VDO', 'Computer Operator'],
        keyHighlights: [
          'Complete preparation for official NIELIT exam pattern.',
          'LibreOffice Writer, Calc, Impress & Windows/Linux fundamentals.',
          '100% Pass Guarantee with mock tests and previous papers.'
        ]
      };
    }

    if (goal === 'coding_it') {
      if (timeCommitment === 'long') {
        return {
          title: 'Full-Stack Web Development Grand Mastery (MERN Stack)',
          slug: 'full-stack-mern-mastery--12-months',
          duration: '12 Months',
          badge: 'High-Demand Career Track',
          salaryRange: '₹4.5 LPA – ₹12.0 LPA',
          description: 'End-to-end software development curriculum taking you from HTML/CSS to React, Node.js, Express, MongoDB, and production SaaS deployment.',
          targetRoles: ['Full-Stack MERN Developer', 'Frontend Engineer', 'Backend Node.js Developer'],
          keyHighlights: [
            'Build 10+ live full-stack capstone projects.',
            'Direct mentorship by Er. Sumit Kumar (8+ yrs industry experience).',
            'Placement guidance, GitHub portfolio building & interview preparation.'
          ]
        };
      } else {
        return {
          title: 'Python Programming Mastery (Beginner to Advanced)',
          slug: 'python-mastery-beginner-to-advanced--3-months',
          duration: '3 Months',
          badge: 'Most Popular for Beginners',
          salaryRange: '₹3.5 LPA – ₹8.0 LPA',
          description: 'Master core Python, object-oriented architecture, data structures, algorithms, and automated scripting.',
          targetRoles: ['Junior Python Developer', 'Backend Software Trainee', 'Automation Engineer'],
          keyHighlights: [
            'Zero prerequisite required — starts from basic logic to advanced OOP.',
            '100% practical lab assignments with real code debugging.',
            'Official MSK Institute Verified Certificate with QR validation.'
          ]
        };
      }
    }

    if (goal === 'data_analytics') {
      return {
        title: 'Data Analysis Mastery Combo Course (Excel + SQL + Power BI + Python)',
        slug: 'data-analysis-mastery-combo-course--12-months',
        duration: '12 Months',
        badge: 'Fastest Growing Corporate Field',
        salaryRange: '₹4.0 LPA – ₹9.5 LPA',
        description: 'Learn to extract, clean, and visualize data using Advanced Excel, SQL queries, interactive Power BI dashboards, and Python analytics.',
        targetRoles: ['Data Analyst', 'Business Intelligence Developer', 'MIS Executive'],
        keyHighlights: [
          'Create real corporate dashboards with DAX and Power BI.',
          'Perform complex database queries with SQL & MySQL.',
          'Practical case studies from retail, finance, and manufacturing.'
        ]
      };
    }

    // Default or general office/diploma goal:
    return {
      title: 'ADCA - Advance Diploma in Computer Applications (1-Year Diploma)',
      slug: 'adca',
      duration: '12 Months (2 Semesters)',
      badge: 'All-in-One Professional Diploma',
      salaryRange: '₹2.8 LPA – ₹5.5 LPA',
      description: 'Comprehensive 1-year diploma covering office automation, advanced Excel, Tally accounting, graphic design fundamentals, and web basics.',
      targetRoles: ['Office Executive', 'Computer Lab Incharge', 'Accounting Assistant', 'Data Entry Specialist'],
      keyHighlights: [
        'Complete 2-Semester university-style curriculum.',
        'Official 1-Year Diploma Certificate recognized in public & private sectors.',
        'Hands-on typing in Hindi & English + accounting with Tally Prime.'
      ]
    };
  };

  const recommendation = getRecommendation();

  const handleWhatsAppContact = () => {
    const text = `Hello Er. Sumit Kumar, I used the MSK Course Finder Quiz on your website! My Education is ${answers.education || 'Student'} and my goal is ${answers.goal || 'Career'}. I was recommended the ${recommendation.title}. Please share the fee details and upcoming batch timing in Shikohabad.`;
    window.open(`https://api.whatsapp.com/send?phone=918393042166&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress Bar */}
      {currentStep <= 4 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-text-muted">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-surface h-2.5 rounded-full overflow-hidden border border-border-subtle">
            <div 
              className="bg-secondary h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Education Level */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Step 1: Background</span>
            <h2 className="text-2xl font-black text-primary">What is your current education level?</h2>
            <p className="text-xs text-text-muted">This helps us tailor curriculum difficulty so you never feel overwhelmed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: '10th_12th', label: '10th / 12th Pass or School Student', desc: 'Starting your first professional computer course' },
              { id: 'college', label: 'Pursuing Degree (BA / BSc / BCom / BTech / BCA)', desc: 'Want job-ready skills alongside college studies' },
              { id: 'graduate', label: 'Graduate / Job Seeker', desc: 'Seeking immediate career skills or government job eligibility' },
              { id: 'working', label: 'Working Professional', desc: 'Looking to upskill or transition into tech & coding' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect('education', item.id)}
                className="p-5 rounded-2xl border border-border-subtle bg-white hover:bg-surface hover:border-secondary/40 text-left transition-all space-y-1.5 cursor-pointer group shadow-2xs"
              >
                <div className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                  {item.label}
                </div>
                <div className="text-xs text-text-muted">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Primary Goal */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Step 2: Ambition</span>
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary">What is your primary career goal?</h2>
            <p className="text-xs text-text-muted">Select the outcome that matters most to you right now.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: 'govt_job', label: 'Government Job Qualification', desc: 'Need certified CCC / computer diploma for UP Police, Lekhpal, VDO' },
              { id: 'coding_it', label: 'High-Paying IT / Software Job', desc: 'Become a Full-Stack MERN or Python Software Developer' },
              { id: 'data_analytics', label: 'Data Analysis & Corporate MIS', desc: 'Master Excel, SQL, and Power BI business dashboards' },
              { id: 'office_admin', label: 'Office Accounting & Administration', desc: 'Learn MS Office, 1-Year ADCA diploma, and professional typing' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect('goal', item.id)}
                className="p-5 rounded-2xl border border-border-subtle bg-white hover:bg-surface hover:border-secondary/40 text-left transition-all space-y-1.5 cursor-pointer group shadow-2xs"
              >
                <div className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                  {item.label}
                </div>
                <div className="text-xs text-text-muted">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Time Horizon */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Step 3: Duration</span>
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary">How much time can you invest in training?</h2>
            <p className="text-xs text-text-muted">Choose your desired learning timeline.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'short', label: '1 to 3 Months', desc: 'Fast-track certification or focused skill specialization' },
              { id: 'medium', label: '4 to 6 Months', desc: 'Comprehensive bootcamp with project labs' },
              { id: 'long', label: '12 Months (1 Year)', desc: 'Complete multi-semester diploma from zero to professional mastery' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect('timeCommitment', item.id)}
                className="p-5 rounded-2xl border border-border-subtle bg-white hover:bg-surface hover:border-secondary/40 text-left transition-all space-y-1.5 cursor-pointer group shadow-2xs"
              >
                <div className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                  {item.label}
                </div>
                <div className="text-xs text-text-muted">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Learning Mode */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Step 4: Location</span>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary">How would you prefer to attend classes?</h2>
            <p className="text-xs text-text-muted">MSK Institute offers hybrid offline and online learning models.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { 
                id: 'offline', 
                label: 'In-Person Lab at Shikohabad Campus', 
                desc: 'Station Road Area campus with 1-student-1-PC policy, air-conditioned lab, and in-person mentor guidance.' 
              },
              { 
                id: 'online', 
                label: 'Interactive Live Classes from Home', 
                desc: 'Real-time lectures on Google Meet / Zoom with screen sharing, recordings, and live doubt clearance.' 
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, mode: item.id }));
                  setCurrentStep(5); // Show result
                }}
                className="p-6 rounded-2xl border border-border-subtle bg-white hover:bg-surface hover:border-secondary text-left transition-all space-y-2 cursor-pointer group shadow-2xs"
              >
                <div className="font-bold text-base text-primary group-hover:text-secondary transition-colors flex items-center justify-between">
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-xs text-text-muted leading-relaxed">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Result Screen with Recommended Course */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-br from-white via-surface/30 to-white rounded-3xl border-2 border-secondary/30 p-6 sm:p-10 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#B83A00]/10 text-[#B83A00] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Best Recommended Match for You
              </span>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setAnswers({ education: '', goal: '', timeCommitment: '', mode: '' });
                }}
                className="text-xs font-semibold text-text-muted hover:text-secondary flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-text-muted bg-gray-100 px-2.5 py-0.5 rounded-full uppercase">
                  {recommendation.duration}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Expected Salary: {recommendation.salaryRange}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-primary">
                {recommendation.title}
              </h2>

              <p className="text-sm text-text-muted leading-relaxed">
                {recommendation.description}
              </p>
            </div>

            {/* Target Job Roles */}
            <div className="bg-surface/50 p-4 rounded-2xl border border-border-subtle space-y-2">
              <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-secondary" />
                Job Profiles You Can Apply For:
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendation.targetRoles.map((role) => (
                  <span key={role} className="text-xs font-semibold bg-white border border-border-subtle text-primary px-3 py-1 rounded-lg">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Why This Course */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Course Highlights:</h4>
              <ul className="space-y-1.5">
                {recommendation.keyHighlights.map((hl, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2 text-xs text-text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/courses/${recommendation.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
              >
                <span>View Full Course Syllabus & Fees</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleWhatsAppContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

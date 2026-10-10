export interface StudentProject {
  id: string;
  title: string;
  studentName: string;
  studentRole: string;
  batch: string;
  courseSlug: string;
  courseTitle: string;
  description: string;
  techStack: string[];
  category: 'Full-Stack' | 'Frontend' | 'Python' | 'Data Analytics' | 'Office & Automation';
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
  featured?: boolean;
}

export const STUDENT_PROJECTS: StudentProject[] = [
  {
    id: 'project-shikohabad-bazaar',
    title: 'Shikohabad Local Commerce & Grocery Marketplace',
    studentName: 'Rahul Verma & Team',
    studentRole: 'Full-Stack Trainee',
    batch: 'MERN Stack Cohort 2025-2026',
    courseSlug: 'full-stack-mern-mastery--12-months',
    courseTitle: 'Full-Stack MERN Stack Mastery',
    description: 'A full-featured hyperlocal marketplace enabling local retail vendors in Shikohabad to list inventory, receive customer orders via WhatsApp webhook, and track delivery status in real time.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT'],
    category: 'Full-Stack',
    githubUrl: 'https://github.com/MSK-Institute',
    highlights: [
      'JWT token authentication with customer and vendor portal roles.',
      'Cart management with local storage synchronization and stock validation.',
      'Instant order receipts with printable invoice and WhatsApp message dispatch.'
    ],
    featured: true
  },
  {
    id: 'project-institute-student-portal',
    title: 'Automated Student Attendance & Fee Management System',
    studentName: 'Priya Sharma',
    studentRole: 'Python Backend Trainee',
    batch: 'Python & Django Mastery Batch',
    courseSlug: 'full-stack-python-mastery--12-months',
    courseTitle: 'Full-Stack Python & Django Mastery',
    description: 'A robust educational ERP portal built with Python and Django. Manages student enrollments, tracks daily lab attendance, generates monthly fee receipts, and exports PDF performance transcripts.',
    techStack: ['Python', 'Django', 'PostgreSQL', 'Bootstrap 5', 'ReportLab PDF'],
    category: 'Python',
    githubUrl: 'https://github.com/MSK-Institute',
    highlights: [
      'Django ORM with custom models for courses, batches, attendance, and fee invoices.',
      'Role-based permissions for administrators, instructors, and student guardians.',
      'Automated PDF invoice generation and student attendance percentage tracking.'
    ],
    featured: true
  },
  {
    id: 'project-firozabad-glass-analytics',
    title: 'Firozabad Glass Industry Sales & Export Analytics Dashboard',
    studentName: 'Amit Kumar',
    studentRole: 'Data Analytics Trainee',
    batch: 'Data Analysis & BI Batch 2025',
    courseSlug: 'data-analysis-mastery-combo-course--12-months',
    courseTitle: 'Data Analysis Mastery Combo Course',
    description: 'An end-to-end business intelligence dashboard modeling 5 years of manufacturing, domestic distribution, and export data for glassware manufacturers across Firozabad district.',
    techStack: ['Power BI', 'DAX', 'SQL', 'Python (Pandas)', 'MS Excel'],
    category: 'Data Analytics',
    highlights: [
      'Custom DAX time-intelligence metrics for Year-over-Year (YoY) revenue and margin variance.',
      'Star schema data warehouse modeled across products, suppliers, customers, and time dimensions.',
      'Interactive executive drill-through pages highlighting supply chain bottlenecks.'
    ],
    featured: true
  },
  {
    id: 'project-health-clinic-appointment',
    title: 'MediCare OPD Appointment & Doctor Scheduling Web App',
    studentName: 'Neha Rajput',
    studentRole: 'Frontend Engineering Trainee',
    batch: 'Web Designing & Frontend Cohort',
    courseSlug: 'frontend-development--8-months',
    courseTitle: 'Frontend Development Mastery',
    description: 'A responsive, high-performance doctor booking interface designed for clinical practices. Features department filtering, dynamic time slot booking, instant form validation, and patient record storage.',
    techStack: ['React', 'JavaScript ES6+', 'Tailwind CSS', 'Lucide React'],
    category: 'Frontend',
    githubUrl: 'https://github.com/MSK-Institute',
    highlights: [
      'Dynamic calendar scheduler with unavailable time slot grey-out logic.',
      'Client-side state management using React hooks and context API.',
      'Fully responsive UI with accessible ARIA form attributes and toast alerts.'
    ],
    featured: true
  },
  {
    id: 'project-algo-visualizer',
    title: 'Interactive Sorting & Graph Algorithm Visualizer',
    studentName: 'Vikas Yadav',
    studentRole: 'DSA & Python Trainee',
    batch: 'DSA Mastery Program',
    courseSlug: 'dsa-mastery-course',
    courseTitle: 'Data Structures & Algorithms Mastery: Zero to FAANG',
    description: 'An educational visualizer that renders step-by-step memory swaps and comparisons for Bubble Sort, Merge Sort, Quick Sort, Dijkstra’s, and BFS/DFS graph traversals.',
    techStack: ['JavaScript', 'HTML5 Canvas', 'CSS Animations', 'Algorithms'],
    category: 'Python',
    githubUrl: 'https://github.com/MSK-Institute',
    highlights: [
      'Interactive speed sliders and step-by-step playback controls for algorithmic debugging.',
      'Dynamic bar height rendering with color-coded comparison and pivot indices.',
      'Time and space complexity cheat sheet integrated alongside live animations.'
    ]
  },
  {
    id: 'project-office-automation-suite',
    title: 'Commercial Billing & Inventory Reconciliation Toolkit',
    studentName: 'Kavita Singh',
    studentRole: 'ADCA Diploma Graduate',
    batch: 'ADCA 1-Year Diploma Batch',
    courseSlug: 'adca',
    courseTitle: 'ADCA - Advance Diploma in Computer Applications',
    description: 'A comprehensive office automation template suite using advanced MS Excel formulas, automated macros, and Tally Prime transaction templates for small retail enterprises.',
    techStack: ['MS Excel Advanced', 'XLOOKUP', 'VBA Macros', 'Tally Prime', 'MS Word Mail Merge'],
    category: 'Office & Automation',
    highlights: [
      'Automated inventory deduction spreadsheet using nested XLOOKUP and SUMIFS.',
      'One-click bulk invoice mail merge generating customer dispatch slips.',
      'Financial balance sheet and cash flow statement template compliant with GST formats.'
    ]
  }
];

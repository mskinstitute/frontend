export interface LearningPathStep {
  stepNumber: number;
  title: string;
  duration: string;
  courseSlug: string;
  courseTitle: string;
  description: string;
  skills: string[];
  deliverable: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  targetRole: string;
  duration: string;
  level: string;
  badge?: string;
  description?: string;
  salaryRange: string;
  certification: string;
  careerOutcomes: string[];
  prerequisites: string;
  steps: LearningPathStep[];
  featured?: boolean;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'full-stack-web-architect',
    slug: 'full-stack-web-architect',
    title: 'Full-Stack Web Architect Pathway',
    subtitle: 'From HTML/CSS fundamentals to production MERN stack systems and multi-stack software architecture.',
    targetRole: 'Full-Stack Developer, MERN Stack Engineer, React & Node.js Developer',
    duration: '6 to 18 Months',
    level: 'Beginner to Advanced',
    badge: 'Most Popular',
    salaryRange: '₹4.0 LPA – ₹12.0 LPA',
    certification: 'MSK Certified Full-Stack Web Architect Diploma + Project Portfolio',
    prerequisites: 'Basic computer literacy. No prior coding experience required.',
    careerOutcomes: [
      'Build end-to-end full-stack SaaS applications with React, Next.js, Node.js, Express, and MongoDB.',
      'Design, test, and deploy secure RESTful APIs with JWT authentication, role-based access control, and rate limiting.',
      'Implement responsive layouts, modern Tailwind CSS styling, state management, and optimized SEO.',
      'Master Git version control, CI/CD deployment pipelines on Vercel and VPS, and database indexing.'
    ],
    featured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Modern Responsive Web Design & Frontend Foundations',
        duration: '4 Months',
        courseSlug: 'web-designing-complete-pathway--4-months',
        courseTitle: 'Web Designing Complete Pathway',
        description: 'Master semantic HTML5, modern CSS3 (Flexbox, Grid), responsive layouts, Tailwind CSS, and DOM manipulation basics.',
        skills: ['HTML5 Semantic Markup', 'CSS3 Flexbox & Grid', 'Responsive Design', 'Tailwind CSS', 'Mobile First Design'],
        deliverable: 'Multi-page mobile-responsive business portfolio & e-commerce landing page'
      },
      {
        stepNumber: 2,
        title: 'JavaScript Deep Dive & Dynamic UI Development',
        duration: '4 Months',
        courseSlug: 'frontend-development--8-months',
        courseTitle: 'Frontend Development Mastery',
        description: 'Deep dive into modern ES6+ JavaScript, asynchronous operations (Promises, async/await), API integrations, and React.js components.',
        skills: ['JavaScript ES6+', 'Asynchronous Fetch API', 'React.js Components & Hooks', 'State Management', 'SPA Architecture'],
        deliverable: 'Interactive Web App with real-time API data fetching and state persistence'
      },
      {
        stepNumber: 3,
        title: 'Full-Stack MERN Engineering (Database & Server Systems)',
        duration: '6 Months',
        courseSlug: 'full-stack-mern-mastery--12-months',
        courseTitle: 'Full-Stack MERN Stack Mastery',
        description: 'Build robust backend architectures with Node.js, Express, MongoDB/Mongoose, and connect with React frontends.',
        skills: ['Node.js Runtime', 'Express.js Framework', 'MongoDB Schema & Aggregation', 'JWT Authentication', 'REST API Architecture'],
        deliverable: 'Complete full-stack e-commerce or institute management portal with user roles and payment mock'
      },
      {
        stepNumber: 4,
        title: 'Multi-Stack Architect & Production Deployment',
        duration: '4 Months',
        courseSlug: 'full-stack-development',
        courseTitle: 'Full-Stack Web Development Grand Mastery',
        description: 'Advanced software design patterns, TypeScript integration, Next.js App Router, caching strategies, and DevOps deployment.',
        skills: ['TypeScript', 'Next.js App Router', 'Server-Side Rendering (SSR)', 'Docker Basics', 'Production Deployment & Monitoring'],
        deliverable: 'Production-ready SaaS application deployed with custom domain, SSL, and database clustering'
      }
    ]
  },
  {
    id: 'python-software-engineer',
    slug: 'python-software-engineer',
    title: 'Python Software Developer & Backend Specialist',
    subtitle: 'Comprehensive software engineering roadmap spanning Python core, OOP, data structures, and Django REST APIs.',
    targetRole: 'Python Developer, Backend Software Engineer, API Engineer',
    duration: '3 to 12 Months',
    level: 'Beginner to Advanced',
    badge: 'High Industry Demand',
    salaryRange: '₹3.5 LPA – ₹9.5 LPA',
    certification: 'MSK Certified Python Software Engineer Certificate',
    prerequisites: 'Basic math and logical thinking. Zero programming background needed.',
    careerOutcomes: [
      'Write clean, modular, object-oriented Python code following PEP 8 conventions.',
      'Construct scalable relational databases with SQL, ORM mappings, and migrations.',
      'Engineer robust backend services, microservices, and REST APIs using Django and FastAPI.',
      'Solve algorithmic challenges and optimize time/space complexity using fundamental Data Structures.'
    ],
    featured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Python Core & Object-Oriented Programming (OOP)',
        duration: '3 Months',
        courseSlug: 'python-mastery-beginner-to-advanced--3-months',
        courseTitle: 'Python Mastery (Beginner to Advanced)',
        description: 'Master core syntax, data types, control flow, functions, OOP classes/inheritance, file I/O, and error handling.',
        skills: ['Python 3 Syntax', 'Control Structures', 'OOP Principles', 'File Handling & Modules', 'Exception Handling'],
        deliverable: 'CLI-based Banking & Student Management System with file-based persistence'
      },
      {
        stepNumber: 2,
        title: 'Data Structures & Algorithms (DSA) Foundations',
        duration: '4 Months',
        courseSlug: 'dsa-mastery-course',
        courseTitle: 'Data Structures & Algorithms Mastery: Zero to FAANG',
        description: 'Learn arrays, linked lists, stacks, queues, hash maps, recursion, searching/sorting algorithms, and time complexity.',
        skills: ['Arrays & Hash Maps', 'Linked Lists & Stacks', 'Searching & Sorting', 'Recursion & Dynamic Programming Basics', 'Big-O Analysis'],
        deliverable: 'Curated repository of 75+ solved algorithmic problem patterns'
      },
      {
        stepNumber: 3,
        title: 'Python Backend Systems & Web Frameworks',
        duration: '5 Months',
        courseSlug: 'full-stack-python-mastery--12-months',
        courseTitle: 'Full-Stack Python & Django Mastery',
        description: 'Develop production web apps with Django ORM, PostgreSQL/SQLite, authentication, templating, and REST APIs.',
        skills: ['Django Web Framework', 'Django ORM & Migrations', 'User Authentication & Sessions', 'Django REST Framework', 'API Unit Testing'],
        deliverable: 'Full-featured enterprise web portal with relational database and admin dashboard'
      }
    ]
  },
  {
    id: 'data-analyst-bi-specialist',
    slug: 'data-analyst-bi-specialist',
    title: 'Data Analyst & Business Intelligence Specialist',
    subtitle: 'From advanced spreadsheet modeling and SQL analytics to automated ETL pipelines and interactive Power BI dashboards.',
    targetRole: 'Data Analyst, BI Developer, MIS Executive, Business Analyst',
    duration: '6 to 12 Months',
    level: 'Beginner to Advanced',
    badge: 'Fastest Hiring Growth',
    salaryRange: '₹3.6 LPA – ₹8.5 LPA',
    certification: 'MSK Certified Data Analytics & BI Professional Diploma',
    prerequisites: 'Familiarity with computer basics and school-level statistics.',
    careerOutcomes: [
      'Extract, manipulate, and analyze datasets using complex SQL queries and window functions.',
      'Automate repetitive data cleaning workflows with Python, Pandas, and NumPy.',
      'Build executive-level interactive business dashboards and KPI reports in Power BI.',
      'Translate raw transactional records into actionable commercial insights and executive presentations.'
    ],
    featured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Advanced MS Excel & Business Analytics Modeling',
        duration: '3 Months',
        courseSlug: 'ms-excel-beginners-to-advanced--6-months',
        courseTitle: 'MS Excel (Beginners to Advanced)',
        description: 'Master lookup formulas (XLOOKUP, INDEX/MATCH), pivot tables, data validation, conditional formatting, and financial modeling.',
        skills: ['XLOOKUP & Nested Logic', 'Pivot Tables & Slicers', 'Data Cleaning Formulas', 'Excel Charts & Sparklines', 'Macro Basics'],
        deliverable: 'Automated 12-month commercial sales tracking & variance analysis workbook'
      },
      {
        stepNumber: 2,
        title: 'Relational Database Querying & SQL Mastery',
        duration: '3 Months',
        courseSlug: 'sql-mysql-mastery-beginner-to-advanced--3-months',
        courseTitle: 'SQL & MySQL Mastery (Beginner to Advanced)',
        description: 'Design relational schemas, execute complex multi-table JOINs, subqueries, aggregations, and window functions in MySQL.',
        skills: ['Relational Schema Design', 'INNER/LEFT/CROSS JOINs', 'Aggregate Queries & GROUP BY', 'Window Functions', 'Query Optimization'],
        deliverable: 'Relational database schema with 20+ analytical reporting SQL scripts'
      },
      {
        stepNumber: 3,
        title: 'Power BI Business Intelligence & Data Storytelling',
        duration: '3 Months',
        courseSlug: 'power-bi-mastery-beginner-to-advanced--3-months',
        courseTitle: 'Power BI Mastery (Beginner to Advanced)',
        description: 'Model data relationships, calculate custom measures with DAX, and design interactive visual dashboards for stakeholders.',
        skills: ['Power Query ETL', 'Data Modeling & Star Schema', 'DAX Measures & Time Intelligence', 'Interactive Dashboards', 'KPI Scorecards'],
        deliverable: 'Multi-page Power BI executive dashboard tracking real-world retail metrics'
      },
      {
        stepNumber: 4,
        title: 'Python for Data Analysis & Statistical Computing',
        duration: '3 Months',
        courseSlug: 'data-analysis-mastery-combo-course--12-months',
        courseTitle: 'Data Analysis Mastery Combo Course',
        description: 'Process large datasets with NumPy and Pandas, detect outliers, and generate statistical charts with Matplotlib & Seaborn.',
        skills: ['NumPy Numerical Arrays', 'Pandas DataFrames', 'Data Wrangling & Imputation', 'Data Visualization (Seaborn)', 'Exploratory Data Analysis (EDA)'],
        deliverable: 'Comprehensive EDA notebook analyzing customer churn patterns with visualizations'
      }
    ]
  },
  {
    id: 'computer-applications-office-diploma',
    slug: 'computer-applications-office-diploma',
    title: 'Computer Applications & Office Executive Diploma',
    subtitle: 'Essential computer literacy, government exam qualification (NIELIT CCC), accounting, and 1-Year ADCA diploma.',
    targetRole: 'Computer Operator, Office Executive, Data Entry Specialist, Lab Assistant',
    duration: '3 to 12 Months',
    level: 'Absolute Beginner',
    badge: 'Government Job Essential',
    salaryRange: '₹2.0 LPA – ₹4.5 LPA',
    certification: 'NIELIT CCC Exam Certificate + MSK 1-Year ADCA Diploma',
    prerequisites: 'Open to all students (High School, Intermediate, Graduate). No prior computer background required.',
    careerOutcomes: [
      'Qualify for UP State & Central Government job applications requiring certified CCC recognition.',
      'Operate Windows, modern browsers, cybersecurity essentials, and cloud storage systems with speed and accuracy.',
      'Prepare administrative memos, financial spreadsheets, professional slide decks, and desktop publishing layouts.',
      'Master Hindi (Mangal/Kruti Dev) and English touch typing with high WPM speed.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'NIELIT CCC (Course on Computer Concepts)',
        duration: '3 Months',
        courseSlug: 'ccc',
        courseTitle: 'CCC (Basic Computer Course)',
        description: 'Complete syllabus preparation for the NIELIT CCC exam: GUI OS, LibreOffice, networking basics, UPI, and cybersecurity.',
        skills: ['Computer Fundamentals', 'Operating Systems (Windows & Linux)', 'LibreOffice Writer/Calc/Impress', 'Internet & E-Governance', 'Digital Financial Services'],
        deliverable: '100% preparation with mock tests scoring 80%+ on NIELIT exam pattern'
      },
      {
        stepNumber: 2,
        title: 'Microsoft Office Professional Suite',
        duration: '4 Months',
        courseSlug: 'ms-office--4-months',
        courseTitle: 'MS Office - 4 Months',
        description: 'Comprehensive mastery of Microsoft Word, Excel, PowerPoint, Outlook, and Hindi/English typing for office environments.',
        skills: ['MS Word Formatting & Mail Merge', 'MS Excel Formulas & Charts', 'MS PowerPoint Presentations', 'English & Hindi Typing', 'Office Documentation'],
        deliverable: 'Complete set of professional business correspondence, invoices, and slide decks'
      },
      {
        stepNumber: 3,
        title: 'Advance Diploma in Computer Applications (ADCA)',
        duration: '12 Months (2 Semesters)',
        courseSlug: 'adca',
        courseTitle: 'ADCA - Advance Diploma in Computer Applications',
        description: '1-Year comprehensive diploma covering office automation, Tally accounting basics, graphic design fundamentals (Photoshop), and web basics.',
        skills: ['Advanced Office Automation', 'Accounting & Tally Prime Basics', 'Graphic Design Fundamentals (Photoshop)', 'Internet Technologies', 'Database Concepts'],
        deliverable: 'Final semester capstone project combining office automation and computerized accounting'
      }
    ]
  },
  {
    id: 'cyber-security-specialist',
    slug: 'cyber-security-specialist',
    title: 'Cyber Security & Network Defense Specialist',
    subtitle: 'Structured path covering networking protocols, Linux administration, ethical hacking techniques, and digital security.',
    targetRole: 'Cyber Security Analyst, SOC Analyst, Network Administrator',
    duration: '6 to 18 Months',
    level: 'Intermediate to Advanced',
    badge: 'Critical Defense Track',
    salaryRange: '₹4.5 LPA – ₹14.0 LPA',
    certification: 'MSK Certified Ethical Hacker & Cyber Defense Specialist',
    prerequisites: 'Basic knowledge of computer operating systems and internet concepts.',
    careerOutcomes: [
      'Understand OSI model, TCP/IP networking, packet inspection, firewalls, and routing topologies.',
      'Master Linux terminal operations, bash scripting, and system hardening practices.',
      'Perform vulnerability assessments, penetration testing, and security audits safely in sandbox labs.',
      'Understand web security vulnerabilities (OWASP Top 10) and implement mitigation strategies.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Computer Networks & Linux System Administration',
        duration: '4 Months',
        courseSlug: 'o-level',
        courseTitle: 'O Level - Information Technology & Networks',
        description: 'Foundations of network protocols, IP subnetting, DNS, client-server models, and Linux terminal command mastery.',
        skills: ['TCP/IP & OSI Model', 'IP Addressing & Subnetting', 'Linux Terminal Commands', 'Network Troubleshooting', 'User Permissions & Security'],
        deliverable: 'Configured local virtualized Linux server with secured SSH and firewall rules'
      },
      {
        stepNumber: 2,
        title: 'Python Scripting for Security Automation',
        duration: '3 Months',
        courseSlug: 'python-mastery-beginner-to-advanced--3-months',
        courseTitle: 'Python Mastery (Beginner to Advanced)',
        description: 'Automate network scanning, banner grabbing, port discovery, and log analysis using lightweight Python scripts.',
        skills: ['Python Socket Programming', 'Automated Network Scanners', 'Regex for Log Analysis', 'File Integrity Checks', 'Security Automation'],
        deliverable: 'Custom multi-threaded port scanner and integrity monitor script'
      },
      {
        stepNumber: 3,
        title: 'Cyber Security & Ethical Hacking Professional Program',
        duration: '18 Months',
        courseSlug: 'cyber-security-ethical-hacking-professional-program',
        courseTitle: 'Cyber Security & Ethical Hacking Professional Program',
        description: 'Comprehensive offensive and defensive security program: reconnaissance, vulnerability scanning, exploitation, and defensive hardening.',
        skills: ['Reconnaissance & Footprinting', 'Wireshark Packet Analysis', 'Metasploit & Nmap Tooling', 'OWASP Top 10 Mitigation', 'Digital Forensics Fundamentals'],
        deliverable: 'Complete security assessment audit report performed on simulated vulnerable test lab'
      }
    ]
  }
];

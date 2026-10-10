const fs = require('fs');
const path = require('path');

const coursesPath = path.join(__dirname, '../public/data/all-courses.json');
const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));

const courseOutcomesMap = {
  'ccc': [
    'Operating system fundamentals, GUI navigation, file management, and desktop customization',
    'LibreOffice Writer / MS Word: Document creation, formatting, page setup, and shortcut keys',
    'LibreOffice Calc / MS Excel: Spreadsheets, basic mathematical formulas, and sorting data',
    'LibreOffice Impress / MS PowerPoint: Presentation design, slide transitions, and animations',
    'Internet, WWW, web browsers, search engines, email etiquette, and e-Governance portals',
    'Digital financial tools: UPI, AEPS, QR codes, internet banking, and cyber safety practices'
  ],
  'adca': [
    'Comprehensive office productivity: Advanced MS Word, Excel, and PowerPoint for business',
    'Financial accounting fundamentals with Tally Prime, ledger maintenance, vouchers, and GST',
    'Graphic design and desktop publishing (DTP) with Photoshop and CorelDraw workflows',
    'Web development foundations: HTML5, CSS3, and website architecture basics',
    'Database management concepts, computer hardware fundamentals, and system troubleshooting',
    'Practical real-world lab assignments, project work, and 1-Year Diploma certification'
  ],
  'html5-complete-course': [
    'Semantic HTML5 structure: header, nav, main, article, section, aside, and footer',
    'Modern form architecture, input types, attributes, and browser-native validation rules',
    'Multimedia integration with HTML5 audio, video, picture tags, and responsive images',
    'Web accessibility (WCAG / WAI-ARIA) best practices for screen-reader compatibility',
    'SEO-friendly markup, meta tags, OpenGraph protocol, and structured semantic layouts',
    'Clean, W3C-compliant markup tested across modern desktop and mobile browsers'
  ],
  'css-for-beginners': [
    'CSS syntax, rule structure, inline, internal, and external stylesheet linking',
    'CSS selector types: element, class, ID, group, and attribute selectors',
    'Box model mastery: content, padding, border, margin, and box-sizing calculations',
    'Color models (HEX, RGB, HSL), background properties, gradients, and typography styling',
    'Display properties (block, inline, inline-block, none) and element visibility controls',
    'Introduction to responsive layouts and simple CSS Flexbox alignment'
  ],
  'css-for-intermediate': [
    'CSS Flexbox deep dive: flex container, flex items, direction, wrap, and alignment',
    'CSS Grid architecture: grid tracks, template areas, minmax, auto-fit, and auto-fill',
    'Pseudo-classes (:hover, :focus, :nth-child) and pseudo-elements (::before, ::after)',
    'Responsive design with CSS media queries for mobile, tablet, and widescreen breakpoints',
    'CSS transforms (translate, rotate, scale) and smooth transition timing functions',
    'Positioning strategies: static, relative, absolute, fixed, and sticky navigation'
  ],
  'css-for-advanced': [
    'CSS keyframe animations, animation properties, and performance-optimized rendering',
    'CSS Custom Properties (Variables) for scalable theme architecture and dark mode',
    'Modern fluid typography with clamp(), min(), max(), and calc() mathematical functions',
    'Scalable CSS architecture methodologies (BEM, utility-first patterns, and modularity)',
    'Advanced layout techniques, CSS subgrid, aspect-ratio, and container queries',
    'Cross-browser debugging, DevTools inspection, and CSS rendering performance optimization'
  ],
  'backend-engineering-nodejs-databases': [
    'Node.js runtime architecture, V8 engine, event-driven I/O, and asynchronous event loop',
    'Building modular RESTful APIs with Express.js routing, middleware, and request validation',
    'NoSQL database design with MongoDB and schema modeling using Mongoose ODM',
    'Secure user authentication using JSON Web Tokens (JWT) and bcrypt password hashing',
    'CRUD operations, filtering, pagination, error-handling middleware, and API testing',
    'Environment configuration, CORS management, and production backend deployment'
  ],
  'full-stack-web-dev-bootcamp': [
    'Modern responsive frontend engineering with HTML5, modern CSS, and modern JavaScript',
    'Component-driven UI development with React.js: state, props, hooks, and routing',
    'Server-side API architecture with Node.js and Express.js RESTful endpoints',
    'Database integration with MongoDB, Mongoose schema validation, and CRUD operations',
    'Version control with Git & GitHub, branch workflows, and team collaboration',
    'End-to-end full-stack web applications deployed to production cloud platforms'
  ],
  'cyber-security-ethical-hacking-professional-program': [
    'Network security foundations: OSI model, TCP/IP protocols, ports, and network topologies',
    'Reconnaissance, OSINT techniques, footprinting, and vulnerability scanning with Nmap',
    'Packet sniffing and traffic inspection using Wireshark and network security analyzers',
    'Web application security fundamentals and mitigation of OWASP Top 10 vulnerabilities',
    'System hacking concepts, malware analysis, social engineering awareness, and defensive controls',
    'Ethical penetration testing methodologies, security auditing, and incident response basics'
  ],
  'python-for-beginners': [
    'Python installation, VS Code setup, interactive REPL, and clean syntax principles',
    'Variables, dynamic typing, primitive data types (int, float, str, bool), and type casting',
    'Conditional logic (if-elif-else) and iteration control (for loops, while loops, range)',
    'Core data collections: Lists, Tuples, Sets, and Dictionaries with built-in methods',
    'Function definition, positional/keyword arguments, return values, and variable scope',
    'Basic file I/O operations (reading and writing text files) and error handling with try-except'
  ],
  'python-for-intermediate': [
    'Object-Oriented Programming (OOP): classes, objects, __init__ constructor, and self',
    'Inheritance, method overriding, super(), encapsulation (private attributes), and polymorphism',
    'Advanced error handling: custom exceptions, multiple except blocks, and finally clauses',
    'Modular programming: creating custom modules, package namespaces, and __init__.py files',
    'Working with Python standard libraries: math, random, datetime, os, sys, and json',
    'String manipulation with Regular Expressions (re module) and pattern matching'
  ],
  'python-for-advanced': [
    'Python decorators, closure functions, and higher-order function meta-programming',
    'Iterators, generator functions, yield statement, and memory-efficient stream processing',
    'Context managers, custom with statement implementations, and resource cleanup',
    'Concurrency in Python: Threading, Multiprocessing, and introductory asyncio event loops',
    'Magic methods (dunder methods), operator overloading, and class customization',
    'Code profiling, performance optimization, and industry-standard PEP 8 formatting'
  ],
  'numpy-complete-course': [
    'NumPy array creation (np.array, arange, linspace, zeros, ones) and memory layout',
    'Vectorized computing operations eliminating Python loops for high-speed calculation',
    'Array indexing, slicing, boolean masking, fancy indexing, and shape reshaping',
    'Broadcasting rules for arithmetic operations between different array dimensions',
    'Linear algebra operations with np.linalg: dot products, matrix inversion, and eigenvalues',
    'Statistical aggregations: mean, median, standard deviation, percentile, and sorting'
  ],
  'javascript-for-beginners': [
    'JavaScript runtime in browsers, script tag placement, and browser console debugging',
    'Variable declaration with let, const, and var; primitive vs reference data types',
    'Operators, type coercion, truthy/falsy values, and strict equality (=== vs ==)',
    'Control flow: if-else statements, switch-case, for loops, and while loops',
    'Functions: declaration, expression, return statements, and lexical parameter passing',
    'DOM manipulation: selecting elements, modifying text/HTML, and handling click events'
  ],
  'javascript-for-intermediate': [
    'Modern ES6+ syntax: arrow functions, template literals, destructuring, and spread/rest',
    'Advanced array methods: forEach, map, filter, reduce, find, some, and every',
    'DOM event listeners, event bubbling, event capturing, and event delegation',
    'Asynchronous JavaScript: Callbacks, Promises, and Promise chaining (.then / .catch)',
    'Async/await syntax, try-catch error handling, and fetching remote APIs with Fetch',
    'Browser storage APIs: localStorage, sessionStorage, and JSON serialization'
  ],
  'javascript-for-advanced': [
    'JavaScript execution context, call stack, closures, and lexical environment deep dive',
    'Prototypal inheritance, prototype chain, Object.create, and ES6 class syntax',
    'Event loop mechanics: task queue, microtask queue, macrotasks, and async timing',
    'The this keyword binding rules: default, implicit, explicit (call, apply, bind), and arrow',
    'Modular JavaScript: ES Modules (import / export) and bundler integration basics',
    'Defensive coding, memory leak prevention, performance debugging, and unit testing basics'
  ],
  'react-js-for-beginners': [
    'React component architecture, Single Page Application (SPA) concepts, and Vite setup',
    'JSX syntax rules, embedding JavaScript expressions, and conditional rendering',
    'Component communication: passing data with props and children composition',
    'Managing local state with the useState hook and handling form input changes',
    'Side effects and lifecycle management with the useEffect hook and cleanup functions',
    'Rendering dynamic lists with unique keys and handling user interactions'
  ],
  'react-js-for-intermediate': [
    'Advanced React hooks: useContext for global state, useReducer for complex actions',
    'Performance hooks: useMemo for expensive calculations and useCallback for stable handlers',
    'Direct DOM element manipulation and mutable persistent values with the useRef hook',
    'Client-side multi-page routing with React Router DOM: routes, links, and URL params',
    'Custom hooks creation for reusable stateful logic and clean component separation',
    'Consuming REST APIs, managing loading states, error states, and optimistic UI updates'
  ],
  'react-js-for-advanced': [
    'Global state management with modern Redux Toolkit (RTK) / Zustand architecture',
    'React performance tuning: code splitting, lazy loading, and React.memo optimization',
    'Handling runtime errors gracefully using Error Boundaries and fallback UI screens',
    'React Suspense, transitions, and concurrent rendering features in modern React',
    'Compound component patterns, render props, and accessible UI component engineering',
    'Production build optimization, SEO considerations, and cloud deployment pipelines'
  ],
  'bootstrap-for-beginner': [
    'Bootstrap 5 setup via CDN and local installation, understanding CSS container wrappers',
    '12-column responsive grid system: rows, columns, offsets, and breakpoint prefixes',
    'Typography utilities, text alignments, color themes, and display classes',
    'Bootstrap UI components: responsive navbars, cards, buttons, badges, and alerts',
    'Responsive tables, form controls, input groups, floating labels, and form validation styles',
    'Rapid responsive website prototyping and clean mobile-first layout implementation'
  ],
  'bootstrap-for-advanced': [
    'Customizing Bootstrap styles using Sass variables, maps, and custom color palettes',
    'Bootstrap JavaScript interactive plugins: modals, tooltips, popovers, and accordions',
    'Dynamic carousel sliders, offcanvas sliding drawers, and dropdown navigation systems',
    'Custom utility class generation using the Bootstrap 5 Utility API and custom mixins',
    'Responsive dashboard interface design with custom charts and responsive sidebar navigation',
    'Optimizing production CSS bundle weight by purging unused Bootstrap components'
  ],
  'sql-for-beginners': [
    'Relational database architecture, tables, columns, rows, and primary keys',
    'Data querying with SELECT, WHERE filtering, comparison, and logical operators (AND, OR, NOT)',
    'Sorting results with ORDER BY, limiting rows with LIMIT/OFFSET, and handling NULL values',
    'Data summarization using aggregate functions: COUNT, SUM, AVG, MIN, and MAX',
    'Grouped data analysis using GROUP BY and filtering aggregated results with HAVING',
    'Data definition and manipulation: CREATE TABLE, INSERT INTO, UPDATE, and DELETE'
  ],
  'sql-for-intermediate': [
    'Relational table relationships: one-to-one, one-to-many, and many-to-many schema design',
    'Multi-table queries with INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN',
    'Table alias usage, self-joins, cross-joins, and joining more than two tables',
    'Set operations: combining query results using UNION, UNION ALL, INTERSECT, and EXCEPT',
    'Single-row and multi-row subqueries in WHERE, FROM, and SELECT clauses',
    'Database constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, and CHECK'
  ],
  'sql-for-advanced': [
    'Common Table Expressions (CTEs) and recursive queries for hierarchical data structures',
    'Analytical Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), and NTILE()',
    'Value Window Functions: LAG(), LEAD(), FIRST_VALUE(), and running totals with OVER()',
    'Database indexing strategies: B-Tree indexes, composite indexes, and EXPLAIN query plans',
    'ACID transactional integrity: BEGIN TRANSACTION, COMMIT, and ROLLBACK mechanisms',
    'Stored procedures, user-defined functions, triggers, and query performance optimization'
  ],
  'ms-word-for-beginners': [
    'MS Word workspace, ribbon navigation, backstage view, and document creation',
    'Text typography: fonts, styles, sizes, character spacing, and text highlighting',
    'Paragraph formatting: line spacing, alignments, indents, and bulleted/numbered lists',
    'Page setup: margins, page orientation (portrait/landscape), paper sizes, and page breaks',
    'Inserting headers, footers, page numbering, date stamps, and document watermarks',
    'Printing options, spell checking, word count verification, and saving in PDF/DOCX formats'
  ],
  'ms-word-for-advanced': [
    'Advanced table formatting: cell borders, shading, cell merging, and formula calculations',
    'Illustrations: inserting pictures, shapes, SmartArt diagrams, and screenshot captures',
    'Mail Merge mastery: creating personalized letters, envelopes, labels, and mass mailings',
    'Document reference tools: Table of Contents, footnotes, endnotes, and citation styles',
    'Reviewing and collaboration: Track Changes, comments, comparing documents, and protection',
    'Creating custom document templates, styles hierarchy, forms, and professional publishing'
  ],
  'git--github-basics': [
    'Version control concepts: local repository, staging area, commit history, and working tree',
    'Configuring Git: user identity, default branch, .gitignore patterns, and git init setup',
    'Core Git commands: git status, git add, git commit with descriptive messages, and git log',
    'Branch management: git branch, checkout, switch, and merging branches locally',
    'GitHub remote repositories: git remote add, git push, git pull, and repository cloning',
    'Collaborative workflows: handling merge conflicts, pull requests, and README documentation'
  ],
  'ms-powerpoint-for-beginners': [
    'PowerPoint interface, slide navigation, master slide concepts, and presentation templates',
    'Adding and formatting text boxes, title slides, content layouts, and bullet hierarchies',
    'Inserting and styling visual elements: high-resolution images, icons, shapes, and SmartArt',
    'Embedding Excel charts and tables with dynamic linked data for business reports',
    'Slide transitions and subtle object animations to create engaging visual stories',
    'Presenter tools: Presenter View, slide notes, rehearsing timings, and exporting to PDF/video'
  ],
  'ms-excel-for-beginners': [
    'Excel interface, workbook structure, worksheets, rows, columns, and cell references',
    'Data entry techniques, AutoFill series, flash fill, and cell data types (numbers, dates, text)',
    'Fundamental arithmetic formulas: Addition, Subtraction, Multiplication, Division, and percentages',
    'Essential functions: SUM, AVERAGE, COUNT, COUNTA, MIN, MAX, and basic mathematical functions',
    'Formatting cells, currency formatting, number precision, borders, and conditional cell highlights',
    'Sorting data, basic filtering, freeze panes, print area setup, and workbook management'
  ],
  'ms-excel-for-intermediate': [
    'Logical formulas: IF statements, nested IF, AND, OR, and combining logical conditions',
    'Lookup and reference functions: VLOOKUP exact/approximate matching, HLOOKUP, and XLOOKUP',
    'Text manipulation functions: CONCATENATE, TEXTJOIN, LEFT, RIGHT, MID, UPPER, and LOWER',
    'Date and time formulas: TODAY, NOW, DATEDIF, EDATE, and date difference calculations',
    'Pivot Tables fundamentals: creating dynamic summary tables, field rows, columns, and values',
    'Data visualization: column charts, bar charts, line graphs, and pie chart presentations'
  ],
  'ms-excel-for-advanced': [
    'Advanced Pivot Tables: calculated fields, calculated items, slicers, timelines, and PivotCharts',
    'INDEX and MATCH combination formulas for dynamic bidirectional multi-criteria lookups',
    'Data validation rules: creating dropdown lists, input message alerts, and error prompts',
    'What-If Analysis tools: Goal Seek, Data Tables, and Scenario Manager for financial modeling',
    'Power Query ETL: importing data from multiple sheets, cleaning, unpivoting, and transforming',
    'Foundational macro recording, automating repetitive reporting tasks, and formula auditing'
  ],
  'power-bi-for-intermediate': [
    'Advanced data modeling in Power BI: Star Schema vs Snowflake schema, active vs inactive relationships',
    'DAX calculation mastery: CALCULATE, ALL, ALLEXCEPT, and modifying filter evaluation context',
    'Time intelligence in DAX: YTD, QTD, MTD, SAMEPERIODLASTYEAR, and running date totals',
    'Custom KPI indicators, cards, gauge charts, and matrix visual styling with conditional rules',
    'Dynamic report interactivity: Drillthrough pages, bookmark navigation buttons, and custom tooltips',
    'Optimizing report query performance with DAX Studio and the Power BI Performance Analyzer'
  ],
  'power-bi-for-advanced': [
    'Enterprise data governance and deploying Power BI reports to Power BI Service cloud',
    'Implementing Row-Level Security (RLS) with DAX roles to restrict data by user permissions',
    'Configuring scheduled dataset refresh, on-premises data gateways, and connection credentials',
    'Building executive BI apps, workspace collaboration, and sharing dashboards securely',
    'Paginated Reports design using Power BI Report Builder for pixel-perfect printing',
    'Composite models, incremental data refresh, and enterprise business intelligence best practices'
  ],
  'data-analysis--basics--pandas': [
    'Pandas architecture: Series and DataFrame data structures, indices, and memory layouts',
    'Data ingestion from various formats: CSV, Excel, JSON, and SQL database connections',
    'Data cleaning: identifying missing values, dropna vs fillna strategies, and type conversions',
    'Data transformation: filtering rows, selecting columns, renaming features, and conditional logic',
    'Aggregation and grouping: groupby operations, aggregate functions, and multi-index tables',
    'Exploratory data analysis (EDA): descriptive summaries, frequency tables, and data validation'
  ],
  'django-for-backend-development': [
    'Django framework architecture: Model-View-Template (MVT) pattern and project configuration',
    'URL dispatcher, path routing, regex paths, and connecting views to URL patterns',
    'Django Models: field types, primary keys, relationships, and running makemigrations / migrate',
    'Django Admin interface customization: model registration, list displays, and search filters',
    'Django Templates: template inheritance, template tags, filters, and rendering context data',
    'Handling HTML forms with Django Forms and ModelForms, CSRF tokens, and input validation'
  ],
  'orm-concepts-for-backend-development': [
    'ORM fundamentals: mapping database relational tables directly to Python class models',
    'Django QuerySet evaluation: lazy loading, filtering (.filter, .exclude), and sorting (.order_by)',
    'Model relationships: ForeignKey (one-to-many), OneToOneField, and ManyToManyField schemas',
    'Query optimization: solving the N+1 query problem using select_related() and prefetch_related()',
    'Aggregations and annotations: calculating totals, counts, and averages across related models',
    'Database transactions, atomic blocks, F() expressions, and Q() complex query lookups'
  ],
  'rest-api-development-with-django': [
    'REST architectural principles: statelessness, client-server separation, and HTTP methods',
    'Django REST Framework (DRF) setup, serializers, and ModelSerializer validation logic',
    'API Views: APIView class, GenericAPIViews, and ModelViewSet for automated CRUD routing',
    'Routers and URL configuration for standardized RESTful endpoint generation',
    'Response formatting, HTTP status codes, error payloads, and pagination strategies',
    'API documentation, interactive testing with DRF Browsable API, and Postman test collections'
  ],
  'authentication--authorization-for-backend': [
    'Authentication fundamentals: user registration, login verification, and credential security',
    'Password hashing algorithms (PBKDF2 / bcrypt), salting, and secure password validation rules',
    'Session-based authentication vs Token-based stateless authentication architectures',
    'JSON Web Tokens (JWT): header, payload, signature, access tokens, and refresh token rotation',
    'Role-Based Access Control (RBAC): user groups, model-level permissions, and custom DRF permissions',
    'Security hardening: CSRF protection, CORS headers, rate limiting, and API endpoint shielding'
  ],
  'deployment--hosting-for-backend': [
    'Preparing Django & Node.js backends for production: DEBUG=False, ALLOWED_HOSTS, and secret keys',
    'Configuring WSGI and ASGI application servers: Gunicorn and Uvicorn process management',
    'Nginx reverse proxy configuration: static file serving, SSL termination, and request proxying',
    'Environment variable management using .env files, decouple, and cloud secret stores',
    'Deploying to cloud infrastructure: Linux VPS (Ubuntu), Railway, Render, or AWS EC2',
    'Domain mapping, SSL certificate automation with Let\'s Encrypt (Certbot), and server monitoring'
  ],
  'advanced-backend-concepts': [
    'In-memory caching architectures with Redis: cache keys, TTL expiration, and view caching',
    'Asynchronous task queuing with Celery and Redis message brokers for background jobs',
    'Scheduled cron jobs and recurring background maintenance in production backends',
    'Database connection pooling, indexing reviews, and query execution plan profiling',
    'Introduction to microservices architecture, webhook consumers, and event-driven patterns',
    'Application logging, centralized error tracking (Sentry), and health check monitoring'
  ],
  'ms-office--4-months': [
    'Comprehensive office suite mastery covering MS Word, MS Excel, and MS PowerPoint',
    'Professional business document authoring, formatting, reporting, and Mail Merge in Word',
    'Data analysis and business calculations with essential formulas and Pivot Tables in Excel',
    'Executive presentation design, charts, animations, and corporate slide decks in PowerPoint',
    'File management, document security, PDF conversions, and cloud sharing with OneDrive',
    'Practical office simulation assignments preparing students for administrative careers'
  ],
  'web-designing-complete-pathway--4-months': [
    'Semantic webpage structuring with modern HTML5 markup and accessibility considerations',
    'Styling and responsive layouts with modern CSS3, Flexbox, and CSS Grid architectures',
    'Rapid UI component design and responsive mobile-first grids using Bootstrap 5',
    'Cross-device mobile responsiveness, fluid typography, and modern browser testing',
    'Web typography, color theory, hero sections, navigation bars, and footer structuring',
    'Publishing live responsive portfolio websites to GitHub Pages and production hosting'
  ],
  'ms-word-complete-pathway-beginner-to-advanced--2-months': [
    'Complete Word interface navigation, document drafting, fonts, and paragraph formatting',
    'Advanced page setup: margins, multi-column layouts, section breaks, and headers/footers',
    'Visual enhancements: tables, graphics, SmartArt diagrams, shapes, and custom borders',
    'Automated Mail Merge for personalized certificates, letters, labels, and envelopes',
    'Academic and legal document tools: Table of Contents, footnotes, citations, and indexing',
    'Collaborative reviewing, track changes, comment workflows, and professional publishing'
  ],
  'python-mastery-beginner-to-advanced--3-months': [
    'Complete Python language foundations: syntax, variables, data types, and control flow',
    'Data structures mastery: Lists, Tuples, Dictionaries, Sets, and comprehension expressions',
    'Object-Oriented Programming (OOP): classes, inheritance, polymorphism, and encapsulation',
    'File I/O operations, JSON parsing, error handling, and modular project organization',
    'Problem solving, algorithmic thinking, debugging in VS Code, and clean PEP 8 code style',
    'Real-world portfolio projects: automation scripts, command-line utilities, and API consumers'
  ],
  'python-backend-development-mastery-combo--8-months': [
    'Core and advanced Python programming: data structures, OOP architecture, and file I/O',
    'Web application development with Django: MVT pattern, routing, models, and admin portals',
    'Database modeling with Django ORM, complex QuerySets, migrations, and relationship schemas',
    'RESTful API development using Django REST Framework (DRF), serializers, and viewsets',
    'Secure user authentication, role-based authorization, and JSON Web Token (JWT) integration',
    'Production backend deployment: Linux server setup, Gunicorn, Nginx, and cloud hosting'
  ],
  'power-bi-mastery-beginner-to-advanced--3-months': [
    'End-to-end Business Intelligence workflow from raw data ingestion to interactive dashboards',
    'Power Query ETL: data cleaning, shape transformation, unpivoting, and combining sources',
    'Data modeling best practices: Star Schema, dimensional tables, and relationship cardinality',
    'DAX formula mastery: CALCULATE, filter contexts, time intelligence, and dynamic KPI metrics',
    'Visual report design: custom charts, drillthrough navigation, slicers, and interactive tooltips',
    'Enterprise report deployment, scheduled data refresh, and Row-Level Security (RLS) policies'
  ],
  'ms-excel-beginners-to-advanced--6-months': [
    'Complete spreadsheet engineering from basic calculations to enterprise data modeling',
    'Lookup mastery: XLOOKUP, VLOOKUP, INDEX-MATCH, and multi-condition lookup formulas',
    'Dynamic array formulas (FILTER, UNIQUE, SORT, XMATCH) and nested logical calculations',
    'Pivot Tables, calculated fields, slicers, and interactive executive business dashboards',
    'Automated data transformation with Power Query, data cleansing, and duplicate elimination',
    'Data validation rules, error handling, cell protection, and foundational workflow macros'
  ],
  'frontend-development--8-months': [
    'Modern semantic HTML5 markup and responsive web styling with modern CSS3',
    'CSS Flexbox and CSS Grid layout mastery for mobile-first responsive web design',
    'JavaScript programming: ES6+ syntax, DOM manipulation, events, and asynchronous Fetch API',
    'React.js component engineering: hooks (useState, useEffect, useContext), props, and state',
    'Version control with Git & GitHub, branch workflows, and team collaboration best practices',
    'Building responsive Single Page Applications (SPAs) and deploying to production cloud platforms'
  ],
  'o-level': [
    'NIELIT O Level M1-R5: Information Technology Tools and Network Basics (LibreOffice suite)',
    'NIELIT O Level M2-R5: Web Designing & Publishing (HTML5, CSS3, JavaScript, and editors)',
    'NIELIT O Level M3-R5: Programming and Problem Solving through Python language concepts',
    'NIELIT O Level M4-R5: Internet of Things (IoT) and its Applications in smart infrastructure',
    'Practical laboratory sessions with previous year question papers and model test series',
    'Comprehensive preparation for official NIELIT O Level national certification examinations'
  ],
  'sql-mysql-mastery-beginner-to-advanced--3-months': [
    'Relational database architecture, MySQL workbench setup, and database design fundamentals',
    'Data querying with SELECT, filtering with WHERE, sorting with ORDER BY, and aggregation',
    'Multi-table data analysis using INNER JOIN, LEFT JOIN, RIGHT JOIN, and self joins',
    'Advanced analytical queries with Common Table Expressions (CTEs) and Window Functions',
    'Database constraints, primary/foreign keys, schema normalization (1NF, 2NF, 3NF), and ACID',
    'Query performance optimization, B-Tree indexes, execution plan profiling, and transactions'
  ],
  'markdown': [
    'Markdown core syntax: headings, emphasis, blockquotes, lists, links, and code blocks',
    'GitHub Flavored Markdown (GFM): task lists, tables, strikethrough, and autolinks',
    'Technical documentation writing: creating clean, attractive GitHub README.md files',
    'Diagramming inside Markdown using Mermaid.js flowcharts, sequence, and class diagrams',
    'Code snippet formatting with syntax highlighting languages and terminal block formatting',
    'Introduction to MDX (Markdown with JSX components) for modern static websites and docs'
  ],
  'pandas-complete-course': [
    'Pandas Series and DataFrame data structures, memory layout, and type conversions',
    'Importing and exporting data: CSV, Excel, Parquet, JSON, and SQL database connectors',
    'Data wrangling: filtering rows, selecting columns, handling missing values, and deduplication',
    'Aggregation and grouping: groupby mechanics, multi-aggregations, and pivot table analysis',
    'Time series analysis: DatetimeIndex, resampling, rolling calculations, and date parsing',
    'Exploratory Data Analysis (EDA) pipelines using method chaining and descriptive statistics'
  ],
  'flask-complete-course': [
    'Flask microframework architecture, WSGI concepts, application setup, and debug mode',
    'Routing, URL parameters, dynamic endpoints, request objects, and response formatting',
    'Jinja2 templating engine: template inheritance, control structures, and context variables',
    'Database management with Flask-SQLAlchemy ORM, model schemas, and CRUD operations',
    'Building modular applications using Flask Blueprints and organizing scalable architectures',
    'Developing RESTful APIs, JSON responses, error handling, and production deployment'
  ]
};

let updatedCount = 0;
courses.forEach(c => {
  // Fix status for course-markdown-mastery
  if (c.id === 'course-markdown-mastery' && c.status === 'PUBLISHED') {
    c.status = 'PUBLISH';
    console.log('Fixed course-markdown-mastery status to PUBLISH');
  }

  // Fix includedCourseIds for course-web-dev
  if (c.id === 'course-web-dev') {
    c.includedCourseIds = [
      'course-html5-complete-course',
      'course-javascript-for-beginners',
      'course-react-js-for-beginners',
      'course-backend-node'
    ];
    console.log('Fixed course-web-dev includedCourseIds');
  }

  // Update learning outcomes if missing
  if ((!c.learningOutcomes || c.learningOutcomes.length === 0) && courseOutcomesMap[c.slug]) {
    c.learningOutcomes = courseOutcomesMap[c.slug];
    updatedCount++;
  }
});

fs.writeFileSync(coursesPath, JSON.stringify(courses, null, 2), 'utf8');
console.log(`Successfully populated learning outcomes for ${updatedCount} courses!`);
console.log(`Saved updated courses to ${coursesPath}`);

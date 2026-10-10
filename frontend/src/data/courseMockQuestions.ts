export interface CourseMockQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
}

export interface CourseMockTestConfig {
  courseSlug: string;
  courseTitle: string;
  category: string;
  durationMinutes: number;
  passingPercentage: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  description: string;
  questions: CourseMockQuestion[];
}

export const COURSE_MOCK_TESTS: Record<string, CourseMockTestConfig> = {
  // 1. Python Programming Mastery
  'python-mastery-beginner-to-advanced--3-months': {
    courseSlug: 'python-mastery-beginner-to-advanced--3-months',
    courseTitle: 'Python Programming Mastery',
    category: 'Programming & Software Development',
    durationMinutes: 20,
    passingPercentage: 50,
    difficulty: 'All Levels',
    description: 'Test your understanding of core Python syntax, data types, OOP principles, functions, list comprehensions, and error handling.',
    questions: [
      {
        id: 1,
        topic: 'Data Types & Mutability',
        question: 'Which of the following data structures in Python is immutable?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctIndex: 3,
        explanation: 'Tuples in Python are immutable; once defined, their elements cannot be changed, added, or removed.'
      },
      {
        id: 2,
        topic: 'Code Output',
        question: 'What is the output of the following Python code snippet?',
        codeSnippet: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))`,
        options: ['3', '4', 'TypeError', 'IndexError'],
        correctIndex: 1,
        explanation: 'In Python, lists are mutable reference objects. y refers to the same list in memory as x. Modifying y modifies x, so len(x) becomes 4.'
      },
      {
        id: 3,
        topic: 'Operators',
        question: 'What is the result of 17 // 4 and 17 % 4 in Python?',
        options: ['4.25 and 1', '4 and 1', '4 and 2', '4.0 and 1'],
        correctIndex: 1,
        explanation: '// is the floor division operator yielding 4, and % is the modulus operator giving remainder 1.'
      },
      {
        id: 4,
        topic: 'Functions & Lambdas',
        question: 'Which keyword is used to define an anonymous function in Python?',
        options: ['def', 'func', 'lambda', 'inline'],
        correctIndex: 2,
        explanation: 'The lambda keyword creates small, anonymous single-line functions in Python.'
      },
      {
        id: 5,
        topic: 'List Comprehension',
        question: 'What does the expression [x**2 for x in range(5) if x % 2 == 0] produce?',
        codeSnippet: `result = [x**2 for x in range(5) if x % 2 == 0]\nprint(result)`,
        options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
        correctIndex: 0,
        explanation: 'range(5) gives 0, 1, 2, 3, 4. The even values are 0, 2, 4. Their squares are 0, 4, 16.'
      },
      {
        id: 6,
        topic: 'String Manipulation',
        question: 'What is the output of the slice string[::-1] on string = "Python"?',
        codeSnippet: `s = "Python"\nprint(s[::-1])`,
        options: ['Python', 'nohtyP', 'P', 'IndexError'],
        correctIndex: 1,
        explanation: 'The slice [::-1] steps through the string backwards with step -1, reversing it to "nohtyP".'
      },
      {
        id: 7,
        topic: 'OOP Concepts',
        question: 'In a Python class, which special method is invoked automatically as the constructor during object instantiation?',
        options: ['__init__', '__new__', '__construct__', '__start__'],
        correctIndex: 0,
        explanation: '__init__ is the initializer / constructor method in Python, called when an object is instantiated.'
      },
      {
        id: 8,
        topic: 'OOP Inheritance',
        question: 'Which built-in function is used to invoke a method from a parent superclass in Python?',
        options: ['parent()', 'super()', 'base()', 'inherit()'],
        correctIndex: 1,
        explanation: 'super() returns a temporary proxy object of the superclass, allowing delegation of method calls to parent classes.'
      },
      {
        id: 9,
        topic: 'Exception Handling',
        question: 'Which block in a try-except structure is executed regardless of whether an exception occurred or not?',
        options: ['else', 'finally', 'catch', 'always'],
        correctIndex: 1,
        explanation: 'The finally block always runs, making it ideal for cleanup actions like closing database connections or files.'
      },
      {
        id: 10,
        topic: 'Dictionaries',
        question: 'How do you safely retrieve the value of a key in a dictionary without throwing a KeyError if the key does not exist?',
        options: ['dict[key]', 'dict.fetch(key)', 'dict.get(key, default)', 'dict.find(key)'],
        correctIndex: 2,
        explanation: 'dict.get(key, default) safely returns the value if the key exists, or default (None if omitted) without crashing.'
      },
      {
        id: 11,
        topic: 'Variable Scope',
        question: 'Which keyword allows you to modify a global variable inside a local function scope?',
        options: ['nonlocal', 'global', 'outer', 'static'],
        correctIndex: 1,
        explanation: 'The global keyword declares that a variable inside a function refers to the module-level global variable.'
      },
      {
        id: 12,
        topic: 'File I/O',
        question: 'What is the advantage of using the with open(...) statement for file handling in Python?',
        options: [
          'It executes faster in memory',
          'It automatically closes the file even if exceptions occur',
          'It prevents file encryption',
          'It allows writing without permission'
        ],
        correctIndex: 1,
        explanation: 'The with context manager automatically calls file.close() upon exiting the block, preventing resource leaks.'
      },
      {
        id: 13,
        topic: 'Generators',
        question: 'Which keyword transforms a standard Python function into a generator function?',
        options: ['return', 'yield', 'produce', 'generate'],
        correctIndex: 1,
        explanation: 'The yield keyword pauses function execution and emits a value, turning the function into an iterable generator.'
      },
      {
        id: 14,
        topic: 'Set Operations',
        question: 'What is the output of {1, 2, 3} & {2, 3, 4} in Python?',
        options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', 'TypeError'],
        correctIndex: 1,
        explanation: '& is the set intersection operator, returning only elements present in both sets: {2, 3}.'
      },
      {
        id: 15,
        topic: 'Modules & Standard Library',
        question: 'Which built-in module in Python is used for regular expression matching and pattern searching?',
        options: ['regex', 're', 'string', 'pattern'],
        correctIndex: 1,
        explanation: 'The re module is Python’s standard library package for regular expressions.'
      }
    ]
  },

  // 2. ADCA - Advance Diploma in Computer Applications
  'adca': {
    courseSlug: 'adca',
    courseTitle: 'ADCA (Advance Diploma in Computer Applications)',
    category: 'Computer Applications & Office Diploma',
    durationMinutes: 20,
    passingPercentage: 50,
    difficulty: 'All Levels',
    description: 'Assess comprehensive computer knowledge: Windows OS, Advanced MS Office (Word, Excel, PowerPoint), Tally Prime accounting, and computer hardware fundamentals.',
    questions: [
      {
        id: 1,
        topic: 'Computer Architecture',
        question: 'What is the main brain of the computer that interprets and executes machine code instructions?',
        options: ['RAM', 'CPU (Central Processing Unit)', 'Motherboard', 'Hard Disk'],
        correctIndex: 1,
        explanation: 'The Central Processing Unit (CPU) is the primary processor and brain of a computer system.'
      },
      {
        id: 2,
        topic: 'MS Word',
        question: 'Which feature in Microsoft Word allows sending the same invitation letter to multiple recipients with customized addresses?',
        options: ['Cross-Reference', 'Mail Merge', 'Track Changes', 'AutoFormat'],
        correctIndex: 1,
        explanation: 'Mail Merge links a letter or template document with a data source (like Excel) to generate customized copies for multiple contacts.'
      },
      {
        id: 3,
        topic: 'MS Excel Formulas',
        question: 'In Microsoft Excel, which modern lookup formula searches in any direction without requiring the lookup column to be on the left?',
        options: ['VLOOKUP', 'HLOOKUP', 'XLOOKUP', 'MATCH'],
        correctIndex: 2,
        explanation: 'XLOOKUP can search both vertically and horizontally, and can return values to the left, right, above, or below the lookup array.'
      },
      {
        id: 4,
        topic: 'Excel Analytics',
        question: 'Which tool in MS Excel is used to rapidly summarize, aggregate, and slice large transactional datasets?',
        options: ['Pivot Table', 'Data Validation', 'Solver', 'Goal Seek'],
        correctIndex: 0,
        explanation: 'Pivot Tables allow instant multidimensional summarization, calculations, and grouping of large data tables.'
      },
      {
        id: 5,
        topic: 'Tally & Accounting',
        question: 'In Tally Prime, which voucher key (F-Key) is used to record cash or bank payment transactions?',
        options: ['F4 (Contra)', 'F5 (Payment)', 'F6 (Receipt)', 'F7 (Journal)'],
        correctIndex: 1,
        explanation: 'F5 is the shortcut key in Tally to record Payment vouchers.'
      },
      {
        id: 6,
        topic: 'Accounting Principles',
        question: 'Under the Golden Rules of Accounting, what is the rule for "Real Accounts"?',
        options: [
          'Debit the receiver, Credit the giver',
          'Debit what comes in, Credit what goes out',
          'Debit all expenses/losses, Credit all incomes/gains',
          'Debit liabilities, Credit assets'
        ],
        correctIndex: 1,
        explanation: 'For Real Accounts (assets and property), the rule is: Debit what comes in, Credit what goes out.'
      },
      {
        id: 7,
        topic: 'MS PowerPoint',
        question: 'What is the shortcut key to enter the PowerPoint Slide Master view to set default styling for all slides?',
        options: ['View Menu -> Slide Master', 'Ctrl + M', 'F5', 'Alt + F4'],
        correctIndex: 0,
        explanation: 'The Slide Master is accessed via View > Slide Master and controls themes, fonts, and layouts across the entire presentation.'
      },
      {
        id: 8,
        topic: 'Operating Systems',
        question: 'What is the keyboard shortcut to permanently delete a file in Windows without moving it to the Recycle Bin?',
        options: ['Delete', 'Shift + Delete', 'Ctrl + Delete', 'Alt + Delete'],
        correctIndex: 1,
        explanation: 'Shift + Delete bypasses the Recycle Bin and permanently deletes the selected file or folder.'
      },
      {
        id: 9,
        topic: 'MS Excel Shortcuts',
        question: 'Which keyboard shortcut in MS Excel creates an absolute cell reference (e.g. locks $A$1)?',
        options: ['F2', 'F4', 'F9', 'Ctrl + L'],
        correctIndex: 1,
        explanation: 'Pressing F4 while editing a cell formula toggles between relative, absolute ($A$1), and mixed ($A1, A$1) reference modes.'
      },
      {
        id: 10,
        topic: 'Computer Hardware',
        question: 'Which port is most commonly used today to connect modern high-definition monitors and displays to a PC?',
        options: ['VGA Port', 'HDMI Port', 'Serial Port', 'PS/2 Port'],
        correctIndex: 1,
        explanation: 'HDMI (High-Definition Multimedia Interface) transmits both uncompressed high-def digital video and audio.'
      },
      {
        id: 11,
        topic: 'Networking & Web',
        question: 'What is the primary function of a DNS (Domain Name System) server?',
        options: [
          'To assign IP addresses dynamically',
          'To translate human-friendly domain names (e.g. mskinstitute.in) into IP addresses',
          'To block malware and virus attacks',
          'To boost Wi-Fi router speed'
        ],
        correctIndex: 1,
        explanation: 'DNS translates human-readable domain names into numerical IP addresses required to locate server computers on the Internet.'
      },
      {
        id: 12,
        topic: 'Tally Prime',
        question: 'In Tally, which voucher type is used for funds transfer between Cash and Bank accounts?',
        options: ['Contra (F4)', 'Payment (F5)', 'Receipt (F6)', 'Journal (F7)'],
        correctIndex: 0,
        explanation: 'Contra Voucher (F4) is strictly used for internal cash deposits, cash withdrawals, and bank-to-bank account transfers.'
      },
      {
        id: 13,
        topic: 'MS Word Formatting',
        question: 'What is the shortcut key to increase font size in Microsoft Word?',
        options: ['Ctrl + Shift + >', 'Ctrl + Shift + <', 'Alt + F', 'Ctrl + ]'],
        correctIndex: 0,
        explanation: 'Ctrl + Shift + > increases font size to the next standard point size in Microsoft Word.'
      },
      {
        id: 14,
        topic: 'Data Storage',
        question: 'Which of the following secondary storage drives has no moving mechanical parts and offers the fastest read/write speeds?',
        options: ['HDD (Hard Disk Drive)', 'SSD (Solid State Drive)', 'Floppy Disk', 'Optical DVD'],
        correctIndex: 1,
        explanation: 'SSDs use NAND flash memory with zero moving parts, providing significantly higher data access speeds than magnetic HDDs.'
      },
      {
        id: 15,
        topic: 'Cyber Safety',
        question: 'Which security software is designed to detect, quarantine, and eliminate computer viruses, worms, and ransomware?',
        options: ['Antivirus', 'Web Browser', 'Spreadsheet', 'File Explorer'],
        correctIndex: 0,
        explanation: 'Antivirus software actively monitors system files and memory to neutralize malware and unauthorized intrusion.'
      }
    ]
  },

  // 3. Full-Stack Web Development Bootcamp
  'full-stack-web-dev-bootcamp': {
    courseSlug: 'full-stack-web-dev-bootcamp',
    courseTitle: 'Full-Stack Web Development (MERN Stack)',
    category: 'Full-Stack & Web Engineering',
    durationMinutes: 20,
    passingPercentage: 50,
    difficulty: 'All Levels',
    description: 'Test your web engineering expertise: HTML5, CSS3/Tailwind, JavaScript ES6+, React.js hooks, Node.js, Express, MongoDB, and REST API design.',
    questions: [
      {
        id: 1,
        topic: 'JavaScript ES6',
        question: 'What is the main difference between let and const in JavaScript?',
        options: [
          'let has block scope while const has global scope',
          'const variables cannot be reassigned while let variables can',
          'let is hoisted but const is not',
          'const can only store numbers'
        ],
        correctIndex: 1,
        explanation: 'Both let and const have block scope, but identifiers declared with const cannot be reassigned after declaration.'
      },
      {
        id: 2,
        topic: 'JavaScript Asynchronous',
        question: 'What will be printed to the console by the following code?',
        codeSnippet: `console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");`,
        options: ['A, B, C', 'A, C, B', 'B, A, C', 'C, A, B'],
        correctIndex: 1,
        explanation: 'setTimeout registers a macro-task on the event queue. Synchronous execution runs first ("A", "C"), then the event loop processes "B".'
      },
      {
        id: 3,
        topic: 'React Hooks',
        question: 'Which React hook should be used to run side effects like data fetching or DOM subscription?',
        options: ['useState', 'useEffect', 'useMemo', 'useContext'],
        correctIndex: 1,
        explanation: 'useEffect manages component lifecycle side effects, API network requests, timers, and cleanup subscriptions.'
      },
      {
        id: 4,
        topic: 'React State Management',
        question: 'Why should you never mutate React state directly (e.g. state.push(item))?',
        options: [
          'It throws an instant SyntaxError',
          'React relies on shallow object reference comparison to trigger re-renders',
          'It prevents CSS styles from applying',
          'It deletes browser memory'
        ],
        correctIndex: 1,
        explanation: 'React compares state references. Mutating in-place preserves the reference, so React fails to detect changes and will not re-render.'
      },
      {
        id: 5,
        topic: 'Node.js & Express',
        question: 'In Express.js middleware functions, what happens if you forget to call the next() function?',
        options: [
          'The server crashes with an error',
          'The HTTP request hangs indefinitely until client timeout',
          'The response is automatically sent as 200 OK',
          'The request restarts from the beginning'
        ],
        correctIndex: 1,
        explanation: 'If a middleware does not terminate the request cycle (e.g. res.send()) and does not invoke next(), the request hangs.'
      },
      {
        id: 6,
        topic: 'MongoDB & Database',
        question: 'In MongoDB, what is the default primary key field name automatically assigned to every document in a collection?',
        options: ['id', '_id', 'uuid', 'doc_id'],
        correctIndex: 1,
        explanation: 'MongoDB documents automatically contain a unique 12-byte BSON ObjectId stored under the _id field.'
      },
      {
        id: 7,
        topic: 'REST API Design',
        question: 'Which HTTP method should be used according to RESTful conventions to partially update an existing resource?',
        options: ['GET', 'POST', 'PATCH', 'DELETE'],
        correctIndex: 2,
        explanation: 'PATCH applies partial modifications to a resource, whereas PUT typically replaces the entire resource entity.'
      },
      {
        id: 8,
        topic: 'CSS Flexbox',
        question: 'In CSS Flexbox, which property aligns flex items along the primary main axis?',
        options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
        correctIndex: 1,
        explanation: 'justify-content distributes space and aligns items along the main axis of a flex container.'
      },
      {
        id: 9,
        topic: 'HTTP Status Codes',
        question: 'Which HTTP status code signifies that the client must authenticate itself to get the requested response?',
        options: ['200 OK', '401 Unauthorized', '404 Not Found', '500 Internal Server Error'],
        correctIndex: 1,
        explanation: '401 Unauthorized indicates that the request requires valid user authentication credentials.'
      },
      {
        id: 10,
        topic: 'JWT Authentication',
        question: 'What are the three parts of a JSON Web Token (JWT) separated by periods (.)?',
        options: [
          'Header, Payload, and Signature',
          'Key, Value, and Hash',
          'User, Role, and Permission',
          'Origin, Method, and Body'
        ],
        correctIndex: 0,
        explanation: 'A JWT comprises three base64url-encoded parts: Header (algorithm), Payload (claims/data), and Signature (secret verification).'
      },
      {
        id: 11,
        topic: 'React Props vs State',
        question: 'How do React components receive data passed down from their parent components?',
        options: ['State', 'Props', 'Redux', 'Cookies'],
        correctIndex: 1,
        explanation: 'Props (properties) are read-only inputs passed down from parent components to child components.'
      },
      {
        id: 12,
        topic: 'HTML5 Semantic Elements',
        question: 'Which HTML5 semantic tag should be used to wrap navigational site links for optimal accessibility and SEO?',
        options: ['<section>', '<nav>', '<header>', '<aside>'],
        correctIndex: 1,
        explanation: '<nav> is the semantic container specifically intended for major site navigation link blocks.'
      },
      {
        id: 13,
        topic: 'Node.js Runtime',
        question: 'Is Node.js multi-threaded by default for executing JavaScript code in the user application?',
        options: [
          'Yes, each request creates a new native OS thread',
          'No, it runs JavaScript on a single-threaded Event Loop backed by libuv worker pool for I/O',
          'Yes, it assigns 8 threads per CPU core',
          'No, Node.js cannot perform asynchronous operations'
        ],
        correctIndex: 1,
        explanation: 'Node.js runs single-threaded JavaScript via V8 and an event-driven non-blocking I/O loop backed by libuv.'
      },
      {
        id: 14,
        topic: 'MongoDB Queries',
        question: 'Which MongoDB aggregation stage is used to filter documents before grouping or projecting?',
        options: ['$group', '$match', '$project', '$lookup'],
        correctIndex: 1,
        explanation: '$match acts like a filter query, reducing the number of documents passed to downstream pipeline stages.'
      },
      {
        id: 15,
        topic: 'CORS & Security',
        question: 'What does the CORS (Cross-Origin Resource Sharing) browser security mechanism prevent?',
        options: [
          'CSS stylesheets from loading',
          'Malicious web pages on one origin from making unauthorized AJAX requests to a different API origin',
          'HTML pages from rendering images',
          'Users from inspecting JavaScript code'
        ],
        correctIndex: 1,
        explanation: 'CORS is a browser security protocol restricting unauthorized cross-origin HTTP requests unless explicitly permitted by response headers.'
      }
    ]
  },

  // 4. SQL & MySQL Mastery
  'sql-mysql-mastery-beginner-to-advanced--3-months': {
    courseSlug: 'sql-mysql-mastery-beginner-to-advanced--3-months',
    courseTitle: 'SQL & MySQL Database Mastery',
    category: 'Databases & Backend Engineering',
    durationMinutes: 20,
    passingPercentage: 50,
    difficulty: 'All Levels',
    description: 'Validate database querying skills: SELECT queries, WHERE filters, aggregate calculations, multi-table JOINs, subqueries, and table constraints.',
    questions: [
      {
        id: 1,
        topic: 'Basic Queries',
        question: 'Which SQL clause is used to eliminate duplicate rows from the query result set?',
        options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'GROUP BY'],
        correctIndex: 1,
        explanation: 'SELECT DISTINCT filters out duplicate tuples, returning only unique values.'
      },
      {
        id: 2,
        topic: 'Table Joins',
        question: 'Which type of JOIN returns all records from the left table, and matching records from the right table?',
        options: ['INNER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
        correctIndex: 1,
        explanation: 'LEFT JOIN returns all records from the left table; unmatched columns from the right table evaluate to NULL.'
      },
      {
        id: 3,
        topic: 'Aggregations',
        question: 'Which clause is used in SQL to filter the results of grouped records produced by GROUP BY?',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correctIndex: 1,
        explanation: 'WHERE filters rows before grouping occurs; HAVING filters aggregated groups created by GROUP BY.'
      },
      {
        id: 4,
        topic: 'Keys & Integrity',
        question: 'What is a Foreign Key in a relational database?',
        options: [
          'A key that encrypts data across foreign countries',
          'A column that references the Primary Key of another table to establish a relationship',
          'A secondary index that allows duplicates',
          'A key generated by third-party APIs'
        ],
        correctIndex: 1,
        explanation: 'A Foreign Key enforces referential integrity by pointing to the Primary Key of another table.'
      },
      {
        id: 5,
        topic: 'Sorting Results',
        question: 'Which SQL keyword specifies descending order when sorting query records?',
        options: ['ASC', 'DESC', 'DOWN', 'REVERSE'],
        correctIndex: 1,
        explanation: 'ORDER BY column_name DESC sorts rows in descending order (highest to lowest or Z to A).'
      },
      {
        id: 6,
        topic: 'Pattern Matching',
        question: 'In SQL, which wildcard character with LIKE represents any number of characters (zero or more)?',
        options: ['? (Question mark)', '% (Percent sign)', '_ (Underscore)', '* (Asterisk)'],
        correctIndex: 1,
        explanation: '% represents zero, one, or multiple characters; _ represents exactly one single character in SQL LIKE clauses.'
      },
      {
        id: 7,
        topic: 'Null Values',
        question: 'What is the correct syntax to test whether a column value is NULL?',
        options: ['WHERE column = NULL', 'WHERE column IS NULL', 'WHERE column == NULL', 'WHERE column IN (NULL)'],
        correctIndex: 1,
        explanation: 'In SQL, NULL represents missing unknown data and cannot be evaluated with =. You must use IS NULL or IS NOT NULL.'
      },
      {
        id: 8,
        topic: 'Data Manipulation',
        question: 'Which SQL statement is used to modify existing data in a database table?',
        options: ['MODIFY', 'UPDATE', 'CHANGE', 'ALTER'],
        correctIndex: 1,
        explanation: 'UPDATE modifies row values in an existing table; ALTER is used for table structure/schema changes.'
      },
      {
        id: 9,
        topic: 'Data Definition',
        question: 'What is the difference between DELETE and TRUNCATE in SQL?',
        options: [
          'DELETE removes table structure while TRUNCATE removes data',
          'TRUNCATE is a DDL operation that resets identity counters and cannot be rolled back easily, while DELETE is a DML row-by-row operation',
          'TRUNCATE only works on view tables',
          'DELETE is faster than TRUNCATE on large tables'
        ],
        correctIndex: 1,
        explanation: 'TRUNCATE deallocates data pages quickly (DDL); DELETE logs individual row removals (DML).'
      },
      {
        id: 10,
        topic: 'Aggregate Functions',
        question: 'Which SQL aggregate function computes the total sum of numerical values in a specified column?',
        options: ['COUNT()', 'TOTAL()', 'SUM()', 'AVG()'],
        correctIndex: 2,
        explanation: 'SUM() calculates the total numerical addition of all non-NULL values in the column.'
      },
      {
        id: 11,
        topic: 'Constraints',
        question: 'Which constraint ensures that all values in a column are distinct and cannot be duplicated?',
        options: ['NOT NULL', 'CHECK', 'UNIQUE', 'DEFAULT'],
        correctIndex: 2,
        explanation: 'The UNIQUE constraint ensures no duplicate entries are accepted for that column.'
      },
      {
        id: 12,
        topic: 'Subqueries',
        question: 'What is a correlated subquery in SQL?',
        options: [
          'A subquery executed once before the outer query',
          'A subquery that depends on values from the outer query for its evaluation and runs once for each candidate row',
          'A query that connects two databases',
          'A subquery with no WHERE clause'
        ],
        correctIndex: 1,
        explanation: 'A correlated subquery references columns from the outer query and is evaluated repeatedly for each row evaluated by the outer query.'
      },
      {
        id: 13,
        topic: 'Transactions',
        question: 'What does the ACID property acronym stand for in relational database management systems?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Action, Control, Index, Data',
          'Authentication, Communication, Interface, Distribution',
          'Access, Connection, Integrity, Delay'
        ],
        correctIndex: 0,
        explanation: 'ACID guarantees that database transactions are processed reliably: Atomicity, Consistency, Isolation, Durability.'
      },
      {
        id: 14,
        topic: 'Indexes',
        question: 'What is the primary benefit of creating an index on a frequently searched database column?',
        options: [
          'It reduces table disk storage',
          'It dramatically speeds up data retrieval SELECT queries',
          'It automatically encrypts the column data',
          'It speeds up bulk INSERT statements'
        ],
        correctIndex: 1,
        explanation: 'Indexes create balanced lookup trees (B-Trees) that allow fast searching without full table scans.'
      },
      {
        id: 15,
        topic: 'Pagination',
        question: 'In MySQL, which clause combination is used to fetch the top 10 records starting from row 21 (pagination)?',
        options: ['LIMIT 10 OFFSET 20', 'FETCH 10 NEXT 20', 'TOP 10 START 20', 'ROWNUM BETWEEN 21 AND 30'],
        correctIndex: 0,
        explanation: 'LIMIT 10 OFFSET 20 retrieves 10 records after skipping the initial 20 records.'
      }
    ]
  },

  // 5. HTML5 Complete Course
  'html5-complete-course': {
    courseSlug: 'html5-complete-course',
    courseTitle: 'HTML5 Complete Course',
    category: 'Frontend & Web Design',
    durationMinutes: 20,
    passingPercentage: 50,
    difficulty: 'Beginner',
    description: 'Assess foundational frontend markup: semantic structure, forms & validations, multimedia integration, links, tables, and web accessibility standards.',
    questions: [
      {
        id: 1,
        topic: 'Document Declaration',
        question: 'What is the correct DOCTYPE declaration for HTML5 documents?',
        options: ['<!DOCTYPE html>', '<!DOCTYPE HTML5>', '<!DOCTYPE html PUBLIC "...">', '<doctype html5>'],
        correctIndex: 0,
        explanation: '<!DOCTYPE html> is the concise and standard declaration specifying that the document is written in modern HTML5.'
      },
      {
        id: 2,
        topic: 'Semantic Structure',
        question: 'Which HTML5 semantic element should encapsulate standalone, self-contained content such as a blog post or news story?',
        options: ['<div>', '<article>', '<aside>', '<header>'],
        correctIndex: 1,
        explanation: '<article> represents an independent, self-contained composition that makes sense on its own (e.g. blog post, article).'
      },
      {
        id: 3,
        topic: 'Images & Accessibility',
        question: 'Which attribute of the <img> tag provides alternative text for screen readers and search engines when an image fails to load?',
        options: ['title', 'alt', 'caption', 'src'],
        correctIndex: 1,
        explanation: 'The alt attribute provides alternative descriptive text essential for screen readers and SEO accessibility.'
      },
      {
        id: 4,
        topic: 'Hyperlinks',
        question: 'Which target attribute value causes a hyperlink to open in a brand-new browser tab?',
        options: ['target="_self"', 'target="_blank"', 'target="_new"', 'target="_parent"'],
        correctIndex: 1,
        explanation: 'target="_blank" instructs the browser to open the linked document in a new window or tab.'
      },
      {
        id: 5,
        topic: 'Forms & Validation',
        question: 'Which HTML5 input attribute forces a form field to be filled before the user can submit the form?',
        options: ['validate="true"', 'required', 'mandatory', 'checked'],
        correctIndex: 1,
        explanation: 'The required boolean attribute specifies that an input field must be completed before submitting the form.'
      },
      {
        id: 6,
        topic: 'Multimedia',
        question: 'Which attribute must be added to an <audio> or <video> tag so user playback controls (play, pause, volume) are visible?',
        options: ['autoplay', 'controls', 'media', 'interactive'],
        correctIndex: 1,
        explanation: 'The controls attribute renders native audio/video playback, pause, seeking, and volume buttons.'
      },
      {
        id: 7,
        topic: 'HTML Tables',
        question: 'In an HTML table, which tag is used to create a table header cell with bold centered text by default?',
        options: ['<td>', '<th>', '<tr>', '<thead>'],
        correctIndex: 1,
        explanation: '<th> defines a table header cell, formatted by default as bold and horizontally centered.'
      },
      {
        id: 8,
        topic: 'Form Input Types',
        question: 'Which HTML5 input type automatically validates email address formatting on client-side form submission?',
        options: ['type="text"', 'type="email"', 'type="mail"', 'type="address"'],
        correctIndex: 1,
        explanation: 'type="email" activates built-in browser validation ensuring the entry matches standard email address patterns.'
      },
      {
        id: 9,
        topic: 'Metadata',
        question: 'Which tag located inside <head> specifies character encoding for international scripts including Hindi and emojis?',
        options: ['<meta charset="UTF-8">', '<meta lang="en">', '<meta encoding="all">', '<title>'],
        correctIndex: 0,
        explanation: '<meta charset="UTF-8"> ensures that all international Unicode characters, scripts, and symbols render accurately.'
      },
      {
        id: 10,
        topic: 'Lists',
        question: 'Which HTML tag creates a numbered sequential list?',
        options: ['<ul>', '<ol>', '<li>', '<dl>'],
        correctIndex: 1,
        explanation: '<ol> stands for Ordered List and automatically numbers its child <li> items.'
      },
      {
        id: 11,
        topic: 'Inline vs Block',
        question: 'Which of the following is an inline element by default in HTML?',
        options: ['<div>', '<p>', '<span>', '<h1>'],
        correctIndex: 2,
        explanation: '<span> is an inline element; it only occupies as much width as its content and does not force a line break.'
      },
      {
        id: 12,
        topic: 'Client Storage',
        question: 'What is the main difference between localStorage and sessionStorage in HTML5 Web Storage API?',
        options: [
          'localStorage data persists indefinitely until cleared, while sessionStorage data expires when the browser tab is closed',
          'sessionStorage can hold up to 100 GB',
          'localStorage only works on mobile phones',
          'sessionStorage data is sent to the server on every HTTP request'
        ],
        correctIndex: 0,
        explanation: 'localStorage persists across browser restarts; sessionStorage data is cleared when the browsing session / tab ends.'
      },
      {
        id: 13,
        topic: 'Graphic Rendering',
        question: 'Which HTML5 element provides an API for scriptable 2D pixel-based drawing and graphics via JavaScript?',
        options: ['<svg>', '<canvas>', '<graphic>', '<paint>'],
        correctIndex: 1,
        explanation: '<canvas> provides a resolution-dependent bitmap canvas used for procedural graphics, charts, and game rendering.'
      },
      {
        id: 14,
        topic: 'SEO & Social Cards',
        question: 'Which meta tags are used by WhatsApp, Facebook, and LinkedIn to generate preview image banners and titles when a link is shared?',
        options: ['Open Graph (og:title, og:image)', 'Dublin Core', 'Robots tags', 'Favicon tags'],
        correctIndex: 0,
        explanation: 'Open Graph (og:title, og:image, og:description) meta tags define rich preview snippets across social platforms and messaging apps.'
      },
      {
        id: 15,
        topic: 'Responsive Viewport',
        question: 'What is the purpose of <meta name="viewport" content="width=device-width, initial-scale=1.0">?',
        options: [
          'It enforces mobile screen dimensions on desktop monitors',
          'It tells mobile browsers to scale the viewport width to the device screen size for responsive layouts',
          'It disables user zooming completely',
          'It compresses web page images'
        ],
        correctIndex: 1,
        explanation: 'The viewport meta tag establishes proper viewport scaling on mobile devices so responsive CSS layouts adapt properly.'
      }
    ]
  }
};

/**
 * Helper to retrieve mock test for any given course slug.
 * If specific curated questions exist, returns them.
 * If an alias matches (e.g. python-for-beginners), returns the corresponding track.
 * If a course has no custom bank, generates a structured 15-question syllabus assessment so ANY course slug works seamlessly!
 */
export function getCourseMockTest(courseSlug: string, fallbackTitle?: string): CourseMockTestConfig {
  const normalized = courseSlug.toLowerCase().trim();

  // Direct Match
  if (COURSE_MOCK_TESTS[normalized]) {
    return COURSE_MOCK_TESTS[normalized];
  }

  // Alias Matching:
  if (normalized.includes('python')) {
    const base = COURSE_MOCK_TESTS['python-mastery-beginner-to-advanced--3-months'];
    return {
      ...base,
      courseSlug,
      courseTitle: fallbackTitle || 'Python Programming Assessment',
    };
  }

  if (normalized.includes('adca')) {
    const base = COURSE_MOCK_TESTS['adca'];
    return {
      ...base,
      courseSlug,
      courseTitle: fallbackTitle || 'ADCA Advanced Computer Assessment',
    };
  }

  if (normalized.includes('mern') || normalized.includes('web-dev') || normalized.includes('full-stack') || normalized.includes('javascript') || normalized.includes('frontend')) {
    const base = COURSE_MOCK_TESTS['full-stack-web-dev-bootcamp'];
    return {
      ...base,
      courseSlug,
      courseTitle: fallbackTitle || 'Full-Stack Web Development Assessment',
    };
  }

  if (normalized.includes('sql') || normalized.includes('mysql') || normalized.includes('database')) {
    const base = COURSE_MOCK_TESTS['sql-mysql-mastery-beginner-to-advanced--3-months'];
    return {
      ...base,
      courseSlug,
      courseTitle: fallbackTitle || 'SQL & Database Assessment',
    };
  }

  if (normalized.includes('html') || normalized.includes('css') || normalized.includes('web-design')) {
    const base = COURSE_MOCK_TESTS['html5-complete-course'];
    return {
      ...base,
      courseSlug,
      courseTitle: fallbackTitle || 'HTML5 & Web Design Assessment',
    };
  }

  // Dynamic Generic Syllabus Assessment for any other course in the 66-course catalog
  const cleanTitle = fallbackTitle || courseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    courseSlug,
    courseTitle: cleanTitle,
    category: 'Computer & Professional Skills',
    durationMinutes: 20,
    passingPercentage: 50,
    difficulty: 'All Levels',
    description: `Comprehensive skill assessment and mock test for ${cleanTitle}. Evaluate your core technical understanding, applied concepts, and exam readiness.`,
    questions: [
      {
        id: 1,
        topic: 'Core Fundamentals',
        question: `What is the foundational prerequisite before beginning practical assignments in ${cleanTitle}?`,
        options: [
          'Basic computer literacy and understanding of operating system navigation',
          'Advanced mathematical calculus degrees',
          'Owning a supercomputer server',
          'Memorizing raw binary code'
        ],
        correctIndex: 0,
        explanation: 'All practical courses begin with foundational computer literacy, logical understanding, and system navigation.'
      },
      {
        id: 2,
        topic: 'Applied Practice',
        question: `Why is hands-on laboratory practice emphasized over memorization in ${cleanTitle}?`,
        options: [
          'It is easier to grade students without checking code',
          'Practical application builds genuine muscle memory, problem-solving, and industry portfolio projects',
          'It eliminates the need for software licenses',
          'Practical labs take less student time'
        ],
        correctIndex: 1,
        explanation: 'Hands-on practice ensures students understand debugging, workflows, and can independently solve real-world problems.'
      },
      {
        id: 3,
        topic: 'Industry Standards',
        question: `Which workflow best represents modern industry quality assurance when completing a module in ${cleanTitle}?`,
        options: [
          'Writing code/documents once and never reviewing them',
          'Testing edge cases, validating outputs, checking formatting, and peer/mentor code review',
          'Submitting assignments without verifying instructions',
          'Ignoring error messages and warnings'
        ],
        correctIndex: 1,
        explanation: 'Industry workflows require systematic testing, error review, code formatting, and mentor verification.'
      },
      {
        id: 4,
        topic: 'Efficiency & Tooling',
        question: 'Which habit most significantly improves productivity when working with computer software and coding environments?',
        options: [
          'Using single-finger mouse clicks for every operation',
          'Mastering essential keyboard shortcuts, IDE extensions, and automation commands',
          'Disabling all software updates',
          'Never organizing project files into folders'
        ],
        correctIndex: 1,
        explanation: 'Keyboard shortcuts and structured file management double a professional’s execution speed.'
      },
      {
        id: 5,
        topic: 'Error Resolution',
        question: 'When an unexpected error or bug occurs during a practical session, what is the recommended diagnostic approach?',
        options: [
          'Immediately delete the entire operating system',
          'Read the exact error log message, identify the line number, inspect variables, and consult official documentation',
          'Assume the computer hardware is defective',
          'Ignore the error and continue running the application'
        ],
        correctIndex: 1,
        explanation: 'Carefully reading stack traces and error logs reveals the root cause and line number of the issue.'
      },
      {
        id: 6,
        topic: 'Version Control & Backups',
        question: 'What is the primary danger of working on software projects without regular backups or version control (e.g. Git)?',
        options: [
          'Files take up less storage space',
          'A single mistake or hardware failure can result in irreversible loss of hours of progress',
          'The computer will run too fast',
          'Fonts will become unreadable'
        ],
        correctIndex: 1,
        explanation: 'Version control safeguards your progress, allows reverting mistakes, and provides cloud backup security.'
      },
      {
        id: 7,
        topic: 'Security Essentials',
        question: 'Which practice is considered essential for digital data safety in modern computer workflows?',
        options: [
          'Using the same simple password across all platforms',
          'Enabling two-factor authentication (2FA) and encrypting sensitive credentials',
          'Sharing login details via public chat groups',
          'Turning off firewalls permanently'
        ],
        correctIndex: 1,
        explanation: 'Two-factor authentication and strong password management protect user accounts from unauthorized access.'
      },
      {
        id: 8,
        topic: 'Documentation & Clean Structure',
        question: 'Why are clear comments, clean naming conventions, and documentation valuable in any project?',
        options: [
          'They make the file size larger on disk',
          'They allow other developers, reviewers, and your future self to quickly understand and maintain the work',
          'They are required to make computers turn on',
          'They prevent typing errors automatically'
        ],
        correctIndex: 1,
        explanation: 'Clean readable code and documentation are the hallmarks of professional software engineering.'
      },
      {
        id: 9,
        topic: 'Problem Solving',
        question: 'What is the algorithmic technique of breaking a complex task into smaller, manageable sub-problems called?',
        options: ['Decomposition (Modularization)', 'Duplication', 'Complication', 'Fragmentation'],
        correctIndex: 0,
        explanation: 'Decomposition breaks complex systems into smaller, testable, modular components.'
      },
      {
        id: 10,
        topic: 'Career Portfolio',
        question: 'What is the most convincing proof of competency when applying for tech and computer jobs?',
        options: [
          'Claiming you know everything without showing work',
          'A live portfolio of verifiable projects, GitHub repositories, and verified credentials',
          'Only showing theoretical textbook definitions',
          'Having many social media followers'
        ],
        correctIndex: 1,
        explanation: 'Employers prioritize candidates with demonstrable, real-world portfolio deliverables and verified skills.'
      },
      {
        id: 11,
        topic: 'Continuous Learning',
        question: 'How should a tech professional stay up to date with rapidly evolving software tools?',
        options: [
          'Never learning anything new after passing a course',
          'Reading official release notes, practicing new features, and building side projects',
          'Only relying on outdated printed notes from 10 years ago',
          'Switching careers every 3 months'
        ],
        correctIndex: 1,
        explanation: 'Continuous learning through hands-on experimentation keeps skills relevant in tech.'
      },
      {
        id: 12,
        topic: 'Time Management',
        question: 'In competitive practical exams and professional assignments, how should time be allocated?',
        options: [
          'Spend all time on the first problem and leave the rest',
          'Scan all requirements first, complete high-confidence sections quickly, and review flagged items',
          'Wait until the last minute before starting',
          'Rush through without reading instructions'
        ],
        correctIndex: 1,
        explanation: 'Effective time management begins with understanding the complete scope and prioritizing high-yield sections.'
      },
      {
        id: 13,
        topic: 'Collaboration',
        question: 'Which tool is most widely used across the software industry for tracking issues and collaborative code reviews?',
        options: ['Git & GitHub', 'Notepad', 'Paint', 'Calculator'],
        correctIndex: 0,
        explanation: 'Git and GitHub are the global industry standard for version control, issue tracking, and code reviews.'
      },
      {
        id: 14,
        topic: 'Performance Optimization',
        question: 'What is the primary goal of performance optimization in digital workflows?',
        options: [
          'To make programs run with minimal latency, optimal memory usage, and great user experience',
          'To add unnecessary code lines',
          'To consume as much RAM as possible',
          'To prevent users from opening applications'
        ],
        correctIndex: 0,
        explanation: 'Optimization ensures software runs efficiently, saves server resources, and delivers snappy user experiences.'
      },
      {
        id: 15,
        topic: 'Certification & Verification',
        question: 'How can employers verify an MSK Institute certificate awarded upon passing this assessment?',
        options: [
          'They cannot verify it online',
          'By entering the student’s unique Certificate ID on https://www.mskinstitute.in/verify-certificate',
          'By sending a physical postal letter to Delhi',
          'By asking friends on social media'
        ],
        correctIndex: 1,
        explanation: 'MSK Institute awards digital QR-coded certificates with unique IDs verifiable 24/7 on the official website.'
      }
    ]
  };
}

export function getAllAvailableMockTests(): { slug: string; title: string; category: string; questionsCount: number; duration: number }[] {
  return [
    {
      slug: 'python-mastery-beginner-to-advanced--3-months',
      title: 'Python Programming Mastery',
      category: 'Programming',
      questionsCount: 15,
      duration: 20
    },
    {
      slug: 'adca',
      title: 'ADCA (Advance Diploma in Computer Applications)',
      category: 'Diploma',
      questionsCount: 15,
      duration: 20
    },
    {
      slug: 'full-stack-web-dev-bootcamp',
      title: 'Full-Stack Web Development (MERN Stack)',
      category: 'Web Dev',
      questionsCount: 15,
      duration: 20
    },
    {
      slug: 'sql-mysql-mastery-beginner-to-advanced--3-months',
      title: 'SQL & MySQL Database Mastery',
      category: 'Database',
      questionsCount: 15,
      duration: 20
    },
    {
      slug: 'html5-complete-course',
      title: 'HTML5 Complete Course',
      category: 'Frontend',
      questionsCount: 15,
      duration: 20
    },
    {
      slug: 'ccc',
      title: 'NIELIT CCC (Course on Computer Concepts)',
      category: 'Govt Exam',
      questionsCount: 20,
      duration: 25
    }
  ];
}

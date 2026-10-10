import { CodeSnippetItem } from '../types';

export const CODE_SNIPPETS: CodeSnippetItem[] = [
  // ==========================================
  // JAVASCRIPT (Levels 1 - 6)
  // ==========================================
  {
    id: 'js-level-1',
    levelNumber: 1,
    title: 'Level 1: Variables & Template Literals',
    language: 'javascript',
    difficulty: 'Beginner',
    description: 'Learn declarations with const and let, arithmetic operations, and string interpolation.',
    code: `const instituteName = "MSK Institute";
let activeStudents = 120;
const courseFee = 4500;

const summary = \`Welcome to \${instituteName}. Current batch has \${activeStudents} students enrolled.\`;
console.log(summary);`,
  },
  {
    id: 'js-level-2',
    levelNumber: 2,
    title: 'Level 2: Arrow Functions & Destructuring',
    language: 'javascript',
    difficulty: 'Beginner',
    description: 'Master ES6 arrow syntax, default parameters, and object destructuring.',
    code: `const calculateDiscount = (price, discountPercent = 10) => {
  const discountAmount = (price * discountPercent) / 100;
  return price - discountAmount;
};

const student = { name: "Aman", marks: 92, city: "Shikohabad" };
const { name, marks } = student;
const finalFee = calculateDiscount(5000, 15);`,
  },
  {
    id: 'js-level-3',
    levelNumber: 3,
    title: 'Level 3: Array Methods (Map, Filter, Reduce)',
    language: 'javascript',
    difficulty: 'Intermediate',
    description: 'Transform collections functionally with higher-order functions.',
    code: `const scores = [65, 88, 92, 45, 78, 95];

const topPerformers = scores
  .filter(score => score >= 75)
  .map(score => score + 5);

const totalScore = topPerformers.reduce((acc, curr) => acc + curr, 0);
const average = totalScore / topPerformers.length;`,
  },
  {
    id: 'js-level-4',
    levelNumber: 4,
    title: 'Level 4: Async / Await & API Fetch',
    language: 'javascript',
    difficulty: 'Intermediate',
    description: 'Handle asynchronous network requests with modern try/catch error handling.',
    code: `async function fetchStudentProfile(studentId) {
  try {
    const response = await fetch(\`/api/students/\${studentId}\`);
    if (!response.ok) throw new Error(\`Failed with status: \${response.status}\`);
    const data = await response.json();
    return { success: true, profile: data };
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    return { success: false, error: error.message };
  }
}`,
  },
  {
    id: 'js-level-5',
    levelNumber: 5,
    title: 'Level 5: DOM Events & LocalStorage',
    language: 'javascript',
    difficulty: 'Advanced',
    description: 'Listen to user events and persist state in the browser storage.',
    code: `function setupThemeToggle(buttonId) {
  const button = document.getElementById(buttonId);
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(currentTheme);

  button.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    document.body.className = nextTheme;
    localStorage.setItem("theme", nextTheme);
  });
}`,
  },
  {
    id: 'js-level-6',
    levelNumber: 6,
    title: 'Level 6: Debounce Performance Utility',
    language: 'javascript',
    difficulty: 'Advanced',
    description: 'Optimize high-frequency input events using higher-order closures.',
    code: `function debounce(callback, delay = 300) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

const handleSearch = debounce((query) => {
  console.log("Executing query for:", query);
}, 400);`,
  },

  // ==========================================
  // PYTHON (Levels 1 - 6)
  // ==========================================
  {
    id: 'py-level-1',
    levelNumber: 1,
    title: 'Level 1: Variables, Types & F-Strings',
    language: 'python',
    difficulty: 'Beginner',
    description: 'Practice clean Python syntax, dynamic typing, and formatted strings.',
    code: `institute = "MSK Institute"
course = "Full Stack Python"
total_modules = 12
is_active = True

message = f"Welcome to {institute}! Course: {course} ({total_modules} modules)"
print(message)`,
  },
  {
    id: 'py-level-2',
    levelNumber: 2,
    title: 'Level 2: Conditionals & For Loops',
    language: 'python',
    difficulty: 'Beginner',
    description: 'Learn loop iteration, range generator, and branch evaluation.',
    code: `grades = [88, 92, 64, 79, 95, 52]
passed_students = 0

for score in grades:
    if score >= 75:
        print(f"Distinction score: {score}")
        passed_students += 1
    elif score >= 60:
        print(f"Passed score: {score}")
        passed_students += 1
    else:
        print(f"Needs improvement: {score}")`,
  },
  {
    id: 'py-level-3',
    levelNumber: 3,
    title: 'Level 3: Functions & List Comprehensions',
    language: 'python',
    difficulty: 'Intermediate',
    description: 'Write concise, Pythonic functional transformations.',
    code: `def get_top_scorers(students: list[dict], threshold: int = 80) -> list[str]:
    return [
        s["name"].strip().title()
        for s in students
        if s.get("marks", 0) >= threshold
    ]

roster = [{"name": "rohan", "marks": 85}, {"name": "priya", "marks": 94}]
qualified = get_top_scorers(roster, 85)`,
  },
  {
    id: 'py-level-4',
    levelNumber: 4,
    title: 'Level 4: Dictionaries & Sets Analysis',
    language: 'python',
    difficulty: 'Intermediate',
    description: 'Master fast key-value lookups, hash mapping, and set operations.',
    code: `def count_word_frequency(text: str) -> dict[str, int]:
    words = text.lower().replace(",", "").replace(".", "").split()
    frequency = {}
    for word in words:
        frequency[word] = frequency.get(word, 0) + 1
    unique_words = set(words)
    return {"total": len(words), "unique": len(unique_words), "freq": frequency}`,
  },
  {
    id: 'py-level-5',
    levelNumber: 5,
    title: 'Level 5: Classes, OOP & Properties',
    language: 'python',
    difficulty: 'Advanced',
    description: 'Design robust object-oriented blueprints with encapsulated properties.',
    code: `class StudentRecord:
    def __init__(self, roll_no: str, name: str, branch: str):
        self.roll_no = roll_no
        self.name = name
        self.branch = branch
        self._attendance = 0.0

    @property
    def is_eligible(self) -> bool:
        return self._attendance >= 75.0

    def record_presence(self, days_attended: int, total_days: int) -> None:
        self._attendance = round((days_attended / total_days) * 100, 2)`,
  },
  {
    id: 'py-level-6',
    levelNumber: 6,
    title: 'Level 6: Recursion & Exception Handling',
    language: 'python',
    difficulty: 'Advanced',
    description: 'Implement memoized algorithms with safe file/network error recovery.',
    code: `def fibonacci_memo(n: int, cache: dict = {}) -> int:
    try:
        if n < 0:
            raise ValueError("Input must be a non-negative integer.")
        if n in cache:
            return cache[n]
        if n <= 1:
            return n
        cache[n] = fibonacci_memo(n - 1, cache) + fibonacci_memo(n - 2, cache)
        return cache[n]
    except ValueError as err:
        print("Calculation failed:", err)
        return 0`,
  },

  // ==========================================
  // C++ (Levels 1 - 6)
  // ==========================================
  {
    id: 'cpp-level-1',
    levelNumber: 1,
    title: 'Level 1: Standard I/O & Variables',
    language: 'cpp',
    difficulty: 'Beginner',
    description: 'Standard stream output with iostream, namespaces, and basic types.',
    code: `#include <iostream>
using namespace std;

int main() {
    string institute = "MSK Institute";
    int studentCount = 150;
    double batchRating = 4.9;

    cout << "Institute: " << institute << endl;
    cout << "Active Enrolled: " << studentCount << " students" << endl;
    return 0;
}`,
  },
  {
    id: 'cpp-level-2',
    levelNumber: 2,
    title: 'Level 2: Conditionals & Loops',
    language: 'cpp',
    difficulty: 'Beginner',
    description: 'Control flow with for loops, increment operators, and branching.',
    code: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 50; ++i) {
        if (i % 2 == 0) {
            sum += i;
        }
    }
    cout << "Sum of even numbers from 1 to 50: " << sum << endl;
    return 0;
}`,
  },
  {
    id: 'cpp-level-3',
    levelNumber: 3,
    title: 'Level 3: Pointers & References',
    language: 'cpp',
    difficulty: 'Intermediate',
    description: 'Direct memory addresses, dereferencing, and swap by reference.',
    code: `#include <iostream>

void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    int* ptrX = &x;
    swapValues(x, y);
    std::cout << "x: " << *ptrX << ", y: " << y << std::endl;
    return 0;
}`,
  },
  {
    id: 'cpp-level-4',
    levelNumber: 4,
    title: 'Level 4: Structs & Classes',
    language: 'cpp',
    difficulty: 'Intermediate',
    description: 'Object-oriented programming with constructors and member methods.',
    code: `class Student {
private:
    std::string name;
    int rollNumber;
    double marks;
public:
    Student(std::string n, int r, double m) : name(n), rollNumber(r), marks(m) {}

    bool hasPassed() const {
        return marks >= 40.0;
    }
};`,
  },
  {
    id: 'cpp-level-5',
    levelNumber: 5,
    title: 'Level 5: STL Vectors & Sorting',
    language: 'cpp',
    difficulty: 'Advanced',
    description: 'Dynamic arrays with std::vector, iterators, and std::sort algorithm.',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> scores = {88, 42, 95, 71, 63, 100};
    std::sort(scores.begin(), scores.end(), std::greater<int>());

    for (const auto& score : scores) {
        std::cout << score << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
  },
  {
    id: 'cpp-level-6',
    levelNumber: 6,
    title: 'Level 6: Binary Search Algorithm',
    language: 'cpp',
    difficulty: 'Advanced',
    description: 'Logarithmic search with pointers, midpoint calculations, and conditions.',
    code: `int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },

  // ==========================================
  // HTML & CSS (Levels 1 - 6)
  // ==========================================
  {
    id: 'html-level-1',
    levelNumber: 1,
    title: 'Level 1: Semantic Document Header',
    language: 'html-css',
    difficulty: 'Beginner',
    description: 'Build semantic HTML5 page headers with navigation and brand logos.',
    code: `<header class="site-header flex items-center justify-between">
  <a href="/" class="brand-logo font-bold text-xl">
    MSK<span class="text-amber-500">.</span>Institute
  </a>
  <nav class="nav-links flex gap-4 text-sm">
    <a href="/courses">Courses</a>
    <a href="/tools">Tools</a>
  </nav>
</header>`,
  },
  {
    id: 'html-level-2',
    levelNumber: 2,
    title: 'Level 2: Accessible Form & Inputs',
    language: 'html-css',
    difficulty: 'Beginner',
    description: 'Type clean forms with labels, email validation, and submit triggers.',
    code: `<form class="registration-form flex flex-col gap-3" method="POST">
  <label for="fullName" class="text-xs font-semibold">Full Name</label>
  <input id="fullName" type="text" name="fullName" required class="input-field" />

  <label for="userEmail" class="text-xs font-semibold">Email Address</label>
  <input id="userEmail" type="email" name="userEmail" required class="input-field" />

  <button type="submit" class="btn-submit">Submit Application</button>
</form>`,
  },
  {
    id: 'html-level-3',
    levelNumber: 3,
    title: 'Level 3: Flexbox Center Container',
    language: 'html-css',
    difficulty: 'Intermediate',
    description: 'Center and align elements both horizontally and vertically.',
    code: `<section class="hero-banner flex min-h-[400px] items-center justify-center p-8">
  <div class="content-box max-w-xl text-center space-y-4">
    <h1 class="text-4xl font-extrabold tracking-tight">Code With Confidence</h1>
    <p class="text-slate-400 text-sm">Master computer programming with practical labs.</p>
    <a href="/courses" class="btn-primary inline-block">Enroll Now</a>
  </div>
</section>`,
  },
  {
    id: 'html-level-4',
    levelNumber: 4,
    title: 'Level 4: CSS Grid Card Matrix',
    language: 'html-css',
    difficulty: 'Intermediate',
    description: 'Create responsive 3-column layouts with CSS Grid and gap spacing.',
    code: `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  <div class="card p-6 bg-slate-900 border border-slate-800 rounded-2xl">
    <h3 class="font-bold text-lg text-white">Full Stack Web</h3>
    <p class="text-xs text-slate-400 mt-1">MERN Stack, Next.js & Tailwind</p>
  </div>
  <div class="card p-6 bg-slate-900 border border-slate-800 rounded-2xl">
    <h3 class="font-bold text-lg text-white">Python Data Science</h3>
    <p class="text-xs text-slate-400 mt-1">NumPy, Pandas & Pyodide</p>
  </div>
</div>`,
  },
  {
    id: 'html-level-5',
    levelNumber: 5,
    title: 'Level 5: Glassmorphic Badge Component',
    language: 'html-css',
    difficulty: 'Advanced',
    description: 'Modern glass styling with backdrop filters and translucent borders.',
    code: `<div class="glass-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
  <span class="text-xs font-semibold text-white tracking-wide">Admissions Open 2026</span>
</div>`,
  },
  {
    id: 'html-level-6',
    levelNumber: 6,
    title: 'Level 6: Responsive Mobile Navigation',
    language: 'html-css',
    difficulty: 'Advanced',
    description: 'Build modern fixed bottom safe-area navbars for mobile PWAs.',
    code: `<nav class="mobile-nav fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
  <div class="flex items-center justify-around py-2 max-w-md mx-auto">
    <a href="/" class="nav-item flex flex-col items-center text-xs font-medium">Home</a>
    <a href="/courses" class="nav-item flex flex-col items-center text-xs font-medium">Courses</a>
    <a href="/tools" class="nav-item flex flex-col items-center text-xs font-medium active">Tools</a>
  </div>
</nav>`,
  },

  // ==========================================
  // SQL (Levels 1 - 6)
  // ==========================================
  {
    id: 'sql-level-1',
    levelNumber: 1,
    title: 'Level 1: Basic SELECT, WHERE & ORDER BY',
    language: 'sql',
    difficulty: 'Beginner',
    description: 'Retrieve and sort records matching specific conditions.',
    code: `SELECT student_id, first_name, email, enroll_date
FROM students
WHERE status = 'ACTIVE' AND city = 'Shikohabad'
ORDER BY enroll_date DESC
LIMIT 10;`,
  },
  {
    id: 'sql-level-2',
    levelNumber: 2,
    title: 'Level 2: INSERT, UPDATE & DELETE',
    language: 'sql',
    difficulty: 'Beginner',
    description: 'Execute fundamental data manipulation language (DML) statements.',
    code: `INSERT INTO enrollments (student_id, course_id, fee_paid, status)
VALUES (101, 'PY-101', 4500.00, 'PAID');

UPDATE students
SET phone = '+918393042166', updated_at = NOW()
WHERE student_id = 101;`,
  },
  {
    id: 'sql-level-3',
    levelNumber: 3,
    title: 'Level 3: Aggregate Functions & GROUP BY',
    language: 'sql',
    difficulty: 'Intermediate',
    description: 'Compute summaries with COUNT, SUM, AVG, and GROUP BY.',
    code: `SELECT 
    course_id,
    COUNT(student_id) AS total_enrolled,
    ROUND(AVG(score), 2) AS average_score,
    MAX(score) AS highest_score
FROM exam_results
GROUP BY course_id
ORDER BY total_enrolled DESC;`,
  },
  {
    id: 'sql-level-4',
    levelNumber: 4,
    title: 'Level 4: INNER & LEFT JOIN Queries',
    language: 'sql',
    difficulty: 'Intermediate',
    description: 'Connect related tables via primary and foreign key references.',
    code: `SELECT 
    s.student_id,
    s.first_name,
    c.course_name,
    e.fee_paid
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.id
WHERE e.status = 'ACTIVE';`,
  },
  {
    id: 'sql-level-5',
    levelNumber: 5,
    title: 'Level 5: HAVING & Subquery Filters',
    language: 'sql',
    difficulty: 'Advanced',
    description: 'Filter aggregated groups and compare with nested subqueries.',
    code: `SELECT c.course_name, COUNT(e.student_id) AS student_count
FROM courses c
INNER JOIN enrollments e ON c.id = e.course_id
GROUP BY c.course_name
HAVING COUNT(e.student_id) >= (
    SELECT AVG(batch_size) FROM batch_analytics
)
ORDER BY student_count DESC;`,
  },
  {
    id: 'sql-level-6',
    levelNumber: 6,
    title: 'Level 6: Transactions & Indexes',
    language: 'sql',
    difficulty: 'Advanced',
    description: 'Ensure ACID reliability with atomic transactions and indexing.',
    code: `START TRANSACTION;

CREATE INDEX idx_student_status ON students(status, city);

UPDATE accounts SET balance = balance - 4500 WHERE account_id = 'ACC_01';
UPDATE accounts SET balance = balance + 4500 WHERE account_id = 'MSK_CORP';

COMMIT;`,
  },

  // ==========================================
  // REACT (Levels 1 - 6)
  // ==========================================
  {
    id: 'react-level-1',
    levelNumber: 1,
    title: 'Level 1: JSX Components & Props',
    language: 'react',
    difficulty: 'Beginner',
    description: 'Create reusable functional components with TypeScript props.',
    code: `interface CourseBadgeProps {
  title: string;
  isPopular?: boolean;
}

export function CourseBadge({ title, isPopular = false }: CourseBadgeProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
      <span className="text-sm font-bold text-white">{title}</span>
      {isPopular && <span className="text-[10px] bg-secondary text-white px-2 py-0.5 rounded">Hot</span>}
    </div>
  );
}`,
  },
  {
    id: 'react-level-2',
    levelNumber: 2,
    title: 'Level 2: useState State Management',
    language: 'react',
    difficulty: 'Beginner',
    description: 'Track reactive values and handle interactive button clicks.',
    code: `export function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl">
      <span className="font-mono text-2xl font-bold text-white">{count}</span>
      <button
        onClick={() => setCount(prev => prev + 1)}
        className="px-4 py-2 bg-secondary text-white rounded-xl font-bold"
      >
        Increment
      </button>
    </div>
  );
}`,
  },
  {
    id: 'react-level-3',
    levelNumber: 3,
    title: 'Level 3: useEffect & Data Loading',
    language: 'react',
    difficulty: 'Intermediate',
    description: 'Fetch data on component mount with loading and cleanup states.',
    code: `export function StudentList() {
  const [students, setStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setStudents(data);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div>Loading records...</div>;
  return <ul>{students.map(s => <li key={s}>{s}</li>)}</ul>;
}`,
  },
  {
    id: 'react-level-4',
    levelNumber: 4,
    title: 'Level 4: Custom Reusable Hook',
    language: 'react',
    difficulty: 'Intermediate',
    description: 'Extract common state logic into a clean custom hook.',
    code: `export function useToggle(initialValue = false) {
  const [state, setState] = useState(initialValue);
  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, { toggle, setTrue, setFalse }] as const;
}`,
  },
  {
    id: 'react-level-5',
    levelNumber: 5,
    title: 'Level 5: Controlled Form Validation',
    language: 'react',
    difficulty: 'Advanced',
    description: 'Handle user input fields with real-time error messages.',
    code: `export function EnrollmentForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    setError("");
    console.log("Registered:", email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input value={email} onChange={e => setEmail(e.target.value)} />
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button type="submit">Enroll</button>
    </form>
  );
}`,
  },
  {
    id: 'react-level-6',
    levelNumber: 6,
    title: 'Level 6: Context & useReducer Dispatch',
    language: 'react',
    difficulty: 'Advanced',
    description: 'Build a predictable global state machine with actions and reducers.',
    code: `type Action = { type: 'LOGIN'; user: string } | { type: 'LOGOUT' };
interface AuthState { user: string | null; isAuthenticated: boolean; }

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.user, isAuthenticated: true };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false };
    default:
      return state;
  }
}`,
  },
];

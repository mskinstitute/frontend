import { CodeTemplate, SupportedLanguage } from './types';

export const STARTER_TEMPLATES: Record<SupportedLanguage, CodeTemplate[]> = {
  python: [
    {
      id: 'py-welcome',
      title: 'Welcome & Print Statements',
      language: 'python',
      description: 'Introductory Python program demonstrating output formatting and variables.',
      code: `# Welcome to MSK Institute Python Playground!
# Powered by Monaco Editor & Pyodide WebAssembly

name = "Er. Sumit Kumar"
institute = "MSK Institute of Technology, Shikohabad"
batch_year = 2026

print("========================================")
print(f"🚀 Learning Python at {institute}")
print(f"👨‍🏫 Mentor: {name}")
print(f"📅 Session: {batch_year}")
print("========================================\\n")

students = ["Aman", "Priya", "Rahul", "Neha", "Vikas"]
print("Registered Batch Students:")
for idx, student in enumerate(students, 1):
    print(f"  {idx}. {student} - Enrolled in Python Masterclass")

print("\\n✅ Try editing this code and press 'Run Code' (Ctrl + Enter)!")
`,
    },
    {
      id: 'py-matplotlib',
      title: '📊 Matplotlib & Data Science Chart',
      language: 'python',
      description: 'Generate plots and data science visualizations with Matplotlib in Pyodide.',
      code: `# MSK Institute - Data Science & Matplotlib Visualization
import matplotlib.pyplot as plt
import numpy as np

# Sample Data: Student course enrollment at MSK Institute
courses = ['Python', 'Full Stack', 'C / C++', 'Java', 'Data Science', 'CCC']
students = [95, 80, 65, 55, 70, 110]
colors = ['#FF6B00', '#007ACC', '#4EBA6F', '#E76F51', '#9B5DE5', '#F15BB5']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))

# 1. Bar Chart
ax1.bar(courses, students, color=colors, edgecolor='#333', linewidth=1.2)
ax1.set_title('Course Enrollment (2026)', fontsize=11, fontweight='bold')
ax1.set_ylabel('Number of Students')
ax1.tick_params(axis='x', rotation=25)
ax1.grid(axis='y', linestyle='--', alpha=0.5)

# 2. Pie Chart
ax2.pie(students, labels=courses, autopct='%1.1f%%', colors=colors, startangle=140)
ax2.set_title('Batch Distribution Ratio', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

print("✅ Chart rendered! Check the '📊 Plots / Visuals' tab.")
`,
    },
    {
      id: 'py-marksheet',
      title: 'Student Marksheet & Grading',
      language: 'python',
      description: 'Calculate total, percentage, and grade for student exams.',
      code: `# MSK Institute - Student Performance Calculator
def calculate_grade(marks):
    total = sum(marks.values())
    percentage = total / len(marks)
    
    if percentage >= 85:
        grade = "A+ (Outstanding)"
    elif percentage >= 75:
        grade = "A (Excellent)"
    elif percentage >= 60:
        grade = "B (Good)"
    elif percentage >= 50:
        grade = "C (Pass)"
    else:
        grade = "Fail (Needs Improvement)"
        
    return total, percentage, grade

student_marks = {
    "Python Programming": 92,
    "Web Technologies": 88,
    "Database & SQL": 85,
    "Data Structures": 79
}

total, pct, grade = calculate_grade(student_marks)

print("🎓 MSK INSTITUTE REPORT CARD")
print("-" * 35)
for subject, mark in student_marks.items():
    print(f"{subject.ljust(22)}: {mark}/100")
print("-" * 35)
print(f"Total Marks Obtained  : {total}/400")
print(f"Final Percentage      : {pct:.2f}%")
print(f"Awarded Grade         : {grade}")
`,
    },
    {
      id: 'py-fibonacci',
      title: 'Fibonacci & Prime Numbers',
      language: 'python',
      description: 'Algorithmic loop demonstration for Fibonacci series and prime checks.',
      code: `# Fibonacci Series & Prime Number Checker
def generate_fibonacci(n):
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True

print("🔢 First 10 Fibonacci Numbers:")
print(generate_fibonacci(10))

print("\\n🔍 Checking Prime Numbers between 1 and 30:")
primes = [n for n in range(1, 31) if is_prime(n)]
print(primes)
`,
    },
  ],
  html: [
    {
      id: 'web-card',
      title: 'Modern Course Card (HTML/CSS/JS)',
      language: 'html',
      description: 'Interactive responsive card with CSS styling and JavaScript click effect.',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MSK Institute Course Card</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 28px;
      max-width: 380px;
      width: 100%;
      color: white;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      border-color: #38bdf8;
    }
    .badge {
      display: inline-block;
      background: #0284c7;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 14px;
    }
    h2 { font-size: 22px; font-weight: 800; margin-bottom: 8px; color: #f8fafc; }
    p { font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
    .btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
    .status { margin-top: 14px; font-size: 12px; text-align: center; color: #38bdf8; min-height: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🔥 Popular Track</span>
    <h2>Python Full-Stack Mastery</h2>
    <p>Master Python, Django, REST APIs, and modern frontend development with Er. Sumit Kumar at MSK Institute.</p>
    <button class="btn" id="demoBtn">Book Free Demo Class</button>
    <div class="status" id="statusMsg"></div>
  </div>

  <script>
    const btn = document.getElementById('demoBtn');
    const msg = document.getElementById('statusMsg');
    let clicks = 0;

    btn.addEventListener('click', () => {
      clicks++;
      console.log('User clicked Book Demo button! Count:', clicks);
      msg.textContent = '🎉 Demo seat requested! Inquiry sent successfully.';
    });
  </script>
</body>
</html>
`,
    },
    {
      id: 'web-counter',
      title: 'Interactive Counter Widget',
      language: 'html',
      description: 'Clean HTML, CSS, and JS counter demonstrating DOM events.',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; background: #f1f5f9; }
    .box { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center; width: 280px; }
    h1 { font-size: 54px; margin: 16px 0; color: #0f172a; }
    .btns { display: flex; gap: 12px; justify-content: center; }
    button { padding: 10px 18px; font-size: 18px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; }
    .dec { background: #fee2e2; color: #ef4444; }
    .inc { background: #dcfce7; color: #16a34a; }
    .rst { background: #e2e8f0; color: #475569; font-size: 13px; margin-top: 14px; width: 100%; }
  </style>
</head>
<body>
  <div class="box">
    <h3>Live Counter</h3>
    <h1 id="count">0</h1>
    <div class="btns">
      <button class="dec" id="btnDec">-</button>
      <button class="inc" id="btnInc">+</button>
    </div>
    <button class="rst" id="btnRst">Reset</button>
  </div>

  <script>
    let val = 0;
    const countEl = document.getElementById('count');
    document.getElementById('btnInc').onclick = () => { val++; update(); };
    document.getElementById('btnDec').onclick = () => { val--; update(); };
    document.getElementById('btnRst').onclick = () => { val = 0; update(); };
    function update() {
      countEl.textContent = val;
      console.log("Current Counter Value:", val);
    }
  </script>
</body>
</html>
`,
    },
  ],
  javascript: [
    {
      id: 'js-array-methods',
      title: 'Array Methods (Map, Filter, Reduce)',
      language: 'javascript',
      description: 'Essential functional array operations used in modern web development.',
      code: `// Modern JavaScript Array Processing Demo
// MSK Institute JavaScript Mastery

const courses = [
  { id: 1, name: "Python Masterclass", category: "Programming", fee: 4999, students: 120 },
  { id: 2, name: "MERN Stack Full-Time", category: "Web Dev", fee: 8999, students: 85 },
  { id: 3, name: "NIELIT CCC Certification", category: "Govt Exam", fee: 2499, students: 230 },
  { id: 4, name: "Data Analytics with Python", category: "Programming", fee: 6499, students: 60 },
  { id: 5, name: "ADCA 1-Year Diploma", category: "Diploma", fee: 7999, students: 140 }
];

console.log("📊 Total Registered Courses:", courses.length);

// 1. FILTER: Find all Programming track courses
const programmingCourses = courses.filter(c => c.category === "Programming");
console.log("\\n1. Programming Track Courses:");
console.log(programmingCourses.map(c => c.name));

// 2. MAP: Course Titles with Formatted Fees
const formattedCatalog = courses.map(c => \`\${c.name} - ₹\${c.fee}\`);
console.log("\\n2. Formatted Catalog:");
console.log(formattedCatalog);

// 3. REDUCE: Total Enrollment & Gross Academy Revenue
const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
const totalRevenue = courses.reduce((sum, c) => sum + (c.fee * c.students), 0);

console.log("\\n3. Academy Statistics:");
console.log("Total Active Students:", totalStudents);
console.log("Estimated Cumulative Value: ₹" + totalRevenue.toLocaleString("en-IN"));
`,
    },
    {
      id: 'js-async-demo',
      title: 'Async/Await & Promises',
      language: 'javascript',
      description: 'Simulate asynchronous data fetching with async/await and try/catch.',
      code: `// Asynchronous Programming in Modern JavaScript
async function fetchBatchSchedule(batchId) {
  console.log(\`⏳ Fetching live schedule for batch: \${batchId}...\`);
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    batchId: batchId,
    title: "Python Fast-Track Morning Batch",
    instructor: "Er. Sumit Kumar",
    timing: "08:00 AM - 09:30 AM IST",
    days: "Mon, Wed, Fri",
    location: "Lab Room 2, MSK Institute Shikohabad",
    nextClassTopic: "Object-Oriented Programming (Classes & Inheritance)"
  };
}

async function run() {
  try {
    const data = await fetchBatchSchedule("BATCH-PY-2026");
    console.log("\\n✅ Schedule Retrieved Successfully!");
    console.log("Course:", data.title);
    console.log("Instructor:", data.instructor);
    console.log("Timing:", data.timing);
    console.log("Next Topic:", data.nextClassTopic);
  } catch (err) {
    console.error("Failed to load batch:", err);
  }
}

run();
`,
    },
  ],
  typescript: [
    {
      id: 'ts-interfaces',
      title: 'TypeScript Interfaces & Generics',
      language: 'typescript',
      description: 'Type-safe programming patterns in TypeScript.',
      code: `// TypeScript Interface and Generic Data Repository
interface Student {
  id: string;
  name: string;
  course: string;
  isEnrolled: boolean;
  score?: number;
}

class StudentRegistry<T extends Student> {
  private items: T[] = [];

  addStudent(student: T): void {
    this.items.push(student);
    console.log(\`✅ Enrolled: \${student.name} into \${student.course}\`);
  }

  getEnrolled(): T[] {
    return this.items.filter(s => s.isEnrolled);
  }
}

const registry = new StudentRegistry<Student>();
registry.addStudent({ id: "S101", name: "Aman Sharma", course: "Python Masterclass", isEnrolled: true });
registry.addStudent({ id: "S102", name: "Pooja Verma", course: "MERN Stack", isEnrolled: true });

console.log("Total Enrolled Students:", registry.getEnrolled().length);
`,
    },
  ],
  css: [
    {
      id: 'css-flex-grid',
      title: 'CSS Modern Layouts & Animations',
      language: 'css',
      description: 'Modern CSS styling properties.',
      code: `/* Modern Glassmorphism & Neon Glow CSS */
.msk-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background: #090d16;
}

.msk-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.msk-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: #0284c7;
  box-shadow: 0 12px 36px rgba(2, 132, 199, 0.25);
}
`,
    },
  ],
  cpp: [
    {
      id: 'cpp-basics',
      title: '⚡ C++ Basics (I/O, Loops & Functions)',
      language: 'cpp',
      description: 'Standard I/O with cin/cout, functions, and conditional logic.',
      code: `// MSK Institute - C++ Standard Programming
// Powered by GCC 14.1 Compiler Engine
#include <iostream>
#include <string>

using namespace std;

// Function to calculate student percentage and grade
void evaluateStudent(string name, int marks[], int count) {
    int total = 0;
    for (int i = 0; i < count; i++) {
        total += marks[i];
    }
    double percentage = static_cast<double>(total) / count;

    cout << "========================================" << endl;
    cout << "🎓 Student Name: " << name << endl;
    cout << "📊 Total Marks: " << total << " / " << (count * 100) << endl;
    cout << "📈 Percentage: " << percentage << "%" << endl;
    cout << "🏆 Result: " << (percentage >= 40.0 ? "PASSED" : "FAILED") << endl;
    cout << "========================================" << endl;
}

int main() {
    cout << "🚀 Welcome to MSK Institute C++ Playground!" << endl;
    cout << "Compiler: GCC 14.1.0 (C++20 / C++23 ready)\n" << endl;

    int marks[] = {85, 92, 78, 88, 95};
    int count = sizeof(marks) / sizeof(marks[0]);

    evaluateStudent("Aman Sharma", marks, count);

    return 0;
}
`,
    },
    {
      id: 'cpp-oop',
      title: '🏛️ C++ Classes & Object-Oriented Programming',
      language: 'cpp',
      description: 'Object-Oriented Programming in C++ with constructors, methods, and encapsulation.',
      code: `// MSK Institute - C++ Object-Oriented Programming
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Student {
private:
    string name;
    string course;
    int rollNo;
    double cgpa;

public:
    // Constructor
    Student(string n, string c, int r, double g) 
        : name(n), course(c), rollNo(r), cgpa(g) {}

    // Display student details
    void display() const {
        cout << "[" << rollNo << "] " << name 
             << " | Course: " << course 
             << " | CGPA: " << cgpa << endl;
    }

    double getCgpa() const { return cgpa; }
};

int main() {
    cout << "MSK Institute - Batch Enrolled Students (C++ OOP)" << endl;
    cout << "-------------------------------------------------" << endl;

    vector<Student> batch = {
        Student("Aman Sharma", "B.Tech CSE", 101, 8.8),
        Student("Priya Verma", "MCA Web Dev", 102, 9.2),
        Student("Rahul Kumar", "Data Science", 103, 8.4)
    };

    for (const auto& student : batch) {
        student.display();
    }

    return 0;
}
`,
    },
    {
      id: 'cpp-stl-vector',
      title: '📦 Modern C++ STL (Vectors & Sorting)',
      language: 'cpp',
      description: 'Standard Template Library (STL) vectors, sort algorithm, and lambda functions.',
      code: `// MSK Institute - Modern C++ STL & Algorithms
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

using namespace std;

int main() {
    vector<int> scores = {92, 74, 88, 65, 99, 81, 70, 95};

    cout << "Original Scores:" << endl;
    for (int s : scores) cout << s << " ";
    cout << "\\n\\n";

    // 1. Sort in ascending order
    sort(scores.begin(), scores.end());
    cout << "Sorted Scores (Ascending):" << endl;
    for (int s : scores) cout << s << " ";
    cout << "\\n\\n";

    // 2. Compute Sum and Average using std::accumulate
    int sum = accumulate(scores.begin(), scores.end(), 0);
    double avg = static_cast<double>(sum) / scores.size();

    cout << "Highest Score: " << scores.back() << endl;
    cout << "Lowest Score:  " << scores.front() << endl;
    cout << "Class Average: " << avg << endl;

    return 0;
}
`,
    },
  ],
  c: [
    {
      id: 'c-basics',
      title: '⚡ C Basics (Functions & Formatted I/O)',
      language: 'c',
      description: 'Standard C programming with printf, loops, and custom functions.',
      code: `// MSK Institute - C Programming Core
// Powered by GCC 14.1 Compiler
#include <stdio.h>

void printHeader(const char* title) {
    printf("========================================\\n");
    printf("🚀 %s\\n", title);
    printf("Mentor: Er. Sumit Kumar | MSK Institute\\n");
    printf("========================================\\n\\n");
}

int main() {
    printHeader("Learning C Programming Language");

    printf("Registered Students for C Masterclass:\\n");
    const char* students[] = {"Aman", "Priya", "Rahul", "Neha", "Vikas"};
    int count = sizeof(students) / sizeof(students[0]);

    for (int i = 0; i < count; i++) {
        printf("  %d. %-10s - Enrolled\\n", i + 1, students[i]);
    }

    printf("\\n✅ Code compiled and executed with GCC 14.1!\\n");
    return 0;
}
`,
    },
    {
      id: 'c-pointers',
      title: '🎯 C Pointers & Array Processing',
      language: 'c',
      description: 'Pointer arithmetic, address dereferencing, and array statistics.',
      code: `// MSK Institute - Pointer Arithmetic & Functions
#include <stdio.h>

void calculateStats(int *arr, int size, int *sum, float *avg) {
    *sum = 0;
    for (int i = 0; i < size; i++) {
        *sum += *(arr + i); // Pointer arithmetic: *(arr + i) is arr[i]
    }
    *avg = (float)(*sum) / size;
}

int main() {
    int marks[] = {85, 92, 78, 89, 95};
    int size = sizeof(marks) / sizeof(marks[0]);
    int sum = 0;
    float avg = 0.0f;

    printf("MSK Institute - Lab Evaluation in C\\n");
    printf("----------------------------------\\n");
    calculateStats(marks, size, &sum, &avg);

    printf("Total Marks:   %d\\n", sum);
    printf("Average Score: %.2f\\n", avg);

    return 0;
}
`,
    },
    {
      id: 'c-structures',
      title: '🏗️ C Structures (struct) & Records',
      language: 'c',
      description: 'Defining and organizing records with C struct and functions.',
      code: `// MSK Institute - C Struct & Records Management
#include <stdio.h>
#include <string.h>

struct Student {
    int id;
    char name[50];
    char course[30];
    float fee;
};

void printStudent(const struct Student *s) {
    printf("ID: %-4d | Name: %-15s | Course: %-15s | Fee: ₹%.2f\\n",
           s->id, s->name, s->course, s->fee);
}

int main() {
    printf("MSK Institute - Student Directory (struct)\\n");
    printf("-------------------------------------------\\n");

    struct Student batch[3] = {
        {101, "Aman Sharma", "Full Stack C/C++", 4500.0f},
        {102, "Pooja Verma", "Data Structures", 5000.0f},
        {103, "Rohan Kumar", "Core Programming", 3500.0f}
    };

    for (int i = 0; i < 3; i++) {
        printStudent(&batch[i]);
    }

    return 0;
}
`,
    },
  ],
  java: [
    {
      id: 'java-basics',
      title: 'Java OOP - Inheritance & Polymorphism',
      language: 'java',
      description: 'Core Java OOP concepts.',
      code: `// MSK Institute - Java Programming
class InstituteMember {
    protected String name;
    protected String role;

    public InstituteMember(String name, String role) {
        this.name = name;
        this.role = role;
    }

    public void introduce() {
        System.out.println("Hello, I am " + name + " (" + role + ") at MSK Institute.");
    }
}

class Instructor extends InstituteMember {
    private String subject;

    public Instructor(String name, String subject) {
        super(name, "Senior Instructor");
        this.subject = subject;
    }

    @Override
    public void introduce() {
        super.introduce();
        System.out.println("Specialization: " + subject);
    }
}

public class Main {
    public static void main(String[] args) {
        Instructor sumitSir = new Instructor("Er. Sumit Kumar", "Full Stack Development & Python");
        sumitSir.introduce();
    }
}
`,
    },
  ],
  sql: [
    {
      id: 'sql-mysql-starter',
      title: 'MySQL Environment (Databases & Tables)',
      language: 'sql',
      description: 'Full MySQL support: CREATE DATABASE, USE, SHOW DATABASES, SHOW TABLES, DESCRIBE, AUTO_INCREMENT.',
      code: `-- MSK Institute - MySQL & Standard SQL In-Browser Environment
-- Fully supports MySQL commands: CREATE DATABASE, USE, SHOW DATABASES, SHOW TABLES, DESCRIBE, etc.

-- 1. Create a database and switch to it
CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- 2. Create tables with MySQL AUTO_INCREMENT & VARCHAR types
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    course VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    city VARCHAR(50) DEFAULT 'Shikohabad'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Insert student records
INSERT INTO students (name, course, score, city) VALUES 
    ('Aman Sharma', 'Python Full Stack', 92, 'Shikohabad'),
    ('Priya Verma', 'Web Development', 88, 'Firozabad'),
    ('Rahul Kumar', 'Data Science & AI', 95, 'Agra'),
    ('Neha Gupta', 'Python Full Stack', 84, 'Shikohabad'),
    ('Vikas Yadav', 'Java Masterclass', 78, 'Mainpuri'),
    ('Anjali Singh', 'Web Development', 91, 'Shikohabad');

-- 4. Inspect MySQL schemas and structure
SHOW DATABASES;
SHOW TABLES;
DESCRIBE students;

-- 5. Query top performers with conditional grading
SELECT id, name, course, score, city,
       CASE 
           WHEN score >= 90 THEN 'A+ (Distinction)'
           WHEN score >= 80 THEN 'A (Excellent)'
           ELSE 'B (Good)'
       END AS grade
FROM students
ORDER BY score DESC;
`,
    },
    {
      id: 'sql-students',
      title: 'Student Database & Grades',
      language: 'sql',
      description: 'CREATE TABLE, INSERT students, and query performance statistics with SQLite.',
      code: `-- MSK Institute - SQLite In-Browser Database
-- Run SQL queries and view real-time table results!

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    score INTEGER NOT NULL,
    city TEXT DEFAULT 'Shikohabad'
);

INSERT INTO students (name, course, score, city) VALUES 
    ('Aman Sharma', 'Python Full Stack', 92, 'Shikohabad'),
    ('Priya Verma', 'Web Development', 88, 'Firozabad'),
    ('Rahul Kumar', 'Data Science & AI', 95, 'Agra'),
    ('Neha Gupta', 'Python Full Stack', 84, 'Shikohabad'),
    ('Vikas Yadav', 'Java Masterclass', 78, 'Mainpuri'),
    ('Anjali Singh', 'Web Development', 91, 'Shikohabad');

-- 1. Query Top Performers with Grading
SELECT id, name, course, score, city,
       CASE 
           WHEN score >= 90 THEN 'A+ (Distinction)'
           WHEN score >= 80 THEN 'A (Excellent)'
           ELSE 'B (Good)'
       END AS grade
FROM students
ORDER BY score DESC;

-- 2. Calculate Course Batch Averages
SELECT course, 
       COUNT(*) AS total_enrolled, 
       ROUND(AVG(score), 1) AS avg_score,
       MAX(score) AS top_score
FROM students
GROUP BY course
ORDER BY avg_score DESC;
`,
    },
    {
      id: 'sql-joins',
      title: 'Course Enrollment & Joins',
      language: 'sql',
      description: 'Relational database schema with INNER and LEFT JOINs.',
      code: `-- MSK Institute - Relational Database Schema & Joins

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    fee INTEGER NOT NULL,
    duration_months INTEGER NOT NULL
);

CREATE TABLE enrollments (
    enroll_id INTEGER PRIMARY KEY,
    student_name TEXT NOT NULL,
    course_id INTEGER,
    enrolled_date TEXT NOT NULL,
    FOREIGN KEY(course_id) REFERENCES courses(course_id)
);

INSERT INTO courses VALUES 
    (101, 'Python Full-Stack', 6500, 4),
    (102, 'MERN Stack Web Dev', 7500, 5),
    (103, 'C / C++ with DSA', 4500, 3),
    (104, 'Core & Advanced Java', 5500, 4);

INSERT INTO enrollments VALUES 
    (1, 'Rohan Sharma', 101, '2026-01-10'),
    (2, 'Kavita Singh', 102, '2026-01-15'),
    (3, 'Deepak Verma', 101, '2026-01-18'),
    (4, 'Sneha Patel', 103, '2026-02-01'),
    (5, 'Amit Kumar', 104, '2026-02-05');

-- INNER JOIN: Students with Course Details
SELECT 
    e.enroll_id,
    e.student_name,
    c.course_name,
    c.duration_months || ' Months' AS duration,
    '₹' || c.fee AS course_fee,
    e.enrolled_date
FROM enrollments e
JOIN courses c ON e.course_id = c.course_id
ORDER BY e.enroll_id;
`,
    },
  ],
  markdown: [
    {
      id: 'md-readme',
      title: '📋 Project README.md Template',
      language: 'markdown',
      description: 'Professional GitHub-ready project README with badges, tables, and code snippets.',
      code: `# 🚀 Awesome Web Project

A fast, responsive, and modern full-stack web application built for the **MSK Institute of Technology** learning ecosystem.

---

## ✨ Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **Authentication** | Secure JWT-based user login & registration | ✅ Done |
| **Monaco Editor** | Real-time code playground with multi-language runtimes | ✅ Done |
| **Live Preview** | Side-by-side instant Markdown & Web rendering | ⚡ Live |
| **Dark Theme** | Authentic VS Code dark and high-contrast colorways | 🎨 Active |

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js \`>= 18.0.0\`
- npm or yarn package manager

### 2. Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/msk-institute/my-project.git

# Navigate to project folder
cd my-project

# Install dependencies
npm install
\`\`\`

### 3. Running the Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` in your browser to see the live app.

---

> 💡 **Pro Tip**: Press \`Ctrl + Enter\` in the playground to trigger real-time preview and compilation instantly!

> ⚠️ **Important Warning**: Never commit sensitive API credentials or private environment secrets to public GitHub repositories.

---

## 📜 License
Distributed under the **MIT License**. Created with ❤️ by Er. Sumit Kumar.
`,
    },
    {
      id: 'md-notes',
      title: '🎓 Student Lecture & Study Notes',
      language: 'markdown',
      description: 'Structured academic study notes template with callouts, formulas, and checklists.',
      code: `# 📘 Lecture Notes: Python Data Structures & Algorithms

- **Course**: Full-Stack Python Masterclass (2026)
- **Instructor**: Er. Sumit Kumar (MSK Institute)
- **Topic**: Lists, Dictionaries, and Time Complexity

---

## 🎯 Learning Objectives
1. Understand Python \`list\` vs \`tuple\` internal memory allocations.
2. Master Dictionary hash-map lookups with \`O(1)\` average time.
3. Apply binary search algorithms to sorted collections.

---

## 📌 Key Concepts

> 📌 **Note**: In Python, lists are dynamic arrays. Appending an element has an amortized time complexity of \`O(1)\`.

### Time Complexity Comparison

| Data Structure | Access | Search | Insertion | Deletion |
| :--- | :---: | :---: | :---: | :---: |
| **Array / List** | \`O(1)\` | \`O(n)\` | \`O(n)\` | \`O(n)\` |
| **Hash Map / Dict** | \`O(1)\` | \`O(1)\` | \`O(1)\` | \`O(1)\` |
| **Binary Search Tree** | \`O(log n)\` | \`O(log n)\` | \`O(log n)\` | \`O(log n)\` |

---

## 💻 Code Example: Binary Search

\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid  # Found at index
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1  # Not found

numbers = [10, 25, 33, 47, 59, 72, 88, 99]
print("Index of 47:", binary_search(numbers, 47))
\`\`\`

---

## ✅ Revision Checklist
- [x] Review Big-O notation fundamentals
- [x] Implement linear search vs binary search
- [ ] Practice 5 LeetCode array challenges
- [ ] Submit Assignment 3 on MSK Portal
`,
    },
    {
      id: 'md-cheatsheet',
      title: '⚡ Markdown & Coding Cheatsheet',
      language: 'markdown',
      description: 'Quick reference sheet for Markdown syntax, shortcuts, and styling rules.',
      code: `# ⚡ Markdown Quick Reference Cheatsheet

A handy guide for writing clean documentation, blogs, and project guides in the MSK Playground.

---

## 🔤 Text Formatting

| Style | Syntax | Output Example |
| :--- | :--- | :--- |
| **Bold** | \`**bold text**\` | **bold text** |
| *Italic* | \`*italic text*\` | *italic text* |
| ~~Strikethrough~~ | \`~~deleted text~~\` | ~~deleted text~~ |
| \`Inline Code\` | \` \\\`code\\\` \` | \`print("hello")\` |
| [Hyperlink](https://www.mskinstitute.in) | \`[MSK](https://www.mskinstitute.in)\` | [MSK Institute](https://www.mskinstitute.in) |

---

## 📑 Headings Hierarchy
# Heading Level 1 (\`# \`)
## Heading Level 2 (\`## \`)
### Heading Level 3 (\`### \`)
#### Heading Level 4 (\`#### \`)

---

## 🛠️ VS Code Playground Shortcuts

| Shortcut | Action |
| :--- | :--- |
| \`Ctrl + Enter\` | Run Code / Toggle Live Preview |
| \`Ctrl + S\` | Save Workspace File |
| \`Ctrl + B\` | Toggle Left Side Bar (Explorer, Search, Examples) |
| \`Ctrl + \`\` | Toggle Output Panel & Terminal |
| \`Esc\` | Exit Focus / Zen Mode |

---

> 💡 **Tip**: Fenced code blocks support syntax highlighting for python, javascript, html, css, cpp, c, java, sql, and bash!
`,
    },
    {
      id: 'md-tasklist',
      title: '☑️ Project Sprint & Task Tracker',
      language: 'markdown',
      description: 'Interactive sprint planner and checklist with project milestones.',
      code: `# 🎯 Project Sprint Tracker & Milestones

- **Sprint**: Q1 - Product Launch
- **Target Deadline**: March 31, 2026
- **Status**: 🟢 In Progress

---

## 📌 High Priority Deliverables
- [x] Setup Next.js 15 App Router architecture
- [x] Integrate Monaco Editor with multi-language WebAssembly compilers
- [x] Implement VS Code-style tabs and file explorer
- [ ] Deploy staging environment for beta students
- [ ] Configure automatic cloud backup for user code

---

## 📋 Weekly Backlog

### Phase 1: Core Features
- [x] Responsive layout with mobile support
- [x] Python Pyodide runtime integration
- [x] Web preview iframe sandbox
- [x] SQLite in-browser database engine

### Phase 2: User Experience
- [x] Search across workspace files
- [x] Coding challenges and practice drills
- [x] Examples and starter templates
- [ ] Export workspace as ZIP archive

---

> 📌 **Note**: All completed items will update visually with strike-through styling and checkmarks!
`,
    },
  ],
};


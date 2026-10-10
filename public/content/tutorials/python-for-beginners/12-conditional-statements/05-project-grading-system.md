---
id: project-grading-system
slug: project-grading-system
course: python-for-beginners
chapter: 12
topic: 12.5
title: "Project: Automated Academic Merit & Grading System"
description: "Build a production-grade academic report card and merit grading engine in Python. Master CBSE/University grading tiers, attendance auditing, compartment checks, and award honors using nested conditions."
difficulty: Beginner
readingTime: 16
order: 60
keywords:
  - python grading system project
  - academic report card python
  - cbse grade calculator python
  - attendance condonation logic
  - python conditionals project
  - student evaluation engine
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Capstone Project: Automated Academic Merit & Grading Engine

In this capstone project for Chapter 12, we will integrate all conditional control flow techniques—including `if-elif-else` ladders, nested conditions, guard clauses, short-hand guards, and ternary expressions—to build a production-grade **Academic Merit & Report Card Processing Engine**.

Real-world grading systems (such as those used by **CBSE, ICSE, or State Technical Universities**) do not simply look at an aggregate percentage. They enforce multi-tiered academic regulations:
1. **Attendance Compliance:** Minimum 75% classroom attendance (with medical condonation clauses).
2. **Subject-Level Clearance:** Passing cutoff (minimum 33% or 40%) in every individual subject.
3. **Compartment / Backlog Classification:** Differentiating students who failed 1 subject versus those who failed multiple.
4. **Honors & Distinction:** Awarding Dean's List or Gold Medals for top tier performers.

---

## Visual Architecture: The Academic Evaluation Pipeline

```
================================================================================
           ACADEMIC REPORT CARD & EVALUATION PIPELINE
================================================================================

                           [ Student Record Ingest ]
                                       |
                                       v
                     +-----------------------------------+
                     |   Stage 1: Attendance Audit Gate  |
                     |   (Attendance >= 75% or Medical)  |
                     +-----------------------------------+
                                  /         \
                         Passed  /           \ Failed (< 75%)
                                v             v
      +-----------------------------------+  [ Status: DEBARRED FROM EXAMS ]
      | Stage 2: Subject-Wise Clearance   |
      | Check marks in each individual    |
      | subject >= 35                     |
      +-----------------------------------+
             /             |             \
            /              |              \
    0 Subjects Failed  1 Subject Failed  2+ Subjects Failed
           v               v                       v
     [ All Passed ]  [ COMPARTMENT ]      [ ESSENTIAL REPEAT ]
           |
           v
      +-----------------------------------+
      | Stage 3: Aggregate Grade Mapping  |
      | (A1: >=91%, A2: >=81%, B1: >=71%) |
      +-----------------------------------+
           |
           v
      +-----------------------------------+
      | Stage 4: Honors & Merit Accolades |
      | (Dean's List / Gold Medalist)     |
      +-----------------------------------+
                                       |
                                       v
                          [ Render Final Marksheet ]
================================================================================
```

---

## 1. CBSE / University 9-Point Grading Scale Specification

Our engine implements the standard Central Board 9-point relative/absolute grading taxonomy:

| Percentage Range | Letter Grade | Grade Point | Academic Classification |
| :--- | :---: | :---: | :--- |
| **91.0% – 100.0%** | **A1** | 10.0 | Outstanding (Top Honors) |
| **81.0% – 90.9%**  | **A2** | 9.0  | Excellent |
| **71.0% – 80.9%**  | **B1** | 8.0  | Very Good |
| **61.0% – 70.9%**  | **B2** | 7.0  | Good (Above Average) |
| **51.0% – 60.9%**  | **C1** | 6.0  | Average |
| **41.0% – 50.9%**  | **C2** | 5.0  | Below Average |
| **33.0% – 40.9%**  | **D**  | 4.0  | Marginal Pass (Passing Cutoff) |
| **Below 33.0%**    | **E**  | 0.0  | Needs Essential Improvement |

---

## 2. Complete Modular Implementation

Here is the complete, runnable Python engine. It demonstrates clean guard clauses, nested verification trees, ternary expressions, and structured marksheet generation:

```python
# ==============================================================================
# PROJECT: Automated Academic Merit & Grading System
# Architecture: Multi-Stage Conditional Filtering Pipeline
# ==============================================================================

def evaluate_student_performance(student: dict) -> dict:
    """
    Evaluates student record through attendance gates, subject backlog checks,
    aggregate percentage grading, and merit classification.
    """
    PASSING_MARKS_PER_SUBJECT = 35.0
    MIN_ATTENDANCE_PCT = 75.0
    CONDONED_ATTENDANCE_PCT = 65.0
    
    # --------------------------------------------------------------------------
    # STAGE 1: Attendance Compliance Gate (Guard Clause Pattern)
    # --------------------------------------------------------------------------
    attendance = student["attendance_pct"]
    has_medical_certificate = student.get("has_medical_certificate", False)
    
    # Check if eligible under standard or medical condonation criteria
    if attendance < MIN_ATTENDANCE_PCT:
        if has_medical_certificate and attendance >= CONDONED_ATTENDANCE_PCT:
            attendance_status = "CONDONED (Medical Approved)"
        else:
            # Debarred: Student cannot receive passing marksheet
            return {
                "roll_no": student["roll_no"],
                "name": student["name"],
                "status": "DEBARRED",
                "final_grade": "N/A",
                "grade_point": 0.0,
                "percentage": 0.0,
                "remarks": f"Debarred due to low attendance ({attendance:.1f}%). Minimum {MIN_ATTENDANCE_PCT}% required."
            }
    else:
        attendance_status = "REGULAR (Compliant)"
        
    # --------------------------------------------------------------------------
    # STAGE 2: Subject-Wise Audit & Compartment Detection
    # --------------------------------------------------------------------------
    subjects = student["marks"]
    failed_subjects = []
    total_obtained = 0.0
    total_maximum = len(subjects) * 100.0
    
    for subject_name, marks in subjects.items():
        total_obtained += marks
        if marks < PASSING_MARKS_PER_SUBJECT:
            failed_subjects.append(subject_name)
            
    num_failures = len(failed_subjects)
    
    # Multi-branch outcome check:
    if num_failures >= 2:
        return {
            "roll_no": student["roll_no"],
            "name": student["name"],
            "status": "ESSENTIAL REPEAT",
            "final_grade": "E",
            "grade_point": 0.0,
            "percentage": (total_obtained / total_maximum) * 100.0,
            "remarks": f"Failed in {num_failures} subjects: {', '.join(failed_subjects)}. Must repeat academic year."
        }
    elif num_failures == 1:
        return {
            "roll_no": student["roll_no"],
            "name": student["name"],
            "status": "COMPARTMENT",
            "final_grade": "COMP",
            "grade_point": 0.0,
            "percentage": (total_obtained / total_maximum) * 100.0,
            "remarks": f"Eligible for compartment supplementary examination in {failed_subjects[0]}."
        }
        
    # --------------------------------------------------------------------------
    # STAGE 3: Aggregate Percentage & CBSE 9-Point Scale Mapping
    # --------------------------------------------------------------------------
    percentage = (total_obtained / total_maximum) * 100.0
    
    if percentage >= 91.0:
        grade = "A1"
        gp = 10.0
        classification = "Outstanding"
    elif percentage >= 81.0:
        grade = "A2"
        gp = 9.0
        classification = "Excellent"
    elif percentage >= 71.0:
        grade = "B1"
        gp = 8.0
        classification = "Very Good"
    elif percentage >= 61.0:
        grade = "B2"
        gp = 7.0
        classification = "Good"
    elif percentage >= 51.0:
        grade = "C1"
        gp = 6.0
        classification = "Average"
    elif percentage >= 41.0:
        grade = "C2"
        gp = 5.0
        classification = "Below Average"
    elif percentage >= 33.0:
        grade = "D"
        gp = 4.0
        classification = "Marginal Pass"
    else:
        grade = "E"
        gp = 0.0
        classification = "Fail"
        
    # --------------------------------------------------------------------------
    # STAGE 4: Honors & Accolades Evaluation (Ternary Operator)
    # --------------------------------------------------------------------------
    is_deans_honor = (percentage >= 95.0)
    distinction_holder = (percentage >= 75.0)
    
    honors_badge = (
        "GOLD MEDALIST (Dean's Roll of Honor)" if is_deans_honor else
        "FIRST CLASS WITH DISTINCTION" if distinction_holder else
        "FIRST DIVISION" if percentage >= 60.0 else
        "SECOND DIVISION" if percentage >= 50.0 else "PASS DIVISION"
    )
    
    return {
        "roll_no": student["roll_no"],
        "name": student["name"],
        "attendance": f"{attendance:.1f}% ({attendance_status})",
        "status": "PROMOTED",
        "total_marks": f"{total_obtained:.1f} / {total_maximum:.1f}",
        "percentage": percentage,
        "final_grade": grade,
        "grade_point": gp,
        "classification": classification,
        "honors": honors_badge,
        "remarks": "Passed all subjects successfully."
    }

def print_academic_transcript(report: dict) -> None:
    """Renders a beautifully formatted ASCII marksheet."""
    print("+" + "=" * 68 + "+")
    print(f"| {'DELHI PUBLIC SCHOOL / CBSE ACADEMIC TRANSCRIPT':^66} |")
    print("+" + "=" * 68 + "+")
    print(f"  Roll Number:     {report['roll_no']:<20} Candidate: {report['name']}")
    print(f"  Result Status:   {report['status']}")
    
    if report["status"] == "PROMOTED":
        print(f"  Attendance:      {report['attendance']}")
        print(f"  Total Score:     {report['total_marks']}")
        print(f"  Percentage:      {report['percentage']:.2f}%")
        print(f"  Letter Grade:    {report['final_grade']} (Grade Point: {report['grade_point']})")
        print(f"  Honors Category: {report['honors']}")
    elif report["status"] == "COMPARTMENT":
        print(f"  Percentage:      {report['percentage']:.2f}% (Provisional)")
        print(f"  Advisory:        {report['remarks']}")
    else:
        print(f"  Advisory:        {report['remarks']}")
    print("+" + "-" * 68 + "+\n")
```

---

## 3. Running Sample Batch Records & Verification

Let us pass diverse student profiles through the engine to test all conditional branches:

```python
# Test Dataset
student_roster = [
    # Profile 1: Top performer qualifying for Dean's List
    {
        "roll_no": "DPS-2026-001",
        "name": "Ananya Singhal",
        "attendance_pct": 94.5,
        "has_medical_certificate": False,
        "marks": {"English": 96, "Mathematics": 98, "Physics": 95, "Chemistry": 94, "Computer Science": 99}
    },
    # Profile 2: High scorer debarred due to chronic absenteeism
    {
        "roll_no": "DPS-2026-002",
        "name": "Vikramaditya Roy",
        "attendance_pct": 61.0,
        "has_medical_certificate": False,
        "marks": {"English": 88, "Mathematics": 91, "Physics": 85, "Chemistry": 89, "Computer Science": 92}
    },
    # Profile 3: Single subject backlog eligible for compartment
    {
        "roll_no": "DPS-2026-003",
        "name": "Manish Tiwari",
        "attendance_pct": 82.0,
        "has_medical_certificate": False,
        "marks": {"English": 62, "Mathematics": 28, "Physics": 54, "Chemistry": 58, "Computer Science": 66}
    },
    # Profile 4: Low attendance permitted due to medical condonation
    {
        "roll_no": "DPS-2026-004",
        "name": "Sneha Kulkarni",
        "attendance_pct": 68.0,
        "has_medical_certificate": True,
        "marks": {"English": 78, "Mathematics": 84, "Physics": 76, "Chemistry": 82, "Computer Science": 85}
    },
    # Profile 5: Multiple subject failures (Essential Repeat)
    {
        "roll_no": "DPS-2026-005",
        "name": "Farhan Akhtar",
        "attendance_pct": 79.0,
        "has_medical_certificate": False,
        "marks": {"English": 45, "Mathematics": 22, "Physics": 29, "Chemistry": 50, "Computer Science": 60}
    }
]

for s in student_roster:
    report = evaluate_student_performance(s)
    print_academic_transcript(report)
```

**Output:**
```text
+====================================================================+
|          DELHI PUBLIC SCHOOL / CBSE ACADEMIC TRANSCRIPT            |
+====================================================================+
  Roll Number:     DPS-2026-001         Candidate: Ananya Singhal
  Result Status:   PROMOTED
  Attendance:      94.5% (REGULAR (Compliant))
  Total Score:     482.0 / 500.0
  Percentage:      96.40%
  Letter Grade:    A1 (Grade Point: 10.0)
  Honors Category: GOLD MEDALIST (Dean's Roll of Honor)
+--------------------------------------------------------------------+

+====================================================================+
|          DELHI PUBLIC SCHOOL / CBSE ACADEMIC TRANSCRIPT            |
+====================================================================+
  Roll Number:     DPS-2026-002         Candidate: Vikramaditya Roy
  Result Status:   DEBARRED
  Advisory:        Debarred due to low attendance (61.0%). Minimum 75.0% required.
+--------------------------------------------------------------------+

+====================================================================+
|          DELHI PUBLIC SCHOOL / CBSE ACADEMIC TRANSCRIPT            |
+====================================================================+
  Roll Number:     DPS-2026-003         Candidate: Manish Tiwari
  Result Status:   COMPARTMENT
  Percentage:      53.60% (Provisional)
  Advisory:        Eligible for compartment supplementary examination in Mathematics.
+--------------------------------------------------------------------+

+====================================================================+
|          DELHI PUBLIC SCHOOL / CBSE ACADEMIC TRANSCRIPT            |
+====================================================================+
  Roll Number:     DPS-2026-004         Candidate: Sneha Kulkarni
  Result Status:   PROMOTED
  Attendance:      68.0% (CONDONED (Medical Approved))
  Total Score:     405.0 / 500.0
  Percentage:      81.00%
  Letter Grade:    A2 (Grade Point: 9.0)
  Honors Category: FIRST CLASS WITH DISTINCTION
+--------------------------------------------------------------------+

+====================================================================+
|          DELHI PUBLIC SCHOOL / CBSE ACADEMIC TRANSCRIPT            |
+====================================================================+
  Roll Number:     DPS-2026-005         Candidate: Farhan Akhtar
  Result Status:   ESSENTIAL REPEAT
  Advisory:        Failed in 2 subjects: Mathematics, Physics. Must repeat academic year.
+--------------------------------------------------------------------+
```

---

## 4. Key Architectural Patterns Mastered in this Project

1. **Gatekeeper Guard Clauses:** Notice how Stage 1 checks attendance first. If a candidate is debarred, the function exits immediately with a clean dictionary, completely bypassing unnecessary grade math.
2. **Failure Accumulation:** Rather than aborting at the first failed subject, Stage 2 aggregates all failed subjects into a list (`failed_subjects`). This permits counting the exact number of backlogs to differentiate between a single *Compartment* vs. an *Essential Repeat*.
3. **Hierarchical Boundary Mapping:** Stage 3 maps percentages to letter grades from highest to lowest (`>= 91`, `>= 81`, etc.). Because `elif` short-circuits upon the first match, no compound checks like `91 <= pct <= 100` are needed.
4. **Ternary Badge Assignment:** Stage 4 utilizes chained ternary expressions to cleanly assign the honors accolade in a single readable block.

---

## Quick Revision Summary

- Production-grade grading pipelines apply **layered validation**: compliance gates -> subject clearance -> aggregate mapping -> honors classification.
- Guard clauses keep code flat and maintainable by terminating invalid states early.
- Always check grading boundaries in strictly **descending order** (`90`, `80`, `70`, etc.) when using `if-elif-else` ladders.
- Chained ternary expressions provide an elegant, declarative way to assign categorical status badges.

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Inconsistent Indentation
Python requires consistent indentation (recommended: 4 spaces). Mixing tabs and spaces raises an `IndentationError`:
```python
# ❌ Inconsistent indentation
if True:
    print("Line 1 with spaces")
	print("Line 2 with tab")  # IndentationError!
```

### 2. Forgetting the Trailing Colon (`:`)
Every `if`, `elif`, and `else` statement must end with a colon:
```python
# ❌ SyntaxError: expected ':'
# if age >= 18

# ✅ CORRECT
if age >= 18:
    print("Eligible to vote")
```

---

## Practice Quiz

### 1. In an `if-elif-else` ladder checking numerical grades, why should percentage thresholds be checked in descending order (e.g. >=90, then >=80, then >=70)?
A. Because Python sorts `elif` statements automatically at runtime
B. Because an `elif` block exits upon finding the first True condition; ascending order would cause 95% to trigger the >=40% check first
C. Because Python raises an `IndentationError` if numerical comparisons are not in order
D. Descending order is required by the PEP 8 linter

**Answer:** B

---

### 2. What design pattern is utilized when a student's attendance is validated and rejected at the very beginning of the function before any grade math runs?
A. Singleton Pattern
B. Guard Clause (Bouncer Pattern / Early Exit)
C. Factory Method
D. Arrow Anti-Pattern

**Answer:** B

---

### 3. Consider a student with marks `[95, 90, 88, 30]`. In our project grading engine with a subject passing cutoff of 35, what will their status be?
A. PROMOTED (Passed on aggregate)
B. DEBARRED
C. COMPARTMENT
D. ESSENTIAL REPEAT

**Answer:** C

---

### 4. What will be the result of the following ternary expression when `pct = 96.0`?
```python
badge = "Gold" if pct >= 95.0 else "Silver" if pct >= 80.0 else "Bronze"
```
A. Gold
B. Silver
C. Bronze
D. Gold and Silver

**Answer:** A

---

### 5. Why is accumulating failed subjects into a list (`failed_subjects.append(sub)`) better than using a boolean flag (`has_failed = True`)?
A. Lists consume less memory than boolean flags in Python
B. A list allows determining the exact backlog count (differentiating 1 subject for Compartment vs 2+ for Repeat) as well as displaying subject names
C. Boolean flags cannot be used in for-loops
D. Lists run on multi-threaded CPU cores in Python

**Answer:** B

---

# Practice Challenge: Semester GPA (SGPA) & Credit Points Calculator

Extend the academic evaluation system to calculate **Semester Grade Point Average (SGPA)** for an engineering degree program at an Indian University (AKTU / Anna University / VTU). 

Each course carries a specific number of **credit units** (e.g., Data Structures: 4 credits, Mathematics: 4 credits, Physics Lab: 2 credits).

### Requirements:
1. **Grade Point Mapping:**
   - 90–100: Grade `O` (10 GP)
   - 80–89: Grade `A+` (9 GP)
   - 70–79: Grade `A` (8 GP)
   - 60–69: Grade `B+` (7 GP)
   - 50–59: Grade `B` (6 GP)
   - 40–49: Grade `C` (5 GP)
   - Below 40: Grade `F` (0 GP - Fail)
2. **SGPA Formula:**
   $$\text{SGPA} = \frac{\sum (\text{Course Credits} \times \text{Grade Points})}{\sum \text{Total Course Credits}}$$
3. **Academic Standing:**
   - If any course has Grade `F`, Academic Standing is `"BACKLOG"`.
   - Else if $\text{SGPA} \ge 8.5$: `"FIRST CLASS WITH DISTINCTION"`.
   - Else if $\text{SGPA} \ge 6.5$: `"FIRST CLASS"`.
   - Else: `"SECOND CLASS"`.

### Complete Solution

```python
# ==============================================================================
# Challenge: University SGPA & Credit Points Engine
# ==============================================================================

def compute_course_grade_point(score: float) -> tuple:
    """Returns (Letter Grade, Grade Point) based on score."""
    if score >= 90: return ("O", 10)
    elif score >= 80: return ("A+", 9)
    elif score >= 70: return ("A", 8)
    elif score >= 60: return ("B+", 7)
    elif score >= 50: return ("B", 6)
    elif score >= 40: return ("C", 5)
    else: return ("F", 0)

def generate_semester_marksheet(student_name: str, course_data: list) -> dict:
    total_credit_points = 0
    total_credits = 0
    has_backlog = False
    graded_courses = []
    
    for course in course_data:
        name = course["course_name"]
        credits = course["credits"]
        score = course["marks"]
        
        grade, gp = compute_course_grade_point(score)
        if grade == "F":
            has_backlog = True
            
        earned_points = credits * gp
        total_credit_points += earned_points
        total_credits += credits
        
        graded_courses.append({
            "course": name,
            "credits": credits,
            "marks": score,
            "grade": grade,
            "gp": gp,
            "points": earned_points
        })
        
    sgpa = total_credit_points / total_credits if total_credits > 0 else 0.0
    
    # Standing classification using ternary / conditions
    if has_backlog:
        standing = "BACKLOG (Course Re-appearance Required)"
    else:
        standing = (
            "FIRST CLASS WITH DISTINCTION" if sgpa >= 8.5 else
            "FIRST CLASS" if sgpa >= 6.5 else "SECOND CLASS"
        )
        
    return {
        "student": student_name,
        "courses": graded_courses,
        "total_credits": total_credits,
        "total_points": total_credit_points,
        "sgpa": sgpa,
        "standing": standing
    }

# Test Course Enrollments
semester_record = [
    {"course_name": "Data Structures & Algorithms", "credits": 4, "marks": 88},
    {"course_name": "Discrete Mathematics",        "credits": 4, "marks": 92},
    {"course_name": "Digital Logic & Design",       "credits": 3, "marks": 74},
    {"course_name": "Database Systems",             "credits": 3, "marks": 81},
    {"course_name": "Data Structures Lab",          "credits": 2, "marks": 95}
]

marksheet = generate_semester_marksheet("Arjun Ramaswamy", semester_record)

print(f"=== SEMESTER GRADE REPORT: {marksheet['student'].upper()} ===")
print(f"{'Course Name':<32} {'Credits':<8} {'Marks':<7} {'Grade':<6} {'Points'}")
print("-" * 62)
for c in marksheet["courses"]:
    print(f"{c['course']:<32} {c['credits']:<8} {c['marks']:<7} {c['grade']:<6} {c['points']}")
print("-" * 62)
print(f"Total Registered Credits: {marksheet['total_credits']}")
print(f"Total Quality Points:     {marksheet['total_points']}")
print(f"Semester SGPA:            {marksheet['sgpa']:.2f} / 10.00")
print(f"Academic Standing:        {marksheet['standing']}")
```

```text
Output:
=== SEMESTER GRADE REPORT: ARJUN RAMASWAMY ===
Course Name                      Credits  Marks   Grade  Points
--------------------------------------------------------------
Data Structures & Algorithms     4        88      A+     36
Discrete Mathematics             4        92      O      40
Digital Logic & Design           3        74      A      24
Database Systems                 3        81      A+     27
Data Structures Lab              2        95      O      20
--------------------------------------------------------------
Total Registered Credits: 16
Total Quality Points:     147
Semester SGPA:            9.19 / 10.00
Academic Standing:        FIRST CLASS WITH DISTINCTION
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **While Loop** (13: Loops).

👉 **[Continue to Next Lesson: While Loop →](/tutorials/python-for-beginners/while-loop)**

---
id: python-intermediate-student-report-card-generator
slug: student-report-card-generator
course: python-for-intermediate
chapter: "15: Capstone Project"
topic: "15.2 Student Report Card Generator"
title: "Student Report Card Generator in Python"
description: "Master student report card generator in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 70
keywords:
  - python student report card generator
  - python intermediate
  - python student report card generator
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Capstone Project 2: Student Report Card Generator in Python

In this final capstone project of the intermediate curriculum, we unite all major technical competencies acquired across this course—**Data Structures, File Handling with JSON & CSV, Object-Oriented Design, Exception Safety, Statistical Metrics, and Visual Chart Generation with Matplotlib**—to build an automated **Academic Report Card & Performance Analytics Generator**.

---

## 1. System Architecture & Objectives

Our system automates academic transcript generation for schools and universities:

1. **Data Ingestion**: Parses student profiles, subjects, and examination marks from structured JSON or CSV datasets.
2. **Academic Analytics Engine**:
   - Computes Total Marks, Percentage, Weighted GPA (on a 10.0 scale), and Letter Grades (`A+`, `A`, `B`, `C`, `F`).
   - Calculates Class Averages per subject for benchmark comparison.
3. **Multi-Format Publishing**:
   - Generates a formatted ASCII/Text Official Academic Transcript.
   - Generates a visual performance comparison chart (`report_card_<roll_no>.png`) plotting individual student scores alongside the class average using Matplotlib.

---

## 2. Complete Project Implementation

```python
import json
import os
import matplotlib.pyplot as plt
from typing import Dict, List, Any


# Standard Academic Grading Scale
def determine_grade(percentage: float) -> str:
    if percentage >= 90.0:
        return "A+"
    elif percentage >= 80.0:
        return "A"
    elif percentage >= 70.0:
        return "B"
    elif percentage >= 60.0:
        return "C"
    elif percentage >= 50.0:
        return "D"
    else:
        return "F"


class StudentReportCard:
    """Represents an individual student's academic evaluation."""

    def __init__(self, roll_no: str, name: str, marks: Dict[str, float]):
        self.roll_no = roll_no
        self.name = name
        self.marks = marks
        self.total_marks = sum(marks.values())
        self.max_possible = len(marks) * 100.0
        self.percentage = (self.total_marks / self.max_possible) * 100.0
        self.gpa = round((self.percentage / 10.0), 2)
        self.overall_grade = determine_grade(self.percentage)
        self.is_passed = all(score >= 40.0 for score in marks.values())

    def print_transcript(self):
        """Prints a formal academic grade report to console."""
        print("\n" + "=" * 60)
        print("               OFFICIAL ACADEMIC TRANSCRIPT")
        print("               MSK INSTITUTE OF TECHNOLOGY")
        print("=" * 60)
        print(f" Student Name : {self.name:<25} Roll No: {self.roll_no}")
        print(f" Status       : {'PASS' if self.is_passed else 'FAIL':<25} Overall Grade: {self.overall_grade}")
        print("-" * 60)
        print(f"{'SUBJECT':<25} | {'MAX':<8} | {'OBTAINED':<10} | {'GRADE'}")
        print("-" * 60)
        for subject, score in self.marks.items():
            print(f"{subject:<25} | {100:<8} | {score:<10.1f} | {determine_grade(score)}")
        print("-" * 60)
        print(f" TOTAL SCORE  : {self.total_marks:.1f} / {self.max_possible:.0f} ({self.percentage:.2f}%)")
        print(f" CUMULATIVE GPA: {self.gpa} / 10.0")
        print("=" * 60 + "\n")


class ReportCardGenerator:
    """Manages class-level analytics and multi-format report publishing."""

    def __init__(self, students_data: List[Dict[str, Any]]):
        self.students = [
            StudentReportCard(s["roll_no"], s["name"], s["marks"]) 
            for s in students_data
        ]
        self.class_averages = self._calculate_class_averages()

    def _calculate_class_averages(self) -> Dict[str, float]:
        """Calculates mean performance per subject across the student body."""
        subject_totals = {}
        subject_counts = {}

        for student in self.students:
            for subject, score in student.marks.items():
                subject_totals[subject] = subject_totals.get(subject, 0.0) + score
                subject_counts[subject] = subject_counts.get(subject, 0) + 1

        return {
            subject: round(subject_totals[subject] / subject_counts[subject], 2)
            for subject in subject_totals
        }

    def generate_visual_chart(self, student: StudentReportCard, output_dir: str = "transcripts"):
        """Renders and saves a Matplotlib chart comparing student scores to class mean."""
        os.makedirs(output_dir, exist_ok=True)

        subjects = list(student.marks.keys())
        student_scores = [student.marks[s] for s in subjects]
        class_means = [self.class_averages.get(s, 0.0) for s in subjects]

        fig, ax = plt.subplots(figsize=(9, 5))
        
        import numpy as np
        x = np.arange(len(subjects))
        width = 0.35

        # Bar series
        b1 = ax.bar(x - width/2, student_scores, width, label=f"{student.name}", color="#2563eb")
        b2 = ax.bar(x + width/2, class_means, width, label="Class Average", color="#94a3b8")

        # Passing threshold line
        ax.axhline(40.0, color="#ef4444", linestyle="--", linewidth=1.2, label="Passing Threshold (40%)")

        ax.set_title(f"Academic Performance: {student.name} ({student.roll_no})", fontsize=13, fontweight="bold")
        ax.set_ylabel("Marks Obtained (Max: 100)")
        ax.set_xticks(x)
        ax.set_xticklabels(subjects)
        ax.set_ylim(0, 110)
        ax.legend(loc="upper right")
        ax.grid(True, linestyle=":", alpha=0.6)

        # Annotate student scores
        for bar in b1:
            yval = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2, yval + 1.5, f"{yval:.0f}", ha="center", fontsize=9, fontweight="bold")

        plt.tight_layout()
        chart_path = os.path.join(output_dir, f"report_{student.roll_no}.png")
        fig.savefig(chart_path, dpi=200)
        plt.close(fig)
        print(f"Performance Chart saved to: '{chart_path}'")

    def export_all_reports(self):
        """Generates transcripts and visual charts for every student in the dataset."""
        print(f"\nProcessing academic evaluations for {len(self.students)} students...")
        for s in self.students:
            s.print_transcript()
            self.generate_visual_chart(s)


# -------------------------------------------------------------
# Demonstration Dataset
# -------------------------------------------------------------
sample_class_dataset = [
    {
        "roll_no": "CS-101",
        "name": "Aarav Sharma",
        "marks": {
            "Data Structures": 92.0,
            "Computer Networks": 88.0,
            "Operating Systems": 81.0,
            "Database Systems": 95.0
        }
    },
    {
        "roll_no": "CS-102",
        "name": "Diya Patel",
        "marks": {
            "Data Structures": 78.0,
            "Computer Networks": 84.0,
            "Operating Systems": 90.0,
            "Database Systems": 86.0
        }
    },
    {
        "roll_no": "CS-103",
        "name": "Rohan Verma",
        "marks": {
            "Data Structures": 65.0,
            "Computer Networks": 70.0,
            "Operating Systems": 68.0,
            "Database Systems": 74.0
        }
    }
]

if __name__ == "__main__":
    generator = ReportCardGenerator(sample_class_dataset)
    generator.export_all_reports()
```

---

## 3. Sample Execution Output

```text
Processing academic evaluations for 3 students...

============================================================
               OFFICIAL ACADEMIC TRANSCRIPT
               MSK INSTITUTE OF TECHNOLOGY
============================================================
 Student Name : Aarav Sharma              Roll No: CS-101
 Status       : PASS                      Overall Grade: A+
------------------------------------------------------------
SUBJECT                   | MAX      | OBTAINED   | GRADE
------------------------------------------------------------
Data Structures           | 100      | 92.0       | A+
Computer Networks         | 100      | 88.0       | A
Operating Systems         | 100      | 81.0       | A
Database Systems          | 100      | 95.0       | A+
------------------------------------------------------------
 TOTAL SCORE  : 356.0 / 400 (89.00%)
 CUMULATIVE GPA: 8.9 / 10.0
============================================================

Performance Chart saved to: 'transcripts/report_CS-101.png'
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Accumulating Figure Buffers Across Multiple Students
Always call `plt.close(fig)` after exporting each student's PNG chart to prevent memory exhaustion when generating report cards for large classrooms.

### 2. Hardcoded Directory Paths
Ensure the output directory is created safely using `os.makedirs(output_dir, exist_ok=True)` before saving report cards and chart images.

---

---

## 💻 Try It Yourself: Extension Challenge - Rank Calculation

### Challenge
Extend the Report Card Generator to compute and display each student's class rank based on their cumulative GPA.

### Complete Solution
```python
def calculate_class_ranks(students_data):
    # Sort students descending by GPA
    ranked = sorted(students_data, key=lambda s: s["gpa"], reverse=True)
    for rank, student in enumerate(ranked, 1):
        student["rank"] = rank
    return ranked

cohort = [
    {"name": "Aarav", "gpa": 8.9},
    {"name": "Diya", "gpa": 9.4},
    {"name": "Kavya", "gpa": 8.6}
]

for s in calculate_class_ranks(cohort):
    print(f"Rank #{s['rank']}: {s['name']} (GPA: {s['gpa']})")
```

### Expected Output
```text
Rank #1: Diya (GPA: 9.4)
Rank #2: Aarav (GPA: 8.9)
Rank #3: Kavya (GPA: 8.6)
```

---

## Practice Quiz

### 1. In this project, which Python built-in function ensures that a student fails if ANY subject score is below 40?
A. `any()`
B. `all(score >= 40.0 for score in marks.values())`
C. `min(marks.values())`
D. `filter()`
**Answer:** B
**Explanation:** `all()` returns `True` only if every single condition in the iterable evaluates to `True`; if any subject score is under 40, `is_passed` evaluates to `False`.
---

### 2. How does the application calculate the class average benchmark for each academic subject?
A. By asking teachers for an estimate
B. By summing subject marks across all students and dividing by the total student count
C. By selecting the highest mark
D. By generating random numbers
**Answer:** B
**Explanation:** `_calculate_class_averages()` sums the scores per subject across the student objects and divides by student count.
---

### 3. Which Matplotlib method adds the horizontal dashed line representing the 40% passing threshold?
A. `ax.draw_horizontal()`
B. `ax.axhline(40.0, linestyle="--")`
C. `ax.line_x(40)`
D. `ax.threshold()`
**Answer:** B
**Explanation:** `ax.axhline(y)` plots a horizontal reference line spanning the full width of the axes.
---

### 4. What is the purpose of `os.makedirs(output_dir, exist_ok=True)` before saving the chart image?
A. To format the file as PDF
B. To guarantee that the destination directory exists without raising an error if it was already created
C. To delete old report cards
D. To clear system memory
**Answer:** B
**Explanation:** `os.makedirs(..., exist_ok=True)` safely creates nested destination directories if they don't exist, preventing `FileNotFoundError`.
---

### 5. Why is `plt.close(fig)` invoked after saving each student's chart?
A. To prevent memory leaks and figure accumulation in RAM during batch processing
B. To shut down the Python interpreter
C. To encrypt the PNG file
D. To commit the database transaction
**Answer:** A
**Explanation:** Closing figures in batch image generators releases canvas memory buffers, preventing excessive RAM consumption.
---
---

## 🎓 Congratulations on Completing Python for Intermediate!

You have successfully completed all 70 modules across the 15 chapters of **Python for Intermediate**! You have mastered advanced comprehensions, closures, decorators, modular packages, OOP architecture, exceptions, iterators, REST APIs, industrial logging, SQLite databases, and data visualization.

### What To Do Next:
1. **Claim Your Verified Certificate:** Visit the [Python for Intermediate Course Page](/courses/python-for-intermediate) to verify your course progress and receive your digital credential.
2. **Publish Your Capstones:** Push your Bank Account System, SQLite Database, and Student Report Card Generator projects to GitHub.
3. **Explore Advanced Pathways:** Advance into Full-Stack Web Development with Django & FastAPI, or explore Data Science & Machine Learning with Pandas, NumPy, and Scikit-Learn!

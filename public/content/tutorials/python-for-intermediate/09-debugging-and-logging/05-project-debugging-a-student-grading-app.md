---
id: python-intermediate-project-debugging-a-student-grading-app
slug: project-debugging-a-student-grading-app
course: python-for-intermediate
chapter: "9: Debugging and Logging"
topic: "9.5 Project: Debugging a Student Grading App"
title: "Project: Debugging a Student Grading App in Python"
description: "Master project: debugging a student grading app in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 9
order: 45
keywords:
  - python project debugging a student grading app
  - python intermediate
  - python project: debugging a student grading app
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Debugging a Student Grading App

In this capstone project, we will apply the debugging and diagnostic techniques mastered throughout this chapter—**Structured Logging, Logging Levels, Exception Traceback Capture, and Invariant Assertions**—to diagnose and resolve logical and runtime bugs in an enterprise **Student Grading & Analytics Application**.

---

## 1. The Scenario & Buggy Application

Imagine inheriting a legacy grading script that crashes unexpectedly on certain student batches and produces incorrect honors classifications.

### The Buggy Code (Before Debugging):

```python
# buggy_grader.py (Contains subtle bugs)
students = [
    {"name": "Aarav", "scores": [85, 92, 78]},
    {"name": "Diya", "scores": ["95", 88, 91]},       # Bug A: Score is a string!
    {"name": "Kavya", "scores": []},                   # Bug B: Empty list causes ZeroDivision!
    {"name": "Rohan", "scores": [105, 80, 75]},        # Bug C: Score > 100 violates invariant!
]

def calculate_grade(avg):
    if avg >= 90:
        return "A"
    elif avg >= 80:
        return "B"
    elif avg >= 70:
        return "C"
    else:
        return "F"

def grade_all(batch):
    for s in batch:
        total = sum(s["scores"])  # Crashes on Diya (TypeError: unsupported operand)
        avg = total / len(s["scores"])  # Crashes on Kavya (ZeroDivisionError)
        print(f"{s['name']}: Avg={avg}, Grade={calculate_grade(avg)}")
```

---

## 2. Implementing Diagnostic Logging Architecture

Instead of blindly adding `print()` statements, we establish a robust dual-channel logging architecture:
1. **Console Handler**: Emits `INFO` and higher messages for general application feedback.
2. **File Handler (`grading_audit.log`)**: Emits fine-grained `DEBUG` logs containing exact numerical calculations, variable types, and captured tracebacks.

```python
import logging
import sys

# Configure root logger
logger = logging.getLogger("GradingEngine")
logger.setLevel(logging.DEBUG)

# 1. Console Handler (INFO level)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter("%(levelname)-8s | %(message)s")
console_handler.setFormatter(console_formatter)

# 2. File Handler (DEBUG level for full audit history)
file_handler = logging.FileHandler("grading_audit.log", mode="w", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
file_formatter = logging.Formatter("%(asctime)s [%(levelname)s] (%(funcName)s) - %(message)s")
file_handler.setFormatter(file_formatter)

# Attach handlers
if not logger.handlers:
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
```

---

## 3. The Refactored, Bug-Free Grading Engine

Here is the fully instrumented, defensively programmed grading engine incorporating validations and assertions:

```python
from typing import List, Dict, Any, Optional, Tuple


def sanitize_scores(raw_scores: List[Any], student_name: str) -> List[float]:
    """Validates, casts to float, and checks domain invariants (0 <= score <= 100)."""
    cleaned = []
    for idx, item in enumerate(raw_scores):
        try:
            score = float(item)
        except (ValueError, TypeError):
            logger.error(f"Student '{student_name}': Invalid non-numeric score '{item}' at index {idx}.")
            continue

        # Invariant check: Scores must be in [0, 100]
        if score < 0 or score > 100:
            logger.warning(f"Student '{student_name}': Score {score} out of bounds (0-100). Clamping to range.")
            score = max(0.0, min(100.0, score))

        cleaned.append(score)

    logger.debug(f"Student '{student_name}': Raw count={len(raw_scores)}, Cleaned count={len(cleaned)}")
    return cleaned


def compute_student_performance(student: Dict[str, Any]) -> Optional[Tuple[float, str]]:
    """Calculates sanitized average and letter grade for a single student."""
    name = student.get("name", "Unknown")
    raw_scores = student.get("scores", [])

    logger.debug(f"Processing evaluation for student: {name}")

    sanitized = sanitize_scores(raw_scores, name)

    # Prevent ZeroDivisionError for students with no valid scores
    if not sanitized:
        logger.warning(f"Student '{name}' has no valid submitted scores. Marked as INCOMPLETE.")
        return None

    total = sum(sanitized)
    avg = total / len(sanitized)
    
    # Internal developer assertion: Average must be within theoretical bounds
    assert 0.0 <= avg <= 100.0, f"Average {avg} violated mathematical bounds!"

    if avg >= 90.0:
        grade = "A"
    elif avg >= 80.0:
        grade = "B"
    elif avg >= 70.0:
        grade = "C"
    elif avg >= 60.0:
        grade = "D"
    else:
        grade = "F"

    logger.debug(f"Student '{name}': Total={total:.1f}, Avg={avg:.2f}, Grade={grade}")
    return avg, grade


def process_grading_pipeline(students_data: List[Dict[str, Any]]):
    """Processes batch grading and prints summary dashboard."""
    logger.info(f"Starting grading batch for {len(students_data)} records...")
    
    successful_evaluations = 0
    
    print("\n" + "=" * 55)
    print(f"{'STUDENT':<15} | {'AVERAGE':<10} | {'GRADE':<8} | {'STATUS'}")
    print("-" * 55)

    for student in students_data:
        name = student.get("name", "Unknown")
        try:
            result = compute_student_performance(student)
            if result:
                avg, grade = result
                print(f"{name:<15} | {avg:<10.2f} | {grade:<8} | PASS")
                successful_evaluations += 1
            else:
                print(f"{name:<15} | {'N/A':<10} | {'N/A':<8} | INCOMPLETE")
        except Exception as err:
            logger.exception(f"Unexpected fatal error evaluating student '{name}': {err}")

    print("=" * 55)
    logger.info(f"Grading run completed: {successful_evaluations}/{len(students_data)} students graded successfully.")


# Test Dataset with All Edge Cases
student_batch = [
    {"name": "Aarav Sharma", "scores": [85, 92, 78]},
    {"name": "Diya Patel", "scores": ["95", 88, 91]},       # Strings handled safely
    {"name": "Kavya Nair", "scores": []},                   # Zero scores handled gracefully
    {"name": "Rohan Verma", "scores": [105, 80, 75]},       # Out of bounds score clamped to 100
    {"name": "Meera Sen", "scores": [70, "invalid", 80]},   # Corrupt score discarded with error log
]

if __name__ == "__main__":
    process_grading_pipeline(student_batch)
```

---

## 4. Execution Output & Audit Verification

### Console Output:
```text
INFO     | Starting grading batch for 5 records...
WARNING  | Student 'Kavya Nair' has no valid submitted scores. Marked as INCOMPLETE.
WARNING  | Student 'Rohan Verma': Score 105.0 out of bounds (0-100). Clamping to range.
ERROR    | Student 'Meera Sen': Invalid non-numeric score 'invalid' at index 1.

=======================================================
STUDENT         | AVERAGE    | GRADE    | STATUS
-------------------------------------------------------
Aarav Sharma    | 85.00      | B        | PASS
Diya Patel      | 91.33      | A        | PASS
Kavya Nair      | N/A        | N/A      | INCOMPLETE
Rohan Verma     | 85.00      | B        | PASS
Meera Sen       | 75.00      | C        | PASS
=======================================================
INFO     | Grading run completed: 4/5 students graded successfully.
```

### Log File Output (`grading_audit.log`):
```text
2026-09-12 15:55:00 [DEBUG] (compute_student_performance) - Processing evaluation for student: Aarav Sharma
2026-09-12 15:55:00 [DEBUG] (sanitize_scores) - Student 'Aarav Sharma': Raw count=3, Cleaned count=3
2026-09-12 15:55:00 [DEBUG] (compute_student_performance) - Student 'Aarav Sharma': Total=255.0, Avg=85.00, Grade=B
2026-09-12 15:55:00 [DEBUG] (compute_student_performance) - Processing evaluation for student: Diya Patel
2026-09-12 15:55:00 [DEBUG] (sanitize_scores) - Student 'Diya Patel': Raw count=3, Cleaned count=3
2026-09-12 15:55:00 [DEBUG] (compute_student_performance) - Student 'Diya Patel': Total=274.0, Avg=91.33, Grade=A
...
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Off-by-One Loop Indices
Iterating with `range(len(items) - 1)` skips the final element. Use idiomatic `for item in items:` or `range(len(items))`.

### 2. Integer Division Discarding Decimals
In algorithms calculating averages or percentages, ensure values are cast or divided with `/` (float division) rather than `//` (floor division).

---

---

## 💻 Try It Yourself: Extension Challenge - Zero Marks Handling

### Challenge
Enhance the Student Grading App to catch students who were absent (marked as `None` or negative) and distinguish them from students who genuinely scored zero.

### Complete Solution
```python
def sanitize_marks(marks_list):
    valid_scores = []
    for m in marks_list:
        if m is None or m < 0:
            print(f"Warning: Discarding invalid score: {m}")
            continue
        valid_scores.append(m)
    return valid_scores

scores = [85, None, 92, -5, 0, 78]
cleaned = sanitize_marks(scores)
print(f"Cleaned Scores: {cleaned} -> Average: {sum(cleaned)/len(cleaned):.2f}")
```

### Expected Output
```text
Warning: Discarding invalid score: None
Warning: Discarding invalid score: -5
Cleaned Scores: [85, 92, 0, 78] -> Average: 63.75
```

---

## Practice Quiz

### 1. In our refactored grading application, why do we configure two separate handlers (console and file)?
A. Because Python requires at least two handlers to run
B. To allow high-level summaries on the console (`INFO`) while storing detailed diagnostic traces (`DEBUG`) in a file
C. To prevent threads from colliding
D. To encrypt the student records
**Answer:** B
**Explanation:** Multi-handler logging enables separation of concerns: users see clean high-level output on stdout, while complete granular diagnostics are saved to log files for debugging.
---

### 2. How did the refactored code handle string scores like `"95"` without crashing?
A. By deleting the student from the dictionary
B. By attempting to cast each item to float inside a `try/except (ValueError, TypeError)` block
C. By using `eval()`
D. Strings cannot be converted to floats in Python
**Answer:** B
**Explanation:** Wrapping the `float(item)` conversion in a `try-except` block safely converts numeric strings while catching non-numeric values like `"invalid"`.
---

### 3. What prevents the `ZeroDivisionError` when a student has submitted zero scores?
A. Python automatically sets `0 / 0 = 0`
B. Checking `if not sanitized:` before performing the division and logging a warning
C. Adding 1 to the denominator
D. The `assert` statement
**Answer:** B
**Explanation:** Checking if the list is empty before dividing prevents `ZeroDivisionError` and allows handling incomplete records gracefully.
---

### 4. What is the role of `assert 0.0 <= avg <= 100.0` in `compute_student_performance()`?
A. To parse student names
B. To serve as an internal sanity invariant ensuring calculation logic never produces an impossible average
C. To validate command line arguments
D. To terminate the database connection
**Answer:** B
**Explanation:** Assertions verify internal algorithm correctness; an average outside 0-100 would indicate an internal mathematical defect.
---

### 5. Why is `logger.exception()` preferred over `logger.error()` inside the pipeline's top-level catch-all block?
A. It runs faster
B. It automatically records the complete stack traceback to the log file along with the error message
C. It deletes previous log files
D. It sends an email alert automatically
**Answer:** B
**Explanation:** `logger.exception()` automatically captures and appends the active traceback, preserving essential debugging context.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Math and Random Module** (10: Python Standard Libraries).

👉 **[Continue to Next Lesson: Math and Random Module →](/tutorials/python-for-intermediate/math-and-random-module)**

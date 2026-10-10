---
id: python-intermediate-project-error-handled-calculator
slug: project-error-handled-calculator
course: python-for-intermediate
chapter: "6: Exception Handling"
topic: "6.5 Project: Error-Handled Calculator"
title: "Project: Error-Handled Calculator in Python"
description: "Master project: error-handled calculator in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 9
order: 30
keywords:
  - python project error handled calculator
  - python intermediate
  - python project: error-handled calculator
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Error-Handled Calculator

In this comprehensive chapter project, we will apply every concept covered across our exception handling module—**Built-in Exceptions, `try-except-else-finally`, Explicit `raise`, and Custom Exception Hierarchies**—to build a production-grade, crash-resilient **Command-Line Scientific Calculator**.

---

## 1. Project Specifications & Requirements

A naive calculator quickly crashes when a user supplies zero as a denominator, attempts to calculate the square root of a negative number, or enters non-numeric input. Our professional calculator meets the following engineering specifications:

1. **Custom Exception Hierarchy**: Categorizes calculator errors (`InvalidOperatorError`, `MathDomainError`, `DivisionByZeroCalcError`).
2. **Safe Expression Tokenization**: Safely parses user strings into operands and operators without using hazardous `eval()`.
3. **Advanced Operations**: Supports basic arithmetic (`+`, `-`, `*`, `/`, `%`), exponentiation (`^`), square roots (`sqrt`), and natural logarithms (`log`).
4. **Resilient User Experience**: Never crashes on invalid inputs or system interrupts like `KeyboardInterrupt` (Ctrl+C).
5. **Session Audit History**: Stores previous calculations in memory for audit reporting.

---

## 2. Complete Calculator Code

```python
import math
import sys


# -------------------------------------------------------------
# 1. Custom Exception Hierarchy
# -------------------------------------------------------------
class CalculatorError(Exception):
    """Base exception for all calculator-related runtime failures."""
    pass


class InvalidOperatorError(CalculatorError):
    """Raised when an unrecognized arithmetic operator is supplied."""
    def __init__(self, operator):
        super().__init__(f"Operator '{operator}' is not supported. Use (+, -, *, /, %, ^, sqrt, log).")
        self.operator = operator


class DivisionByZeroCalcError(CalculatorError):
    """Raised when a calculation attempts division or modulo by zero."""
    def __init__(self):
        super().__init__("Mathematical error: Division or modulo by zero is undefined.")


class MathDomainError(CalculatorError):
    """Raised when operands violate mathematical domain constraints (e.g. sqrt(-1))."""
    pass


class OperandCountError(CalculatorError):
    """Raised when expression tokens do not match expected operand counts."""
    pass


# -------------------------------------------------------------
# 2. Calculator Engine
# -------------------------------------------------------------
class CalculatorEngine:
    """Core mathematical execution engine with defensive exception handling."""

    def __init__(self):
        self.history = []

    def execute_operation(self, operator: str, *operands: float) -> float:
        """Executes the calculation and returns the float result."""
        operator = operator.lower()

        # Unary operations (1 operand)
        if operator in ("sqrt", "log"):
            if len(operands) != 1:
                raise OperandCountError(f"Operation '{operator}' expects exactly 1 operand, received {len(operands)}.")
            val = operands[0]

            if operator == "sqrt":
                if val < 0:
                    raise MathDomainError("Cannot compute square root of a negative number in real domain.")
                return math.sqrt(val)

            if operator == "log":
                if val <= 0:
                    raise MathDomainError("Logarithm domain error: Input must be strictly greater than zero.")
                return math.log(val)

        # Binary operations (2 operands)
        elif operator in ("+", "-", "*", "/", "%", "^", "**"):
            if len(operands) != 2:
                raise OperandCountError(f"Operation '{operator}' expects exactly 2 operands, received {len(operands)}.")
            a, b = operands

            if operator == "+":
                return a + b
            elif operator == "-":
                return a - b
            elif operator == "*":
                return a * b
            elif operator == "/":
                if b == 0:
                    raise DivisionByZeroCalcError()
                return a / b
            elif operator == "%":
                if b == 0:
                    raise DivisionByZeroCalcError()
                return a % b
            elif operator in ("^", "**"):
                try:
                    return math.pow(a, b)
                except OverflowError:
                    raise MathDomainError("Result exceeds maximum floating-point representation (Overflow).")
        else:
            raise InvalidOperatorError(operator)

    def parse_and_calculate(self, raw_expression: str) -> float:
        """Parses a user string, validates tokens, and dispatches calculation."""
        tokens = raw_expression.strip().split()
        if not tokens:
            raise CalculatorError("Expression cannot be empty.")

        # Scenario A: Unary functions like "sqrt 16" or "log 100"
        if tokens[0].lower() in ("sqrt", "log"):
            op = tokens[0].lower()
            if len(tokens) != 2:
                raise OperandCountError(f"Format for '{op}' must be: {op} <number>")
            try:
                val = float(tokens[1])
            except ValueError:
                raise ValueError(f"Operand '{tokens[1]}' is not a valid numeric value.")
            
            result = self.execute_operation(op, val)
            self._log_history(f"{op} {val}", result)
            return result

        # Scenario B: Infix binary operations like "15 / 3" or "2 ^ 8"
        if len(tokens) == 3:
            raw_a, op, raw_b = tokens
            try:
                a = float(raw_a)
            except ValueError:
                raise ValueError(f"Left operand '{raw_a}' is not a valid number.")

            try:
                b = float(raw_b)
            except ValueError:
                raise ValueError(f"Right operand '{raw_b}' is not a valid number.")

            result = self.execute_operation(op, a, b)
            self._log_history(f"{a} {op} {b}", result)
            return result

        raise OperandCountError("Invalid format. Use 'operand operator operand' (e.g. 5 * 10) or 'op val' (e.g. sqrt 25).")

    def _log_history(self, expr: str, res: float):
        self.history.append((expr, res))

    def print_history(self):
        if not self.history:
            print("\nNo calculations recorded in this session.")
            return
        print("\n--- Session Calculation History ---")
        for idx, (expr, res) in enumerate(self.history, start=1):
            print(f"{idx}. {expr} = {res}")
        print("-----------------------------------")


# -------------------------------------------------------------
# 3. Interactive CLI Interface
# -------------------------------------------------------------
def run_calculator():
    calc = CalculatorEngine()
    print("=" * 60)
    print("       WELCOME TO THE ERROR-HANDLED CALCULATOR")
    print(" Supported: +, -, *, /, %, ^, sqrt, log | 'history' | 'exit'")
    print(" Example queries: '15 / 4', '2 ^ 10', 'sqrt 49', 'log 2.718'")
    print("=" * 60)

    while True:
        try:
            user_input = input("\ncalc > ").strip()
            
            if not user_input:
                continue

            if user_input.lower() in ("exit", "quit", "q"):
                print("Thank you for using the Calculator. Goodbye!")
                break

            if user_input.lower() == "history":
                calc.print_history()
                continue

            # Execute calculation with defensive multi-layer error handling
            result = calc.parse_and_calculate(user_input)

        except KeyboardInterrupt:
            # Intercept Ctrl+C gracefully without crash dump
            print("\n[Notice] Operation interrupted by user (Ctrl+C). Type 'exit' to quit.")
        except EOFError:
            print("\nExiting calculator session.")
            break
        except CalculatorError as calc_err:
            # Catches all domain-specific errors (InvalidOperator, DivisionByZero, etc.)
            print(f"[Calculator Error] {calc_err}")
        except ValueError as val_err:
            # Catches invalid floating point conversions
            print(f"[Input Format Error] {val_err}")
        except Exception as unexpected:
            # Fallback for unforeseen exceptions
            print(f"[Unexpected Failure] {type(unexpected).__name__}: {unexpected}")
        else:
            # Runs only when calculation completes successfully
            print(f"=> Result: {result:,.4f}")
        finally:
            # Housekeeping that executes every single cycle
            pass


if __name__ == "__main__":
    run_calculator()
```

---

## 3. Sample Execution Simulation

```text
============================================================
       WELCOME TO THE ERROR-HANDLED CALCULATOR
 Supported: +, -, *, /, %, ^, sqrt, log | 'history' | 'exit'
 Example queries: '15 / 4', '2 ^ 10', 'sqrt 49', 'log 2.718'
============================================================

calc > 10 / 0
[Calculator Error] Mathematical error: Division or modulo by zero is undefined.

calc > sqrt -25
[Calculator Error] Cannot compute square root of a negative number in real domain.

calc > twenty * 5
[Input Format Error] Left operand 'twenty' is not a valid number.

calc > 2 ^ 10
=> Result: 1,024.0000

calc > sqrt 144
=> Result: 12.0000

calc > history

--- Session Calculation History ---
1. 2.0 ^ 10.0 = 1024.0
2. sqrt 144.0 = 12.0
-----------------------------------

calc > exit
Thank you for using the Calculator. Goodbye!
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Using `eval()` for Calculation
Never use Python's built-in `eval()` to parse user formulas, as it allows arbitrary remote code execution (e.g. `__import__('os').system('rm -rf /')`). Always use a custom parser or AST validator.

### 2. Infinite Retry Loops Without Escape
When prompting the user on invalid input, always provide a clean exit keyword (e.g. `'q'` or `'exit'`) so the user is never trapped in an infinite retry loop.

---

---

## 💻 Try It Yourself: Extension Challenge - Memory Storage

### Challenge
Add memory recall functionality (`M+` to store, `MR` to recall, `MC` to clear) to the calculator system with appropriate error handling when reading from empty memory.

### Complete Solution
```python
class CalculatorMemory:
    def __init__(self):
        self._memory = None

    def store(self, value: float):
        self._memory = float(value)
        print(f"Memory stored: {self._memory}")

    def recall(self) -> float:
        if self._memory is None:
            raise LookupError("Memory is empty! Store a value first.")
        return self._memory

    def clear(self):
        self._memory = None
        print("Memory cleared.")

mem = CalculatorMemory()
mem.store(42.5)
print("Recalled:", mem.recall())
mem.clear()
try:
    mem.recall()
except LookupError as e:
    print(f"Caught: {e}")
```

### Expected Output
```text
Memory stored: 42.5
Recalled: 42.5
Memory cleared.
Caught: Memory is empty! Store a value first.
```

---

## Practice Quiz

### 1. In this project, why does the calculator avoid using Python's built-in `eval()` function?
A. `eval()` cannot perform floating point division
B. `eval()` introduces serious arbitrary code execution security risks and uncontrolled exceptions
C. `eval()` is removed in Python 3
D. `eval()` cannot parse spaces
**Answer:** B
**Explanation:** `eval()` executes arbitrary code supplied by the user, creating security vulnerabilities and making error handling unpredictable. Parsing tokens explicitly is much safer.
---

### 2. How does the CLI loop handle `KeyboardInterrupt` when a user presses Ctrl+C?
A. The script terminates with an unhandled traceback
B. It intercepts `KeyboardInterrupt` and displays a polite message without terminating the application
C. It resets the computer's terminal emulator
D. It saves the session to disk and restarts the operating system
**Answer:** B
**Explanation:** By wrapping the input cycle in a `try` block that catches `KeyboardInterrupt`, the program handles user interrupts cleanly without crashing.
---

### 3. What exception is raised if the user inputs `sqrt -9`?
A. `ZeroDivisionError`
B. `MathDomainError`
C. `IndexError`
D. `SyntaxError`
**Answer:** B
**Explanation:** Square roots of negative numbers are undefined in the real number system, triggering our custom `MathDomainError`.
---

### 4. Why is `except CalculatorError` able to catch both `InvalidOperatorError` and `DivisionByZeroCalcError`?
A. Because they are imported from `math`
B. Because both classes inherit from `CalculatorError`
C. Because Python checks variable names phonetically
D. Because the `else` block converts them
**Answer:** B
**Explanation:** In Python's object-oriented exception model, catching a base class catches all instances of subclasses derived from it.
---

### 5. In which block is `print(f"=> Result: {result:,.4f}")` placed so that it never executes if an error occurred?
A. `except`
B. `finally`
C. `else`
D. `catch`
**Answer:** C
**Explanation:** The `else` block executes only if the preceding `try` block completes successfully without raising any exceptions.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Understanding Iterators** (7: Iterators and Generators).

👉 **[Continue to Next Lesson: Understanding Iterators →](/tutorials/python-for-intermediate/understanding-iterators)**

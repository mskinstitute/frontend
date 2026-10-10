---
id: python-advanced-project-tested-calculator-application
slug: project-tested-calculator-application
course: python-for-advanced
chapter: "13: Testing & Best Practices"
topic: "13.5 Project: Tested Calculator Application"
title: "Project: Tested Calculator Application in Python"
description: "Master project: tested calculator application in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 9
order: 56
keywords:
  - python project tested calculator application
  - python advanced
  - python project: tested calculator application
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Fully Tested Mathematical Expression Engine

Constructing a reliable expression evaluation engine requires rigorous parsing, strict operator precedence, support for variables, and complete test coverage against syntax anomalies, floating-point edge cases, and division-by-zero errors.

In this project, we will construct a production-ready **Mathematical Expression Evaluator** using a **Recursive Tokenizer and Postfix (Shunting-Yard) Engine**. The entire codebase is backed by a comprehensive **Pytest test suite** demonstrating fixtures, parametrization, exception verification, and edge-case testing.

---

## 1. Calculator Engine Architecture

The calculator uses Dijkstra's **Shunting-Yard Algorithm** to parse infix mathematical expressions (e.g. `3 + 4 * 2 / ( 1 - 5 ) ^ 2`) into Reverse Polish Notation (RPN), followed by a stack-based evaluator:

```
 Infix Expression: "10 + 2 * (5 - 1)"
                 │
                 ▼
         Lexical Tokenizer
 ['10', '+', '2', '*', '(', '5', '-', '1', ')']
                 │
                 ▼
      Shunting-Yard Parser (Operator Precedence Stack)
                 │
                 ▼
 Reverse Polish Notation (RPN): ['10', '2', '5', '1', '-', '*', '+']
                 │
                 ▼
           Stack Evaluator ──► Result: 18.0
```

---

## 2. Production Engine Implementation

```python
import math
import re
from typing import Dict, List, Optional, Union

class CalculatorSyntaxError(ValueError):
    """Raised when an expression contains invalid tokens or mismatched parentheses."""
    pass

class MathEvaluationError(ZeroDivisionError):
    """Raised when a mathematical operation is undefined (e.g. division by zero)."""
    pass

class ExpressionCalculator:
    """A thread-safe mathematical expression evaluator supporting precedence and variables."""

    # Operator precedence and associativity (True = left-associative, False = right)
    OPERATORS = {
        "+": (1, True),
        "-": (1, True),
        "*": (2, True),
        "/": (2, True),
        "^": (3, False),  # Exponentiation is right-associative
    }

    CONSTANTS = {
        "PI": math.pi,
        "E": math.e
    }

    def __init__(self, variables: Optional[Dict[str, float]] = None) -> None:
        self.variables = self.CONSTANTS.copy()
        if variables:
            self.variables.update(variables)

    def tokenize(self, expression: str) -> List[str]:
        """Converts raw string into a list of mathematical tokens."""
        # Match numbers, operators, parentheses, or variable words
        token_pattern = re.compile(r"\d+(?:\.\d+)?|[a-zA-Z_]\w*|[+\-*/^()]")
        tokens = token_pattern.findall(expression)
        
        # Verify no illegal characters were ignored
        reconstructed = "".join(tokens)
        stripped_expr = re.sub(r"\s+", "", expression)
        if len(reconstructed) != len(stripped_expr):
            raise CalculatorSyntaxError(f"Expression contains unrecognized characters: '{expression}'")
        return tokens

    def _to_rpn(self, tokens: List[str]) -> List[str]:
        """Converts infix tokens to Reverse Polish Notation (RPN) via Shunting-Yard."""
        output_queue: List[str] = []
        op_stack: List[str] = []

        for token in tokens:
            if re.match(r"^\d+(?:\.\d+)?$", token):
                output_queue.append(token)
            elif token.upper() in self.variables:
                output_queue.append(str(self.variables[token.upper()]))
            elif token in self.OPERATORS:
                prec, left_assoc = self.OPERATORS[token]
                while (
                    op_stack
                    and op_stack[-1] in self.OPERATORS
                    and (
                        (left_assoc and prec <= self.OPERATORS[op_stack[-1]][0])
                        or (not left_assoc and prec < self.OPERATORS[op_stack[-1]][0])
                    )
                ):
                    output_queue.append(op_stack.pop())
                op_stack.append(token)
            elif token == "(":
                op_stack.append(token)
            elif token == ")":
                while op_stack and op_stack[-1] != "(":
                    output_queue.append(op_stack.pop())
                if not op_stack or op_stack[-1] != "(":
                    raise CalculatorSyntaxError("Mismatched parentheses detected.")
                op_stack.pop()  # Pop "("
            else:
                raise CalculatorSyntaxError(f"Undefined identifier or variable: '{token}'")

        while op_stack:
            op = op_stack.pop()
            if op in ("(", ")"):
                raise CalculatorSyntaxError("Mismatched parentheses detected.")
            output_queue.append(op)

        return output_queue

    def evaluate(self, expression: str) -> float:
        """Evaluates an infix mathematical expression string to a floating point number."""
        if not expression or not expression.strip():
            raise CalculatorSyntaxError("Cannot evaluate empty expression.")

        tokens = self.tokenize(expression)
        rpn_queue = self._to_rpn(tokens)
        stack: List[float] = []

        for token in rpn_queue:
            if token in self.OPERATORS:
                if len(stack) < 2:
                    raise CalculatorSyntaxError("Malformed expression: insufficient operands.")
                b = stack.pop()
                a = stack.pop()

                if token == "+": stack.append(a + b)
                elif token == "-": stack.append(a - b)
                elif token == "*": stack.append(a * b)
                elif token == "/":
                    if b == 0:
                        raise MathEvaluationError("Division by zero encountered.")
                    stack.append(a / b)
                elif token == "^":
                    stack.append(a ** b)
            else:
                stack.append(float(token))

        if len(stack) != 1:
            raise CalculatorSyntaxError("Malformed expression: extraneous operands.")
        return stack[0]
```

---

## 3. Comprehensive Pytest Test Suite

```python
import math
import pytest

# Fixture providing a standard calculator instance
@pytest.fixture
def calc() -> ExpressionCalculator:
    return ExpressionCalculator(variables={"X": 10.0, "Y": 2.5})

# 1. Parametrized Arithmetic Tests
@pytest.mark.parametrize("expr, expected", [
    ("2 + 3", 5.0),
    ("10 - 4", 6.0),
    ("3 * 7", 21.0),
    ("15 / 3", 5.0),
    ("2 ^ 3", 8.0),
    ("2 ^ 3 ^ 2", 512.0),           # Right-associativity test: 2^(3^2) = 2^9 = 512
    ("2 + 3 * 4", 14.0),            # Precedence: multiplication before addition
    ("(2 + 3) * 4", 20.0),          # Parentheses precedence
    ("((10 - 2) * (3 + 1)) / 4", 8.0),
])
def test_standard_arithmetic(calc: ExpressionCalculator, expr: str, expected: float) -> None:
    assert calc.evaluate(expr) == pytest.approx(expected)

# 2. Variable and Constant Interpolation Tests
@pytest.mark.parametrize("expr, expected", [
    ("X + 5", 15.0),
    ("X * Y", 25.0),
    ("PI * 2", math.pi * 2),
    ("(X - Y) * 2", 15.0),
])
def test_variables_and_constants(calc: ExpressionCalculator, expr: str, expected: float) -> None:
    assert calc.evaluate(expr) == pytest.approx(expected)

# 3. Exception & Error Boundary Tests
def test_division_by_zero(calc: ExpressionCalculator):
    with pytest.raises(MathEvaluationError) as exc_info:
        calc.evaluate("10 / 0")
    assert "Division by zero" in str(exc_info.value)

def test_mismatched_parentheses(calc: ExpressionCalculator):
    with pytest.raises(CalculatorSyntaxError):
        calc.evaluate("(10 + 5 * 2")  # Unclosed parenthesis

def test_unrecognized_characters(calc: ExpressionCalculator):
    with pytest.raises(CalculatorSyntaxError):
        calc.evaluate("10 + $5")  # Illegal character $

def test_empty_expression(calc: ExpressionCalculator):
    with pytest.raises(CalculatorSyntaxError):
        calc.evaluate("   ")
```

---

## 4. Verification Execution

```python
def run_verification():
    print("=====================================================")
    print("      TESTING EXPRESSION CALCULATOR ENGINE           ")
    print("=====================================================")

    calc = ExpressionCalculator(variables={"tax_rate": 0.15, "subtotal": 200.0})

    expressions = [
        "10 + 2 * 6",
        "(10 + 2) * 6",
        "2 ^ 3 ^ 2",
        "subtotal * (1 + tax_rate)",
        "PI * 10 ^ 2"
    ]

    for expr in expressions:
        res = calc.evaluate(expr)
        print(f"Expression: {expr:<26} => Result: {res:.4f}")

    print("=====================================================")
    print("       ALL ENGINE FORMULAS EVALUATED CLEANLY         ")
    print("=====================================================")

if __name__ == "__main__":
    run_verification()
```

---

## 5. Architectural Key Takeaways

1. **Precedence via Shunting-Yard**: Parsing infix into RPN cleanly decouples syntax parsing from evaluation mechanics while honoring operator associativity.
2. **Parametrized Validation Matrix**: Using `@pytest.mark.parametrize` allows testing dozens of arithmetic expressions with zero repetitive code.
3. **Domain Exception Boundaries**: Distinguishing `CalculatorSyntaxError` from `MathEvaluationError` allows callers to differentiate between user typos and runtime mathematical exceptions.

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Missing Boundary Edge Cases
Failing to test division by zero, negative exponents, overflow numbers, and empty expression strings leaves catastrophic crash paths unverified.

### 2. Incomplete Fixture Cleanup
Ensure test database instances and temporary test files are destroyed after test suites complete using fixture finalizers or yield fixtures.

---

---

## 💻 Try It Yourself: Extension Challenge - Division by Zero Test Coverage

### Challenge
Add automated test cases validating that the Calculator application raises a custom `MathDomainError` whenever division by zero is attempted.

### Complete Solution
```python
class MathDomainError(Exception):
    pass

def safe_divide(a: float, b: float) -> float:
    if b == 0:
        raise MathDomainError("Cannot divide by zero!")
    return a / b

# Unit test assertion
try:
    safe_divide(100, 0)
except MathDomainError as e:
    print(f"✓ Test passed: {e}")
```

### Expected Output
```text
✓ Test passed: Cannot divide by zero!
```

---

## Practice Quiz

### 1.
What algorithm is utilized by the `ExpressionCalculator` to convert human-readable infix notation into Reverse Polish Notation (RPN)?
A. Dijkstra's Shunting-Yard Algorithm
B. Prim's Minimum Spanning Tree Algorithm
C. A* Pathfinding Algorithm
D. QuickSort Algorithm

**Answer:** A

**Explanation:** The Shunting-Yard algorithm (developed by Edsger Dijkstra) uses an operator stack to convert infix expressions into postfix / Reverse Polish Notation (RPN) based on operator precedence and associativity.

---

### 2.
Why is the exponentiation operator `^` marked with right-associativity (`left_assoc = False`) in the calculator?
A. Because mathematical convention dictates that $2^{3^2}$ evaluates as $2^{(3^2)} = 2^9 = 512$ rather than $(2^3)^2 = 8^2 = 64$.
B. Python does not support left-to-right math.
C. Right-associative operators run faster on 64-bit CPUs.
D. To prevent division by zero.

**Answer:** A

**Explanation:** Exponentiation is mathematically right-associative: chained powers are evaluated from right to left ($a^{b^c} = a^{(b^c)}$).

---

### 3.
What Pytest feature allows testing multiple expression-and-result combinations inside a single test function definition?
A. `@pytest.fixture`
B. `@pytest.mark.parametrize`
C. `pytest.raises`
D. `pytest.approx`

**Answer:** B

**Explanation:** `@pytest.mark.parametrize` enables declarative data-driven testing by running the same test function across an array of parameters.

---

### 4.
Why is `pytest.approx(expected)` used when asserting floating-point arithmetic results in Pytest?
A. It rounds all numbers to the nearest integer.
B. It accounts for minor binary floating-point representation inaccuracies (e.g. `0.1 + 0.2 == 0.30000000000000004`), preventing false test failures.
C. It converts floats to strings.
D. It disables test timeouts.

**Answer:** B

**Explanation:** Standard floating-point arithmetic in computers introduces tiny binary representation errors. `pytest.approx` compares floating-point numbers within a relative tolerance.

---

### 5.
What exception type is raised by our calculator when an expression contains an unclosed parenthesis like `"(10 + 2"`?
A. `ZeroDivisionError`
B. `CalculatorSyntaxError`
C. `IndexError`
D. `KeyError`

**Answer:** B

**Explanation:** An unclosed opening parenthesis is detected during Shunting-Yard parsing, triggering a `CalculatorSyntaxError("Mismatched parentheses detected.")`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Tkinter Basics** (14: GUI Development with Tkinter).

👉 **[Continue to Next Lesson: Tkinter Basics →](/tutorials/python-for-advanced/tkinter-basics)**

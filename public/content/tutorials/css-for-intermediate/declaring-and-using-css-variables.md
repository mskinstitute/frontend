---
id: declaring-and-using-css-variables
slug: declaring-and-using-css-variables
course: css-for-intermediate
chapter: 10
topic: 10.1
title: "Declaring and Using CSS Variables: Syntax, Fallbacks, and Scope"
description: Master CSS custom properties (variables). Learn declaration syntax, the var() retrieval function with fallbacks, local vs global scoping, and why native CSS variables are reactive at runtime.
difficulty: Intermediate
readingTime: 12
order: 28
keywords:
  - css variables
  - custom properties
  - var function
  - css scope
  - fallback values
  - runtime reactivity
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# Declaring and Using CSS Variables: Syntax, Fallbacks, and Scope

In your Class 8 algebra class, your mathematics teacher writes on the blackboard:
$$x = 15$$
Whenever you see $x$ inside an equation—whether calculating the perimeter of a playground ($2x + 10$) or finding total exam marks ($4x$)—you simply substitute $15$. If the teacher decides to change the problem to $x = 25$, they don't erase 50 different lines on the blackboard. They erase and update **one single number at the top**, and the entire solution updates automatically!

```
+-------------------------------------------------------------------------+
|                  THE ALGEBRA OF CSS CUSTOM PROPERTIES                   |
|                                                                         |
|  The Hardcoded Nightmare (Changing brand color takes 3 hours):          |
|  .header  { background: #1e3a8a; }                                      |
|  .button  { background: #1e3a8a; }  <--- Hardcoded in 250 files!        |
|  .badge   { color: #1e3a8a; }                                           |
|  .border  { border: 1px solid #1e3a8a; }                                |
|                                                                         |
|  The CSS Variable Superpower (Changing brand color takes 2 seconds):   |
|  --school-blue: #1e3a8a;                                                |
|                                                                         |
|  .header  { background: var(--school-blue); }                           |
|  .button  { background: var(--school-blue); }                           |
|  .badge   { color: var(--school-blue); }                                |
|  .border  { border: 1px solid var(--school-blue); }                     |
+-------------------------------------------------------------------------+
```

Before CSS Custom Properties existed, web developers had to rely on preprocessors like SASS or Less. But preprocessors convert variables into static numbers before the page loads. **Native CSS Variables live inside the live browser DOM**, allowing real-time theme swapping, JavaScript interaction, and scoped component overrides!

---

## 1. Syntax: Declaring and Calling Variables

### 1. The Double-Hyphen (`--`) Declaration
Every CSS variable name **must** begin with two hyphens (`--`):

```css
.card {
  /* Variable Declarations */
  --accent-color: #2563eb;
  --card-padding: 24px;
  --card-radius: 12px;
}
```

> **Case-Sensitivity Warning:** CSS variables are strictly **case-sensitive**! `--accent-color` and `--Accent-Color` are treated as two completely distinct, unrelated variables!

---

### 2. The `var()` Retrieval Function
To read and apply a variable, wrap its name inside `var()`:

```css
.card {
  background-color: #ffffff;
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  border-top: 4px solid var(--accent-color);
}
```

---

## 2. Fallbacks: The Safety Net

What happens if a variable was never defined or failed to load? The browser allows you to supply a **fallback value** as the second argument inside `var()`:

```css
/* If --primary-theme is missing, use #0f172a instead! */
.header {
  background-color: var(--primary-theme, #0f172a);
}

/* Chained Fallbacks */
.title {
  color: var(--custom-heading-color, var(--default-text, #1e293b));
}
```

---

## 3. Scoping: Global vs Local

Just like variables in programming languages (C++, Python, JavaScript), CSS variables have **lexical scope**:

```
========================================================================
VARIABLE SCOPING HIERARCHY
========================================================================

:root { --brand: #2563eb; } <--------- GLOBAL SCOPE (Available everywhere!)
  |
  +--> .student-card {
  |      --card-bg: #ffffff; <------- LOCAL SCOPE (Only inside .student-card)
  |      |
  |      +--> h3 { color: var(--brand); }   <-- Works! (Inherited from root)
  |      +--> p  { background: var(--card-bg); } <-- Works! (Local)
  |
  +--> .footer {
         background: var(--card-bg); <--- BROKEN! Undefined outside .student-card!
```

* **Global Scope (`:root`)**: Declared at the very top of the DOM. Accessible by every element on the page.
* **Local Scope (`.card`)**: Declared on a specific selector. Accessible only by that element and its descendants.

---

## 4. Local Theming Trick: Scoped Component Overrides

You can create an entire family of themed cards by changing **one single variable** on the parent modifier class:

```css
/* Base Card Component */
.house-card {
  --house-color: #64748b; /* Neutral fallback */
  
  border-left: 5px solid var(--house-color);
  padding: 20px;
  background-color: #ffffff;
}

.house-card .house-title {
  color: var(--house-color);
}

.house-card .house-btn {
  background-color: var(--house-color);
  color: white;
}

/* Modifiers: Redefining ONLY the variable changes the entire card! */
.house-card.tagore  { --house-color: #d97706; } /* Gold */
.house-card.shivaji { --house-color: #059669; } /* Green */
.house-card.ashoka  { --house-color: #dc2626; } /* Crimson */
.house-card.raman   { --house-color: #2563eb; } /* Royal Blue */
```

Look how clean and scalable that is! You wrote the card CSS once, and created 4 distinct school house themes simply by overriding `--house-color`.

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Writing variable names without hyphens (`accent-color: #2563eb;`) | Always prefix with double dashes: `--accent-color: #2563eb;` | CSS requires `--` to distinguish custom properties from native CSS properties. |
| Writing `var(accent-color)` without dashes | Write `var(--accent-color)` | The double-dash is mandatory in both declaration and retrieval. |
| Mixing up case (`--Main-Color` vs `--main-color`) | Adopt lowercase kebab-case standard: `--main-color` | CSS variables are case-sensitive; mismatched case breaks style lookups. |
| Storing units separately (`--size: 20; font-size: var(--size)px;`) | Store the full unit in the variable: `--size: 20px;` or use `calc()` | CSS does not concatenate strings and numbers directly like `var(--size)px`. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **Declaration**: `--variable-name: value;` (must begin with `--`, case-sensitive).
* **Usage**: `var(--variable-name, fallback)`.
* **Scope**: Declared in `:root` for global access; declared in a selector for local component scoping.
* **Fallbacks**: Always provide fallbacks for resilient component libraries (`var(--color, black)`).
* **Component Modifiers**: Override a single local variable on a modifier class to theme entire child trees with zero duplicate CSS.

---

# Multiple Choice Questions

### 1. Which prefix is strictly required when naming any CSS Custom Property (Variable)?
A. `$` (dollar sign)
B. `@` (at symbol)
C. `--` (double hyphen)
D. `var-`
**Answer:** C
**Explanation:** The CSS specification mandates that all custom properties begin with two hyphens (e.g., --primary-color).

---

### 2. Are CSS variable names case-sensitive?
A. No, `--theme-color` and `--Theme-Color` are identical
B. Yes, CSS variable names are strictly case-sensitive
C. Only on Windows computers
D. Only when defined inside `:root`
**Answer:** B
**Explanation:** Unlike standard CSS properties (which are case-insensitive), custom properties are case-sensitive. --primary and --Primary are different variables.

---

### 3. What is the purpose of the second argument in `var(--accent, #3b82f6)`?
A. It multiplies the color value
B. It provides a fallback value that the browser uses if `--accent` is undefined or invalid
C. It sets the transition speed
D. It specifies the hover color
**Answer:** B
**Explanation:** The optional second argument in var() serves as a fallback default if the referenced variable does not exist.

---

### 4. Why is `font-size: var(--size)px;` invalid when `--size: 16;`?
A. The browser does not support font sizes above 10px
B. CSS does not perform string concatenation of units directly onto var(); you must define `--size: 16px;` or write `calc(var(--size) * 1px)`
C. Variables cannot be used on font sizes
D. Only rem units are allowed with variables
**Answer:** B
**Explanation:** The browser evaluates var() as a standalone token. Attaching px directly produces a syntax error. The unit must be included in the variable value itself or computed via calc().

---

### 5. If a variable is declared inside `.sidebar { --bg: #333; }`, where can that variable be accessed?
A. Only on the `<body>` element
B. Exclusively inside `.sidebar` and any elements nested inside `.sidebar`
C. Across every webpage on the domain
D. Only inside JavaScript files
**Answer:** B
**Explanation:** CSS variables follow DOM tree inheritance. A variable declared on an element is locally scoped to that element and its nested descendants.

---

## 7. Hands-on Practice Challenge: The School House Roster Card

Build an interactive School House Roster Card that leverages scoped variable overriding:
1. Base `.house-card` component wired to use `--house-theme` for its border, heading, icon ring, and button.
2. Provide a default slate fallback (`#64748b`).
3. Create 3 distinct house variants (`.tagore`, `.ashoka`, `.raman`) that each define only ONE line of CSS: `--house-theme: <color>;`!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>School House Cards - CSS Variables</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
    }

    .house-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 960px;
      width: 100%;
    }

    /* ========================================================= */
    /* 1. BASE COMPONENT (Wired to --house-theme variable)        */
    /* ========================================================= */
    .house-card {
      /* Default Fallback Theme (Neutral Slate) */
      --house-theme: #64748b;
      --card-radius: 14px;

      background-color: #1e293b;
      border: 1px solid #334155;
      /* Top highlight stripe powered by the variable! */
      border-top: 5px solid var(--house-theme);
      border-radius: var(--card-radius);
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.2s ease;
    }

    .house-card:hover {
      transform: translateY(-4px);
    }

    .crest-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      /* Tinted circle background powered by variable */
      background-color: rgba(255, 255, 255, 0.08);
      border: 2px solid var(--house-theme);
      color: var(--house-theme);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .house-name {
      font-size: 1.25rem;
      color: var(--house-theme);
      margin: 4px 0;
    }

    .house-motto {
      font-size: 0.9rem;
      color: #94a3b8;
      line-height: 1.5;
    }

    .btn-house {
      margin-top: auto;
      background-color: var(--house-theme);
      color: #ffffff;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .btn-house:hover {
      opacity: 0.9;
    }

    /* ========================================================= */
    /* 2. MODIFIER CLASSES: 1 line of CSS creates a new theme!    */
    /* ========================================================= */
    .house-card.tagore {
      --house-theme: #f59e0b; /* Golden Amber */
    }

    .house-card.ashoka {
      --house-theme: #ef4444; /* Crimson Red */
    }

    .house-card.raman {
      --house-theme: #3b82f6; /* Royal Blue */
    }
  </style>
</head>
<body>

  <div class="house-grid">
    
    <!-- Tagore House -->
    <div class="house-card tagore">
      <div class="crest-icon">🦅</div>
      <h3 class="house-name">Tagore House</h3>
      <p class="house-motto">"Where the mind is without fear and the head is held high." Leading in cultural arts and literature.</p>
      <button class="btn-house">View House Roster</button>
    </div>

    <!-- Ashoka House -->
    <div class="house-card ashoka">
      <div class="crest-icon">🦁</div>
      <h3 class="house-name">Ashoka House</h3>
      <p class="house-motto">"Victory through courage and discipline." Champions of inter-house football and track athletics.</p>
      <button class="btn-house">View House Roster</button>
    </div>

    <!-- Raman House -->
    <div class="house-card raman">
      <div class="crest-icon">🔬</div>
      <h3 class="house-name">Raman House</h3>
      <p class="house-motto">"Curiosity ignites discovery." Pioneers in robotics, mathematics olympiads, and science exhibitions.</p>
      <button class="btn-house">View House Roster</button>
    </div>

  </div>

</body>
</html>
```

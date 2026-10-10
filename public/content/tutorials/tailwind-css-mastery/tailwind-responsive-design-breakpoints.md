# Mobile-First Responsive Design with Breakpoint Prefixes (sm, md, lg, xl)

In modern web development, more than 60% of all web traffic originates from mobile smartphones. Tailwind CSS adopts an uncompromising **mobile-first** design architecture: un-prefixed utilities apply to mobile devices, while prefixed modifiers (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) apply at specified minimum viewport widths (`min-width` media queries).

---

## 1. Default Breakpoint Scale

| Prefix | Minimum Width | CSS Media Query Target | Typical Device |
| :--- | :--- | :--- | :--- |
| *(None)* | `0px` | Default mobile styles | All smartphones (portrait) |
| `sm:` | `640px` | `@media (min-width: 640px)` | Large phones, small tablets |
| `md:` | `768px` | `@media (min-width: 768px)` | iPads, medium tablets |
| `lg:` | `1024px` | `@media (min-width: 1024px)` | Laptops, desktop monitors |
| `xl:` | `1280px` | `@media (min-width: 1280px)` | High-res desktop screens |
| `2xl:` | `1536px` | `@media (min-width: 1536px)` | Ultra-wide monitors, 4K displays |

---

## 2. The Golden Rule of Mobile-First Design

> **Crucial Concept:**  
> Never use `sm:` to target mobile phones!  
> Unprefixed classes target mobile. Breakpoint prefixes target that screen size **and everything larger**.

```html
<!-- Anti-pattern (Desktop-first thinking - WRONG): -->
<!-- <div class="w-full sm:w-1/2 md:w-full"> -->

<!-- Correct Mobile-First Pattern: -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Mobile: 100% width -->
  <!-- Tablet (md: >= 768px): 50% width -->
  <!-- Desktop (lg: >= 1024px): 33.33% width -->
</div>
```

---

## 3. Responsive Navigation Example

```html
<header class="p-4 bg-white border-b flex items-center justify-between">
  <div class="font-bold text-xl">MSK Institute</div>

  <!-- Mobile Hamburger Button (Hidden on md and up) -->
  <button class="block md:hidden p-2 rounded-lg bg-slate-100">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
    </svg>
  </button>

  <!-- Desktop Nav Links (Hidden on mobile, flex on md and up) -->
  <nav class="hidden md:flex items-center gap-6">
    <a href="/courses" class="text-sm font-semibold text-slate-700 hover:text-primary">Courses</a>
    <a href="/about" class="text-sm font-semibold text-slate-700 hover:text-primary">About Us</a>
    <button class="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg">Apply Now</button>
  </nav>
</header>
```

---

## 4. Responsive Typography & Layout Switching

```html
<!-- Stack vertically on phone, horizontal two-column on desktop -->
<div class="flex flex-col md:flex-row items-center gap-8 py-12 px-4 md:px-12">
  <div class="w-full md:w-1/2 space-y-4 text-center md:text-left">
    <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
      Become a Full-Stack Engineer
    </h1>
    <p class="text-sm md:text-base text-slate-600">
      Comprehensive classroom lab training in Shikohabad.
    </p>
  </div>
  <div class="w-full md:w-1/2">
    <img src="/hero.jpg" class="w-full rounded-2xl shadow-xl" alt="Classroom">
  </div>
</div>
```

---

# Multiple Choice Questions

### 1. In Tailwind CSS, which media query strategy is used by default for all breakpoints?
A. `max-width` (Desktop-first)
B. `min-width` (Mobile-first)
C. `device-pixel-ratio`
D. `orientation: landscape`
**Answer:** B
**Explanation:** Tailwind uses mobile-first `@media (min-width: ...)` queries. Unprefixed styles target the smallest screens, and prefixed utilities override them as screen size increases.
---

### 2. How do you hide an element on mobile phones and display it as a flex container on medium tablets (768px and up)?
A. `show-md flex`
B. `hidden md:flex`
C. `display: none; md:block`
D. `sm:hidden md:visible`
**Answer:** B
**Explanation:** `hidden` applies `display: none` by default on mobile screens. The prefix `md:flex` overrides it to `display: flex` at 768px and above.
---

### 3. What is the minimum screen width associated with the `lg:` breakpoint in default Tailwind CSS?
A. 640px
B. 768px
C. 1024px
D. 1280px
**Answer:** C
**Explanation:** Tailwind's default breakpoints are `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, and `2xl: 1536px`.
---

### 4. What is wrong with writing `sm:text-sm md:text-base` if a developer wants `text-sm` on mobile smartphones under 640px?
A. It causes a CSS syntax error.
B. `sm:` only triggers at 640px and wider; on screens smaller than 640px, no font size utility will be active. It should be written as `text-sm md:text-base`.
C. It limits text to English only.
D. It disables browser font scaling.
**Answer:** B
**Explanation:** Unprefixed classes represent mobile defaults. Writing `text-sm` ensures phones receive small text, while `md:text-base` scales up for tablets and desktops.
---

### 5. How can you define custom breakpoint values (e.g. `tablet: 800px`) in Tailwind CSS?
A. By writing `@media (min-width: 800px)` inside the HTML tag.
B. In `tailwind.config.js` under `theme.extend.screens`.
C. By modifying the browser engine registry.
D. By installing a custom npm binary.
**Answer:** B
**Explanation:** Adding keys to `theme.extend.screens` in `tailwind.config.js` allows developers to define custom breakpoint names and pixel thresholds.
---
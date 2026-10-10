# CSS Grid System: Template Columns, Rows, Col-Span & Gap

While Flexbox is ideal for one-dimensional layouts (a row OR a column), **CSS Grid** is the gold standard for two-dimensional layouts (rows AND columns simultaneously). Tailwind CSS makes CSS Grid effortless with `grid-cols-{n}`, `col-span-{n}`, and gap utilities.

---

## 1. Creating a Standard Responsive Grid

```html
<!-- 1 column on mobile, 2 on tablet (md), 4 on desktop (lg) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="p-6 bg-white rounded-xl shadow">Course 1</div>
  <div class="p-6 bg-white rounded-xl shadow">Course 2</div>
  <div class="p-6 bg-white rounded-xl shadow">Course 3</div>
  <div class="p-6 bg-white rounded-xl shadow">Course 4</div>
</div>
```

---

## 2. Spanning Columns and Rows (`col-span` & `row-span`)

Tailwind supports fractional spanning across a 12-column grid:

```html
<!-- Modern 12-Column Dashboard Layout -->
<div class="grid grid-cols-12 gap-4">
  <!-- Sidebar spans 3 columns -->
  <aside class="col-span-12 lg:col-span-3 bg-slate-900 text-white p-4 rounded-xl">
    Sidebar Menu
  </aside>
  
  <!-- Main Content spans 9 columns -->
  <main class="col-span-12 lg:col-span-9 bg-white p-6 rounded-xl border">
    Dashboard Analytics
  </main>
</div>
```

---

## 3. Asymmetrical Bento Grid Layout

Bento grids combine `col-span` and `row-span` for visual visual storytelling:

```html
<div class="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-96">
  <!-- Large Feature Card (spans 2 cols, 2 rows) -->
  <div class="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold">Featured Full-Stack Program</h3>
  </div>

  <!-- Top Right Card -->
  <div class="bg-slate-100 p-6 rounded-2xl">
    <h4>Online Certification</h4>
  </div>

  <!-- Bottom Right Card -->
  <div class="bg-amber-50 p-6 rounded-2xl">
    <h4>Live Lab Sessions</h4>
  </div>
</div>
```

---

## 4. Grid Auto-Fit vs Auto-Fill with Arbitrary Values

When you want an automated responsive grid where cards wrap without media queries:
```html
<!-- Auto-filling cards with minimum 250px width each -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
  <div class="bg-white p-4 shadow rounded-lg">Card A</div>
  <div class="bg-white p-4 shadow rounded-lg">Card B</div>
  <div class="bg-white p-4 shadow rounded-lg">Card C</div>
</div>
```

---

# Multiple Choice Questions

### 1. Which class establishes a 3-column equal-width grid container in Tailwind CSS?
A. `grid-3`
B. `grid grid-cols-3`
C. `flex flex-cols-3`
D. `columns-3`
**Answer:** B
**Explanation:** `grid` activates display: grid, and `grid-cols-3` sets `grid-template-columns: repeat(3, minmax(0, 1fr));`.
---

### 2. How do you make an element take up 4 columns inside a 12-column grid in Tailwind?
A. `col-width-4`
B. `col-span-4`
C. `w-4/12`
D. `span-cols-4`
**Answer:** B
**Explanation:** `col-span-4` applies `grid-column: span 4 / span 4;`, spanning across 4 column tracks.
---

### 3. What is the purpose of `row-span-2` in a CSS grid?
A. It adds 2 rows of padding to the element.
B. It causes an element to span across 2 horizontal row tracks.
C. It divides the row into 2 equal segments.
D. It duplicates the element twice.
**Answer:** B
**Explanation:** `row-span-2` sets `grid-row: span 2 / span 2;`, spanning across two vertical grid rows.
---

### 4. Which class specifies an independent 24px vertical row gap and 16px horizontal column gap?
A. `gap-x-4 gap-y-6`
B. `gap-4-6`
C. `gutter-x-16 gutter-y-24`
D. `gap-vh-6 gap-vw-4`
**Answer:** A
**Explanation:** `gap-x-4` controls column gap (16px) and `gap-y-6` controls row gap (24px).
---

### 5. What happens if a developer uses `col-span-2` inside a container that only has `grid-cols-1`?
A. Tailwind throws an alert popup.
B. The item cannot span 2 columns in a 1-column grid, so it spans the single available column track without breaking layout.
C. The browser crashes.
D. The element is hidden automatically.
**Answer:** B
**Explanation:** In a 1-column grid, spanning beyond the track count clamps gracefully to available column space.
---
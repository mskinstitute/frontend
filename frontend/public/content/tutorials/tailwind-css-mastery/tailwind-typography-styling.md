# Typography: Font Families, Sizes, Weights, Leading & Tracking

Typography is the backbone of exceptional digital design. In Tailwind CSS, typography utilities govern font sizing, weights, line heights (`leading`), letter spacing (`tracking`), text alignment, and colors with absolute precision.

---

## 1. Font Size & Fluid Line Heights

Tailwind's `text-{size}` classes automatically pair sensible default line-heights with each font size:

| Class | Font Size | Line Height | Typical Usage |
| :--- | :--- | :--- | :--- |
| `text-xs` | 0.75rem (12px) | 1rem (16px) | Badges, captions, timestamps |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Secondary text, form helper text |
| `text-base` | 1rem (16px) | 1.5rem (24px) | Body copy default |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Subheadings, lead paragraphs |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | Card headers |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | Section titles |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | Hero titles |

---

## 2. Font Weights & Font Families

```html
<!-- Font weights -->
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
<p class="font-extrabold">Extra Bold (800)</p>
<p class="font-black">Black (900)</p>

<!-- Font families -->
<p class="font-sans">Inter, system-ui, sans-serif</p>
<p class="font-serif">Merriweather, Georgia, serif</p>
<p class="font-mono">Fira Code, monospace for code blocks</p>
```

---

## 3. Leading (Line Height) & Tracking (Letter Spacing)

```html
<!-- Tight line height for massive titles -->
<h1 class="text-5xl font-black leading-tight tracking-tight">
  Empower Your Tech Career
</h1>

<!-- Loose line height for editorial readability -->
<p class="text-base text-slate-600 leading-relaxed tracking-normal">
  Tailwind CSS provides complete control over typographic rhythm without leaving HTML.
</p>
```

- **Tracking:** `tracking-tighter`, `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-widest`.

---

## 4. Text Truncation & Line Clamping

```html
<!-- Single line truncation with ellipsis -->
<p class="truncate max-w-xs">
  A very long string of customer feedback that should truncate gracefully with three dots...
</p>

<!-- Multi-line clamp (e.g. blog excerpt card) -->
<p class="line-clamp-2 text-slate-500">
  This paragraph will only render two complete lines of text before clipping cleanly with an ellipsis.
</p>
```

---

# Multiple Choice Questions

### 1. What does the `truncate` utility class do in Tailwind CSS?
A. Deletes the text from the DOM.
B. Applies `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to cut off text on a single line with an ellipsis.
C. Converts lowercase characters to uppercase.
D. Decreases the font size by 50%.
**Answer:** B
**Explanation:** `truncate` prevents text from wrapping and displays a trailing ellipsis (`...`) when the text overflows its container width.
---

### 2. Which Tailwind utility class controls letter-spacing (kerning)?
A. `kerning-wide`
B. `letter-spacing`
C. `tracking-{size}` (e.g., `tracking-wide`)
D. `leading-{size}`
**Answer:** C
**Explanation:** `tracking` maps to the CSS `letter-spacing` property, while `leading` maps to `line-height`.
---

### 3. Which font weight class corresponds to CSS `font-weight: 700;`?
A. `font-medium`
B. `font-semibold`
C. `font-bold`
D. `font-black`
**Answer:** C
**Explanation:** `font-bold` sets `font-weight: 700`. `font-semibold` is 600, and `font-black` is 900.
---

### 4. How can you limit a blog post preview description to exactly 3 lines of text in Tailwind CSS?
A. `max-lines-3`
B. `line-clamp-3`
C. `lines-3`
D. `overflow-lines-3`
**Answer:** B
**Explanation:** `line-clamp-3` uses CSS `-webkit-line-clamp` to cap text content at exactly 3 lines followed by an ellipsis.
---

### 5. In Tailwind CSS, what is the computed font size of `text-xl`?
A. 14px
B. 16px
C. 20px (1.25rem)
D. 28px
**Answer:** C
**Explanation:** `text-xl` corresponds to `1.25rem` or 20px in standard 16px base font environments.
---
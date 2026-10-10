# Tailwind Core Spacing, Sizing, Padding & Margin Scales

Tailwind CSS employs a standardized, highly intuitive mathematical scale for managing **spacing**, **margins**, **paddings**, and **dimensions**. Rather than guessing pixel values, developers compose with a 4-pixel base unit grid ($1 \text{ unit} = 0.25\text{rem} = 4\text{px}$).

---

## 1. The 4-Pixel Mathematical Spacing Scale

Every numerical step in Tailwind's spacing scale corresponds to a multiple of **4px**:

| Class | CSS Value (rem) | Equivalent Pixels | Use Case |
| :--- | :--- | :--- | :--- |
| `p-1` / `m-1` | `0.25rem` | **4px** | Tight micro-spacing, badges |
| `p-2` / `m-2` | `0.5rem` | **8px** | Small button paddings |
| `p-4` / `m-4` | `1rem` | **16px** | Standard default container padding |
| `p-6` / `m-6` | `1.5rem` | **24px** | Card component padding |
| `p-8` / `m-8` | `2rem` | **32px** | Section margins |
| `p-12` / `m-12` | `3rem` | **48px** | Hero section spacing |
| `p-16` / `m-16` | `4rem` | **64px** | Page breaks & layout dividers |

---

## 2. Padding vs Margin Directions

Tailwind provides directional modifiers for precise spatial control:

```html
<!-- Padding examples -->
<div class="p-6">Padding on all 4 sides (24px)</div>
<div class="px-4">Horizontal padding (left and right: 16px)</div>
<div class="py-2">Vertical padding (top and bottom: 8px)</div>
<div class="pt-8 pr-4 pb-2 pl-6">Independent top, right, bottom, left</div>

<!-- Margin examples -->
<div class="mt-10">Margin top (40px)</div>
<div class="mx-auto">Center a block element horizontally (margin-left: auto; margin-right: auto)</div>
<div class="-mt-4">Negative margin: pull element upward by 16px</div>
```

---

## 3. Sizing: Width & Height

```html
<!-- Fixed Sizing -->
<div class="w-16 h-16 bg-blue-500">Fixed 64px by 64px avatar</div>

<!-- Fractional Widths (Fluid grids) -->
<div class="flex">
  <div class="w-1/2">50% width</div>
  <div class="w-1/2">50% width</div>
</div>

<div class="w-1/3">33.33%</div>
<div class="w-2/3">66.66%</div>
<div class="w-1/4">25%</div>

<!-- Viewport and Max/Min Sizing -->
<div class="w-full max-w-4xl min-h-screen">
  Takes full width up to 56rem (896px), and at least 100vh height!
</div>
```

---

## 4. Arbitrary Spacing Values

When an exact pixel specification is required by an enterprise design system:
```html
<!-- Use square brackets for arbitrary JIT values -->
<div class="p-[19px] w-[342px] min-h-[calc(100vh-80px)]">
  Custom spacing compiled on-demand!
</div>
```

---

# Multiple Choice Questions

### 1. In Tailwind's standard spacing scale, what is the computed pixel equivalent of `p-6`?
A. 6px
B. 18px
C. 24px
D. 36px
**Answer:** C
**Explanation:** Tailwind's default spacing formula is $N 	imes 0.25	ext{rem}$. For $N = 6$: $6 	imes 4	ext{px} = 24	ext{px}$ ($1.5	ext{rem}$).
---

### 2. Which Tailwind utility class centers a block-level element horizontally within its parent container?
A. `text-center`
B. `align-center`
C. `mx-auto`
D. `center-block`
**Answer:** C
**Explanation:** `mx-auto` sets `margin-left: auto; margin-right: auto;`, which centers fixed-width block elements.
---

### 3. How do you declare a negative top margin of 16px in Tailwind CSS?
A. `mt-negative-4`
B. `-mt-4`
C. `mt-[-16]`
D. `margin-top: -16px`
**Answer:** B
**Explanation:** Prefixing spacing utilities with a minus sign (e.g., `-mt-4`, `-mx-2`) applies negative margin values.
---

### 4. Which class sets an element's minimum height to equal 100% of the browser viewport height?
A. `h-screen`
B. `min-h-screen`
C. `h-full`
D. `vh-100`
**Answer:** B
**Explanation:** `min-h-screen` applies `min-height: 100vh;`, ensuring the element spans at least the full viewport height.
---

### 5. What is the width of an element styled with `w-3/4`?
A. 34%
B. 75%
C. 300px
D. 43%
**Answer:** B
**Explanation:** Fractional width classes like `w-3/4` compute the percentage: $3 / 4 = 75%$.
---
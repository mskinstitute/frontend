# State Variants: Hover, Focus, Active, Disabled & Group-Hover

Dynamic web applications require rich visual feedback when users interact with elements. Tailwind CSS handles pseudo-classes—such as `:hover`, `:focus`, `:active`, `:disabled`, and `:focus-visible`—using prefix modifiers. Furthermore, features like `group-hover` and `peer-focus` enable complex parent-child and sibling interaction patterns.

---

## 1. Core State Modifiers

```html
<!-- Interactive Button with Hover, Focus & Active States -->
<button class="
  px-5 py-2.5 rounded-xl font-bold text-white
  bg-blue-600 hover:bg-blue-700
  focus:outline-none focus:ring-4 focus:ring-blue-300
  active:scale-95 transition-all
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Submit Application
</button>
```

- **`hover:`**: Triggered when mouse cursor hovers over the element.
- **`focus:` / `focus-visible:`**: Triggered when element receives keyboard or click focus.
- **`active:`**: Triggered when mouse is clicked down on the element.
- **`disabled:`**: Triggered when button/input has `disabled` attribute.

---

## 2. Parent-Triggered Interactions with `group-hover`

Often, you want hovering over an entire card to animate an internal icon or change title colors. Mark the parent with `group` and the child with `group-hover:`:

```html
<!-- Course Card with group-hover -->
<div class="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer">
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">New</span>
    
    <!-- Arrow slides to the right when parent CARD is hovered! -->
    <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
    </svg>
  </div>
  
  <h3 class="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
    Full-Stack MERN Mastery
  </h3>
</div>
```

---

## 3. Sibling-Triggered Interactions with `peer`

To style an element based on the state of a sibling element (e.g., floating form labels), mark the input with `peer` and sibling with `peer-focus:`:

```html
<div class="relative">
  <input type="email" id="email" placeholder=" " 
         class="peer w-full px-4 py-3 border rounded-xl focus:border-blue-600 focus:outline-none" />
  <label for="email" 
         class="absolute left-4 top-3 text-slate-400 pointer-events-none transition-all
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-1">
    Email Address
  </label>
</div>
```

---

# Multiple Choice Questions

### 1. In Tailwind CSS, how do you style a child icon to rotate 45 degrees whenever its parent card container is hovered?
A. Add `hover:rotate-45` to the child.
B. Add `group` to the parent container and `group-hover:rotate-45` to the child icon.
C. Add `parent:hover` to the child icon.
D. Use JavaScript event listeners.
**Answer:** B
**Explanation:** The `group` utility marks the interaction boundary on the parent, allowing any descendant with `group-hover:` to react when the parent receives hover state.
---

### 2. Which modifier ensures focus outline rings only appear when navigating via keyboard (avoiding ugly rings on mouse clicks)?
A. `focus:`
B. `focus-visible:`
C. `keyboard-focus:`
D. `active:`
**Answer:** B
**Explanation:** `focus-visible:` maps to the CSS `:focus-visible` pseudo-class, rendering rings only when users navigate via keyboard tabs or accessibility aids.
---

### 3. How do you disable mouse events and reduce opacity on a disabled button in Tailwind?
A. `if-disabled:opacity-50`
B. `disabled:opacity-50 disabled:cursor-not-allowed`
C. `button[disabled]:fade`
D. `block-events`
**Answer:** B
**Explanation:** The `disabled:` state prefix targets elements with the boolean `disabled` HTML attribute, styling them with reduced opacity and not-allowed cursor.
---

### 4. What does the `peer` modifier allow developers to accomplish?
A. Establish a WebRTC peer-to-peer connection.
B. Style an element based on the state of an earlier sibling element (such as an `<input>`).
C. Connect multiple browser tabs together.
D. Encrypt user passwords.
**Answer:** B
**Explanation:** When a preceding sibling element is marked with the `peer` class, subsequent sibling elements can react to its state using `peer-focus:`, `peer-checked:`, etc.
---

### 5. What is the effect of `active:scale-95` on a button?
A. Permanently reduces the button width by 5%.
B. Slightly shrinks the button (gives a tactile press-down click animation) while the mouse button is actively depressed.
C. Increases the font size on click.
D. Rotates the button 95 degrees.
**Answer:** B
**Explanation:** `active:scale-95` triggers during the click/touch event, scaling the element to 95% of its size to provide tactile feedback.
---
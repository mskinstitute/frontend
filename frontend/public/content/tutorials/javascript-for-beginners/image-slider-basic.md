# Project: Responsive Image Slider (Carousel)

Image sliders and carousels are ubiquitous across modern web applications—from e-commerce product galleries to hero banners on landing pages. In this hands-on project, we will construct an **Interactive Responsive Image Slider** from scratch using vanilla JavaScript.

---

## 1. Carousel Architecture & Mechanics

A carousel works by displaying one image while keeping adjacent images hidden. An active index pointer tracks the current slide:

```
Images Array: [ Image 0 , Image 1 , Image 2 , Image 3 ]
                             ^
                             |
                     currentIndex = 1
```

### Controls:
- **Next Button (`>`)**: Increments index (`currentIndex = (currentIndex + 1) % length`).
- **Prev Button (`<`)**: Decrements index (`currentIndex = (currentIndex - 1 + length) % length`).
- **Pagination Indicators**: Dots that allow clicking directly to any slide index.
- **Autoplay**: Uses `setInterval()` to advance slides every 4 seconds.

---

## 2. HTML Markup (`index.html`)

```html
<div class="carousel-container">
  <div class="carousel-track">
    <div class="slide active">
      <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800" alt="Coding Setup">
      <div class="caption">Web Development Mastery</div>
    </div>
    <div class="slide">
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" alt="Data Analytics">
      <div class="caption">Data Analytics & Power BI</div>
    </div>
    <div class="slide">
      <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800" alt="Cyber Security">
      <div class="caption">Python & Cyber Security</div>
    </div>
  </div>

  <!-- Navigation Arrows -->
  <button id="prev-btn" class="nav-btn prev" aria-label="Previous Slide">&#10094;</button>
  <button id="next-btn" class="nav-btn next" aria-label="Next Slide">&#10095;</button>

  <!-- Dots Indicator -->
  <div class="indicators-container" id="indicators"></div>
</div>
```

---

## 3. CSS Styling (`style.css`)

```css
.carousel-container {
  position: relative;
  max-width: 750px;
  margin: 2rem auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.slide {
  display: none;
  position: relative;
}

.slide.active {
  display: block;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0.4; }
  to { opacity: 1; }
}

.slide img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.caption {
  position: absolute;
  bottom: 1.5rem;
  left: 2rem;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 1rem 1.25rem;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1.25rem;
  transition: background 0.2s;
}

.nav-btn:hover { background: rgba(0,0,0,0.8); }
.prev { left: 1rem; }
.next { right: 1rem; }

.indicators-container {
  position: absolute;
  bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active { background: #ffffff; }
```

---

## 4. JavaScript Carousel Controller (`slider.js`)

```javascript
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const indicatorsContainer = document.querySelector("#indicators");

let currentIndex = 0;
let autoplayTimer = null;

// 1. Generate Navigation Dots dynamically based on slide count:
slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(index));
  indicatorsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

// 2. Render Function
function updateCarousel() {
  // Update slide visibility
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentIndex);
  });

  // Update dots indicator
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
  restartAutoplay();
}

// 3. Autoplay Features
function startAutoplay() {
  autoplayTimer = setInterval(nextSlide, 4000);
}

function restartAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

// Event Listeners
nextBtn.addEventListener("click", () => {
  nextSlide();
  restartAutoplay();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  restartAutoplay();
});

// Start loop
startAutoplay();
```

---

## Practice Quiz

### Q1: What mathematical operation gracefully wraps the carousel index back to `0` when moving past the last slide?
- A) Multiplication
- B) Modulus operator: `(currentIndex + 1) % slides.length`
- C) Division
- D) Absolute value
**Answer:** B
**Explanation:** The modulus operator `%` wraps numbers in a cycle: when `currentIndex + 1` equals `slides.length`, the remainder evaluates to 0.

### Q2: What function is used to create an automated recurring slide transition every 4 seconds?
- A) `setTimeout(nextSlide, 4000)`
- B) `setInterval(nextSlide, 4000)`
- C) `window.loop(4000)`
- D) `delay(4000)`
**Answer:** B
**Explanation:** `setInterval()` repeatedly calls the specified callback function at the given millisecond interval.

### Q3: Why is `clearInterval(timer)` called when a user manually clicks the Next or Prev button?
- A) To destroy the carousel
- B) To reset the autoplay countdown so the slide does not abruptly skip right after a manual click
- C) To close the browser tab
- D) It is not needed
**Answer:** B
**Explanation:** Clearing and restarting the interval ensures the full timer delay runs after manual user interaction.

### Q4: How does `document.createElement("div")` work?
- A) It deletes an existing div
- B) It creates a new DOM element in memory that can be styled and appended to the document
- C) It styles an element
- D) It prints text to the console
**Answer:** B
**Explanation:** `document.createElement(tagName)` constructs a new element node in memory, ready to be mounted into the DOM using `.appendChild()`.

### Q5: What CSS property ensures that images fill the carousel dimensions without distorting their aspect ratio?
- A) `object-fit: cover;`
- B) `display: flex;`
- C) `aspect-ratio: none;`
- D) `transform: rotate(0);`
**Answer:** A
**Explanation:** `object-fit: cover` sizes an image to fill its parent box while maintaining aspect ratio, clipping overflowing portions cleanly.

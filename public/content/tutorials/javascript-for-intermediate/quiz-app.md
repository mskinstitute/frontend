# Project: Quiz App with Dynamic DOM & Scoring

In this project, you will build a dynamic, interactive **Quiz App** featuring question pools, dynamic DOM rendering, score tracking, interactive progress indicators, and instant feedback.

---

## 1. Project Specifications

1. **Question Data Structure:** Array of question objects containing question prompt, options array, correct answer index, and explanation.
2. **State Management:** Track active question index, score count, user answers, and completion state.
3. **Dynamic Rendering:** Rebuild question cards dynamically with high-performance DOM methods.
4. **Instant Feedback:** Highlight correct answer in green and incorrect selection in red upon clicking.
5. **Scorecard & Restart:** Render final scorecard with percentage and a restart button that resets state.

---

## 2. HTML Markup (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JavaScript Mastery Quiz</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="quiz-container" id="quiz-app">
    <header class="quiz-header">
      <h2>JavaScript Skills Assessment</h2>
      <div class="progress-bar-container">
        <div id="progress-bar" class="progress-bar"></div>
      </div>
      <div class="stats-row">
        <span id="question-tracker">Question 1 of 5</span>
        <span id="score-tracker">Score: 0</span>
      </div>
    </header>

    <main id="quiz-card" class="quiz-card">
      <h3 id="question-text" class="question-text">Loading question...</h3>
      <div id="options-container" class="options-container"></div>
      <div id="explanation-box" class="explanation-box hidden"></div>
    </main>

    <footer class="quiz-footer">
      <button id="next-btn" class="btn btn-primary hidden">Next Question</button>
    </footer>

    <!-- Results Modal / Card -->
    <div id="results-card" class="results-card hidden">
      <h2>Quiz Completed!</h2>
      <p id="final-score-text">You scored 0 out of 5</p>
      <div id="score-percentile" class="score-badge">0%</div>
      <button id="restart-btn" class="btn btn-restart">Retake Quiz</button>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

## 3. Styling the Quiz (style.css)

```css
:root {
  --primary: #4f46e5;
  --success: #10b981;
  --danger: #ef4444;
  --bg: #0f172a;
  --card-bg: #1e293b;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --border: #334155;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.quiz-container {
  background: var(--card-bg);
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.progress-bar-container {
  background: var(--border);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-bar {
  background: var(--primary);
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.question-text {
  font-size: 1.25rem;
  margin: 1.5rem 0;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-btn {
  background: #334155;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover:not(:disabled) {
  background: #475569;
}

.option-btn.correct {
  background: var(--success);
  border-color: var(--success);
  color: white;
}

.option-btn.wrong {
  background: var(--danger);
  border-color: var(--danger);
  color: white;
}

.explanation-box {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(79, 70, 229, 0.1);
  border-left: 4px solid var(--primary);
  border-radius: 0.25rem;
  font-size: 0.95rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
}

.btn-primary { background: var(--primary); color: white; }
.btn-restart { background: var(--success); color: white; }
.hidden { display: none !important; }
```

---

## 4. Application Logic (app.js)

```javascript
// Quiz Data Repository
const questions = [
  {
    question: "What does Array.prototype.map() return?",
    options: [
      "The original array mutated",
      "A new array of identical length with transformed values",
      "A single reduced value",
      "A boolean indicating matching condition"
    ],
    answer: 1,
    explanation: "map() constructs a new array with results from calling the callback on each element."
  },
  {
    question: "Which keyword creates a block-scoped variable in modern JavaScript?",
    options: ["var", "let", "global", "scope"],
    answer: 1,
    explanation: "let and const provide true block-level scoping within curly braces."
  },
  {
    question: "What does Promise.all() do when one of the promises rejects?",
    options: [
      "Waits for all to finish",
      "Immediately rejects with that error (fail-fast)",
      "Retries the rejected promise",
      "Returns null"
    ],
    answer: 1,
    explanation: "Promise.all is fail-fast: the first rejection immediately rejects the whole batch."
  }
];

// State
let currentIndex = 0;
let score = 0;

// Elements
const questionText = document.querySelector('#question-text');
const optionsContainer = document.querySelector('#options-container');
const explanationBox = document.querySelector('#explanation-box');
const nextBtn = document.querySelector('#next-btn');
const progressBar = document.querySelector('#progress-bar');
const questionTracker = document.querySelector('#question-tracker');
const scoreTracker = document.querySelector('#score-tracker');
const quizCard = document.querySelector('#quiz-card');
const resultsCard = document.querySelector('#results-card');
const finalScoreText = document.querySelector('#final-score-text');
const scorePercentile = document.querySelector('#score-percentile');
const restartBtn = document.querySelector('#restart-btn');

function renderQuestion() {
  const currentQ = questions[currentIndex];
  questionText.textContent = currentQ.question;
  explanationBox.classList.add('hidden');
  nextBtn.classList.add('hidden');
  optionsContainer.innerHTML = '';

  // Progress Bar update
  const progressPercent = ((currentIndex) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  questionTracker.textContent = `Question ${currentIndex + 1} of ${questions.length}`;

  currentQ.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = optText;
    btn.addEventListener('click', () => handleAnswer(index, btn));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, selectedBtn) {
  const currentQ = questions[currentIndex];
  const buttons = optionsContainer.querySelectorAll('.option-btn');

  // Disable all options
  buttons.forEach(btn => btn.disabled = true);

  // Check correctness
  if (selectedIndex === currentQ.answer) {
    selectedBtn.classList.add('correct');
    score++;
    scoreTracker.textContent = `Score: ${score}`;
  } else {
    selectedBtn.classList.add('wrong');
    // Highlight correct answer
    buttons[currentQ.answer].classList.add('correct');
  }

  // Show explanation
  explanationBox.textContent = currentQ.explanation;
  explanationBox.classList.remove('hidden');

  // Reveal next button
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizCard.classList.add('hidden');
  nextBtn.classList.add('hidden');
  resultsCard.classList.remove('hidden');
  progressBar.style.width = '100%';

  const percent = Math.round((score / questions.length) * 100);
  finalScoreText.textContent = `You scored ${score} out of ${questions.length}`;
  scorePercentile.textContent = `${percent}%`;
}

restartBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  scoreTracker.textContent = 'Score: 0';
  resultsCard.classList.add('hidden');
  quizCard.classList.remove('hidden');
  renderQuestion();
});

// Initialize
renderQuestion();
```

---

## Practice Quiz

### Q1: Why are all option buttons disabled immediately after the user selects an answer in handleAnswer()?
- A) To prevent memory leaks
- B) To prevent users from changing their selection or clicking multiple answers for extra points
- C) To speed up rendering
- D) To stop garbage collection
**Answer:** B
**Explanation:** Disabling options after selection prevents multiple clicks and enforces that only the first response is evaluated.

### Q2: How is the progress bar width updated dynamically as the user advances through questions?
- A) By re-rendering the HTML page
- B) By computing ((currentIndex) / total) * 100 and updating progressBar.style.width
- C) Using local storage
- D) Using WebSocket events
**Answer:** B
**Explanation:** Dividing the current index by the total questions and updating the element's inline `style.width` percentage provides an animated visual progress bar.

### Q3: What happens to the options container before rendering a new question?
- A) It is deleted permanently from the DOM
- B) Its previous buttons are cleared (optionsContainer.innerHTML = '')
- C) It is hidden with CSS
- D) It triggers a reload
**Answer:** B
**Explanation:** Clearing the inner HTML removes previous buttons before creating fresh elements for the next question.

### Q4: Which CSS class is applied to highlight the correct answer button in green?
- A) .highlight
- B) .correct
- C) .success-btn
- D) .active
**Answer:** B
**Explanation:** The `.correct` class applies green styling to clearly indicate the correct option.

### Q5: What resets the quiz back to the initial state when clicking the restart button?
- A) window.location.reload()
- B) Re-assigning currentIndex = 0, score = 0, hiding resultsCard, and invoking renderQuestion()
- C) Deleting the question array
- D) Clearing the browser cookies
**Answer:** B
**Explanation:** Resetting state variables in memory and re-invoking `renderQuestion()` cleanly resets the quiz without the overhead of a full page reload.

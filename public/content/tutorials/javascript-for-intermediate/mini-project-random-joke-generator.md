# Mini Project: Random Joke Generator

In this hands-on project, you will build a complete, interactive **Random Joke Generator** from scratch. This project brings together everything covered in this module: DOM selection, dynamic element creation, event listeners, async/await, the Fetch API, JSON parsing, and error handling with visual loading states.

---

## 1. Project Specifications

1. **Fetch from Public API:** Connect to the Official Joke API or JokeAPI.
2. **Interactive UI:** A button triggers an asynchronous fetch for a new punchline.
3. **Stateful Loading Indicator:** Disable button and show a spinner while the network request is pending.
4. **Resilient Error Handling:** Display a user-friendly error card if the network fails.
5. **Two-Part Punchline Animation:** Display the setup first, followed by a slight delay or reveal button for the punchline.

---

## 2. Project Architecture & HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Developer Joke Generator</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="card">
    <header class="card-header">
      <span class="badge">JavaScript Fetch API</span>
      <h1>Tech Humour Generator</h1>
    </header>

    <div class="content-area">
      <div id="loader" class="spinner hidden"></div>
      <p id="joke-setup" class="setup">Click below to generate a fresh joke!</p>
      <p id="joke-delivery" class="delivery hidden"></p>
      <div id="error-message" class="error hidden"></div>
    </div>

    <footer class="card-actions">
      <button id="btn-reveal" class="btn btn-secondary hidden">Reveal Punchline</button>
      <button id="btn-next" class="btn btn-primary">Get New Joke</button>
    </footer>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

---

## 3. Styling the Interface (style.css)

```css
:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --bg-dark: #0f172a;
  --surface: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #10b981;
  --danger: #ef4444;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 1rem;
}

.card {
  background: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.badge {
  background: rgba(99, 102, 241, 0.15);
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.setup {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
}

.delivery {
  font-size: 1.1rem;
  color: var(--accent);
  font-weight: 500;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border-left: 4px solid var(--accent);
  border-radius: 0.25rem;
}

.error {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.btn {
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  transition: background 0.2s;
}

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary { background: #334155; color: white; margin-right: 0.5rem; }
.hidden { display: none !important; }
```

---

## 4. Application Logic (app.js)

```javascript
// DOM Element References
const setupEl = document.querySelector('#joke-setup');
const deliveryEl = document.querySelector('#joke-delivery');
const errorEl = document.querySelector('#error-message');
const loaderEl = document.querySelector('#loader');
const nextBtn = document.querySelector('#btn-next');
const revealBtn = document.querySelector('#btn-reveal');

// State
let currentDelivery = '';

// Toggle loading states
function setLoading(isLoading) {
  nextBtn.disabled = isLoading;
  if (isLoading) {
    loaderEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    revealBtn.classList.add('hidden');
    deliveryEl.classList.add('hidden');
  } else {
    loaderEl.classList.add('hidden');
  }
}

// Fetch random joke from API
async function fetchJoke() {
  setLoading(true);
  try {
    const API_URL = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';
    
    // Timeout after 6 seconds
    const response = await fetch(API_URL, {
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || 'API reported an error');
    }

    // Process single-part vs two-part joke
    if (data.type === 'single') {
      setupEl.textContent = data.joke;
      deliveryEl.classList.add('hidden');
      revealBtn.classList.add('hidden');
    } else {
      setupEl.textContent = data.setup;
      currentDelivery = data.delivery;
      deliveryEl.textContent = data.delivery;
      deliveryEl.classList.add('hidden');
      revealBtn.classList.remove('hidden');
    }
  } catch (err) {
    setupEl.textContent = 'Oops! Something went wrong.';
    errorEl.textContent = `Error: ${err.message}. Please check your connection and try again.`;
    errorEl.classList.remove('hidden');
  } finally {
    setLoading(false);
  }
}

// Reveal punchline handler
revealBtn.addEventListener('click', () => {
  deliveryEl.classList.remove('hidden');
  revealBtn.classList.add('hidden');
});

// Next joke handler
nextBtn.addEventListener('click', fetchJoke);
```

---

## 5. Architectural Takeaways

1. **State Isolation:** `setLoading(boolean)` centralizes UI updates (buttons, spinners, visibility) so state never gets out of sync.
2. **Network Resilience:** Combining `response.ok`, `try/catch`, and `AbortSignal.timeout(6000)` ensures the app never hangs indefinitely.
3. **Graceful Degradation:** Both single-part jokes and two-part setup/delivery jokes are handled smoothly.

---

## Practice Quiz

### Q1: Why is nextBtn.disabled set to true during fetchJoke()?
- A) To prevent the user from opening DevTools
- B) To avoid duplicate concurrent network requests while one is already pending
- C) Because disabled buttons render faster
- D) To stop garbage collection
**Answer:** B
**Explanation:** Disabling the submit/fetch button while a network request is in-flight prevents rapid duplicate calls ("request spamming") and race conditions.

### Q2: Why is setLoading(false) placed in the finally block?
- A) Because finally blocks run asynchronously
- B) To guarantee the loading state is reset whether the request succeeds or throws an error
- C) It prevents CSS transitions from failing
- D) It compiles the code to WebAssembly
**Answer:** B
**Explanation:** The `finally` block runs unconditionally when execution exits the `try...catch`, ensuring the UI spinner is dismissed and buttons re-enabled on both success and failure.

### Q3: What happens in app.js if the API returns a 'two-part' joke?
- A) It throws a TypeError
- B) The setup is displayed immediately and a 'Reveal Punchline' button is shown to reveal the delivery
- C) It fetches a third joke
- D) It displays an alert() popup
**Answer:** B
**Explanation:** For two-part jokes, the setup text is rendered, the delivery is staged in memory and hidden, and the Reveal Punchline button is displayed.

### Q4: How does this project handle slow network connections that hang indefinitely?
- A) By calling window.location.reload()
- B) By passing AbortSignal.timeout(6000) to fetch(), which automatically aborts the request after 6 seconds
- C) By setting setInterval
- D) By disabling Wi-Fi
**Answer:** B
**Explanation:** `AbortSignal.timeout(6000)` aborts the fetch after 6,000 milliseconds, triggering a `TimeoutError` that enters the `catch` block cleanly.

### Q5: What is the primary role of the class hidden (display: none !important) in this project?
- A) Encrypting sensitive data
- B) Toggling visibility of DOM elements cleanly via classList.add() / classList.remove()
- C) Removing elements from the DOM tree completely
- D) Improving SEO rankings
**Answer:** B
**Explanation:** The `.hidden` utility class allows straightforward toggling of element visibility using `classList.add('hidden')` and `classList.remove('hidden')`.

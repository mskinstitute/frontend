# Project: Weather App using Fetch API & Async/Await

In this capstone project for the Intermediate JavaScript module, you will build a production-ready **Weather Dashboard Application**. This project integrates the Fetch API, async/await, DOM manipulation, loading states, error boundaries, and real-time meteorological API data.

---

## 1. Project Specifications

1. **Weather API Integration:** Connect to Open-Meteo or OpenWeather API to retrieve current conditions, temperature, humidity, and wind speed.
2. **City Geocoding:** Convert city names (e.g. "Tokyo", "London", "New York") into geographic coordinates via geocoding API.
3. **Async Workflow:** Clean `async/await` pipeline with centralized `try...catch`.
4. **UI State Management:** Loading spinners, temperature toggle (°C / °F), and descriptive weather condition cards.

---

## 2. HTML Markup (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkyCast: Real-Time Weather</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="weather-card">
    <header class="card-header">
      <h1>SkyCast Weather</h1>
      <form id="search-form" class="search-form">
        <input type="text" id="city-input" placeholder="Enter city name (e.g. Paris)..." required />
        <button type="submit" id="btn-search">Search</button>
      </form>
    </header>

    <div id="loader" class="loader hidden">
      <div class="spinner"></div>
      <p>Fetching weather data...</p>
    </div>

    <div id="error-box" class="error-box hidden"></div>

    <main id="weather-display" class="weather-display hidden">
      <div class="location-row">
        <h2 id="city-name">City, Country</h2>
        <span id="condition-badge" class="badge">Sunny</span>
      </div>

      <div class="temp-row">
        <div id="temperature" class="temp-val">22°C</div>
      </div>

      <div class="metrics-grid">
        <div class="metric">
          <span class="label">Wind Speed</span>
          <span id="wind-speed" class="val">12 km/h</span>
        </div>
        <div class="metric">
          <span class="label">Relative Humidity</span>
          <span id="humidity" class="val">65%</span>
        </div>
      </div>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

## 3. Styling the App (style.css)

```css
:root {
  --primary: #0284c7;
  --bg: #030712;
  --card: #111827;
  --text: #f9fafb;
  --text-muted: #9ca3af;
  --border: #1f2937;
  --danger: #ef4444;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.weather-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  max-width: 480px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.search-form {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.search-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: #1f2937;
  color: var(--text);
  font-size: 1rem;
}

.search-form button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: rgba(2, 132, 199, 0.2);
  color: #38bdf8;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
}

.temp-val {
  font-size: 4rem;
  font-weight: 800;
  margin: 1rem 0;
  color: #38bdf8;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.metric {
  background: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric .label { font-size: 0.8rem; color: var(--text-muted); }
.metric .val { font-size: 1.2rem; font-weight: 600; }

.error-box {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.75rem;
}

@keyframes spin { to { transform: rotate(360deg); } }
.hidden { display: none !important; }
```

---

## 4. Application Logic (app.js)

```javascript
const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const loader = document.querySelector('#loader');
const errorBox = document.querySelector('#error-box');
const weatherDisplay = document.querySelector('#weather-display');

const cityNameEl = document.querySelector('#city-name');
const tempEl = document.querySelector('#temperature');
const conditionBadge = document.querySelector('#condition-badge');
const windSpeedEl = document.querySelector('#wind-speed');
const humidityEl = document.querySelector('#humidity');

// Weather code interpreter (WMO standard)
function interpretWeatherCode(code) {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 95) return 'Thunderstorm';
  return 'Overcast';
}

function setLoading(isLoading) {
  if (isLoading) {
    loader.classList.remove('hidden');
    errorBox.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
  } else {
    loader.classList.add('hidden');
  }
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
  weatherDisplay.classList.add('hidden');
}

// 1. Geocoding Service (City -> Coordinates)
async function geocodeCity(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  
  const res = await fetch(geoUrl, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error('Geocoding service unavailable');
  
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Please verify spelling.`);
  }

  const result = data.results[0];
  return {
    name: `${result.name}, ${result.country || ''}`,
    lat: result.latitude,
    lon: result.longitude
  };
}

// 2. Weather Data Fetcher
async function fetchWeatherData(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
  
  const res = await fetch(weatherUrl, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error('Weather forecast service unavailable');
  
  return await res.json();
}

// Master Search Pipeline
async function handleWeatherSearch(cityName) {
  setLoading(true);
  try {
    // Step 1: Geocode location
    const location = await geocodeCity(cityName);

    // Step 2: Fetch weather for coordinates
    const weather = await fetchWeatherData(location.lat, location.lon);
    const current = weather.current;

    // Step 3: Render to DOM
    cityNameEl.textContent = location.name;
    tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
    conditionBadge.textContent = interpretWeatherCode(current.weather_code);
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;

    weatherDisplay.classList.remove('hidden');
  } catch (err) {
    showError(err.message || 'An unexpected error occurred.');
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    handleWeatherSearch(city);
  }
});

// Load default city on startup
handleWeatherSearch('London');
```

---

## Practice Quiz

### Q1: Why is encodeURIComponent(city) used when building the geocoding API URL?
- A) To encrypt the city name
- B) To safely encode spaces and special characters into valid URL query parameters
- C) To translate the city into French
- D) To convert the string into a binary stream
**Answer:** B
**Explanation:** `encodeURIComponent()` converts spaces, ampersands, and special characters into valid URL percent-encoded characters, preventing URL syntax errors.

### Q2: How does the app handle sequential API calls (geocoding coordinates first, then fetching weather)?
- A) Using setTimeout with 3000ms delay
- B) By awaiting the geocoding promise first, extracting lat/lon, and passing them to fetchWeatherData() with await
- C) By sending both URLs in a single GET request
- D) By storing coordinates in cookies
**Answer:** B
**Explanation:** `async/await` allows sequential dependencies to be written linearly: `const location = await geocodeCity(...)` followed by `const weather = await fetchWeatherData(location.lat, location.lon)`.

### Q3: What is the purpose of the interpretWeatherCode() helper function?
- A) To convert Fahrenheit to Celsius
- B) To map standard WMO numerical weather codes (0, 1, 45, 95) into human-readable descriptions like 'Sunny' or 'Thunderstorm'
- C) To validate user input
- D) To measure network latency
**Answer:** B
**Explanation:** Meteorological APIs return international WMO weather codes as integers; `interpretWeatherCode()` translates these numbers into readable strings.

### Q4: What happens in handleWeatherSearch if the user inputs an invalid city that doesn't exist?
- A) The browser crashes
- B) geocodeCity throws an Error, which is caught by the try...catch block and displayed in the error box
- C) The app defaults to Antarctica
- D) A 500 error is sent to the backend
**Answer:** B
**Explanation:** When `data.results` is empty, `geocodeCity` explicitly throws `new Error(...)`, triggering the `catch` block to display a friendly message in the UI.

### Q5: Why is setLoading(false) executed in the finally block of handleWeatherSearch?
- A) Because finally runs in a separate thread
- B) To ensure the spinner is dismissed and inputs are re-enabled whether the request succeeded or failed
- C) To clear the cache
- D) To trigger an automatic retry
**Answer:** B
**Explanation:** The `finally` block guarantees that the loading spinner is hidden and the UI returned to an interactive state regardless of whether an error was thrown.

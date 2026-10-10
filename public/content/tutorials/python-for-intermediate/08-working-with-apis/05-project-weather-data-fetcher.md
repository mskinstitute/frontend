---
id: python-intermediate-project-weather-data-fetcher
slug: project-weather-data-fetcher
course: python-for-intermediate
chapter: "8: Working with APIs"
topic: "8.5 Project: Weather Data Fetcher"
title: "Project: Weather Data Fetcher in Python"
description: "Master project: weather data fetcher in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 40
keywords:
  - python project weather data fetcher
  - python intermediate
  - python project: weather data fetcher
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Weather Data Fetcher

In this hands-on project, we will apply the HTTP networking concepts covered throughout this chapter—**HTTP Requests, Query Parameters, JSON Parsing, and Network Exception Handling**—to build a functional, real-time **Command-Line Weather Data Fetcher**.

We will connect to the open, free **Open-Meteo API** (which requires zero API keys or credit cards) to look up city coordinates and fetch current meteorological telemetry.

---

## 1. System Architecture & API Endpoints

Our weather application performs a two-stage API pipeline:
1. **Geocoding API**: Resolves a user's textual city query (e.g. `"Mumbai"` or `"London"`) into exact latitude and longitude coordinates.
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1`
2. **Forecast Weather API**: Fetches current weather telemetry for those coordinates.
   - Endpoint: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true`
3. **Data Translation Layer**: Maps numerical WMO weather codes (e.g. Code `0` = "Clear Sky", Code `61` = "Slight Rain") to user-friendly status descriptions.

---

## 2. Complete Application Code

```python
import requests
from typing import Optional, Dict, Any, Tuple


# Mapping WMO Weather Interpretation Codes to descriptions and symbols
WEATHER_CODES = {
    0: ("Clear sky", "☀️"),
    1: ("Mainly clear", "🌤️"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁️"),
    45: ("Foggy", "🌫️"),
    48: ("Depositing rime fog", "🌫️"),
    51: ("Light drizzle", "🌦️"),
    53: ("Moderate drizzle", "🌦️"),
    61: ("Slight rain", "🌧️"),
    63: ("Moderate rain", "🌧️"),
    65: ("Heavy rain", "⛈️"),
    71: ("Slight snowfall", "🌨️"),
    80: ("Rain showers", "🌦️"),
    95: ("Thunderstorm", "⚡")
}


class WeatherFetcher:
    """Client for querying real-time global weather from the Open-Meteo API."""

    GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
    FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

    def __init__(self, timeout: int = 5):
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "WeatherFetcherApp/1.0"})
        self.timeout = timeout

    def get_coordinates(self, city_name: str) -> Optional[Tuple[float, float, str, str]]:
        """Resolves city name to (latitude, longitude, formatted_name, country)."""
        params = {"name": city_name, "count": 1, "language": "en", "format": "json"}

        try:
            response = self.session.get(self.GEOCODING_URL, params=params, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()

            results = data.get("results")
            if not results:
                return None

            top_hit = results[0]
            lat = top_hit["latitude"]
            lng = top_hit["longitude"]
            resolved_city = top_hit.get("name", city_name)
            country = top_hit.get("country", "Unknown")
            return lat, lng, resolved_city, country

        except requests.exceptions.RequestException as err:
            print(f"[Network Error] Geocoding lookup failed: {err}")
            return None

    def get_current_weather(self, lat: float, lng: float) -> Optional[Dict[str, Any]]:
        """Retrieves meteorological data for given coordinates."""
        params = {
            "latitude": lat,
            "longitude": lng,
            "current_weather": "true"
        }

        try:
            response = self.session.get(self.FORECAST_URL, params=params, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            return data.get("current_weather")

        except requests.exceptions.RequestException as err:
            print(f"[Network Error] Weather telemetry fetch failed: {err}")
            return None

    def display_weather(self, city_name: str):
        """High-level runner: Geocodes city, fetches weather, and renders visual dashboard."""
        print(f"\nSearching coordinates for '{city_name}'...")
        geo_result = self.get_coordinates(city_name)

        if not geo_result:
            print(f"Error: Could not find coordinates for city '{city_name}'. Please verify spelling.")
            return

        lat, lng, city, country = geo_result
        weather = self.get_current_weather(lat, lng)

        if not weather:
            print("Error: Could not retrieve weather report at this time.")
            return

        # Extract values
        temp_c = weather.get("temperature")
        windspeed = weather.get("windspeed")
        winddirection = weather.get("winddirection")
        code = weather.get("weathercode", 0)

        # Convert to Fahrenheit
        temp_f = (temp_c * 9/5) + 32 if temp_c is not None else None
        condition, symbol = WEATHER_CODES.get(code, ("Unknown", "❓"))

        # Render Terminal UI
        print("\n" + "=" * 50)
        print(f"       WEATHER REPORT: {city.upper()}, {country.upper()} {symbol}")
        print("=" * 50)
        print(f" Coordinates       : {lat:.2f}°N, {lng:.2f}°E")
        print(f" Condition         : {condition}")
        print(f" Temperature       : {temp_c}°C ({temp_f:.1f}°F)")
        print(f" Wind Speed        : {windspeed} km/h")
        print(f" Wind Direction    : {winddirection}°")
        print("=" * 50)


def main():
    fetcher = WeatherFetcher()
    print("=" * 50)
    print("      REAL-TIME GLOBAL WEATHER DASHBOARD")
    print("=" * 50)

    while True:
        city = input("\nEnter city name (or 'quit' to exit): ").strip()
        if not city:
            continue
        if city.lower() in ("quit", "exit", "q"):
            print("Thank you for using the Weather Dashboard. Stay safe!")
            break

        fetcher.display_weather(city)


if __name__ == "__main__":
    main()
```

---

## 3. Sample Execution Simulation

```text
==================================================
      REAL-TIME GLOBAL WEATHER DASHBOARD
==================================================

Enter city name (or 'quit' to exit): New Delhi

Searching coordinates for 'New Delhi'...

==================================================
       WEATHER REPORT: NEW DELHI, INDIA ☀️
==================================================
 Coordinates       : 28.61°N, 77.21°E
 Condition         : Clear sky
 Temperature       : 31.4°C (88.5°F)
 Wind Speed        : 8.2 km/h
 Wind Direction    : 295°
==================================================

Enter city name (or 'quit' to exit): London

Searching coordinates for 'London'...

==================================================
       WEATHER REPORT: LONDON, UNITED KINGDOM 🌧️
==================================================
 Coordinates       : 51.51°N, -0.13°E
 Condition         : Slight rain
 Temperature       : 14.2°C (57.6°F)
 Wind Speed        : 19.8 km/h
 Wind Direction    : 210°
==================================================

Enter city name (or 'quit' to exit): quit
Thank you for using the Weather Dashboard. Stay safe!
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Unhandled Network Disconnection
Network drops raise `requests.exceptions.ConnectionError`. Always wrap API calls in a `try-except` block targeting `requests.exceptions.RequestException`.

### 2. Assuming City Names Are Always Valid
Handle 404 responses gracefully by informing the user that the city was not found rather than letting the application crash with a traceback.

---

---

## 💻 Try It Yourself: Extension Challenge - Temperature Unit Switch

### Challenge
Extend the Weather Data Fetcher to accept a command-line flag (`--unit C` or `--unit F`) that converts temperatures between Celsius and Fahrenheit.

### Complete Solution
```python
def convert_temp(celsius_temp: float, unit: str = "C") -> str:
    if unit.upper() == "F":
        fahrenheit = (celsius_temp * 9/5) + 32
        return f"{fahrenheit:.1f}°F"
    return f"{celsius_temp:.1f}°C"

# Test conversion
print("28°C in Fahrenheit:", convert_temp(28.0, "F"))
print("28°C in Celsius:", convert_temp(28.0, "C"))
```

### Expected Output
```text
28°C in Fahrenheit: 82.4°F
28°C in Celsius: 28.0°C
```

---

## Practice Quiz

### 1. In this project, what is the role of the Geocoding API step?
A. To check whether the user has internet access
B. To translate the human-readable city string into decimal latitude and longitude coordinates
C. To generate an SVG weather icon
D. To verify user credentials
**Answer:** B
**Explanation:** The Weather forecast API requires numerical latitude and longitude coordinates, so the geocoding service translates city names like "London" into `51.51` and `-0.13`.
---

### 2. Why is `self.session = requests.Session()` instantiated inside the `WeatherFetcher` constructor?
A. To encrypt terminal output
B. To reuse TCP connections across the geocoding and forecast queries, improving performance
C. To prevent the program from running on Windows
D. To disable DNS lookups
**Answer:** B
**Explanation:** `requests.Session()` reuses underlying network sockets (HTTP keep-alive) across both calls, reducing network handshake latency.
---

### 3. What does `WEATHER_CODES.get(code, ("Unknown", "❓"))` do if an unlisted code is encountered?
A. Raises an unhandled `KeyError`
B. Returns the fallback tuple `("Unknown", "❓")` safely without crashing
C. Makes another network request
D. Halts Python execution
**Answer:** B
**Explanation:** The `.get()` method on dictionaries allows providing a default fallback value when the searched key is not present.
---

### 4. How does the application prevent hanging if the remote weather API is unresponsive?
A. By setting a default `timeout` parameter on all requests
B. By creating background threads
C. By relying on the operating system to terminate the terminal
D. By calling `sys.exit()` after every call
**Answer:** A
**Explanation:** Supplying `timeout=self.timeout` to `requests.get()` guarantees the socket will raise a `requests.exceptions.Timeout` exception if the server doesn't respond within the time limit.
---

### 5. What method is called on the response object to confirm whether the HTTP status code was successful?
A. `response.verify_success()`
B. `response.raise_for_status()`
C. `response.confirm()`
D. `response.assert_status()`
**Answer:** B
**Explanation:** `response.raise_for_status()` checks the status code and raises an `HTTPError` if the response represents a client or server failure (4xx or 5xx).
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Using print vs logging** (9: Debugging and Logging).

👉 **[Continue to Next Lesson: Using print vs logging →](/tutorials/python-for-intermediate/using-print-vs-logging)**

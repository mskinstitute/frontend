---
id: python-intermediate-project-2-api-based-dictionary-app
slug: project-2-api-based-dictionary-app
course: python-for-intermediate
chapter: "14: Intermediate Projects"
topic: "14.2 Project 2: API-based Dictionary App"
title: "Project 2: API-based Dictionary App in Python"
description: "Master project 2: api-based dictionary app in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 67
keywords:
  - python project 2 api based dictionary app
  - python intermediate
  - python project 2: api-based dictionary app
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project 2: API-Based Dictionary & Vocab Builder in Python

In this intermediate project, we apply modern HTTP networking and local state persistence—**HTTP Requests with `requests`, JSON Parsing, Exception Handling, and File Serialization with `json`**—to construct a feature-complete **Command-Line Dictionary & Vocabulary Builder**.

---

## 1. System Architecture & API Specification

The application integrates with the open, public **Free Dictionary API** (`https://api.dictionaryapi.dev/api/v2/entries/en/<word>`).

### Key Capabilities:
1. **Live Lexical Lookup**: Queries word definitions, parts of speech, phonetic pronunciations, example usages, and synonyms.
2. **Local Vocabulary Persistence (`vocabulary.json`)**: Automatically caches looked-up words locally so users can review vocabulary even when offline.
3. **Interactive Flashcard Mode**: Quizzes the user on previously saved vocabulary words to reinforce learning.
4. **Resilient Network Handling**: Handles HTTP `404 Not Found` (unknown words), connection errors, and malformed JSON payloads gracefully.

---

## 2. Complete Project Implementation

```python
import json
import os
import random
import requests
from typing import Optional, Dict, Any, List

CACHE_FILE = "vocabulary.json"
API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en"


class VocabManager:
    """Manages local JSON storage of saved vocabulary words."""

    def __init__(self, filepath: str = CACHE_FILE):
        self.filepath = filepath
        self.vocab = self._load()

    def _load(self) -> Dict[str, Any]:
        if not os.path.exists(self.filepath):
            return {}
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            return {}

    def save(self):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self.vocab, f, indent=4, ensure_ascii=False)
        except OSError as err:
            print(f"Error persisting vocabulary cache: {err}")

    def add_word(self, word: str, data: Dict[str, Any]):
        self.vocab[word.lower()] = data
        self.save()

    def get_all_words(self) -> List[str]:
        return list(self.vocab.keys())


class DictionaryApp:
    """Core CLI Dictionary client."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "VocabBuilderCLI/1.0"})
        self.vocab_mgr = VocabManager()

    def lookup_word(self, word: str) -> Optional[Dict[str, Any]]:
        """Queries Dictionary API or falls back to local cache."""
        clean_word = word.strip().lower()
        if not clean_word:
            return None

        # Check local cache first (Offline capability!)
        if clean_word in self.vocab_mgr.vocab:
            print(f" [Local Cache Hit] Loading '{clean_word}' from saved vocabulary.")
            return self.vocab_mgr.vocab[clean_word]

        url = f"{API_BASE}/{clean_word}"
        try:
            response = self.session.get(url, timeout=6)
            if response.status_code == 404:
                print(f"Error: Word '{clean_word}' not found in English lexicon.")
                return None
            response.raise_for_status()
            
            data = response.json()
            if not isinstance(data, list) or not data:
                return None

            entry = self._parse_lexical_data(data[0])
            self.vocab_mgr.add_word(clean_word, entry)
            return entry

        except requests.exceptions.ConnectionError:
            print("[Network Error] Offline. Unable to reach Dictionary API.")
        except requests.exceptions.Timeout:
            print("[Timeout Error] Request timed out. Server is unresponsive.")
        except requests.exceptions.RequestException as err:
            print(f"[API Error] Request failed: {err}")
        return None

    def _parse_lexical_data(self, raw_entry: Dict[str, Any]) -> Dict[str, Any]:
        """Flattens complex nested API JSON structure into a clean model."""
        word = raw_entry.get("word", "").capitalize()
        phonetic = raw_entry.get("phonetic", "N/A")
        
        meanings = []
        for m in raw_entry.get("meanings", []):
            part_of_speech = m.get("partOfSpeech", "general")
            defs = []
            for d in m.get("definitions", [])[:2]:  # Take top 2 definitions
                definition_text = d.get("definition", "")
                example = d.get("example", None)
                defs.append({"definition": definition_text, "example": example})
            
            synonyms = m.get("synonyms", [])[:4]
            meanings.append({
                "part_of_speech": part_of_speech,
                "definitions": defs,
                "synonyms": synonyms
            })

        return {
            "word": word,
            "phonetic": phonetic,
            "meanings": meanings
        }

    def display_entry(self, entry: Dict[str, Any]):
        """Renders lexical data to terminal with structured formatting."""
        print("\n" + "=" * 55)
        print(f" WORD: {entry['word'].upper()}  ({entry['phonetic']})")
        print("=" * 55)

        for m in entry["meanings"]:
            print(f"\n[{m['part_of_speech'].upper()}]")
            for idx, d in enumerate(m["definitions"], start=1):
                print(f"  {idx}. {d['definition']}")
                if d.get("example"):
                    print(f"     * Example: \"{d['example']}\"")
            if m.get("synonyms"):
                print(f"  * Synonyms: {', '.join(m['synonyms'])}")
        print("=" * 55)

    def run_flashcards(self):
        """Interactive quiz on cached words."""
        words = self.vocab_mgr.get_all_words()
        if len(words) < 2:
            print("\nPlease search and save at least 2 words before launching Flashcards!")
            return

        print("\n--- VOCABULARY FLASHCARD MODE ---")
        quiz_word = random.choice(words)
        entry = self.vocab_mgr.vocab[quiz_word]
        
        # Pick the first definition as clue
        clue = entry["meanings"][0]["definitions"][0]["definition"]
        pos = entry["meanings"][0]["part_of_speech"]

        print(f"\nCLUE ({pos}): {clue}")
        guess = input("What word is this? ").strip().lower()

        if guess == quiz_word:
            print(" Correct! Great memory!")
        else:
            print(f" Not quite. The correct word was: '{quiz_word.capitalize()}'")


def main():
    app = DictionaryApp()

    while True:
        print("\n===== DICTIONARY & VOCABULARY BUILDER =====")
        print("1. Look Up a Word")
        print("2. View Saved Vocabulary")
        print("3. Test Knowledge (Flashcards)")
        print("4. Exit")

        choice = input("Select an option (1-4): ").strip()

        if choice == "1":
            term = input("\nEnter word to look up: ").strip()
            result = app.lookup_word(term)
            if result:
                app.display_entry(result)
        elif choice == "2":
            saved = app.vocab_mgr.get_all_words()
            print(f"\nSaved Words in Vault ({len(saved)}):")
            print(", ".join(w.capitalize() for w in saved) if saved else "No words saved yet.")
        elif choice == "3":
            app.run_flashcards()
        elif choice == "4":
            print("Goodbye! Keep expanding your vocabulary!")
            break
        else:
            print("Invalid option. Please choose between 1 and 4.")


if __name__ == "__main__":
    main()
```

---

## 3. Sample Execution Simulation

```text
===== DICTIONARY & VOCABULARY BUILDER =====
1. Look Up a Word
2. View Saved Vocabulary
3. Test Knowledge (Flashcards)
4. Exit
Select an option (1-4): 1

Enter word to look up: resilient

=======================================================
 WORD: RESILIENT  (/rɪˈzɪl.jənt/)
=======================================================

[ADJECTIVE]
  1. Able to endure tribulation or recover quickly from shock, illness, or other adversity.
     * Example: "The community remained resilient after the flood."
  2. Returning to its original shape after being compressed or stretched.
  * Synonyms: tough, hardy, robust
=======================================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Assuming Every Word Has Phonetics or Audio
Free dictionary APIs often return `None` or empty lists for audio clips and phonetics on rare words. Use `.get()` with safe fallbacks.

### 2. Crashing on Network Latency
Always provide user feedback (e.g. "Fetching definition...") and enforce a 5-second timeout on API calls to prevent the CLI from freezing.

---

---

## 💻 Try It Yourself: Extension Challenge - History Caching

### Challenge
Implement a local caching dictionary in the Dictionary App so that repeatedly searched words are displayed instantly from local memory without making unnecessary network API calls.

### Complete Solution
```python
search_cache = {}

def get_definition_cached(word):
    word = word.lower().strip()
    if word in search_cache:
        print(f"[CACHE HIT] Returning definition for '{word}' from local memory.")
        return search_cache[word]
    
    print(f"[NETWORK CALL] Fetching '{word}' from remote API...")
    # Simulated remote definition
    definition = f"A high-level programming language."
    search_cache[word] = definition
    return definition

print(get_definition_cached("python"))
print(get_definition_cached("python"))  # Instant cache hit!
```

### Expected Output
```text
[NETWORK CALL] Fetching 'python' from remote API...
A high-level programming language.
[CACHE HIT] Returning definition for 'python' from local memory.
A high-level programming language.
```

---

## Practice Quiz

### 1. In this application, how is offline functionality achieved for words previously searched?
A. By downloading the entire Oxford English Dictionary on startup
B. By checking the local `vocabulary.json` cache before making any HTTP request
C. By keeping the computer connected to Bluetooth
D. Offline lookup is not supported
**Answer:** B
**Explanation:** The client checks if the word is already stored in `self.vocab_mgr.vocab` (loaded from `vocabulary.json`); if present, it loads the cached definition without hitting the network.
---

### 2. How does the application identify when a queried word does not exist in the dictionary?
A. The API server returns HTTP status code `404 Not Found`
B. Python throws an `IndexError`
C. The terminal closes
D. The API returns a 500 error
**Answer:** A
**Explanation:** The Free Dictionary API returns an HTTP `404 Not Found` status when a word cannot be found in the English lexicon.
---

### 3. Which method in Python's `json` module saves the vocabulary dictionary to disk?
A. `json.loads()`
B. `json.dump()`
C. `json.write()`
D. `json.export()`
**Answer:** B
**Explanation:** `json.dump(obj, file)` serializes a Python data structure directly into a writable file stream.
---

### 4. Why does `lookup_word()` clean the input using `.strip().lower()`?
A. Because JSON keys cannot store capital letters
B. To ensure case-insensitive consistency and eliminate accidental whitespace in API queries and dictionary lookups
C. To convert strings into numbers
D. It is required by PEP 8
**Answer:** B
**Explanation:** Normalizing user strings with `.strip().lower()` guarantees reliable cache matching and prevents malformed URLs.
---

### 5. What random selection function is used in Flashcard mode to select a random saved word?
A. `random.randint()`
B. `random.choice()`
C. `random.shuffle()`
D. `random.uniform()`
**Answer:** B
**Explanation:** `random.choice(sequence)` picks a single random element from a non-empty sequence.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project 3: CLI-based To-do App** (14: Intermediate Projects).

👉 **[Continue to Next Lesson: Project 3: CLI-based To-do App →](/tutorials/python-for-intermediate/project-3-cli-based-to-do-app)**

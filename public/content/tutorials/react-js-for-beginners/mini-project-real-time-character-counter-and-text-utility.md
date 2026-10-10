# Mini Project: Real-Time Character Counter and Text Utility

## 1. Project Overview & Requirements
In this mini-project, we will engineer a high-utility **Real-Time Character Counter and Text Utility** application. 

This project demonstrates the power of **controlled inputs**, **derived state calculations**, and **clipboard interactions**:
1. **Real-Time Metrics:** Compute total characters, characters excluding whitespace, total words, sentences, and estimated reading time on every keystroke.
2. **Character Limit & Warning:** Set an optional maximum character limit (e.g. 280 characters for Twitter/X) with dynamic progress bar and color threshold warnings.
3. **Text Case Transformations:** Provide instant transformations (UPPERCASE, lowercase, Title Case, and Whitespace Trimming).
4. **Copy to Clipboard:** Allow users to copy the transformed text with instant visual feedback.

```
┌────────────────────────────────────────────────────────┐
│             Real-Time Text Intelligence                │
│                                                        │
│   [ Textarea: Type or paste content here...          ] │
│                                                        │
│   Progress: [████████████░░░░░░░░] 142 / 280 chars     │
│                                                        │
│   [ 24 Words ]  [ 142 Chars ]  [ 1m Read ]  [ 2 Sent ] │
│                                                        │
│   [ UPPERCASE ]  [ lowercase ]  [ Trim ]  [ Copy ]     │
└────────────────────────────────────────────────────────┘
```

## 2. Component Implementation
```jsx
import React, { useState } from 'react';

const MAX_LIMIT = 280;

export default function TextUtility() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Derived metrics (computed on the fly during render!)
  const charCount = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Avg reading speed 200 wpm

  const remainingChars = MAX_LIMIT - charCount;
  const percentUsed = Math.min((charCount / MAX_LIMIT) * 100, 100);

  // Transformations
  const handleUppercase = () => setText(text.toUpperCase());
  const handleLowercase = () => setText(text.toLowerCase());
  const handleTrimSpaces = () => setText(text.replace(/\s+/g, ' ').trim());
  const handleClear = () => setText('');

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="utility-card">
      <h2>Text Analytics & Transformation Studio</h2>

      {/* Controlled Textarea */}
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className={`text-input ${charCount > MAX_LIMIT ? 'input-over-limit' : ''}`}
      />

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div
          className={`progress-fill ${percentUsed >= 100 ? 'bg-danger' : percentUsed >= 80 ? 'bg-warning' : 'bg-primary'}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      <div className="limit-info">
        <span>{charCount} / {MAX_LIMIT} characters</span>
        <span className={remainingChars < 0 ? 'text-danger font-bold' : ''}>
          {remainingChars >= 0 ? `${remainingChars} remaining` : `${Math.abs(remainingChars)} characters over limit`}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-val">{wordCount}</span>
          <span className="metric-lbl">Words</span>
        </div>
        <div className="metric-box">
          <span className="metric-val">{charsNoSpaces}</span>
          <span className="metric-lbl">No Spaces</span>
        </div>
        <div className="metric-box">
          <span className="metric-val">{sentenceCount}</span>
          <span className="metric-lbl">Sentences</span>
        </div>
        <div className="metric-box">
          <span className="metric-val">~{readingTimeMinutes} min</span>
          <span className="metric-lbl">Read Time</span>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="toolbar">
        <button onClick={handleUppercase} disabled={!text}>UPPERCASE</button>
        <button onClick={handleLowercase} disabled={!text}>lowercase</button>
        <button onClick={handleTrimSpaces} disabled={!text}>Trim Spaces</button>
        <button onClick={handleClear} disabled={!text} className="btn-danger">Clear</button>
        <button onClick={handleCopy} disabled={!text} className="btn-copy">
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
}
```

## 3. Key React Lessons Applied
1. **Zero Redundant State:** Notice we did **not** create separate state variables for `wordCount`, `charCount`, or `readingTime`. All of these are calculated derived values computed cleanly during render.
2. **Asynchronous Clipboard API:** Using `navigator.clipboard.writeText(text)` allows native browser copying, followed by a temporary 2-second visual confirmation via `setTimeout`.

---

## Practice Quiz

### Q1: Why were `wordCount`, `charCount`, and `sentenceCount` NOT placed inside separate `useState` variables?
- A) React limits components to a maximum of two `useState` hooks
- B) They can be derived synchronously during render from the single source of truth (`text`), avoiding state synchronization bugs
- C) `useState` cannot store numbers
- D) It prevents the component from being rendered on mobile
**Answer:** B
**Explanation:** When data can be calculated from existing state or props, calculate it during render as derived state rather than creating redundant state variables.

### Q2: How is the progress bar fill width dynamically applied to the element?
- A) Using HTML `<progress-fill>` tags
- B) Through an inline style object: `style={{ width: `${percentUsed}%` }}`
- C) By re-downloading the CSS stylesheet
- D) Using a database query
**Answer:** B
**Explanation:** Passing a dynamic JavaScript style object `style={{ width: `${percentUsed}%` }}` allows the browser to resize the bar in real time on every keystroke.

### Q3: How is the temporary "Copied!" feedback message cleared after 2 seconds?
- A) By closing the browser tab
- B) By calling `setTimeout(() => setCopied(false), 2000)` inside the copy handler
- C) React automatically clears state after 2 seconds
- D) By triggering a full-page reload
**Answer:** B
**Explanation:** Setting a timer with `setTimeout` schedules the state variable `copied` to reset back to `false` after 2,000 milliseconds.

### Q4: What does `text.trim().split(/\s+/).length` achieve when calculating word count?
- A) It removes all vowels
- B) It trims leading/trailing whitespace and splits the string on any sequence of whitespace characters (spaces, tabs, newlines)
- C) It sorts words alphabetically
- D) It translates the text into Hindi
**Answer:** B
**Explanation:** Trimming and splitting on `/\s+/` ensures consecutive spaces or line breaks do not inflate word counts artificially.

### Q5: Why is `disabled={!text}` applied to the transformation buttons?
- A) To make the buttons look darker
- B) To prevent unnecessary operations when the input text is completely empty
- C) Because disabled buttons are mandatory in React
- D) To encrypt the textarea
**Answer:** B
**Explanation:** Disabling action buttons when `text` is empty prevents redundant function executions and provides clear visual feedback to users.

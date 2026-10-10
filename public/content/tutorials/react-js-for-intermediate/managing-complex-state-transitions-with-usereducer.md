# Managing Complex State Transitions with useReducer

## 1. Modeling Finite State Machines
In sophisticated web interfaces (such as audio/video players, multi-step checkout wizards, file uploaders, or quiz engines), components transition through distinct, interdependent states:

```
[Idle] ──> [Uploading] ──> [Processing] ──> [Success]
                │                 │
                └───► [Error] ◄───┘
```
Attempting to model this with multiple boolean variables (`isUploading`, `isProcessing`, `isSuccess`, `isError`) invites invalid, impossible states:
- What if both `isUploading` and `isSuccess` are somehow `true` simultaneously?
- What if `isError` is `true` while `isProcessing` is still running?

Using `useReducer` allows you to model your component as a **Finite State Machine (FSM)**, where only valid, allowable transitions can occur.

## 2. Practical Implementation: Multi-Step Quiz Engine
Let's build a real-world multi-step quiz state machine using `useReducer`:

```jsx
import React, { useReducer } from 'react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which hook provides local component state in React?',
    options: ['useEffect', 'useMemo', 'useState', 'useRef'],
    correctIndex: 2
  },
  {
    id: 2,
    question: 'What is the return type of a React functional component?',
    options: ['JSON String', 'React Element / JSX', 'Promise', 'HTML DOM Node'],
    correctIndex: 1
  }
];

const initialState = {
  status: 'ready', // 'ready' | 'active' | 'finished'
  currentQuestionIndex: 0,
  selectedAnswer: null,
  score: 0,
  secondsRemaining: 60
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        status: 'active'
      };

    case 'SELECT_OPTION': {
      const currentQ = QUIZ_QUESTIONS[state.currentQuestionIndex];
      const isCorrect = action.payload === currentQ.correctIndex;

      return {
        ...state,
        selectedAnswer: action.payload,
        score: isCorrect ? state.score + 10 : state.score
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      const isFinished = nextIndex >= QUIZ_QUESTIONS.length;

      return {
        ...state,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        status: isFinished ? 'finished' : 'active'
      };
    }

    case 'RESTART_QUIZ':
      return initialState;

    default:
      return state;
  }
}

export default function QuizApp() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { status, currentQuestionIndex, selectedAnswer, score } = state;

  if (status === 'ready') {
    return (
      <div className="quiz-card">
        <h2>React Certification Practice Exam</h2>
        <p>Test your knowledge across core React engineering principles.</p>
        <button onClick={() => dispatch({ type: 'START_QUIZ' })} className="btn-primary">
          Start Assessment
        </button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="quiz-card">
        <h2>Assessment Completed!</h2>
        <p className="score-text">Final Score: {score} / {QUIZ_QUESTIONS.length * 10}</p>
        <button onClick={() => dispatch({ type: 'RESTART_QUIZ' })}>
          Retake Quiz
        </button>
      </div>
    );
  }

  const activeQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <div className="quiz-card">
      <header className="quiz-header">
        <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </header>

      <h3>{activeQuestion.question}</h3>

      <div className="options-list">
        {activeQuestion.options.map((option, idx) => (
          <button
            key={option}
            disabled={selectedAnswer !== null}
            className={`option-btn ${selectedAnswer === idx ? 'option-selected' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_OPTION', payload: idx })}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <button
          className="btn-next"
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
        >
          {currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'Finish Quiz' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
```

## 3. Why This Architecture Eliminates Bugs
1. **Impossible States Prevented:** Notice that `status` can only be `'ready'`, `'active'`, or `'finished'`. It is physically impossible to display both the finish screen and an active question simultaneously.
2. **Atomic Transitions:** Scoring and answer selection occur together in a single atomic update (`SELECT_OPTION`).
3. **Pristine Reset:** `RESTART_QUIZ` returns `initialState` cleanly without having to reset 5 separate state variables.

---

## Practice Quiz

### Q1: What is an "impossible state" in React UI engineering?
- A) A state that causes the computer to run out of disk space
- B) A conflicting combination of state variables (such as `isLoading: true` and `isSuccess: true` simultaneously) that should never logically coexist
- C) A state that only occurs on Android
- D) An unhandled TypeScript syntax error
**Answer:** B
**Explanation:** Impossible states occur when multiple independent flags contradict each other, leading to buggy or conflicting UI presentations.

### Q2: How does modeling state with an explicit `status` enum in a reducer eliminate impossible states?
- A) It deletes the component when an error occurs
- B) Since `status` can only hold one string value at any moment (e.g. `'ready' | 'active' | 'finished'`), competing states cannot coexist
- C) It converts React into WebGL
- D) It encrypts user responses
**Answer:** B
**Explanation:** A finite state enum guarantees that the component is in exactly one recognized lifecycle state at any given moment.

### Q3: What action handles progressing to the next question in the `QuizApp` reducer?
- A) `INCREMENT_COUNT`
- B) `NEXT_QUESTION`, which updates the question index and checks if the quiz should transition to `'finished'`
- C) `RELOAD_PAGE`
- D) `UPDATE_SQL`
**Answer:** B
**Explanation:** The `NEXT_QUESTION` action atomically advances the question index and evaluates whether all questions have been answered to set `status = 'finished'`.

### Q4: Why is `disabled={selectedAnswer !== null}` applied to the quiz option buttons?
- A) To prevent users from changing their selection multiple times once an answer is chosen
- B) To make the buttons look grey
- C) HTML buttons require disabled attributes
- D) To turn off screen readers
**Answer:** A
**Explanation:** Disabling options after selection prevents users from firing multiple `SELECT_OPTION` actions and artificially inflating their score.

### Q5: How does `useReducer` simplify resetting a complex component back to its starting state?
- A) By restarting the Vite development server
- B) By dispatching a reset action that returns the `initialState` object in a single clean step
- C) By clearing the browser cache
- D) By reloading the window
**Answer:** B
**Explanation:** Returning the predefined `initialState` object in response to a reset action cleanly restores all fields to their pristine values simultaneously.

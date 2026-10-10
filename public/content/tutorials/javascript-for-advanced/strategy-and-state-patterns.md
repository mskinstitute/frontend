# Strategy & State Patterns in Modern JavaScript

As business logic expands, conditional statements (`if...else if...else` or massive `switch` blocks) become unmaintainable anti-patterns. The **Strategy Pattern** and the **State Pattern** replace conditional branching with polymorphic object delegation.

---

## 1. The Strategy Pattern

The **Strategy Pattern** defines a family of interchangeable algorithms, encapsulates each one into a separate object, and makes them swappable at runtime.

### The Problem: Massive Conditional Branching
```javascript
// ANTI-PATTERN: Hard to maintain, violates Open/Closed Principle
function calculateShipping(order, carrier) {
  if (carrier === 'fedex') return order.weight * 1.5 + 5;
  if (carrier === 'ups') return order.weight * 1.8 + 2;
  if (carrier === 'dhl') return order.weight * 2.2 + 8;
  // Adding new carrier requires editing this function!
}
```

### The Strategy Solution:
```javascript
// Strategy 1: FedEx
const fedexStrategy = {
  calculate: (weight) => weight * 1.5 + 5
};

// Strategy 2: UPS
const upsStrategy = {
  calculate: (weight) => weight * 1.8 + 2
};

// Strategy 3: DHL Express
const dhlStrategy = {
  calculate: (weight) => weight * 2.2 + 8
};

// Context Object
class ShippingCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculateCost(order) {
    return this.strategy.calculate(order.weight);
  }
}

// Swapping strategies dynamically at runtime:
const shipping = new ShippingCalculator(fedexStrategy);
console.log('FedEx Cost:', shipping.calculateCost({ weight: 10 })); // $20

shipping.setStrategy(dhlStrategy);
console.log('DHL Cost:', shipping.calculateCost({ weight: 10 }));   // $30
```

---

## 2. The State Pattern

The **State Pattern** allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

### Media Player State Machine Example:
```
           ┌──────────────┐
     ┌────►│ PausedState  │◄────┐
Play │     └──────┬───────┘     │ Pause
     │            │ Play        │
┌────┴──────┐     ▼       ┌─────┴─────┐
│StoppedState│            │PlayingState│
└───────────┘             └───────────┘
```

```javascript
class PlayingState {
  constructor(player) { this.player = player; }
  play() { console.log('Already playing audio.'); }
  pause() {
    console.log('Pausing audio playback.');
    this.player.setState(this.player.pausedState);
  }
}

class PausedState {
  constructor(player) { this.player = player; }
  play() {
    console.log('Resuming audio playback.');
    this.player.setState(this.player.playingState);
  }
  pause() { console.log('Already paused.'); }
}

class AudioPlayer {
  constructor() {
    this.playingState = new PlayingState(this);
    this.pausedState = new PausedState(this);
    // Initial state: Paused
    this.currentState = this.pausedState;
  }

  setState(state) {
    this.currentState = state;
  }

  play() { this.currentState.play(); }
  pause() { this.currentState.pause(); }
}

const player = new AudioPlayer();
player.play();  // "Resuming audio playback."
player.play();  // "Already playing audio."
player.pause(); // "Pausing audio playback."
```

---

## 3. Key Difference Between Strategy & State

| Dimension | Strategy Pattern | State Pattern |
| :--- | :--- | :--- |
| **Intent** | Change **how** an operation is accomplished (algorithm swapping) | Change **what** the object does based on internal lifecycle state |
| **Awareness** | Strategies are generally unaware of each other | State objects frequently trigger transitions to neighboring states |
| **Client Control** | Client chooses and injects the strategy | Transitions occur internally as actions execute |

---

## Practice Quiz

### Q1: What software engineering principle is best satisfied by the Strategy Pattern?
- A) The Open/Closed Principle (Open for extension, closed for modification)
- B) The Single Thread Principle
- C) The Strict Mode Rule
- D) The CSS Cascade Principle
**Answer:** A
**Explanation:** The Strategy pattern honors the Open/Closed Principle: you can add new strategies without modifying existing context or algorithm classes.

### Q2: What is the primary characteristic of the State Pattern?
- A) It stores state in localStorage
- B) An object's behavior changes dynamically when its internal state changes by delegating actions to state objects
- C) It compiles state into binary buffers
- D) It prevents state mutation
**Answer:** B
**Explanation:** In the State pattern, the context object delegates behavior to its current state object; transitioning states swaps behavior transparently.

### Q3: How does the Strategy pattern eliminate massive if/else chains?
- A) By compressing code into minified bundles
- B) By encapsulating each branch's algorithm into a separate strategy object implementing a common interface
- C) By converting code to switch statements
- D) By running calculations in Web Workers
**Answer:** B
**Explanation:** Rather than checking conditions across dozens of `if/else` lines, the context delegates execution to the currently active strategy object.

### Q4: In the State pattern, who typically manages transitions between states?
- A) The database
- B) Either the context or the concrete state objects themselves when specific actions occur
- C) The browser window manager
- D) The HTML parser
**Answer:** B
**Explanation:** State objects themselves (or the central context) evaluate conditions and update `context.setState(nextState)` to progress the state machine.

### Q5: Can the active strategy in a context object be changed at runtime?
- A) No, strategies are immutable once set
- B) Yes, by providing a setter method (e.g. setStrategy()) on the context
- C) Only in Node.js
- D) Only before the page finishes loading
**Answer:** B
**Explanation:** A defining feature of the Strategy pattern is runtime configurability: calling `context.setStrategy(newStrategy)` swaps algorithms on the fly.

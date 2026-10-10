# Observer & Pub/Sub Pattern in Modern JavaScript

Event-driven programming is central to modern JavaScript architecture. The **Observer Pattern** and the **Publish-Subscribe (Pub/Sub) Pattern** allow objects to notify other parts of an application about state changes without tight coupling. While often confused, they have distinct architectural topologies.

---

## 1. Observer vs. Pub/Sub: The Key Difference

```
Observer Pattern (Direct Coupling):
  [ Subject (Observable) ] ──Direct Reference──► [ Observer 1 ]
                           ──Direct Reference──► [ Observer 2 ]

Pub/Sub Pattern (Decoupled via Message Broker / Event Bus):
  [ Publisher ] ──► [ Event Bus / Broker ] ──► [ Subscriber A ]
                                           ──► [ Subscriber B ]
```

- **Observer Pattern:** The Subject maintains a direct internal list of Observers and invokes their update methods directly.
- **Pub/Sub Pattern:** Publishers and Subscribers **never know each other exist**; they communicate exclusively through an intermediate **Event Bus / Message Channel**.

---

## 2. Implementing the Observer Pattern

```javascript
// The Subject (Observable)
class StockTicker {
  constructor(symbol) {
    this.symbol = symbol;
    this.price = 0;
    this.observers = [];
  }

  // Register observer
  subscribe(observer) {
    this.observers.push(observer);
  }

  // Unregister observer
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Notify all observers
  notify() {
    this.observers.forEach(obs => obs.update(this.symbol, this.price));
  }

  updatePrice(newPrice) {
    this.price = newPrice;
    this.notify();
  }
}

// Observers
class MobileAlertObserver {
  update(symbol, price) {
    console.log(`[Mobile Push]: ${symbol} moved to $${price}`);
  }
}

class TradingBotObserver {
  update(symbol, price) {
    if (price < 150) console.log(`[Trading Bot]: BUY order placed for ${symbol}!`);
  }
}

const appleStock = new StockTicker('AAPL');
const mobileUser = new MobileAlertObserver();
const bot = new TradingBotObserver();

appleStock.subscribe(mobileUser);
appleStock.subscribe(bot);

appleStock.updatePrice(145);
// Logs both: Mobile Push and Trading Bot BUY order!
```

---

## 3. Implementing a Production-Grade Pub/Sub EventBus

```javascript
class EventBus {
  constructor() {
    this.events = new Map();
  }

  // Subscribe to an event topic
  on(topic, handler) {
    if (!this.events.has(topic)) {
      this.events.set(topic, new Set());
    }
    this.events.get(topic).add(handler);

    // Return an unsubscribe function
    return () => this.off(topic, handler);
  }

  // Unsubscribe
  off(topic, handler) {
    if (this.events.has(topic)) {
      this.events.get(topic).delete(handler);
    }
  }

  // Publish event payload to topic
  emit(topic, payload) {
    if (this.events.has(topic)) {
      this.events.get(topic).forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event listener for "${topic}":`, error);
        }
      });
    }
  }

  // Subscribe to fire once only
  once(topic, handler) {
    const unsub = this.on(topic, (data) => {
      unsub();
      handler(data);
    });
  }
}

// Global Singleton Event Bus instance
export const eventBus = new EventBus();
```

### Clean Decoupled Usage:
```javascript
// In CartComponent.js:
eventBus.emit('cart:updated', { itemCount: 3, total: 95.00 });

// In NavbarBadge.js (Doesn't care who emitted it!):
eventBus.on('cart:updated', (data) => {
  badgeElement.textContent = data.itemCount;
});
```

---

## Practice Quiz

### Q1: What is the primary architectural difference between the Observer and Pub/Sub patterns?
- A) Observer works only on mobile devices
- B) In the Observer pattern, the Subject holds direct references to observers; in Pub/Sub, publishers and subscribers are decoupled via an intermediary Event Bus
- C) Pub/Sub is synchronous, Observer is asynchronous
- D) There is no difference
**Answer:** B
**Explanation:** The Observer pattern couples subjects and observers directly, whereas Pub/Sub introduces a central Event Bus broker, fully decoupling publishers from subscribers.

### Q2: Why does an EventBus on() method typically return an unsubscribe function?
- A) To make memory allocation faster
- B) To provide an ergonomic, self-contained way for consumers to unregister their listener without retaining function references
- C) To cancel network requests
- D) To prevent DOM rendering
**Answer:** B
**Explanation:** Returning `() => this.off(topic, handler)` allows components to clean up their listeners easily (e.g. on unmount) without manually tracking function references.

### Q3: What collection type is ideal for storing listeners per event topic to avoid duplicate registrations?
- A) Array
- B) Set
- C) WeakMap
- D) String
**Answer:** B
**Explanation:** A `Set` stores only unique values, preventing the exact same listener function from being registered multiple times.

### Q4: What does eventBus.once(topic, handler) do?
- A) Fires the handler once immediately, then never again
- B) Listens for the specified event topic and automatically unsubscribes after the handler executes the first time
- C) Restricts the event bus to one topic
- D) Throws an error after 1 second
**Answer:** B
**Explanation:** `.once()` registers a wrapper handler that automatically calls unsubscribe the moment the event is triggered for the first time.

### Q5: What is a potential hazard of using global Pub/Sub Event Buses in large Single Page Applications?
- A) Slow network speed
- B) Memory leaks caused by components subscribing to the global bus without unsubscribing when destroyed
- C) CSS style conflicts
- D) LocalStorage quota exhaustion
**Answer:** B
**Explanation:** If components subscribe to a global event bus and are unmounted without unregistering, the event bus retains references to their closures, causing memory leaks.

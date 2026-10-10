# EventEmitter Pattern & Custom Event Architecture

Node.js is fundamentally an event-driven platform. Much of the Node.js core API (including HTTP servers, streams, and file system watchers) is built around the **EventEmitter** class located in the built-in `node:events` module.

---

## 1. What is an EventEmitter?

An `EventEmitter` implements the **Observer Design Pattern**. Objects (called *emitters*) emit named events that cause previously registered functions (*listeners*) to be called synchronously.

```javascript
import { EventEmitter } from 'node:events';

// Instantiate emitter
const userEmitter = new EventEmitter();

// Register listener for 'userRegistered' event
userEmitter.on('userRegistered', (user) => {
  console.log(`[Email Service] Welcome email sent to: ${user.email}`);
});

// Register another independent listener for the SAME event
userEmitter.on('userRegistered', (user) => {
  console.log(`[Analytics Service] Logged user registration event for ID: ${user.id}`);
});

// Trigger / Emit the event with payload
userEmitter.emit('userRegistered', { id: 'usr_991', email: 'alex@example.com' });
```

---

## 2. Key Methods of EventEmitter

| Method | Description |
| :--- | :--- |
| `emitter.on(eventName, listener)` | Registers a persistent listener that triggers every time the event fires |
| `emitter.once(eventName, listener)` | Registers a one-time listener that automatically removes itself after its first execution |
| `emitter.emit(eventName, ...args)` | Synchronously calls each listener registered for the event with passed arguments |
| `emitter.removeListener(event, fn)` | Unbinds a specific callback from an event |
| `emitter.setMaxListeners(n)` | Increases warning threshold for listener count (default is 10 to prevent memory leaks) |

---

## 3. Real-World Architecture: Custom Domain Emitters

In scalable enterprise architectures, custom services inherit from `EventEmitter` to decouple complex domain processes:

```javascript
import { EventEmitter } from 'node:events';

class PaymentGateway extends EventEmitter {
  async processPayment(transactionId, amount) {
    this.emit('paymentStarted', { transactionId, amount });

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.emit('paymentSuccess', {
        transactionId,
        amount,
        settledAt: new Date()
      });
    } catch (err) {
      this.emit('paymentFailed', { transactionId, error: err.message });
    }
  }
}

// Consuming the decoupled domain service
const payments = new PaymentGateway();

payments.on('paymentSuccess', (data) => {
  console.log('Generating PDF receipt for transaction:', data.transactionId);
});

payments.on('paymentFailed', (data) => {
  console.warn('Alerting risk operations team:', data.error);
});

payments.processPayment('tx_88319', 499.00);
```

---

# Multiple Choice Questions

### 1. Which core design pattern is implemented by the Node.js `EventEmitter` class?
A. Singleton Pattern
B. Observer (Publish-Subscribe) Pattern
C. Factory Pattern
D. Decorator Pattern
**Answer:** B
**Explanation:** `EventEmitter` implements the Observer pattern, where objects emit events and subscribed observers (listeners) receive notifications.
---

### 2. What happens if you register an event listener using `emitter.once()` instead of `emitter.on()`?
A. The listener is called once every second continuously.
B. The listener is invoked the first time the event is emitted, then automatically unregistered.
C. The listener is rejected if another listener exists.
D. The listener executes in a separate Web Worker.
**Answer:** B
**Explanation:** `emitter.once()` adds a one-time listener that executes only on the initial trigger and immediately detaches itself.
---

### 3. What is the default maximum number of listeners allowed on an EventEmitter instance before Node.js prints a memory leak warning?
A. 2
B. 5
C. 10
D. 100
**Answer:** C
**Explanation:** By default, if more than 10 listeners are added for a single event, Node.js outputs a warning to help developers catch memory leaks.
---

### 4. How are listeners executed when `emitter.emit('eventName')` is invoked?
A. Synchronously in the order in which they were registered.
B. Asynchronously inside child processes.
C. In random order on the GPU.
D. Only after the Node.js server reboots.
**Answer:** A
**Explanation:** When an event is emitted, Node.js invokes all registered listeners synchronously in the exact sequence they were registered.
---

### 5. What happens if an `error` event is emitted on an EventEmitter and no listener is registered for `'error'`?
A. The error is silently ignored and discarded.
B. Node.js throws an unhandled exception, prints the stack trace, and crashes the process.
C. The error is logged to a hidden file on the root filesystem.
D. Node.js converts the error into an HTTP 200 response.
**Answer:** B
**Explanation:** In Node.js, an unhandled `'error'` event is treated as a special fatal condition; if no listener is registered, it terminates the process.
---

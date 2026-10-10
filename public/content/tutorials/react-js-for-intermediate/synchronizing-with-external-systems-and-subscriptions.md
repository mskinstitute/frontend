# Synchronizing with External Systems and Subscriptions

## 1. What is Synchronization in React?
The fundamental mental model of `useEffect` is **synchronization**. 

An effect's job is not simply to run code on "mount" or "unmount"; its true responsibility is to **synchronize the React component with an external non-React system**:
- A browser WebSocket connection
- A browser Geolocation or Online/Offline network watcher
- A third-party non-React widget (e.g., a Leaflet map, a Chart.js canvas, or a Stripe payment element)
- The native browser DOM (e.g. modal focus trapping)

```
[React State / Props] ◄══════ Synchronize ══════► [External Non-React System]
                                                        (WebSocket / Canvas / Browser API)
```

## 2. Example: Synchronizing with Browser Online Status
Web applications often need to warn users when their internet connection drops. The browser emits native `online` and `offline` events on the `window` object:

```jsx
import React, { useState, useEffect } from 'react';

export default function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Synchronize: subscribe to browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Teardown: unsubscribe when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Synchronize on mount, clean up on unmount

  return (
    <div className={`status-banner ${isOnline ? 'online' : 'offline'}`}>
      <span className="dot" />
      {isOnline ? 'Connected to MSK Network' : 'Offline — Changes will sync when reconnected'}
    </div>
  );
}
```

## 3. Example: Synchronizing with a Real-Time WebSocket Channel
When connecting to a live messaging or financial stock channel:

```jsx
import React, { useState, useEffect } from 'react';

export default function StockTicker({ symbol }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    // 1. Establish connection to external WebSocket service
    const socket = new WebSocket(`wss://stocks.example.com/live/${symbol}`);

    socket.onopen = () => {
      console.log(`Subscribed to live ticker: ${symbol}`);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data.currentPrice);
    };

    socket.onerror = (err) => {
      console.error('Socket error:', err);
    };

    // 2. Teardown: Close the socket when 'symbol' changes or component unmounts!
    return () => {
      console.log(`Unsubscribing from: ${symbol}`);
      socket.close();
    };
  }, [symbol]); // Re-synchronize whenever the stock symbol changes

  return (
    <div className="ticker-card">
      <h4>{symbol}</h4>
      <p className="price-display">
        {price !== null ? `$${price.toFixed(2)}` : 'Connecting...'}
      </p>
    </div>
  );
}
```
If the user switches from `AAPL` to `GOOGL`:
1. React calls `socket.close()` on the `AAPL` socket.
2. React opens a brand new WebSocket for `GOOGL`.

## 4. The Mental Model: Start and Stop
Every effect synchronizing with an external system should have symmetric **Start** and **Stop** logic:
- `addEventListener` $\leftrightarrow$ `removeEventListener`
- `socket.connect()` $\leftrightarrow$ `socket.close()`
- `observer.observe()` $\leftrightarrow$ `observer.disconnect()`
- `timer = setTimeout()` $\leftrightarrow$ `clearTimeout(timer)`

---

## Practice Quiz

### Q1: What is the primary mental model of `useEffect` in modern React architecture?
- A) A replacement for HTML `<head>` tags
- B) Synchronizing the component's state and props with an external non-React system
- C) An automated testing bot
- D) A server-side database schema generator
**Answer:** B
**Explanation:** `useEffect` is designed to synchronize the component with external systems (such as browser APIs, WebSockets, or third-party libraries) across renders and lifecycle changes.

### Q2: Why must `socket.close()` be invoked in the return cleanup function of a WebSocket effect?
- A) To turn off the user's monitor
- B) To terminate the open network socket so duplicate connections and memory leaks do not accumulate when props change or the component unmounts
- C) WebSockets can only stay open for 5 seconds in Chrome
- D) To delete the component's state
**Answer:** B
**Explanation:** Failing to close sockets leaves dangling background connections that continue consuming bandwidth, leaking memory, and attempting to deliver messages to unmounted components.

### Q3: What happens when the `symbol` prop changes in the `StockTicker` component?
- A) React reboots the operating system
- B) React executes the cleanup function for the previous symbol (closing the old socket) and then runs the effect for the new symbol (opening a new socket)
- C) The component ignores the prop change
- D) Both sockets stay open simultaneously
**Answer:** B
**Explanation:** React cleans up the previous effect run before initiating the next effect run, ensuring seamless and safe re-synchronization with external systems.

### Q4: Which pair of methods represents a correct symmetric setup and teardown for a native browser event?
- A) `window.addEventListener('resize', fn)` and `window.removeEventListener('resize', fn)`
- B) `document.write()` and `document.clear()`
- C) `console.log()` and `console.clear()`
- D) `localStorage.setItem()` and `sessionStorage.clear()`
**Answer:** A
**Explanation:** Attaching an event listener during effect setup must be paired symmetrically with `removeEventListener` using the exact same function reference in the cleanup return.

### Q5: If a component only needs to read `navigator.onLine` on initial mount and listens for changes until unmounted, what should its dependency array be?
- A) `[navigator.onLine]`
- B) `[]` (empty array)
- C) Omitted entirely
- D) `[window]`
**Answer:** B
**Explanation:** Since the event listeners on `window` handle updates over time, subscribing once on mount and unsubscribing on unmount is correctly modeled with an empty dependency array `[]`.

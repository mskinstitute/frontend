# Debugging Asynchronous Race Conditions

## 1. Reproducing Race Conditions Under Controlled Latency
Asynchronous race conditions are notorious for being intermittent: they appear on slow 3G mobile networks but vanish when developers test on high-speed localhost servers.

To reliably reproduce, diagnose, and verify race conditions:
1. Open Chrome DevTools -> **Network** tab.
2. Change the Throttling dropdown from "No throttling" to **"Slow 3G"** or **"Fast 3G"**.
3. Rapidly interact with your search or tab switching controls.

```
Under 3G Throttling:
Query 1: "Rea"    ──► Sent (Delayed by 2000ms)
Query 2: "React"  ──► Sent (Resolves in 800ms)
Result: Query 1 arrives last and overwrites Query 2 with stale results!
```

## 2. Diagnostic Logging with Request IDs
A powerful debugging technique assigns an incrementing transaction ID to every outgoing request and logs the sequence:

```jsx
import React, { useState, useEffect, useRef } from 'react';

export default function DebuggableSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    // Increment request ID for each effect execution
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;

    console.log(`[REQ #${currentRequestId}] Dispatched for query: "${query}"`);

    async function executeSearch() {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();

      console.log(`[REQ #${currentRequestId}] Resolved with ${data.length} items`);

      // Check if this request is STILL the latest request!
      if (currentRequestId === requestIdRef.current) {
        console.log(`[REQ #${currentRequestId}] ACCEPTED: Updating UI state!`);
        setResults(data);
      } else {
        console.warn(
          `[REQ #${currentRequestId}] DISCARDED: A newer request (#${requestIdRef.current}) is already pending!`
        );
      }
    }

    executeSearch();
  }, [query]);

  return <div>{/* Search UI */}</div>;
}
```

## 3. The 3 Architectural Fixes Compared

| Technique | Bandwidth Saved? | Implementation Complexity | Best For |
| :--- | :--- | :--- | :--- |
| **Boolean Flag (`isCurrent`)** | No (Response arrives, then discarded) | Minimal (3 lines of cleanup code) | Quick fixes in small components |
| **`AbortController`** | **Yes** (HTTP request killed over wire) | Low (Pass signal to `fetch`) | Standard REST API queries |
| **TanStack Query** | **Yes** (Auto-manages query cancellation) | Zero manual code! | Enterprise production applications |

---

## Practice Quiz

### Q1: How can an engineer reliably reproduce an asynchronous race condition during local development?
- A) By restarting the computer
- B) By simulating network latency using DevTools Network Throttling (e.g. "Slow 3G") and rapidly triggering requests
- C) By turning off monitor brightness
- D) By typing in all caps
**Answer:** B
**Explanation:** Simulating slow network latency exaggerates timing discrepancies between fast and slow responses, exposing race conditions reliably.

### Q2: In the Request ID tracking pattern, how does the component detect that a resolving response is stale?
- A) It checks the current time in London
- B) It compares the local captured `currentRequestId` against the latest `requestIdRef.current`; if they do not match, a newer request was dispatched and the older one is discarded
- C) It reads the user's IP address
- D) It checks `window.isStale`
**Answer:** B
**Explanation:** If `currentRequestId !== requestIdRef.current`, the response belongs to an earlier search query and must be discarded.

### Q3: What happens over the network wire when `AbortController.abort()` is called on an in-flight request?
- A) The computer deletes the browser cache
- B) The browser networking layer physically terminates the active TCP/HTTP connection, saving client and server resources
- C) The server returns HTTP 200 OK
- D) The page refreshes
**Answer:** B
**Explanation:** Aborting signals the browser networking stack to drop the active HTTP stream, halting incoming data transfer.

### Q4: When using TanStack Query, how are race conditions handled?
- A) You must manually write `AbortController` code for every query
- B) TanStack Query handles request cancellation and out-of-order resolution automatically under the hood
- C) TanStack Query only permits one request per minute
- D) It converts requests into WebSockets
**Answer:** B
**Explanation:** TanStack Query provides built-in query cancellation and cache tracking, automatically discarding responses from outdated queries.

### Q5: What error name is thrown when a `fetch` request is aborted via `AbortController`?
- A) `'SyntaxError'`
- B) `'AbortError'`
- C) `'NetworkTimeout'`
- D) `'SecurityError'`
**Answer:** B
**Explanation:** When aborted, standard `window.fetch` rejects with an error whose `name` property is `'AbortError'`, allowing you to distinguish cancellations from genuine network failures.

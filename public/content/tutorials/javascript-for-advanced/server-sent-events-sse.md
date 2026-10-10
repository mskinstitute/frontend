# Server-Sent Events (SSE) in Modern JavaScript

While WebSockets excel at bidirectional communication, many real-world applications only need **unidirectional updates from the server to the client**—such as real-time stock quotes, AI streaming text responses (like ChatGPT / LLMs), live sports scores, and social notifications. **Server-Sent Events (SSE)** provide a lightweight, HTTP-based streaming protocol with built-in reconnection.

---

## 1. SSE vs. WebSockets

| Feature | Server-Sent Events (SSE) | WebSockets |
| :--- | :--- | :--- |
| **Direction** | **Unidirectional** (Server -> Client only) | **Bidirectional** (Full Duplex) |
| **Protocol** | Standard **HTTP / HTTPS** | Custom **WS / WSS** protocol |
| **HTTP/2 Multiplexing** | Fully supported out of the box | Requires separate TCP connection |
| **Automatic Reconnection**| **Built-in natively** by the browser | Must be coded manually |
| **Firewall / Proxy Friendly**| Passes standard HTTP proxies easily | Sometimes blocked by corporate proxies |
| **Data Format** | UTF-8 text streams (often JSON) | Text and Binary (`Blob`, `ArrayBuffer`) |

---

## 2. The EventSource Client API

Consuming an SSE stream in JavaScript requires just a few lines using the native **`EventSource`** API:

```javascript
// Connect to SSE stream endpoint over standard HTTPS
const eventSource = new EventSource('/api/v1/live-feed');

// 1. Connection Opened
eventSource.onopen = () => {
  console.log('[SSE] Streaming connection established.');
};

// 2. Default Message Handler
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('[SSE] Default update received:', data);
};

// 3. Named Custom Events (Dispatched by server 'event: update_stock')
eventSource.addEventListener('stock_tick', (event) => {
  const stock = JSON.parse(event.data);
  console.log(`Stock ${stock.ticker} updated: $${stock.price}`);
});

// 4. Error Handling (Browser auto-reconnects automatically!)
eventSource.onerror = (err) => {
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('[SSE] Connection closed by server.');
  } else {
    console.warn('[SSE] Connection interrupted. Browser will auto-reconnect.');
  }
};

// Close connection manually:
// eventSource.close();
```

---

## 3. Server-Side Protocol Format

SSE operates over standard HTTP with headers:
- `Content-Type: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

### The Raw Wire Format:
```http
event: stock_tick
id: 10492
data: {"ticker": "NVDA", "price": 138.50}

event: stock_tick
id: 10493
data: {"ticker": "AAPL", "price": 225.10}

```

- **`data:`** The payload string. Multiple lines are joined with newlines.
- **`id:`** The message sequence ID. If connection drops, the browser sends `Last-Event-ID: 10493` upon reconnecting so the server can resume missed messages!
- **`event:`** The event type for `addEventListener()`.
- **Double Newline `\n\n`:** Delimits the end of each message frame.

---

## 4. Consuming POST Streams with Fetch (AI LLM Streaming)

Standard `EventSource` only supports `GET` requests without custom authorization headers. For AI chat completions (POST requests sending message history), stream using the Fetch API with `ReadableStream`:

```javascript
async function streamAiResponse(prompt) {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({ prompt })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    // Append incoming token text to UI in real-time!
    processStreamingChunk(chunk);
  }
}
```

---

## Practice Quiz

### Q1: What is the primary communication direction supported by Server-Sent Events (SSE)?
- A) Client to Server only
- B) Server to Client only (Unidirectional)
- C) Full duplex bidirectional
- D) Peer to Peer
**Answer:** B
**Explanation:** SSE is strictly unidirectional: the server streams updates down to the client over an open HTTP connection.

### Q2: What browser API is used natively to consume Server-Sent Events?
- A) WebSocket
- B) EventSource
- C) SocketIO
- D) StreamSocket
**Answer:** B
**Explanation:** `EventSource` is the W3C standard browser API designed specifically to connect to and parse `text/event-stream` endpoints.

### Q3: What happens if an SSE connection is dropped due to temporary network failure?
- A) The application crashes
- B) The browser automatically attempts to reconnect and sends the Last-Event-ID header to resume missed events
- C) The user is redirected to the login page
- D) A fatal TypeError is thrown
**Answer:** B
**Explanation:** `EventSource` features automatic reconnection built into the browser engine, transmitting `Last-Event-ID` so the server can backfill missed events.

### Q4: What HTTP Content-Type header must the server send for Server-Sent Events?
- A) application/json
- B) text/event-stream
- C) multipart/form-data
- D) application/octet-stream
**Answer:** B
**Explanation:** The SSE specification requires the server response header `Content-Type: text/event-stream`.

### Q5: When is Server-Sent Events preferred over WebSockets?
- A) For multiplayer FPS gaming
- B) When data flow is strictly server-to-client (e.g. LLM streaming, notifications, live scores) and you want native HTTP/2 multiplexing and built-in reconnects
- C) When binary ArrayBuffers must be sent from the client
- D) When offline
**Answer:** B
**Explanation:** SSE is simpler, runs over standard HTTP, benefits from HTTP/2 multiplexing, and includes automatic reconnects, making it ideal for unidirectional feeds.

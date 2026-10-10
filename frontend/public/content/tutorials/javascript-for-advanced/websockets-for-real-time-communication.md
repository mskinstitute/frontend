# WebSockets for Real-Time Communication in Modern JavaScript

Traditional HTTP follows a unidirectional request-response paradigm: the client asks, the server answers, and the connection closes. For real-time applications (chat apps, collaborative whiteboards, live trading dashboards, multiplayer gaming), polling the server with HTTP requests wastes bandwidth. **WebSockets** provide a persistent, full-duplex, bidirectional communication channel over a single TCP connection.

---

## 1. HTTP Polling vs. WebSockets

```
HTTP Polling (Inefficient):
  Client ──► GET /status ──► Server (200 OK)
  Client ──► GET /status ──► Server (304 Not Modified)
  Client ──► GET /status ──► Server (304 Not Modified) (High overhead: headers sent every second!)

WebSocket (Persistent Full-Duplex):
  Client ──► HTTP Upgrade Handshake ──► Server
  ══════════════════════════════════════════════════
  Client ◄──────── Bidirectional TCP ────────► Server
  (Zero HTTP headers! Raw message frames with ~2 bytes framing overhead!)
```

---

## 2. The WebSocket Connection Lifecycle

```javascript
// Step 1: Establish connection (ws:// for unencrypted, wss:// for TLS encrypted)
const socket = new WebSocket('wss://echo.websocket.org');

// Step 2: Connection Opened
socket.addEventListener('open', (event) => {
  console.log('[WebSocket] Connection established!');
  // Send data (strings or binary Blobs / ArrayBuffers)
  socket.send(JSON.stringify({ type: 'LOGIN', userId: 'USR-101' }));
});

// Step 3: Listen for incoming messages from server
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log('[WebSocket] Message received from server:', message);
});

// Step 4: Handle errors
socket.addEventListener('error', (err) => {
  console.error('[WebSocket] Socket encountered error:', err);
});

// Step 5: Connection closed
socket.addEventListener('close', (event) => {
  console.log(`[WebSocket] Closed: code=${event.code}, reason=${event.reason}`);
});
```

---

## 3. Production Resilient WebSocket Client (Heartbeats & Auto-Reconnect)

Real-world mobile networks drop connections frequently. A production WebSocket wrapper implements **exponential backoff reconnection** and **heartbeat ping/pongs**:

```javascript
class ResilientWebSocket {
  constructor(url) {
    this.url = url;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 30000;
    this.heartbeatTimer = null;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected. Resetting backoff.');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (e) => {
      if (e.data === '__PONG__') return; // Heartbeat response
      console.log('Received payload:', e.data);
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.reconnect();
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('__PING__');
      }
    }, 15000);
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
  }

  reconnect() {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
    console.log(`Connection lost. Reconnecting in ${delay}ms...`);
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }
}
```

---

## 4. Binary Data Over WebSockets

WebSockets can transmit binary data (`Blob` or `ArrayBuffer`) without base64 overhead:

```javascript
socket.binaryType = 'arraybuffer'; // Or 'blob'

socket.addEventListener('message', (e) => {
  if (e.data instanceof ArrayBuffer) {
    const view = new DataView(e.data);
    console.log('Binary frame byte length:', view.byteLength);
  }
});
```

---

## Practice Quiz

### Q1: What protocol scheme is used for secure, TLS-encrypted WebSocket connections?
- A) ws://
- B) wss://
- C) https://
- D) rfc://
**Answer:** B
**Explanation:** Secure WebSockets utilize the `wss://` protocol scheme (WebSocket Secure), providing end-to-end TLS encryption equivalent to HTTPS.

### Q2: What is the primary performance advantage of WebSockets over HTTP long-polling?
- A) WebSockets do not use TCP
- B) After the initial HTTP handshake, data frames are exchanged bidirectionally with only a few bytes of framing overhead, eliminating repeated HTTP headers
- C) WebSockets execute in WebAssembly
- D) WebSockets bypass firewalls
**Answer:** B
**Explanation:** WebSockets maintain a persistent, bidirectional TCP connection where data frames have minimal overhead (~2–10 bytes) compared to repeating hundreds of bytes of HTTP headers on every request.

### Q3: What property indicates whether a WebSocket is currently open and ready to transmit data?
- A) socket.isOpen
- B) socket.readyState === WebSocket.OPEN (value 1)
- C) socket.connected === true
- D) socket.status === 200
**Answer:** B
**Explanation:** `socket.readyState` reports the connection lifecycle state: `0` (CONNECTING), `1` (OPEN), `2` (CLOSING), and `3` (CLOSED).

### Q4: Why is an exponential backoff strategy essential for WebSocket reconnection logic?
- A) To encrypt packets
- B) To avoid overwhelming a recovering backend server with thousands of simultaneous reconnection requests (thundering herd problem)
- C) It is required by W3C specification
- D) To refresh SSL certificates
**Answer:** B
**Explanation:** Exponential backoff spaces out reconnection attempts progressively (e.g. 1s, 2s, 4s, 8s), preventing clients from crashing a restarting server with a flood of concurrent reconnection requests.

### Q5: What binary data types can be sent directly over a WebSocket without string serialization?
- A) CSSStyleSheet
- B) Blob and ArrayBuffer
- C) DOMNode
- D) HTMLCollection
**Answer:** B
**Explanation:** The WebSocket API natively supports sending and receiving raw binary `Blob` and `ArrayBuffer` payloads.

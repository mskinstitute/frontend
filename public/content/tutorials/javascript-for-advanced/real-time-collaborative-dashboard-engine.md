# Capstone Part 2: Real-Time Collaborative Dashboard Engine

Real-time collaboration (seen in Figma, Google Docs, and Miro) requires syncing state across multiple remote clients simultaneously over WebSockets. In this capstone lesson, you will build a **Real-Time Collaborative Dashboard Engine** featuring presence tracking, remote cursor coordinates, and conflict-free action synchronization.

---

## 1. System Architecture

```
  Client A (Browser)                  WebSocket Server                   Client B (Browser)
  [ Local State Store ]               (Message Broker)                   [ Local State Store ]
           │                                 │                                    │
           │  1. Dispatches local action     │                                    │
           ├────────────────────────────────►│                                    │
           │     { type: 'CURSOR_MOVE' }     │                                    │
           │                                 │  2. Broadcasts to all peers        │
           │                                 ├───────────────────────────────────►│
           │                                 │     { type: 'REMOTE_CURSOR' }      │
           │                                 │                                    ▼
           │                                 │                       Updates Client B UI!
```

---

## 2. Building the Collaborative Engine Client

```javascript
class CollaborativeEngine {
  constructor(wsUrl, store) {
    this.wsUrl = wsUrl;
    this.store = store;
    this.socket = null;
    this.clientId = 'client_' + crypto.randomUUID().slice(0, 8);
    this.remotePresences = new Map();

    this.connect();
    this.initMouseTracking();
  }

  connect() {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      console.log(`[Collab] Connected as ${this.clientId}`);
      // Broadcast join presence
      this.broadcast({
        type: 'PEER_JOIN',
        clientId: this.clientId,
        color: this.getRandomColor()
      });
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Ignore self-broadcasts
      if (message.clientId === this.clientId) return;

      this.handleRemoteMessage(message);
    };
  }

  initMouseTracking() {
    // Throttle cursor broadcasts to 50ms (20fps) to conserve network
    let lastSent = 0;

    window.addEventListener('pointermove', (e) => {
      const now = Date.now();
      if (now - lastSent > 50) {
        lastSent = now;
        this.broadcast({
          type: 'CURSOR_UPDATE',
          clientId: this.clientId,
          x: e.clientX,
          y: e.clientY
        });
      }
    });
  }

  broadcast(action) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(action));
    }
  }

  handleRemoteMessage(msg) {
    switch (msg.type) {
      case 'CURSOR_UPDATE':
        this.updateRemoteCursor(msg.clientId, msg.x, msg.y);
        break;

      case 'DASHBOARD_MUTATION':
        // Dispatch remote mutation directly to local store!
        this.store.dispatch(msg.action);
        break;

      case 'PEER_LEAVE':
        this.removeRemoteCursor(msg.clientId);
        break;
    }
  }

  updateRemoteCursor(peerId, x, y) {
    let cursorEl = document.querySelector(`#cursor-${peerId}`);
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.id = `cursor-${peerId}`;
      cursorEl.className = 'remote-cursor';
      cursorEl.innerHTML = `
        <svg class="cursor-pointer" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="0,0 0,20 6,15 11,24 14,22 9,13 18,13" />
        </svg>
        <span class="peer-label">${peerId}</span>
      `;
      document.body.appendChild(cursorEl);
    }

    // High performance GPU translate
    cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  removeRemoteCursor(peerId) {
    const el = document.querySelector(`#cursor-${peerId}`);
    if (el) el.remove();
  }

  getRandomColor() {
    return ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)];
  }
}
```

---

## 3. Remote Cursor CSS Styling

```css
.remote-cursor {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none; /* Crucial: Cursor does not block clicks underneath! */
  z-index: 99999;
  transition: transform 0.05s linear;
}

.remote-cursor svg {
  color: #3b82f6;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.peer-label {
  background: #1e293b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 10px;
  font-family: sans-serif;
}
```

---

## 4. Conflict Resolution Concepts (CRDTs & OT)

When two users modify the same dashboard card at the same millisecond, simple overwriting causes data loss. Production collaborative engines use:
- **Operational Transformation (OT):** Used in Google Docs; transforms operations based on concurrent revision histories.
- **Conflict-Free Replicated Data Types (CRDTs):** Used in Figma and Yjs; mathematical data structures that converge deterministically on all clients without a central coordinator.

---

## Practice Quiz

### Q1: Why should pointer movement events be throttled (e.g. to 50ms) before broadcasting over WebSockets?
- A) The browser limits clicks
- B) Pointer moves fire hundreds of times per second; throttling to ~20 FPS prevents saturating the network and freezing peer connections
- C) WebSockets only support 1 message per second
- D) To encrypt the coordinates
**Answer:** B
**Explanation:** Unthrottled mouse events can flood the network with hundreds of packets per second; rate-limiting to 50ms maintains smooth visual movement while conserving bandwidth.

### Q2: Why is pointer-events: none essential on remote cursor DOM elements?
- A) It speeds up mouse movement
- B) It ensures remote cursor elements do not block real user clicks on buttons and links underneath them
- C) It hides the cursor
- D) It prevents cursor rotation
**Answer:** B
**Explanation:** Setting `pointer-events: none` makes the overlay transparent to mouse events, allowing users to click through remote peer cursors to the interactive UI below.

### Q3: What mathematical data structure family converges deterministically across all peers without central locking?
- A) JSON
- B) CRDTs (Conflict-Free Replicated Data Types)
- C) HTMLCollections
- D) ArrayBuffers
**Answer:** B
**Explanation:** CRDTs are replicated data types designed so that concurrent edits merge automatically into an identical state across all clients without merge conflicts.

### Q4: How are remote cursor position coordinates updated with maximum 60 FPS performance?
- A) Using element.style.left and element.style.top
- B) Using CSS transform: translate3d(x, y, 0)
- C) Using document.write()
- D) Using table cells
**Answer:** B
**Explanation:** `translate3d(x, y, 0)` moves the element on dedicated GPU compositor layers without triggering CPU layout reflows or repaints.

### Q5: Why is checking (message.clientId === this.clientId) necessary when processing incoming WebSocket broadcasts?
- A) To encrypt packets
- B) To ignore echoing back your own local actions that the WebSocket broker broadcast to all connected clients
- C) To calculate latency
- D) To prevent syntax errors
**Answer:** B
**Explanation:** WebSocket servers often broadcast incoming messages to all connected clients; checking the client ID ignores local actions already rendered optimistically.

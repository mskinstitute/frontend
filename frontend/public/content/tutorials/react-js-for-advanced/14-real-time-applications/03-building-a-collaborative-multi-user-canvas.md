# Building a Collaborative Multi-User Canvas

Building a multi-user collaborative workspace (such as Figma, Miro, or Google Docs) requires synchronizing mouse cursors, object transformations, and canvas states in real-time across distributed clients. Managing collaborative state demands high-frequency event throttling, conflict resolution strategies, and performant HTML5 Canvas rendering.

---

## 1. Collaborative Canvas Architecture

```
Client A (Cursor: 240, 180) ──► WebSocket ──► Socket Server (Broadcasts to Room)
                                                   │
Client B (Sees A's cursor move in real-time) ◄──────┤
Client C (Sees A's cursor move in real-time) ◄──────┘
```

Key engineering challenges:
1. **Event Throttling:** Transmitting raw `onMouseMove` events 120 times per second floods network sockets. Throttling to 30-60ms intervals optimizes bandwidth.
2. **State Decoupling:** Transient data (remote cursor positions) should **never** be stored in heavy React component state; mutating canvas or DOM elements directly bypasses re-render bottlenecks.
3. **Optimistic Rendering:** Local brush strokes render immediately on the local canvas before broadcasting coordinate vectors to peers.

---

## 2. Implementing Multi-User Live Drawing

```tsx
import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface DrawStroke {
  prevX: number;
  prevY: number;
  currX: number;
  currY: number;
  color: string;
}

interface PeerCursor {
  userId: string;
  x: number;
  y: number;
  color: string;
}

export function CollaborativeCanvas({ roomId, userId }: { roomId: string; userId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [peerCursors, setPeerCursors] = useState<Record<string, PeerCursor>>({});

  useEffect(() => {
    // 1. Establish dedicated real-time socket
    const socket = io("https://canvas.enterprise.com", {
      query: { roomId, userId },
    });
    socketRef.current = socket;

    // 2. Receive remote draw commands and paint onto canvas
    socket.on("draw:stroke", (stroke: DrawStroke) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.moveTo(stroke.prevX, stroke.prevY);
      ctx.lineTo(stroke.currX, stroke.currY);
      ctx.stroke();
    });

    // 3. Receive remote cursor coordinates
    socket.on("cursor:update", (cursor: PeerCursor) => {
      setPeerCursors((prev) => ({
        ...prev,
        [cursor.userId]: cursor,
      }));
    });

    socket.on("user:left", (leftUserId: string) => {
      setPeerCursors((prev) => {
        const next = { ...prev };
        delete next[leftUserId];
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId]);

  // Handle local drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isDrawing.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;

    // Broadcast cursor position (throttled in production)
    socketRef.current?.emit("cursor:move", {
      roomId,
      userId,
      x: currX,
      y: currY,
      color: "#06b6d4",
    });

    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw locally immediately
    ctx.beginPath();
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    // Broadcast stroke to peers
    socketRef.current?.emit("draw:stroke", {
      roomId,
      prevX: lastPos.current.x,
      prevY: lastPos.current.y,
      currX,
      currY,
      color: "#06b6d4",
    });

    lastPos.current = { x: currX, y: currY };
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="relative p-6 bg-slate-900 border border-slate-800 rounded-2xl">
      <h2 className="text-white font-bold mb-3 text-sm">Collaborative Architecture Canvas (Room: {roomId})</h2>

      <div className="relative inline-block border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair block"
        />

        {/* Remote Peer Cursors Overlay */}
        {Object.values(peerCursors).map((peer) => (
          <div
            key={peer.userId}
            style={{
              position: "absolute",
              top: `${peer.y}px`,
              left: `${peer.x}px`,
              pointerEvents: "none",
              transition: "top 50ms linear, left 50ms linear",
            }}
            className="flex items-center gap-1 z-20"
          >
            <div
              style={{ backgroundColor: peer.color }}
              className="h-3 w-3 rounded-full border border-white shadow-md"
            />
            <span
              style={{ backgroundColor: peer.color }}
              className="px-1.5 py-0.5 text-[10px] font-bold text-slate-950 rounded shadow"
            >
              {peer.userId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. Conflict Resolution with CRDTs

When multiple users mutate text or structured document nodes concurrently, standard last-write-wins models overwrite peer edits. Enterprise collaborative apps use **Conflict-Free Replicated Data Types (CRDTs)** (e.g. **Yjs** or **Automerge**) to mathematically converge distributed edits without central lock synchronization.

---

## Practice Quiz

### Q1: Why is throttling mousemove events essential when broadcasting cursor coordinates over WebSockets?
- A) High-refresh monitors emit 120-240 events per second; broadcasting raw events exhausts browser socket buffers and overwhelms the server
- B) Browsers ban mousemove events
- C) WebSockets only support 1 event per second
- D) To prevent screen burn-in
**Answer:** A
**Explanation:** Unthrottled mousemove events generate hundreds of network packets per second per user; throttling to 30-50ms intervals preserves network bandwidth while keeping cursor motion smooth.

### Q2: Why should transient drawing coordinates be drawn directly on HTML5 Canvas rather than stored in React useState?
- A) React cannot render graphics
- B) Storing 60 coordinates per second in useState triggers 60 full component re-renders per second, causing severe UI frame drops
- C) Canvas elements do not work with React state
- D) HTML5 Canvas is deprecated
**Answer:** B
**Explanation:** Triggering React state updates at 60 FPS forces continuous component reconciliation. Direct 2D context painting bypasses React's virtual DOM overhead for high-frequency rendering.

### Q3: What technology is used by modern collaborative apps (like Figma and Notion) to merge concurrent document edits without conflicts?
- A) Git merge commands in the browser
- B) Conflict-Free Replicated Data Types (CRDTs) like Yjs or Automerge
- C) MySQL table locks
- D) Manual user conflict resolution modals
**Answer:** B
**Explanation:** CRDTs (Conflict-Free Replicated Data Types) allow independent peer nodes to concurrently mutate shared data and mathematically converge on identical states without centralized locking.

### Q4: What does pointer-events: none accomplish on remote cursor overlay elements?
- A) It hides the cursor
- B) It allows mouse clicks and drag events to pass directly through the cursor badge to the interactive canvas underneath
- C) It disables the computer mouse
- D) It speeds up WebSockets
**Answer:** B
**Explanation:** pointer-events: none ensures remote cursor overlays don't capture pointer events, allowing local users to interact with canvas elements positioned directly below other users' cursors.

### Q5: How does optimistic local drawing prevent lag for the active user?
- A) It draws the stroke on the local canvas immediately without waiting for server network roundtrip acknowledgment
- B) It skips drawing on the canvas entirely
- C) It compresses canvas PNGs
- D) It predicts what the user will draw next using machine learning
**Answer:** A
**Explanation:** Painting local strokes immediately provides zero-latency tactile feedback for the user while strokes are asynchronously distributed to peers across the network.

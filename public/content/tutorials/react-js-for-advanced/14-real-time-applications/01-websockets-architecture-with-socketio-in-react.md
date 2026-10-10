# WebSockets Architecture with Socket.io in React

Building collaborative real-time web applications—such as enterprise team chats, live trading dashboards, or multiplayer canvases—requires low-latency bidirectional communication. While raw browser `WebSocket` APIs lack automatic reconnection, rooms, and heartbeat acknowledgments, **Socket.io** provides a battle-tested enterprise framework for real-time React applications.

---

## 1. Raw WebSockets vs Socket.io

| Feature | Raw WebSockets (`new WebSocket()`) | Socket.io (`socket.io-client`) |
| :--- | :--- | :--- |
| **Protocol** | Standard RFC 6455 | Custom framing built atop Engine.IO |
| **Fallback** | Fails if WebSockets are blocked by proxies | Automatic fallback to HTTP long-polling |
| **Reconnection** | Must be coded manually | Automatic exponential backoff reconnection |
| **Multiplexing** | Single channel | Namespaces and Rooms |
| **Acknowledgements** | Manual correlation IDs | Built-in callback acknowledgments |

---

## 2. Singleton Socket Pattern in React

Creating a new socket connection inside a component causes multiple duplicate connections whenever components re-render or mount. Instead, maintain a singleton socket instance or wrap it in a dedicated React Context:

```tsx
// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "https://realtime.enterprise.com";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 1. Initialize client singleton
    const socketInstance = io(SOCKET_SERVER_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"], // Attempt WebSocket first, fallback to polling
      auth: {
        token: sessionStorage.getItem("access_token"),
      },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(socketInstance);

    return () => {
      // 2. Disconnect cleanly when provider unmounts
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
```

---

## 3. Real-Time Chat Room Component

```tsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export function EnterpriseChatRoom({ roomId }: { roomId: string }) {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Join room channel
    socket.emit("room:join", { roomId });

    // Listener for incoming broadcasts
    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message:received", handleNewMessage);

    return () => {
      // MANDATORY: Remove specific event listener to prevent duplicate listeners
      socket.off("message:received", handleNewMessage);
      socket.emit("room:leave", { roomId });
    };
  }, [socket, roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !inputMessage.trim()) return;

    // Emit event with server acknowledgment callback
    socket.emit(
      "message:send",
      { roomId, text: inputMessage },
      (ack: { status: string; messageId: string }) => {
        if (ack.status === "OK") {
          setInputMessage("");
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[500px] max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-white">
      <header className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-sm">
        Channel #{roomId}
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2.5 bg-slate-800/60 rounded-lg text-xs">
            <span className="font-semibold text-cyan-400 block">{msg.sender}</span>
            <p className="mt-0.5 text-slate-200">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button type="submit" className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 font-semibold rounded text-xs">
          Send
        </button>
      </form>
    </div>
  );
}
```

---

## 4. The Critical Rule: Listener Teardown with `socket.off`

Failing to call `socket.off("event", handler)` in `useEffect` cleanup causes **listener leaks**. Every time the component re-renders or mounts, an additional duplicate listener is registered. If the component mounts 5 times, a single incoming message triggers the state setter 5 times, duplicating messages in the UI!

---

## Practice Quiz

### Q1: Why is creating new Socket.io instances directly inside component bodies considered an anti-pattern?
- A) Socket.io does not run inside React
- B) Every component re-render creates a new duplicate WebSocket connection to the server, exhausting server sockets and degrading performance
- C) Browsers ban more than one socket connection
- D) It causes TypeScript compilation errors
**Answer:** B
**Explanation:** Instantiating sockets inside components creates redundant connections on every re-render. A singleton pattern or Context provider manages a single long-lived connection.

### Q2: What does calling socket.off("eventName", handler) in the useEffect cleanup achieve?
- A) It deletes the user's account
- B) It unregisters the specific event listener, preventing duplicate event handling and memory leaks on re-renders
- C) It disconnects the entire network socket
- D) It resets the database
**Answer:** B
**Explanation:** Unregistering listeners with socket.off() ensures that when dependencies change or components unmount, stale listeners are removed rather than stacking up.

### Q3: What advantage does Socket.io have over raw WebSockets when navigating corporate firewalls?
- A) Socket.io automatically falls back to HTTP long-polling if WebSocket handshakes are blocked by proxy servers
- B) Socket.io disables HTTPS
- C) Socket.io converts messages into email
- D) Socket.io changes port numbers automatically
**Answer:** A
**Explanation:** Socket.io starts with or falls back to HTTP long-polling if corporate firewalls, VPNs, or antivirus software block WebSocket upgrade requests.

### Q4: How do built-in acknowledgments work in Socket.io?
- A) The server sends an SMS message
- B) The client passes a callback function as the final argument in socket.emit(); the server invokes it upon processing to confirm receipt
- C) The client pauses all JavaScript execution
- D) The browser shows an alert popup
**Answer:** B
**Explanation:** Socket.io acknowledgments allow you to pass a callback function to socket.emit(), which the recipient executes with response data to confirm delivery.

### Q5: What is the purpose of Socket.io "Rooms"?
- A) Physical rooms where servers are installed
- B) Server-side channel abstractions that allow broadcasting events to a specific subset of connected clients without broadcasting globally
- C) CSS layouts for multi-column grids
- D) Browser tabs
**Answer:** B
**Explanation:** Rooms are arbitrary server-side channels that sockets can join or leave, allowing messages to be broadcasted specifically to participants in that room.

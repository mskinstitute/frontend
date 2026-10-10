# Server-Sent Events (SSE) for Real-Time Streaming

While WebSockets provide bidirectional communication, many real-time features are strictly **unidirectional**—data flows exclusively from server to client. Examples include generative AI LLM token streaming (ChatGPT / Gemini style responses), live stock tickers, server metric telemetry, and build progress notifications. **Server-Sent Events (SSE)** uses native HTTP to stream text events efficiently with less architectural overhead than WebSockets.

---

## 1. WebSockets vs Server-Sent Events (SSE)

| Feature | WebSockets | Server-Sent Events (SSE) |
| :--- | :--- | :--- |
| **Directionality** | Full-duplex (Bidirectional) | Half-duplex (Server to Client only) |
| **Protocol** | Custom WS / WSS protocol | Standard HTTP / HTTPS |
| **HTTP/2 Support** | Limited / Complex multiplexing | Native HTTP/2 multiplexing (efficient) |
| **Reconnection** | Must be coded manually | Native automatic reconnection built into browser |
| **Firewall / Proxy Traversals** | Often inspected or blocked | Behaves like standard HTTP stream |
| **Client API** | `new WebSocket()` | Native `new EventSource()` or `fetch` ReadableStream |

---

## 2. Using Native `EventSource`

The browser's native `EventSource` interface handles automatic reconnection and event parsing:

```tsx
import React, { useEffect, useState } from "react";

interface TelemetryMetric {
  cpuUsage: number;
  memoryUsage: number;
  activeRequests: number;
  timestamp: string;
}

export function SystemTelemetryDashboard() {
  const [metric, setMetric] = useState<TelemetryMetric | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting");

  useEffect(() => {
    // 1. Establish SSE stream over standard HTTPS
    const eventSource = new EventSource("https://api.enterprise.com/v1/metrics/stream");

    eventSource.onopen = () => {
      setStatus("connected");
    };

    // 2. Listen to unnamed default message events
    eventSource.onmessage = (event) => {
      const data: TelemetryMetric = JSON.parse(event.data);
      setMetric(data);
    };

    // 3. Listen to custom named events sent by the server
    eventSource.addEventListener("alert", (event: MessageEvent) => {
      const alertData = JSON.parse(event.data);
      console.warn("System Alert Triggered:", alertData);
    });

    eventSource.onerror = (err) => {
      console.error("SSE connection failure:", err);
      setStatus("error");
      // Browser automatically retries connection in the background!
    };

    // 4. Teardown stream on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-base">Server Telemetry (SSE)</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-mono ${
            status === "connected"
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
              : "bg-rose-950 text-rose-400"
          }`}
        >
          {status}
        </span>
      </div>

      {metric ? (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between p-2 bg-slate-950 rounded">
            <span className="text-slate-400">CPU Utilization:</span>
            <span className="text-cyan-400 font-bold">{metric.cpuUsage}%</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-950 rounded">
            <span className="text-slate-400">Memory Usage:</span>
            <span className="text-amber-400 font-bold">{metric.memoryUsage} MB</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-950 rounded">
            <span className="text-slate-400">Active Requests:</span>
            <span className="text-emerald-400 font-bold">{metric.activeRequests} req/s</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">Streaming telemetry data...</p>
      )}
    </div>
  );
}
```

---

## 3. Streaming AI LLM Responses via `fetch` ReadableStream

While `EventSource` is simple, it only supports `GET` requests and cannot pass custom request body payloads or `Authorization` headers. For streaming AI completions (which require `POST` with JSON bodies), consume the response `ReadableStream` via `fetch`:

```tsx
import React, { useState } from "react";

export function AIResponseStreamer() {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerAIStream = async () => {
    setOutput("");
    setIsGenerating(true);

    try {
      const response = await fetch("https://api.enterprise.com/v1/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prompt: "Explain React Fiber Architecture" }),
      });

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Append streamed token chunks smoothly
        setOutput((prev) => prev + chunk);
      }
    } catch (err) {
      console.error("Stream failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white max-w-xl">
      <button
        onClick={triggerAIStream}
        disabled={isGenerating}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 rounded font-semibold text-sm mb-4"
      >
        {isGenerating ? "Streaming Tokens..." : "Generate AI Response"}
      </button>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg min-h-[120px] text-sm text-slate-300 font-mono whitespace-pre-wrap">
        {output || "Awaiting generation..."}
      </div>
    </div>
  );
}
```

---

## Practice Quiz

### Q1: What is the primary operational difference between WebSockets and Server-Sent Events (SSE)?
- A) WebSockets are bidirectional; SSE is strictly unidirectional from server to client
- B) SSE requires UDP, while WebSockets require TCP
- C) WebSockets do not work on HTTPS
- D) SSE was deprecated in HTML5
**Answer:** A
**Explanation:** SSE is a unidirectional protocol where only the server pushes events to the client over standard HTTP, whereas WebSockets provide full bidirectional messaging.

### Q2: What built-in capability does the browser's EventSource API provide without external libraries?
- A) Database migration scripts
- B) Automatic reconnection with exponential backoff and message ID tracking (Last-Event-ID)
- C) Video decompression
- D) Translation between languages
**Answer:** B
**Explanation:** EventSource automatically attempts reconnection if the network disconnects, tracking the Last-Event-ID header so the server can resume streaming without missed events.

### Q3: Why is fetch ReadableStream used for AI LLM token streaming instead of EventSource?
- A) EventSource cannot run on Chrome
- B) EventSource only supports GET requests and cannot send custom POST JSON bodies or custom Authorization headers
- C) fetch is written in C++
- D) EventSource cannot receive strings
**Answer:** B
**Explanation:** The native EventSource API is restricted to GET requests with standard credentials; fetch ReadableStream supports POST payloads, headers, and full request configuration.

### Q4: What HTTP Content-Type header must the server return to establish an SSE stream?
- A) application/json
- B) text/event-stream
- C) multipart/form-data
- D) application/octet-stream
**Answer:** B
**Explanation:** The W3C Server-Sent Events standard mandates the text/event-stream MIME type to establish persistent streaming connections.

### Q5: Why must eventSource.close() be called in the useEffect cleanup function?
- A) To prevent the browser from continually keeping the HTTP streaming connection open in the background after the component unmounts
- B) To format the computer hard drive
- C) To log out the current user
- D) To refresh the page
**Answer:** A
**Explanation:** Calling eventSource.close() terminates the underlying HTTP stream and cancels automatic reconnection cycles when the component unmounts.

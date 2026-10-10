# Web Workers in React for CPU-Intensive Background Tasks

JavaScript in the browser executes on a single main thread. If your React application performs heavy CPU computations—such as parsing a 100MB CSV file, generating image filters, running cryptographic hashing, or executing complex machine learning models—the main thread blocks, completely freezing user input, animations, and transitions. Web Workers offload these heavy calculations to isolated background OS threads.

---

## 1. The Main Thread Bottleneck

```
Main Thread (UI, React Reconciliation, User Clicks):
───[Click]───[Typing]───► [ 3.5s Heavy Math Loop ] ───► [UI Frozen / Frames Dropped] ───►

With Web Worker:
Main Thread: ───[Click]───► [Post Message] ───► [UI Stays Smooth 60 FPS] ───► [Receive Result]
Worker Thread: ──────────────────────────► [ 3.5s Heavy Math Loop ] ────────────►
```

---

## 2. Setting Up Vite Web Workers with Modern Syntax

Modern Vite and Webpack 5 support native Web Worker instantiation using standard ES module syntax:

```ts
// src/workers/heavyComputation.worker.ts
// Worker running on separate background thread

self.onmessage = (event: MessageEvent<{ rawData: number[] }>) => {
  const { rawData } = event.data;

  // CPU-heavy calculation: e.g. prime factorizations or statistical variance
  let sum = 0;
  for (let i = 0; i < rawData.length; i++) {
    for (let j = 0; j < 1000; j++) {
      sum += Math.sqrt(rawData[i] * j);
    }
  }

  // Send result back to main React thread
  self.postMessage({ result: sum });
};

export {};
```

---

## 3. Creating a Custom React Hook for Web Worker Integration

Managing worker instantiation, termination, and message listeners is best abstracted into a clean React hook:

```tsx
import { useState, useEffect, useRef, useCallback } from "react";

export function useHeavyCalculation() {
  const [result, setResult] = useState<number | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Instantiate worker using Vite's new Worker(new URL(..., import.meta.url))
    workerRef.current = new Worker(
      new URL("../workers/heavyComputation.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (event: MessageEvent<{ result: number }>) => {
      setResult(event.data.result);
      setIsComputing(false);
    };

    return () => {
      // Terminate background OS thread on unmount to prevent memory leaks
      workerRef.current?.terminate();
    };
  }, []);

  const runCalculation = useCallback((data: number[]) => {
    if (!workerRef.current) return;
    setIsComputing(true);
    workerRef.current.postMessage({ rawData: data });
  }, []);

  return { result, isComputing, runCalculation };
}
```

---

## 4. Consuming the Worker in a React Component

```tsx
import React, { useState } from "react";
import { useHeavyCalculation } from "./hooks/useHeavyCalculation";

export function WorkerBenchmarkView() {
  const [clickCount, setClickCount] = useState(0);
  const { result, isComputing, runCalculation } = useHeavyCalculation();

  const handleCompute = () => {
    const syntheticData = Array.from({ length: 50000 }, () => Math.random() * 100);
    runCalculation(syntheticData);
  };

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Web Worker Multithreaded Processing</h1>

      <div className="flex gap-4 items-center mb-6">
        <button
          onClick={handleCompute}
          disabled={isComputing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 rounded font-semibold"
        >
          {isComputing ? "Computing on Worker Thread..." : "Trigger 50M Math Cycles"}
        </button>

        {/* UI Responsiveness Test Button */}
        <button
          onClick={() => setClickCount((c) => c + 1)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-semibold"
        >
          Click Me Rapidly: {clickCount}
        </button>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded">
        <p className="text-sm text-slate-400">
          Result:{" "}
          <span className="text-cyan-400 font-mono">
            {result !== null ? result.toLocaleString() : "Awaiting execution"}
          </span>
        </p>
      </div>
    </div>
  );
}
```

Notice how `clickCount` increments instantly without a single dropped frame, even while the Web Worker executes 50 million math iterations!

---

## 5. Transferable Objects for Zero-Copy Memory

Passing huge buffers (`ArrayBuffer`, `Uint8Array`) via standard `postMessage` copies data across threads. Using **Transferable Objects** transfers ownership of the memory buffer directly with zero serialization cost:

```ts
const bigBuffer = new Uint8Array(1024 * 1024 * 100); // 100MB buffer
// Passing buffer in transfer list (second argument)
worker.postMessage({ buffer: bigBuffer }, [bigBuffer.buffer]);
```

---

## Practice Quiz

### Q1: What is the primary purpose of using Web Workers in a React application?
- A) To replace backend Express servers
- B) To run CPU-intensive computational tasks in background threads, preventing main-thread UI freezing
- C) To style React components with Sass
- D) To eliminate TypeScript compilation
**Answer:** B
**Explanation:** Web Workers run code on separate OS background threads, offloading CPU-intensive workloads so the browser's main UI thread remains responsive at 60 FPS.

### Q2: Can a Web Worker directly manipulate React state or the DOM (document.getElementById)?
- A) Yes, workers have full access to window and document
- B) No, Web Workers run in an isolated global scope without access to the DOM, window, or React component tree
- C) Yes, but only in Google Chrome
- D) Yes, using the useWorkerDOM hook
**Answer:** B
**Explanation:** Web Workers do not have access to window or document. They communicate with the main thread strictly via asynchronous message passing (postMessage and onmessage).

### Q3: Why is calling worker.terminate() inside useEffect's cleanup function critical?
- A) To delete node_modules
- B) To destroy the background OS thread and prevent memory and CPU leaks when the React component unmounts
- C) To restart the user's browser
- D) To save state to local storage
**Answer:** B
**Explanation:** Leaving Web Workers active after components unmount leaks browser threads and memory; calling terminate() ensures background worker processes are destroyed.

### Q4: What are Transferable Objects in the Web Worker API?
- A) Objects transferred to Git repositories
- B) Binary data structures (like ArrayBuffer) whose memory ownership is transferred directly to the worker with zero copying overhead
- C) React props passed from parent to child
- D) Cookies transferred over HTTPS
**Answer:** B
**Explanation:** Transferable objects transfer ownership of underlying memory buffers directly without copying or serializing bytes, enabling instant multi-megabyte transfers.

### Q5: How do modern bundlers like Vite instantiate ES Module Web Workers?
- A) new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
- B) document.createWorker("./worker.ts")
- C) React.createWorkerComponent("./worker.ts")
- D) import worker from "./worker.ts"
**Answer:** A
**Explanation:** The standard ES module pattern recognized by modern bundlers is new Worker(new URL(relativeFilePath, import.meta.url), { type: "module" }).

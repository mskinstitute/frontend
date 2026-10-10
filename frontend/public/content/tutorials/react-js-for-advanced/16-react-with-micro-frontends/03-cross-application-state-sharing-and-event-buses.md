# Cross-Application State Sharing and Event Buses

In a micro-frontend architecture, different micro-applications must frequently communicate: an *Authentication Remote* emits a login event, the *Cart Remote* notifies the *Header Host* to update badge counters, or the *Navigation Remote* triggers route transitions. However, tightly coupling micro-frontends to a single shared Redux store defeats the autonomy of independent teams. Enterprise systems use **Decoupled Event Buses** and native browser `CustomEvent` primitives for cross-application communication.

---

## 1. Architectural Communication Paradigms

```
┌────────────────────────────────────────────────────────┐
│ Host Shell (Event Bus Singleton / Window EventTarget)   │
└───────────▲────────────────────────────────▲───────────┘
            │ 1. Emits 'auth:login'          │ 2. Listens to 'auth:login'
┌───────────┴──────┐              ┌──────────┴──────────┐
│ Remote A (Auth)  │              │ Remote B (Profile)  │
└──────────────────┘              └─────────────────────┘
```

Three primary approaches:
1. **Window CustomEvent (Recommended):** Native browser events with zero dependencies; completely framework-agnostic.
2. **Custom Event Bus Singleton:** A lightweight pub/sub emitter shared via Module Federation.
3. **Reactive Observable Stores:** Shared lightweight stores (e.g. Zustand or RxJS Subject) passed via props or federation context.

---

## 2. Implementing a Type-Safe Browser Event Bus

```ts
// src/events/microEventBus.ts

export interface AppEvents {
  "user:login": { userId: string; name: string; role: string };
  "user:logout": undefined;
  "cart:updated": { itemCount: number; totalAmount: number };
  "theme:changed": { theme: "light" | "dark" };
}

export class MicroEventBus {
  // Emit event onto global window
  static emit<K extends keyof AppEvents>(eventName: K, detail?: AppEvents[K]): void {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true, // Allows crossing Shadow DOM boundaries if used
    });
    window.dispatchEvent(event);
  }

  // Subscribe to event with cleanup return
  static on<K extends keyof AppEvents>(
    eventName: K,
    callback: (detail: AppEvents[K]) => void
  ): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AppEvents[K]>;
      callback(customEvent.detail);
    };

    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }
}
```

---

## 3. React Custom Hook for Event Bus Subscriptions

```tsx
import { useEffect, useState } from "react";
import { MicroEventBus, AppEvents } from "./microEventBus";

export function useMicroEvent<K extends keyof AppEvents>(
  eventName: K,
  handler: (detail: AppEvents[K]) => void
) {
  useEffect(() => {
    // Automatically subscribes and handles teardown on unmount
    const unsubscribe = MicroEventBus.on(eventName, handler);
    return unsubscribe;
  }, [eventName, handler]);
}
```

---

## 4. Consuming Across Remotes

### In Remote A (Cart Micro-Frontend):
```tsx
import React from "react";
import { MicroEventBus } from "./events/microEventBus";

export function CheckoutWidget() {
  const handleAddItem = () => {
    // Emit event across window boundary to whoever is listening
    MicroEventBus.emit("cart:updated", {
      itemCount: 4,
      totalAmount: 189.99,
    });
  };

  return (
    <button
      onClick={handleAddItem}
      className="px-4 py-2 bg-emerald-600 text-white rounded font-semibold text-xs"
    >
      Add Enterprise License to Cart
    </button>
  );
}
```

### In Host Shell Header:
```tsx
import React, { useState, useCallback } from "react";
import { useMicroEvent } from "./hooks/useMicroEvent";
import { AppEvents } from "./events/microEventBus";

export function HostNavigationHeader() {
  const [cartCount, setCartCount] = useState(0);

  // Listen to cross-remote broadcast
  const handleCartUpdate = useCallback((detail: AppEvents["cart:updated"]) => {
    setCartCount(detail.itemCount);
  }, []);

  useMicroEvent("cart:updated", handleCartUpdate);

  return (
    <header className="p-4 bg-slate-900 border-b border-slate-800 text-white flex justify-between">
      <span className="font-bold">Enterprise Cloud Portal</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Cart Badge:</span>
        <span className="px-2 py-0.5 bg-cyan-600 text-xs font-bold rounded-full">{cartCount}</span>
      </div>
    </header>
  );
}
```

---

## 5. Architectural Rule: Keep Cross-App Events Coarse-Grained

Never broadcast microscopic state changes (e.g. character-by-character typing). Events should be **coarse-grained domain events** (`"order:submitted"`, `"user:authenticated"`). Sharing state fine-grained across micro-frontends creates tight distributed coupling, destroying the independence of your squads.

---

## Practice Quiz

### Q1: Why is a shared monolithic Redux store discouraged across independently deployed micro-frontends?
- A) Redux does not work in modern browsers
- B) A single shared Redux store couples all squads to identical action types, reducer structures, and deployment cycles, breaking independent squad autonomy
- C) Redux only supports 5 actions
- D) Redux requires Python
**Answer:** B
**Explanation:** Forcing independent micro-frontends to share a central Redux store re-couples them at the state layer; changes by one team can break actions in another team's app.

### Q2: What browser-native primitive enables framework-agnostic cross-application messaging?
- A) CustomEvent and window.dispatchEvent()
- B) alert()
- C) document.cookie
- D) prompt()
**Answer:** A
**Explanation:** CustomEvent and window.dispatchEvent() are native W3C browser primitives that allow decoupled components to emit and subscribe to custom payloads without external libraries.

### Q3: What does composed: true accomplish in a CustomEvent initialization?
- A) It compresses the payload into gzip
- B) It allows the event to bubble across the boundary of Shadow DOM boundaries into the regular DOM
- C) It runs the event on a Web Worker
- D) It encrypts the event with SHA-256
**Answer:** B
**Explanation:** Setting composed: true allows the CustomEvent to traverse past Shadow DOM boundaries, ensuring events reach listeners even if a micro-frontend uses Web Components.

### Q4: Why must event listeners registered with window.addEventListener be cleaned up in useEffect?
- A) To restart the browser
- B) To prevent memory leaks and zombie listeners that continue executing callbacks after the component unmounts
- C) To delete the window object
- D) To close the network socket
**Answer:** B
**Explanation:** Uncleaned window listeners linger in memory for the duration of the browser tab's lifetime, leaking closures and repeatedly invoking stale callbacks.

### Q5: What is the recommended granularity for cross-micro-frontend event messages?
- A) High-frequency fine-grained events (e.g. mouse movements, keystrokes)
- B) Coarse-grained domain events (e.g. user:login, cart:updated, order:placed) representing significant business milestones
- C) Complete database table dumps
- D) CSS stylesheets
**Answer:** B
**Explanation:** Cross-app communication should be coarse-grained business milestones. Fine-grained event chatter creates distributed performance bottlenecks and tight coupling.

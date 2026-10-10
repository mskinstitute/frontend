# Real-Time GraphQL Subscriptions with WebSockets

While queries and mutations follow the classic request-response cycle, real-time enterprise features (such as live trading monitors, collaborative chat, and real-time document notifications) require bidirectional push communication. **GraphQL Subscriptions** maintain a persistent WebSocket connection between client and server, streaming events to React components using `useSubscription`.

---

## 1. GraphQL Transport Layer Architecture

Modern Apollo Client architectures use a split-link configuration:
- **HTTP Link (`httpLink`):** Handles standard Queries and Mutations over HTTP/HTTPS.
- **WebSocket Link (`wsLink`):** Handles persistent Subscriptions using the standard `graphql-ws` library.

```
React Application
      │
      ▼
Apollo Split Link (isSubscription?)
      ├─── Yes ──► GraphQL-WS Link ──► wss://api.enterprise.com/graphql
      └─── No  ──► HTTP Link       ──► https://api.enterprise.com/graphql
```

---

## 2. Setting Up Split Link with `graphql-ws`

```bash
npm install graphql-ws
```

```ts
// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// 1. Standard HTTP Link for Queries & Mutations
const httpLink = new HttpLink({
  uri: "https://api.enterprise.com/graphql",
});

// 2. WebSocket Link for Subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://api.enterprise.com/graphql",
    connectionParams: () => ({
      authToken: sessionStorage.getItem("access_token"),
    }),
  })
);

// 3. Directional Split: route subscription operations to WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
```

---

## 3. Consuming Live Events with `useSubscription`

```tsx
import React, { useState } from "react";
import { gql, useSubscription } from "@apollo/client";

const LIVE_SECURITY_ALERTS = gql`
  subscription OnSecurityAlert($clusterId: ID!) {
    securityAlertAdded(clusterId: $clusterId) {
      id
      severity
      message
      timestamp
    }
  }
`;

interface Alert {
  id: string;
  severity: "LOW" | "HIGH" | "CRITICAL";
  message: string;
  timestamp: string;
}

export function LiveSecurityFeed({ clusterId }: { clusterId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Subscribes to incoming live WebSocket events
  useSubscription(LIVE_SECURITY_ALERTS, {
    variables: { clusterId },
    onData: ({ data }) => {
      const newAlert = data.data?.securityAlertAdded;
      if (newAlert) {
        setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]); // Keep last 50
      }
    },
  });

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Live Telemetry & Security Alerts</h2>
        <span className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          WebSocket Connected
        </span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Listening for cluster events...</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded flex justify-between items-center text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold px-1.5 py-0.5 rounded ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : "bg-amber-950 text-amber-400"
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-slate-200">{alert.message}</span>
              </div>
              <span className="text-slate-500 font-mono">{alert.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## 4. Subscriptions vs Polling

Avoid using subscriptions for data that changes infrequently. For standard status checks (e.g. tracking a background export progress), simple query polling (`pollInterval: 5000`) avoids the overhead of managing long-lived WebSocket connections and socket reconnections.

---

## Practice Quiz

### Q1: What protocol does Apollo Client use to maintain persistent GraphQL Subscriptions?
- A) HTTP POST polling
- B) Persistent WebSockets (via wss:// and graphql-ws)
- C) FTP file transfers
- D) DNS lookups
**Answer:** B
**Explanation:** GraphQL Subscriptions establish persistent bidirectional WebSocket connections to push events in real-time from server to client.

### Q2: What is the purpose of the split function in Apollo Client configuration?
- A) To divide a component into two halves
- B) To inspect incoming GraphQL operations and direct queries/mutations to the HTTP link while routing subscriptions to the WebSocket link
- C) To split CSS code into two files
- D) To partition disk storage
**Answer:** B
**Explanation:** split acts as a router for network links, inspecting operation definitions so subscriptions use WebSockets while queries and mutations travel over standard HTTP.

### Q3: What is the current standard library for GraphQL WebSockets recommended over the deprecated subscriptions-transport-ws?
- A) socket.io-client
- B) graphql-ws
- C) netcat
- D) axios-websocket
**Answer:** B
**Explanation:** graphql-ws is the active community standard library powering modern GraphQL subscription implementations, replacing the deprecated subscriptions-transport-ws.

### Q4: How do you authenticate a WebSocket connection in graphql-ws?
- A) Through URL path query params only
- B) Via connectionParams option passing authorization tokens during connection initialization
- C) WebSockets do not support authentication
- D) By sending an SMS
**Answer:** B
**Explanation:** connectionParams passes authentication payloads (such as bearer tokens) when the WebSocket handshake occurs.

### Q5: When should you prefer query polling (pollInterval) over GraphQL Subscriptions?
- A) When data updates 60 times a second
- B) When data updates infrequently (e.g. checking job status every 10 seconds), avoiding the architectural overhead of persistent WebSocket server connections
- C) When using mobile phones
- D) In production environments
**Answer:** B
**Explanation:** Polling is simpler and scales well for low-frequency status checks without the stateful server overhead and connection management required by persistent WebSockets.

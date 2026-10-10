# GraphQL Fundamentals and Apollo Client Setup

REST APIs often suffer from two enterprise scale challenges: **over-fetching** (retrieving hundreds of unused object fields) and **under-fetching** (requiring multiple waterfall HTTP requests to assemble related relational data). **GraphQL** solves this by providing a declarative query language where the client specifies the exact shape of data required. **Apollo Client** is the premier state management and caching client for GraphQL in React.

---

## 1. Core GraphQL Concepts

- **Schema & Types:** The strongly-typed contract defined on the server (`type User { id: ID!, name: String!, email: String! }`).
- **Queries:** Read operations fetching specific fields:
  ```graphql
  query GetUserData {
    user(id: "123") {
      name
      email
    }
  }
  ```
- **Mutations:** Write operations creating, updating, or deleting data.
- **Subscriptions:** Persistent real-time event streams over WebSockets.

---

## 2. Apollo Client Architecture & Normalized Cache

Unlike standard HTTP caches that store responses by raw URL endpoint string, Apollo Client's **Normalized In-Memory Cache** (`InMemoryCache`):
1. Deconstructs incoming GraphQL JSON responses into individual records.
2. Generates a unique key for each entity (by default: `__typename:id`, e.g. `User:123`).
3. Normalizes and stores each entity in a flat key-value dictionary.
4. If two queries request different fields of `User:123`, Apollo automatically merges them into a single coherent entity in memory!

```
Incoming Query Response:
{ user: { __typename: "User", id: "123", name: "Alice" } }

Normalized Cache Store:
"User:123" ──► { __typename: "User", id: "123", name: "Alice" }
```

---

## 3. Configuring Apollo Client with Authentication Headers

```bash
npm install @apollo/client graphql
```

```tsx
// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// 1. HTTP connection to GraphQL endpoint
const httpLink = createHttpLink({
  uri: "https://api.enterprise.com/graphql",
});

// 2. Auth Link: Injects Bearer token dynamically into HTTP headers
const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("access_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// 3. Instantiate Apollo Client with normalized cache
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Custom pagination merge policy
          allProjects: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
```

---

## 4. Wrapping the Application with `ApolloProvider`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apolloClient";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
```

Any child component within this tree can now execute GraphQL operations via hooks (`useQuery`, `useMutation`, `useSubscription`).

---

## Practice Quiz

### Q1: What is the primary problem of "over-fetching" in traditional REST APIs?
- A) The server runs out of disk storage
- B) Endpoints return large monolithic JSON payloads containing dozens of fields that the client view does not need, wasting mobile bandwidth and parsing time
- C) The client sends too many HTTP headers
- D) The database executes too many transactions
**Answer:** B
**Explanation:** Over-fetching occurs when a fixed REST endpoint returns extensive unnecessary data (e.g. 50 user attributes) when the client only needed the user's name.

### Q2: How does Apollo Client's InMemoryCache normalize incoming data entities?
- A) By converting all strings to uppercase
- B) By decomposing nested objects into a flat dictionary keyed by their __typename and id (e.g. "User:123")
- C) By saving all data into SQLite
- D) By discarding nested relational records
**Answer:** B
**Explanation:** Apollo's normalized cache uses an entity's __typename and unique identifier (id or _id) to create a flat dictionary of objects, preventing data duplication across queries.

### Q3: What is the purpose of Apollo's setContext link in the client configuration?
- A) To encrypt React components
- B) To asynchronously modify and inject request metadata—such as authorization bearer tokens—into outgoing HTTP headers
- C) To render React context
- D) To configure CSS modules
**Answer:** B
**Explanation:** setContext intercepts every outgoing operation, allowing developers to inject dynamic headers (such as authentication tokens) before the request hits the network.

### Q4: What happens if two separate queries request different fields for the exact same entity id?
- A) Apollo throws a conflict exception
- B) Apollo merges the fields into the single normalized entity in the cache, updating any component observing that entity
- C) The second query overwrites and deletes the first query's data
- D) The browser tab reloads
**Answer:** B
**Explanation:** Because Apollo stores entities by identifier (e.g. User:42), subsequent queries requesting additional fields automatically merge into the cached object.

### Q5: What is the GraphQL equivalent of an HTTP POST / PUT / DELETE operation in REST?
- A) Query
- B) Mutation
- C) Subscription
- D) Fragment
**Answer:** B
**Explanation:** Mutations represent state-altering write operations in GraphQL, encompassing creates, updates, and deletes.

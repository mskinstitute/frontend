# Executing GraphQL Queries with useQuery

The `useQuery` React hook is the primary mechanism for fetching GraphQL data in Apollo Client applications. It manages the complete query lifecycle—including loading states, error boundaries, data caching, background polling, and refetching—while integrating with TypeScript for end-to-end type safety.

---

## 1. Defining Typed Queries with `gql`

GraphQL documents are parsed using the `gql` tagged template literal:

```tsx
import { gql } from "@apollo/client";

export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($projectId: ID!) {
    project(id: $projectId) {
      id
      title
      status
      budget
      teamLead {
        id
        name
        avatarUrl
      }
      tasks(limit: 10) {
        id
        title
        completed
      }
    }
  }
`;
```

---

## 2. Using `useQuery` in a Component

```tsx
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PROJECT_DETAILS } from "./queries";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface ProjectData {
  project: {
    id: string;
    title: string;
    status: "ACTIVE" | "ARCHIVED" | "PENDING";
    budget: number;
    teamLead: {
      name: string;
      avatarUrl: string;
    };
    tasks: Task[];
  };
}

interface ProjectVars {
  projectId: string;
}

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const { data, loading, error, refetch, networkStatus } = useQuery<ProjectData, ProjectVars>(
    GET_PROJECT_DETAILS,
    {
      variables: { projectId },
      fetchPolicy: "cache-and-network", // Serves cached data instantly, updates from network in background
      notifyOnNetworkStatusChange: true, // Enables tracking refetch spinners
    }
  );

  if (loading && !data) {
    return (
      <div className="p-8 text-cyan-400 flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        Loading project telemetry...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300">
        <h3 className="font-bold">Error loading project</h3>
        <p className="text-xs mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded text-xs font-semibold"
        >
          Retry Query
        </button>
      </div>
    );
  }

  const { project } = data!;

  return (
    <div className="p-8 bg-slate-900 text-white rounded-xl border border-slate-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
            Status: {project.status}
          </span>
        </div>

        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium text-slate-300"
        >
          Refresh Data
        </button>
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-400">Milestone Tasks</h2>
        {project.tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-2 bg-slate-950 rounded text-xs">
            <span className={task.completed ? "text-emerald-400 line-through" : "text-slate-200"}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. Understanding Fetch Policies

The `fetchPolicy` option controls how Apollo resolves data between the client cache and the network:

| Fetch Policy | Behavior | Best Use Case |
| :--- | :--- | :--- |
| `cache-first` (Default) | Checks cache; if found, never hits network. Hits network only on cache miss. | Static or rarely changing reference data. |
| `cache-and-network` | Returns cached data immediately, then fetches from network in background and updates UI. | High-activity dashboards requiring instant loads + fresh data. |
| `network-only` | Always queries the network, updating the cache with results. | Critical financial balances or live checkout totals. |
| `no-cache` | Always queries network and does **not** write to cache. | Sensitive user data that should never persist in memory. |

---

## Practice Quiz

### Q1: What does the fetchPolicy: "cache-and-network" setting accomplish?
- A) It deletes the cache and only queries the network
- B) It returns cached data immediately for instant rendering, then executes a network request in the background to update the cache and view
- C) It compresses network requests using gzip
- D) It blocks all network requests
**Answer:** B
**Explanation:** cache-and-network provides an optimal user experience: instant UI rendering from the local cache followed by a background network sync for freshness.

### Q2: Why is notifyOnNetworkStatusChange: true necessary when using refetch()?
- A) To play an audible notification sound
- B) To ensure the loading boolean updates during manual refetch operations rather than remaining false
- C) To send push notifications to mobile devices
- D) To restart the Apollo Client
**Answer:** B
**Explanation:** By default, refetching does not toggle the primary loading flag back to true; setting notifyOnNetworkStatusChange: true ensures loading flags update during subsequent refetches.

### Q3: How do you pass dynamic parameters into a GraphQL query with useQuery?
- A) By interpolating strings directly into the query template
- B) By passing the variables property in the second configuration argument: useQuery(QUERY, { variables: { id: "123" } })
- C) By setting global window variables
- D) Variables are not supported in GraphQL
**Answer:** B
**Explanation:** Variables are supplied via the variables option in useQuery's options object, safely serialized and sent alongside the query document.

### Q4: What happens if a component using useQuery unmounts before the network request resolves?
- A) The browser throws an unhandled rejection error
- B) Apollo Client completes the network request in the background, writes the result to the normalized cache, and prevents memory leaks on the unmounted component
- C) The server cancels the database transaction
- D) The client logs out
**Answer:** B
**Explanation:** Apollo decouples network caching from individual component lifecycles; results are cached safely without triggering React state updates on unmounted nodes.

### Q5: What is the benefit of defining TypeScript interfaces for ProjectData and ProjectVars?
- A) It compiles the GraphQL query to C#
- B) It gives complete compile-time type safety for data properties and variable arguments, preventing undefined field errors
- C) It encrypts the network response
- D) It bypasses backend validation
**Answer:** B
**Explanation:** Parameterizing useQuery<Data, Variables> provides IntelliSense autocompletion and compile-time validation across all queried fields and variables.

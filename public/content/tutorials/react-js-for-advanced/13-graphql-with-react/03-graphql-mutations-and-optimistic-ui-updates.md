# GraphQL Mutations and Optimistic UI Updates

While queries read data, **Mutations** modify server-side resources. In high-performance enterprise applications, waiting 500ms for a network roundtrip before updating a "Like", "Checkmark", or "Status" button creates perceived lag. **Optimistic UI updates** immediately render expected mutations in the UI before server confirmation, rolling back cleanly if the request fails.

---

## 1. Anatomy of `useMutation`

```tsx
const [mutateFunction, { data, loading, error }] = useMutation(MUTATION_DOCUMENT, options);
```

- **`mutateFunction(options)`:** Dispatches the mutation request.
- **`refetchQueries`:** Specifies queries to refetch after mutation succeeds.
- **`update(cache, { data })`:** Directly updates the normalized cache without triggering extra network requests.
- **`optimisticResponse`:** Provides temporary synthetic data written to the cache immediately upon dispatch.

---

## 2. Implementing Optimistic Updates

Consider toggling a task's `completed` status:

```tsx
import React from "react";
import { gql, useMutation } from "@apollo/client";

const TOGGLE_TASK_MUTATION = gql`
  mutation ToggleTask($id: ID!, $completed: Boolean!) {
    toggleTask(id: $id, completed: $completed) {
      id
      completed
      __typename
    }
  }
`;

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  const [toggleTask, { loading }] = useMutation(TOGGLE_TASK_MUTATION);

  const handleToggle = () => {
    toggleTask({
      variables: {
        id: task.id,
        completed: !task.completed,
      },
      // 1. OPTIMISTIC RESPONSE: Rendered instantly in 0ms!
      optimisticResponse: {
        toggleTask: {
          id: task.id,
          completed: !task.completed,
          __typename: "Task",
        },
      },
      // 2. Direct cache manipulation (if not automatically normalized by ID)
      update(cache, { data }) {
        if (!data?.toggleTask) return;
        cache.modify({
          id: cache.identify({ __typename: "Task", id: task.id }),
          fields: {
            completed() {
              return data.toggleTask.completed;
            },
          },
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg text-white">
      <span className={task.completed ? "line-through text-slate-500" : "text-slate-200"}>
        {task.title}
      </span>

      <button
        onClick={handleToggle}
        className={`px-3 py-1 rounded text-xs font-semibold transition ${
          task.completed
            ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
            : "bg-cyan-600 text-white hover:bg-cyan-500"
        }`}
      >
        {task.completed ? "Mark Incomplete" : "Mark Done"}
      </button>
    </div>
  );
}
```

---

## 3. How Apollo Handles Failures

If the server rejects the mutation (e.g. `500 Internal Server Error` or permission denied):
1. Apollo Client detects the network error.
2. It automatically **rolls back** the optimistic snapshot from the cache.
3. The UI instantaneously returns to its previous valid state without manual recovery code!

---

## 4. Cache Eviction on Deletion

When deleting records, use `cache.evict` to purge the deleted entity from memory:

```tsx
const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
  update(cache, { data }) {
    const normalizedId = cache.identify({ __typename: "Task", id: deletedId });
    cache.evict({ id: normalizedId });
    cache.gc(); // Garbage collect dangling references
  },
});
```

---

## Practice Quiz

### Q1: What is the primary benefit of an "Optimistic UI Update"?
- A) It skips server-side validation completely
- B) It immediately reflects the anticipated result in the UI before the network request completes, making the application feel instantaneous
- C) It compresses database records
- D) It reduces CPU temperature
**Answer:** B
**Explanation:** Optimistic UI writes the expected outcome to the local cache immediately, eliminating perceived latency for the user while the mutation finishes across the network.

### Q2: What happens if an optimistic mutation fails due to a network outage or 500 error?
- A) The entire application crashes
- B) Apollo Client automatically discards the optimistic transaction and rolls the cache back to its prior confirmed state
- C) The user is immediately logged out
- D) The browser tab reloads automatically
**Answer:** B
**Explanation:** Apollo's cache implements transactional layers; if a mutation fails, the optimistic layer is discarded and the cache reverts to confirmed server state.

### Q3: Why is __typename mandatory inside optimisticResponse payloads?
- A) It is required for CSS styling
- B) Apollo Client's cache requires __typename alongside id to identify and normalize the entity record (e.g. "Task:123")
- C) To make TypeScript compile faster
- D) It specifies the user's account tier
**Answer:** B
**Explanation:** Normalization keys depend on ${__typename}:${id}. Without __typename, Apollo cannot locate the entity in the cache to apply the optimistic patch.

### Q4: When should you use cache.evict({ id }) inside a mutation's update callback?
- A) When creating a new user
- B) When deleting or archiving an entity, purging it from the normalized cache so all queries observing it update immediately
- C) When logging in
- D) When changing colors
**Answer:** B
**Explanation:** cache.evict purges the entity from the cache, which informs all active queries that the record is gone and updates the UI accordingly.

### Q5: What is the trade-off between refetchQueries and manual cache.modify()?
- A) refetchQueries is simple but makes extra network roundtrips; cache.modify updates the UI instantly in memory with zero extra network overhead
- B) cache.modify only works on mobile devices
- C) refetchQueries is deprecated in Apollo Client
- D) There is no difference
**Answer:** A
**Explanation:** refetchQueries issues fresh HTTP requests to reload queries, while manual cache updates patch the normalized cache in memory with zero network overhead.

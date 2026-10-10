# Optimistic UI Updates with React useOptimistic Hook

In high-performance web applications, waiting 500ms for a backend database write before updating the UI feels sluggish. **Optimistic UI Updates** provide instantaneous visual feedback by updating the UI immediately under the assumption that the server request will succeed, and rolling back gracefully if an error occurs. React 19 and Next.js 15 provide the official **`useOptimistic`** hook for this pattern.

---

## 1. What is `useOptimistic`?

The `useOptimistic` hook lets you show a different state while an async action is in flight:
1. User clicks "Like" or submits a message.
2. The UI updates instantly ($0\text{ms}$ delay) with temporary optimistic data.
3. The Server Action runs in the background.
4. Once the server responds, the optimistic state is replaced by the actual persistent state.
5. If the server throws an error, the UI rolls back to the original state automatically!

---

## 2. Implementing Optimistic Course Likes

```tsx
// components/CourseLikeButton.tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleCourseLikeAction } from '@/app/actions/like-actions';

interface LikeProps {
  courseId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export default function CourseLikeButton({
  courseId,
  initialLikes,
  initialHasLiked
}: LikeProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic State definition
  const [optimisticState, setOptimisticState] = useOptimistic(
    { likes: initialLikes, hasLiked: initialHasLiked },
    (current, update: boolean) => ({
      likes: update ? current.likes + 1 : current.likes - 1,
      hasLiked: update
    })
  );

  const handleToggle = () => {
    const nextLikedState = !optimisticState.hasLiked;

    // 1. Immediately update UI state optimistically!
    startTransition(async () => {
      setOptimisticState(nextLikedState);
      try {
        // 2. Perform actual server mutation in background
        await toggleCourseLikeAction(courseId, nextLikedState);
      } catch (error) {
        console.error('Failed to update like status on server:', error);
        // React automatically rolls back the optimistic state upon transition failure!
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
        optimisticState.hasLiked
          ? 'bg-rose-500 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      ❤️ {optimisticState.likes} Likes
    </button>
  );
}
```

---

# Multiple Choice Questions

### 1. What is the primary purpose of an Optimistic UI update in web applications?
A. To guarantee that server databases never experience errors.
B. To provide instantaneous user feedback by updating the UI immediately while the asynchronous server mutation completes in the background.
C. To reduce server electricity costs.
D. To disable CSS transitions.
**Answer:** B
**Explanation:** Optimistic UI delivers an immediate, responsive user experience by assuming success and updating the interface before the network response returns.
---

### 2. Which React hook manages optimistic state during asynchronous transitions?
A. `useMemo`
B. `useOptimistic`
C. `useCallback`
D. `useLayoutEffect`
**Answer:** B
**Explanation:** `useOptimistic` is the official React hook designed specifically for optimistic UI updates during transitions.
---

### 3. What happens if the background Server Action fails or throws an unhandled error during an optimistic update?
A. The browser closes.
B. React automatically discards the optimistic state and reverts the UI to the actual server-confirmed state.
C. The database drops the collection.
D. The page freezes permanently.
**Answer:** B
**Explanation:** If an error occurs or the transition finishes without state confirmation, React automatically rolls back to the original verified state.
---

### 4. Which hook is typically paired with `useOptimistic` to manage the asynchronous execution lifecycle?
A. `useTransition`
B. `useRef`
C. `useId`
D. `useImperativeHandle`
**Answer:** A
**Explanation:** `useTransition` provides `startTransition`, allowing optimistic state updates and async actions to execute inside a non-blocking transition.
---

### 5. Why is Optimistic UI particularly beneficial for social media actions like Likes, Upvotes, and Bookmark toggles?
A. Because social networks cannot connect to databases.
B. Users expect immediate visual feedback when clicking hearts or bookmark buttons without waiting for network round-trip latencies.
C. It allows users to like posts without an internet connection permanently.
D. It prevents spam comments.
**Answer:** B
**Explanation:** Instant tactile responsiveness on high-frequency interactions like likes and bookmarks makes applications feel fast and native.
---

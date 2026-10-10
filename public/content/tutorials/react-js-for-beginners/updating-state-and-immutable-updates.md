# Updating State and Immutable Updates

## 1. The Rule of Immutability
In React, state should be treated as **immutable (read-only)**. You must never modify existing state objects or arrays directly in place. Instead, always replace them with a fresh copy containing the desired changes.

```jsx
// ❌ Direct Mutation: FORBIDDEN!
const [user, setUser] = useState({ name: 'Rohit', age: 24 });
user.age = 25;       // Direct mutation does NOT change object reference!
setUser(user);       // React sees same reference (Object.is) -> NO RE-RENDER!

// ✅ Immutable Update: Create a new object copy
setUser({
  ...user,           // Copy existing properties using object spread
  age: 25            // Overwrite specific property
});
```

Because React uses reference equality (`Object.is`) to detect state changes, mutating an existing object or array in place preserves the same memory address. React assumes nothing has changed and bails out of re-rendering.

## 2. Functional State Updates (Updater Functions)
State updates are batched and asynchronous. If your new state depends on the immediately preceding state, you should pass a **callback function** to your state setter instead of a raw value:

```jsx
const [count, setCount] = useState(0);

function handleMultipleIncrements() {
  // ❌ Problematic: All three calls read 'count' as 0 in the current closure!
  // setCount(count + 1); // 0 + 1 = 1
  // setCount(count + 1); // 0 + 1 = 1
  // setCount(count + 1); // 0 + 1 = 1
  // Result: count becomes 1, NOT 3!

  // ✅ Correct: Functional updates guarantee access to the latest pending state
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1);
  // Result: count correctly becomes 3!
}
```

## 3. Immutably Updating Arrays in State
Arrays in JavaScript are reference types. When adding, removing, or modifying array elements in state, use non-mutating array methods:

| Action | ❌ Mutating (Avoid) | ✅ Immutable (Preferred) |
| :--- | :--- | :--- |
| **Add item** | `arr.push(item)`, `arr.unshift(item)` | `[...arr, item]` or `[item, ...arr]` |
| **Remove item** | `arr.splice(index, 1)`, `arr.pop()` | `arr.filter(item => item.id !== id)` |
| **Update item** | `arr[index] = newValue` | `arr.map(item => item.id === id ? { ...item, ...newValue } : item)` |
| **Sort / Reverse** | `arr.sort()`, `arr.reverse()` | `[...arr].sort()`, `[...arr].reverse()` |

### Concrete Array Update Examples:
```jsx
const [todos, setTodos] = useState([
  { id: 1, text: 'Master React JSX', completed: true },
  { id: 2, text: 'Learn useState Hook', completed: false }
]);

// 1. Adding a new todo:
const addTodo = (newText) => {
  const newTodo = { id: Date.now(), text: newText, completed: false };
  setTodos(prev => [...prev, newTodo]);
};

// 2. Toggling completion status:
const toggleTodo = (id) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
};

// 3. Deleting a todo:
const deleteTodo = (id) => {
  setTodos(prev => prev.filter(todo => todo.id !== id));
};
```

## 4. Immutably Updating Nested Objects
When updating nested objects, remember that the object spread operator (`...`) only performs a **shallow copy**. Nested objects must be explicitly copied at every level of depth:

```jsx
const [student, setStudent] = useState({
  name: 'Kavita',
  contact: {
    email: 'kavita@example.com',
    city: 'New Delhi'
  }
});

// Updating nested city property immutably:
setStudent(prev => ({
  ...prev,
  contact: {
    ...prev.contact,
    city: 'Bengaluru'
  }
}));
```

---

## Practice Quiz

### Q1: Why does direct mutation of an object in React state (e.g. `user.name = 'New'; setUser(user);`) often fail to trigger a re-render?
- A) React crashes whenever dots are used in variable assignments
- B) React uses reference equality (`Object.is`) to detect changes; since the object memory address remains identical, React bails out of rendering
- C) Modern browsers prohibit editing object properties
- D) Objects in JavaScript are automatically frozen by the V8 engine
**Answer:** B
**Explanation:** React checks if the previous and next state references are different. Mutating an object in place keeps the same memory reference, causing React to conclude that no change occurred and skip the re-render.

### Q2: When should you pass a callback function (e.g. `setCount(prev => prev + 1)`) to a state setter?
- A) Only when connecting to MongoDB
- B) Whenever the new state value depends on the previous state value
- C) Only when the component is being unmounted
- D) Whenever you want to prevent the component from re-rendering
**Answer:** B
**Explanation:** The functional updater form `setState(prev => ...)` guarantees that you are computing the next state based on the most up-to-date pending state, preventing stale closure issues during batched updates.

### Q3: Which array method is recommended for removing an item from state without mutating the original array?
- A) `arr.splice()`
- B) `arr.pop()`
- C) `arr.filter()`
- D) `arr.shift()`
**Answer:** C
**Explanation:** `filter()` is a non-mutating method that returns a brand new array excluding the filtered elements, adhering to React's immutability requirements.

### Q4: How do you add an item to the end of an array stored in state using the spread operator?
- A) `setList(list.push(newItem))`
- B) `setList([...list, newItem])`
- C) `setList(list.append(newItem))`
- D) `setList({ list, newItem })`
**Answer:** B
**Explanation:** `[...list, newItem]` creates a new array containing all elements of `list` followed by `newItem`, leaving the original state array untouched.

### Q5: What is a key limitation of the spread operator (`...`) when copying objects with nested properties?
- A) It can only copy strings, not numbers
- B) It performs only a shallow copy; nested objects still share references unless explicitly spread at each level
- C) It is unsupported in modern JavaScript
- D) It automatically converts all properties to uppercase
**Answer:** B
**Explanation:** The spread operator creates a shallow copy. Any nested objects or arrays retain references to the original memory locations unless deeply cloned or manually spread at each level.

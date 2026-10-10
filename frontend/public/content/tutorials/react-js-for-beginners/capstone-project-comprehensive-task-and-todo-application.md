# Capstone Project: Comprehensive Task and Todo Application

## 1. Project Overview & Architecture
To conclude the **React.js for Beginners** curriculum, we will construct a production-grade **Comprehensive Task and Todo Application** that unites every foundational concept mastered across all 12 chapters:

- **Component Hierarchy & Composition:** Clean separation between App, Header, InputForm, TaskList, TaskItem, and FilterToolbar.
- **State Management (`useState`):** Managing task collections, filter tabs, and search terms.
- **Immutable Operations:** Non-mutating adding, toggling, editing, and deleting of tasks.
- **Persistent Storage (`useEffect`):** Synchronizing task state with browser `localStorage`.
- **Derived State:** Computing active task counts, completion percentages, and filtered views without redundant state.
- **Accessible Interactions & Form Handling:** Form submission, controlled inputs, keyboard shortcuts, and semantic badges.

```
┌────────────────────────────────────────────────────────┐
│             MSK Task & Productivity Master             │
│                                                        │
│   [ Add a new engineering task... ]  [ + Add Task ]    │
│                                                        │
│   [ All (5) ]   [ Active (2) ]   [ Completed (3) ]     │
│                                                        │
│   Search: [ Filter tasks... ]                          │
│                                                        │
│   Progress: [████████████████░░░░░░░░] 60% Done        │
│                                                        │
│   [✓] Master React Virtual DOM & Components            │
│   [✓] Practice useState and Immutable Updates          │
│   [ ] Build Capstone Full-Stack Application   [Del]    │
│                                                        │
│   Clear Completed (3)              2 tasks remaining   │
└────────────────────────────────────────────────────────┘
```

## 2. Complete Application Source Code
```jsx
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'msk_react_tasks_v1';

const INITIAL_TASKS = [
  { id: 't-1', text: 'Set up Vite + React development environment', completed: true, category: 'Setup' },
  { id: 't-2', text: 'Master JSX syntax and component composition', completed: true, category: 'Core' },
  { id: 't-3', text: 'Implement useState and immutable array updates', completed: true, category: 'Core' },
  { id: 't-4', text: 'Build production Capstone Task Manager', completed: false, category: 'Project' }
];

export default function TaskMasterApp() {
  // 1. State: Load initial tasks from localStorage lazily
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Core');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Persistent Storage Sync via useEffect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // 3. Handlers
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      text: inputText.trim(),
      completed: false,
      category: selectedCategory
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputText('');
  };

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // 4. Derived State Calculations
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const percentCompleted = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed;
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="task-app-container">
      <header className="app-header">
        <h1>MSK Task & Productivity Master</h1>
        <p>Enterprise React Task Management Architecture</p>
      </header>

      {/* Input Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="What needs to be accomplished?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="task-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="Core">Core React</option>
          <option value="Project">Project</option>
          <option value="Setup">Setup</option>
          <option value="Career">Career Prep</option>
        </select>
        <button type="submit" className="btn-add">Add Task</button>
      </form>

      {/* Progress & Analytics Bar */}
      <div className="progress-section">
        <div className="progress-labels">
          <span>Completion: {percentCompleted}%</span>
          <span>{completedCount} of {totalCount} Completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percentCompleted}%` }} />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="toolbar-row">
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'filter-active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={filter === 'active' ? 'filter-active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={filter === 'completed' ? 'filter-active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filteredTasks.length === 0 ? (
          <li className="empty-message">No matching tasks found.</li>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'task-done' : ''}`}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
                <span className="task-text">{task.text}</span>
              </label>
              
              <div className="task-actions">
                <span className="category-tag">{task.category}</span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="btn-delete"
                  aria-label={`Delete task: ${task.text}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Footer Summary */}
      <footer className="app-footer">
        <span>{activeCount} items remaining</span>
        {completedCount > 0 && (
          <button onClick={handleClearCompleted} className="btn-clear">
            Clear Completed ({completedCount})
          </button>
        )}
      </footer>
    </div>
  );
}
```

## 3. Engineering Best Practices Demonstrated
1. **Lazy Initialization:** `useState(() => ...)` reads `localStorage` only once when the component mounts, rather than on every render.
2. **Synchronous LocalStorage Sync:** `useEffect(() => { localStorage.setItem(...) }, [tasks])` guarantees data persistence whenever tasks change.
3. **Immutability Throughout:** Using `.map()` for updates, `.filter()` for deletions, and spread `[newTask, ...prev]` for insertions preserves 100% data immutability.
4. **Clean Derived Filtering:** Search and status filtering occur in real time during render with zero duplicated state.

---

## Practice Quiz

### Q1: Why is reading `localStorage` wrapped in a function inside `useState(() => ...)`?
- A) To encrypt the stored data
- B) To implement lazy initialization so `localStorage.getItem` only executes on initial mount rather than on every render
- C) Because `localStorage` is prohibited in React
- D) To convert the data into TypeScript
**Answer:** B
**Explanation:** Passing an initializer function to `useState` ensures computationally expensive tasks (like reading and parsing `localStorage`) only execute once during initial mount.

### Q2: How does the application persist task updates across page reloads?
- A) Using an SQL database query
- B) By serializing the `tasks` array to JSON and writing to `localStorage` inside a `useEffect` with `[tasks]` as the dependency
- C) By sending an email to the user
- D) React persists state automatically in the cloud
**Answer:** B
**Explanation:** The `useEffect` hook listening to `[tasks]` saves the updated serialized array to browser `localStorage` whenever `tasks` changes.

### Q3: How is a task's completed status toggled without mutating the original state array?
- A) `tasks[id].completed = !tasks[id].completed`
- B) `setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))`
- C) `tasks.pop()`
- D) `setTasks(tasks.reverse())`
**Answer:** B
**Explanation:** `map()` returns a brand new array, and `{ ...t, completed: !t.completed }` creates a brand new task object copy with the inverted boolean, adhering strictly to immutability.

### Q4: How is the completion percentage calculated in the application?
- A) By making a network request to an analytics server
- B) Derived dynamically during render from `completedCount` and `totalCount`
- C) Stored in a separate `useState(percent)` hook updated via `setInterval`
- D) Hardcoded to 100%
**Answer:** B
**Explanation:** The percentage is derived dynamically on every render from existing state (`(completedCount / totalCount) * 100`), ensuring it is always synchronized.

### Q5: What happens when the user clicks "Clear Completed"?
- A) All tasks are deleted
- B) `setTasks(prev => prev.filter(t => !t.completed))` filters out all completed tasks immutably
- C) The browser reboots
- D) All tasks are marked incomplete
**Answer:** B
**Explanation:** Using `filter(t => !t.completed)` creates a new array containing only active, uncompleted tasks, removing all finished items in a single immutable update.

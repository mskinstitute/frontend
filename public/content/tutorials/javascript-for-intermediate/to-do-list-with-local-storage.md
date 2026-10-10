# Project: To-Do List with Local Storage

In this project, you will build an enterprise-grade **To-Do Task Manager** featuring persistent `localStorage` synchronization, task filtering (All, Active, Completed), inline editing, and empty-state handling.

---

## 1. Project Specifications

1. **State Persistence:** All tasks are persisted to `localStorage` as JSON.
2. **Task Schema:** Each task is an object `{ id: string, text: string, completed: boolean, createdAt: number }`.
3. **Filtering:** Dynamic filter buttons for "All", "Active", and "Completed".
4. **Action Capabilities:** Add task, toggle completion, delete task, and "Clear Completed".
5. **DOM Performance:** Efficient event delegation on the list container.

---

## 2. HTML Markup (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TaskFlow: Persistent Task Manager</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="app-card">
    <header class="app-header">
      <h1>TaskFlow</h1>
      <p>Organize your day with local persistence</p>
    </header>

    <form id="todo-form" class="todo-form">
      <input type="text" id="todo-input" placeholder="What needs to be done?" required autofocus />
      <button type="submit" class="btn-add">Add Task</button>
    </form>

    <div class="filters-row">
      <div class="filter-group">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
      </div>
      <button id="btn-clear-completed" class="btn-text">Clear Completed</button>
    </div>

    <ul id="todo-list" class="todo-list"></ul>

    <footer class="app-footer">
      <span id="items-left">0 items remaining</span>
    </footer>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

---

## 3. Styling the App (style.css)

```css
:root {
  --primary: #3b82f6;
  --bg: #0f172a;
  --card: #1e293b;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --border: #334155;
  --danger: #ef4444;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.app-card {
  background: var(--card);
  border-radius: 1rem;
  max-width: 550px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.todo-form {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.todo-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: #0f172a;
  color: var(--text);
  font-size: 1rem;
}

.btn-add {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.filter-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.filter-btn.active {
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-text:hover { color: var(--danger); }

.todo-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #0f172a;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.todo-item.completed span {
  text-decoration: line-through;
  color: var(--text-muted);
}

.todo-item span { flex: 1; word-break: break-word; }

.btn-del {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 1.1rem;
}

.app-footer {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}
```

---

## 4. Application Logic (app.js)

```javascript
const STORAGE_KEY = 'taskflow_todos_v1';

// App State
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let activeFilter = 'all';

// DOM Selectors
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const itemsLeft = document.querySelector('#items-left');
const clearCompletedBtn = document.querySelector('#btn-clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  render();
}

function render() {
  todoList.innerHTML = '';

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'toggle-check';

    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-del';
    delBtn.innerHTML = '&times;';
    delBtn.setAttribute('aria-label', 'Delete task');

    li.append(checkbox, textSpan, delBtn);
    todoList.appendChild(li);
  });

  const remaining = todos.filter(t => !t.completed).length;
  itemsLeft.textContent = `${remaining} ${remaining === 1 ? 'item' : 'items'} remaining`;
}

// Add Todo
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: 'todo_' + Date.now(),
    text,
    completed: false,
    createdAt: Date.now()
  });

  input.value = '';
  saveAndRender();
});

// Event Delegation on List (Toggle & Delete)
todoList.addEventListener('click', (e) => {
  const itemEl = e.target.closest('.todo-item');
  if (!itemEl) return;
  const id = itemEl.dataset.id;

  if (e.target.classList.contains('toggle-check')) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
  } else if (e.target.classList.contains('btn-del')) {
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
  }
});

// Clear Completed
clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveAndRender();
});

// Filter Tabs
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

// Initial Render
render();
```

---

## Practice Quiz

### Q1: Why is Event Delegation used on the todoList element instead of attaching listeners to every item?
- A) It prevents tasks from having unique IDs
- B) It handles clicks on dynamically created tasks without attaching and detaching hundreds of listeners
- C) It compresses the JSON file in localStorage
- D) It encrypts user input
**Answer:** B
**Explanation:** Event delegation listens at the parent `<ul>` container, ensuring all existing and future tasks are handled efficiently with zero memory leaks.

### Q2: What function deserializes tasks stored in localStorage back into a JavaScript array?
- A) JSON.stringify()
- B) JSON.parse()
- C) localStorage.toArray()
- D) Array.from()
**Answer:** B
**Explanation:** `JSON.parse()` converts the serialized JSON string stored in `localStorage` back into a native JavaScript array of objects.

### Q3: What happens when the user clicks the "Clear Completed" button?
- A) All tasks are deleted
- B) The array is filtered to retain only tasks where completed === false, and state is saved
- C) The page reloads
- D) Storage quota is cleared
**Answer:** B
**Explanation:** Filtering with `todos.filter(t => !t.completed)` retains only active tasks, removing all finished items in one operation.

### Q4: How is a task's strike-through appearance achieved when marked as completed?
- A) By deleting the text
- B) By toggling the .completed class on the <li> element, styled with text-decoration: line-through in CSS
- C) By replacing letters with hyphens
- D) By decreasing font size to 0
**Answer:** B
**Explanation:** Adding the `.completed` class applies CSS rules (`text-decoration: line-through; color: var(--text-muted);`).

### Q5: What is the benefit of generating unique IDs using 'todo_' + Date.now()?
- A) It provides simple, collision-resistant unique timestamps for tasks in client-side state
- B) It guarantees cryptographic security
- C) It connects to an online clock server
- D) It orders tasks alphabetically
**Answer:** A
**Explanation:** `Date.now()` produces the current millisecond timestamp, providing a clean unique identifier for client-side lists.

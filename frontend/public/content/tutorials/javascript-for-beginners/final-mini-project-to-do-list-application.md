# Capstone Project: Production-Grade To-Do List Application

Congratulations on reaching the capstone project of the **JavaScript for Beginners** course! In this project, we combine all the fundamental concepts we've learned—variables, arrays, objects, functions, event handling, DOM manipulation, and `localStorage`—into a complete, commercial-grade **To-Do List Web Application**.

---

## 1. Application Features

Our Capstone To-Do Application includes:
1. **Task Management**: Add tasks, delete tasks, and toggle completed status.
2. **Category Filtering**: Filter tasks by **All**, **Active**, and **Completed**.
3. **Local Storage Persistence**: Automatically serialize and persist task state across sessions.
4. **Task Counter & Cleanup**: Show real-time active task counts and provide a "Clear Completed" button.
5. **Empty State**: Beautiful UI when no tasks exist.

---

## 2. The HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskMaster To-Do | MSK Institute</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
  <div class="app-container">
    <header class="app-header">
      <h1>TaskMaster</h1>
      <p>Stay organized and ship code every day.</p>
    </header>

    <!-- Task Input Form -->
    <form id="todo-form">
      <input type="text" id="todo-input" placeholder="What needs to be done?" autocomplete="off">
      <button type="submit" id="add-btn">Add Task</button>
    </form>

    <!-- Filter Buttons -->
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="completed">Completed</button>
    </div>

    <!-- Task List -->
    <ul id="todo-list" class="todo-list"></ul>

    <!-- Footer Stats -->
    <footer class="app-footer">
      <span id="items-left">0 items left</span>
      <button id="clear-completed-btn" class="clear-btn">Clear Completed</button>
    </footer>
  </div>
</body>
</html>
```

---

## 3. CSS Styling (`style.css`)

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.app-container {
  background: #1e293b;
  width: 100%;
  max-width: 520px;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.app-header h1 {
  font-size: 2rem;
  color: #38bdf8;
  margin-bottom: 0.25rem;
}

.app-header p {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

#todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

#todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
}

#todo-input:focus {
  outline: none;
  border-color: #38bdf8;
}

#add-btn {
  background: #0284c7;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #334155;
  padding-bottom: 0.75rem;
}

.filter-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-weight: 500;
  border-radius: 0.25rem;
}

.filter-btn.active {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
}

.todo-list {
  list-style: none;
  max-height: 350px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #0f172a;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #64748b;
}

.todo-text {
  flex: 1;
  margin: 0 0.75rem;
  cursor: pointer;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.25rem;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #334155;
  font-size: 0.875rem;
  color: #94a3b8;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}

.clear-btn:hover { color: #f8fafc; }
```

---

## 4. The Complete JavaScript Application (`app.js`)

```javascript
// 1. State Management
let todos = JSON.parse(localStorage.getItem("todos_data")) || [];
let currentFilter = "all";

// 2. Select DOM Elements
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const itemsLeftSpan = document.querySelector("#items-left");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clear-completed-btn");

// 3. Helper: Save State to LocalStorage
function saveTodos() {
  localStorage.setItem("todos_data", JSON.stringify(todos));
}

// 4. Render Function: Renders UI based on Filter and State
function render() {
  todoList.innerHTML = "";

  // Filter tasks based on current tab
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true; // 'all'
  });

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<li style="text-align: center; color: #64748b; padding: 1rem;">No tasks found</li>`;
  }

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" class="toggle-check" ${todo.completed ? "checked" : ""}>
      <span class="todo-text">${escapeHTML(todo.text)}</span>
      <button class="delete-btn" aria-label="Delete Task">&times;</button>
    `;

    // Toggle Task Status
    const checkbox = li.querySelector(".toggle-check");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    // Delete Task
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });

  // Update active count badge
  const activeCount = todos.filter((t) => !t.completed).length;
  itemsLeftSpan.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

// Security: Prevent XSS
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 5. Actions: Add, Toggle, Delete, Clear
function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false
  };
  todos.push(newTodo);
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

// 6. Event Listeners
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text.length > 0) {
    addTodo(text);
    todoInput.value = "";
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// Initial Load
render();
```

---

## Practice Quiz

### Q1: How does `JSON.stringify(todos)` assist with `localStorage` persistence?
- A) It formats text with colors
- B) It serializes JavaScript array/object data structures into a valid JSON string, which `localStorage` requires
- C) It decompresses images
- D) It submits code to GitHub
**Answer:** B
**Explanation:** `localStorage` can only store string key-value pairs; `JSON.stringify()` converts JavaScript objects into a JSON string format for storage.

### Q2: What technique is used to generate unique IDs for each task item in `Date.now().toString()`?
- A) It uses the current millisecond timestamp as an integer string
- B) It asks the operating system for a UUID
- C) It counts from 1 to 10
- D) It calls a Google API
**Answer:** A
**Explanation:** `Date.now()` returns the number of milliseconds since the Unix Epoch, creating an instantaneous, practical unique ID for client-side lists.

### Q3: Why does `todoForm.addEventListener("submit", ...)` call `e.preventDefault()`?
- A) To prevent the browser from reloading the page upon form submission
- B) To delete the task
- C) To log out the user
- D) To disable the submit button forever
**Answer:** A
**Explanation:** Default form submission initiates a full-page HTTP refresh; `e.preventDefault()` prevents this so JavaScript can handle state in-memory.

### Q4: Which array method is used to filter out completed tasks when running `clearCompleted()`?
- A) `todos.splice()`
- B) `todos.filter(todo => !todo.completed)`
- C) `todos.map()`
- D) `todos.pop()`
**Answer:** B
**Explanation:** `.filter()` returns a new array containing only items that satisfy the predicate function (`!todo.completed`), effectively discarding completed items.

### Q5: What does the spread syntax `{ ...todo, completed: !todo.completed }` accomplish inside `toggleTodo`?
- A) Deletes the todo
- B) Creates a new shallow copy of the `todo` object while overriding only the `completed` property with its inverted boolean value
- C) Concatenates two strings
- D) Throws an error
**Answer:** B
**Explanation:** The object spread operator copies all existing properties of `todo` and updates the `completed` property immutably.

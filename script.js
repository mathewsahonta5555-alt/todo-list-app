const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = [];

// Load saved tasks from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("mathew_todos");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(renderTask);
    updateCount();
  }
});

function saveTasks() {
  localStorage.setItem("mathew_todos", JSON.stringify(tasks));
}

function updateCount() {
  const remaining = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;
  taskCount.textContent = `${remaining} of ${total} tasks left`;
}

function createTaskObject(text) {
  return {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toLocaleTimeString()
  };
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = createTaskObject(text);
  tasks.push(task);
  renderTask(task);
  saveTasks();
  updateCount();

  taskInput.value = "";
  taskInput.focus();
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;

  const main = document.createElement("div");
  main.className = "task-main";

  const checkbox = document.createElement("div");
  checkbox.className = "task-checkbox";
  if (task.completed) checkbox.classList.add("checked");

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = task.text;
  if (task.completed) textSpan.classList.add("completed");

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const timeSpan = document.createElement("span");
  timeSpan.className = "task-time";
  timeSpan.textContent = task.createdAt;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "✕";

  main.appendChild(checkbox);
  main.appendChild(textSpan);

  actions.appendChild(timeSpan);
  actions.appendChild(deleteBtn);

  li.appendChild(main);
  li.appendChild(actions);
  taskList.appendChild(li);

  // Events
  checkbox.addEventListener("click", () => toggleTask(task.id));
  textSpan.addEventListener("click", () => toggleTask(task.id));
  deleteBtn.addEventListener("click", () => deleteTask(task.id, li));
}

function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  refreshList();
}

function deleteTask(id, element) {
  element.style.opacity = "0";
  element.style.transform = "translateY(4px) scale(0.98)";
  setTimeout(() => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    refreshList();
  }, 150);
}

function refreshList() {
  taskList.innerHTML = "";
  tasks.forEach(renderTask);
  updateCount();
}

// Add task with button or Enter key
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  refreshList();
});

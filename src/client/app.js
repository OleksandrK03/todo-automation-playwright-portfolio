// State
const state = {
  tasks: [],
  counts: { total: 0, active: 0, completed: 0 },
  filter: "all",
  priorityFilter: "all",
  sortBy: "createdAt",
  searchQuery: ""
};

// DOM References
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskPrioritySelect = document.getElementById("task-priority");
const taskDueDateInput = document.getElementById("task-duedate");
const taskDescInput = document.getElementById("task-desc");
const formError = document.getElementById("form-error");

const tasksListEl = document.getElementById("tasks-list");
const emptyStateEl = document.getElementById("empty-state");
const activeCounterEl = document.querySelector('[data-testid="active-tasks-counter"]');
const statTotalEl = document.querySelector('[data-testid="stat-total"]');
const statActiveEl = document.querySelector('[data-testid="stat-active"]');
const statCompletedEl = document.querySelector('[data-testid="stat-completed"]');

const searchInput = document.getElementById("search-input");
const searchClearBtn = document.getElementById("search-clear-btn");
const filterTabs = document.querySelectorAll(".filter-tab");
const priorityFilterSelect = document.getElementById("priority-filter");
const sortSelect = document.getElementById("sort-select");
const resetDataBtn = document.getElementById("reset-data-btn");

// Modal Elements
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editTaskId = document.getElementById("edit-task-id");
const editTaskTitle = document.getElementById("edit-task-title");
const editTaskPriority = document.getElementById("edit-task-priority");
const editTaskDueDate = document.getElementById("edit-task-duedate");
const editTaskDesc = document.getElementById("edit-task-desc");
const editModalError = document.getElementById("edit-modal-error");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const modalCloseX = document.getElementById("modal-close-x");
const toastContainer = document.getElementById("toast-container");

// Simulated JSON Database Service (works when offline or standalone)
const SimulatedDB = {
  STORAGE_KEY: "taskmaster_simulated_db",

  async getInitialSeedTasks() {
    try {
      const res = await fetch("tasks.json");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    return [
      {
        id: "task-1",
        title: "Buy groceries for dinner",
        description: "Milk, fresh bread, eggs, and coffee",
        priority: "high",
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
        completed: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "task-2",
        title: "Schedule weekly team meeting",
        description: "Discuss project updates and upcoming roadmap",
        priority: "medium",
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
        completed: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "task-3",
        title: "Renew gym membership",
        description: "Check special annual subscription discount",
        priority: "low",
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
        completed: true,
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ];
  },

  async loadTasks() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    const seed = await this.getInitialSeedTasks();
    this.saveTasks(seed);
    return seed;
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  },

  async getAll({ status = "all", priority = "all", search = "", sortBy = "createdAt" } = {}) {
    const all = await this.loadTasks();
    let result = [...all];

    if (status === "active") {
      result = result.filter(t => !t.completed);
    } else if (status === "completed") {
      result = result.filter(t => t.completed);
    }

    if (priority && priority !== "all") {
      result = result.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === "priority") {
        const order = { high: 1, medium: 2, low: 3 };
        return (order[a.priority] || 4) - (order[b.priority] || 4);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const counts = {
      total: all.length,
      active: all.filter(t => !t.completed).length,
      completed: all.filter(t => t.completed).length
    };

    return { tasks: result, counts };
  },

  async create(payload) {
    const all = await this.loadTasks();
    const newTask = {
      id: "task-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      title: payload.title.trim(),
      description: (payload.description || "").trim(),
      priority: (payload.priority || "medium").toLowerCase(),
      dueDate: payload.dueDate || "",
      completed: false,
      createdAt: new Date().toISOString()
    };
    all.unshift(newTask);
    this.saveTasks(all);
    return newTask;
  },

  async update(id, updates) {
    const all = await this.loadTasks();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    const task = all[idx];
    if (typeof updates.title === "string") task.title = updates.title.trim();
    if (typeof updates.description === "string") task.description = updates.description.trim();
    if (typeof updates.priority === "string") task.priority = updates.priority.toLowerCase();
    if (typeof updates.dueDate === "string") task.dueDate = updates.dueDate;
    if (typeof updates.completed === "boolean") task.completed = updates.completed;
    this.saveTasks(all);
    return task;
  },

  async delete(id) {
    const all = await this.loadTasks();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    all.splice(idx, 1);
    this.saveTasks(all);
    return { message: "Task deleted successfully", id };
  },

  async reset() {
    const seed = await this.getInitialSeedTasks();
    this.saveTasks(seed);
    return seed;
  }
};

let useBackend = true;

// API Helpers (delegates to /api/tasks backed by data/tasks.json or falls back to SimulatedDB)
async function fetchTasks() {
  const params = new URLSearchParams();
  if (state.filter !== "all") params.append("status", state.filter);
  if (state.priorityFilter !== "all") params.append("priority", state.priorityFilter);
  if (state.searchQuery) params.append("search", state.searchQuery);
  if (state.sortBy) params.append("sortBy", state.sortBy);

  if (useBackend) {
    try {
      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        state.tasks = data.tasks;
        state.counts = data.counts;
        render();
        return;
      }
      useBackend = false;
    } catch (_) {
      useBackend = false;
    }
  }

  // Simulated DB mode
  try {
    const data = await SimulatedDB.getAll({
      status: state.filter,
      priority: state.priorityFilter,
      search: state.searchQuery,
      sortBy: state.sortBy
    });
    state.tasks = data.tasks;
    state.counts = data.counts;
    render();
  } catch (err) {
    showToast("Error loading tasks: " + err.message, "error");
  }
}

async function createTask(payload) {
  if (useBackend) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? data.details.join(", ") : data.error || "Failed to create task");
      }
      return data;
    } catch (err) {
      if (err.message && err.message.includes("Failed to fetch")) {
        useBackend = false;
      } else {
        throw err;
      }
    }
  }
  return await SimulatedDB.create(payload);
}

async function updateTask(id, payload) {
  if (useBackend) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? data.details.join(", ") : data.error || "Failed to update task");
      }
      return data;
    } catch (err) {
      if (err.message && err.message.includes("Failed to fetch")) {
        useBackend = false;
      } else {
        throw err;
      }
    }
  }
  return await SimulatedDB.update(id, payload);
}

async function deleteTask(id) {
  if (useBackend) {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        return await res.json();
      }
      useBackend = false;
    } catch (_) {
      useBackend = false;
    }
  }
  return await SimulatedDB.delete(id);
}

async function resetMockData() {
  if (useBackend) {
    try {
      const res = await fetch("/api/tasks/reset", { method: "POST" });
      if (res.ok) {
        return await res.json();
      }
      useBackend = false;
    } catch (_) {
      useBackend = false;
    }
  }
  return await SimulatedDB.reset();
}

// UI Feedback
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("data-testid", "toast-item");
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function showFormError(el, message) {
  el.textContent = message;
  el.classList.remove("hidden");
}

function hideFormError(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

// Rendering
function render() {
  // Update stats counters
  statTotalEl.textContent = state.counts.total;
  statActiveEl.textContent = state.counts.active;
  statCompletedEl.textContent = state.counts.completed;
  activeCounterEl.textContent = `${state.counts.active} active task${state.counts.active === 1 ? "" : "s"} left`;

  // Render list
  tasksListEl.innerHTML = "";
  if (state.tasks.length === 0) {
    emptyStateEl.classList.remove("hidden");
    return;
  }
  emptyStateEl.classList.add("hidden");

  const todayStr = new Date().toISOString().split("T")[0];

  state.tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.setAttribute("data-testid", "task-item");
    li.setAttribute("data-task-id", task.id);

    const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;

    li.innerHTML = `
      <div class="task-checkbox-container">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          data-testid="task-checkbox"
          ${task.completed ? "checked" : ""} 
          aria-label="Mark task complete"
        >
      </div>
      <div class="task-content">
        <div class="task-main-row">
          <span class="task-title" data-testid="task-title">${escapeHtml(task.title)}</span>
          <span class="badge badge-priority-${task.priority}" data-testid="task-priority">${task.priority}</span>
          ${task.dueDate ? `
            <span class="badge badge-date ${isOverdue ? "overdue" : ""}" data-testid="task-duedate">
              📅 ${task.dueDate} ${isOverdue ? "(Overdue)" : ""}
            </span>` : ""}
        </div>
        ${task.description ? `<p class="task-desc" data-testid="task-description">${escapeHtml(task.description)}</p>` : ""}
      </div>
      <div class="task-actions">
        <button class="action-btn edit-btn" data-testid="btn-edit-task" title="Edit task">Edit</button>
        <button class="action-btn delete-btn" data-testid="btn-delete-task" title="Delete task">Delete</button>
      </div>
    `;

    // Event listeners for item
    const checkbox = li.querySelector('[data-testid="task-checkbox"]');
    checkbox.addEventListener("change", async () => {
      try {
        await updateTask(task.id, { completed: checkbox.checked });
        await fetchTasks();
        showToast(`Task marked as ${checkbox.checked ? "completed" : "active"}`);
      } catch (err) {
        showToast(err.message, "error");
        checkbox.checked = !checkbox.checked;
      }
    });

    const editBtn = li.querySelector('[data-testid="btn-edit-task"]');
    editBtn.addEventListener("click", () => openEditModal(task));

    const deleteBtn = li.querySelector('[data-testid="btn-delete-task"]');
    deleteBtn.addEventListener("click", async () => {
      try {
        deleteBtn.disabled = true;
        li.style.transition = "opacity 0.2s ease, transform 0.2s ease";
        li.style.opacity = "0.4";
        await deleteTask(task.id);
        showToast("Task deleted", "info");
        await fetchTasks();
      } catch (err) {
        li.style.opacity = "1";
        deleteBtn.disabled = false;
        showToast(err.message, "error");
      }
    });

    tasksListEl.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Modal Handlers
function openEditModal(task) {
  editTaskId.value = task.id;
  editTaskTitle.value = task.title;
  editTaskPriority.value = task.priority;
  editTaskDueDate.value = task.dueDate || "";
  editTaskDesc.value = task.description || "";
  hideFormError(editModalError);
  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  hideFormError(editModalError);
}

// Event Listeners
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideFormError(formError);

  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;
  const dueDate = taskDueDateInput.value;
  const description = taskDescInput.value.trim();

  // Basic client validation
  if (!title) {
    showFormError(formError, "Title is required");
    return;
  }
  if (title.length < 3) {
    showFormError(formError, "Title must be at least 3 characters long");
    return;
  }

  try {
    await createTask({ title, priority, dueDate, description });
    taskTitleInput.value = "";
    taskDescInput.value = "";
    taskDueDateInput.value = "";
    taskPrioritySelect.value = "medium";
    showToast("Task created successfully!");
    await fetchTasks();
  } catch (err) {
    showFormError(formError, err.message);
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideFormError(editModalError);

  const id = editTaskId.value;
  const title = editTaskTitle.value.trim();
  const priority = editTaskPriority.value;
  const dueDate = editTaskDueDate.value;
  const description = editTaskDesc.value.trim();

  if (!title || title.length < 3) {
    showFormError(editModalError, "Title must be at least 3 characters long");
    return;
  }

  try {
    await updateTask(id, { title, priority, dueDate, description });
    closeEditModal();
    showToast("Task updated successfully!");
    await fetchTasks();
  } catch (err) {
    showFormError(editModalError, err.message);
  }
});

modalCancelBtn.addEventListener("click", closeEditModal);
modalCloseX.addEventListener("click", closeEditModal);

// Filter tabs
filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    state.filter = tab.getAttribute("data-filter");
    fetchTasks();
  });
});

priorityFilterSelect.addEventListener("change", (e) => {
  state.priorityFilter = e.target.value;
  fetchTasks();
});

sortSelect.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  fetchTasks();
});

let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  const val = e.target.value.trim();
  if (val.length > 0) {
    searchClearBtn.classList.remove("hidden");
  } else {
    searchClearBtn.classList.add("hidden");
  }

  searchTimeout = setTimeout(() => {
    state.searchQuery = val;
    fetchTasks();
  }, 200);
});

searchClearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchClearBtn.classList.add("hidden");
  state.searchQuery = "";
  fetchTasks();
});

resetDataBtn.addEventListener("click", async () => {
  try {
    await resetMockData();
    showToast("Reset mock tasks to initial state", "info");
    await fetchTasks();
  } catch (err) {
    showToast(err.message, "error");
  }
});

// Initial boot
fetchTasks();

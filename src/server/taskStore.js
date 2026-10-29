const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

class TaskStore {
  constructor() {
    this.filePath = DATA_FILE;
    this.initialTasks = [
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

    this.ensureDataFile();
    this.loadFromFile();
  }

  ensureDataFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify(this.initialTasks, null, 2), "utf8");
      }
    } catch (err) {
      console.error("Error initializing simulated DB file:", err.message);
    }
  }

  loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.tasks = parsed;
          return;
        }
      }
    } catch (err) {
      console.error("Error reading JSON db file:", err.message);
    }
    this.tasks = JSON.parse(JSON.stringify(this.initialTasks));
    this.saveToFile();
  }

  saveToFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.tasks, null, 2), "utf8");
    } catch (err) {
      console.error("Error saving to simulated DB JSON file:", err.message);
    }
  }

  getAll({ status = "all", priority = "all", search = "", sortBy = "createdAt" } = {}) {
    this.loadFromFile();
    let result = [...this.tasks];

    // Filter by status
    if (status === "active") {
      result = result.filter(t => !t.completed);
    } else if (status === "completed") {
      result = result.filter(t => t.completed);
    }

    // Filter by priority
    if (priority && priority !== "all") {
      result = result.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // Search query
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
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
      // default: createdAt descending (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }

  getById(id) {
    this.loadFromFile();
    return this.tasks.find(t => t.id === id);
  }

  create({ title, description = "", priority = "medium", dueDate = "" }) {
    this.loadFromFile();
    const newTask = {
      id: "task-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      description: (description || "").trim(),
      priority: priority.toLowerCase(),
      dueDate: dueDate || "",
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    this.saveToFile();
    return newTask;
  }

  update(id, updates) {
    this.loadFromFile();
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null;

    const task = this.tasks[taskIndex];
    if (typeof updates.title === "string") task.title = updates.title.trim();
    if (typeof updates.description === "string") task.description = updates.description.trim();
    if (typeof updates.priority === "string") task.priority = updates.priority.toLowerCase();
    if (typeof updates.dueDate === "string") task.dueDate = updates.dueDate;
    if (typeof updates.completed === "boolean") task.completed = updates.completed;

    this.saveToFile();
    return task;
  }

  delete(id) {
    this.loadFromFile();
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;
    this.tasks.splice(taskIndex, 1);
    this.saveToFile();
    return true;
  }

  reset() {
    this.tasks = JSON.parse(JSON.stringify(this.initialTasks));
    this.saveToFile();
    return this.tasks;
  }

  clear() {
    this.tasks = [];
    this.saveToFile();
    return this.tasks;
  }
}

module.exports = new TaskStore();

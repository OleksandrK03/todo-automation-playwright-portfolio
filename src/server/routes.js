const express = require("express");
const router = express.Router();
const taskStore = require("./taskStore");

// Helper validator
function validateTaskInput(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
      errors.push("Title is required");
    } else if (data.title.trim().length < 3) {
      errors.push("Title must be at least 3 characters long");
    } else if (data.title.trim().length > 100) {
      errors.push("Title must not exceed 100 characters");
    }
  }

  if (data.priority !== undefined) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(data.priority.toLowerCase())) {
      errors.push("Priority must be one of: 'low', 'medium', 'high'");
    }
  }

  if (data.dueDate && typeof data.dueDate === "string") {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.dueDate)) {
      errors.push("Due date must be in YYYY-MM-DD format");
    }
  }

  if (data.description && typeof data.description === "string" && data.description.length > 300) {
    errors.push("Description must not exceed 300 characters");
  }

  return errors;
}

// GET /api/tasks
router.get("/tasks", (req, res) => {
  const { status, priority, search, sortBy } = req.query;
  const tasks = taskStore.getAll({ status, priority, search, sortBy });
  const counts = {
    total: taskStore.tasks.length,
    active: taskStore.tasks.filter(t => !t.completed).length,
    completed: taskStore.tasks.filter(t => t.completed).length
  };
  res.json({ tasks, counts });
});

// GET /api/tasks/:id
router.get("/tasks/:id", (req, res) => {
  const task = taskStore.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found", id: req.params.id });
  }
  res.json(task);
});

// POST /api/tasks
router.post("/tasks", (req, res) => {
  const validationErrors = validateTaskInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: validationErrors
    });
  }

  const task = taskStore.create({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority || "medium",
    dueDate: req.body.dueDate
  });

  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put("/tasks/:id", (req, res) => {
  const existing = taskStore.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Task not found", id: req.params.id });
  }

  const validationErrors = validateTaskInput(req.body, true);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: validationErrors
    });
  }

  const updated = taskStore.update(req.params.id, req.body);
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete("/tasks/:id", (req, res) => {
  const deleted = taskStore.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Task not found", id: req.params.id });
  }
  res.json({ message: "Task deleted successfully", id: req.params.id });
});

// POST /api/tasks/reset (Test helper endpoint)
router.post("/tasks/reset", (req, res) => {
  const resetTasks = taskStore.reset();
  res.json({ message: "Store reset to initial fixtures", count: resetTasks.length });
});

module.exports = router;

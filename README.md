# 🎯 TaskMaster — QA Automation Portfolio (E2E & API Testing)

A comprehensive **QA Automation project** built around **TaskMaster**, a full-stack To-Do List web application designed specifically as a **System Under Test (SUT)** for UI End-to-End (E2E) and REST API test automation using **Playwright** and **TypeScript**.

While the repository includes a complete full-stack web application (**Node.js / Express** backend + **Vanilla JS SPA** frontend), the **primary focus of this project is Test Automation**: designing maintainable test architectures, writing reliable UI and API tests, ensuring strict test isolation, and documenting test coverage as the suite evolves.

---

## 🧪 Test Automation Documentation & Progress

All automated tests, framework architecture details, execution instructions, and incremental coverage updates are documented in the dedicated E2E README:

👉 **[📖 Go to Automated Tests Documentation (`./e2e-tests/README.md`)](./e2e-tests/README.md)**

> **Note:** As new UI and API automated tests are written and added to the suite, their descriptions, test steps, and coverage status are progressively documented in [`e2e-tests/README.md`](./e2e-tests/README.md).

### 📂 QA & Testing Artifacts in This Repository

| Directory / File | Description |
| :--- | :--- |
| **[`./e2e-tests/`](./e2e-tests/)** | **Playwright Test Automation Framework** (UI & API tests, Page Objects, utilities, and test reports) |
| **[`./e2e-tests/README.md`](./e2e-tests/README.md)** | **Live Test Suite Documentation** — detailed catalog of implemented automated tests, grew incrementally |
| **[`./test-cases/`](./test-cases/README.md)** | Structured test case specifications (`TC-UI-*` and `TC-API-*`) used as the basis for automation |
| **[`./src/`](./src/)** | Source code of the System Under Test (Express REST API + Frontend SPA) |
| **[`./data/tasks.json`](./data/tasks.json)** | Simulated JSON database file used for state persistence and test reset |

---

## ⚡ Quick Start (Application & Tests)

### 1. Start the System Under Test (SUT)

All application dependencies are pre-installed in the root project. Start the local server:

```bash
npm start
```

Once started, the application is available at:
* **Web UI:** [http://localhost:3000](http://localhost:3000)
* **REST API:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)
* **Simulated JSON DB:** [http://localhost:3000/data/tasks.json](http://localhost:3000/data/tasks.json) (local file: `data/tasks.json`)

### 2. Run Automated Tests (Playwright)

Navigate to the `e2e-tests` directory and run the Playwright test suite:

```bash
cd e2e-tests

# Run all automated tests (UI + API)
npm test

# Run only UI E2E tests
npm run test:ui

# Run UI tests in headed browser mode
npm run test:headed

# Run only API tests
npm run test:api
```

---

## 🖥️ System Under Test (SUT) Overview

The application is built without heavy external dependencies to ensure fast startup and deterministic behavior during automated test runs. Every interactive element includes dedicated `data-testid` attributes for resilient locator strategies.

### 💾 Simulated JSON Database & Test Isolation
Instead of requiring an external database engine (PostgreSQL / MongoDB), the app uses a **JSON-file database simulation**:
* All tasks are stored in `data/tasks.json`.
* Creating, editing, toggling status, or deleting a task immediately persists changes to `data/tasks.json`.
* **Test Isolation Helper:** A dedicated `POST /api/tasks/reset` endpoint (and UI reset button) restores `data/tasks.json` to its initial 3-task baseline state before each test run.
* **Standalone Fallback:** If `index.html` is opened directly without the Node.js server, the app automatically falls back to client-side `localStorage` emulation.

### 🧩 Core Application Features (Test Targets)

1. **Task CRUD Operations:**
   - Create a new task with a title, priority (`low`, `medium`, `high`), due date, and description.
   - Toggle task completion status (`Active` / `Completed`) via checkbox.
   - Edit existing task details via a modal dialog.
   - Delete a task from the list.
2. **Filtering, Sorting & Search:**
   - Status filter tabs: `All`, `Active`, `Completed`.
   - Priority filter dropdown (`High`, `Medium`, `Low`).
   - Sorting options: by creation date (`Newest`), by deadline (`Due Date`), or by importance (`Priority`).
   - Real-time live search by task title or description.
3. **Statistics & Counters:**
   - Header summary badges: `Total`, `Active`, `Completed`.
   - Dynamic footer counter (*"X active tasks left"*).
4. **Validation & Error Handling (Targets for Negative Testing):**
   - Title is required (*Title is required*).
   - Minimum title length: **3 characters**.
   - Maximum title length: **100 characters**.
   - Visual `Overdue` badge indicator in red for past-due active tasks.
5. **State Reset (Testability Feature):**
   - UI button (`↻ Reset Data`) and API endpoint (`POST /api/tasks/reset`) to restore default seed data between test runs.

---

## 🎯 UI Selectors Reference (`data-testid`)

All interactive and assertable DOM elements expose `data-testid` attributes for clean, resilient E2E selectors:

| Element | `data-testid` | Description |
| :--- | :--- | :--- |
| **App Title** | `app-title` | Main application heading |
| **Counter: Total** | `stat-total` | Total number of tasks badge |
| **Counter: Active** | `stat-active` | Number of active tasks badge |
| **Counter: Completed** | `stat-completed` | Number of completed tasks badge |
| **Active Tasks Text** | `active-tasks-counter` | Footer text *"X active tasks left"* |
| **Task Title Input** | `input-task-title` | Text input for the new task title |
| **Task Priority Select** | `select-task-priority` | Priority dropdown (`low`, `medium`, `high`) |
| **Task Due Date Input** | `input-task-duedate` | Date picker input (`type="date"`) |
| **Task Description Input** | `input-task-description` | Input field for additional task details |
| **Add Task Button** | `btn-add-task` | Submit button `+ Add Task` |
| **Form Error Message** | `form-error-message` | Validation error message container |
| **Search Input** | `input-search` | Live search text input |
| **Clear Search Button** | `btn-clear-search` | Button `×` to clear the search query |
| **Filter: All** | `filter-all` | Tab button to show all tasks |
| **Filter: Active** | `filter-active` | Tab button to show only active tasks |
| **Filter: Completed** | `filter-completed` | Tab button to show only completed tasks |
| **Filter: Priority** | `select-filter-priority`| Dropdown to filter tasks by priority |
| **Sort Select** | `select-sort` | Dropdown to sort the task list |
| **Reset Data Button** | `btn-reset-data` | Button `↻ Reset Data` to restore initial state |
| **Tasks List** | `tasks-list` | Container `<ul>` holding task items |
| **Task Item** | `task-item` | Individual task row (`<li>`) |
| **Task Checkbox** | `task-checkbox` | Completion status checkbox inside a task item |
| **Task Title** | `task-title` | Displayed title of a task in the list |
| **Task Priority Badge** | `task-priority` | Priority badge on a task item |
| **Task Due Date Badge** | `task-duedate` | Due date badge on a task item |
| **Edit Task Button** | `btn-edit-task` | `Edit` button on a task item |
| **Delete Task Button** | `btn-delete-task` | `Delete` button on a task item |
| **Edit Task Modal** | `modal-edit-task` | Modal dialog container for editing a task |
| **Modal Save Button** | `btn-modal-save` | `Save Changes` button inside the edit modal |
| **Modal Cancel Button** | `btn-modal-cancel` | `Cancel` button inside the edit modal |
| **Empty State** | `empty-state` | Placeholder block shown when no tasks match |

---

## 📡 REST API Reference

All endpoints accept and return `Content-Type: application/json`.

### 1. Get All Tasks
* **Endpoint:** `GET /api/tasks`
* **Query Parameters (optional):**
  * `status`: `all` | `active` | `completed`
  * `priority`: `all` | `low` | `medium` | `high`
  * `search`: search substring
  * `sortBy`: `createdAt` | `dueDate` | `priority`
* **Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": "task-1",
      "title": "Explore project architecture",
      "description": "Review codebase and plan test coverage",
      "priority": "high",
      "dueDate": "2026-10-28",
      "completed": false,
      "createdAt": "2026-10-26T18:00:00.000Z"
    }
  ],
  "counts": {
    "total": 3,
    "active": 2,
    "completed": 1
  }
}
```

### 2. Get Task by ID
* **Endpoint:** `GET /api/tasks/:id`
* **Responses:**
  * `200 OK` — Task object
  * `404 Not Found` — `{ "error": "Task not found" }`

### 3. Create a New Task
* **Endpoint:** `POST /api/tasks`
* **Request Body:**
```json
{
  "title": "Write automated tests",
  "description": "Cover core E2E flows",
  "priority": "high",
  "dueDate": "2026-11-01"
}
```
* **Responses:**
  * `201 Created` — Created task object
  * `400 Bad Request` — Validation error (empty title or fewer than 3 characters)

### 4. Update a Task
* **Endpoint:** `PUT /api/tasks/:id`
* **Request Body:** (any subset of updatable fields)
```json
{
  "completed": true,
  "priority": "medium"
}
```
* **Responses:** `200 OK` | `400 Bad Request` | `404 Not Found`

### 5. Delete a Task
* **Endpoint:** `DELETE /api/tasks/:id`
* **Responses:**
  * `200 OK` — `{ "message": "Task deleted successfully", "id": "task-1" }`
  * `404 Not Found`

### 6. Reset State to Default Seed Data (Test Helper)
* **Endpoint:** `POST /api/tasks/reset`
* **Response:** `200 OK` — Restores and returns the initial array of 3 default tasks.

---

## 🛡️ Testing Strategy & QA Approach

This project demonstrates a multi-layered quality assurance approach combining **UI End-to-End**, **REST API**, and **Hybrid** automated testing:

* **UI End-to-End (E2E) Testing:** Verifies critical user journeys in a real browser environment — task creation, form validation, status toggling, modal editing, dynamic filtering, and live search using resilient `data-testid` locators and structured Playwright `test.step` reporting.
* **REST API Testing:** Validates backend endpoints (`GET`, `POST`, `PUT`, `DELETE`), HTTP status codes (`200`, `201`, `400`, `404`), response schemas, query parameter filtering, and negative boundary conditions directly at the API layer.
* **Hybrid Testing (API + UI):** Uses fast API calls for test data setup/teardown (`POST /api/tasks`, `POST /api/tasks/reset`) combined with UI assertions to keep E2E tests fast, independent, and deterministic.

👉 **Explore the implemented test suite and step-by-step test documentation in [`./e2e-tests/README.md`](./e2e-tests/README.md).**

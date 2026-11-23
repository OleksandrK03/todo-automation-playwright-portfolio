# TaskMaster — QA Automation Portfolio (Playwright + TypeScript)

[![TaskMaster Playwright E2E](https://github.com/OleksandrK03/todo-automation-playwright-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/OleksandrK03/todo-automation-playwright-portfolio/actions/workflows/playwright.yml)

This repository is a **QA Automation portfolio project** covering both **UI End-to-End (E2E)** and **REST API** testing with **Playwright** and **TypeScript**.

To make the tests self-contained and easy to run locally without external dependencies, the repository includes **TaskMaster** — a lightweight full-stack To-Do application (**Node.js / Express** backend + **Vanilla JS** frontend) that acts as the **System Under Test (SUT)**.

👉 **[Detailed Test Suite Documentation & List of Tests (`./e2e-tests/README.md`)](./e2e-tests/README.md)**

---

## 💡 What You Should Know (QA Approach)

* **Test-Case Driven Automation:** All automated tests are written based on structured test cases stored in the [`./test-cases/`](./test-cases/) folder (`TC-UI-*` and `TC-API-*`).
* **Resilient Locators (`data-testid`):** Instead of relying on fragile CSS or XPath selectors, interactive elements in the application use dedicated `data-testid` attributes (`page.getByTestId(...)`).
* **Page Object Model (POM):** All UI locators, actions, and helper methods are organized inside [`e2e-tests/pages/tasks-page.ts`](./e2e-tests/pages/tasks-page.ts) to keep test files clean and readable.
* **Test Isolation & Data Cleanup:** Tests that modify, delete, or filter specific tasks create their own prerequisite data via the API in `beforeEach` and clean up in `afterEach` so they don't pollute the local database ([`data/tasks.json`](./data/tasks.json)).
* **Readable Reporting:** Multi-step scenarios are structured with `test.step(...)` and clear comments so the Playwright HTML report is easy to follow.

---

## 📂 Project Structure

```text
├── test-cases/          # Manual test cases (TC-UI-* and TC-API-*) used as the basis for automation
├── e2e-tests/           # Playwright automation framework
│   ├── pages/           # Page Object Model classes (tasks-page.ts)
│   ├── tests/ui/        # UI End-to-End tests
│   ├── tests/api/       # REST API tests
│   └── README.md        # Detailed descriptions of all implemented automated tests
├── src/                 # System Under Test (Express REST API + Frontend SPA)
└── data/tasks.json      # Local JSON file acting as the database
```

---

## ⚡ How to Install & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/OleksandrK03/todo-automation-playwright-portfolio.git
cd todo-automation-playwright-portfolio
```

### 2. Install dependencies
Install dependencies for the web application (root folder) and for the Playwright test suite (`e2e-tests/` folder):
```bash
# 1. Install app dependencies (Express server)
npm install

# 2. Go to the tests folder, install test dependencies and Chromium browser
cd e2e-tests
npm install
npx playwright install chromium
```

### 3. Run Automated Tests
You don't need to start the server manually in a separate terminal — Playwright automatically starts the local app on `http://localhost:3000` before running the tests.

Run from inside `e2e-tests/`:
```bash
# Run all tests (UI + API)
npm test

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run UI tests in headed browser mode (watch execution)
npm run test:headed

# Open the HTML report after a test run
npx playwright show-report
```

### 4. Open the Application Manually (Optional)
If you want to launch the web app and explore it in your browser:
```bash
# From the project root folder
npm start
```
Then open `http://localhost:3000` in your browser.

---

## 📡 Brief Overview of the SUT & REST API

The application supports creating tasks (with title, priority, due date, and description), editing tasks via a modal window, toggling completion status, deleting tasks, filtering by status/priority, and live keyword search.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Returns `{ tasks, counts }`. Supports `?status=`, `?priority=`, `?search=`, and `?sortBy=` query params |
| `GET` | `/api/tasks/:id` | Returns a single task by ID (`200 OK`) or `404 Not Found` |
| `POST` | `/api/tasks` | Creates a new task (`201 Created`) or returns validation errors (`400 Bad Request`) |
| `PUT` | `/api/tasks/:id` | Updates task fields (`200 OK`, `400 Bad Request`, or `404 Not Found`) |
| `DELETE` | `/api/tasks/:id` | Deletes a task by ID (`200 OK` or `404 Not Found`) |

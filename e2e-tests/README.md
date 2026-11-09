# 🎭 Playwright Automated Tests (`e2e-tests`)

This directory contains the **UI End-to-End (E2E)** and **REST API** automated test suite for the **TaskMaster** application, built with [Playwright](https://playwright.dev/) and TypeScript.

⬅️ **[Back to Main Project Overview (`../README.md`)](../README.md)**

---

## 🛠️ Tech Stack & Structure

* **Framework:** Playwright Test (`@playwright/test`)
* **Language:** TypeScript
* **Design Pattern:** Page Object Model (POM)
* **Structure:**
  * `pages/tasks-page.ts` — Page Object class encapsulating TaskMaster UI elements, navigation, form actions, and statistics getters
  * `tests/ui/` — End-to-End UI tests interacting with the web application in a real browser
  * `tests/api/` — REST API functional & contract tests
  * `utils/` — Test helpers, fixtures, and data generators

---

## 🚀 Running the Tests

Make sure the TaskMaster application server is running on `http://localhost:3000` (`npm start` in the root folder), then run from inside `e2e-tests/`:

```bash
# Run all tests (UI + API) in headless mode
npm test

# Run only UI E2E tests
npm run test:ui

# Run UI tests in headed mode (watch browser execution)
npm run test:headed

# Run only API tests
npm run test:api

# Open the HTML test report
npx playwright show-report
```

> **Note on Concurrency:** `playwright.config.ts` is configured with `workers: 1` to ensure reliable sequential test execution against the shared simulated database (`data/tasks.json`).

---

## 📋 Implemented Tests Catalog

### 🖥️ UI (E2E) Tests (`tests/ui/`)

| Test File | Objective | Architecture |
| :--- | :--- | :--- |
| **[`create-task-positive.spec.ts`](./tests/ui/create-task-positive.spec.ts)** | Creates a task with valid title, priority, and due date. Verifies confirmation toast, total counter increment, and task card details. | Page Object (`TasksPage`) |
| **[`create-task-validation-negative.spec.ts`](./tests/ui/create-task-validation-negative.spec.ts)** | Validates form error handling for empty title and title shorter than 3 characters. Verifies task creation is blocked. | Page Object (`beforeEach`) |
| **[`toggle-task-completion.spec.ts`](./tests/ui/toggle-task-completion.spec.ts)** | Verifies task status toggling via checkbox: checks completed styling and confirms dynamic recalculation of Active and Completed counters. | Page Object (`TasksPage`) |

---

### 📡 API Tests (`tests/api/`)

*(API tests will be documented here as they are implemented...)*

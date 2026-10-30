# 🎭 Playwright Automated Tests (`e2e-tests`)

This directory contains the **UI End-to-End (E2E)** and **REST API** automated test suite for the **TaskMaster** application, built with [Playwright](https://playwright.dev/) and TypeScript.

⬅️ **[Back to Main Project Overview (`../README.md`)](../README.md)**

---

## 🛠️ Tech Stack & Structure

* **Framework:** Playwright Test (`@playwright/test`)
* **Language:** TypeScript
* **Structure:**
  * `tests/ui/` — End-to-End UI tests interacting with the web application in a real browser
  * `tests/api/` — REST API functional & contract tests
  * `pages/` — Page Object Model (POM) classes *(planned / expanding)*
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

---

## 📋 Implemented Tests Log (Incrementally Updated)

This section documents each automated test as it is added to the test suite.

### 🖥️ UI (E2E) Tests (`tests/ui/`)

#### 1. Positive Task Creation — [`create-task-positive.spec.ts`](./tests/ui/create-task-positive.spec.ts)
* **Objective:** Verify that a user can successfully create a new task with valid inputs via the UI form.
* **Test Data:**
  * Dynamic unique title (`New Task <timestamp>`)
  * Priority: `high`
  * Due Date: `current date + 3 days` (`YYYY-MM-DD`)
* **Test Steps (`test.step`):**
  1. **Open the application:** Navigate to the base URL (`/`).
  2. **Fill the task title:** Enter the dynamic task title into `[data-testid="input-task-title"]` and verify input value.
  3. **Pick a priority:** Select `high` in `[data-testid="select-task-priority"]` and verify selected value.
  4. **Pick a due date:** Fill the calculated future date into `[data-testid="input-task-duedate"]` and verify input value.
  5. **Click the create button:** Click `+ Add Task` and assert that the confirmation toast `'Task created successfully'` is visible.

*(More UI tests will be documented here as they are implemented...)*

---

### 📡 API Tests (`tests/api/`)

*(API tests will be documented here as they are implemented...)*

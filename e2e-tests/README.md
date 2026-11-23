# Playwright Automated Tests (`e2e-tests`)

This folder contains the **UI End-to-End (E2E)** and **REST API** automated tests for the **TaskMaster** application, written in **TypeScript** with **Playwright**.

⬅️ **[Back to Main Project README (`../README.md`)](../README.md)**

---

## 📝 Basis for Automation (`test-cases/`)

All automated tests in this suite are written based on the test cases located in the **[`../test-cases/`](../test-cases/)** directory:
* **UI Test Cases:** [`test-cases/ui/TC-UI-*.md`](../test-cases/ui/)
* **API Test Cases:** [`test-cases/api/TC-API-*.md`](../test-cases/api/)

---

## 🖥️ UI End-to-End Tests (`tests/ui/`)

All UI tests use the **Page Object Model** ([`pages/tasks-page.ts`](./pages/tasks-page.ts)) and interact with the app via `data-testid` locators.

* **[`create-task-positive.spec.ts`](./tests/ui/create-task-positive.spec.ts)**  
  Fills out the creation form with a valid title, priority, and due date. Verifies the confirmation notification, checks that the `Total` counter increases by 1, and confirms the new task card is displayed with the correct details.

* **[`create-task-validation-negative.spec.ts`](./tests/ui/create-task-validation-negative.spec.ts)**  
  Verifies form validation for invalid inputs: submitting an empty title (`"Title is required"`) and a 2-character title (`"Title must be at least 3 characters long"`). Confirms that no new task is added to the list.

* **[`toggle-task-completion.spec.ts`](./tests/ui/toggle-task-completion.spec.ts)**  
  Finds an active task, clicks its checkbox to mark it as completed, and verifies that the `Active` and `Completed` counters update accordingly. Then unchecks it to restore the initial state.

* **[`edit-task-modal.spec.ts`](./tests/ui/edit-task-modal.spec.ts)**  
  Creates an isolated task via `POST /api/tasks` in `beforeEach`, opens the Edit modal, changes its priority and title, saves the changes, verifies the success notification and updated values on the task card, and cleans up the task in `afterEach`.

* **[`delete-task.spec.ts`](./tests/ui/delete-task.spec.ts)**  
  Creates a temporary task via `POST /api/tasks` in `beforeEach` for test isolation, deletes it through the UI, and verifies that the task disappears from the page and the total task counter decreases by 1.

* **[`filter-by-status.spec.ts`](./tests/ui/filter-by-status.spec.ts)**  
  Switches between the `Active`, `Completed`, and `All` filter buttons and verifies that the number of rendered task cards matches the corresponding counter values in the header.

* **[`live-search.spec.ts`](./tests/ui/live-search.spec.ts)**  
  Covers two scenarios: searching for tasks by keyword (verifying all visible tasks match the query and clearing the search restores the full list) and searching for a non-existing keyword (verifying the `"No tasks found"` empty state appears).

---

## 📡 REST API Tests (`tests/api/`)

API tests use Playwright's built-in `request` fixture to test endpoints directly, using `beforeEach` and `afterEach` hooks where needed to create and clean up test data.

* **[`get-all-tasks.spec.ts`](./tests/api/get-all-tasks.spec.ts)**  
  Sends `GET /api/tasks` and verifies the `200 OK` status, checks that `tasks` is an array, and validates the `counts` object (`total === active + completed`).

* **[`get-task-by-id.spec.ts`](./tests/api/get-task-by-id.spec.ts)**  
  Creates a new task via `POST /api/tasks` in `beforeEach`, fetches it via `GET /api/tasks/:id` (verifying `200 OK`, JSON `Content-Type` header, and returned fields), verifies `404 Not Found` for a non-existent task ID, and deletes the created task in `afterEach`.

* **[`create-task-success.spec.ts`](./tests/api/create-task-success.spec.ts)**  
  Creates a task with full details via `POST /api/tasks`, verifies the `201 Created` status and system-generated properties (`id`, `completed: false`, `createdAt`), confirms the created task is returned in `GET /api/tasks`, and cleans up the task in `afterEach`.

* **[`create-task-validation-error.spec.ts`](./tests/api/create-task-validation-error.spec.ts)**  
  Covers negative and boundary validation cases on `POST /api/tasks`: missing title, empty/whitespace-only title, title shorter than 3 characters, title exceeding 100 characters (101 chars), and invalid priority value. Verifies `400 Bad Request` and the exact validation error message in the response body.

* **[`update-task.spec.ts`](./tests/api/update-task.spec.ts)**  
  Creates a temporary task in `beforeEach`, sends a `PUT /api/tasks/:id` request to update its `title`, `priority`, and `completed` status, verifies the `200 OK` response, confirms changes persisted via `GET /api/tasks/:id`, checks `404 Not Found` for a non-existent task ID, and deletes the task in `afterEach`.

* **[`delete-task.spec.ts`](./tests/api/delete-task.spec.ts)**  
  Creates a temporary task in `beforeEach`, deletes it via `DELETE /api/tasks/:id` (verifying `200 OK` and the confirmation message), sends a follow-up `GET /api/tasks/:id` request to confirm `404 Not Found`, and verifies that a repeated `DELETE` on the same ID also returns `404 Not Found`.

* **[`filter-tasks-query.spec.ts`](./tests/api/filter-tasks-query.spec.ts)**  
  Creates a task with a unique tag and `high` priority in `beforeEach`, tests filtering via `GET /api/tasks` with `?search=`, `?priority=high`, and `?status=active` query parameters, and cleans up the test task in `afterEach`.

---

## 🚀 How to Install & Run Tests

### 1. First-time Setup
From the project root directory:
```bash
npm install
cd e2e-tests
npm install
npx playwright install chromium
```

### 2. Run Commands (inside `e2e-tests/`)
Playwright automatically starts the local app server (`http://localhost:3000`) when tests run:

```bash
npm test              # Run all UI and API tests
npm run test:ui       # Run only UI tests
npm run test:api      # Run only API tests
npm run test:headed   # Run UI tests in a visible browser
npx playwright show-report # Open the HTML test report
npm run lint          # Check tests with ESLint
npm run typecheck     # Run TypeScript type check
```

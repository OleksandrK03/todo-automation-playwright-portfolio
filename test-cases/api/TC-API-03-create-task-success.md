# TC-API-03: Create Task with Valid Data (POST /api/tasks)

* **ID:** `TC-API-03`
* **Priority:** `High`
* **Module:** `REST API / Tasks`

### Preconditions
* Application server is running at `http://localhost:3000`.

### Test Data
* **Title:** `API Test Task Created`
* **Description:** `Task created via API test`
* **Priority:** `high`
* **Due Date:** 3 days from current date (`YYYY-MM-DD`)

### Test Steps & Expected Results
1. **Send a `POST /api/tasks` request with the valid task payload.**
   * *Expected:*
     * Server returns status `201 Created`.
     * Response body includes system-generated fields: `id` (string starting with `"task-"`), `completed: false`, and `createdAt`.
     * Submitted fields (`title`, `description`, `priority`, `dueDate`) match the request payload.
2. **Send a `GET /api/tasks` request to verify persistence.**
   * *Expected:* Server returns status `200 OK` and the `tasks` array contains the newly created task.

### Postconditions
* Delete the created test task via `DELETE /api/tasks/:id`.

# TC-API-02: Get Task by ID (GET /api/tasks/:id)

* **ID:** `TC-API-02`
* **Priority:** `High`
* **Module:** `REST API / Tasks`

### Preconditions
* Application server is running at `http://localhost:3000`.
* A temporary task with `title` and `priority: "medium"` is created via `POST /api/tasks`.

### Scenario 1: Get Existing Task by ID
1. **Send a `GET /api/tasks/:id` request using the created task ID and `Accept: application/json` header.**
   * *Expected:*
     * Server returns status `200 OK` and header `Content-Type: application/json; charset=utf-8`.
     * Returned task `id`, `title`, and `priority` match the created task.
     * `completed` is a boolean and `createdAt` is present.

### Scenario 2: Get Task with Non-Existent ID
1. **Send a `GET /api/tasks/task-non-existent-999999` request.**
   * *Expected:*
     * Server returns status `404 Not Found`.
     * Response body matches `{ error: "Task not found", id: "task-non-existent-999999" }`.

### Postconditions
* Delete the created test task via `DELETE /api/tasks/:id`.

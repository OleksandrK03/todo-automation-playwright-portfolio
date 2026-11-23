# TC-API-05: Update Task Fields (PUT /api/tasks/:id)

* **ID:** `TC-API-05`
* **Priority:** `High`
* **Module:** `REST API / Tasks`

### Preconditions
* Application server is running at `http://localhost:3000`.
* A prerequisite task with `priority: "low"` and `completed: false` is created via `POST /api/tasks`.

### Test Data
* **Title:** `Task_Updated_<timestamp>`
* **Priority:** `high`
* **Completed:** `true`

### Scenario 1: Update Existing Task Fields
1. **Send a `PUT /api/tasks/:id` request for the created task with the updated fields.**
   * *Expected:*
     * Server returns status `200 OK` and header `Content-Type: application/json; charset=utf-8`.
     * Returned `id` remains unchanged.
     * Returned `title`, `priority`, and `completed` match the updated payload.
2. **Send a `GET /api/tasks/:id` request to confirm changes persisted.**
   * *Expected:*
     * Server returns status `200 OK` and the persisted task matches the updated fields.

### Scenario 2: Update Non-Existent Task ID
1. **Send a `PUT /api/tasks/task-non-existent-999999` request.**
   * *Expected:*
     * Server returns status `404 Not Found` with `{ error: "Task not found", id: "task-non-existent-999999" }`.

### Postconditions
* Delete the test task via `DELETE /api/tasks/:id`.

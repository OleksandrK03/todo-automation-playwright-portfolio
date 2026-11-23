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

### Test Steps & Expected Results
1. **Send a `PUT /api/tasks/:id` request for the created task with the updated fields.**
   * *Expected:*
     * Server returns status `200 OK` and header `Content-Type: application/json; charset=utf-8`.
     * Returned `id` remains unchanged.
     * Returned `title`, `priority`, and `completed` match the updated payload.

### Postconditions
* Delete the test task via `DELETE /api/tasks/:id`.

# TC-API-06: Delete Task (DELETE /api/tasks/:id)

* **ID:** `TC-API-06`
* **Priority:** `High`
* **Module:** `REST API / Tasks`

### Preconditions
* Application server is running at `http://localhost:3000`.
* A temporary task is created via `POST /api/tasks`.

### Test Steps & Expected Results
1. **Send a `DELETE /api/tasks/:id` request using the created task ID.**
   * *Expected:*
     * Server returns status `200 OK`.
     * Response body contains the deleted task `id` and `message: "Task deleted successfully"`.
2. **Send a `GET /api/tasks/:id` request for the deleted task ID.**
   * *Expected:*
     * Server returns status `404 Not Found`.
     * Response body contains `error: "Task not found"`.

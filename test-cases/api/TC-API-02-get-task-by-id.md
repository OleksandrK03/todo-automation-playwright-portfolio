# TC-API-02: Get Task by ID (GET /api/tasks/:id)

* **ID:** `TC-API-02`
* **Priority:** `High`
* **Module:** `REST API / Tasks`

### Preconditions
* Application server is running at `http://localhost:3000`.

### Test Steps & Expected Results
1. **Create a new task via `POST /api/tasks` with `title` and `priority: "medium"`.**
   * *Expected:* Server returns status `201 Created` and a valid task `id`.
2. **Send a `GET /api/tasks/:id` request using the created task ID and `Accept: application/json` header.**
   * *Expected:*
     * Server returns status `200 OK` and header `Content-Type: application/json; charset=utf-8`.
     * Returned task `id`, `title`, and `priority` match the created task.
     * `completed` is a boolean and `createdAt` is present.

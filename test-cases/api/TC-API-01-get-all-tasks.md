# TC-API-01: Get All Tasks (GET /api/tasks)

* **ID:** `TC-API-01`
* **Priority:** `High`
* **Module:** `REST API / Tasks`

### Preconditions
* Application server is running at `http://localhost:3000`.

### Test Steps & Expected Results
1. **Send a `GET /api/tasks` request.**
   * *Expected:* Server returns status `200 OK`.
2. **Validate the JSON response structure and counters.**
   * *Expected:*
     * `tasks` is an array.
     * `counts` is an object containing numeric `total`, `active`, and `completed` fields.
     * `counts.total` equals `counts.active + counts.completed`.

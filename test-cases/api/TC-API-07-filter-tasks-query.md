# TC-API-07: Filter and Search Tasks via Query Parameters (GET /api/tasks?...)

* **ID:** `TC-API-07`
* **Priority:** `High`
* **Module:** `REST API / Tasks / Query Filters`

### Preconditions
* Application server is running at `http://localhost:3000`.
* A prerequisite active task with a unique keyword in its title and `priority: "high"` is created via `POST /api/tasks`.

### Test Steps & Expected Results
1. **Send `GET /api/tasks?search=<keyword>` using the unique keyword.**
   * *Expected:* Server returns status `200 OK` and the returned task title contains the search keyword.
2. **Send `GET /api/tasks?priority=high`.**
   * *Expected:* Server returns status `200 OK` and the returned task has `priority: "high"`.
3. **Send `GET /api/tasks?status=active`.**
   * *Expected:* Server returns status `200 OK` and the returned task has `completed: false`.

### Postconditions
* Delete the test task via `DELETE /api/tasks/:id`.

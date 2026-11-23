# TC-API-04: Create Task Validation Errors (POST /api/tasks)

* **ID:** `TC-API-04`
* **Priority:** `High`
* **Module:** `REST API / Tasks / Validation`

### Preconditions
* Application server is running at `http://localhost:3000`.

### Scenario 1: Missing Title
1. **Send `POST /api/tasks` with an empty request body `{}`.**
   * *Expected:* Server returns `400 Bad Request` with `{ error: "Validation failed", details: ["Title is required"] }`.

### Scenario 2: Empty or Whitespace-Only Title
1. **Send `POST /api/tasks` with `{ title: "   " }`.**
   * *Expected:* Server returns `400 Bad Request` with `{ error: "Validation failed", details: ["Title is required"] }`.

### Scenario 3: Title Shorter Than 3 Characters
1. **Send `POST /api/tasks` with `{ title: "tt" }`.**
   * *Expected:* Server returns `400 Bad Request` with `{ error: "Validation failed", details: ["Title must be at least 3 characters long"] }`.

### Scenario 4: Title Exceeding Maximum Length (101 Characters)
1. **Send `POST /api/tasks` with a 101-character `title`.**
   * *Expected:* Server returns `400 Bad Request` with `{ error: "Validation failed", details: ["Title must not exceed 100 characters"] }`.

### Scenario 5: Invalid Priority Value
1. **Send `POST /api/tasks` with `{ title: "Valid title", priority: "super-urgent" }`.**
   * *Expected:* Server returns `400 Bad Request` with `{ error: "Validation failed", details: ["Priority must be one of: 'low', 'medium', 'high'"] }`.

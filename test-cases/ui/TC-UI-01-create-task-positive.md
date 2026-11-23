# TC-UI-01: Create Task with Valid Data

* **ID:** `TC-UI-01`
* **Priority:** `High`
* **Module:** `UI / Task Creation`

### Preconditions
* Application server is running at `http://localhost:3000`.

### Test Data
* **Title:** `New Task <timestamp>`
* **Priority:** `high`
* **Due Date:** 3 days from current date (`YYYY-MM-DD`)

### Test Steps & Expected Results
1. **Open the application.**
   * *Expected:* The main tasks page is loaded and initial tasks are displayed.
2. **Fill in the task title input.**
   * *Expected:* The title input field contains the entered title.
3. **Select `high` in the priority dropdown.**
   * *Expected:* The priority dropdown displays `high`.
4. **Fill in the due date input.**
   * *Expected:* The due date field contains the selected date.
5. **Click the `+ Add Task` button.**
   * *Expected:*
     * Confirmation message `"Task created successfully"` is visible.
     * The `Total` tasks counter in the header increases by `1`.
     * The new task card appears in the list with the expected title, priority, and due date.

### Postconditions
* Delete the created task via `DELETE /api/tasks/:id`.

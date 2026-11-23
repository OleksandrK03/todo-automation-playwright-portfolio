# TC-UI-05: Delete Task

* **ID:** `TC-UI-05`
* **Priority:** `High`
* **Module:** `UI / Task Management`

### Preconditions
* A temporary task (`Task to delete <timestamp>`) is created via `POST /api/tasks` before the test runs.
* Application page is opened at `http://localhost:3000`.

### Test Steps & Expected Results
1. **Verify that the created task is visible in the task list.**
   * *Expected:* The task item is displayed on the page.
2. **Click the `Delete` button on the target task card.**
   * *Expected:* Confirmation notification `"Task deleted"` is displayed.
3. **Verify that the task is removed from the list.**
   * *Expected:*
     * The deleted task card is no longer visible on the page.
     * The `Total` tasks counter decreases by `1`.

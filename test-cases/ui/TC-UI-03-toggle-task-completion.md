# TC-UI-03: Toggle Task Completion Status

* **ID:** `TC-UI-03`
* **Priority:** `High`
* **Module:** `UI / Task List & Counters`

### Preconditions
* Application is open at `http://localhost:3000`.
* At least one active (uncompleted) task exists in the list.

### Test Steps & Expected Results
1. **Open the application and locate the first active task.**
   * *Expected:* The task checkbox is unchecked, and initial `Active` and `Completed` header counters are displayed.
2. **Click the task checkbox to mark it as completed.**
   * *Expected:*
     * The checkbox becomes checked.
     * The `Active` counter decreases by `1`.
     * The `Completed` counter increases by `1`.
3. **Click the task checkbox again to restore it to active.**
   * *Expected:*
     * The checkbox becomes unchecked.
     * The `Active` and `Completed` counters return to their initial values.

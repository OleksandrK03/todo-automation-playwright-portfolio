# TC-UI-04: Edit Task via Modal

* **ID:** `TC-UI-04`
* **Priority:** `High`
* **Module:** `UI / Edit Task Modal`

### Preconditions
* A temporary task with `priority: "low"` is created via `POST /api/tasks`.
* Application is open at `http://localhost:3000`.

### Test Data
* **New Title:** `Updated Task <timestamp>`
* **New Priority:** `high`

### Test Steps & Expected Results
1. **Click the `Edit` button on the created task card.**
   * *Expected:* The edit modal opens and its title input is pre-filled with the task's initial title.
2. **Select `high` in the modal priority dropdown.**
   * *Expected:* The dropdown value updates to `high`.
3. **Enter a new title in the modal title input.**
   * *Expected:* The input value updates to the new title.
4. **Click the `Save Changes` button.**
   * *Expected:* The modal closes and `"Task updated successfully!"` notification appears.
5. **Check the edited task card in the list.**
   * *Expected:* The task card displays the updated title and updated priority badge.

### Postconditions
* Delete the created task via `DELETE /api/tasks/:id`.

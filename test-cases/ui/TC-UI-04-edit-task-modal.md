# TC-UI-04: Edit Task via Modal

* **ID:** `TC-UI-04`
* **Priority:** `High`
* **Module:** `UI / Edit Task Modal`

### Preconditions
* Application is open at `http://localhost:3000`.
* At least one task is displayed in the list.

### Test Data
* **New Title:** `Updated Task <timestamp>`
* **New Priority:** Toggled between `low` and `high` (different from current priority)

### Test Steps & Expected Results
1. **Open the application.**
   * *Expected:* Task list is loaded.
2. **Click the `Edit` button on the first task card.**
   * *Expected:* The edit modal opens and its title input is pre-filled with the task's current title.
3. **Select a new priority in the modal priority dropdown.**
   * *Expected:* The dropdown value updates to the new priority.
4. **Enter a new title in the modal title input.**
   * *Expected:* The input value updates to the new title.
5. **Click the `Save Changes` button.**
   * *Expected:* The modal closes and `"Task updated successfully!"` notification appears.
6. **Check the edited task card in the list.**
   * *Expected:* The task card displays the updated title and updated priority badge.

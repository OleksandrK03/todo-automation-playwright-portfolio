# TC-UI-02: Task Title Validation (Negative)

* **ID:** `TC-UI-02`
* **Priority:** `High`
* **Module:** `UI / Task Creation / Form Validation`

### Preconditions
* Application is open at `http://localhost:3000`.
* Initial number of tasks in the list is recorded.

### Scenario 1: Empty Title
1. **Verify that the title input field is empty.**
   * *Expected:* The title input value is empty.
2. **Click the `+ Add Task` button.**
   * *Expected:* Validation error `"Title is required"` is displayed.
3. **Check the total number of tasks in the list.**
   * *Expected:* The task count remains unchanged.

### Scenario 2: Title Shorter Than 3 Characters
1. **Enter `"ab"` (2 characters) into the title input field.**
   * *Expected:* The title input has value `"ab"`.
2. **Click the `+ Add Task` button.**
   * *Expected:* Validation error `"Title must be at least 3 characters long"` is displayed.
3. **Check the total number of tasks in the list.**
   * *Expected:* The task count remains unchanged.

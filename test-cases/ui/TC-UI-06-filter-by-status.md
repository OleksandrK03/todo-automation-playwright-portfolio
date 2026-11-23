# TC-UI-06: Filter Tasks by Status

* **ID:** `TC-UI-06`
* **Priority:** `Medium`
* **Module:** `UI / Filtering`

### Preconditions
* Application is open at `http://localhost:3000`.
* Initial `Active` and `Completed` counts from the header badges are recorded.

### Test Steps & Expected Results
1. **Open the application.**
   * *Expected:* All tasks and header statistics are loaded.
2. **Click the `Active` filter tab.**
   * *Expected:* The number of displayed task items equals the `Active` counter badge.
3. **Click the `Completed` filter tab.**
   * *Expected:* The number of displayed task items equals the `Completed` counter badge.
4. **Click the `All` filter tab.**
   * *Expected:* The filter resets and the number of displayed tasks equals `Active + Completed`.

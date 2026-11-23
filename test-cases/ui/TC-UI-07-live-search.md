# TC-UI-07: Live Search by Keyword

* **ID:** `TC-UI-07`
* **Priority:** `Medium`
* **Module:** `UI / Live Search`

### Preconditions
* Application is open at `http://localhost:3000`.

### Scenario 1: Search by Existing Keyword and Clear Search
1. **Type a keyword from an existing task's title into the search input.**
   * *Expected:* Only tasks containing the keyword remain visible in the list.
2. **Click the clear search (`×`) button.**
   * *Expected:* The search input is cleared and the full list of tasks is displayed again.

### Scenario 2: Search by Non-Existing Keyword
1. **Type `"nonexistingkeyword"` into the search input.**
   * *Expected:*
     * `0` task cards are displayed in the list.
     * The empty state message `"No tasks found"` is visible.

import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test('Toggle task completion', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();

    // get the first active task and its checkbox
    const activeTask = await tasksPage.getFirstActiveTask();

    // get initial counts of active and completed tasks for later comparison
    const initialActive = await tasksPage.getActiveTasksCount();
    const initialCompleted = await tasksPage.getCompletedTasksCount();

    // step 1: Check initial state of the task and counts
    await test.step('Check initial state', async () => {
        await expect(activeTask.checkbox).not.toBeChecked();
        await expect(tasksPage.activeTasksCount).toHaveText(String(initialActive));
        await expect(tasksPage.completedTasksCount).toHaveText(String(initialCompleted));
    });

    // step 2: Complete the task and verify counts
    await test.step('Complete task', async () => {
        await activeTask.checkbox.click();

        await expect(activeTask.checkbox).toBeChecked();
        await expect(tasksPage.activeTasksCount).toHaveText(String(initialActive - 1));
        await expect(tasksPage.completedTasksCount).toHaveText(String(initialCompleted + 1));
    });

    // step 3: Restore the task to active and verify counts
    await test.step('Restore task to active', async () => {
        await activeTask.checkbox.click();

        await expect(activeTask.checkbox).not.toBeChecked();
        await expect(tasksPage.activeTasksCount).toHaveText(String(initialActive));
        await expect(tasksPage.completedTasksCount).toHaveText(String(initialCompleted));
    });
});

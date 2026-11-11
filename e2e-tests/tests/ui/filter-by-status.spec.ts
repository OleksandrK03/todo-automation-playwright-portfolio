import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test('Filter tasks by status', async ({ page }) => {
    const tasksPage = new TasksPage(page);

    // step 1: Open the application
    await test.step('Open the application', async () => {
        await tasksPage.goto();
    });

    // Get the counts of active and completed tasks for later assertions
    const activeTasksCount = await tasksPage.getActiveTasksCount();
    const completedTasksCount = await tasksPage.getCompletedTasksCount();

    // step 2: Filter by Active tasks
    await test.step('Filter by Active tasks', async () => {
        await tasksPage.clickActiveFilterButton();
        await expect(tasksPage.taskItems).toHaveCount(activeTasksCount);
    });

    // step 3: Filter by Completed tasks
    await test.step('Filter by Completed tasks', async () => {
        await tasksPage.clickCompletedFilterButton();
        await expect(tasksPage.taskItems).toHaveCount(completedTasksCount);
    });

    // step 4: Clear filter and show all tasks
    await test.step('Clear filter and show all tasks', async () => {
        await tasksPage.clickTotalFilterButton(); // Click the "All" filter to clear the current filter
        await expect(tasksPage.taskItems).toHaveCount(activeTasksCount + completedTasksCount);
    });
});
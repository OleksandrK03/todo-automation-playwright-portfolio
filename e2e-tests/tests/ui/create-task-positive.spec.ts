import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test('Create task positive', async ({ page }) => {
    const tasksPage = new TasksPage(page);

    // data for task creation
    const taskTitle = `New Task ${Date.now()}`;
    const priority = 'high';
    const date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // step 1: Open the application
    await test.step('Open the application', async () => {
        await tasksPage.goto();
    });

    // get total tasks before creation
    const totalBefore = await tasksPage.getTotalTasksCount();

    // step 2: Fill the task title
    await test.step('Fill the task title', async () => {
        await tasksPage.fillTaskTitle(taskTitle);
        await expect(tasksPage.titleInput).toHaveValue(taskTitle);
    });

    // step 3: Pick a priority for the task
    await test.step('Pick a priority', async () => {
        await tasksPage.prioritySelect.selectOption(priority);
        await expect(tasksPage.prioritySelect).toHaveValue(priority);
    });

    // step 4: Pick a due date for the task
    await test.step('Pick a due date', async () => {
        await tasksPage.dueDateInput.fill(date);
        await expect(tasksPage.dueDateInput).toHaveValue(date);
    });

    // step 5: Click the create button and verify created task
    await test.step('Click create button and verify data', async () => {
        await tasksPage.clickAddTask();

        // message about successful creation of the task
        await expect(page.getByText('Task created successfully')).toBeVisible();

        // update the total number of tasks in the statistics block
        await expect(tasksPage.totalTasksCount).toHaveText(String(totalBefore + 1));

        // check that the created task has the correct title, priority and due date
        const createdTask = tasksPage.getTaskByTitle(taskTitle);
        await expect(createdTask.getByText(taskTitle)).toBeVisible();
        await expect(createdTask.getByText(priority)).toBeVisible();
        await expect(createdTask.getByText(date)).toBeVisible();
    });
});
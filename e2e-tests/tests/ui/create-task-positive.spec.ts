import { test, expect } from '@playwright/test';


test('Create task positive', async ({page}) => {

    // data for task creation
    const taskTitle = `New Task ${Date.now()}`;
    const priority = 'high';
    const date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];


    // step 1: Open the application
    await test.step('Open the application', async () => {
        await page.goto('/');

    });

    const totalBefore = Number(await page.getByTestId('stat-total').innerText());

    // step 2: Fill the task title
    await test.step('fill the task title', async () => {
        const taskInput = page.locator('[data-testid="input-task-title"]');

        await taskInput.fill(taskTitle);
        await expect (taskInput).toHaveValue(taskTitle);
    });

    // step 3: Pick a priority for the task
    await test.step('pick a priority', async () =>{
        const prioritySelect = page.locator('[data-testid="select-task-priority"]');

        await prioritySelect.selectOption(priority);
        await expect(prioritySelect).toHaveValue(priority);
    });

    // step 4: Pick a due date for the task
    await test.step('pick a due date', async () => {
        const dueDateInput = page.locator('[data-testid="input-task-duedate"]');

        await dueDateInput.fill(date);
        await expect(dueDateInput).toHaveValue(date);
    });

    // step 5: Click the create button and verify data of the created task
    await test.step('click the create button', async () => {
        await page.getByRole('button', {name: '+ Add Task'}).click();

    // massage about successful creation of the task should be visible
    await expect(page.getByText('Task created successfully')).toBeVisible();

    // update the total number of tasks in the statistics block
    await expect(page.getByTestId('stat-total')).toHaveText(String(totalBefore + 1));

    const createdTask = page.getByRole('listitem').filter({ hasText: taskTitle });

    // check that the created task has the correct title, priority and due date
    await expect(createdTask.getByText(taskTitle)).toBeVisible();
    await expect(createdTask.getByText(priority)).toBeVisible();
    await expect(createdTask.getByText(date)).toBeVisible();
    });

})
import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test.describe('Task title validation', () => {
    // Create variables to hold the TasksPage instance and the initial task count 
    // so we no need use { page } in each test
    let tasksPage: TasksPage;
    let initialCount: number;

    test.beforeEach(async ({ page }) => {
        // initialize the variables before each test
        tasksPage = new TasksPage(page);
        await tasksPage.goto();
        initialCount = await tasksPage.getTasksCount();
    });

    test('should not create task with empty title', async () => {

        // step 1: Check that the title input is empty
        await test.step('check for empty title', async () => {
            await expect(tasksPage.titleInput).toBeEmpty();
        });

        // step 2: Click the create button and check for validation message
        await test.step('click create button and check validation', async () => {
            await tasksPage.clickAddTask();
            await expect(tasksPage.errorMessage).toHaveText('Title is required');
        });

        // step 3: Check that the task count has not increased
        await test.step('check that the task count has not increased', async () => {
            const countAfter = await tasksPage.getTasksCount();
            expect(countAfter).toBe(initialCount);
        });
    });

    test('should not create task with 2 characters', async () => {
        
        // step 1: Fill the title input with 2 characters and check that the value is set
        await test.step('check for short title', async () => {
            await tasksPage.fillTaskTitle('ab');
            await expect(tasksPage.titleInput).toHaveValue('ab');
        });

        // step 2: Click the create button and check for validation message
        await test.step('click create button and check validation', async () => {
            await tasksPage.clickAddTask();
            await expect(tasksPage.errorMessage).toHaveText('Title must be at least 3 characters long');
        });

        // step 3: Check that the task count has not increased
        await test.step('check that the task count has not increased', async () => {
            const countAfter = await tasksPage.getTasksCount();
            expect(countAfter).toBe(initialCount);
        });
    });
});
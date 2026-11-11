import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test.describe('Delete Task feature', () => {
    let tasksPage: TasksPage;
    let taskTitle: string;

    test.beforeEach(async ({ page, request }) => {
        tasksPage = new TasksPage(page);
        taskTitle = `Task to delete ${Date.now()}`;
        // create a task via API to ensure it exists before the test runs
        const response = await request.post('/api/tasks', {
            data: {
                title: taskTitle,
                priority: 'medium'
            }
        });
        expect(response.ok()).toBeTruthy();
        // open the tasks page to prepare for the test
        await tasksPage.goto();
    });

    test('should successfully delete an existing task', async ({ page }) => {

        const initialCount = await tasksPage.getTotalTasksCount();
        const taskToDelete = tasksPage.getTaskByTitle(taskTitle);
    
        // step 1: Verify that the task to delete is visible on the page
        await test.step('Verify task visibility', async () => {
            await expect(taskToDelete).toBeVisible();
        });

        // step 2: Click the delete button for the task and verify the success message
        await test.step('Delete the task', async () => {
            await tasksPage.clickDeleteTask(taskToDelete);
            await expect(page.getByText('Task deleted')).toBeVisible();
        });

        // step 3: Verify that the task is no longer visible and the task count has decreased
        await test.step('Verify task deletion', async () => {
            await expect(taskToDelete).toBeHidden();
            const countAfterDeletion = await tasksPage.getTotalTasksCount();
            expect(countAfterDeletion).toBe(initialCount - 1);
        });
    });
});
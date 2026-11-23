import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test.describe('Edit Task feature', () => {
    let tasksPage: TasksPage;
    let taskId: string;
    let initialTitle: string;

    test.beforeEach(async ({ page, request }) => {
        tasksPage = new TasksPage(page);
        initialTitle = `Task to edit ${Date.now()}`;

        // Create an isolated task via API so editing does not mutate shared seed tasks
        const response = await request.post('/api/tasks', {
            data: {
                title: initialTitle,
                priority: 'low',
            },
        });
        expect(response.ok()).toBeTruthy();

        const created = await response.json();
        taskId = created.id;

        await tasksPage.goto();
    });

    test('Edit task', async ({ page }) => {
        const newTitle = `Updated Task ${Date.now()}`;
        const newPriority = 'high';
        const targetTask = tasksPage.getTaskById(taskId);

        // step 1: Open edit modal for the created task and verify initial title
        await test.step('Click edit button', async () => {
            const buttonEdit = targetTask.locator(tasksPage.editTaskButton);

            await buttonEdit.click();
            await expect(tasksPage.editModal).toBeVisible();
            await expect(tasksPage.editTitleInput).toHaveValue(initialTitle);
        });

        // step 2: Select a new priority in the edit modal
        await test.step('Change task priority', async () => {
            await tasksPage.setNewPriority(newPriority);
            await expect(tasksPage.editPriorityDrop).toHaveValue(newPriority);
        });

        // step 3: Enter a new title in the edit modal
        await test.step('Change task title', async () => {
            await tasksPage.setNewTitle(newTitle);
            await expect(tasksPage.editTitleInput).toHaveValue(newTitle);
        });

        // step 4: Save changes and verify modal closes with a success message
        await test.step('Click save button', async () => {
            await tasksPage.clickSaveButton();
            await expect(tasksPage.editModal).toBeHidden();
            await expect(page.getByText('Task updated successfully!')).toBeVisible();
        });

        // step 5: Verify that the task card displays the updated title and priority
        await test.step('Check updated task data', async () => {
            await expect(targetTask.locator(tasksPage.taskTitle)).toHaveText(newTitle);
            await expect(targetTask.locator(tasksPage.taskPriority)).toHaveText(newPriority);
        });
    });

    test.afterEach(async ({ request }) => {
        // Clean up the created task after the test finishes to avoid polluting test data
        const deleteRes = await request.delete(`/api/tasks/${taskId}`);
        expect(deleteRes.status()).toBe(200);
    });
});
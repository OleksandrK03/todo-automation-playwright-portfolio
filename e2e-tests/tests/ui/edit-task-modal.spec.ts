import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test('Edit task', async ({page}) => {
    const tasksPage = new TasksPage(page);
    const newTitle = `Updated Task ${Date.now()}`;

    // step 1: Open the application
    await test.step('Open the application', async () => {
        await tasksPage.goto();
    });

    // get initial data of the first task before editing
    const firstTask = tasksPage.getFirstTask()
    const firstTaskTitle = await firstTask.locator(tasksPage.taskTitle).innerText();
    const currentPriority = await firstTask.locator(tasksPage.taskPriority).textContent();
    const newPriority = currentPriority === 'low' ? 'high' : 'low';

    // step 2: Open edit modal for the first task and verify initial title
    await test.step('Click edit button', async () => {
        const firstButtonEdit = firstTask.locator(tasksPage.editTaskButton);

        // click edit button
        await firstButtonEdit.click()
        await expect(tasksPage.editModal).toBeVisible();
        // compare task title
        await expect(tasksPage.editTitleInput).toHaveValue(firstTaskTitle)
    });

    // step 3: Select a new priority in the edit modal
    await test.step('Change task priority', async () => {
        await tasksPage.setNewPriority(newPriority);
        await expect(tasksPage.editPriorityDrop).toHaveValue(newPriority);
    });

    // step 4: Enter a new title in the edit modal
    await test.step('Change task title', async () => {
        await tasksPage.setNewTitle(newTitle);
        await expect(tasksPage.editTitleInput).toHaveValue(newTitle);
    });

    // step 5: Save changes and verify modal closes with a success message
    await test.step('Click save button', async () => {
        await tasksPage.clickSaveButton();
        await expect(tasksPage.editModal).toBeHidden();
        await expect(page.getByText('Task updated successfully!')).toBeVisible();
    });

    // step 6: Verify that the task card displays the updated title and priority
    await test.step('Check updated task data', async() => {
        await expect(firstTask.locator(tasksPage.taskTitle)).toHaveText(newTitle);
        await expect(firstTask.locator(tasksPage.taskPriority)).toHaveText(newPriority);
    });
})
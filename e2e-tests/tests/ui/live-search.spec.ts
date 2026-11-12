import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/tasks-page';

test.describe('Live search', () => {
    let tasksPage: TasksPage;

    test.beforeEach(async ({ page }) => {
        tasksPage = new TasksPage(page);

        // step 1: Open the application
        await test.step('Open the application', async () => {
            await tasksPage.goto();
        });
    });

    test('Search tasks by keyword and clear search', async () => {
        // Get initial tasks count and extract a keyword from the first task title
        const totalTasks = await tasksPage.getTasksCount();
        const title = await tasksPage.taskTitle.first().innerText();
        const keyword = title.split(' ')[0];

        // step 2: Search for tasks with a keyword and verify results
        await test.step(`Search for tasks with keyword "${keyword}"`, async () => {
            await tasksPage.fillSearchInput(keyword);
            await tasksPage.expectAllTasksContainText(keyword);
        });

        // step 3: Clear the search input and verify all tasks are displayed
        await test.step('Clear search input and verify all tasks are displayed', async () => {
            await tasksPage.clickClearSearchButton();
            await expect(tasksPage.searchInput).toHaveValue('');
            await expect(tasksPage.taskItems).toHaveCount(totalTasks);
        });
    });

    test('Search for a non-existing keyword shows empty state', async () => {
        const nonExistingKeyword = 'nonexistingkeyword';

        // step 2: Search for a non-existing keyword
        await test.step(`Search for a non-existing keyword "${nonExistingKeyword}"`, async () => {
            await tasksPage.fillSearchInput(nonExistingKeyword);
        });

        // step 3: Verify no tasks are displayed and empty state message appears
        await test.step('Verify empty state is displayed', async () => {
            await expect(tasksPage.taskItems).toHaveCount(0);
            await expect(tasksPage.page.getByText('No tasks found')).toBeVisible();
        });
    });
});

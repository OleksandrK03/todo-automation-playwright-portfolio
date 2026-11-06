import { Page, Locator } from '@playwright/test';

export class TasksPage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly addTaskButton: Locator;
    readonly errorMessage: Locator;
    readonly totalTasksCount: Locator;
    readonly taskItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.getByTestId('input-task-title');
        this.addTaskButton = page.getByTestId('btn-add-task');
        this.errorMessage = page.getByTestId('form-error-message');
        this.totalTasksCount = page.getByTestId('stat-total');
        this.taskItems = page.getByTestId('task-item');
    }

    async goto() {
        await this.page.goto('/');
    }

    async fillTaskTitle(title: string) {
        await this.titleInput.fill(title);
    }

    async clickAddTask() {
        await this.addTaskButton.click();
    }

    async getTasksCount(): Promise<number> {
        return await this.taskItems.count();
    }
}
import { Page, Locator } from '@playwright/test';

export class TasksPage {
    readonly page: Page;

    // --- Locators: Form ---
    readonly titleInput: Locator;
    readonly addTaskButton: Locator;
    readonly errorMessage: Locator;

    // --- Locators: Statistics ---
    readonly totalTasksCount: Locator;
    readonly activeTasksCount: Locator;
    readonly completedTasksCount: Locator;

    // --- Locators: Task List ---
    readonly taskItems: Locator;
    readonly activeTasks: Locator;

    constructor(page: Page) {
        this.page = page;

        // Form
        this.titleInput = page.getByTestId('input-task-title');
        this.addTaskButton = page.getByTestId('btn-add-task');
        this.errorMessage = page.getByTestId('form-error-message');

        // Statistics
        this.totalTasksCount = page.getByTestId('stat-total');
        this.activeTasksCount = page.getByTestId('stat-active');
        this.completedTasksCount = page.getByTestId('stat-completed');

        // Task items
        this.taskItems = page.locator('.task-item');
        this.activeTasks = page.locator('.task-item:not(.completed)');
    }

    // ==========================================
    // Navigation
    // ==========================================
    async goto() {
        await this.page.goto('/');
        // Wait until tasks are loaded from server and rendered
        await this.taskItems.first().waitFor();
    }

    // ==========================================
    // Actions
    // ==========================================
    async fillTaskTitle(title: string) {
        await this.titleInput.fill(title);
    }

    async clickAddTask() {
        await this.addTaskButton.click();
    }

    // ==========================================
    // Task Helpers
    // ==========================================
    async getTasksCount(): Promise<number> {
        return await this.taskItems.count();
    }

    async getFirstActiveTask() {
        // Pin locator to the specific task by title so it stays stable after toggle
        const title = await this.activeTasks.first().getByTestId('task-title').innerText();
        const item = this.taskItems.filter({ hasText: title });

        return {
            item,
            checkbox: item.getByTestId('task-checkbox'),
            title
        };
    }

    // ==========================================
    // Counter Getters
    // ==========================================
    async getTotalTasksCount(): Promise<number> {
        const totalText = await this.totalTasksCount.innerText();
        return parseInt(totalText, 10);
    }

    async getActiveTasksCount(): Promise<number> {
        const activeText = await this.activeTasksCount.innerText();
        return parseInt(activeText, 10);
    }

    async getCompletedTasksCount(): Promise<number> {
        const completedText = await this.completedTasksCount.innerText();
        return parseInt(completedText, 10);
    }
}

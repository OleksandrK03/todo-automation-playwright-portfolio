import { Page, Locator } from '@playwright/test';

export class TasksPage {
    readonly page: Page;

    // --- Locators: Form ---
    readonly titleInput: Locator;
    readonly prioritySelect: Locator;
    readonly dueDateInput: Locator;
    readonly addTaskButton: Locator;
    readonly errorMessage: Locator;

    // --- Locators: Statistics ---
    readonly totalTasksCount: Locator;
    readonly activeTasksCount: Locator;
    readonly completedTasksCount: Locator;

    // --- Locators: Task List ---
    readonly taskItems: Locator;
    readonly activeTasks: Locator;
    readonly completedTasks: Locator;
    readonly editTaskButton: Locator;
    readonly deleteTaskButton: Locator;
    readonly taskTitle: Locator;
    readonly taskPriority: Locator;

    // --- Locators: Edit Modal ---
    readonly editModal: Locator;
    readonly editPriorityDrop: Locator;
    readonly saveModalButton: Locator;
    readonly editTitleInput: Locator;

    // --- Filters ---
    readonly totalFilterButton: Locator;
    readonly activeFilterButton: Locator;  
    readonly completedFilterButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Form
        this.titleInput = page.getByTestId('input-task-title');
        this.prioritySelect = page.getByTestId('select-task-priority');
        this.dueDateInput = page.getByTestId('input-task-duedate');
        this.addTaskButton = page.getByTestId('btn-add-task');
        this.errorMessage = page.getByTestId('form-error-message');

        // Statistics
        this.totalTasksCount = page.getByTestId('stat-total');
        this.activeTasksCount = page.getByTestId('stat-active');
        this.completedTasksCount = page.getByTestId('stat-completed');

        // Task items
        this.taskItems = page.locator('.task-item');
        this.activeTasks = page.locator('.task-item:not(.completed)');
        this.completedTasks = page.locator('.task-item.completed');
        this.editTaskButton = page.getByTestId('btn-edit-task');
        this.deleteTaskButton = page.getByTestId('btn-delete-task');
        this.taskTitle = page.getByTestId('task-title');
        this.taskPriority = page.getByTestId('task-priority');

        // Edit modal
        this.editModal = page.locator('.modal-dialog');
        this.editPriorityDrop = page.getByTestId('select-edit-priority');
        this.saveModalButton = page.getByTestId('btn-modal-save');
        this.editTitleInput = page.getByTestId('input-edit-title');

        // Filters
        this.totalFilterButton = page.getByTestId('filter-all');
        this.activeFilterButton = page.getByTestId('filter-active');
        this.completedFilterButton = page.getByTestId('filter-completed');
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

    async selectPriority(priority: string) {
        await this.prioritySelect.selectOption(priority);
    }

    async fillDueDate(date: string) {
        await this.dueDateInput.fill(date);
    }

    async clickAddTask() {
        await this.addTaskButton.click();
    }

    async setNewPriority(priority: string) {
        await this.editPriorityDrop.selectOption(priority);
    }

    async setNewTitle(newTitle: string) {
        await this.editTitleInput.fill(newTitle);
    }

    async clickSaveButton() {
        await this.saveModalButton.click();
    }

    async clickDeleteTask(task: Locator) {
        const deleteButton = task.locator(this.deleteTaskButton);
        await deleteButton.click();
    }

    async clickTotalFilterButton() {
        await this.totalFilterButton.click();
    }

    async clickActiveFilterButton() {
        await this.activeFilterButton.click();
    }

    async clickCompletedFilterButton() {
        await this.completedFilterButton.click();
    }

    // ==========================================
    // Task Helpers
    // ==========================================
    getFirstTask(): Locator {
        return this.taskItems.first();
    }

    async getTasksCount(): Promise<number> {
        return await this.taskItems.count();
    }

    async getActiveFromTasksCount(): Promise<number> {
        return await this.activeTasks.count();
    }

    async getCompletedFromTasksCount(): Promise<number> {
        return await this.completedTasks.count();
    }

    getTaskByTitle(title: string): Locator {
        return this.taskItems.filter({ hasText: title });
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

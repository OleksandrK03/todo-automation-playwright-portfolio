import { test, expect } from '@playwright/test';

test.describe('Update Task API', () => {
    let taskId: string;

    test.beforeEach(async ({ request }) => {
        // Create a temporary task with known initial values before the test runs
        const createRes = await request.post('/api/tasks', {
            data: {
                title: `Task_Before_Update_${Date.now()}`,
                priority: 'low',
            },
        });

        // Verify that the task was created with status 201 (Created)
        expect(createRes.status()).toBe(201);

        // Extract the created task ID to use for updating and cleanup
        const created = await createRes.json();
        taskId = created.id;
    });

    test('Update task fields via PUT', async ({ request }) => {
        const updatedData = {
            title: `Task_Updated_${Date.now()}`,
            priority: 'high',
            completed: true,
        };

        // Send PUT request to update task fields
        const updateTask = await request.put(`/api/tasks/${taskId}`, {
            data: updatedData,
        });

        // Verify that the response status is 200 (OK) and Content-Type is JSON
        expect(updateTask.status()).toBe(200);
        expect(updateTask.headers()['content-type']).toBe('application/json; charset=utf-8');

        // Parse the response body containing the updated task data
        const updatedTaskData = await updateTask.json();

        // Verify that the task ID remained unchanged and fields were updated properly
        expect(updatedTaskData.id).toBe(taskId);
        expect(updatedTaskData.title).toBe(updatedData.title);
        expect(updatedTaskData.priority).toBe(updatedData.priority);
        expect(updatedTaskData.completed).toBe(updatedData.completed);
    });

    test.afterEach(async ({ request }) => {
        // Clean up the created task after the test finishes to avoid polluting test data
        const deleteRes = await request.delete(`/api/tasks/${taskId}`);
        expect(deleteRes.status()).toBe(200);
    });
});

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

        // step 1: Send PUT request to update task fields
        await test.step('Send PUT request and verify updated response', async () => {
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

        // step 2: Fetch the task via GET to verify the changes were persisted
        await test.step('Verify updated task state via GET', async () => {
            const getTaskRes = await request.get(`/api/tasks/${taskId}`);
            expect(getTaskRes.status()).toBe(200);

            const persistedTask = await getTaskRes.json();
            expect(persistedTask).toMatchObject({
                id: taskId,
                ...updatedData,
            });
        });
    });

    test('Return 404 Not Found when updating non-existent task ID', async ({ request }) => {
        const nonExistentId = 'task-non-existent-999999';

        await test.step('Send PUT request for non-existent task ID', async () => {
            const response = await request.put(`/api/tasks/${nonExistentId}`, {
                data: {
                    title: 'Updated title for missing task',
                },
            });

            expect(response.status()).toBe(404);

            const body = await response.json();
            expect(body).toEqual({
                error: 'Task not found',
                id: nonExistentId,
            });
        });
    });

    test.afterEach(async ({ request }) => {
        // Clean up the created task after the test finishes to avoid polluting test data
        const deleteRes = await request.delete(`/api/tasks/${taskId}`);
        expect(deleteRes.status()).toBe(200);
    });
});

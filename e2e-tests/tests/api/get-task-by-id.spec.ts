import { test, expect } from '@playwright/test';

test.describe('Get Task by ID API', () => {
    let taskId: string;
    let taskTitle: string;

    test.beforeEach(async ({ request }) => {
        taskTitle = `Lookup_Task_${Date.now()}`;

        const createRes = await request.post('/api/tasks', {
            data: {
                title: taskTitle,
                priority: 'medium',
            },
        });
        expect(createRes.status()).toBe(201);

        const created = await createRes.json();
        taskId = created.id;
    });

    test('Get task by ID API', async ({ request }) => {
        await test.step('Get task by ID and verify response', async () => {
            const getCreatedRes = await request.get(`/api/tasks/${taskId}`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            // Verify that the response status is 200 (OK) and Content-Type is JSON
            expect(getCreatedRes.status()).toBe(200);
            expect(getCreatedRes.headers()['content-type']).toBe('application/json; charset=utf-8');

            // Parse the response body containing the task data
            const taskData = await getCreatedRes.json();

            // Verify that the returned task fields match the created task
            expect(taskData.id).toBe(taskId);
            expect(taskData.title).toBe(taskTitle);
            expect(taskData.priority).toBe('medium');
            expect(typeof taskData.completed).toBe('boolean');
            expect(taskData.createdAt).toBeTruthy();
        });
    });

    test('Return 404 Not Found for non-existent task ID', async ({ request }) => {
        const nonExistentId = 'task-non-existent-999999';

        await test.step('Request non-existent task ID and verify 404 response', async () => {
            const response = await request.get(`/api/tasks/${nonExistentId}`);

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

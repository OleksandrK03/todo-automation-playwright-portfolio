import { test, expect } from '@playwright/test';

test.describe('Create Task API', () => {
    let createdTaskId: string;

    test('Create task API', async ({ request }) => {
        const newTask = {
            title: `API Test Task Created ${Date.now()}`,
            description: `Task created via Playwright API test ${Date.now()}`,
            priority: 'high',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        // step 1: Create a new task via the API
        await test.step('Create a new task', async () => {
            const createTaskResponse = await request.post('/api/tasks', {
                data: newTask,
            });
            expect(createTaskResponse.status()).toBe(201);

            // Extract the created task directly from the POST response
            const createdTask = await createTaskResponse.json();
            createdTaskId = createdTask.id;

            // Verify system-generated fields
            expect(typeof createdTask.id).toBe('string');
            expect(createdTask.id.startsWith('task-')).toBe(true);
            expect(createdTask.completed).toBe(false);
            expect(createdTask.createdAt).toBeTruthy();

            // Verify that the submitted fields were saved correctly
            expect(createdTask).toMatchObject(newTask);
        });

        // step 2: Verify the task was created in the list via the API
        await test.step('Verify the task was created in the list', async () => {
            const getAllTasksResponse = await request.get('/api/tasks');
            expect(getAllTasksResponse.status()).toBe(200);

            // Parse the response body containing the tasks array and counts
            const body = await getAllTasksResponse.json();

            // Check that the created task is present in the tasks array
            expect(body.tasks).toContainEqual(expect.objectContaining(newTask));
        });
    });

    test.afterEach(async ({ request }) => {
        // Clean up the created task after the test finishes to avoid polluting test data
        const deleteRes = await request.delete(`/api/tasks/${createdTaskId}`);
        expect(deleteRes.status()).toBe(200);
    });
});
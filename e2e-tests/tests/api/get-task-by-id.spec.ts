import { test, expect } from '@playwright/test';

test('Get task by ID API', async ({ request }) => {
    const newTask = {
        title: `Lookup_Task_${Date.now()}`,
        priority: 'medium',
    };

    // step 1: Create a new task via the API to get its ID
    const taskId = await test.step('Create a new task', async () => {
        const createRes = await request.post('/api/tasks', {
            data: newTask,
        });

        // Verify that the task was created with status 201 (Created)
        expect(createRes.status()).toBe(201);

        // Extract the created task ID from the POST response
        const created = await createRes.json();
        expect(created.id).toBeTruthy();

        return created.id;
    });

    // step 2: Fetch the created task by ID and verify response status, headers, and data
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
        expect(taskData.title).toBe(newTask.title);
        expect(taskData.priority).toBe(newTask.priority);
        expect(typeof taskData.completed).toBe('boolean');
        expect(taskData.createdAt).toBeTruthy();
    });
});

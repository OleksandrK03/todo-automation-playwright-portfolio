import { test, expect } from '@playwright/test';

test.describe('Filter Tasks API', () => {
    let taskId: string;
    let uniqueTag: string;

    test.beforeEach(async ({ request }) => {
        uniqueTag = `Tag_${Date.now()}`;

        // Create a temporary task with a unique title and high priority before the test runs
        const createRes = await request.post('/api/tasks', {
            data: {
                title: `Searchable_${uniqueTag}`,
                priority: 'high',
            },
        });

        // Verify that the task was created with status 201 (Created)
        expect(createRes.status()).toBe(201);

        // Extract the created task ID to use for cleanup
        const created = await createRes.json();
        taskId = created.id;
    });

    test('Filter and search tasks via query parameters', async ({ request }) => {
        // step 1: Filter tasks by search keyword and verify the matching task is returned
        await test.step('Filter tasks by search keyword', async () => {
            const searchRes = await request.get(`/api/tasks?search=${uniqueTag}`);

            // Verify that the response status is 200 (OK)
            expect(searchRes.status()).toBe(200);

            // Parse the response body and verify that the returned task contains the search keyword
            const responseBody = await searchRes.json();
            expect(responseBody.tasks[0].title).toContain(uniqueTag);
        });

        // step 2: Filter tasks by high priority and verify returned item priority
        await test.step('Filter tasks by priority=high', async () => {
            const priorityRes = await request.get('/api/tasks?priority=high');

            // Verify that the response status is 200 (OK)
            expect(priorityRes.status()).toBe(200);

            // Parse the response body and verify that the returned task has 'high' priority
            const responseBody = await priorityRes.json();
            expect(responseBody.tasks[0].priority).toBe('high');
        });

        // step 3: Filter tasks by active status and verify returned item status
        await test.step('Filter tasks by status=active', async () => {
            const statusRes = await request.get('/api/tasks?status=active');

            // Verify that the response status is 200 (OK)
            expect(statusRes.status()).toBe(200);

            // Parse the response body and verify that the returned task is active (completed: false)
            const responseBody = await statusRes.json();
            expect(responseBody.tasks[0].completed).toBe(false);
        });
    });

    test.afterEach(async ({ request }) => {
        // Clean up the created task after the test finishes to avoid polluting test data
        const deleteRes = await request.delete(`/api/tasks/${taskId}`);
        expect(deleteRes.status()).toBe(200);
    });
});

import { test, expect } from '@playwright/test';

test.describe('Delete Task API', () => {
    let taskId: string;

    test.beforeEach(async ({ request }) => {
        // Create a temporary task before the test runs
        const createRes = await request.post('/api/tasks', {
            data: {
                title: `Task_For_Delete_API_${Date.now()}`,
            },
        });

        // Verify that the task was created with status 201 (Created)
        expect(createRes.status()).toBe(201);

        // Extract the created task ID to use for deletion and verification
        const created = await createRes.json();
        taskId = created.id;
    });

    test('Delete task', async ({ request }) => {
        // step 1: Send DELETE request to remove the task and verify response
        await test.step('Delete the task', async () => {
            const deleteTaskRes = await request.delete(`/api/tasks/${taskId}`);

            // Verify that the response status is 200 (OK)
            expect(deleteTaskRes.status()).toBe(200);

            // Parse the response body and verify deletion message and task ID
            const responseBody = await deleteTaskRes.json();

            expect(responseBody.id).toBe(taskId);
            expect(responseBody.message).toBe('Task deleted successfully');
        });

        // step 2: Attempt to fetch the deleted task and verify it no longer exists
        await test.step('Check that task has been successfully deleted', async () => {
            const checkTaskRes = await request.get(`/api/tasks/${taskId}`);

            // Verify that the server returns 404 (Not Found)
            expect(checkTaskRes.status()).toBe(404);

            // Parse the response body and verify the error message
            const responseBody = await checkTaskRes.json();

            expect(responseBody.error).toBe('Task not found');
        });
    });
});

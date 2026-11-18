import { test, expect } from '@playwright/test';

test.describe('Create task validation errors', () => {
    
    test('Missing title', async ({ request }) => {

        // step 1: Attempt to create a new task with missing required fields
        await test.step('Create a new task with missing required fields', async () => {
            const response = await request.post('/api/tasks', {
                data: {},
            });

            // Verify that the response status is 400 (Bad Request)
            expect(response.status()).toBe(400);

            // Get the response body containing the error message
            const body = await response.json();

            // Verify that the error message matches the expected validation error
            expect(body).toEqual({
                error: 'Validation failed',
                details: ['Title is required'],
            });
        });
    });

    test('Title shorter than 3 characters', async ({ request }) => {

        // step 1: Attempt to create a new task with a short title (less than 3 characters)
        await test.step('Create a new task with invalid title', async () => {
            const response = await request.post('/api/tasks', {
                data: {
                    title: 'tt',
                },
            });

            // Verify that the response status is 400 (Bad Request)
            expect(response.status()).toBe(400);

            // Get the response body containing the error message
            const body = await response.json();

            // Verify that the error message matches the expected validation error
            expect(body).toEqual({
                error: 'Validation failed',
                details: ['Title must be at least 3 characters long'],
            });
        });
    });

    test('Invalid priority', async ({ request }) => {

        // step 1: Attempt to create a new task with an invalid priority value
        await test.step('Create a new task with invalid priority', async () => {
            const response = await request.post('/api/tasks', {
                data: {
                    title: 'Valid title',
                    priority: 'super-urgent',
                },
            });

            // Verify that the response status is 400 (Bad Request)
            expect(response.status()).toBe(400);

            // Get the response body containing the error message
            const body = await response.json();

            // Verify that the error message matches the expected validation error
            expect(body).toEqual({
                error: 'Validation failed',
                details: ["Priority must be one of: 'low', 'medium', 'high'"],
            });
        });
    });
});

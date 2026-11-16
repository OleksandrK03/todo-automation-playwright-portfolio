import { test, expect } from '@playwright/test';

test('Get all tasks API', async ({ request }) => {
    const response = await request.get('/api/tasks');
    expect(response.status()).toBe(200);

    const body = await response.json();
    
    expect(Array.isArray(body.tasks)).toBe(true);
    expect(typeof body.counts).toBe('object');
    expect(typeof body.counts.total).toBe('number');
    expect(typeof body.counts.active).toBe('number');
    expect(typeof body.counts.completed).toBe('number');
    expect(body.counts.total).toBe(body.counts.active + body.counts.completed);
});

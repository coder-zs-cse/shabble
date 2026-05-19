import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/services', () => ({
    createUser: vi.fn(),
    updateUserCountry: vi.fn(),
}));

import { PUT } from '../../app/api/new-user/route';
import { createUser, updateUserCountry } from '@/services';

const mockCreateUser = createUser as ReturnType<typeof vi.fn>;
const mockUpdateUserCountry = updateUserCountry as ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.clearAllMocks();
});

function makeRequest(headers: Record<string, string> = {}): NextRequest {
    return new NextRequest('http://localhost/api/new-user', {
        method: 'PUT',
        headers,
    });
}

describe('PUT /api/new-user', () => {
    it('returns 200 with the new userId', async () => {
        mockCreateUser.mockResolvedValue('ABCD1234');
        mockUpdateUserCountry.mockResolvedValue(undefined);

        const response = await PUT(makeRequest());
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.userId).toBe('ABCD1234');
    });

    it('detects country from x-vercel-ip-country header and stores it', async () => {
        mockCreateUser.mockResolvedValue('ABCD1234');
        mockUpdateUserCountry.mockResolvedValue(undefined);

        await PUT(makeRequest({ 'x-vercel-ip-country': 'IN' }));

        expect(mockUpdateUserCountry).toHaveBeenCalledWith('ABCD1234', 'IN');
    });

    it('skips country update when header is absent', async () => {
        mockCreateUser.mockResolvedValue('ABCD1234');

        await PUT(makeRequest());

        expect(mockUpdateUserCountry).not.toHaveBeenCalled();
    });

    it('returns 500 when createUser throws', async () => {
        mockCreateUser.mockRejectedValue(new Error('DB error'));

        const response = await PUT(makeRequest());
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to create user');
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services', () => ({
    getLeaderboard: vi.fn(),
}));

import { GET } from '../../app/api/leaderboard/route';
import { getLeaderboard } from '@/services';

const mockGetLeaderboard = getLeaderboard as ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.clearAllMocks();
});

describe('GET /api/leaderboard', () => {
    it('returns 200 with leaderboard entries', async () => {
        const fakeEntries = [
            {
                rank: 1,
                userId: 'PLAYER01',
                name: 'Alice',
                countryCode: 'US',
                stars: 5,
                completedAt: new Date('2026-05-18T12:00:00Z'),
            },
        ];
        mockGetLeaderboard.mockResolvedValue(fakeEntries);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.entries).toHaveLength(1);
        expect(body.entries[0].rank).toBe(1);
        expect(body.entries[0].name).toBe('Alice');
        expect(body.entries[0].stars).toBe(5);
    });

    it('returns 200 with empty entries when no completions', async () => {
        mockGetLeaderboard.mockResolvedValue([]);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.entries).toEqual([]);
    });

    it('returns 500 when the service throws', async () => {
        mockGetLeaderboard.mockRejectedValue(new Error('DB down'));

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to fetch leaderboard');
    });
});

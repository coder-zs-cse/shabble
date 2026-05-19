import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma before importing the service
vi.mock('@/lib', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            count: vi.fn(),
        },
        userProgress: {
            findMany: vi.fn(),
        },
    },
}));

// Mock crypto to get a predictable userId
vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn(() => ({ toString: () => 'abcd1234' })),
    },
}));

import { prisma } from '@/lib';
import {
    getOrCreateUserByGoogleId,
    updateUserCountry,
    getLeaderboard,
} from '@/services/user/user';

const mockPrisma = prisma as {
    user: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    userProgress: { findMany: ReturnType<typeof vi.fn> };
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ─── getOrCreateUserByGoogleId ────────────────────────────────────────────────

describe('getOrCreateUserByGoogleId', () => {
    it('returns existing user id when googleId already exists', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({ id: 'EXISTING01' });
        mockPrisma.user.update.mockResolvedValue({});

        const id = await getOrCreateUserByGoogleId('gid-123', 'Alice', 'alice@example.com');

        expect(id).toBe('EXISTING01');
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { googleId: 'gid-123' },
            select: { id: true },
        });
        // should update name/email on re-login
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: 'EXISTING01' },
            data: { name: 'Alice', email: 'alice@example.com' },
        });
        expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('creates a new user when googleId is not found', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue({});

        const id = await getOrCreateUserByGoogleId('gid-new', 'Bob', 'bob@example.com');

        expect(id).toBe('ABCD1234'); // mocked crypto uppercased
        expect(mockPrisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    googleId: 'gid-new',
                    name: 'Bob',
                    email: 'bob@example.com',
                }),
            })
        );
    });

    it('handles null name and email gracefully', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue({});

        await expect(
            getOrCreateUserByGoogleId('gid-anon', null, null)
        ).resolves.not.toThrow();

        expect(mockPrisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ name: null, email: null }),
            })
        );
    });
});

// ─── updateUserCountry ────────────────────────────────────────────────────────

describe('updateUserCountry', () => {
    it('updates the countryCode for the given userId', async () => {
        mockPrisma.user.update.mockResolvedValue({});

        await updateUserCountry('USER001', 'IN');

        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: 'USER001' },
            data: { countryCode: 'IN' },
        });
    });

    it('throws when prisma update fails', async () => {
        mockPrisma.user.update.mockRejectedValue(new Error('DB error'));

        await expect(updateUserCountry('BAD', 'US')).rejects.toThrow('DB error');
    });
});

// ─── getLeaderboard ───────────────────────────────────────────────────────────

describe('getLeaderboard', () => {
    it('returns mapped leaderboard entries with correct rank', async () => {
        const fakeDate = new Date('2026-05-18T12:00:00Z');
        mockPrisma.userProgress.findMany.mockResolvedValue([
            {
                stars: 5,
                updatedAt: fakeDate,
                user: { id: 'PLAYER01', name: 'Alice', countryCode: 'US' },
            },
            {
                stars: 3,
                updatedAt: new Date('2026-05-18T13:00:00Z'),
                user: { id: 'PLAYER02', name: null, countryCode: null },
            },
        ]);

        const entries = await getLeaderboard();

        expect(entries).toHaveLength(2);
        expect(entries[0]).toMatchObject({
            rank: 1,
            userId: 'PLAYER01',
            name: 'Alice',
            countryCode: 'US',
            stars: 5,
            completedAt: fakeDate,
        });
        expect(entries[1]).toMatchObject({
            rank: 2,
            userId: 'PLAYER02',
            name: null,
            countryCode: null,
            stars: 3,
        });
    });

    it('queries with a UTC date range for today', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        await getLeaderboard();

        const call = mockPrisma.userProgress.findMany.mock.calls[0][0];
        const dateFilter = call.where.puzzle.date;

        // Should use gte/lt range, not exact match
        expect(dateFilter).toHaveProperty('gte');
        expect(dateFilter).toHaveProperty('lt');

        const gte: Date = dateFilter.gte;
        const lt: Date = dateFilter.lt;

        // gte should be UTC midnight today
        expect(gte.getUTCHours()).toBe(0);
        expect(gte.getUTCMinutes()).toBe(0);

        // lt should be exactly 24 hours after gte
        expect(lt.getTime() - gte.getTime()).toBe(24 * 60 * 60 * 1000);
    });

    it('filters by status won and public users only', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        await getLeaderboard();

        const where = mockPrisma.userProgress.findMany.mock.calls[0][0].where;
        expect(where.status).toBe('won');
        expect(where.user).toMatchObject({ public: true });
    });

    it('limits results to 100', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        await getLeaderboard();

        const query = mockPrisma.userProgress.findMany.mock.calls[0][0];
        expect(query.take).toBe(100);
    });

    it('returns empty array when no completions exist', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        const entries = await getLeaderboard();

        expect(entries).toEqual([]);
    });

    it('defaults stars to 0 when null', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([
            {
                stars: null,
                updatedAt: new Date(),
                user: { id: 'PLAYER03', name: null, countryCode: null },
            },
        ]);

        const entries = await getLeaderboard();
        expect(entries[0].stars).toBe(0);
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
        userProgress: {
            findMany: vi.fn(),
            upsert: vi.fn(),
            deleteMany: vi.fn(),
        },
    },
}));

vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn(() => ({ toString: () => 'abcd1234' })),
    },
}));

import { prisma } from '@/lib';
import {
    linkProviderToUser,
    mergeAnonymousUser,
    updateUserCountry,
    getLeaderboard,
} from '@/services/user/user';

const mockPrisma = prisma as unknown as {
    user: {
        findUnique: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };
    userProgress: {
        findMany: ReturnType<typeof vi.fn>;
        upsert: ReturnType<typeof vi.fn>;
        deleteMany: ReturnType<typeof vi.fn>;
    };
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ─── linkProviderToUser ───────────────────────────────────────────────────────

describe('linkProviderToUser', () => {
    it('returns existing user id when provider account already exists', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({ id: 'EXISTING01' });
        mockPrisma.user.update.mockResolvedValue({});

        const id = await linkProviderToUser('google', 'gid-123', 'Alice', 'alice@example.com');

        expect(id).toBe('EXISTING01');
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { provider_providerId: { provider: 'google', providerId: 'gid-123' } },
            select: { id: true },
        });
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: 'EXISTING01' },
            data: { name: 'Alice', email: 'alice@example.com' },
        });
        expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('claims anonymous user record when no existing provider account found', async () => {
        mockPrisma.user.findUnique
            .mockResolvedValueOnce(null)                          // provider lookup
            .mockResolvedValueOnce({ id: 'ANON01', provider: null }); // anonymous lookup
        mockPrisma.user.update.mockResolvedValue({});

        const id = await linkProviderToUser('google', 'gid-new', 'Bob', 'bob@example.com', 'ANON01');

        expect(id).toBe('ANON01');
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: 'ANON01' },
            data: { provider: 'google', providerId: 'gid-new', name: 'Bob', email: 'bob@example.com' },
        });
        expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('creates a new user when no provider account and no anonymous user found', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue({});

        const id = await linkProviderToUser('google', 'gid-new', 'Bob', 'bob@example.com');

        expect(id).toBe('ABCD1234');
        expect(mockPrisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    provider: 'google',
                    providerId: 'gid-new',
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
            linkProviderToUser('google', 'gid-anon', null, null)
        ).resolves.not.toThrow();

        expect(mockPrisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ name: null, email: null }),
            })
        );
    });
});

// ─── mergeAnonymousUser ───────────────────────────────────────────────────────

describe('mergeAnonymousUser', () => {
    it('does nothing when anonymousUserId equals authenticatedUserId', async () => {
        await mergeAnonymousUser('SAME', 'SAME');
        expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('does nothing when anonymous user does not exist', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        await mergeAnonymousUser('GONE', 'AUTH01');
        expect(mockPrisma.userProgress.findMany).not.toHaveBeenCalled();
    });

    it('transfers progress and stats then deletes anonymous user', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({
            id: 'ANON01', played: 3, totalStars: 10, bestStreak: 2, currentStreak: 1,
        });
        mockPrisma.userProgress.findMany.mockResolvedValue([
            { puzzleId: 5, hintCoordinates: [], hintCount: 0, status: 'won', stars: 4 },
        ]);
        mockPrisma.userProgress.upsert.mockResolvedValue({});
        mockPrisma.user.update.mockResolvedValue({});
        mockPrisma.userProgress.deleteMany.mockResolvedValue({});
        mockPrisma.user.delete.mockResolvedValue({});

        await mergeAnonymousUser('ANON01', 'AUTH01');

        expect(mockPrisma.userProgress.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId_puzzleId: { userId: 'AUTH01', puzzleId: 5 } },
            })
        );
        expect(mockPrisma.user.update).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: 'AUTH01' } })
        );
        expect(mockPrisma.userProgress.deleteMany).toHaveBeenCalledWith({ where: { userId: 'ANON01' } });
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
            rank: 1, userId: 'PLAYER01', name: 'Alice', countryCode: 'US', stars: 5, completedAt: fakeDate,
        });
        expect(entries[1]).toMatchObject({
            rank: 2, userId: 'PLAYER02', name: null, countryCode: null, stars: 3,
        });
    });

    it('queries with a UTC date range for today', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        await getLeaderboard();

        const dateFilter = mockPrisma.userProgress.findMany.mock.calls[0][0].where.puzzle.date;
        expect(dateFilter).toHaveProperty('gte');
        expect(dateFilter).toHaveProperty('lt');
        expect(dateFilter.gte.getUTCHours()).toBe(0);
        expect(dateFilter.gte.getUTCMinutes()).toBe(0);
        expect(dateFilter.lt.getTime() - dateFilter.gte.getTime()).toBe(24 * 60 * 60 * 1000);
    });

    it('filters by status won', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        await getLeaderboard();

        const where = mockPrisma.userProgress.findMany.mock.calls[0][0].where;
        expect(where.status).toBe('won');
        expect(where.user).toBeUndefined();
    });

    it('limits results to 100', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);

        await getLeaderboard();

        expect(mockPrisma.userProgress.findMany.mock.calls[0][0].take).toBe(100);
    });

    it('returns empty array when no completions exist', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([]);
        expect(await getLeaderboard()).toEqual([]);
    });

    it('defaults stars to 0 when null', async () => {
        mockPrisma.userProgress.findMany.mockResolvedValue([
            { stars: null, updatedAt: new Date(), user: { id: 'PLAYER03', name: null, countryCode: null } },
        ]);
        const entries = await getLeaderboard();
        expect(entries[0].stars).toBe(0);
    });
});

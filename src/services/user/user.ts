import { MAX_STARS } from "@/constants";
import { prisma } from "@/lib";
import { StatisticsProps } from "@/types";
import crypto from 'crypto';

export const createUser = async (): Promise<string> => {
    try {
        const userId = crypto.randomBytes(4).toString('hex').toUpperCase();
        await prisma.user.create({
            data: {
                id: userId,
                createdAt: new Date(),
                stats: { create: {} }
            }
        });
        return userId;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export const upsertGoogleUser = async ({
    providerId,
    name,
    email,
}: {
    providerId: string;
    name?: string | null;
    email?: string | null;
}): Promise<string> => {
    try {
        const existing = await prisma.user.findUnique({
            where: { provider_providerId: { provider: 'google', providerId } }
        });
        if (existing) return existing.id;

        const userId = crypto.randomBytes(4).toString('hex').toUpperCase();
        await prisma.user.create({
            data: {
                id: userId,
                provider: 'google',
                providerId,
                name: name ?? null,
                email: email ?? null,
                stats: { create: {} }
            }
        });
        return userId;
    } catch (error) {
        console.error('Error upserting Google user:', error);
        throw error;
    }
}

export const getStatistics = async (userId: string): Promise<StatisticsProps> => {
    try {
        const stats = await prisma.userStats.findUnique({
            where: { userId }
        });
        return {
            played: stats?.played ?? 0,
            totalStars: stats?.totalStars ?? 0,
            currentStreak: stats?.currentStreak ?? 0,
            bestStreak: stats?.bestStreak ?? 0,
            starDistribution: stats?.starDistribution ?? Array(MAX_STARS + 1).fill(0)
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        throw error;
    }
}

export const incrementPlayedCount = async (userId: string): Promise<void> => {
    try {
        await prisma.userStats.update({
            where: { userId },
            data: { played: { increment: 1 } }
        });
    } catch (error) {
        console.error('Error incrementing played count:', error);
        throw error;
    }
}

export const updateStreak = async (userId: string, won: boolean): Promise<void> => {
    try {
        const stats = await prisma.userStats.findUnique({
            where: { userId },
            select: { currentStreak: true, bestStreak: true }
        });

        if (!stats) throw new Error('UserStats not found');

        const newCurrentStreak = won ? stats.currentStreak + 1 : 0;
        const newBestStreak = Math.max(stats.bestStreak, newCurrentStreak);

        await prisma.userStats.update({
            where: { userId },
            data: { currentStreak: newCurrentStreak, bestStreak: newBestStreak }
        });
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error;
    }
}

export const updateStars = async (userId: string, stars: number): Promise<void> => {
    try {
        if (stars < 0 || stars > MAX_STARS) {
            throw new Error('Stars must be between 0 and 5');
        }

        const stats = await prisma.userStats.findUnique({
            where: { userId },
            select: { starDistribution: true }
        });

        if (!stats) throw new Error('UserStats not found');

        const newDistribution = [...stats.starDistribution];
        newDistribution[stars]++;

        await prisma.userStats.update({
            where: { userId },
            data: {
                totalStars: { increment: stars },
                starDistribution: newDistribution
            }
        });
    } catch (error) {
        console.error('Error updating stars:', error);
        throw error;
    }
}

export const getLeaderboard = async (): Promise<{ name: string | null; totalStars: number; played: number; bestStreak: number }[]> => {
    try {
        const MAX_LEADERBOARD_USERS = 10;
        const rows = await prisma.userStats.findMany({
            where: { user: { provider: { not: null } } },
            orderBy: { totalStars: 'desc' },
            take: MAX_LEADERBOARD_USERS,
            select: {
                totalStars: true,
                played: true,
                bestStreak: true,
                user: { select: { name: true } }
            }
        });
        return rows.map(r => ({
            name: r.user.name,
            totalStars: r.totalStars,
            played: r.played,
            bestStreak: r.bestStreak
        }));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}

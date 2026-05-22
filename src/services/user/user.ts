import { MAX_STARS } from "@/constants";
import { prisma } from "@/lib";
import { StatisticsProps } from "@/types";
import { Prisma } from "@prisma/client";
import crypto from 'crypto';

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string | null;
    countryCode: string | null;
    stars: number;
    completedAt: Date;
}

export const createUser = async (): Promise<string> => {
    try {
        const userId = crypto.randomBytes(4).toString('hex').toUpperCase();
        await prisma.user.create({
            data: { id: userId, createdAt: new Date() }
        });
        return userId;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export const getStatistics = async (userId: string): Promise<StatisticsProps> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { played: true, totalStars: true, currentStreak: true, bestStreak: true, starDistribution: true }
        });
        const statistics: StatisticsProps = {
            played: user?.played || 0,
            totalStars: user?.totalStars || 0,
            currentStreak: user?.currentStreak || 0,
            bestStreak: user?.bestStreak || 0,
            starDistribution: user?.starDistribution || Array(MAX_STARS + 1).fill(0)
        };
        return statistics;
    } catch (error) {
        console.error('Error getting statistics:', error);
        throw error;
    }
}
export const incrementPlayedCount = async (userId: string): Promise<void> => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { played: { increment: 1 } }
        });
    } catch (error) {
        console.error('Error incrementing played count:', error);
        throw error;
    }
}

export const updateStreak = async (userId: string, won: boolean): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { currentStreak: true, bestStreak: true }
        });

        if (!user) throw new Error('User not found');

        const newCurrentStreak = won ? user.currentStreak + 1 : 0;
        const newBestStreak = Math.max(user.bestStreak, newCurrentStreak);

        await prisma.user.update({
            where: { id: userId },
            data: {
                currentStreak: newCurrentStreak,
                bestStreak: newBestStreak
            }
        });
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error;
    }
}

export const linkProviderToUser = async (
    provider: string,
    providerId: string,
    name: string | null,
    email: string | null,
    anonymousUserId?: string | null
): Promise<string> => {
    const existing = await prisma.user.findUnique({
        where: { provider_providerId: { provider, providerId } },
        select: { id: true }
    });

    if (existing) {
        await prisma.user.update({
            where: { id: existing.id },
            data: { name, email }
        });
        return existing.id;
    }

    // If an anonymous user exists and isn't yet linked to any provider, claim that record
    if (anonymousUserId) {
        const anon = await prisma.user.findUnique({
            where: { id: anonymousUserId },
            select: { id: true, provider: true }
        });
        if (anon && !anon.provider) {
            await prisma.user.update({
                where: { id: anonymousUserId },
                data: { provider, providerId, name, email }
            });
            return anonymousUserId;
        }
    }

    const userId = crypto.randomBytes(4).toString('hex').toUpperCase();
    await prisma.user.create({
        data: { id: userId, provider, providerId, name, email, createdAt: new Date() }
    });
    return userId;
}

export const mergeAnonymousUser = async (anonymousUserId: string, authenticatedUserId: string): Promise<void> => {
    if (anonymousUserId === authenticatedUserId) return;

    const anon = await prisma.user.findUnique({ where: { id: anonymousUserId } });
    if (!anon) return;

    const anonProgress = await prisma.userProgress.findMany({ where: { userId: anonymousUserId } });
    for (const prog of anonProgress) {
        await prisma.userProgress.upsert({
            where: { userId_puzzleId: { userId: authenticatedUserId, puzzleId: prog.puzzleId } },
            update: {},
            create: {
                userId: authenticatedUserId,
                puzzleId: prog.puzzleId,
                hintCoordinates: prog.hintCoordinates as Prisma.InputJsonValue,
                hintCount: prog.hintCount,
                status: prog.status,
                stars: prog.stars,
            }
        });
    }

    await prisma.user.update({
        where: { id: authenticatedUserId },
        data: {
            played: { increment: anon.played },
            totalStars: { increment: anon.totalStars },
            bestStreak: { increment: anon.bestStreak },
            currentStreak: { increment: anon.currentStreak },
        }
    });

    await prisma.userProgress.deleteMany({ where: { userId: anonymousUserId } });
    await prisma.user.delete({ where: { id: anonymousUserId } });
}

export const updateUserCountry = async (userId: string, countryCode: string): Promise<void> => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { countryCode }
        });
    } catch (error) {
        console.error('Error updating user country:', error);
        throw error;
    }
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
        const now = new Date();
        const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const startOfTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

        const entries = await prisma.userProgress.findMany({
            where: {
                status: 'won',
                puzzle: { date: { gte: startOfToday, lt: startOfTomorrow } }
            },
            select: {
                stars: true,
                updatedAt: true,
                user: {
                    select: { id: true, name: true, countryCode: true }
                }
            },
            orderBy: [
                { stars: 'desc' },
                { updatedAt: 'asc' }
            ],
            take: 100
        });

        type Entry = (typeof entries)[number];
        return entries.map((e: Entry, i: number) => ({
            rank: i + 1,
            userId: e.user.id,
            name: e.user.name,
            countryCode: e.user.countryCode,
            stars: e.stars ?? 0,
            completedAt: e.updatedAt
        }));
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw error;
    }
}

export const updateStars = async (userId: string, stars: number): Promise<void> => {
    try {
        if (stars < 0 || stars > MAX_STARS) {
            throw new Error('Stars must be between 0 and 5');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { starDistribution: true }
        });

        if (!user) throw new Error('User not found');

        const newDistribution = [...user.starDistribution];
        newDistribution[stars]++;

        await prisma.user.update({
            where: { id: userId },
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
import { MAX_STARS } from "@/constants";
import { prisma } from "@/lib";
import { StatisticsProps } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (): Promise<string> => {
    try {
        const userId = uuidv4();
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
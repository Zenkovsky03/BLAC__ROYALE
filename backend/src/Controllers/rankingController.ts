import type { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRankings(req: Request, res: Response) {
    const period = req.params.period;

    if (!['all', 'monthly', 'weekly'].includes(period!)) {
        return res.status(400).json({
            message: 'Invalid period. Must be one of: all, monthly, weekly'
        });
    }

    try {

        let dateFilter = {};

        if (period === 'monthly') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            dateFilter = {
                timestamp: {
                    gte: oneMonthAgo
                }
            };
        } else if (period === 'weekly') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            dateFilter = {
                timestamp: {
                    gte: oneWeekAgo
                }
            };
        }

        const winTransactions = await prisma.transaction.findMany({
            where: {
                type: 'WIN',
                ...dateFilter
            },
            include: {
                wallet: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        const userWinnings = new Map<string, {
            userId: string;
            username: string;
            email: string;
            totalWinnings: number;
            winCount: number;
        }>();

        for (const transaction of winTransactions) {
            const userId = transaction.wallet.user.id;
            const username = transaction.wallet.user.username;
            const email = transaction.wallet.user.email;
            const amount = Number(transaction.amount);

            if (userWinnings.has(userId)) {
                const existing = userWinnings.get(userId)!;
                existing.totalWinnings += amount;
                existing.winCount += 1;
            } else {
                userWinnings.set(userId, {
                    userId,
                    username,
                    email,
                    totalWinnings: amount,
                    winCount: 1
                });
            }
        }

        const rankings = Array.from(userWinnings.values())
            .sort((a, b) => b.totalWinnings - a.totalWinnings)
            .map((user, index) => ({
                rank: index + 1,
                userId: user.userId,
                username: user.username,
                email: user.email,
                totalWinnings: user.totalWinnings.toFixed(2),
                winCount: user.winCount
            }));

        return res.json({
            period,
            rankings,
            totalPlayers: rankings.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve rankings due to a server error.'
        });
    }
}
import type {Response} from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
const prisma = new PrismaClient(); // ORM client

export const ranking = async (req: AuthRequest, res: Response) =>
{

    const Max = 10;

    try {
        const topUsers = await prisma.transaction.groupBy({
            by: ['walletId'],
            where: {
                type: 'WIN'
            },
            _sum: {
                amount: true
            },
            orderBy: {
                _sum: {
                    amount: 'desc'
                }
            },
            take: Max
        });

        const walletIds = topUsers.map(t => t.walletId);
        const wallets = await prisma.wallet.findMany({
            where: { id: { in: walletIds } },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        const rankings = topUsers.map((stat, index) => {
            const wallet = wallets.find(w => w.id === stat.walletId);
            return {
                rank: index + 1,
                username: wallet?.user.username,
                totalWins: stat._sum.amount
            };
        });

        res.status(200).json(rankings);
    } catch (error)
    {
        res.status(500).json({ message: 'Failed to fetch user profile.' });
    }
}
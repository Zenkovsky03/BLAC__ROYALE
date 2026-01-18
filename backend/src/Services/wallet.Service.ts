import {type GameType, TransactionType} from '@prisma/client';
import {prisma} from "../../prisma/prismaSingleton.ts";

export class WalletService
{
    async updateBalance(userId: string, amount: number, type: TransactionType, game?: GameType) {
        return prisma.$transaction(async (tx) => {

            let wallet = await tx.wallet.findUnique({
                where: { userId },
                select: { id: true }
            });

            if (!wallet) {
                wallet = await tx.wallet.create({
                    data: { userId },
                    select: { id: true }
                });
            }

            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        [amount > 0 ? 'increment' : 'decrement']: Math.abs(amount)
                    }
                }
            });

            await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: Math.abs(amount),
                    type,
                    ...(game && { game }),
                }
            });

            return updatedWallet;
        });
    }

    async placeBet(userId: string, betAmount: number, game: GameType) {
        return this.updateBalance(userId, -betAmount, 'BET', game);
    }

    async recordWin(userId: string, winAmount: number, game: GameType) {
        return this.updateBalance(userId, winAmount, 'WIN', game);
    }

    async recordLoss(userId: string, lossAmount: number, game: GameType) {
        return this.updateBalance(userId, -lossAmount, 'LOST', game);
    }

    async deposit(userId: string, amount: number) {
        return this.updateBalance(userId, amount, 'DEPOSIT');
    }

    async withdraw(userId: string, amount: number) {
        return this.updateBalance(userId, -amount, 'WITHDRAWAL');
    }
}

export const walletService = new WalletService();
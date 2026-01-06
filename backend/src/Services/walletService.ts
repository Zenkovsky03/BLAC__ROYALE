import { TransactionType } from '@prisma/client';
import {prisma} from "../../prisma/prismaSingleton.ts";

export class WalletService
{
    async updateBalance(walletId: string, amount: number, type: TransactionType) {
        return prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.update({
                where: {id: walletId},
                data: {
                    balance: {
                        [amount > 0 ? 'increment' : 'decrement']: Math.abs(amount)
                    }
                }
            });

            await tx.transaction.create({
                data: {
                    walletId,
                    amount: Math.abs(amount),
                    type
                }
            });

            return wallet;
        });
    }

    async placeBet(walletId: string, betAmount: number) {
        return this.updateBalance(walletId, -betAmount, 'BET' , );
    }

    async recordWin(walletId: string, winAmount: number) {
        return this.updateBalance(walletId, winAmount, 'WIN');
    }

    async deposit(walletId: string, amount: number) {
        return this.updateBalance(walletId, amount, 'DEPOSIT');
    }

    async withdraw(walletId: string, amount: number) {
        return this.updateBalance(walletId, -amount, 'WITHDRAWAL');
    }
}
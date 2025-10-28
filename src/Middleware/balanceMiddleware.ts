import type {NextFunction} from "express";
import type {AuthRequest} from "./authMiddleware.ts";
import { PrismaClient } from '@prisma/client';

// Checks if balance is enough for wrapped operation
const prisma = new PrismaClient(); // ORM client
export const balanceCheck = async (req: AuthRequest, res: any, next: NextFunction) =>
{
    const { betAmount } = req.body;
    const userId = req.userId!;

    try
    {

        if (betAmount <= 0)
        {
            return res.status(400).json({message: 'Bet amount must be greater than 0.'});
        }

        const balance = await prisma.wallet.findUnique({where: {userId}, select: {balance: true}})

        if (!balance)
        {
            return res.status(404).json({message: 'Wallet not found.'});
        }
        if (balance.balance < betAmount)
        {
            return res.status(400).json({message: 'Insufficient balance.'});
        }

        next();
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'No wallet found.'});
    }
}
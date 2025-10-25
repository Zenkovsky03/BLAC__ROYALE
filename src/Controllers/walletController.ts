import type { Response} from "express";
import { PrismaClient } from '@prisma/client';
//@ts-ignore
import { AuthRequest } from '../Middleware/authMiddleware.ts';

const prisma = new PrismaClient(); // ORM client

//POST deposit/withdraw
export async function deposit(req: AuthRequest, res: Response)
{
    const userId = req.userId!;
    const {amount} = req.body;

    if (amount >= 0)
        return res.status(400).json({message: 'Withdrawn amount must be lesser than 0.'});

    try {
        const updatedWallet = await prisma.wallet.update(
            {
                where: {userId},
                data: {balance: {increment: amount} , transactions: {create: {amount: amount, type: "DEPOSIT"}}},
                select: {balance: true , transactions: {select: {amount: true, type: true , timestamp: true}}}
            })

        res.status(200).json(updatedWallet); // Respond with updated wallet
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Deposit/Withdraw failed.'});
    }
}

export async function withdraw(req: AuthRequest, res: Response)
{
    const userId = req.userId!;
    const {amount} = req.body;

    if (amount >= 0)
        return res.status(400).json({message: 'Withdrawn amount must be lesser than 0.'});

    try {
        const updatedWallet = await prisma.wallet.update(
            {
                where: {userId},
                data: {balance: {increment: amount} , transactions: {create: {amount: amount, type: "WITHDRAWAL"}}},
                select: {balance: true , transactions: {select: {amount: true, type: true , timestamp: true}}}
            })

        res.status(200).json(updatedWallet); // Respond with updated wallet
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Deposit/Withdraw failed.'});
    }
}

//GET
export async function getWallet(req: AuthRequest, res: Response)
{
    const userId = req.userId!;

    try
    {
        const wallet = prisma.wallet.findUnique(
            {
                where: {userId}
                ,select: {balance: true , transactions: true}
            });

    res.status(200).json({wallet}); // Respond with the wallet
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Deposit/Withdraw failed.'});
    }
}

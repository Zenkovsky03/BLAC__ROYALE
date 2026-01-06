import type { Response} from "express";
import type { AuthRequest } from '../Middleware/authMiddleware.ts';

import {prisma} from "../../prisma/prismaSingleton.ts";


export async function getWallet(req: AuthRequest, res: Response)
{
    const userId = req.userId!;

    try
    {
        const wallet = await prisma.wallet.findUnique(
            {
                where: {userId},
                select: {
                    balance: true,
                    transactions: {
                        orderBy: { timestamp: 'desc' },
                        take: 5
                    }
                }
            });

        if (!wallet) {
            return res.status(200).json({ balance: 0, transactions: [] });
        }

        res.status(200).json(wallet);
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'No wallet found'});
    }
}

export async function deposit(req: AuthRequest, res: Response)
{
    const userId = req.userId!;
    const {amount} = req.body;

    if (amount <= 0)
        return res.status(400).json({message: 'Deposited amount must be grater than 0.'});

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
        res.status(500).json({message: 'Deposit failed.'});
    }
}

export async function withdraw(req: AuthRequest, res: Response)
{
    const userId = req.userId!;
    const {amount} = req.body;

    try
    {
        const updatedWallet = await prisma.wallet.update(
            {
                where: {userId},
                data: {balance: {decrement: amount} , transactions: {create: {amount: amount, type: "WITHDRAWAL"}}},
                select: {balance: true , transactions: {select: {amount: true, type: true , timestamp: true}} }
            })


        res.status(200).json(updatedWallet); // Respond with updated wallet
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Deposit/Withdraw failed.'});
    }
}


import type { Response} from "express";
import type { AuthRequest } from '../Middleware/auth.Middleware.ts';
import {prisma} from "../../prisma/prismaSingleton.ts";
import {walletService} from "../Services/wallet.Service.ts";


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
        await walletService.deposit(userId, amount)

        const updatedWallet =  await prisma.wallet.findUnique({
            where: {userId},
            select: {
                balance: true,
                transactions: {
                    select: {amount: true, type: true, timestamp: true},
                    orderBy: {timestamp: 'desc'},
                    take: 5
                }
            }
        });

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
        await walletService.withdraw(userId, amount)

        const updatedWallet = await prisma.wallet.findUnique({
            where: {userId},
            select: {
                balance: true,
                transactions: {
                    select: {amount: true, type: true, timestamp: true},
                    orderBy: {timestamp: 'desc'},
                    take: 5
                }
            }
        });

        res.status(200).json(updatedWallet); // Respond with updated wallet
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Deposit/Withdraw failed.'});
    }
}


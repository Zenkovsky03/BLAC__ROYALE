import type {AuthRequest} from "../Middleware/authMiddleware.ts";
import {prisma} from "../../prisma/prismaSingleton.ts";
import type {Response} from "express";

export async function getWalletAdmin(req: AuthRequest, res: Response)
{
    const userId = req.params.userId!;

    try
    {
        const wallet = await prisma.wallet.findUnique(
            {
                where: {userId}
                ,select: {balance: true , transactions: true}
            });

        res.status(200).json(wallet); // Respond with the wallet
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'No wallet found.'});
    }
}
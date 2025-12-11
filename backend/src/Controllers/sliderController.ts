import type {AuthRequest} from "../Middleware/authMiddleware.ts";
import type {Response} from "express";

import {prisma} from "../../prisma/prismaSingleton.ts";

export async function sliderPlay(req: AuthRequest, res: Response)
{
    try
    {
        const {bet , min , max} = req.body;
        const userId = String(req.userId!);

        if (bet < 0)
            return res.status(400).json({error: 'Invalid request'});

        if (min > 100 || min < 0  || max > 100 || max < 0 || min >= max)
            return res.status(400).json({error: 'Invalid request'});
        if (!Number.isInteger(min) || !Number.isInteger(max))
            return res.status(400).json({error: 'Invalid request'});

        if (!userId)
            return res.status(400).json({error: 'Invalid request'});
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user)
            return res.status(404).json({error: 'User not found'});

        const num = getRandomInt(0, 100);

        let winAmount;
        const diffMultiplayer = 1 - (max - min)/100

        if (num > max || num < min)
        {
            winAmount = 0;
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {decrement: bet } , transactions: {create: {amount: bet, type: "LOST"}}},
            })
        }
        else if (num === max || num === min)
        {
            winAmount = (1 + diffMultiplayer) * bet * 2;
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {increment: winAmount - bet } , transactions: {create: {amount: winAmount, type: "WIN"}}},
            })
        }
        else
        {
            winAmount = (1 + diffMultiplayer) * bet;
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {increment: winAmount - bet } , transactions: {create: {amount: winAmount, type: "WIN"}}},
            })
        }

        return res.json({
            num,
            bet,
            winAmount,
        });
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({error: 'Spin failed'});
    }
}



function getRandomInt(min: number, max: number): number
{
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
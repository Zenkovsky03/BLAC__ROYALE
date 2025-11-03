import type { Response} from "express";
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
const prisma = new PrismaClient(); // ORM client


//POST
export async function PlayRoulette(req: AuthRequest, res: Response)
{
    const userId = req.userId!;
    const {betAmount , color , number} = req.body;

    const NumWinMulti = 5;
    const ColWinMulti = 2;

    try
    {

        let winMultiplayer = 1;
        let WinScenario = 0;

        await prisma.wallet.update({
            where: {userId},
            data: {balance: {decrement: betAmount}},
        })
        const randomNumber = Math.trunc(Math.random() * 100)%37

        if (randomNumber == number)
        {
            winMultiplayer = winMultiplayer * NumWinMulti;
            WinScenario++;
        }
        if (color == randomNumber%2) // two colors
        {
            winMultiplayer = winMultiplayer * ColWinMulti;
            WinScenario += 2;
        }

        let gain = 0;

        if (winMultiplayer != 1)
        {
            gain = betAmount * winMultiplayer;
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {increment: gain } , transactions: {create: {amount: (betAmount * winMultiplayer) - betAmount, type: "WIN"}}},
            })
            return res.status(200).json( { gain , winMultiplayer , WinScenario  , randomNumber} );
        }

        await prisma.wallet.update({
            where: {userId},
            data: {transactions: {create: {amount: betAmount , type: "LOST"}}},
        })

        res.status(200).json( { gain , winMultiplayer , WinScenario  , randomNumber} );
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Failed playing the game.'});
    }
}

/* Just for documentation
enum WinScenarios
{
    LOOSE,
    NUMBER_WIN,
    COLOR_WIN,
    BOTH_WIN,
}
*/
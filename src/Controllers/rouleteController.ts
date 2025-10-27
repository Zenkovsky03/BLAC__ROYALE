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
        let WinScenario = RouletteWinScenarios.No;

        prisma.wallet.update({
            where: {userId},
            data: {balance: {decrement: betAmount}},
        })
        const randomNumber = (Math.random() * 100)%37

        if (randomNumber == number)
        {
            winMultiplayer = winMultiplayer * NumWinMulti;
            WinScenario = RouletteWinScenarios.Number;
        }
        if (color == randomNumber%2)
        {
            winMultiplayer = winMultiplayer * ColWinMulti;
            if (WinScenario == RouletteWinScenarios.Number)
                WinScenario = RouletteWinScenarios.Both;
            else
                WinScenario = RouletteWinScenarios.Color;
        }

        let gain = 0;

        if (winMultiplayer != 1)
            gain = betAmount * winMultiplayer;

        prisma.wallet.update({
            where: {userId},
            data: {balance: {increment: gain } ,
                transactions: {create: {amount: betAmount * winMultiplayer, type: "WIN"}}},
        })

        res.status(200).json( { gain , winMultiplayer , WinScenario  , randomNumber} );
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Failed playing the game.'});
    }
}

//ENUM for win scenarios
enum RouletteWinScenarios
{
    "No" = 0, // LOST
    "Number" = 1, // Guessed number
    "Color" = 2, // Guessed color
    "Both" = 3, // Guessed both
}


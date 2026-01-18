import type { Response} from "express";
import type { AuthRequest } from '../Middleware/auth.Middleware.ts';
import {walletService} from "../Services/wallet.Service.ts";
import {GameType} from "@prisma/client";

const game = GameType.ROULETTE


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

        await walletService.placeBet(userId, betAmount, game)
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
            await walletService.recordWin(userId, gain, game)
            return res.status(200).json( { gain , winMultiplayer , WinScenario  , randomNumber} );
        }
        res.status(200).json( { gain , winMultiplayer , WinScenario  , randomNumber} );
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'Failed playing the game.'});
    }
}
import type { AuthRequest } from '../Middleware/auth.Middleware.ts';
import {walletService} from "../Services/wallet.Service.ts";
import {GameType} from "@prisma/client";

const game = GameType.COINFLIP

export const PlayCoinFlip = async (req: AuthRequest, res: any, ) =>
{
    const { betAmount , bet} = req.body;
    const userId = req.userId!;

    const winMultiplayer = 2;
    let gain = 0;

    try
    {
        await walletService.placeBet(userId, betAmount, game)
        const randomNumber = Math.trunc(Math.random() * 100)
        if(randomNumber % 2 == bet)
        {
            gain = betAmount * winMultiplayer;
            await walletService.recordWin(userId, gain , game)
            return res.status(200).json( { gain  , result: "WIN" } );
        }
        else {return res.status(200).json( { gain , result: "LOST"} );}
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'No games found.'});
    }
}
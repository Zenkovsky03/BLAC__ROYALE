import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
const prisma = new PrismaClient(); // ORM client


export const PlayCoinFlip = async (req: AuthRequest, res: any, ) =>
{
    const { betAmount , bet} = req.body;
    const userId = req.userId!;

    const winMultiplayer = 2;

    let gain = 0;

    try
    {
        await prisma.wallet.update({
            where: {userId},
            data: {balance: {decrement: betAmount}},
        })

        const randomNumber = Math.trunc(Math.random() * 100)

        if(randomNumber % 2 == bet)
        {
            gain = betAmount * winMultiplayer;
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {increment: gain } , transactions: {create: {amount: gain - betAmount, type: "WIN"}}},
            })
            return res.status(200).json( { gain  , result: "WIN" } );
        }
        else
        {
            await prisma.wallet.update({
                where: {userId},
                data: { transactions: {create: {amount: betAmount , type: "LOST"}}},
            })
            return res.status(200).json( { gain , result: "LOST"} );
        }

    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'No games found.'});
    }
}

/* Just for documentation
enum CoinSides
{
    Heads = 0,
    Tails = 1,
}
*/

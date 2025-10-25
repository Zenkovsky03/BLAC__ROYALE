import type { Response} from "express";
import { PrismaClient } from '@prisma/client';
//@ts-ignore
import { AuthRequest } from '../Middleware/authMiddleware.ts';

const prisma = new PrismaClient(); // ORM client

export async function getGames(req: Request, res: Response)
{
    try
    {
        const games = prisma.game.findMany( {
            where: { isActive: true },
            select: { name: true, description: true , winChancePrecentage: true , minWinChancePrecentage: true}
        } )

        res.status(200).json({games}); // Respond with the games
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({message: 'No games found.'});
    }
}
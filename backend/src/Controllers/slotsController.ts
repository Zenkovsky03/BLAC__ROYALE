import type {AuthRequest} from "../Middleware/authMiddleware.ts";
import type {Response} from "express";

import {prisma} from "../../prisma/prismaSingleton.ts";

const SYMBOLS = {
    CHERRY: { id: 1, weight: 100, payout: { 3: 2 } },
    LEMON: { id: 2, weight: 100, payout: { 3: 2 } },
    ORANGE: { id: 3, weight: 90, payout: { 3: 3 } },
    PLUM: { id: 4, weight: 80, payout: { 3: 4 } },
    GRAPE: { id: 5, weight: 70, payout: { 3: 5 } },
    WATERMELON: { id: 6, weight: 60, payout: { 3: 8 } },
    BELL: { id: 7, weight: 40, payout: { 3: 10 } },
    STAR: { id: 8, weight: 20, payout: { 3: 15 } },
    SEVEN: { id: 9, weight: 10, payout: { 3: 50 } }
};

type SymbolKey = keyof typeof SYMBOLS;


export async function slotsSpin(req: AuthRequest, res: Response) {
    try {
        // Validation
        const {bet} = req.body;
        const userId = String(req.userId!);

        const user = await prisma.user.findUnique({where: {id: userId}});

        if (!user)
            return res.status(404).json({error: 'User not found'});

        // Generate reels
        const reels: SymbolKey[] = [
            getRandomSymbol(),
            getRandomSymbol(),
            getRandomSymbol()
        ];

        const winAmount = calculateWin(reels, bet);


        if ( winAmount - bet > 0)
        {
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {increment: winAmount - bet } , transactions: {create: {amount: winAmount - bet, type: "WIN"}}},
            })
        }
        else
        {
            await prisma.wallet.update({
                where: {userId},
                data: { balance: {increment: winAmount - bet } , transactions: {create: {amount: winAmount - bet, type: "LOST"}}},
            })
        }

        return res.json({
            reels,
            symbols: reels.map(r => SYMBOLS[r].id),
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


function getRandomSymbol(): SymbolKey
{
    const totalWeight = Object.values(SYMBOLS).reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;

    for (const [key, symbol] of Object.entries(SYMBOLS)) {
        random -= symbol.weight;
        if (random <= 0) return key as SymbolKey;
    }

    return 'CHERRY';
}

// Calculate winnings
function calculateWin(reels: SymbolKey[], bet: number): number
{
    const counts: Record<string, number> = {};

    reels.forEach(symbol => {
        counts[symbol] = (counts[symbol] || 0) + 1;
    });

    let totalWin = 0;

    for (const [symbol, count] of Object.entries(counts)) {
        const symbolData = SYMBOLS[symbol as SymbolKey];
        if (symbolData.payout[count as keyof typeof symbolData.payout]) {
            totalWin += bet * symbolData.payout[count as keyof typeof symbolData.payout];
        }
    }

    return totalWin;
}

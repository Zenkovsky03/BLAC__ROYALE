import type {AuthRequest} from "../Middleware/auth.Middleware.ts";
import type {Response} from "express";
import {walletService} from "../Services/wallet.Service.ts";
import {GameType} from "@prisma/client";

const game = GameType.SLOTS

const SYMBOLS = {
    CHERRY:     { id: 1, weight: 50, payout: { 3: 2, 2: 0.5 } },
    LEMON:      { id: 2, weight: 50, payout: { 3: 2, 2: 0.5 } },
    ORANGE:     { id: 3, weight: 45, payout: { 3: 3, 2: 1 } },
    PLUM:       { id: 4, weight: 40, payout: { 3: 4, 2: 1 } },
    GRAPE:      { id: 5, weight: 35, payout: { 3: 5, 2: 2 } },
    WATERMELON: { id: 6, weight: 30, payout: { 3: 8, 2: 2 } },
    BELL:       { id: 7, weight: 25, payout: { 3: 10, 2: 3 } },
    STAR:       { id: 8, weight: 20, payout: { 3: 15, 2: 5 } },
    SEVEN:      { id: 9, weight: 15, payout: { 3: 50, 2: 10 } }
};

type SymbolKey = keyof typeof SYMBOLS;


export async function slotsSpin(req: AuthRequest, res: Response) {
    try {
        const {bet} = req.body;
        const userId = String(req.userId!);

        const reels: SymbolKey[] = [
            getRandomSymbol(),
            getRandomSymbol(),
            getRandomSymbol()
        ];

        const winAmount = calculateWin(reels, bet);

        await walletService.placeBet(userId, bet , game);

        if ( winAmount - bet > 0)
        {
            await walletService.recordWin(userId, winAmount , game);
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

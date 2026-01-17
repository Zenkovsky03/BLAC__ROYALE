import type {AuthRequest} from "../Middleware/auth.Middleware.ts";
import type {Response} from "express";
import {GameType} from "@prisma/client";
import {walletService} from "../Services/wallet.Service.ts";

const game = GameType.SLIDER

export async function sliderPlay(req: AuthRequest, res: Response)
{
    const {bet , min , max} = req.body;
    const userId = String(req.userId!);

    try
    {
        if (bet <= 0)
            return res.status(400).json({error: 'Invalid bet amount'});

        if (min < 0 || max > 100 || min >= max)
            return res.status(400).json({error: 'Invalid range'});

        if (!Number.isInteger(min) || !Number.isInteger(max))
            return res.status(400).json({error: 'Range must be integers'});


        const num = getRandomInt(0, 100);
        const winChance = max - min;

        // OBLICZANIE MNOŻNIKA (Standard Kasynowy)
        const houseEdge = 0.99;
        let multiplier = 0;

        if (winChance > 0) {
            multiplier = (100 / winChance) * houseEdge;
        }

        // Formatowanie mnożnika (opcjonalne, dla czystości danych)
        multiplier = Number(multiplier.toFixed(4));

        let winAmount = 0;


        await walletService.placeBet(userId, bet , game)
        if (num >= min && num <= max) //WIN
        {
            winAmount = Number((bet * multiplier).toFixed(2));
            await walletService.recordWin(userId, winAmount , game)
        }

        return res.json({
            num,
            bet,
            winAmount,
            multiplier,
            isWin: winAmount > 0
        });
    }
    catch (error)
    {
        console.error("Slider Error:", error);
        res.status(500).json({error: 'Bet failed'});
    }
}

function getRandomInt(min: number, max: number): number
{
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
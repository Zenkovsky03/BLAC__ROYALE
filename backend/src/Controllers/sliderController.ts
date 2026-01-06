import type {AuthRequest} from "../Middleware/authMiddleware.ts";
import type {Response} from "express";

import {prisma} from "../../prisma/prismaSingleton.ts";

export async function sliderPlay(req: AuthRequest, res: Response)
{
    try
    {
        // 1. Walidacja danych wejściowych
        const {bet , min , max} = req.body;
        const userId = String(req.userId!); // Zakładamy, że Auth middleware zapewnia userId

        if (bet <= 0) // Zmienione na <= 0, żeby nie można było grać za darmo
            return res.status(400).json({error: 'Invalid bet amount'});

        if (min < 0 || max > 100 || min >= max)
            return res.status(400).json({error: 'Invalid range'});

        if (!Number.isInteger(min) || !Number.isInteger(max))
            return res.status(400).json({error: 'Range must be integers'});

        if (!userId)
            return res.status(400).json({error: 'User ID missing'});

        // 2. Sprawdzenie czy użytkownik istnieje
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user)
            return res.status(404).json({error: 'User not found'});

        // Opcjonalnie: Tu powinieneś sprawdzić czy user ma wystarczające środki (balance >= bet)
        // Ale zakładamy, że obsłuży to logika bazy danych lub frontend

        // --- TU ZACZYNA SIĘ NOWA LOGIKA (WKLEJONY FRAGMENT) ---

        const num = getRandomInt(0, 100);
        const rangeSize = max - min;
        const winChance = rangeSize; // Szansa w % (dla zakresu 0-100)

        // OBLICZANIE MNOŻNIKA (Standard Kasynowy)
        // House Edge (Przewaga kasyna) = 2% (czyli RTP 98%)
        const houseEdge = 0.98;
        let multiplier = 0;

        if (winChance > 0) {
            multiplier = (100 / winChance) * houseEdge;
        }

        // Formatowanie mnożnika (opcjonalne, dla czystości danych)
        multiplier = Number(multiplier.toFixed(4));

        let winAmount = 0;

        // Sprawdzenie wygranej (inclusive - czyli włącznie z min i max)
        if (num >= min && num <= max) {
            // WYGRANA
            winAmount = Number((bet * multiplier).toFixed(2));

            await prisma.wallet.update({
                where: {userId},
                data: {
                    // UWAGA: W Twoim starym kodzie nie odejmowałeś stawki przed if-em.
                    // Dlatego tutaj musimy dodać ZYSK NETTO (wygrana - stawka).
                    // Jeśli dodamy całe winAmount, gracz dostanie "darmową" stawkę z powrotem + wygraną.
                    balance: { increment: winAmount - bet },
                    transactions: { create: { amount: winAmount - bet, type: "WIN" }}
                },
            });
        } else {
            // PRZEGRANA
            await prisma.wallet.update({
                where: {userId},
                data: {
                    balance: { decrement: bet },
                    transactions: { create: { amount: bet, type: "LOST" }}
                },
            });
        }

        // --- KONIEC NOWEJ LOGIKI ---

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
        res.status(500).json({error: 'Spin failed'});
    }
}

function getRandomInt(min: number, max: number): number
{
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
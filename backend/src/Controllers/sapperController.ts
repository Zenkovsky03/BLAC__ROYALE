import type { Response} from "express";
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
import {prisma} from "../../prisma/prismaSingleton.ts";
import {walletService} from "../Services/walletService.ts";
import {GameType} from "@prisma/client";

const game = GameType.SAPPER


//POST
export async function resignSapper(req: AuthRequest, res: Response)
{
    // POPRAWKA: ID bierzemy z tokena (req.userId), a nie z parametrów URL
    const userId = req.userId!;

    try
    {
        const map = await prisma.sapperMap.findFirst({ where: { userId } });

        if (map === null) {return res.status(404).json({ message: 'No map found for user.' });}

        let winAmount = map.bet * map.winMultiplayer;
        await walletService.recordWin(userId, winAmount , game)

        await destroyMap(userId);
        // Zwracamy map.map (string), aby frontend mógł go wyświetlić
        return res.json({ message: 'Game ended.', map: { ...map, map: map.map } });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ message: 'Failed to resign.' });
    }
}

//POST
// backend/src/Controllers/sapperController.ts

export async function playSapper(req: AuthRequest, res: Response) {
    const { X, Y } = req.body;
    const userId = req.userId!;

    try {
        const map = await prisma.sapperMap.findFirst({ where: { userId: userId } });

        if (map === null) {
            return res.status(404).json({ message: `Sapper map not found.` });
        }
        const xValue = Number(X);
        const yValue = Number(Y);
        const index = xValue * map.n + yValue;

        if (index < 0 || index >= map.mask.length) return res.status(400).json({ message: 'Out of bounds.' });

        // Jeśli już kliknięte - zwróć to co jest
        if (map.mask[index] === '1') {
            return res.json({ message: 'Field already revealed.', map: maskSapperMap(map.map, map.mask), multiplier: map.winMultiplayer });
        }

        // Odkrywamy pole
        map.mask = map.mask.slice(0, index) + '1' + map.mask.slice(index + 1);

        if (map.map[index] === '.')
        {
            // --- PRZEGRANA ---
            await destroyMap(userId);
            // Zwracamy pełną mapę (map.map), żeby user widział gdzie były bomby
            return res.json({ message: 'Game lost.', map: map.map, multiplier: 0 });
        }
        else
        {
            // --- WYGRANA RUNDA (MATEMATYKA KASYNA) ---

            const totalCells = map.n * map.n;
            const totalBombs = map.map.split('').filter(c => c === '.').length;

            // Ile pól było odkrytych PRZED tym ruchem? (liczymy '1' w masce i odejmujemy to obecne, które właśnie dodaliśmy)
            const revealedBefore = map.mask.split('').filter(c => c === '1').length - 1;

            // Ile było dostępnych pól do kliknięcia?
            const remainingUnknown = totalCells - revealedBefore;

            // Ile z nich było bezpiecznych?
            const remainingSafe = remainingUnknown - totalBombs;

            // Szansa na trafienie w tym ruchu:
            const probability = remainingSafe / remainingUnknown;

            // Nowy mnożnik = Stary Mnożnik * (1 / Szansa).
            // Dajemy 99% payout (1% dla kasyna house edge)
            const houseEdge = 0.99;
            const stepMultiplier = (1 / probability) * houseEdge;

            map.winMultiplayer = map.winMultiplayer * stepMultiplier;

            const updatedMap = await prisma.sapperMap.update({ where: { id: map.id }, data: map });

            return res.json({
                message: 'Game continues...',
                // Zamiast liczb, frontend dostanie po prostu odkrytą mapę
                map: maskSapperMap(updatedMap.map, updatedMap.mask),
                multiplier: updatedMap.winMultiplayer
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}

//POST
export async function startSapper(req: AuthRequest, res: Response)
{
    const { bombsCount , betAmount , mapSize } = req.body;
    const userId = req.userId!; // Tu było dobrze

    await destroyMap(userId);

    try
    {
        await walletService.placeBet(userId, betAmount, game);

        if (mapSize * mapSize - 1 <= bombsCount)
        {
            // Poprawione rzucanie błędu
            throw new Error('Too many bombs');
        }

        const mapData = generateSapperMap( mapSize , bombsCount);
        const initialMask = Array(mapSize * mapSize).fill('0').join('');

        const data = {
            n: mapSize,
            map: mapData,
            mask: initialMask,
            bet: betAmount,
            userId: userId,
            winMultiplayer: 1,
        };

        const mapRecord = await prisma.sapperMap.create({ data: data });
        const maskedMap = maskSapperMap(mapRecord.map, initialMask);

        return res.json({
            map: maskedMap
        });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({message: 'Failed starting sapper game.'});
    }
}

// --- Helper Functions ---

function generateSapperMap(size: number, bombs: number): string
{
    const totalCells = size * size;
    const initialMap = Array(totalCells).fill('0');

    let bombsPlaced = 0;
    while (bombsPlaced < bombs)
    {
        const randomIndex = getRandomIntInclusive(0, initialMap.length - 1);
        if (initialMap[randomIndex] !== '.')
        {
            initialMap[randomIndex] = '.';
            bombsPlaced++;
        }
    }

    const map2D: string[][] = [];
    for (let i = 0; i < size; i++)
    {
        map2D.push(initialMap.slice(i * size, (i + 1) * size));
    }

    for (let i = 0; i < map2D.length; i++)
    {
        for (let j = 0; j < map2D[i]!.length; j++)
        {
            if (map2D[i]![j] !== '.')
            {
                let count = 0;
                const maxRow = map2D.length - 1;
                const maxCol = map2D[i]!.length - 1;

                if ( i > 0 && j > 0 && map2D[i-1]![j-1] === '.' ) count++;
                if ( i > 0 && map2D[i-1]![j] === '.' ) count++;
                if ( j > 0 && map2D[i]![j-1] === '.' ) count++;
                if ( i > 0 && j < maxCol && map2D[i-1]![j+1] === '.' ) count++;
                if ( i < maxRow && j > 0  && map2D[i+1]![j-1] === '.' ) count++;
                if ( i < maxRow && map2D[i+1]![j] === '.' ) count++;
                if ( j < maxCol && map2D[i]![j+1] === '.' ) count++;
                if ( i < maxRow && j < maxCol && map2D[i+1]![j+1] === '.' ) count++;
                map2D[i]![j] = count.toString();
            }
        }
    }
    return map2D.map(row => row.join('')).join('');
}

function maskSapperMap(map: string , mask:string): string
{
    let mapArr = map.split('');
    for (let index = 0; index < map.length; index++)
    {
        if (mask[index] === '0')
        {
            mapArr[index] = '?';
        }
    }
    return mapArr.join('');
}

function getRandomIntInclusive(min: number, max: number): number
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function destroyMap(userId: string)
{
    try {
        return await prisma.sapperMap.deleteMany({where: {userId: userId},});
    }
    catch (err)
    {
        console.error("Failed to destroy map record:", err);
        return null;
    }
}
import type { Response} from "express";
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
const prisma = new PrismaClient(); // ORM client


// bomb '.'
// number is just number
// mask: '0' undiscovered , '1' discovered
// masked map: '?' undiscovered


//POST

export async function resignSapper(req: AuthRequest, res: Response)
{
    const userId = String(req.params.userId);

    try
    {
        const map = await prisma.sapperMap.findFirst({ where: { userId } });
        if (map === null)
        {
            return res.status(404).json({ message: 'No map found for user.' });
        }

        let win = map.bet * map.winMultiplayer;

        await prisma.wallet.update({
            where: {userId},
            data: { balance: {increment: win } , transactions: {create: {amount: win , type: "WIN"}}},
        })

        await destroyMap(userId);

        return res.json({ message: 'Game ended.', map: map , wallet: prisma.wallet.findFirst({ where: { userId } }) });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({ message: 'Failed to resign. KEEP PLAYING!!!' });
    }

}

//POST
export async function playSapper(req: AuthRequest, res: Response) {
    const { X, Y } = req.body;
    const userId = String(req.params.userId);

    try {
        const map = await prisma.sapperMap.findFirst({ where: { userId: userId } });

        if (map === null) {
            console.warn(`Map not found for userId: ${userId}`);
            return res.status(404).json({ message: `Sapper map not found for user ${userId}.` });
        }
        const xValue = Number(X);
        const yValue = Number(Y);

        if (isNaN(xValue) || isNaN(yValue)) {
            return res.status(400).json({ message: 'Invalid coordinates provided.' });
        }

        const index = xValue * map.n + yValue;

        if (index < 0 || index >= map.mask.length) {
            return res.status(400).json({ message: 'Coordinates are out of map bounds.' });
        }

        map.mask = map.mask.slice(0, index) + '1' + map.mask.slice(index + 1);

        if (map.map[index] === '.')
        {
            await destroyMap(userId);
            return res.json({ message: 'Game lost.' , map: map });

        }
        else
        {
            map.winMultiplayer += Number(map.map[xValue * map.n + yValue]) / 10;

            const updatedMap = await prisma.sapperMap.update({
                where: { id: map.id },
                data: map
            });

            return res.json({ message: 'Game continues...' , map: maskSapperMap(updatedMap.map , updatedMap.mask ) });
        }

    } catch (err) {
        // This catch block handles unexpected database or server errors
        console.error(err);
        res.status(500).json({ message: 'Failed playing sapper game due to a server error.' });
    }
}

//POST
export async function startSapper(req: AuthRequest, res: Response)
{
    const { bombsCount , betAmount , mapSize } = req.body;

    const userId = req.userId!;

    await destroyMap(userId);

    try
    {
        await prisma.wallet.update({
            where: {userId},
            data: { balance: {decrement: betAmount } , transactions: {create: {amount: betAmount , type: "BET"}}},
        })

        if (mapSize * mapSize - 1 <= bombsCount)
        {
            new Error('Invalid arguments: The number of bombs (bombsCount) must be less than the total number of cells minus one (mapSize * mapSize - 1).');
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

        console.log(mapRecord.map)
        console.log(maskedMap);
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

                if ( i > 0 && j > 0 && map2D[i-1]![j-1] === '.' )
                    count++;
                if ( i > 0 && map2D[i-1]![j] === '.' )
                    count++;
                if ( j > 0 && map2D[i]![j-1] === '.' )
                    count++;
                if ( i > 0 && j < maxCol && map2D[i-1]![j+1] === '.' )
                    count++;
                if ( i < maxRow && j > 0  && map2D[i+1]![j-1] === '.' )
                    count++;
                if ( i < maxRow && map2D[i+1]![j] === '.' )
                    count++;
                if ( j < maxCol && map2D[i]![j+1] === '.' )
                    count++;
                if ( i < maxRow && j < maxCol && map2D[i+1]![j+1] === '.' )
                    count++;
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


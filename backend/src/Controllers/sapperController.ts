import type { Response} from "express";
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
const prisma = new PrismaClient(); // ORM client


// bomb '.'
// number is just number
// mask: '0' undiscovered , '1' discovered
// masked map: '?' undiscovered

//POST
export async function StartSapper(req: AuthRequest, res: Response)
{
    const { bombsCount , betAmount , mapSize } = req.body;

    const userId = req.userId!;
    try
    {
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
            userId: userId
        };

        const mapRecord = await prisma.sapperMap.create({ data: data });

        const maskedMap = maskSapperMap(mapData, initialMask);

        return res.json({
            mapId: mapRecord.id,
            mapSize: mapSize,
            maskedMap: maskedMap
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
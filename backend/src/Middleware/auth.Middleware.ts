import type {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {prisma} from '../../prisma/prismaSingleton.ts'

export interface AuthRequest extends Request
{
    userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(401).json({ message: 'No token provided or invalid format.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as unknown as {
            userId: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, banned: true }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        if (user.banned) {
            return res.status(403).json({
                message: 'Your account has been banned. Please contact support for more information.'
            });
        }

        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};
import type {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request
{
    userId?: number;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) =>
{
    // Unwrap token from request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(401).json({ message: 'No token provided or invalid format.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        //Verify and decode the token
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as unknown as {
            userId: number;
        };

        req.userId = decoded.userId;

        // Continue
        next();
    } catch (error) {
        // Token is invalid
        res.status(401).json({ message: 'Invalid token.' });
    }
};
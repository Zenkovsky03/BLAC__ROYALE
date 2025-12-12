import {prisma} from "../../prisma/prismaSingleton.ts";
import type {AuthRequest} from "./authMiddleware.ts";

// Middleware to check admin role
export const requireAdmin = async (req: AuthRequest, res: any, next: any) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
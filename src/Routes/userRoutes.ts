import { Router } from 'express';
// @ts-ignore
import { protect } from '../Middleware/authMiddleware.ts';
import { PrismaClient } from '@prisma/client'

const UserRouter = Router();
const prisma = new PrismaClient();

UserRouter.get('/profile', protect, async (req: any, res) =>
{
    // The 'protect' middleware ensures req.userId exists or throws an error
    const userId = req.userId;

    try
    {
        const userProfile = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true, balance: true , username: true },
        });

        if (!userProfile)
        {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(userProfile);
    } catch (error)
    {
        res.status(500).json({ message: 'Failed to fetch user profile.' });
    }
});

// @ts-ignore
import { register , login } from '../Controllers/authController.ts';

UserRouter.post('/register', register);
UserRouter.post('/login', login);



export default UserRouter;
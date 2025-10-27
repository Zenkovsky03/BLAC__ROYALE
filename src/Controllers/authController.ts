import type {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//@ts-ignore
import type { AuthRequest } from '../Middleware/authMiddleware.ts';
const prisma = new PrismaClient(); // ORM client

//POST
export async function register(req: Request, res: Response) {
    const { email, password } = req.body;

    try { // Check if the user already exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email : email,
                hashedPassword : hashedPassword,
                username : email,
                wallet: {create : {}},
            },
            // Dont return password
            select: { id: true, email: true },
        });

        res.status(201).json({ user: newUser }); // Respond with the new user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed.' });
    }
}

//POST
export async function login(req: Request, res: Response) {
    const { email, password } = req.body; // Unwrap body

    try {

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
        {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Chek if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // Payload (non-sensitive data)
            process.env.JWT_SECRET as string,
            { expiresIn: '6h' } // Token expiration time
        );

        // Respond with the token,
        res.status(200).json({ token });
    } catch (error) {
        // or error
        console.error(error);
        res.status(500).json({ message: 'Login failed.' });
    }
}

//Get
export const profile = async (req: AuthRequest, res: Response) =>
{
    const userId = req.userId!; // From token

    try {
        const userProfile = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true, username: true },
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Failed to fetch user profile.' });
    }
};

export const isAuthenticated = (req: AuthRequest, res: Response) =>
{
    if (req.userId) {
        res.status(200).json({ message: 'Authenticated! : )' });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
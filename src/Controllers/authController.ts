import type {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient(); // ORM client

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

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
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

export async function login(req: Request, res: Response) {
    const { email, password } = req.body; // Unwrap body

    try {

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
        {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Chek if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
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
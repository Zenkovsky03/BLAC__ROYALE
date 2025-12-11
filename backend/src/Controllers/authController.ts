import type {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type {AuthRequest} from '../Middleware/authMiddleware.ts';

import {prisma} from "../../prisma/prismaSingleton.ts";



export const profile = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!; // From token

    try {
        const userProfile = await prisma.user.findUnique({
            where: {id: userId},
            select: {email: true, createdAt: true, username: true},
        });

        if (!userProfile) {
            return res.status(404).json({message: 'User not found.'});
        }

        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch user profile.'});
    }
};

export async function register(req: Request, res: Response) {
    const {email, password, username, dateOfBirth} = req.body;

    try { // Check if the user already exists

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }


        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: 'Email already in use.'});
        }

        //dateOfBirth check
        const today = new Date();
        if (dateOfBirth <= new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()))
        {
            return res.status(400).json({message: 'You are too young.'});
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                hashedPassword: hashedPassword,
                username: username,
                wallet: {create: {}},
                dateOfBirth: new Date(dateOfBirth),
            },
            // Dont return password
            select: {email: true, createdAt: true, username: true},
        });

        res.status(201).json({newUser}); // Respond with the new user
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Registration failed.'});
    }
}

export async function login(req: Request, res: Response) {
    const {email, password} = req.body; // Unwrap body

    try {

        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        // Chek if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        // JWT token
        const token = jwt.sign(
            {userId: user.id, email: user.email}, // Payload (non-sensitive data)
            process.env.JWT_SECRET as string,
            {expiresIn: '2h'} // Token expiration time
        );

        const loggedInUser = await prisma.user.findUnique({
            where: {email},
            select: {email: true, createdAt: true, username: true}
        })

        // Respond with the token,
        res.status(200).json({token, loggedInUser});
    } catch (error) {
        // or error
        console.error(error);
        res.status(500).json({message: 'Login failed.'});
    }
}

export async function updateUsername(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const {username} = req.body;

    try {
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: 'User not found.'});
        }
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {username: username},
            select: {email: true, createdAt: true, username: true}
        });
        res.status(200).json({message: 'Username updated successfully.', user: updatedUser})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to update username.'});
    }
}

export async function updateEmail (req: AuthRequest, res: Response)  {
    try {
        const userId = req.userId!;

        const { email } = req.body;

        // Validate email
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Check if email is already taken
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({
                error: 'Email already in use'
            });
        }

        // Update user email
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email },
            select: {email: true, createdAt: true, username: true},
        });

        return res.status(200).json({
            message: 'Email updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating email:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'New password must be at least 8 characters long'
            });
        }

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, hashedPassword: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
            currentPassword,
            user.hashedPassword
        );

        if (!isValidPassword) {
            return res.status(400).json({
                error: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { hashedPassword },
        });

        return res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const isAuthenticated = (req: AuthRequest, res: Response) => {
    if (req.userId) {
        res.status(200).json({message: 'Authenticated!'});
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
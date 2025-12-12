import type {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {sendResetEmail} from "../index.ts";

import {prisma} from "../../prisma/prismaSingleton.ts";


export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                error: 'Valid email is required'
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true },
        });

        if (!user) {
            return res.status(200).json({
                message: 'A reset link has been sent'
            });
        }

        await prisma.passwordReset.deleteMany({
            where: { userId: user.id },
        });

        // Generate reset token
        const resetToken = crypto.randomBytes(8).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token: hashedToken,
                expiresAt: expires,
            },
        });

        await sendResetEmail(user.email, resetToken);

        return res.status(200).json({
            message: 'A reset link has been sent',
        });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const verifyResetToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({
                error: 'Reset token is required'
            });
        }

        const resetRecords = await prisma.passwordReset.findMany({
            where: {
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        let validToken = false;
        for (const record of resetRecords) {
            const isMatch = await bcrypt.compare(token, record.token);
            if (isMatch) {
                validToken = true;
                break;
            }
        }

        if (!validToken) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }

        return res.status(200).json({
            message: 'Token is valid',
            valid: true
        });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                error: 'Token and new password are required'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long'
            });
        }

        const resetRecords = await prisma.passwordReset.findMany({
            where: {
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        // Check if any token matches
        let matchedRecord = null;
        for (const record of resetRecords) {
            const isMatch = await bcrypt.compare(token, record.token);
            if (isMatch) {
                matchedRecord = record;
                break;
            }
        }

        if (!matchedRecord) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update user password
        await prisma.user.update({
            where: { id: matchedRecord.userId },
            data: { hashedPassword },
        });

        await prisma.passwordReset.deleteMany({
            where: { userId: matchedRecord.userId },
        });

        return res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


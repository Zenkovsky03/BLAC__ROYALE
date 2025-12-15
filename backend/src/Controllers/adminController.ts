import {  UserRole } from '@prisma/client';
import {prisma} from "../../prisma/prismaSingleton.ts";
import type {AuthRequest} from "../Middleware/authMiddleware.ts";

export const listUsers = async (req: AuthRequest, res: any) =>
{
    try {
        const { page, limit, search, role } = validateQuery(req.query);
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { surname: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: {
                            sapperMaps: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const userDetails = async (req: AuthRequest, res: any) =>
{
    try {
        const { id } = req.params;

        if (!id)
            return res.status(400).json({ error: 'User ID is required' });

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
                dateOfBirth: true,
                role: true,
                createdAt: true,
                wallet: {
                    select: {
                        id: true,
                        balance: true,
                    },
                },
                _count: {
                    select: {
                        sapperMaps: true,
                        PasswordReset: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ data: user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const patchUser = async (req: AuthRequest, res: any) =>
{
    try {
        const { id } = req.params;

        if (!id)
            return res.status(400).json({ error: 'User ID is required' });

        const validation = validateUpdateUser(req.body);
        if (!validation.valid) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: validation.errors
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true },
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent self-demotion from admin
        if (req.userId === id && validation.data.role === 'NORMAL') {
            return res.status(400).json({ error: 'Cannot demote yourself from admin' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: validation.data,
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                surname: true,
                role: true,
                createdAt: true,
            },
        });

        res.json({
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Validation helpers
const validateUpdateUser = (body: any) => {
    const errors: string[] = [];
    const data: any = {};

    if (body.role !== undefined) {
        if (!['NORMAL', 'ADMIN'].includes(body.role)) {
            errors.push('Role must be either NORMAL or ADMIN');
        } else {
            data.role = body.role as UserRole;
        }
    }

    if (body.name !== undefined) {
        if (typeof body.name !== 'string') {
            errors.push('Name must be a string');
        } else {
            data.name = body.name;
        }
    }

    if (body.surname !== undefined) {
        if (typeof body.surname !== 'string') {
            errors.push('Surname must be a string');
        } else {
            data.surname = body.surname;
        }
    }

    return { valid: errors.length === 0, errors, data };
};

const validateQuery = (query: any) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || undefined;
    const role = query.role && ['NORMAL', 'ADMIN'].includes(query.role)
        ? query.role as UserRole
        : undefined;

    return { page, limit, search, role };
};
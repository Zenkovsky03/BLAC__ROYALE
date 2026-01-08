// prisma/seed.ts
import { PrismaClient, UserRole, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Admin user credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log(`Admin user already exists: ${adminEmail}`);

        // Update to ensure they have admin role
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: UserRole.ADMIN },
        });
        console.log('✅ Ensured admin role is set.');
    } else {
        // Create admin user with wallet
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                username: adminUsername,
                name: 'Admin',
                surname: 'User',
                dateOfBirth: new Date('1990-01-01'),
                hashedPassword,
                role: UserRole.ADMIN,
                banned: false,
                wallet: {
                    create: {
                        balance: 10000.00, // Give admin some starting balance
                    },
                },
            },
        });

        console.log(`✅ Admin user created successfully!`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${adminPassword}`);
        console.log(`   Username: ${admin.username}`);
    }

    // Optional: Create a few test normal users
    const testUsers = [
        {
            email: 'user1@example.com',
            username: 'testuser1',
            name: 'John',
            surname: 'Doe',
            balance: 100.00,
        },
        {
            email: 'user2@example.com',
            username: 'testuser2',
            name: 'Jane',
            surname: 'Smith',
            balance: 250.00,
        },
        {
            email: 'user3@example.com',
            username: 'testuser3',
            name: 'Bob',
            surname: 'Johnson',
            balance: 500.00,
        },
    ];

    for (const userData of testUsers) {
        const exists = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (!exists) {
            await prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    name: userData.name,
                    surname: userData.surname,
                    dateOfBirth: new Date('1995-05-15'),
                    hashedPassword: await bcrypt.hash('Password123!', 10),
                    role: UserRole.NORMAL,
                    banned: false,
                    wallet: {
                        create: {
                            balance: userData.balance,
                            transactions: {
                                create: [
                                    {
                                        amount: userData.balance,
                                        type: TransactionType.DEPOSIT,
                                        timestamp: new Date(),
                                    },
                                ],
                            },
                        },
                    },
                },
            });
            console.log(`✅ Test user created: ${userData.email}`);
        }
    }

    console.log('✅ Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
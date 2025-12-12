// prisma/seed.ts
import { PrismaClient, UserRole, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

const prisma = new PrismaClient();

dotenv.config();

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
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: UserRole.ADMIN },
        });
        console.log('✅ Ensured admin role is set.');
    } else {
        // Create admin user with wallet
        await prisma.user.create({
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
                        balance: 10000.00,
                        transactions: {
                            create: [
                                {
                                    amount: 10000.00,
                                    type: TransactionType.DEPOSIT,
                                    timestamp: new Date(),
                                },
                            ],
                        },
                    },
                },
            },
        });

        console.log(`✅ Admin user created successfully!`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log(`   Username: ${adminUsername}`);
    }

    // Create Games
    const games = [
        {
            name: 'Sapper',
            description: 'Classic minesweeper game with betting mechanics',
            isActive: true,
        },
        {
            name: 'Dice Roll',
            description: 'Roll the dice and win based on your prediction',
            isActive: true,
        },
        {
            name: 'Blackjack',
            description: 'Classic card game - get as close to 21 as possible',
            isActive: true,
        },
        {
            name: 'Roulette',
            description: 'Spin the wheel and bet on your lucky number',
            isActive: false, // Coming soon
        },
    ];

    for (const gameData of games) {
        const exists = await prisma.game.findUnique({
            where: { name: gameData.name },
        });

        if (!exists) {
            await prisma.game.create({ data: gameData });
            console.log(`✅ Game created: ${gameData.name}`);
        }
    }

    // Create test users with diverse transaction histories
    const testUsers = [
        {
            email: 'user1@example.com',
            username: 'lucky_john',
            name: 'John',
            surname: 'Doe',
            dateOfBirth: new Date('1995-03-15'),
            balance: 1250.00,
            transactions: [
                { amount: 500.00, type: TransactionType.DEPOSIT, daysAgo: 30 },
                { amount: 100.00, type: TransactionType.BET, daysAgo: 25 },
                { amount: 200.00, type: TransactionType.WIN, daysAgo: 25 },
                { amount: 50.00, type: TransactionType.BET, daysAgo: 20 },
                { amount: 50.00, type: TransactionType.LOST, daysAgo: 20 },
                { amount: 500.00, type: TransactionType.DEPOSIT, daysAgo: 15 },
                { amount: 200.00, type: TransactionType.BET, daysAgo: 10 },
                { amount: 400.00, type: TransactionType.WIN, daysAgo: 10 },
            ],
        },
        {
            email: 'user2@example.com',
            username: 'jane_winner',
            name: 'Jane',
            surname: 'Smith',
            dateOfBirth: new Date('1992-07-22'),
            balance: 2750.00,
            transactions: [
                { amount: 1000.00, type: TransactionType.DEPOSIT, daysAgo: 60 },
                { amount: 250.00, type: TransactionType.BET, daysAgo: 55 },
                { amount: 500.00, type: TransactionType.WIN, daysAgo: 55 },
                { amount: 100.00, type: TransactionType.BET, daysAgo: 50 },
                { amount: 100.00, type: TransactionType.LOST, daysAgo: 50 },
                { amount: 1000.00, type: TransactionType.DEPOSIT, daysAgo: 40 },
                { amount: 300.00, type: TransactionType.BET, daysAgo: 35 },
                { amount: 750.00, type: TransactionType.WIN, daysAgo: 35 },
                { amount: 150.00, type: TransactionType.BET, daysAgo: 30 },
                { amount: 450.00, type: TransactionType.WIN, daysAgo: 30 },
                { amount: 500.00, type: TransactionType.WITHDRAWAL, daysAgo: 25 },
            ],
        },
        {
            email: 'user3@example.com',
            username: 'bob_gambler',
            name: 'Bob',
            surname: 'Johnson',
            dateOfBirth: new Date('1988-11-30'),
            balance: 75.00,
            transactions: [
                { amount: 1000.00, type: TransactionType.DEPOSIT, daysAgo: 45 },
                { amount: 200.00, type: TransactionType.BET, daysAgo: 44 },
                { amount: 200.00, type: TransactionType.LOST, daysAgo: 44 },
                { amount: 300.00, type: TransactionType.BET, daysAgo: 43 },
                { amount: 300.00, type: TransactionType.LOST, daysAgo: 43 },
                { amount: 500.00, type: TransactionType.DEPOSIT, daysAgo: 40 },
                { amount: 150.00, type: TransactionType.BET, daysAgo: 38 },
                { amount: 225.00, type: TransactionType.WIN, daysAgo: 38 },
                { amount: 400.00, type: TransactionType.BET, daysAgo: 35 },
                { amount: 400.00, type: TransactionType.LOST, daysAgo: 35 },
                { amount: 250.00, type: TransactionType.BET, daysAgo: 30 },
                { amount: 250.00, type: TransactionType.LOST, daysAgo: 30 },
            ],
        },
        {
            email: 'user4@example.com',
            username: 'sarah_pro',
            name: 'Sarah',
            surname: 'Williams',
            dateOfBirth: new Date('1990-05-18'),
            balance: 5420.00,
            transactions: [
                { amount: 2000.00, type: TransactionType.DEPOSIT, daysAgo: 90 },
                { amount: 500.00, type: TransactionType.BET, daysAgo: 85 },
                { amount: 1000.00, type: TransactionType.WIN, daysAgo: 85 },
                { amount: 300.00, type: TransactionType.BET, daysAgo: 80 },
                { amount: 600.00, type: TransactionType.WIN, daysAgo: 80 },
                { amount: 1000.00, type: TransactionType.DEPOSIT, daysAgo: 70 },
                { amount: 400.00, type: TransactionType.BET, daysAgo: 65 },
                { amount: 800.00, type: TransactionType.WIN, daysAgo: 65 },
                { amount: 1000.00, type: TransactionType.WITHDRAWAL, daysAgo: 60 },
                { amount: 1500.00, type: TransactionType.DEPOSIT, daysAgo: 50 },
                { amount: 600.00, type: TransactionType.BET, daysAgo: 45 },
                { amount: 1200.00, type: TransactionType.WIN, daysAgo: 45 },
                { amount: 800.00, type: TransactionType.BET, daysAgo: 40 },
                { amount: 1600.00, type: TransactionType.WIN, daysAgo: 40 },
            ],
        },
        {
            email: 'user5@example.com',
            username: 'mike_casual',
            name: 'Michael',
            surname: 'Brown',
            dateOfBirth: new Date('1993-09-12'),
            balance: 380.00,
            transactions: [
                { amount: 200.00, type: TransactionType.DEPOSIT, daysAgo: 20 },
                { amount: 50.00, type: TransactionType.BET, daysAgo: 18 },
                { amount: 50.00, type: TransactionType.LOST, daysAgo: 18 },
                { amount: 100.00, type: TransactionType.DEPOSIT, daysAgo: 15 },
                { amount: 30.00, type: TransactionType.BET, daysAgo: 14 },
                { amount: 60.00, type: TransactionType.WIN, daysAgo: 14 },
                { amount: 200.00, type: TransactionType.DEPOSIT, daysAgo: 10 },
            ],
        },
        {
            email: 'user6@example.com',
            username: 'emily_strategic',
            name: 'Emily',
            surname: 'Davis',
            dateOfBirth: new Date('1991-02-28'),
            balance: 1890.00,
            transactions: [
                { amount: 1000.00, type: TransactionType.DEPOSIT, daysAgo: 50 },
                { amount: 200.00, type: TransactionType.BET, daysAgo: 48 },
                { amount: 300.00, type: TransactionType.WIN, daysAgo: 48 },
                { amount: 150.00, type: TransactionType.BET, daysAgo: 45 },
                { amount: 225.00, type: TransactionType.WIN, daysAgo: 45 },
                { amount: 100.00, type: TransactionType.BET, daysAgo: 40 },
                { amount: 100.00, type: TransactionType.LOST, daysAgo: 40 },
                { amount: 500.00, type: TransactionType.DEPOSIT, daysAgo: 35 },
                { amount: 250.00, type: TransactionType.BET, daysAgo: 30 },
                { amount: 500.00, type: TransactionType.WIN, daysAgo: 30 },
                { amount: 180.00, type: TransactionType.BET, daysAgo: 25 },
                { amount: 360.00, type: TransactionType.WIN, daysAgo: 25 },
            ],
        },
        {
            email: 'user7@example.com',
            username: 'alex_risky',
            name: 'Alex',
            surname: 'Martinez',
            dateOfBirth: new Date('1994-12-05'),
            balance: 125.00,
            transactions: [
                { amount: 500.00, type: TransactionType.DEPOSIT, daysAgo: 30 },
                { amount: 100.00, type: TransactionType.BET, daysAgo: 29 },
                { amount: 100.00, type: TransactionType.LOST, daysAgo: 29 },
                { amount: 150.00, type: TransactionType.BET, daysAgo: 28 },
                { amount: 150.00, type: TransactionType.LOST, daysAgo: 28 },
                { amount: 200.00, type: TransactionType.DEPOSIT, daysAgo: 25 },
                { amount: 100.00, type: TransactionType.BET, daysAgo: 23 },
                { amount: 150.00, type: TransactionType.WIN, daysAgo: 23 },
                { amount: 75.00, type: TransactionType.BET, daysAgo: 20 },
                { amount: 75.00, type: TransactionType.LOST, daysAgo: 20 },
                { amount: 200.00, type: TransactionType.BET, daysAgo: 18 },
                { amount: 200.00, type: TransactionType.LOST, daysAgo: 18 },
            ],
        },
        {
            email: 'user8@example.com',
            username: 'chris_newbie',
            name: 'Christopher',
            surname: 'Wilson',
            dateOfBirth: new Date('1996-04-20'),
            balance: 450.00,
            transactions: [
                { amount: 500.00, type: TransactionType.DEPOSIT, daysAgo: 5 },
                { amount: 50.00, type: TransactionType.BET, daysAgo: 4 },
                { amount: 75.00, type: TransactionType.WIN, daysAgo: 4 },
                { amount: 25.00, type: TransactionType.BET, daysAgo: 3 },
                { amount: 25.00, type: TransactionType.LOST, daysAgo: 3 },
            ],
        },
    ];

    for (const userData of testUsers) {
        const exists = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (!exists) {
            // Calculate timestamps for transactions
            const transactionsData = userData.transactions.map((tx) => {
                const date = new Date();
                date.setDate(date.getDate() - tx.daysAgo);
                return {
                    amount: tx.amount,
                    type: tx.type,
                    timestamp: date,
                };
            });

            await prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    name: userData.name,
                    surname: userData.surname,
                    dateOfBirth: userData.dateOfBirth,
                    hashedPassword: await bcrypt.hash('Password123!', 10),
                    role: UserRole.NORMAL,
                    banned: false,
                    wallet: {
                        create: {
                            balance: userData.balance,
                            transactions: {
                                create: transactionsData,
                            },
                        },
                    },
                },
            });
            console.log(`✅ Test user created: ${userData.email} (${userData.username})`);
        }
    }

    // Create one banned user for testing admin functionality
    const bannedUserEmail = 'banned@example.com';
    const bannedExists = await prisma.user.findUnique({
        where: { email: bannedUserEmail },
    });

    if (!bannedExists) {
        await prisma.user.create({
            data: {
                email: bannedUserEmail,
                username: 'banned_user',
                name: 'Banned',
                surname: 'User',
                dateOfBirth: new Date('1989-08-15'),
                hashedPassword: await bcrypt.hash('Password123!', 10),
                role: UserRole.NORMAL,
                banned: true,
                wallet: {
                    create: {
                        balance: 0.00,
                        transactions: {
                            create: [
                                {
                                    amount: 100.00,
                                    type: TransactionType.DEPOSIT,
                                    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                                },
                            ],
                        },
                    },
                },
            },
        });
        console.log(`✅ Banned test user created: ${bannedUserEmail}`);
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin users: 1`);
    console.log(`   - Regular users: ${testUsers.length}`);
    console.log(`   - Banned users: 1`);
    console.log(`   - Games: ${games.length}`);
    console.log('\n🔑 Login credentials for testing:');
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`   Users: user1@example.com - user8@example.com / Password123!`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
// prisma/seed.ts
import { PrismaClient, UserRole, TransactionType, GameType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config({ path: './.env'});

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate random integer
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random decimal
function randomDecimal(min: number, max: number, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
}

// Helper function to get random game type
function randomGameType(): GameType {
    const games = [GameType.COINFLIP, GameType.SAPPER, GameType.ROULETTE, GameType.SLIDER, GameType.SLOTS];
    return games[randomInt(0, games.length - 1)]!;
}

async function main() {
    console.log('🎰 Starting comprehensive casino database seeding...\n');

    // ============================================
    // 1. CREATE ADMIN USER
    // ============================================
    console.log('👑 Creating admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@casino.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    let admin;
    if (existingAdmin) {
        console.log(`   ℹ️  Admin already exists: ${adminEmail}`);
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: UserRole.ADMIN },
        });
        console.log('   ✅ Ensured admin role is set.\n');
    } else {
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                username: adminUsername,
                name: 'Casino',
                surname: 'Administrator',
                dateOfBirth: new Date('1985-01-01'),
                hashedPassword: hashedAdminPassword,
                role: UserRole.ADMIN,
                wallet: {
                    create: {
                        balance: 50000.00,
                        transactions: {
                            create: {
                                amount: 50000.00,
                                type: TransactionType.DEPOSIT,
                                timestamp: new Date(),
                            },
                        },
                    },
                },
            },
        });

        console.log('   ✅ Admin user created successfully!');
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   🔑 Password: ${adminPassword}`);
        console.log(`   👤 Username: ${admin.username}\n`);
    }

    // ============================================
    // 2. CREATE REALISTIC TEST USERS
    // ============================================
    console.log('👥 Creating test users...');

    const testUsers = [
        {
            email: 'john.winner@example.com',
            username: 'lucky_john',
            name: 'John',
            surname: 'Winner',
            dateOfBirth: new Date('1990-03-15'),
            balance: 2500.00,
            password: 'User123!',
        },
        {
            email: 'sarah.player@example.com',
            username: 'sarah_plays',
            name: 'Sarah',
            surname: 'Player',
            dateOfBirth: new Date('1988-07-22'),
            balance: 1800.00,
            password: 'User123!',
        },
        {
            email: 'mike.gambler@example.com',
            username: 'mike_g',
            name: 'Mike',
            surname: 'Gambler',
            dateOfBirth: new Date('1992-11-30'),
            balance: 5000.00,
            password: 'User123!',
        },
        {
            email: 'emma.lucky@example.com',
            username: 'lucky_emma',
            name: 'Emma',
            surname: 'Lucky',
            dateOfBirth: new Date('1995-05-18'),
            balance: 3200.00,
            password: 'User123!',
        },
        {
            email: 'david.smith@example.com',
            username: 'dave_smith',
            name: 'David',
            surname: 'Smith',
            dateOfBirth: new Date('1987-09-10'),
            balance: 750.00,
            password: 'User123!',
        },
        {
            email: 'lisa.jones@example.com',
            username: 'lisa_j',
            name: 'Lisa',
            surname: 'Jones',
            dateOfBirth: new Date('1993-12-25'),
            balance: 4500.00,
            password: 'User123!',
        },
        {
            email: 'tom.brown@example.com',
            username: 'tom_b',
            name: 'Tom',
            surname: 'Brown',
            dateOfBirth: new Date('1991-04-07'),
            balance: 1200.00,
            password: 'User123!',
        },
        {
            email: 'anna.white@example.com',
            username: 'anna_w',
            name: 'Anna',
            surname: 'White',
            dateOfBirth: new Date('1989-08-14'),
            balance: 6000.00,
            password: 'User123!',
        },
        {
            email: 'chris.green@example.com',
            username: 'chris_green',
            name: 'Chris',
            surname: 'Green',
            dateOfBirth: new Date('1994-02-28'),
            balance: 950.00,
            password: 'User123!',
        },
        {
            email: 'rachel.black@example.com',
            username: 'rachel_b',
            name: 'Rachel',
            surname: 'Black',
            dateOfBirth: new Date('1990-06-19'),
            balance: 3800.00,
            password: 'User123!',
        },
        {
            email: 'kevin.gray@example.com',
            username: 'kevin_gray',
            name: 'Kevin',
            surname: 'Gray',
            dateOfBirth: new Date('1986-10-05'),
            balance: 2100.00,
            password: 'User123!',
        },
        {
            email: 'maria.lopez@example.com',
            username: 'maria_l',
            name: 'Maria',
            surname: 'Lopez',
            dateOfBirth: new Date('1992-01-12'),
            balance: 5500.00,
            password: 'User123!',
        },
        {
            email: 'james.wilson@example.com',
            username: 'james_w',
            name: 'James',
            surname: 'Wilson',
            dateOfBirth: new Date('1988-11-23'),
            balance: 1500.00,
            password: 'User123!',
        },
        {
            email: 'sophia.moore@example.com',
            username: 'sophia_m',
            name: 'Sophia',
            surname: 'Moore',
            dateOfBirth: new Date('1996-03-08'),
            balance: 4200.00,
            password: 'User123!',
        },
        {
            email: 'robert.taylor@example.com',
            username: 'rob_taylor',
            name: 'Robert',
            surname: 'Taylor',
            dateOfBirth: new Date('1985-07-16'),
            balance: 800.00,
            password: 'User123!',
        },
    ];

    const createdUsers = [];
    const hashedTestPassword = await bcrypt.hash('User123!', 12);

    for (const userData of testUsers) {
        const exists = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (!exists) {
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    name: userData.name,
                    surname: userData.surname,
                    dateOfBirth: userData.dateOfBirth,
                    hashedPassword: hashedTestPassword,
                    role: UserRole.NORMAL,
                    wallet: {
                        create: {
                            balance: userData.balance,
                        },
                    },
                },
            });
            createdUsers.push(user);
            console.log(`   ✅ Created user: ${userData.username} (${userData.email})`);
        } else {
            createdUsers.push(exists);
            console.log(`   ℹ️  User already exists: ${userData.email}`);
        }
    }

    console.log(`\n   📊 Total users in system: ${createdUsers.length + 1} (including admin)\n`);

    // ============================================
    // 3. CREATE REALISTIC TRANSACTION HISTORY
    // ============================================
    console.log('💰 Generating transaction history...');

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let totalTransactions = 0;

    for (const user of createdUsers) {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id },
        });

        if (!wallet) continue;

        // Initial deposit transaction (no game associated)
        await prisma.transaction.create({
            data: {
                walletId: wallet.id,
                amount: wallet.balance,
                type: TransactionType.DEPOSIT,
                timestamp: randomDate(oneMonthAgo, oneWeekAgo),
            },
        });
        totalTransactions++;

        // Generate random game transactions
        const numTransactions = randomInt(10, 30);

        for (let i = 0; i < numTransactions; i++) {
            const transactionDate = randomDate(oneWeekAgo, now);
            const game = randomGameType();

            // More losses than wins for realistic casino odds
            const weights = [0.35, 0.50, 0.15]; // 35% wins, 50% losses, 15% bets
            const random = Math.random();
            let type: TransactionType;
            if (random < weights[0]!) {
                type = TransactionType.WIN;
            } else if (random < weights[0]! + weights[1]!) {
                type = TransactionType.LOST;
            } else {
                type = TransactionType.BET;
            }

            let amount;
            if (type === TransactionType.WIN) {
                amount = randomDecimal(50, 1000);
            } else if (type === TransactionType.LOST) {
                amount = randomDecimal(10, 500);
            } else {
                amount = randomDecimal(10, 200);
            }

            await prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type,
                    game,
                    timestamp: transactionDate,
                },
            });
            totalTransactions++;
        }

        // Add some deposits and withdrawals (no game associated)
        if (Math.random() > 0.5) {
            await prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: randomDecimal(100, 1000),
                    type: TransactionType.DEPOSIT,
                    timestamp: randomDate(oneWeekAgo, now),
                },
            });
            totalTransactions++;
        }

        if (Math.random() > 0.7) {
            await prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: randomDecimal(50, 500),
                    type: TransactionType.WITHDRAWAL,
                    timestamp: randomDate(oneWeekAgo, now),
                },
            });
            totalTransactions++;
        }
    }

    console.log(`   ✅ Generated ${totalTransactions} transactions\n`);

    // ============================================
    // 4. CREATE ACTIVE SAPPER GAMES
    // ============================================
    console.log('💣 Creating active Sapper games...');

    const sapperUsers = createdUsers.slice(0, 5); // First 5 users have active games
    let sapperGames = 0;

    console.log(`\n   📊 Total active Sapper games: ${sapperGames}\n`);

    // ============================================
    // 5. CREATE PASSWORD RESET TOKENS (SOME EXPIRED)
    // ============================================
    console.log('🔑 Creating password reset tokens...');

    const resetUsers = createdUsers.slice(5, 8); // 3 users with reset tokens
    let resetTokens = 0;

    for (const user of resetUsers) {
        const isExpired = Math.random() > 0.5;
        const expiresAt = isExpired
            ? new Date(Date.now() - 3600000) // 1 hour ago (expired)
            : new Date(Date.now() + 3600000); // 1 hour from now (valid)

        const token = Math.random().toString(36).substring(2, 18);
        const hashedToken = await bcrypt.hash(token, 10);

        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token: hashedToken,
                expiresAt,
            },
        });

        resetTokens++;
        console.log(`   ✅ Created ${isExpired ? 'expired' : 'valid'} reset token for ${user.username}`);
    }

    console.log(`\n   📊 Total reset tokens: ${resetTokens}\n`);

    // ============================================
    // FINAL SUMMARY
    // ============================================
    console.log('════════════════════════════════════════════════════════');
    console.log('                    SEEDING COMPLETE                     ');
    console.log('════════════════════════════════════════════════════════');
    console.log(`👑 Admin Users:              1`);
    console.log(`👥 Normal Users:             ${createdUsers.length}`);
    console.log(`💰 Total Transactions:       ${totalTransactions}`);
    console.log(`💣 Active Sapper Games:      ${sapperGames}`);
    console.log(`🔑 Password Reset Tokens:    ${resetTokens}`);
    console.log('════════════════════════════════════════════════════════');
    console.log('\n📝 Test Credentials:');
    console.log(`   Admin:  ${adminEmail} / ${adminPassword}`);
    console.log(`   Users:  any user email / User123!`);
    console.log('════════════════════════════════════════════════════════\n');
}

// ============================================
// HELPER FUNCTIONS (from sapperController)
// ============================================

function generateSapperMap(size: number, bombs: number): string {
    const totalCells = size * size;
    const initialMap = Array(totalCells).fill('0');

    let bombsPlaced = 0;
    while (bombsPlaced < bombs) {
        const randomIndex = getRandomIntInclusive(0, initialMap.length - 1);
        if (initialMap[randomIndex] !== '.') {
            initialMap[randomIndex] = '.';
            bombsPlaced++;
        }
    }

    const map2D: string[][] = [];
    for (let i = 0; i < size; i++) {
        map2D.push(initialMap.slice(i * size, (i + 1) * size));
    }

    for (let i = 0; i < map2D.length; i++) {
        const currentRow = map2D[i];
        if (!currentRow) continue;

        for (let j = 0; j < currentRow.length; j++) {
            if (currentRow[j] !== '.') {
                let count = 0;
                const maxRow = map2D.length - 1;
                const maxCol = currentRow.length - 1;

                const prevRow = map2D[i - 1];
                const nextRow = map2D[i + 1];

                if (i > 0 && j > 0 && prevRow && prevRow[j - 1] === '.') count++;
                if (i > 0 && prevRow && prevRow[j] === '.') count++;
                if (j > 0 && currentRow[j - 1] === '.') count++;
                if (i > 0 && j < maxCol && prevRow && prevRow[j + 1] === '.') count++;
                if (i < maxRow && j > 0 && nextRow && nextRow[j - 1] === '.') count++;
                if (i < maxRow && nextRow && nextRow[j] === '.') count++;
                if (j < maxCol && currentRow[j + 1] === '.') count++;
                if (i < maxRow && j < maxCol && nextRow && nextRow[j + 1] === '.') count++;
                currentRow[j] = count.toString();
            }
        }
    }
    return map2D.map(row => row.join('')).join('');
}

function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// RUN SEED
// ============================================

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('👋 Database connection closed.');
    });
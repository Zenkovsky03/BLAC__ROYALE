import express from 'express'
import path, { dirname } from 'node:path'
import { fileURLToPath} from "node:url";

import UserRouter from "./Routes/userRoutes.ts";
import WalletRouter from "./Routes/walletRoutes.ts";
import GamesRouter from "./Routes/gamesRoutes.ts";
import SapperRouter from "./Routes/sapperRoutes.ts";

import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import dotenv from 'dotenv';
import RankingRoutes from "./Routes/rankingRoutes.ts";
import cors from 'cors';
import nodemailer from "nodemailer";
import AdminRouter from "./Routes/adminRoutes.ts";
dotenv.config({ path: './.env'});

const app = express()

// --- NAPRAWA CORS (Dla portu 5173 ORAZ 5174) ---
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
// -----------------------------------------------

app.use(express.json())

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename)

const router = express.Router()

router.get('/', (_req, res) => res.send('Nie grasz nie wygrasz!'))

app.use('/', router)
app.use('/api/users', UserRouter)
app.use('/api/wallet' , WalletRouter)
app.use('/api/games', GamesRouter)
app.use('/api/sapper', SapperRouter)
app.use('/api/ranking', RankingRoutes)
app.use('/api/admin', AdminRouter)

// --- SWAGGER (ZABEZPIECZONY) ---
// Owijamy to w try-catch, żeby błąd dokumentacji nie wywalał całego serwera
try {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Blac Casino API',
                version: '1.0.0',
                description: 'API documentation for Blac Casino',
            },
            servers: [
                { url: 'http://localhost:8000', description: 'Development server' },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        },
        // Używamy prostszej ścieżki, która często lepiej działa z ts-node
        apis: ['./src/Routes/*.ts', './src/index.ts'],
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('API Documentation initialized at http://localhost:8000/docs');
} catch (error) {
    console.error("⚠️ Błąd generowania Swaggera (ale serwer działa dalej):", error);
}
// -------------------------------

app.listen(8000, () => {
    console.log('✅ Server running on http://localhost:8000');
})


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetEmail = async (email: string, resetToken: string) => {
    const mailOptions = {
        from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Use the following code to reset it:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px;">
          <code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${resetToken}</code>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.error("Błąd wysyłania maila:", e);
    }
};
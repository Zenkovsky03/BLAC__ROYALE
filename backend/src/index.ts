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
dotenv.config({ path: './.env'});

const app = express()
app.use(cors({ origin: 'http://localhost:5173' })); // lub origin: true na dev
app.use(express.json());
app.use(express.json()) // Adding middleware to parse JSON bodies

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blac Casino API',
            version: '1.0.0',
            description: 'API documentation for Blac Casino - Nie grasz nie wygrasz!',
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                },
            },
        },
    },
    // Path to the API routes where you have JSDoc comments

    apis: [path.join(__dirname, 'Routes', '*.ts' ), path.join(__dirname, 'index.ts')],
};
console.log(__dirname)

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Nie grasz nie wygrasz!
 *
 */
router.get('/', (_req, res) => res.send('Nie grasz nie wygrasz!'))

app.use('/', router)
app.use('/api/users', UserRouter)
app.use('/api/wallet' , WalletRouter)
app.use('/api/games', GamesRouter)
app.use('/api/sapper', SapperRouter)
app.use('/api/ranking', RankingRoutes)

// Serve Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
    console.log('API Documentation available at http://localhost:8000/docs');
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

    await transporter.sendMail(mailOptions);
};
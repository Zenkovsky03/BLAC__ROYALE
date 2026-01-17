import express from 'express'
import path, { dirname } from 'node:path'
import { fileURLToPath} from "node:url";

import UserRouter from "./Routes/user.Routes.ts";
import WalletRouter from "./Routes/wallet.Routes.ts";
import GamesRouter from "./Routes/games.Routes.ts";
import SapperRouter from "./Routes/sapper.Routes.ts";

import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import dotenv from 'dotenv';
import RankingRoutes from "./Routes/ranking.Routes.ts";
import cors from 'cors';
import nodemailer from "nodemailer";
import AdminRouter from "./Routes/admin.Routes.ts";
dotenv.config({ path: './.env'});

const app = express()
app.use(cors({ origin: 'http://localhost:5173' })); // lub origin: true na dev
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
app.use('/api/admin', AdminRouter)

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
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. You can click the button below to reset it directly:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>

            <p>Or use the following code on the <a href="http://localhost:5173/reset-password">reset page</a>:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px;">
              <code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${resetToken}</code>
            </div>
            
            <p style="color: #666; font-size: 14px;">This link and code will expire in 1 hour.</p>
            <p style="border-top: 1px solid #eee; padding-top: 20px; color: #999; font-size: 12px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              ${resetUrl}
            </p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};
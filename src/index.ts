import express from 'express'
// @ts-ignore
import UserRouter from "./Routes/userRoutes.ts";
import WalletRouter from "./Routes/walletRoutes.ts";
import GamesRouter from "./Routes/gamesRoutes.ts";
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"


const app = express()

app.use(express.json()) // Adding middleware to parse JSON bodies

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blackjack Royale API',
            version: '1.0.0',
            description: 'API documentation for Blackjack Royale game - Nie grasz nie wygrasz!',
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
    apis: ['./src/Routes/*.ts', './src/index.ts'],
};

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
 */
router.get('/', (req, res) => res.send('Nie grasz nie wygrasz!'))

app.use('/', router)
app.use('/api/users', UserRouter)
app.use('/api/wallet' , WalletRouter)
app.use('/api/games', GamesRouter)

// Serve Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
    console.log('API Documentation available at http://localhost:8000/docs');
})
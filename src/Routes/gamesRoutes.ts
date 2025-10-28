import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import { getGames} from "../Controllers/gamesController.ts";
import  { PlayRoulette } from '../Controllers/rouleteController.ts';
import {balanceCheck} from "../Middleware/balanceMiddleware.ts";
import {PlayCoinFlip} from "../Controllers/coinflipController.ts";

const GamesRouter = Router();

/**
 * @swagger
 * /api/games/getGames:
 *   get:
 *     summary: Get all available games
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 games:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Roulette
 *                       description:
 *                         type: string
 *                         example: Classic casino roulette game
 *                       winChancePrecentage:
 *                         type: number
 *                         example: 48.6
 *                       minWinChancePrecentage:
 *                         type: number
 *                         example: 2.7
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
GamesRouter.get("/getGames" , protect , getGames)
/**
 * @swagger
 * /api/games/PlayRoulette:
 *   post:
 *     summary: Play roulette game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - betAmount
 *               - color
 *               - number
 *             properties:
 *               betAmount:
 *                 type: number
 *                 example: 100
 *                 description: Amount to bet
 *               color:
 *                 type: number
 *                 example: 0
 *                 description: Color bet (0 for red, 1 for black)
 *               number:
 *                 type: number
 *                 example: 17
 *                 minimum: 0
 *                 maximum: 36
 *                 description: Number bet (0-36)
 *     responses:
 *       200:
 *         description: Game result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gain:
 *                   type: number
 *                   example: 500
 *                   description: Amount won
 *                 winMultiplayer:
 *                   type: number
 *                   example: 5
 *                   description: Win multiplier applied
 *                 WinScenario:
 *                   type: number
 *                   example: 1
 *                   description: Win scenario (0=No Win, 1=Number Win, 2=Color Win, 3=Both Win)
 *                 randomNumber:
 *                   type: number
 *                   example: 17
 *                   description: The number that came up
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to play the game
 */
GamesRouter.post("/PlayRoulette" , protect, balanceCheck , PlayRoulette)
/**
 * @swagger
 * /api/games/PlayCoinFlip:
 *   post:
 *     summary: Play coin flip game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - betAmount
 *               - bet
 *             properties:
 *               betAmount:
 *                 type: number
 *                 example: 100
 *                 description: Amount to bet
 *               bet:
 *                 type: number
 *                 example: 0
 *                 description: 0 for heads, 1 for tails
 *     responses:
 *       200:
 *         description: Game result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gain:
 *                   type: number
 *                   example: 200
 *                   description: Amount won (betAmount * 2 if won, 0 if lost)
 *                 result:
 *                   type: string
 *                   example: LOST
 *                   description: The coin flip result ("LOST or "WIN")"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to play the game
 */
GamesRouter.post("/PlayCoinFlip" , protect, balanceCheck , PlayCoinFlip)

export default GamesRouter;
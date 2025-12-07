import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import  { PlayRoulette } from '../Controllers/rouleteController.ts';
import {balanceCheck} from "../Middleware/balanceMiddleware.ts";
import {PlayCoinFlip} from "../Controllers/coinflipController.ts";
import {slotsSpin} from "../Controllers/slotsController.ts";

const GamesRouter = Router();


/**
 * @swagger
 * /api/games/play-roulette:
 *   post:
 *     summary: Play roulette game
 *     tags: [Roulette]
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
GamesRouter.post("/play-roulette" , protect, balanceCheck , PlayRoulette)
/**
 * @swagger
 * /api/games/play-coin-flip:
 *   post:
 *     summary: Play coin flip game
 *     tags: [Coin Flip]
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
GamesRouter.post("/play-coin-flip" , protect, balanceCheck , PlayCoinFlip)

/**
 * @swagger
 * /api/slots-spin:
 *   post:
 *     summary: Spin the slot machine
 *     description: Performs a slot machine spin with 9 possible symbols. Deducts bet from wallet balance and adds winnings if applicable.
 *     tags:
 *       - Slots
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bet
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user spinning
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               bet:
 *                 type: number
 *                 minimum: 0.01
 *                 description: The amount to bet on this spin
 *                 example: 10
 *     responses:
 *       200:
 *         description: Spin completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reels:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [CHERRY, LEMON, ORANGE, PLUM, GRAPE, WATERMELON, BELL, STAR, SEVEN]
 *                   description: Array of 3 symbol names that appeared
 *                   example: ["CHERRY", "CHERRY", "CHERRY"]
 *                 symbols:
 *                   type: array
 *                   items:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 9
 *                   description: Array of 3 symbol IDs (1-9)
 *                   example: [1, 1, 1]
 *                 bet:
 *                   type: number
 *                   description: The amount that was bet
 *                   example: 10
 *                 winAmount:
 *                   type: number
 *                   description: Total amount won (0 if no win)
 *                   example: 20
 *             examples:
 *               winning_spin:
 *                 summary: Winning spin example
 *                 value:
 *                   reels: ["SEVEN", "SEVEN", "SEVEN"]
 *                   symbols: [9, 9, 9]
 *                   bet: 10
 *                   winAmount: 500
 *               losing_spin:
 *                 summary: Losing spin example
 *                 value:
 *                   reels: ["CHERRY", "LEMON", "ORANGE"]
 *                   symbols: [1, 2, 3]
 *                   bet: 10
 *                   winAmount: 0
 *       400:
 *         description: Invalid request or insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Spin failed"
 */
GamesRouter.post("/play-slots", protect, balanceCheck , slotsSpin);
/**
 * @swagger
 * components:
 *   schemas:
 *     Symbol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Symbol ID (1-9)
 *         weight:
 *           type: integer
 *           description: Weight for random selection (higher = more common)
 *         payout:
 *           type: object
 *           description: Payout multipliers for matching symbols
 *           properties:
 *             3:
 *               type: number
 *               description: Multiplier when 3 symbols match
 *       example:
 *         id: 1
 *         weight: 100
 *         payout:
 *           3: 2
 *
 *     SlotSymbols:
 *       type: object
 *       description: All available slot symbols with their properties
 *       properties:
 *         CHERRY:
 *           $ref: '#/components/schemas/Symbol'
 *         LEMON:
 *           $ref: '#/components/schemas/Symbol'
 *         ORANGE:
 *           $ref: '#/components/schemas/Symbol'
 *         PLUM:
 *           $ref: '#/components/schemas/Symbol'
 *         GRAPE:
 *           $ref: '#/components/schemas/Symbol'
 *         WATERMELON:
 *           $ref: '#/components/schemas/Symbol'
 *         BELL:
 *           $ref: '#/components/schemas/Symbol'
 *         STAR:
 *           $ref: '#/components/schemas/Symbol'
 *         SEVEN:
 *           $ref: '#/components/schemas/Symbol'
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token obtained from login endpoint
 */

export default GamesRouter;
import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import  { PlayRoulette } from '../Controllers/rouleteController.ts';
import {balanceCheck} from "../Middleware/balanceMiddleware.ts";
import {PlayCoinFlip} from "../Controllers/coinflipController.ts";
import {slotsSpin} from "../Controllers/slotsController.ts";
import {sliderPlay} from "../Controllers/sliderController.ts";

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
GamesRouter.post("/play-roulette" , protect, balanceCheck , PlayRoulette);
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
GamesRouter.post("/play-coin-flip" , protect, balanceCheck , PlayCoinFlip);
/**
 * @swagger
 * /api/games/play-slots:
 *   post:
 *     summary: Spin the slot machine
 *     description: Play a slot machine game with three reels. Each spin deducts the bet amount and awards winnings based on symbol matches.
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bet
 *             properties:
 *               bet:
 *                 type: number
 *                 minimum: 1
 *                 description: Amount to wager on this spin
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
 *                   description: Symbol names for each of the three reels
 *                   example: ["CHERRY", "CHERRY", "CHERRY"]
 *                 symbols:
 *                   type: array
 *                   items:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 9
 *                   description: Numeric IDs corresponding to the reel symbols
 *                   example: [1, 1, 1]
 *                 bet:
 *                   type: number
 *                   description: Amount wagered on this spin
 *                   example: 10
 *                 winAmount:
 *                   type: number
 *                   description: Total amount won (0 if no winning combination)
 *                   example: 20
 *             examples:
 *               winning_spin:
 *                 summary: Winning spin with three cherries
 *                 value:
 *                   reels: ["CHERRY", "CHERRY", "CHERRY"]
 *                   symbols: [1, 1, 1]
 *                   bet: 10
 *                   winAmount: 20
 *               losing_spin:
 *                 summary: Losing spin with no matches
 *                 value:
 *                   reels: ["CHERRY", "LEMON", "ORANGE"]
 *                   symbols: [1, 2, 3]
 *                   bet: 10
 *                   winAmount: 0
 *       400:
 *         description: Insufficient balance or invalid bet amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Insufficient balance"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
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
 *         description: Server error during spin processing
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
 * /api/games/play-slider:
 *   post:
 *     summary: Play the slider game
 *     description: Place a bet on the slider game by selecting a range (min-max). Win if the random number falls within your range, with payouts based on range size.
 *     tags: [Slider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bet
 *               - min
 *               - max
 *             properties:
 *               bet:
 *                 type: number
 *                 description: The amount to bet (must be non-negative)
 *                 example: 100
 *               min:
 *                 type: integer
 *                 description: Minimum range value (0-100, must be less than max)
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 30
 *               max:
 *                 type: integer
 *                 description: Maximum range value (0-100, must be greater than min)
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 70
 *     responses:
 *       200:
 *         description: Game played successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 num:
 *                   type: integer
 *                   description: The randomly generated number (0-100)
 *                   example: 45
 *                 bet:
 *                   type: number
 *                   description: The bet amount
 *                   example: 100
 *                 winAmount:
 *                   type: number
 *                   description: The amount won (0 if lost, bet*(1+multiplier) if won normally, bet*(1+multiplier)*2 if hit exact boundary)
 *                   example: 160
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Spin failed
 */
GamesRouter.post('/play-slider' , protect , balanceCheck , sliderPlay);

/**
 * @swagger
 * components:
 *   schemas:
 *     SlotSymbol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the symbol
 *         weight:
 *           type: integer
 *           description: Probability weight for symbol appearance
 *         payout:
 *           type: object
 *           description: Payout multipliers based on number of matching symbols
 *       example:
 *         id: 1
 *         weight: 100
 *         payout:
 *           3: 2
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */



export default GamesRouter;
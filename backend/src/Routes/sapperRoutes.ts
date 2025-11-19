import {Router} from 'express';
import {protect} from '../Middleware/authMiddleware.ts';
import {startSapper, playSapper, resignSapper} from "../Controllers/sapperController.ts";
import {balanceCheck} from "../Middleware/balanceMiddleware.ts";

const SapperRouter = Router();

/**
 * @swagger
 * /api/Sapper/start-sapper:
 *   post:
 *     summary: Start a new Sapper game
 *     description: Initializes a new Sapper (Minesweeper) game with specified parameters. Deducts the bet amount from user's wallet and creates a new game map.
 *     tags: [Sapper Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bombsCount
 *               - betAmount
 *               - mapSize
 *             properties:
 *               bombsCount:
 *                 type: integer
 *                 description: Number of bombs to place on the map (must be less than mapSize * mapSize - 1)
 *                 example: 5
 *                 minimum: 1
 *               betAmount:
 *                 type: number
 *                 description: Amount to bet on this game (deducted from wallet)
 *                 example: 10.50
 *                 minimum: 0.01
 *               mapSize:
 *                 type: integer
 *                 description: Size of the square game map (n x n grid)
 *                 example: 5
 *                 minimum: 2
 *     responses:
 *       200:
 *         description: Game successfully started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 map:
 *                   type: string
 *                   description: Masked map showing only undiscovered cells as '?'
 *                   example: "?????????????????????"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insufficient balance
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed starting sapper game.
 */
SapperRouter.post("/start-sapper", protect, balanceCheck , startSapper);

/**
 * @swagger
 * /api/Sapper/play-sapper:
 *   post:
 *     summary: Make a move in the active Sapper game
 *     description: Reveals a cell at the specified coordinates. If it's a bomb, the game ends and bet is lost. If safe, the win multiplier increases based on the cell's value.
 *     tags: [Sapper Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - X
 *               - Y
 *             properties:
 *               X:
 *                 type: integer
 *                 description: Row coordinate (0-indexed)
 *                 example: 2
 *                 minimum: 0
 *               Y:
 *                 type: integer
 *                 description: Column coordinate (0-indexed)
 *                 example: 3
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Move processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: [Game lost., Game continues...]
 *                   description: Game status after the move
 *                 map:
 *                   type: string
 *                   description: Updated map state (masked if game continues, full map if lost)
 *                   example: "??3?2???1??????????"
 *       400:
 *         description: Invalid coordinates or out of bounds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Coordinates are out of map bounds.
 *       404:
 *         description: No active game found for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sapper map not found for user.
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed playing sapper game due to a server error.
 */
SapperRouter.post("/play-sapper", protect, balanceCheck , playSapper);

/**
 * @swagger
 * /api/Sapper/resign-sapper:
 *   post:
 *     summary: Cash out and end the current Sapper game
 *     description: Ends the active game and credits the winnings to the user's wallet. Winnings are calculated as bet * winMultiplier based on safe cells revealed.
 *     tags: [Sapper Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game successfully ended and winnings credited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game ended.
 *                 map:
 *                   type: object
 *                   description: Final game map data
 *                   properties:
 *                     id:
 *                       type: string
 *                     n:
 *                       type: integer
 *                       description: Map size
 *                     map:
 *                       type: string
 *                       description: Full game map
 *                     mask:
 *                       type: string
 *                       description: Revealed cells mask
 *                     bet:
 *                       type: number
 *                       description: Original bet amount
 *                     winMultiplayer:
 *                       type: number
 *                       description: Final win multiplier
 *                     userId:
 *                       type: string
 *                 wallet:
 *                   type: object
 *                   description: Updated wallet information
 *       404:
 *         description: No active game found for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No map found for user.
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to resign. KEEP PLAYING!!!
 */
SapperRouter.post("/resign-sapper", protect, balanceCheck , resignSapper);

export default SapperRouter;

/*



 */
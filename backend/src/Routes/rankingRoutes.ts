import {Router} from 'express';
import {getRankings} from "../Controllers/rankingController.ts";

const RankingRoutes = Router();

/**
 * @swagger
 * /api/ranking/{period}:
 *   get:
 *     summary: Get player rankings based on WIN transactions
 *     description: Returns a ranked list of players by total winnings for specified time period
 *     tags:
 *       - Rankings
 *     parameters:
 *       - in: path
 *         name: period
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, monthly, weekly]
 *         description: Time period for rankings (all - all-time, monthly - last 30 days, weekly - last 7 days)
 *     responses:
 *       200:
 *         description: Successfully retrieved rankings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: "weekly"
 *                 rankings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                         example: 1
 *                       userId:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       username:
 *                         type: string
 *                         example: "player1"
 *                       email:
 *                         type: string
 *                         example: "player1@example.com"
 *                       totalWinnings:
 *                         type: string
 *                         example: "1250.50"
 *                       winCount:
 *                         type: integer
 *                         example: 15
 *                 totalPlayers:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Invalid period parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid period. Must be one of: all, monthly, weekly"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve rankings due to a server error."
 */
RankingRoutes.get('/:period' , getRankings );

export default RankingRoutes;
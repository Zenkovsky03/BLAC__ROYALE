import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import {deposit, getWallet, withdraw} from '../Controllers/walletController.ts'
import {balanceCheck} from "../Middleware/balanceMiddleware.ts";
import {ranking} from "../Controllers/rankingController.ts";

const WalletRouter = Router();

/**
 * @swagger
 * /api/wallet/get-wallet:
 *   get:
 *     summary: Get wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       type:
 *                         type: string
 *                         enum: [WIN, LOSS, DEPOSIT]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
WalletRouter.get('/getwallet', protect, getWallet)
/**
 * @swagger
 * /api/wallet/deposit:
 *   post:
 *     summary: Add funds to wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *                 minimum: 0.01
 *                 description: Amount to add to wallet
 *     responses:
 *       200:
 *         description: Funds added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Funds added successfully
 *                 newBalance:
 *                   type: number
 *                   example: 1500
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
WalletRouter.post('/deposit', protect, deposit)
/**
 * @swagger
 * /api/wallet/withdraw:
 *   post:
 *     summary: Take funds from wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *                 minimum: 0.01
 *                 description: Amount to add to wallet
 *     responses:
 *       200:
 *         description: Funds withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Funds added successfully
 *                 newBalance:
 *                   type: number
 *                   example: 1500
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
WalletRouter.post('/withdraw', protect , balanceCheck , withdraw)


WalletRouter.get('/ranking', protect, ranking)

export default WalletRouter;
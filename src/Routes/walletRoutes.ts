import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import {deposit, getWallet, withdraw} from '../Controllers/walletController.ts'

const WalletRouter = Router();

WalletRouter.post('/deposit', protect, deposit)
WalletRouter.post('/withdraw', protect, withdraw)
WalletRouter.post('/getWallet', protect, getWallet)

export default WalletRouter;
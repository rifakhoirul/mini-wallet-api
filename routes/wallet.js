import express from 'express';
import { depositMoney, disableWallet, enableWallet, initializeWallet, viewBalance, withdrawalMoney } from '../controllers/wallet.js';
import { Login } from '../utils/Login.js';

const router = express.Router();

router.post('/init', initializeWallet);
router.post('/wallet', Login, enableWallet);
router.get('/wallet', Login, viewBalance);
router.post('/wallet/deposits', Login, depositMoney);
router.post('/wallet/withdrawals', Login, withdrawalMoney);
router.patch('/wallet', Login, disableWallet);

export default router;

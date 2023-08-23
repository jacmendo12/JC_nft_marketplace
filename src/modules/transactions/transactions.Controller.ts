import express from 'express';
import { buyToken, aproveTransaction, auctions } from './transactions.Service';
const router = express.Router();

router.post('/buy_token', buyToken);
router.post('/aprove_transaction', aproveTransaction);
router.post('/auctions', auctions);

export default router;

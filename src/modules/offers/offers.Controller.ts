import express from 'express';
import { createOffer, list_offers } from './offers.Service';
const router = express.Router();

router.post('/create_offer', createOffer);
router.get('/list_offers', list_offers);

export default router;

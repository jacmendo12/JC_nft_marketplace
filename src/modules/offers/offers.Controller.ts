import express from 'express';
import { createOffer } from './offers.Service';
const router = express.Router();

router.post('/create_offer', createOffer);

export default router;

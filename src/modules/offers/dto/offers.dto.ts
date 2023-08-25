import Joi from 'joi';
import { offersTypes } from '../../../shared/persistence/offer.persistence';

export const buyOfferSchema = Joi.object({
    sellerAddress: Joi.string().required(),
    tokenID: Joi.number().integer().required(),
    value: Joi.number().positive().required(),
    offerType: Joi.string().valid(...Object.values(offersTypes)).required()
});
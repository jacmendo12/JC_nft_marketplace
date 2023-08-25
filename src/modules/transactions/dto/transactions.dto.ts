import Joi from 'joi';

export const auctionsTypeValues = [1, 2, 3];

export const buyTokenSchema = Joi.object({
    tokenID: Joi.number().integer().required(),
    buyerAddress: Joi.string().required()
  });

export const auctionsSchema = Joi.object({
  tokenID: Joi.number().integer().required(),
  buyerAddress: Joi.string().required(),
  auctionsType: Joi.number().valid(...auctionsTypeValues).required(),
  auctionsValue: Joi.number().when('auctionsType', {
    is: 2, // Apply validation when auctionsType is 2 (decreaseAllowance)
    then: Joi.number().positive().required(),
    otherwise: Joi.optional()
  })
});
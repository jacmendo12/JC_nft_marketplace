import { Request, Response } from 'express';
import { OfferStatus, Toffer, offersTypes } from '../../shared/persistence/offer.persistence';
import * as blockchain from '../../shared/utils/blockchain';

export async function buyToken(req: Request, res: Response): Promise<void> {
    try {
        const { tokenID, buyerAddress } = req.body
        const token: Toffer = req.offersList.find((data) => data.tokenID == tokenID) as Toffer

        if (!token || token.status !== OfferStatus.Pending)
            throw new Error('token is not available');

        if (token.offerType !== offersTypes.Buy)
            throw new Error('This token is for Auctions');

        // validate if the user have founds 
        const balance = await blockchain.getBalanceERC20(buyerAddress)
        await blockchain.validateFound(balance, token?.value)

        const hash = await blockchain.buyToken(token,buyerAddress)

        // PRIVAVE_KEYS

        res.status(200).json({ message:"successful", data: hash });
    } catch (err: any) {
        console.log(err)
        res.status(400).json({ error: err.message || 'system error' });
    }
}

export async function auctions(req: Request, res: Response): Promise<void> {
    try {
        const { tokenID, buyerAddress } = req.body
        const token: Toffer = req.offersList.find((data) => data.tokenID == tokenID) as Toffer

        if (!token || token.status !== OfferStatus.Pending)
            throw new Error('token is not available');

        if (token.offerType !== offersTypes.Auctions)
            throw new Error('This token is for Auctions');

        // validate if the user have founds 
        const balance = await blockchain.getBalanceERC20(buyerAddress)
        blockchain.validateFound(balance, token?.value)


        res.status(200).json({ message:"successful", data: req.offersList });
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}

export async function aproveTransaction(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({ message:"successful", data: req.offersList });
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}
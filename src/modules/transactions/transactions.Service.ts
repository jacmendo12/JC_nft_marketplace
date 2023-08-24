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
        const index = req.offersList.findIndex((data) => data.tokenID == tokenID)
        req.offersList[index].buyerData.push({
            "buyHash": hash,
            "price": token?.value,
            "buyerAddress":buyerAddress
        })
        req.offersList[index].status=OfferStatus.Accepted;
        // PRIVAVE_KEYS

        res.status(200).json({ message:"successful", data: hash });
    } catch (err: any) {
        console.log(err)
        res.status(400).json({ error: err.message || 'system error' });
    }
}

export async function auctions(req: Request, res: Response): Promise<void> {
    try {
        const { tokenID, buyerAddress,auctionsValue,auctionsType } = req.body
        const token: Toffer = req.offersList.find((data) => data.tokenID == tokenID) as Toffer

        if (!token || token.status !== OfferStatus.Pending)
            throw new Error('token is not available');

        if (token.offerType !== offersTypes.Auctions)
            throw new Error('This token is for Buy');

        const balance = await blockchain.getBalanceERC20(buyerAddress)
        await blockchain.validateFound(balance, auctionsValue)
        const hash = await blockchain.auctions(token,buyerAddress,auctionsValue,auctionsType)
        const newAuctionsValue = await blockchain.newAuctionsValue(buyerAddress)
        console.log(newAuctionsValue);

        const index = req.offersList.findIndex((data) => data.tokenID == tokenID)
        req.offersList[index].buyerData.push({
            "auctionsHash": hash,
            "auctionsValue": auctionsValue,
            "newAuctionsValue":newAuctionsValue.toString(),
            "buyerAddress":buyerAddress
        })
        

        res.status(200).json({ message:"successful", data: {
            "auctionsValue": auctionsValue,
            "auctionsHash": hash,
            "newAuctionsValue":newAuctionsValue.toString()
        } });
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
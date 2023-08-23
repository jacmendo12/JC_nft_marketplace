import { Request, Response } from 'express';
import { OfferStatus, Toffer } from '../../shared/persistence/offer.persistence';
import { uuidV4 } from 'web3-utils';
import { log } from 'console';
const axios = require('axios');

// import ERC20 from '../../shared/contracts/mockERC721ABI';
// import Web3 from 'web3';

export async function createOffer(req: Request, res: Response): Promise<void> {
    try {
        const { tokenID, sellerAddress } = req.body
    
        /* validate if the user have this token */
        const apiUrl = process.env.SEPOLIA_ETHERSCAN_URL;
        const contractAddress = process.env.ERC721_CONTRACT_ADDRESS;
        const walletAddress = sellerAddress;
        const apiKey = process.env.ETHERSCAN_API;

        const response = await axios.get(apiUrl, {
            params: {
                module: 'account',
                action: 'tokennfttx',
                contractaddress: contractAddress,
                address: walletAddress,
                page: 1,
                offset: 100,
                startblock: 0,
                endblock: 99999999,
                sort: 'asc',
                apikey: apiKey,
            },
        });

        const { data: { result } } = response;

        const nffAvaible = result.find((data: any) => data.tokenID == tokenID)
        if (!nffAvaible)
            throw new Error('You not have this token');

         /* validate if the offer are in the list */
        const nftList = req.offersList.find((data) => data.tokenID == tokenID)
        if (nftList)
            throw new Error('Nft is offered now');


        const newOffer: Toffer = {
            id: uuidV4(),
            status: OfferStatus.Pending,
            buyerAddress: [],
            ...req.body
        }
        req.offersList.push(newOffer)

        res.status(200).json({ message: newOffer });
    } catch (err: any) {
        console.log(err);

        res.status(400).json({ error: err.message || 'system error' });
    }
}


export async function list_offers(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({ message: req.offersList });
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}


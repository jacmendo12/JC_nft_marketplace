import { Request, Response, NextFunction } from 'express';
import { OfferStatus, Toffer, offersTypes } from '../shared/persistence/offer.persistence';

declare global {
  namespace Express {
    interface Request {
      offersList: Toffer[];
    }
  }
}

const sharedList: Toffer[] = [
  {
    "id": "ad59246f-5213-4303-8f29-e1cfe3a582ef",
    "status": OfferStatus.Pending,
    "buyerData": [
      //   {
      //     "uuid": "c0a638aa-4b45-4c35-97f7-cf666d6f890f",
      //     "auctionsHash": "0x62b03ed6a610eb40e7b26a191e74a03dc34f02f91ad738eb6f26975bba834a99",
      //     "auctionsValue": 1101,
      //     "newAuctionsValue": "1101",
      //     "buyerAddress": "0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9",
      //     "status": "Pending"
      // }

      {
        "uuid": "814bc089-d0cf-4e57-ba47-386ad49d698f",
        "auctionsHash": "0x775910c76371e770ea1f0c5e0d1d99548dec8c47f8c060edf36a9fb1d84f8a12",
        "auctionsValue": 2000,
        "newAuctionsValue": "3101",
        "buyerAddress": "0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9",
        "status": "Pending",
        "AproveTransactionHash": "0x7258011242447d452000e9780713912f28468b20507813ba3bf05b0d2fe7e746"

      }
    ],
    "sellerAddress": "0xe7D4Adf8ef90D2A2B5A325d02d4877533A297741",
    "tokenID": 172,
    "value": 1000, //1000000000000000000
    "offerType": offersTypes.Auctions
  }
];
/* middleware is used for have the status of the offers  */
const OffersListMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.offersList = sharedList;
  next();
};

export default OffersListMiddleware;

import { Request, Response, NextFunction } from 'express';
import { OfferStatus, Toffer, offersTypes } from '../shared/persistence/offer.persistence';

declare global {
  namespace Express {
    interface Request {
      offersList: Toffer[];
    }
  }
}

const sharedList:Toffer[] = [
    {
      "id": "ad59246f-5213-4303-8f29-e1cfe3a582ef",
      "status": OfferStatus.Pending,
      "buyerAddress": [],
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

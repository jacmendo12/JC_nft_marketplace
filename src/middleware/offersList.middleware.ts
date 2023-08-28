import { Request, Response, NextFunction } from "express";
import {
  OfferStatus,
  Toffer,
  offersTypes,
} from "../shared/persistence/offer.persistence";

declare global {
  namespace Express {
    interface Request {
      offersList: Toffer[];
    }
  }
}

const sharedList: Toffer[] = [
  {
    id: "ad59246f-5213-4303-8f29-e1cfe3a582ef",
    status: OfferStatus.Pending,
    buyerData: [
        {
        "uuid": "9e0334b2-173c-4c18-b083-5e6f7c99a13a",
        "auctionsHash": "0x5b3c471dc3f235de0ddff8b072461c31c1fb6943afa1c9d83ada31e27de11c5c",
        "auctionsValue": 1000,
        "newAuctionsValue": "1000",
        "buyerAddress": "0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9",
        "status": "Pending",
        "AproveTransactionHash": "0xbfcf2fcac88f30444b9579b147658fe6e02ed722c802469976fffa4b8f69706b"
      }
    ],
    sellerAddress: "0xe7D4Adf8ef90D2A2B5A325d02d4877533A297741",
    tokenID: 172,
    value: 1000, //1000000000000000000
    offerType: offersTypes.Auctions,
  },
];
/* middleware is used for have the status of the offers  */
const OffersListMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.offersList = sharedList;
  next();
};

export default OffersListMiddleware;

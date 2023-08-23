import { Request, Response, NextFunction } from 'express';
import { Toffer } from '../shared/persistence/offer.persistence';

declare global {
  namespace Express {
    interface Request {
      offersList: Toffer[];
    }
  }
}

const sharedList:Toffer[] = [];
/* middleware is used for have the status of the offers  */
const OffersListMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.offersList = sharedList;
  next();
};

export default OffersListMiddleware;

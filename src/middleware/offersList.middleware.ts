import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      sharedList: any[];
    }
  }
}
/* middleware is used for have the status of the offers  */
const OffersListMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.sharedList = [];
  next();
};

export default OffersListMiddleware;

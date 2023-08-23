import { Request, Response } from 'express';


export async function createOffer(req: Request, res: Response): Promise<void> {
    try {
       res.status(200).json({ message: 'Offer is created' });
    } catch (err:any ) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}

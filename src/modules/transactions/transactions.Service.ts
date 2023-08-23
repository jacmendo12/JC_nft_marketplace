import { Request, Response } from 'express';

export async function buyToken(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({ message: req.offersList });
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}

export async function aproveTransaction(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({ message: req.offersList });
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}

export async function auctions(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({ message: req.offersList });
    } catch (err: any) {
        res.status(400).json({ error: err.message || 'system error' });
    }
}
import { Request, Response } from "express";
import {
  OfferStatus,
  Toffer,
  offersTypes,
} from "../../shared/persistence/offer.persistence";
import { uuidV4 } from "web3-utils";
import { buyOfferSchema } from "./dto/offers.dto";
import { handleValidationResult } from "../../shared/utils/utils";
import * as blockchain from "../../shared/utils/blockchain";

export async function createOffer(req: Request, res: Response): Promise<void> {
  try {
    const value = buyOfferSchema.validate(req.body);
    handleValidationResult(value);

    const { tokenID, sellerAddress, offerType } = req.body;

    const token: any = {
      sellerAddress,
      tokenID
    }
    await blockchain.haveToken(token)

    /* validate if the offer are in the list */
    const tokenFind = req.offersList.find((data) => data.tokenID == tokenID);
    if (tokenFind) throw new Error("Nft is offered now");

    if (offerType == offersTypes.Buy) {
      console.log();
    }

    const newOffer: Toffer = {
      id: uuidV4(),
      status: OfferStatus.Pending,
      buyerAddress: [],
      ...req.body,
    };
    req.offersList.push(newOffer);

    res.status(200).json({ message: "successful", data: newOffer });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message || "system error" });
  }
}

export async function list_offers(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json({ message: req.offersList });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "system error" });
  }
}

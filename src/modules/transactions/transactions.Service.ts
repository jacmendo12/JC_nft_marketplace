import { Request, Response } from "express";
import {
  OfferStatus,
  TauctionData,
  Toffer,
  offersTypes,
} from "../../shared/persistence/offer.persistence";
import * as blockchain from "../../shared/utils/blockchain";
import { uuidV4 } from "web3-utils";
import { buyTokenSchema, auctionsSchema } from "./dto/transactions.dto";
import { handleValidationResult } from "../../shared/utils/utils";

export async function buyToken(req: Request, res: Response): Promise<void> {
  try {
    const value = buyTokenSchema.validate(req.body);
    handleValidationResult(value);

    const { tokenID, buyerAddress } = req.body;
    const token: Toffer = req.offersList.find(
      (data) => data.tokenID == tokenID,
    ) as Toffer;

    if (!token || token.status !== OfferStatus.Pending)
      throw new Error("token is not available");

    if (token.offerType !== offersTypes.Buy)
      throw new Error("This token is for Auctions");

    // validate if the user have founds
    const balance = await blockchain.getBalanceERC20(buyerAddress);
    await blockchain.validateFound(balance, token?.value);

    const hash = await blockchain.buyToken(token, buyerAddress);
    const index = req.offersList.findIndex((data) => data.tokenID == tokenID);
    req.offersList[index].buyerData.push({
      uuid: uuidV4(),
      buyHash: hash,
      price: token?.value,
      buyerAddress: buyerAddress,
    });
    req.offersList[index].status = OfferStatus.Accepted;

    res
      .status(200)
      .json({ message: "successful", data: req.offersList[index] });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message || "system error" });
  }
}

export async function auctions(req: Request, res: Response): Promise<void> {
  try {
    const value = auctionsSchema.validate(req.body);
    handleValidationResult(value);

    const { tokenID, buyerAddress, auctionsValue, auctionsType } = req.body;
    const token: Toffer = req.offersList.find(
      (data) => data.tokenID == tokenID,
    ) as Toffer;

    if (!token || token.status !== OfferStatus.Pending)
      throw new Error("token is not available");

    if (token.offerType !== offersTypes.Auctions)
      throw new Error("This token is for Buy");

    const balance = await blockchain.getBalanceERC20(buyerAddress);
    await blockchain.validateFound(balance, auctionsValue);
    const hash = await blockchain.auctions(
      token,
      buyerAddress,
      auctionsValue,
      auctionsType,
    );
    const newAuctionsValue = await blockchain.newAuctionsValue(buyerAddress);
    console.log(newAuctionsValue);

    const index = req.offersList.findIndex((data) => data.tokenID == tokenID);
    const indexAddress = req.offersList[index].buyerData.findIndex(
      (data: any) =>
        data.buyerAddress === buyerAddress &&
        data.status === OfferStatus.Pending,
    );
    if (indexAddress >= 0)
      req.offersList[index].buyerData[indexAddress].status =
        OfferStatus.Changed;

    req.offersList[index].buyerData.push({
      uuid: uuidV4(),
      auctionsHash: hash,
      auctionsValue: auctionsValue,
      newAuctionsValue: newAuctionsValue.toString(),
      buyerAddress: buyerAddress,
      status: OfferStatus.Pending,
    });

    // data.buyerAddress == buyerAddress
    res
      .status(200)
      .json({ message: "successful", data: req.offersList[index] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "system error" });
  }
}

export async function aproveTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { tokenID, sellerAddress, auctionId } = req.body;
    const token: Toffer = req.offersList.find(
      (data) => data.tokenID == tokenID,
    ) as Toffer;

    if (!token || token.status !== OfferStatus.Pending)
      throw new Error("token is not available");

    if (token.sellerAddress !== sellerAddress)
      throw new Error("sellerAddress is not same");

    const index = req.offersList.findIndex((data) => data.tokenID == tokenID);
    const indexAddress = req.offersList[index].buyerData.findIndex(
      (data: any) =>
        data.uuid === auctionId && data.status === OfferStatus.Pending,
    );
    console.log(indexAddress);
    if (indexAddress < 0)
      throw new Error("Error: is posible than the auctionId was wrong");
    const buyerInfo = req.offersList[index].buyerData[indexAddress];
    // const AproveTransactionHash = await blockchain.AproveTransactionERC721(token,buyerInfo.buyerAddress)
    // req.offersList[index].buyerData[indexAddress].AproveTransactionHash = AproveTransactionHash;

    const auctionData: TauctionData = {
      collectionAddress: "",
      erc20Address: "",
      tokenId: tokenID,
      bid: 500,
    };
    const buyerAddress =
      req.offersList[index].buyerData[indexAddress].buyerAddress;

    const hashFinishAuction = await blockchain.finishAuction(
      sellerAddress,
      buyerAddress,
      buyerInfo.auctionsHash,
      buyerInfo.AproveTransactionHash,
      auctionData,
    );

    console.log(hashFinishAuction);

    res
      .status(200)
      .json({ message: "successful", data: req.offersList[index] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "system error" });
  }
}

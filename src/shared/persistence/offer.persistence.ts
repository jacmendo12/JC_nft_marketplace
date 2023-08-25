export enum offersTypes {
  Buy = 'Buy',
  Auctions = 'Auctions',
}

export enum OfferStatus {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
  Changed = 'Changed',
}

export type Toffer = {
  id: string,
  sellerAddress: string,
  tokenID: number,
  value: number,
  buyerData: any,
  offerType: offersTypes,
  status: OfferStatus
};

export type TauctionData = {
  collectionAddress: string;
  erc20Address: string;
  tokenId: string ;
  bid: number;
};

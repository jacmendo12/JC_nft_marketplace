export enum offersTypes {
    Buy = 'Buy',
    Auctions = 'Auctions',
  }

export enum OfferStatus {
    Accepted = 'Accepted',
    Pending = 'Pending',
    Rejected = 'Rejected',
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
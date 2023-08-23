export enum offersTypes {
    Buy = 'Buy',
    Auctions = 'Auctions',
  }

export enum OfferStatus {
    Accepted = 'accepted',
    Pending = 'pending',
    Rejected = 'rejected',
}
  
export type Toffer = {
    id: string,
    sellerAddress: string,
    tokenID: string,
    value: string,
    buyerAddress: any,
    offerType: offersTypes,
    status: OfferStatus
  };
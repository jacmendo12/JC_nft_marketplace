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
    buyerId: string,
    tokenId: string,
    amount: string,
    buyerAddress: string,
    offerType: offersTypes,
    status: OfferStatus
  };
  
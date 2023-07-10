export interface Auction {
    id: number;
    amount: number;
    startTime: number;
    endTime: number;
    durationIncreaseInSecondsPerBid: number;
    highestBid: number;
    highestBidder: string;
    ended: boolean;
}


export interface BidPlacedEvent {
    auctionId: number;
    amount: number;
    timestamp: number;
    bidder: string;
}

export enum AuctionEvents {
    AuctionCreated = 'AuctionCreated',
    BidPlaced = 'BidPlaced',
}
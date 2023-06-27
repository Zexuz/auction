export interface Auction {
    id: number;
    startTime: number;
    endTime: number;
    durationIncreaseInSecondsPerBid: number;
    highestBid: number;
    highestBidder: string;
    ended: boolean;
}
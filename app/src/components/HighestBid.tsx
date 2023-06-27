import {useAuctionId} from "@/hooks/useAuctionId";
import {useGetAuction} from "@/hooks/useGetAuction";

export function HighestBid() {
    const {data: auctionId} = useAuctionId();
    const {data: auction, isLoading} = useGetAuction(auctionId);

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <>
            <p>winning: {auction.highestBidder}</p>
            <p>CurrentBid: {auction.highestBid} ETH</p>
        </>
    )
}
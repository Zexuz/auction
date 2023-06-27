import {useAuction} from "@/context/AuctionContext";
import {parseEther, parseGwei, formatGwei, formatUnits} from "viem";

export function HighestBid() {
    const {auction, isLoading} = useAuction();

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <>
            <p>winning: {auction.highestBidder}</p>
            <p>CurrentBid: {formatUnits(BigInt(auction.highestBid), 18)} ETH</p>
        </>
    )
}
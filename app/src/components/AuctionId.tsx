import {useAuction} from "@/context/AuctionContext";

export function AuctionId() {
    const {auction, isLoading} = useAuction()

    if (isLoading) {
        return <h1>loading...</h1>
    }

    if (!auction) {
        return <h1>data is null</h1>
    }

    return (
        <h1>The current auctionId is: {auction.id}</h1>
    )
}
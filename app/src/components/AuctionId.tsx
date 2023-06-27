import {useAuctionId} from "@/hooks/useAuctionId";

export function AuctionId() {
    const {data, isLoading} = useAuctionId()

    if (isLoading) {
        return <h1>loading...</h1>
    }

    if (!data) {
        return <h1>data is null</h1>
    }


    return (
        <h1>The current auctionId is: {data}</h1>
    )
}
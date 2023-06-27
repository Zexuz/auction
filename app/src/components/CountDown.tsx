import {useAuctionId} from "@/hooks/useAuctionId";
import {useGetAuction} from "@/hooks/useGetAuction";
import {useState} from "react";
import {useInterval} from "@/hooks/useInterval";

export function CountDownParent() {
    const {data: auctionId} = useAuctionId();
    const {data: auction, isLoading} = useGetAuction(auctionId);


    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <CountDown endTime={auction.endTime} startTime={auction.startTime}/>
    )
}

function CountDown({endTime, startTime}: { endTime: number, startTime: number }) {
    const {data: auctionId} = useAuctionId();
    const {data: auction, isLoading} = useGetAuction(auctionId);

    const timeLeft = endTime - Math.floor(Date.now() / 1000);

    const [countdown, setCountdown] = useState(timeLeft);
    useInterval(() => setCountdown(countdown - 1), 1000)


    if(countdown < 0) {
        return <p>Ended</p>
    }

    return (
        <p>Time-left: {countdown}</p>
    )
}
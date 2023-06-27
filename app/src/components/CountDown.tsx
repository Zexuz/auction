import {useAuctionId} from "@/hooks/useAuctionId";
import {useState} from "react";
import {useInterval} from "@/hooks/useInterval";
import {useAuction} from "@/context/AuctionContext";

export function CountDownParent() {
    const {auction, isLoading} = useAuction();

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <CountDown endTime={auction.endTime}/>
    )
}

function CountDown({endTime}: { endTime: number }) {
    const timeLeft = endTime - Math.floor(Date.now() / 1000);

    const [countdown, setCountdown] = useState(timeLeft);
    useInterval(() => setCountdown(countdown - 1), 1000)


    if (countdown < 0) {
        return <p>Ended</p>
    }

    return (
        <p>Time-left: {countdown}</p>
    )
}
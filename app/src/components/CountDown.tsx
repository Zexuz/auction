import {useState} from "react";
import {useInterval} from "@/hooks/useInterval";
import {useAuction} from "@/context/AuctionContext";
import {Typography} from "@mui/material";

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
        //TODO, show action to settle auction and start new one
        return <p>Ended</p>
    }

    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = Math.floor((countdown % 3600) % 60);

    return (
        <Typography variant="h4" component="h1" gutterBottom>
            {hours}:{minutes}:{seconds}
        </Typography>
    )
}
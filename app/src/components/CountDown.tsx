import {useState} from "react";
import {useInterval} from "@/hooks/useInterval";
import {useAuction} from "@/context/AuctionContext";
import {Button, Typography} from "@mui/material";
import {useContractWrite, useWaitForTransaction} from "wagmi";
import {getAuctionContractConfig} from "@/contracts";

export function CountDownParent() {
    const {auction, isLoading} = useAuction();

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <CountDown endTime={auction.endTime} auctionId={auction.id}/>
    )
}

interface CountDownProps {
    endTime: number
    auctionId: number
}

function CountDown({endTime, auctionId}: CountDownProps) {
    const timeLeft = endTime - Math.floor(Date.now() / 1000);

    const [countdown, setCountdown] = useState(timeLeft);
    useInterval(() => setCountdown(countdown - 1), 1000)

    const {write, data, error, isLoading, isError} = useContractWrite({
        ...getAuctionContractConfig(),
        functionName: 'settle',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({hash: data?.hash})


    const settle = () => {
        write({
            args: [BigInt(auctionId)],
        });
    }


    if (countdown < 0) {
        //TODO, show action to settle auction and start new one
        return (
            <>
                <Typography variant="h6" component="h3" gutterBottom>
                    Auction ends in
                </Typography>
                <Button variant="contained" color="primary" onClick={settle}>Settle</Button>
            </>

        )
    }

    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = Math.floor((countdown % 3600) % 60);

    const secondsString = seconds < 10 ? `0${seconds}` : seconds;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const hoursString = hours < 10 ? `0${hours}` : hours;

    return (
        <>
            <Typography variant="h6" component="h3" gutterBottom>
                Auction ends in
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom>
                {hoursString}h {minutesString}m {secondsString}s
            </Typography>
        </>
    )
}
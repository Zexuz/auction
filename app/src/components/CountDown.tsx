import {useEffect, useState} from "react";
import {useInterval} from "@/hooks/useInterval";
import {Typography} from "@mui/material";
import {Auction} from "@/types/Auction";


interface CountDownProps {
    auction: Auction,
    setHasEnded: (hasEnded: boolean) => void
}

export function CountDown({auction, setHasEnded}: CountDownProps) {
    const {endTime} = auction;

    const timeLeft = endTime - Math.floor(Date.now() / 1000);

    const [countdown, setCountdown] = useState(timeLeft);
    useInterval(() => setCountdown(countdown - 1), 1000)


    const hasEnded = countdown < 0;
    useEffect(() => {
        if (hasEnded)
            setHasEnded(true)
    }, [hasEnded])

    if (hasEnded) {
        return (
            <>
                <Typography variant="h6" component="h3" gutterBottom>
                    Auction ends in
                </Typography>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ended
                </Typography>
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
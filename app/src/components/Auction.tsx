"use client"
import {useEffect, useLayoutEffect, useRef, useState} from "react";

export const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.
        if (!delay && delay !== 0) {
            return
        }

        const id = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(id)
    }, [delay])
}

function CountDown() {
    const endTime = new Date(Date.now() + 60 * 60);
    const timeLeft = endTime.getTime() - Date.now();

    const [countdown, setCountdown] = useState(timeLeft);
    useInterval(() => setCountdown(countdown - 1), 1000)

    return (
        <p>Timeleft: {countdown}</p>
    )
}

function HighestBid() {
    const address = "0x....."

    return(
        <>winning: {address}</>
    )
}

export default function Auction() {
    const currentBid = 1.24;

    return (
        <>
            <section className="text-center">
                <div>
                    <AuctionId/>
                    <CountDown/>
                    <HighestBid/>
                    <h1> Current bid: {currentBid} ETH</h1>
                    <Bid/>
                </div>
            </section>
        </>
    )
}

function AuctionId() {
    const currentAuctionId = 1337;


    return (
        <h1>The current acutionId is: {currentAuctionId}</h1>
    )
}

function Bid() {
    const [bid, setBid] = useState<string>("0")
    const [isValueValid, setIsValueValid] = useState<boolean>(false)

    const onSubmit = () => {
        if (!isValueValid) {
            //TODO: show error
            return;
        }
        console.log(`Setting bid to ${bid}, isValueValid: ${isValueValid}`)
    }

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const valueAsNumber = Number(value)
        if (isNaN(valueAsNumber)) {
            setIsValueValid(false)
            return
        }
        setIsValueValid(true)
        setBid(value)
    }

    return (
        <>
            <input type="text" onChange={onValueChange}/>
            <button onClick={onSubmit}>Bid</button>
        </>
    );
}
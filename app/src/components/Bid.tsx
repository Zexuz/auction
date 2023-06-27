import React, {useState} from "react";
import {getAuctionContractConfig} from "@/contracts";
import {useContractWrite, useWaitForTransaction} from "wagmi";
import {parseEther} from "viem"
import {useAuction} from "@/context/AuctionContext";
import {Auction} from "@/types/Auction";

export function BidParent() {
    const {auction, isLoading} = useAuction();
    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <Bid auction={auction}/>
    )
}

interface BidProps {
    auction: Auction
}

function Bid({auction}: BidProps) {
    const {write, data, error, isLoading, isError} = useContractWrite({
        ...getAuctionContractConfig(),
        functionName: 'bid',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({hash: data?.hash})


    const [bid, setBid] = useState<string>("0")
    const [isValueValid, setIsValueValid] = useState<boolean>(false)

    const onSubmit = () => {
        if (!isValueValid) {
            //TODO: show error
            return;
        }

        write({
            args: [BigInt(auction.id)],
            value: parseEther(`${Number(bid)}`),
        });
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


    const isDisabled = isLoading || isPending || isError || !isValueValid
    const text = isLoading ? "Check wallet..." : isPending ? "Pending..." : isError ? "Error" : "Bid"

    return (
        <>
            <input type="text" onChange={onValueChange} style={{color: "red"}}/>
            <button disabled={isDisabled} onClick={onSubmit}>{text}</button>
        </>
    );
}
"use client"
import Auction from "@/components/Auction";
import {useAuction} from "@/context/AuctionContext";
import React from "react";


export default function Page() {
    const {auction, isLoading, setHasEnded} = useAuction();

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    console.log(`auction: ${JSON.stringify(auction)}`)


    return (<Auction auction={auction} setHasEnded={setHasEnded} hasEnded={auction.ended}/>)
}
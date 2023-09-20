"use client"
import React from "react";
import {useGetAuction} from "@/hooks/useGetAuction";
import Auction from "@/components/Auction";

interface PageProps {
    params: {
        id: string
    }
}

export default function Page({params}: PageProps) {
    const auctionId = Number(params.id);
    const {data: auction, isLoading} = useGetAuction(auctionId);

    if (isNaN(auctionId) || auctionId < 0) {
        return <p>Invalid auction id</p>
    }

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    if (!auction.id) {
        return <p>auction id is null</p>
    }

    return (<Auction auction={auction} setHasEnded={() => true} hasEnded={auction.ended}/>)
};
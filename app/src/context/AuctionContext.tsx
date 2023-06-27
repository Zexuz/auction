'use client'

import React from 'react'

import {Auction, AuctionEvents, BidPlacedEvent} from "@/types/Auction";
import {useAuctionId} from "@/hooks/useAuctionId";
import {useGetAuction} from "@/hooks/useGetAuction";
import {useAuctionEvent} from "@/hooks/useContractEvent";

interface AuctionContextProps {
    auction: Auction,
    isLoading?: boolean
}

const defaultAuction: Auction = {
    id: 0,
    startTime: 0,
    endTime: 0,
    highestBid: 0,
    ended: false,
    durationIncreaseInSecondsPerBid: 0,
    highestBidder: ''
}


const AuctionContext = React.createContext<AuctionContextProps>({
    auction: defaultAuction,
    isLoading: true
})


interface AuctionProviderProps {
    children: React.ReactNode
}

export const AuctionProvider = ({children}: AuctionProviderProps) => {
    const {data: auctionId} = useAuctionId();
    const {data: auction, isLoading,} = useGetAuction(auctionId);

    useAuctionEvent<BidPlacedEvent>(AuctionEvents.BidPlaced, (event) => {
        try {
            console.log(`BidPlaced: ${JSON.stringify(event)}`);
        } catch (e) {
            console.log(`in event: ${e}`);
        }
    });


    const value: AuctionContextProps = {
        auction: auction || defaultAuction,
        isLoading: isLoading
    }

    return (
        <AuctionContext.Provider value={value}>
            {children}
        </AuctionContext.Provider>
    )
};

export const useAuction = () => {
    return React.useContext(AuctionContext);
}

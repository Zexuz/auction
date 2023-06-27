"use client"
import {AuctionId} from "@/components/AuctionId";
import {HighestBid} from "@/components/HighestBid";
import {CountDownParent} from "@/components/CountDown";
import {BidParent} from "@/components/Bid";


export default function Auction() {
    const currentBid = 1.24;

    return (
        <>
            <section className="text-center">
                <div>
                    <AuctionId/>
                    <CountDownParent/>
                    <HighestBid/>
                    <BidParent/>
                </div>
            </section>
        </>
    )
}



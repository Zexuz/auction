"use client"
import {AuctionId} from "@/components/AuctionId";
import {HighestBid} from "@/components/HighestBid";
import {CountDownParent} from "@/components/CountDown";
import {BidParent} from "@/components/Bid";
import {useAccount, useConnect} from "wagmi";


export default function Auction() {
    const {status} = useAccount()

    if (status !== 'connected') {
        return (
            <>
                <section className="text-center">
                    <div>
                        <p>Connect to a wallet to view the auction</p>
                    </div>
                </section>
            </>
        )
    }

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



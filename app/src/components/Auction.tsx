"use client"
import {AuctionId} from "@/components/AuctionId";
import {DisplayEth, HighestBid} from "@/components/HighestBid";
import {CountDownParent} from "@/components/CountDown";
import {BidParent} from "@/components/Bid";
import {useAccount} from "wagmi";
import {Centered} from "@/components/Centered";
import {Box, Container, Grid, Typography} from "@mui/material";
import {useAuction} from "@/context/AuctionContext";
import React from "react";
import {useGetBidsForAuction} from "@/hooks/useGetBids";
import {AddressWithPicture} from "@/components/AddressWithPicture";


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
            <Container>
                <Centered>
                    <AuctionId/>
                </Centered>
                <Centered>

                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <HighestBid/>
                        </Grid>
                        <Grid item style={{borderRight: '1px solid #ccc'}}>
                            <Box sx={{paddingRight: '1rem'}}/>
                        </Grid>
                        <Grid item>
                            <Box sx={{paddingLeft: '1rem'}}/>
                        </Grid>
                        <Grid item>
                            <CountDownParent/>
                        </Grid>
                    </Grid>
                </Centered>
                <Centered>
                    <BidParent/>
                </Centered>
                <Centered>
                    <Bets/>
                </Centered>
            </Container>
        </>
    );
}


function Bets() {
    const {auction, isLoading} = useAuction();
    const {data: bids, isLoading: isLoadingBids} = useGetBidsForAuction(auction?.id)

    if (isLoading || isLoadingBids) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    console.log(`bids: ${bids}`)

    if (!bids) {
        return <p>There are no bids yet, why not ape in?</p>
    }

    const bidsSorted = bids.sort((a, b) => b.timestamp - a.timestamp)

    return (
        <Grid container direction="column" spacing={2}>
            {bidsSorted.map((bid, index) => (
                <Bid key={index} bid={bid}/>
            ))}
        </Grid>
    )
}

const Bid = ({bid}: { bid: any }) => {
    return (
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <DisplayEth amount={bid.amount} size={'small'}/>
                    </Grid>
                    <Grid item>
                        <AddressWithPicture address={bid.bidder}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Timestamp timestamp={bid.timestamp}/>
            </Grid>
        </Grid>
    )
}

const Timestamp = ({timestamp}: { timestamp: number }) => {
    const date = new Date(timestamp * 1000)
    return (
        <>
            <Typography component={'h1'} gutterBottom>
                {date.toLocaleTimeString()}
            </Typography>
        </>
    )
}



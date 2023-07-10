"use client"
import {DisplayEth, HighestBid} from "@/components/HighestBid";
import {CountDownParent} from "@/components/CountDown";
import {BidParent} from "@/components/Bid";
import {Box, Button, Container, Grid, IconButton, Paper, Stack, Typography} from "@mui/material";
import {useAuction} from "@/context/AuctionContext";
import React from "react";
import {useGetBidsForAuction} from "@/hooks/useGetBids";
import {AddressWithPicture} from "@/components/AddressWithPicture";
import {useContractWrite, useWaitForTransaction} from "wagmi";
import {getAuctionContractConfig} from "@/contracts";
import {Centered} from "@/components/Centered";
import {ArrowBack, ArrowForward, Fingerprint} from "@mui/icons-material";


export default function Auction() {
    const {auction, isLoading} = useAuction();

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    return (
        <>
            <Container maxWidth="md">
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Typography variant="h4" component="h1">
                                Auction: #{auction.id}
                            </Typography>

                            <IconButton aria-label="ArrowBack" color="primary" >
                                <ArrowBack/>
                            </IconButton>
                            <IconButton aria-label="ArrowForward" color="primary">
                                <ArrowForward/>
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <DisplayEth amount={auction.amount} size={"large"} showHeader={true}
                                            header={"Auction Amount"}/>
                            </Grid>
                            <Grid item style={{borderRight: '1px solid #ccc'}}>
                                <Box sx={{paddingRight: '1rem'}}/>
                            </Grid>
                            <Grid item>
                                <Box sx={{paddingLeft: '1rem'}}/>
                            </Grid>
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
                    </Grid>
                    <Grid item xs={12}>
                        <BidParent/>
                    </Grid>
                    <Grid item xs={12}>
                        <Bets/>
                    </Grid>
                </Grid>
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
        <Grid container direction="column">
            {bidsSorted.map((bid, index) => (
                <Bid key={index} bid={bid}/>
            ))}
        </Grid>
    )
}

const Bid = ({bid}: { bid: any }) => {
    return (
        <Grid container alignItems="center" justifyContent="space-between" style={{borderBottom: '1px solid #ccc'}}>
            <Grid item>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <AddressWithPicture address={bid.bidder}/>
                    </Grid>
                    <Grid item>
                        <DisplayEth amount={bid.amount} size={'small'}/>
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



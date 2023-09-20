"use client"
import {DisplayEth, HighestBid} from "@/components/HighestBid";
import {CountDown} from "@/components/CountDown";
import {BidParent} from "@/components/Bid";
import {Box, Container, Grid, IconButton, Stack, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {useGetBidsForAuction} from "@/hooks/useGetBids";
import {AddressWithPicture} from "@/components/AddressWithPicture";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {Auction} from "@/types/Auction";
import {useRouter} from "next/navigation";

interface AuctionProps {
    auction: Auction
    hasEnded: boolean
    setHasEnded: (hasEnded: boolean) => void
}

export default function Auction({auction, setHasEnded, hasEnded}: AuctionProps) {
    const router = useRouter();

    useEffect(() => {
        router.prefetch(`/${auction.id + 1}`);
        router.prefetch(`/${auction.id - 1}`);
    }, [auction.id]);

    const shouldSettle = auction.endTime < Date.now() / 1000;

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

                            <IconButton aria-label="ArrowBack" color="primary" onClick={() => {
                                router.push(`/${auction.id - 1}`);
                            }}>
                                <ArrowBack/>
                            </IconButton>
                            <IconButton aria-label="ArrowForward" color="primary" onClick={() => {
                                router.push(`/${auction.id + 1}`, {});
                            }}>
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
                                <HighestBid auction={auction}/>
                            </Grid>
                            <Grid item style={{borderRight: '1px solid #ccc'}}>
                                <Box sx={{paddingRight: '1rem'}}/>
                            </Grid>
                            <Grid item>
                                <Box sx={{paddingLeft: '1rem'}}/>
                            </Grid>
                            <Grid item>
                                <CountDown auction={auction} setHasEnded={setHasEnded}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <BidParent auction={auction} hasEnded={hasEnded} shouldSettle={shouldSettle}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Bets auction={auction}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}


interface BetsProps {
    auction: Auction
}

function Bets({auction}: BetsProps) {
    const {data: bids, isLoading: isLoadingBids} = useGetBidsForAuction(auction?.id)

    if (isLoadingBids) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

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



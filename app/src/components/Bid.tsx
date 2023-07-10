import React, {useState} from "react";
import {getAuctionContractConfig} from "@/contracts";
import {useAccount, useContractWrite, useWaitForTransaction} from "wagmi";
import {formatUnits, parseEther} from "viem"
import {useAuction} from "@/context/AuctionContext";
import {Auction} from "@/types/Auction";
import {Box, Button, Grid, Input, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {useGetBidsForAuction} from "@/hooks/useGetBids";


interface BidPropsParents {
    auction: Auction
    hasEnded: boolean
    shouldSettle: boolean
}

export function BidParent({auction, hasEnded, shouldSettle}: BidPropsParents) {

    if (hasEnded) {
        // TODO: Show the winner?
        // And the re-claim button for the user to withdraw their funds
        return <p>Auction has ended</p>
    }

    if (shouldSettle) {
        return <Settle/>
    }

    return (
        <Bid auction={auction}/>
    )
}


const Settle = () => {
    const {auction} = useAuction();
    const {write, data, error, isLoading, isError} = useContractWrite({
        ...getAuctionContractConfig(),
        functionName: 'settle',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({hash: data?.hash})


    const settle = () => {
        write({
            args: [BigInt(auction.id)],
        });
    }


    return (
        <Button variant="contained" color="primary" fullWidth onClick={settle}>Settle</Button>
    )
}

interface BidProps {
    auction: Auction
}

function Bid({auction}: BidProps) {
    const {address} = useAccount()
    const {data: bids, isLoading: isLoadingBids} = useGetBidsForAuction(auction?.id)

    const {write, data, error, isLoading, isError} = useContractWrite({
        ...getAuctionContractConfig(),
        functionName: 'bid',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({hash: data?.hash})


    const [bid, setBid] = useState<string>("")
    const [isValueValid, setIsValueValid] = useState<boolean>(false)

    const onSubmit = () => {
        if (!isValueValid) {
            //TODO: show error
            return;
        }

        const value = parseEther(`${Number(bid)}`) - BigInt(myLastBid)
        write({
            args: [BigInt(auction.id)],
            value: value,
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

    const formatValue = (value: number) => {
        return parseFloat(formatUnits(BigInt(value), 18));
    }

    const myLastBid = bids?.filter(bid => bid.bidder == address)?.sort((a, b) => b.amount - a.amount)?.[0]?.amount || 0

    const isDisabled = isLoading || isPending || isError || !isValueValid
    const text = isLoading ? "Check wallet..." : isPending ? "Pending..." : isError ? "Error" : "Place bid"

    const placeHolder = `Increase to Ξ ${(formatValue(auction.highestBid) * 1.02).toFixed(2)} or more`;

    const inputProps = {} as any

    if (myLastBid > 0) {
        inputProps.endAdornment =
            <InputAdornment position="end">
                {(parseFloat(bid.length == 0 ? "0" : bid) - formatValue(myLastBid)).toFixed(2)} Ξ
            </InputAdornment>
    }

    return (
        <Stack>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={10}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={bid}
                        onChange={onValueChange}
                        placeholder={placeHolder}
                        InputProps={inputProps}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        color="primary"
                        fullWidth
                        variant="contained"
                        disabled={isDisabled}
                        onClick={onSubmit}
                    >
                        {text}
                    </Button>
                </Grid>
            </Grid>
        </Stack>
    );
}


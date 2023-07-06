import {useAuction} from "@/context/AuctionContext";
import {Grid, Tooltip, Typography} from "@mui/material";
import React from "react";
import {formatUnits} from "viem";

export function HighestBid() {
    const {auction, isLoading} = useAuction();

    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auction) {
        return <p>auction is null</p>
    }

    const {highestBid} = auction;


    return <DisplayEth amount={highestBid} size={'large'} showHeader={true}/>
}


interface DisplayFormattedEthProps {
    amount: number;
    size: 'small' | 'large'
    showHeader?: boolean;
}

export const DisplayEth = ({amount, size, showHeader}: DisplayFormattedEthProps) => {
    const formattedHighestBidRaw = formatUnits(BigInt(amount), 18);
    const formattedHighestBid = parseFloat(formattedHighestBidRaw).toFixed(2);

    const typographyVariant = size === 'small' ? undefined : 'h4';
    const typographyComponent = size === 'small' ? 'h1' : 'h1';


    return (
        <>
            {(showHeader &&
                <Typography variant="h6" component="h3" gutterBottom>
                    Highest bid
                </Typography>
            )}
            <Tooltip title={formattedHighestBidRaw} placement="top">
                <Typography variant={typographyVariant} component={typographyComponent} gutterBottom>
                    Ξ {formattedHighestBid}
                </Typography>
            </Tooltip>
        </>
    );
}



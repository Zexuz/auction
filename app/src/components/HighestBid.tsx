import {Tooltip, Typography} from "@mui/material";
import React from "react";
import {formatUnits} from "viem";
import {Auction} from "@/types/Auction";


interface HighestBidProps {
    auction: Auction
}

export function HighestBid({auction}: HighestBidProps) {
    const {highestBid} = auction;
    return <DisplayEth amount={highestBid} size={'large'} showHeader={true}/>
}


interface DisplayFormattedEthProps {
    amount: number;
    size: 'small' | 'large'
    showHeader?: boolean;
    header?: string;
}

export const DisplayEth = ({amount, size, showHeader, header = 'Highest bid'}: DisplayFormattedEthProps) => {
    const formattedHighestBidRaw = formatUnits(BigInt(amount), 18);
    const formattedHighestBid = parseFloat(formattedHighestBidRaw).toFixed(2);

    const typographyVariant = size === 'small' ? undefined : 'h4';
    const typographyComponent = size === 'small' ? 'h1' : 'h1';


    return (
        <>
            {(showHeader &&
                <Typography variant="h6" component="h3" gutterBottom>{header}</Typography>
            )}
            <Tooltip title={formattedHighestBidRaw} placement="top">
                <Typography variant={typographyVariant} component={typographyComponent}>
                    Ξ {formattedHighestBid}
                </Typography>
            </Tooltip>
        </>
    );
}



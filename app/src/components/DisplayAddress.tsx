import React from "react";
import {Typography} from "@mui/material";

interface DisplayAddressProps {
    address: string;
}

export const DisplayAddress = ({address}: DisplayAddressProps) => {
    const shortAddress = address.slice(0, 6) + "..." + address.slice(-4)

    return (
        <Typography component={'h1'} fontFamily="monospace" color="text.secondary">
            {shortAddress}
        </Typography>
    )
};
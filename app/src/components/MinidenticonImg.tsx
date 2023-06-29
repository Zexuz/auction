// @ts-ignore
import React, {useMemo} from "react";
import {minidenticon} from "minidenticons";
import {Typography} from "@mui/material";

interface MinidentIconImgProps {
    address: string;
}

export const MinidenticonImg = ({address}: MinidentIconImgProps) => {
    const saturation = 100;
    const lightness = 50;

    const props = {
        height: 32,
        width: 32,
    }

    const memoFunc = () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(address, saturation, lightness))

    const svgURI = useMemo(memoFunc, [address])
    return (
        <Typography component={'h1'} gutterBottom>
            <img src={svgURI} alt={address} {...props} />
        </Typography>
    )
}
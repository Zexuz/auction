import {Grid} from "@mui/material";
import {MinidenticonImg} from "@/components/MinidenticonImg";
import {DisplayAddress} from "@/components/DisplayAddress";
import React from "react";

interface AddressWithPictureProps {
    address: string;
}


export const AddressWithPicture = ({address}: AddressWithPictureProps) => (
    <Grid container spacing={1} alignItems="center">
        <Grid item>
            <MinidenticonImg address={address}/>
        </Grid>
        <Grid item>
            <DisplayAddress address={address}/>
        </Grid>
    </Grid>
);
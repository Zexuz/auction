'use client'

import {useAccount, useConnect, useDisconnect} from 'wagmi';
import {Button, Box} from "@mui/material";
import {BaseError} from "viem";

export function Disconnect() {
    const {connector, isConnected} = useAccount()
    const {disconnect} = useDisconnect()

    if (!isConnected) return <></>

}


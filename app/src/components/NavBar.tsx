'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {useAccount, useDisconnect} from "wagmi";
import {AddressWithPicture} from "@/components/AddressWithPicture";

function ResponsiveAppBar() {
    const {connector, isConnected, address} = useAccount()
    const {disconnect} = useDisconnect()


    return (
        <AppBar position="static" sx={{backgroundColor: '#ffffff', boxShadow: 'none'}}>
            <Toolbar>
                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}/>
                <Box sx={{flexGrow: 0, paddingRight: '1rem'}}>
                    {address && (
                        <AddressWithPicture address={address.toString()}/>
                    )}
                </Box>
                <Box sx={{flexGrow: 0}}>
                    {isConnected && (
                        <Button
                            variant="contained"
                            onClick={() => disconnect()}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Disconnect from {connector?.name}
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default ResponsiveAppBar;
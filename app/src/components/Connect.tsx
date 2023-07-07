'use client'

import {useAccount, useConnect, useDisconnect} from 'wagmi';
import {Button, Box} from "@mui/material";
import {BaseError} from "viem";

export function Connect() {
    const {connector, isConnected} = useAccount()
    const {connect, connectors, error, isLoading, pendingConnector} = useConnect()
    const {disconnect} = useDisconnect()

    if (isConnected) return (<></>);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
            >
                {isConnected && (
                    <Button onClick={() => disconnect()}>
                        Disconnect from {connector?.name}
                    </Button>
                )}

                {connectors
                    .filter((x) => x.ready && x.id !== connector?.id)
                    .map((x) => (
                        <Button key={x.id} onClick={() => connect({connector: x})}>
                            {x.name}
                            {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
                        </Button>
                    ))}
            </Box>

            {error && <Box mt={2}>{(error as BaseError).shortMessage}</Box>}
        </Box>
    );
}


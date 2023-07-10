'use client'

import * as React from 'react'
import {WagmiConfig} from 'wagmi'

import {config} from '@/wagmi'
import {AuctionProvider} from "@/context/AuctionContext";

export function Providers({children}: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    return (
        <>
            <WagmiConfig config={config}>
                {mounted && (
                    <AuctionProvider>
                        {children}
                    </AuctionProvider>
                )}
            </WagmiConfig>
        </>
    )
}

import {configureChains, createConfig} from 'wagmi'
import {goerli, mainnet, localhost, sepolia} from 'wagmi/chains'
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet'
import {InjectedConnector} from 'wagmi/connectors/injected'
import {MetaMaskConnector} from 'wagmi/connectors/metaMask'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'

import {publicProvider} from 'wagmi/providers/public'
import {jsonRpcProvider} from 'wagmi/providers/jsonRpc'
import {infuraProvider} from 'wagmi/providers/infura'

const walletConnectProjectId = 'f7a76a6cd8d06210590571118dbb2448'


const getConfig = () => {
    if (process.env.NEXT_PUBLIC_NETWORK === 'sepolia') {

        const key = process.env.NEXT_PUBLIC_INFURA_API_KEY
        if (!key) {
            throw new Error('Missing NEXT_PUBLIC_INFURA_API_KEY')
        }

        return configureChains(
            [sepolia],
            [
                infuraProvider({
                    apiKey: key,
                })
            ],
        )
    }

    return configureChains(
        // [mainnet, ...(process.env.NODE_ENV === 'development' ? [goerli] : [])],
        [localhost],
        [
            jsonRpcProvider({
                rpc: (chain) => ({
                    http: `http://localhost:8545`,
                    webSocket: `ws://localhost:8545`,
                }),
            }),
        ],
    );
}

const {chains, publicClient, webSocketPublicClient} = getConfig()
export const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({chains}),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'wagmi',
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: walletConnectProjectId,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
    publicClient,
    webSocketPublicClient,
})

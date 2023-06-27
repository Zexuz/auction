import {useContractEvent as _useContractEvent} from "wagmi";
import {AuctionEvents, BidPlacedEvent} from "@/types/Auction";
import {getAuctionContractConfig} from "@/contracts";
import {decodeEventLog} from 'viem'


type AEvents = BidPlacedEvent;

type Callback<T extends AEvents> = (event: T) => void

export function useAuctionEvent<T extends AEvents>(eventName: AuctionEvents, callback: Callback<T>) {
    return _useContractEvent({
        ...getAuctionContractConfig(),
        eventName: eventName,
        listener: (logs: any[]) => {
            for (let log of logs) {
                try {
                    const param = {
                        abi: getAuctionContractConfig().abi,
                        data: log.data as `0x${string}`,
                        topics: log.topics as any,
                    }

                    const decoded = decodeEventLog(param)

                    const event = transformEvent<T>(eventName, decoded.args);

                    callback(event)
                } catch (e) {
                    // TODO: handle error
                    console.log(`${e}`);
                }
            }
        },
    })
}


function transformEvent<T extends AEvents>(eventName: AuctionEvents, data: any): T {
    switch (eventName) {
        case AuctionEvents.AuctionCreated:
            throw new Error(`Not implemented yet`)
        case AuctionEvents.BidPlaced:
            //@ts-ignore
            return {
                amount: Number(data.amount),
                auctionId: Number(data.auctionId),
                bidder: data.bidder,
                timestamp: Number(data.timestamp),
            } as BidPlacedEvent;
        default:
            throw new Error(`Unknown event name: ${eventName}`)

    }
}


import {useContractRead} from "wagmi";
import {getAuctionContractConfig} from "@/contracts";

interface Bid {
    bidder: string;
    amount: number;
    timestamp: number;
}

export const useGetBidsForAuction = (auctionId: number | undefined) => {
    const config = getAuctionContractConfig();
    return useContractRead<typeof config.abi, 'getBidsForAuction', Bid[]>({
        ...config,
        functionName: 'getBidsForAuction',
        args: [auctionId],
        enabled: !!auctionId,
        select: (data: any) => {

            return data.map((bid: Bid) => ({
                bidder: bid.bidder as string,
                amount: Number(bid.amount),
                timestamp: Number(bid.timestamp),
            } as Bid))
        },
        watch: true,
        cacheTime: 2_000
    })

};


const useGetBidForAuction = (auctionId: number | undefined, bidder: string | undefined) => {
    return useContractRead({
        ...getAuctionContractConfig(),
        functionName: 'getBidForAuction',
        args: [auctionId, bidder],
        enabled: !!auctionId && !!bidder,
        select: (data: any) => {
            return {
                bidder: data.bidder as string,
                amount: Number(data.amount),
                timestamp: Number(data.timestamp),
            }
        },
        watch: true,
        cacheTime: 2_000
    })
}


const useGetBidsKeyForAuction = (auctionId: number | undefined) => {
    return useContractRead({
        ...getAuctionContractConfig(),
        functionName: 'getBidsKeyForAuction',
        args: [auctionId],
        enabled: !!auctionId,
        select: (data: any) => {
            return {
                bids: data.bids.map((address: string) => {
                    return {
                        address,
                    }
                })
            }
        },
        watch: true,
        cacheTime: 2_000
    })
}
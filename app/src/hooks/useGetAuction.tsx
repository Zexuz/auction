import {useContractRead} from "wagmi";
import {getAuctionContractConfig} from "@/contracts";
import {Auction} from "@/types/Auction";

export const useGetAuction = (auctionId: number | undefined) => {
    return useContractRead({
        ...getAuctionContractConfig(),
        functionName: 'getAuction',
        args: [auctionId],
        enabled: !!auctionId,
        select: (data: any): Auction => {
            return {
                id: Number(data.id),
                startTime: Number(data.startTime),
                endTime: Number(data.endTime),
                durationIncreaseInSecondsPerBid: Number(data.durationIncreaseInSecondsPerBid),
                highestBid: Number(data.highestBid),
                highestBidder: data.highestBidder as string,
                ended: data.ended as boolean,
            }
        },
        watch: true,
        cacheTime: 2_000
    })
}


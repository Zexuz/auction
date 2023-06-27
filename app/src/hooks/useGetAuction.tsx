import {useContractRead} from "wagmi";
import {getAuctionContractConfig} from "@/contracts";

export const useGetAuction = (auctionId: number | undefined) => {
    return useContractRead({
        ...getAuctionContractConfig(),
        functionName: 'getAuction',
        args: [auctionId],
        enabled: !!auctionId,
        select: (data: any) => ({
            auctionId: Number(data.auctionId),
            startTime: Number(data.startTime),
            endTime: Number(data.endTime),
            durationIncreaseInSecondsPerBid: Number(data.durationIncreaseInSecondsPerBid),
            highestBid: Number(data.highestBid),
            highestBidder: data.highestBidder as string,
            ended: data.ended as boolean,
        })
    })
}
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

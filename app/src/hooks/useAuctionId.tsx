import {useContractRead} from "wagmi";
import {getAuctionContractConfig} from "@/contracts";

export const useAuctionId = () => {
    return useContractRead({
        ...getAuctionContractConfig(),
        functionName: 'getAuctionId',
        select: (data) => Number(data),
        watch: true,
        cacheTime: 2_000
    })
}